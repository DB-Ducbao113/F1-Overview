import { useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import {
  assemblyWeight,
  componentWeight,
  isMotionPart,
  poseFromOrigin,
  type Vec3,
} from '../domain/assemblyMotion';

/**
 * Offsets are in the original Blender authoring coordinate system (+Z up).
 * assemblyMotion.ts handles conversion to glTF (+Y up).
 */
const PARTS = [
  { id: 'FRONT_LEFT_WHEEL', node: 'PEDS_FRONT_LEFT_WHEEL', offset: [0.1, 0.72, 0.08] },
  { id: 'FRONT_RIGHT_WHEEL', node: 'PEDS_FRONT_RIGHT_WHEEL', offset: [0.1, -0.72, 0.08] },
  { id: 'REAR_LEFT_WHEEL', node: 'PEDS_REAR_LEFT_WHEEL', offset: [-0.1, 0.72, 0.08] },
  { id: 'REAR_RIGHT_WHEEL', node: 'PEDS_REAR_RIGHT_WHEEL', offset: [-0.1, -0.72, 0.08] },
  { id: 'FRONT_WING', node: 'PEDS_FRONT_WING', offset: [0.92, 0, 0.14] },
  { id: 'REAR_WING', node: 'PEDS_REAR_WING', offset: [-0.86, 0, 0.28] },
  { id: 'COCKPIT_HALO', node: 'PEDS_R42_COCKPIT_HALO', offset: [0, 0, 0.55] },
  { id: 'LEFT_SIDEPOD', node: 'PEDS_R42_LEFT_SIDEPOD', offset: [0, 0.75, 0.1] },
  { id: 'RIGHT_SIDEPOD', node: 'PEDS_R42_RIGHT_SIDEPOD', offset: [0, -0.75, 0.1] },
  { id: 'FLOOR_DIFFUSER', node: 'PEDS_R42_FLOOR_DIFFUSER', offset: [0, 0, -0.54] },
] as const;

type PartId = (typeof PARTS)[number]['id'];
type ComponentDefinition = {
  node: string;
  parentAssemblyId: string;
  explodedOffset: Vec3;
  animationOrder: number;
};

type Props = {
  progress: number;
  selected: PartId | null;
  blueprint: boolean;
  isolate: boolean;
  quality: 'high' | 'balanced' | 'performance';
  modelUrl: string;
};

type MotionNode = {
  object: THREE.Object3D;
  origin: Vec3;
  offset: Vec3;
  assemblyId: string;
  animationOrder: number;
};

const initialPosition = (object: THREE.Object3D): Vec3 => [
  object.position.x,
  object.position.y,
  object.position.z,
];

function Vehicle({
  progress,
  selected,
  blueprint,
  isolate,
  modelUrl,
}: Omit<Props, 'quality'>) {
  const gltf = useGLTF(modelUrl);
  // Clone the scene hierarchy, not its geometry, to isolate runtime transforms.
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const [components, setComponents] = useState<ComponentDefinition[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/models/engineering/assembly-manifest-r4-5.json', {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Assembly metadata unavailable');
        return response.json();
      })
      .then((manifest: { components?: unknown[] }) => {
        if (controller.signal.aborted || !Array.isArray(manifest.components)) return;
        const valid = manifest.components.filter((component): component is ComponentDefinition => {
          if (!component || typeof component !== 'object') return false;
          const value = component as Partial<ComponentDefinition>;
          return (
            isMotionPart({ node: value.node, offset: value.explodedOffset }) &&
            typeof value.parentAssemblyId === 'string' &&
            typeof value.animationOrder === 'number' &&
            Number.isFinite(value.animationOrder)
          );
        });
        setComponents(valid);
      })
      .catch(() => {
        // The ten external assemblies still animate if the optional fine-grained manifest is missing.
      });
    return () => controller.abort();
  }, []);

  const baseMaterials = useMemo(() => {
    const originals = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>();
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        originals.set(object, object.material);
        object.castShadow = false;
        object.receiveShadow = true;
      }
    });
    return originals;
  }, [scene]);

  useEffect(() => {
    const generated: THREE.Material[] = [];
    baseMaterials.forEach((material, mesh) => {
      if (blueprint) {
        const outline = new THREE.MeshBasicMaterial({
          color: '#7babbf',
          wireframe: true,
          transparent: true,
          opacity: 0.85,
          depthWrite: false,
        });
        mesh.material = outline;
        generated.push(outline);
      } else {
        mesh.material = material;
      }
    });

    return () => {
      baseMaterials.forEach((material, mesh) => {
        mesh.material = material;
      });
      generated.forEach((material) => material.dispose());
    };
  }, [baseMaterials, blueprint]);

  const assemblies = useMemo<MotionNode[]>(
    () =>
      PARTS.flatMap((part) => {
        const object = scene.getObjectByName(part.node);
        return object
          ? [
              {
                object,
                origin: initialPosition(object),
                offset: part.offset,
                assemblyId: part.id,
                animationOrder: 0,
              },
            ]
          : [];
      }),
    [scene],
  );

  const fineParts = useMemo<MotionNode[]>(
    () =>
      components.flatMap((component) => {
        const object = scene.getObjectByName(component.node);
        return object
          ? [
              {
                object,
                origin: initialPosition(object),
                offset: component.explodedOffset,
                assemblyId: component.parentAssemblyId,
                animationOrder: component.animationOrder,
              },
            ]
          : [];
      }),
    [components, scene],
  );

  // In isolate mode, remove the central chassis from the inspection silhouette.
  const chassis = useMemo(() => scene.getObjectByName('CHASSIS_CORE'), [scene]);
  const authoredInternals = useMemo(() => {
    const root = scene.getObjectByName('EDS_CAR_ROOT');
    const assemblyRoot = scene.getObjectByName('ASSEMBLIES');
    return root?.children.filter((item) => item !== assemblyRoot && item !== chassis) ?? [];
  }, [scene, chassis]);

  useFrame(() => {
    assemblies.forEach((entry, index) => {
      const position = poseFromOrigin(
        entry.origin,
        entry.offset,
        assemblyWeight(progress, index, assemblies.length),
      );
      entry.object.position.set(...position);
      entry.object.visible = !isolate || !selected || selected === entry.assemblyId;
    });

    fineParts.forEach((entry) => {
      const position = poseFromOrigin(
        entry.origin,
        entry.offset,
        componentWeight(progress, entry.animationOrder, selected === entry.assemblyId),
      );
      entry.object.position.set(...position);
    });

    if (chassis) chassis.visible = !isolate;
    authoredInternals.forEach((object) => {
      object.visible = !isolate;
    });
  });

  return <primitive object={scene} />;
}

