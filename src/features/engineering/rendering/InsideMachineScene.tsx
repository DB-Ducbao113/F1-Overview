import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export const PARTS = [
  { id: 'FRONT_LEFT_WHEEL', node: 'PEDS_FRONT_LEFT_WHEEL', offset: [0.1, 0.72, 0.08], name: 'Front-left wheel' },
  { id: 'FRONT_RIGHT_WHEEL', node: 'PEDS_FRONT_RIGHT_WHEEL', offset: [0.1, -0.72, 0.08], name: 'Front-right wheel' },
  { id: 'REAR_LEFT_WHEEL', node: 'PEDS_REAR_LEFT_WHEEL', offset: [-0.1, 0.72, 0.08], name: 'Rear-left wheel' },
  { id: 'REAR_RIGHT_WHEEL', node: 'PEDS_REAR_RIGHT_WHEEL', offset: [-0.1, -0.72, 0.08], name: 'Rear-right wheel' },
  { id: 'FRONT_WING', node: 'PEDS_FRONT_WING', offset: [0.92, 0, 0.14], name: 'Front wing' },
  { id: 'REAR_WING', node: 'PEDS_REAR_WING', offset: [-0.86, 0, 0.28], name: 'Rear wing' },
  { id: 'COCKPIT_HALO', node: 'PEDS_R42_COCKPIT_HALO', offset: [0, 0, 0.55], name: 'Cockpit & halo' },
  { id: 'LEFT_SIDEPOD', node: 'PEDS_R42_LEFT_SIDEPOD', offset: [0, 0.75, 0.1], name: 'Left sidepod' },
  { id: 'RIGHT_SIDEPOD', node: 'PEDS_R42_RIGHT_SIDEPOD', offset: [0, -0.75, 0.1], name: 'Right sidepod' },
  { id: 'FLOOR_DIFFUSER', node: 'PEDS_R42_FLOOR_DIFFUSER', offset: [0, 0, -0.54], name: 'Floor / diffuser' },
] as const;

type PartId = typeof PARTS[number]['id'];
type Props = { progress: number; selected: PartId | null; blueprint: boolean; isolate: boolean; quality: 'high' | 'balanced' | 'performance'; modelUrl: string };

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => t * t * (3 - 2 * t);

function Vehicle({ progress, selected, blueprint, isolate, modelUrl }: Omit<Props, 'quality'>) {
  const gltf = useGLTF(modelUrl);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const originals = useRef(new Map<string, THREE.Vector3>());
  const materials = useMemo(() => new Map<THREE.Mesh, THREE.Material | THREE.Material[]>(), []);

  useEffect(() => {
    originals.current.clear();
    PARTS.forEach((part) => {
      const object = scene.getObjectByName(part.node);
      if (object) originals.current.set(part.node, object.position.clone());
    });
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        materials.set(object, object.material);
        object.castShadow = false;
        object.receiveShadow = true;
      }
    });
    return () => {
      materials.forEach((material, mesh) => { mesh.material = material; });
      materials.clear();
    };
  }, [scene, materials]);

  useEffect(() => {
    const generated: THREE.Material[] = [];
    materials.forEach((material, mesh) => {
      if (blueprint) {
        const next = new THREE.MeshBasicMaterial({ color: '#7fa8bb', wireframe: true, transparent: true, opacity: 0.78 });
        mesh.material = next;
        generated.push(next);
      } else mesh.material = material;
    });
    return () => { materials.forEach((material, mesh) => { mesh.material = material; }); generated.forEach((m) => m.dispose()); };
  }, [blueprint, materials, scene]);

  useFrame(() => {
    PARTS.forEach((part, index) => {
      const object = scene.getObjectByName(part.node);
      const origin = originals.current.get(part.node);
      if (!object || !origin) return;
      const local = ease(clamp((progress - index * 0.055) / 0.48));
      const emphasis = selected === part.id ? Math.max(local, 0.42) : local;
      object.position.set(
        origin.x + part.offset[0] * emphasis,
        origin.y + part.offset[1] * emphasis,
        origin.z + part.offset[2] * emphasis,
      );
      object.visible = !isolate || !selected || selected === part.id;
    });
  });

  return <primitive object={scene} />;
}

export default function InsideMachineScene(props: Props) {
  return (
    <Canvas
      dpr={props.quality === 'high' ? [1, 2] : props.quality === 'balanced' ? [1, 1.5] : [1, 1]}
      camera={{ position: [4.8, 4.2, 2.7], fov: 36, near: 0.05, far: 150 }}
      gl={{ antialias: props.quality !== 'performance', powerPreference: 'high-performance', alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={[props.blueprint ? '#e9f0f2' : '#0a111b']} />
      <ambientLight intensity={props.blueprint ? 2 : 1.9} />
      <hemisphereLight args={['#edf5ff', '#687589', 2.5]} />
      <directionalLight position={[4, 7, 9]} intensity={4.5} color="#f2f9ff" />
      <directionalLight position={[-5, -2, 4]} intensity={2.4} color="#ff6740" />
      <directionalLight position={[-2, 5, -6]} intensity={2.1} color="#8ac6ff" />
      <Vehicle {...props} />
      {props.quality === 'high' && !props.blueprint && <ContactShadows opacity={0.28} scale={9} blur={2.5} far={5} resolution={256} position={[0, 0, -1.1]} />}
      {props.quality === 'high' && <Environment preset="city" environmentIntensity={0.5} />}
      <OrbitControls makeDefault enablePan={false} minDistance={3} maxDistance={12} enableDamping dampingFactor={0.08} />
    </Canvas>
  );
}
