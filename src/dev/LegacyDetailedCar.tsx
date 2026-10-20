import React, { useLayoutEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getEDSLivery, type EDSLiveryId } from '../data/showroom/edsLiveries';
import {
  applyLegacyEDSSkin,
  createLegacyEDSSkin,
  getLegacySkinSlot,
  type LegacySkinSlot,
} from './LegacyEDSSkinEngine';

export interface LegacyDetailedCarStats {
  meshCount: number;
  sharedGeometryCount: number;
  geometryPreserved: boolean;
  ownedMaterialCount: number;
  ownedTextureCount: number;
}

interface LegacyDetailedCarProps {
  liveryId: EDSLiveryId;
  original: boolean;
  onReady: (stats: LegacyDetailedCarStats) => void;
}

export const LegacyDetailedCar: React.FC<LegacyDetailedCarProps> = ({
  liveryId,
  original,
  onReady,
}) => {
  const { scene } = useGLTF('/models/c42.v2.glb');
  const gl = useThree((state) => state.gl);
  const neutralBaseline = useMemo(() => {
    const create = (slot: LegacySkinSlot, color: string, roughness: number, metalness: number) =>
      new THREE.MeshPhysicalMaterial({
        name: `EDS_DEV_NEUTRAL_${slot}`,
        color,
        roughness,
        metalness,
        clearcoat: slot === 'bodywork' || slot === 'nose' || slot === 'halo' ? 0.42 : 0.08,
        clearcoatRoughness: 0.2,
        envMapIntensity: 1.05,
      });
    const materials: Record<LegacySkinSlot, THREE.Material> = {
      nose: create('nose', '#737d87', 0.32, 0.38),
      bodywork: create('bodywork', '#69737e', 0.34, 0.34),
      wings: create('wings', '#242b32', 0.55, 0.16),
      floor: create('floor', '#20262c', 0.65, 0.08),
      suspension: create('suspension', '#3c454e', 0.42, 0.58),
      diffuser: create('diffuser', '#252b32', 0.58, 0.18),
      cockpit: create('cockpit', '#171c21', 0.7, 0.08),
      halo: create('halo', '#66717c', 0.3, 0.48),
      wheels: create('wheels', '#111419', 0.72, 0.12),
    };
    const clonedScene = scene.clone(true);
    clonedScene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const current = Array.isArray(object.material) ? object.material[0] : object.material;
      object.material = materials[getLegacySkinSlot(current?.name ?? object.name)];
    });
    return { clonedScene, materials };
  }, [scene]);
  const skin = useMemo(
    () => createLegacyEDSSkin(getEDSLivery(liveryId), gl.capabilities.getMaxAnisotropy()),
    [gl, liveryId],
  );
  const skinned = useMemo(() => applyLegacyEDSSkin(scene, skin), [scene, skin]);
  const displayedScene = original ? neutralBaseline.clonedScene : skinned.clonedScene;

  useLayoutEffect(() => {
    displayedScene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.castShadow = true;
      object.receiveShadow = true;
    });
    onReady({
      meshCount: skinned.meshCount,
      sharedGeometryCount: skinned.sharedGeometryCount,
      geometryPreserved: skinned.meshCount === skinned.sharedGeometryCount,
      ownedMaterialCount: Object.keys(original ? neutralBaseline.materials : skin.materials).length,
      ownedTextureCount: original ? 0 : Object.keys(skin.textures).length,
    });
  }, [
    displayedScene,
    neutralBaseline.materials,
    onReady,
    original,
    skin,
    skinned.meshCount,
    skinned.sharedGeometryCount,
  ]);

  useLayoutEffect(() => () => skin.dispose(), [skin]);
  useLayoutEffect(
    () => () => Object.values(neutralBaseline.materials).forEach((material) => material.dispose()),
    [neutralBaseline.materials],
  );

  return <primitive object={displayedScene} scale={0.105} rotation={[0, Math.PI, 0]} />;
};

useGLTF.preload('/models/c42.v2.glb');
