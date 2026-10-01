import React, { useRef, useMemo, useEffect } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { F1_HOTSPOTS, HotspotItem } from '../../data/showroom/hotspotsData';
import { TeamId } from '../../types';
import { getTeam3DLivery } from '../../data/showroom/teamLiveries';
import { getTeamSponsors } from '../../data/showroom/teamSponsors';
import {
  generateNoseTexture,
  generateBodyworkTexture,
  generateWingsTexture,
  generateFloorTexture,
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

// ── Realistic C42 Formula 1 GLB Model with Photorealistic PBR Livery ──
const RealF1CarMesh: React.FC<{
  teamId: TeamId;
}> = ({ teamId }) => {
  const { scene } = useGLTF('/models/c42.glb');
  const livery = getTeam3DLivery(teamId);
  const sponsors = useMemo(() => getTeamSponsors(teamId), [teamId]);

  // Clone scene hierarchy and apply procedural aerodynamic flap elevation ("lồi lên")
  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);

    // Procedural aerodynamic flap tilt & lift:
    // Elevates the rear DRS top flap to an aggressive high-downforce attack angle matching real F1 cars,
    // so the brand name (PETRONAS, Ferrari, HONDA, etc.) is prominently angled towards front/cockpit cameras.
    cloned.traverse((child: any) => {
      if (
        child.isMesh &&
        (child.material?.name || child.name || '').toLowerCase().includes('005')
      ) {
        child.geometry = child.geometry.clone();
        const pos = child.geometry.attributes.position;
        if (pos) {
          const px0 = -17.4;
          const pz0 = -6.2;
          const tiltAngle = 12.5 * (Math.PI / 180); // ~12.5 degrees upward attack angle
          const liftZ = -0.48; // Negative Z is upward in c42 coordinates
          const liftX = 0.2; // Slight forward aerodynamic tuck

          for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = pos.getZ(i);

            // Target rear wing DRS top flap: x < -17.4, z < -6.1, |y| < 3.85
            if (x < -17.4 && z < -6.1 && Math.abs(y) < 3.85) {
              const dx = x - px0;
              const dz = z - pz0;
              // Smooth falloff from leading edge pivot so wing stays seamlessly connected
              const factor = Math.min(1.0, Math.pow(Math.abs(dx) / 1.5, 1.2));

              const rotDx = dx * Math.cos(tiltAngle) - dz * Math.sin(tiltAngle);
              const rotDz = dx * Math.sin(tiltAngle) + dz * Math.cos(tiltAngle);

              pos.setXYZ(
                i,
                px0 + dx * (1 - factor) + (rotDx + liftX) * factor,
                y,
                pz0 + dz * (1 - factor) + (rotDz + liftZ) * factor,
              );
            }
          }
          child.geometry.computeVertexNormals();
          pos.needsUpdate = true;
        }
      }
    });

    return cloned;
  }, [scene]);

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

  // Generate authentic UV textures mapped directly to the car's 3D primitives (ZERO floating planes)
  const noseTex = useMemo(
    () => generateNoseTexture(teamId, livery, sponsors),
    [teamId, livery, sponsors],
  );
  const bodyworkTex = useMemo(
    () => generateBodyworkTexture(teamId, livery, sponsors),
    [teamId, livery, sponsors],
  );
  const wingsTex = useMemo(
    () => generateWingsTexture(teamId, livery, sponsors),
    [teamId, livery, sponsors],
  );
  const floorTex = useMemo(() => generateFloorTexture(teamId, livery), [teamId, livery]);

  // Apply authentic team livery & sponsor graphics directly to the 3D car mesh
  useEffect(() => {
    if (!clonedScene) return;

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
        if (matName.includes('006') || matName.includes('011') || matName.includes('013')) {
          const orig = originalMaterialsRef.current.get(matName) || currentMat;
          newMat = new THREE.MeshStandardMaterial({
            map: orig?.map || null,
            color: new THREE.Color('#ffffff'),
            roughness: 0.55,
            metalness: 0.65,
            envMapIntensity: 1.5,
          });
        }
        // 2. Cockpit Interior & Steering Wheel (002)
        else if (matName.includes('002')) {
          const orig = originalMaterialsRef.current.get(matName) || currentMat;
          newMat = new THREE.MeshStandardMaterial({
            map: orig?.map || null,
            color: new THREE.Color('#141619'),
            roughness: 0.85,
            metalness: 0.15,
          });
        }
        // 3. Titanium Halo Safety Cell (008)
        else if (matName.includes('008')) {
          newMat = new THREE.MeshStandardMaterial({
            map: null,
            color: new THREE.Color(livery.haloColor),
            roughness: livery.haloRoughness,
            metalness: livery.haloMetalness,
            envMapIntensity: 1.6,
          });
        }
        // 4. Aerodynamic Underfloor & Chassis (001 - Prim 3)
        // Clean carbon fiber twill weave with ZERO misplaced sponsor graphics or red bleed
        else if (matName.includes('001')) {
          newMat = new THREE.MeshStandardMaterial({
            map: floorTex,
            roughness: 0.35,
            metalness: 0.2,
            envMapIntensity: 1.0,
          });
        }
        // 5. Suspension Wishbones, Pushrods & Mirrors (003 - Prim 0)
        else if (matName.includes('003')) {
          newMat = new THREE.MeshStandardMaterial({
            map: floorTex,
            roughness: 0.4,
            metalness: 0.35,
            envMapIntensity: 1.2,
          });
        }
        // 6. Rear Aero Deflectors & Diffuser (009 - Prim 4)
        else if (matName.includes('009')) {
          newMat = new THREE.MeshStandardMaterial({
            map: floorTex,
            roughness: 0.35,
            metalness: 0.25,
            envMapIntensity: 1.1,
          });
        }
        // 7. Wings Assembly: Front Wing Flaps & Rear Wing (005 - Prim 10)
        else if (matName.includes('005')) {
          newMat = new THREE.MeshPhysicalMaterial({
            map: wingsTex,
            roughness: livery.wingRoughness ?? 0.22,
            metalness: livery.wingMetalness ?? 0.35,
            clearcoat: livery.bodyClearcoat ?? 1.0,
            clearcoatRoughness: 0.08,
            envMapIntensity: (livery.bodyClearcoat ?? 1.0) > 0 ? 1.05 : 0.45,
          });
        }
        // 8. Main Bodywork: Sidepods, Engine Cover, Shark Fin & Airbox (004 - Prim 1)
        else if (matName.includes('004')) {
          newMat = new THREE.MeshPhysicalMaterial({
            map: bodyworkTex,
            roughness: livery.sidepodRoughness ?? livery.bodyRoughness ?? 0.16,
            metalness: livery.sidepodMetalness ?? 0.25,
            clearcoat: livery.bodyClearcoat ?? 1.0,
            clearcoatRoughness: 0.08,
            envMapIntensity: (livery.bodyClearcoat ?? 1.0) > 0 ? 1.2 : 0.45,
          });
        }
        // 9. Forward Monocoque & Nose Cone (007 - Prim 6)
        else if (matName.includes('007')) {
          newMat = new THREE.MeshPhysicalMaterial({
            map: noseTex,
            roughness: livery.noseRoughness ?? livery.bodyRoughness ?? 0.16,
            metalness: livery.noseMetalness ?? livery.bodyMetalness ?? 0.65,
            clearcoat: livery.bodyClearcoat ?? 1.0,
            clearcoatRoughness: 0.06,
            envMapIntensity: (livery.bodyClearcoat ?? 1.0) > 0 ? 1.3 : 0.45,
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

    return () => {
      activeMaterialsRef.current.forEach((m) => m.dispose());
      activeMaterialsRef.current = [];
      noseTex.dispose();
      bodyworkTex.dispose();
      wingsTex.dispose();
      floorTex.dispose();
    };
  }, [clonedScene, teamId, livery, noseTex, bodyworkTex, wingsTex, floorTex]);

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
useGLTF.preload('/models/c42.glb');
