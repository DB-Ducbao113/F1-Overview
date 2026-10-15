import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import { useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { F1_HOTSPOTS, HotspotItem } from '../../data/showroom/hotspotsData';
import { CAR_TEXTURE_REVISION } from './showroomTextureCache';
import { useShowroomTextureSet } from './useShowroomTextureSet';
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

// ── Realistic C42 Formula 1 GLB Model with Photorealistic PBR Livery ──
const RealF1CarMesh: React.FC<{
  teamId: TeamId;
}> = ({ teamId }) => {
  const { scene } = useGLTF('/models/c42.v2.glb');
  const invalidate = useThree((state) => state.invalidate);
  const livery = getTeam3DLivery(teamId);
  const sponsors = useMemo(() => getTeamSponsors(teamId), [teamId]);

  // Clone scene hierarchy (no procedural vertex deformation).
  // NOTE: DRS flap tilt disabled — previous normalized-coords version stretched
  // the whole rear wing into long bars (lỗi sinh thêm ở ảnh mới). Model stays pristine.
  const { clonedScene, clonedGeometries } = useMemo(() => {
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
  const activeMaterialsRef = useRef<THREE.Material[]>([]);

  // Capture original materials on initial scene load
  useEffect(() => {
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

  // ── M3B.3: acquire procedural car textures through the bounded cache ──
  // The cache owns texture lifetime; this component only holds a reference
  // for as long as it renders and releases it on unmount/StrictMode cleanup.
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
  const cachedTextures = useShowroomTextureSet('car', textureKey, CAR_SLOTS, generateCarTexture);

  const noseTex = cachedTextures?.get('nose');
  const bodyworkTex = cachedTextures?.get('bodywork');
  const wingsTex = cachedTextures?.get('wings');
  const floorTex = cachedTextures?.get('floor');
  const suspensionMirrorsTex = cachedTextures?.get('suspensionMirrors');
  const diffuserRainLightTex = cachedTextures?.get('diffuserRainLight');
  const cockpitTex = cachedTextures?.get('cockpit');
  const haloTex = cachedTextures?.get('halo');
  const wheelTex = cachedTextures?.get('wheel');

  // Apply authentic team livery & sponsor graphics directly to the 3D car mesh
  useEffect(() => {
    if (
      !clonedScene ||
      !noseTex ||
      !bodyworkTex ||
      !wingsTex ||
      !floorTex ||
      !suspensionMirrorsTex ||
      !diffuserRainLightTex ||
      !cockpitTex ||
      !haloTex ||
      !wheelTex
    )
      return;

    // Dispose old dynamic materials to prevent WebGL memory leaks
    activeMaterialsRef.current.forEach((m) => m.dispose());
    activeMaterialsRef.current = [];

    clonedScene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const currentMat = child.material;
        const matName = (currentMat?.name || child.name || '').toLowerCase();
        let newMat: THREE.Material;

        // 1. Pirelli Tires & BBS Wheel Rims (006 = Front, 011 = Rear L, 013 = Rear R)
        // Dynamically synchronized with each constructor team's aero covers & rim accents
        if (matName.includes('006') || matName.includes('011') || matName.includes('013')) {
          newMat = new THREE.MeshStandardMaterial({
            map: wheelTex,
            roughness: 0.45,
            metalness: 0.55,
            envMapIntensity: 1.5,
          });
        }
        // 2. Cockpit Interior & Steering Wheel (002)
        // PCU-8D OLED telemetry display, RPM LEDs, colorful cockpit pushbuttons & 6-point racing harness
        else if (matName.includes('002')) {
          newMat = new THREE.MeshStandardMaterial({
            map: cockpitTex,
            roughness: 0.75,
            metalness: 0.25,
            envMapIntensity: 1.2,
          });
        }
        // 3. Titanium Halo Safety Cell (008)
        // Grade 5 titanium structure with aerodynamic upper fairing painted in team livery
        else if (matName.includes('008')) {
          newMat = new THREE.MeshPhysicalMaterial({
            map: haloTex,
            color: new THREE.Color('#ffffff'),
            roughness: livery.haloRoughness ?? 0.2,
            metalness: livery.haloMetalness ?? 0.45,
            clearcoat: (livery.bodyClearcoat ?? 1.0) * 0.7,
            clearcoatRoughness: 0.1,
            envMapIntensity: 1.6,
          });
        }
        // 4. Aerodynamic Underfloor & Chassis (001 - Prim 3)
        // Venturi ground-effect floor with colored edge fences, Jabroc reference plank & golden titanium skids
        else if (matName.includes('001')) {
          newMat = new THREE.MeshStandardMaterial({
            map: floorTex,
            emissive: new THREE.Color('#ffffff'),
            emissiveMap: floorTex,
            emissiveIntensity: 0.18,
            roughness: 0.55,
            metalness: 0.25,
            envMapIntensity: 1.6,
          });
        }
        // 5. Suspension Wishbones, Pushrods & Wing Mirrors (003 - Prim 0)
        // Authentic team livery mirror housings, aero accent pinstripes, reflection glass, titanium rod ends
        else if (matName.includes('003')) {
          newMat = new THREE.MeshPhysicalMaterial({
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
          });
        }
        // 6. Rear Aero Deflectors & Diffuser (009 - Prim 4)
        // High-intensity FIA 24-LED Ruby Rain Light, Inconel exhaust heat-bluing, team-colored diffuser strakes
        else if (matName.includes('009')) {
          newMat = new THREE.MeshPhysicalMaterial({
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
          });
        }
        // 7. Wings Assembly: Front Wing Flaps & Rear Wing (005 - Prim 10)
        else if (matName.includes('005')) {
          newMat = new THREE.MeshPhysicalMaterial({
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
          });
        }
        // 8. Main Bodywork: Sidepods, Engine Cover, Shark Fin & Airbox (004 - Prim 1)
        else if (matName.includes('004')) {
          newMat = new THREE.MeshPhysicalMaterial({
            map: bodyworkTex,
            color: new THREE.Color('#ffffff'),
            roughness: livery.sidepodRoughness ?? livery.bodyRoughness ?? 0.16,
            metalness: livery.sidepodMetalness ?? 0.2,
            clearcoat: livery.bodyClearcoat ?? 1.0,
            clearcoatRoughness: 0.06,
            envMapIntensity: (livery.bodyClearcoat ?? 1.0) > 0 ? 1.25 : 0.5,
          });
        }
        // 9. Forward Monocoque & Nose Cone (007 - Prim 6)
        else if (matName.includes('007')) {
          newMat = new THREE.MeshPhysicalMaterial({
            map: noseTex,
            color: new THREE.Color('#ffffff'),
            roughness: livery.noseRoughness ?? livery.bodyRoughness ?? 0.16,
            metalness: livery.noseMetalness ?? livery.bodyMetalness ?? 0.2,
            clearcoat: livery.bodyClearcoat ?? 1.0,
            clearcoatRoughness: 0.06,
            envMapIntensity: (livery.bodyClearcoat ?? 1.0) > 0 ? 1.25 : 0.5,
          });
        }
        // Fallback for any other body parts
        else {
          newMat = new THREE.MeshPhysicalMaterial({
            map: null,
            color: new THREE.Color(livery.bodyColor),
            roughness: livery.bodyRoughness,
            metalness: livery.bodyMetalness,
            clearcoat: livery.bodyClearcoat ?? 1.0,
            clearcoatRoughness: 0.08,
            envMapIntensity: 1.8,
          });
        }

        newMat.name = matName;
        newMat.needsUpdate = true;
        child.material = newMat;
        activeMaterialsRef.current.push(newMat);
      }
    });

    invalidate();

    return () => {
      activeMaterialsRef.current.forEach((m) => m.dispose());
      activeMaterialsRef.current = [];
    };
  }, [
    clonedScene,
    teamId,
    livery,
    cachedTextures,
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
  ]);

  // Acquisition completes after commit. Keep the cloned GLB out of the R3F
  // scene graph for that empty pass so Three.js initializes it only once.
  if (!cachedTextures) return null;

  return (
    <primitive
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
}) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Photorealistic Formula 1 Car with direct UV-mapped liveries & PBR materials */}
      <RealF1CarMesh teamId={teamId} />

      {/* ── 3D Interactive Hotspot Markers (Only when enabled or inspecting) ── */}
      {(showHotspots || activeHotspot !== null) &&
        F1_HOTSPOTS.map((hotspot, idx) => {
          const isSelected = activeHotspot?.id === hotspot.id;

          return (
            <group key={hotspot.id} position={hotspot.position}>
              <Html center zIndexRange={[100, 0]}>
                <div className="relative flex items-center justify-center">
                  <span
                    className={`absolute w-7 h-7 rounded-full animate-ping pointer-events-none ${
                      isSelected ? 'bg-f1red/60' : 'bg-sky-400/40'
                    }`}
                    style={{ animationDuration: '2.5s' }}
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectHotspot(hotspot);
                    }}
                    className={`group relative flex items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none ${
                      isSelected ? 'scale-115 z-30' : 'hover:scale-110'
                    }`}
                    aria-label={lang === 'vi' ? hotspot.nameVi : hotspot.nameEn}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-display text-[11px] font-black shadow-lg transition-all border ${
                        isSelected
                          ? 'bg-f1red text-white border-white ring-2 ring-f1red/50 shadow-f1red/40'
                          : 'bg-studio-900/90 text-white border-studio-500 hover:border-white hover:bg-f1red shadow-black/80'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </button>
                </div>
              </Html>
            </group>
          );
        })}
    </group>
  );
};

// Preload the model asset
useGLTF.preload('/models/c42.v2.glb');
