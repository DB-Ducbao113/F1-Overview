import React, { useRef, useMemo, useEffect, useLayoutEffect, useCallback, useState } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import { useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { F1_HOTSPOTS, HotspotItem } from '../../data/showroom/hotspotsData';
import { CAR_TEXTURE_REVISION } from './showroomTextureCache';
import { acquireSet, type AcquireResult } from './showroomTextureCache';
import { useWorkerGLTF, EXPERIMENTAL_WORKER_GLTF } from './useWorkerGLTF';
import { TeamId } from '../../types';
import { getTeam3DLivery } from '../../data/showroom/teamLiveries';
import { getTeamSponsors } from '../../data/showroom/teamSponsors';
import {
  generateNoseTexture,
  generateBodyworkTexture,
  generateWingsTexture,
  generateFloorTexture,
  generateWheelTexture,
  generateSuspensionMirrorsTexture,
  generateDiffuserRainLightTexture,
  generateCockpitTexture,
  generateHaloTexture,
} from './F1CarTextures';

interface F1Car3DModelProps {
  teamId: TeamId;
  activeHotspot: HotspotItem | null;
  onSelectHotspot: (hotspot: HotspotItem) => void;
  lang: 'vi' | 'en';
  showHotspots?: boolean;
  readinessKey: string;
  onScenePartReady: (sceneKey: string, part: 'car' | 'studio') => void;
}

// Model scale factor: converts 46.3 unit raw model into ~4.86m real F1 dimensions
const MODEL_SCALE = 0.105;

// Stable slot list for the bounded texture cache (module scope so the
// acquireSet useMemo dependency stays referentially equal across renders).
const CAR_SLOTS = [
  'nose',
  'bodywork',
  'wings',
  'floor',
  'suspensionMirrors',
  'diffuserRainLight',
  'cockpit',
  'halo',
  'wheel',
] as const;

// Module-level material cache keyed by livery startup key.
// Materials are created once per livery and reused across mount/unmount
// cycles to avoid repeated material object creation, texture upload, and
// shader compilation overhead.
const materialCache = new Map<string, Map<string, THREE.Material>>();

// ── Realistic C42 Formula 1 GLB Model with Photorealistic PBR Livery ──
const RealF1CarMesh: React.FC<{
  teamId: TeamId;
  readinessKey: string;
  onScenePartReady: (sceneKey: string, part: 'car' | 'studio') => void;
}> = ({ teamId, readinessKey, onScenePartReady }) => {
  const gltf = useWorkerGLTF();
  const scene = gltf?.scene ?? null;
  const invalidate = useThree((state) => state.invalidate);
  const livery = useMemo(() => getTeam3DLivery(teamId), [teamId]);
  const sponsors = useMemo(() => getTeamSponsors(teamId), [teamId]);

  // Clone scene hierarchy (no procedural vertex deformation).
  // NOTE: DRS flap tilt disabled — previous normalized-coords version stretched
  // the whole rear wing into long bars (lỗi sinh thêm ở ảnh mới). Model stays pristine.
  const { clonedScene, clonedGeometries } = useMemo(() => {
    if (!scene) return { clonedScene: null, clonedGeometries: [] as THREE.BufferGeometry[] };
    const cloned = scene.clone(true);
    const disposableGeometries: THREE.BufferGeometry[] = [];

    return { clonedScene: cloned, clonedGeometries: disposableGeometries };
  }, [scene]);

  // Only dispose geometry cloned by this component. Geometry retained in the
  // useGLTF cache is shared and must stay alive for later showroom visits.
  useEffect(
    () => () => {
      clonedGeometries.forEach((geometry) => geometry.dispose());
    },
    [clonedGeometries],
  );

  // Keep references to original pristine GLTF materials (so tire textures stay sharp)
  const originalMaterialsRef = useRef<Map<string, any>>(new Map());
  const readinessKeyRef = useRef(readinessKey);
  const onScenePartReadyRef = useRef(onScenePartReady);

  useLayoutEffect(() => {
    readinessKeyRef.current = readinessKey;
    onScenePartReadyRef.current = onScenePartReady;
  }, [onScenePartReady, readinessKey]);

  // Capture originals before the later layout effect replaces materials.
  useLayoutEffect(() => {
    if (!scene) return;
    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const mat = child.material;
        const matName = (mat.name || child.name || '').toLowerCase();
        if (!originalMaterialsRef.current.has(matName)) {
          originalMaterialsRef.current.set(matName, mat);
        }
      }
    });
  }, [scene]);

  const baseWheelTex = useLoader(THREE.TextureLoader, '/textures/wheel_base.webp');

  const generateCarTexture = useCallback(
    (slot: string) => {
      switch (slot) {
        case 'nose':
          return generateNoseTexture(teamId, livery, sponsors);
        case 'bodywork':
          return generateBodyworkTexture(teamId, livery, sponsors);
        case 'wings':
          return generateWingsTexture(teamId, livery, sponsors);
        case 'floor':
          return generateFloorTexture(teamId, livery);
        case 'suspensionMirrors':
          return generateSuspensionMirrorsTexture(teamId, livery);
        case 'diffuserRainLight':
          return generateDiffuserRainLightTexture(teamId, livery);
        case 'cockpit':
          return generateCockpitTexture(teamId, livery);
        case 'halo':
          return generateHaloTexture(teamId, livery, sponsors);
        case 'wheel':
          return generateWheelTexture(teamId, livery, sponsors, baseWheelTex?.image);
        default:
          throw new Error(`Unknown car texture slot: ${slot}`);
      }
    },
    [baseWheelTex, livery, sponsors, teamId],
  );

  const textureKey = `${teamId}:car-v${CAR_TEXTURE_REVISION}`;

  // Directly acquire textures (do not use useShowroomTextureSet, which calls
  // release() on unmount and causes textures to be disposed). We keep textures
  // alive across mount/unmount so that cached materials can be reused without
  // re-uploading textures to the GPU.
  const [textureResult, setTextureResult] = useState<AcquireResult | null>(null);

  useEffect(() => {
    const result = acquireSet('car', textureKey, CAR_SLOTS, generateCarTexture);
    setTextureResult(result);
    // Intentionally do NOT call result.release() on cleanup — we keep textures
    // alive across mount/unmount cycles so that cached materials can be reused.
  }, [textureKey, generateCarTexture]);

  const textures = textureResult?.textures;
  const materialKey = `${teamId}:car-v${CAR_TEXTURE_REVISION}`;
  const cachedMaterials = materialCache.get(materialKey);

  const noseTex = textures?.get('nose');
  const bodyworkTex = textures?.get('bodywork');
  const wingsTex = textures?.get('wings');
  const floorTex = textures?.get('floor');
  const suspensionMirrorsTex = textures?.get('suspensionMirrors');
  const diffuserRainLightTex = textures?.get('diffuserRainLight');
  const cockpitTex = textures?.get('cockpit');
  const haloTex = textures?.get('halo');
  const wheelTex = textures?.get('wheel');

  // Apply all required livery materials before R3F can submit the car's first
  // frame. This also makes the explicit readiness signal truthful.
  useLayoutEffect(() => {
    if (!clonedScene || !noseTex || !bodyworkTex || !wingsTex || !floorTex || !suspensionMirrorsTex || !diffuserRainLightTex || !cockpitTex || !haloTex || !wheelTex)
      return;

    performance.mark('showroom:car:material-application:start');

    let materials: Map<string, THREE.Material>;

    if (cachedMaterials) {
      // Reuse cached materials — no new material creation, no texture upload,
      // no shader compilation overhead.
      materials = cachedMaterials;
    } else {
      materials = new Map();

      // 1. Pirelli Tires & BBS Wheel Rims (006 = Front, 011 = Rear L, 013 = Rear R)
      materials.set('006', new THREE.MeshStandardMaterial({
        map: wheelTex,
        roughness: 0.45,
        metalness: 0.55,
        envMapIntensity: 1.5,
      }));
      materials.set('011', new THREE.MeshStandardMaterial({
        map: wheelTex,
        roughness: 0.45,
        metalness: 0.55,
        envMapIntensity: 1.5,
      }));
      materials.set('013', new THREE.MeshStandardMaterial({
        map: wheelTex,
        roughness: 0.45,
        metalness: 0.55,
        envMapIntensity: 1.5,
      }));
      // 2. Cockpit Interior & Steering Wheel (002)
      materials.set('002', new THREE.MeshStandardMaterial({
        map: cockpitTex,
        roughness: 0.75,
        metalness: 0.25,
        envMapIntensity: 1.2,
      }));
      // 3. Titanium Halo Safety Cell (008)
      materials.set('008', new THREE.MeshPhysicalMaterial({
        map: haloTex,
        color: new THREE.Color('#ffffff'),
        roughness: livery.haloRoughness ?? 0.2,
        metalness: livery.haloMetalness ?? 0.45,
        clearcoat: (livery.bodyClearcoat ?? 1.0) * 0.7,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.6,
      }));
      // 4. Aerodynamic Underfloor & Chassis (001 - Prim 3)
      materials.set('001', new THREE.MeshStandardMaterial({
        map: floorTex,
        emissive: new THREE.Color('#ffffff'),
        emissiveMap: floorTex,
        emissiveIntensity: 0.18,
        roughness: 0.55,
        metalness: 0.25,
        envMapIntensity: 1.6,
      }));
      // 5. Suspension Wishbones, Pushrods & Wing Mirrors (003 - Prim 0)
      materials.set('003', new THREE.MeshPhysicalMaterial({
        map: suspensionMirrorsTex,
        emissive: new THREE.Color('#ffffff'),
        emissiveMap: suspensionMirrorsTex,
        emissiveIntensity: 0.35,
        color: new THREE.Color('#ffffff'),
        roughness: 0.38,
        metalness: 0.35,
        clearcoat: livery.bodyClearcoat ?? 1.0,
        clearcoatRoughness: 0.08,
        envMapIntensity: 2.2,
      }));
      // 6. Rear Aero Deflectors & Diffuser (009 - Prim 4)
      materials.set('009', new THREE.MeshPhysicalMaterial({
        map: diffuserRainLightTex,
        emissive: new THREE.Color('#ffffff'),
        emissiveMap: diffuserRainLightTex,
        emissiveIntensity: 0.38,
        color: new THREE.Color('#ffffff'),
        roughness: 0.45,
        metalness: 0.3,
        clearcoat: 0.4,
        clearcoatRoughness: 0.1,
        envMapIntensity: 2.0,
      }));
      // 7. Wings Assembly: Front Wing Flaps & Rear Wing (005 - Prim 10)
      materials.set('005', new THREE.MeshPhysicalMaterial({
        map: wingsTex,
        emissive: new THREE.Color('#ffffff'),
        emissiveMap: wingsTex,
        emissiveIntensity: 0.32,
        color: new THREE.Color('#ffffff'),
        roughness: livery.wingRoughness ?? 0.22,
        metalness: livery.wingMetalness ?? 0.25,
        clearcoat: livery.bodyClearcoat ?? 1.0,
        clearcoatRoughness: 0.08,
        envMapIntensity: 1.9,
      }));
      // 8. Main Bodywork: Sidepods, Engine Cover, Shark Fin & Airbox (004 - Prim 1)
      materials.set('004', new THREE.MeshPhysicalMaterial({
        map: bodyworkTex,
        color: new THREE.Color('#ffffff'),
        roughness: livery.sidepodRoughness ?? livery.bodyRoughness ?? 0.16,
        metalness: livery.sidepodMetalness ?? 0.2,
        clearcoat: livery.bodyClearcoat ?? 1.0,
        clearcoatRoughness: 0.06,
        envMapIntensity: (livery.bodyClearcoat ?? 1.0) > 0 ? 1.25 : 0.5,
      }));
      // 9. Forward Monocoque & Nose Cone (007 - Prim 6)
      materials.set('007', new THREE.MeshPhysicalMaterial({
        map: noseTex,
        color: new THREE.Color('#ffffff'),
        roughness: livery.noseRoughness ?? livery.bodyRoughness ?? 0.16,
        metalness: livery.noseMetalness ?? livery.bodyMetalness ?? 0.2,
        clearcoat: livery.bodyClearcoat ?? 1.0,
        clearcoatRoughness: 0.06,
        envMapIntensity: (livery.bodyClearcoat ?? 1.0) > 0 ? 1.25 : 0.5,
      }));
      // Fallback for any other body parts
      materials.set('_fallback', new THREE.MeshPhysicalMaterial({
        map: null,
        color: new THREE.Color(livery.bodyColor),
        roughness: livery.bodyRoughness,
        metalness: livery.bodyMetalness,
        clearcoat: livery.bodyClearcoat ?? 1.0,
        clearcoatRoughness: 0.08,
        envMapIntensity: 1.8,
      }));

      materialCache.set(materialKey, materials);
    }

    // Apply materials to cloned scene
    clonedScene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const currentMat = child.material;
        const matName = (currentMat?.name || child.name || '').toLowerCase();
        const newMat = materials.get(matName) || materials.get('_fallback');

        if (newMat) {
          child.material = newMat;
        }
      }
    });

    performance.mark('showroom:car:material-application:end');
    performance.measure('showroom:car:material-application', {
      start: 'showroom:car:material-application:start',
      end: 'showroom:car:material-application:end',
    });
    onScenePartReadyRef.current(readinessKeyRef.current, 'car');
    invalidate();
  }, [
    clonedScene,
    teamId,
    livery,
    textures,
    noseTex,
    bodyworkTex,
    wingsTex,
    floorTex,
    suspensionMirrorsTex,
    diffuserRainLightTex,
    cockpitTex,
    haloTex,
    wheelTex,
    invalidate,
    cachedMaterials,
  ]);

  if (!clonedScene) return null;

  return (
    <primitive
      name="showroom-car"
      object={clonedScene}
      scale={[MODEL_SCALE, MODEL_SCALE, MODEL_SCALE]}
      rotation={[0, Math.PI, 0]}
      position={[0, 0, 0]}
    />
  );
};

// ── Master F1Car3DModel Component (Zero Floating Planes) ──
export const F1Car3DModel: React.FC<F1Car3DModelProps> = ({
  teamId,
  activeHotspot,
  onSelectHotspot,
  lang,
  showHotspots = false,
  readinessKey,
  onScenePartReady,
}) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Photorealistic Formula 1 Car with direct UV-mapped liveries & PBR materials */}
      <RealF1CarMesh
        teamId={teamId}
        readinessKey={readinessKey}
        onScenePartReady={onScenePartReady}
      />

      {/* ── 3D Interactive Hotspot Markers (Only when enabled or inspecting) ── */}
      {(showHotspots || activeHotspot !== null) &&
        F1_HOTSPOTS.map((hotspot, idx) => {
          const isSelected = activeHotspot?.id === hotspot.id;

          return (
            <group key={hotspot.id} position={hotspot.position}>
              <Html center zIndexRange={[100, 0]}>...</Html>
            </group>
          );
        })}
    </group>
  );
};

// Preload the model asset (skipped when the worker experiment is on, so the
// worker performs the fetch+decode without a redundant main-thread parse).
if (!EXPERIMENTAL_WORKER_GLTF) {
  useGLTF.preload('/models/c42.v2.glb');
}