export default function InsideMachineScene(props: Props) {
  return (
    <Canvas
      dpr={props.quality === 'high' ? [1, 2] : props.quality === 'balanced' ? [1, 1.5] : [0.8, 1]}
      camera={{ position: [4.8, 3.4, 4.5], fov: 35, near: 0.05, far: 150 }}
      gl={{
        antialias: props.quality !== 'performance',
        powerPreference: 'high-performance',
        alpha: false,
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={[props.blueprint ? '#e9f0f2' : '#0a111b']} />
      <ambientLight intensity={props.blueprint ? 1.7 : 2.2} />
      <hemisphereLight args={['#ecf4ff', '#2f3e51', 2.5]} />
      <directionalLight position={[4, 8, 9]} intensity={4.2} color="#f3f8ff" />
      <directionalLight position={[-5, 3, -4]} intensity={2.8} color="#ff6846" />
      <directionalLight position={[-3, 4, 7]} intensity={2.2} color="#98d7ff" />
      <Vehicle {...props} />
      {props.quality === 'high' && !props.blueprint && (
        <ContactShadows
          opacity={0.24}
          scale={9}
          blur={2.6}
          far={5}
          resolution={256}
          position={[0, -0.65, 0]}
        />
      )}
      <OrbitControls
        makeDefault
        target={[0, 0.25, 0]}
        enablePan={false}
        minDistance={3}
        maxDistance={12}
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}
