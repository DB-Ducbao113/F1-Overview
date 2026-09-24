import React, { Suspense, useMemo } from 'react';
import { useGLTF, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { useCarStore } from '../../store/useCarStore';
import { CARS_DATA } from '../../data/cars';
import { CarId } from '../../types';
import { CarModelAssembly } from './CarModelAssembly';
import { Hotspots } from './Hotspots';
import { Loader2 } from 'lucide-react';

// 3D Loading spinner while downloading heavy GLB files
export const Model3DLoader: React.FC = () => {
  const { progress } = useProgress();
  const { lang } = useCarStore();

  return (
    <Html center distanceFactor={6}>
      <div className="flex flex-col items-center gap-3 bg-white/95 px-6 py-4 rounded-sm border border-studio-300 shadow-luxury backdrop-blur-md">
        <Loader2 className="w-6 h-6 text-f1red animate-spin" />
        <div className="text-center">
          <p className="text-[11px] font-body uppercase tracking-wider font-bold text-studio-950">
            {lang === 'vi' ? 'Đang nạp mô hình 3D thực tế...' : 'Loading Real 3D Model...'}
          </p>
          <p className="text-[10px] font-body text-studio-500 mt-0.5">
            {Math.round(progress)}%
          </p>
        </div>
        <div className="w-24 h-1 bg-studio-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-f1red transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Html>
  );
};

// GLB Mesh Instance with auto-centering, scaling, and team-specific PBR materials
const GLBMeshRenderer: React.FC<{ url: string; carId: CarId }> = ({ url, carId }) => {
  const { scene } = useGLTF(url);
  const car = CARS_DATA[carId] || CARS_DATA.rb20;

  const clonedScene = useMemo(() => {
    const clone = scene.clone();

    // Compute bounding box to normalize scale and floor height
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    // Standard F1 car length is approx 5.5 meters; normalize model so maxDim ~ 5.3
    const targetScale = 5.3 / (maxDim || 1);
    clone.scale.set(targetScale, targetScale, targetScale);

    // Recompute bounding box after scale to position wheels firmly on the ground
    const scaledBox = new THREE.Box3().setFromObject(clone);
    const center = new THREE.Vector3();
    scaledBox.getCenter(center);
    clone.position.x = -center.x;
    clone.position.y = -scaledBox.min.y + 0.02; // Sits exactly on ground grid
    clone.position.z = -center.z;

    // Enhance materials with team PBR livery
    clone.traverse((node: any) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;

        if (Array.isArray(node.material)) {
          node.material = node.material.map((mat: any, idx: number) => {
            const m = mat.clone();
            if (idx === 0 || idx === 1) {
              m.color = new THREE.Color(car.primaryColor);
              m.roughness = 0.22;
              m.metalness = 0.75;
            } else if (idx === 2) {
              m.color = new THREE.Color(car.accentColor);
              m.roughness = 0.25;
            }
            return m;
          });
        } else if (node.material) {
          node.material = node.material.clone();
          node.material.roughness = Math.min(node.material.roughness, 0.4);
          node.material.envMapIntensity = 1.3;
        }
      }
    });

    return clone;
  }, [scene, carId]);

  return <primitive object={clonedScene} />;
};

// Main Model Viewer with auto-detection of real GLB or bespoke procedural aerodynamic model
export const RealModelViewer: React.FC = () => {
  const { selectedCarId, isExploded, explodedProgress, customModelUrl, modelMode } = useCarStore();

  // If user triggers exploded disassembly view, seamlessly show exploded anatomical model
  if (isExploded || explodedProgress > 0.05) {
    return <CarModelAssembly />;
  }

  // If user uploaded a custom .glb/.gltf model
  if (customModelUrl) {
    return (
      <group>
        <Hotspots />
        <Suspense fallback={<Model3DLoader />}>
          <GLBMeshRenderer url={customModelUrl} carId={selectedCarId} />
        </Suspense>
      </group>
    );
  }

  // If user explicitly chose Real AR GLB mode, load the high-poly official Ground Effect C42 GLB
  if (modelMode === 'real') {
    return (
      <group>
        <Hotspots />
        <Suspense fallback={<Model3DLoader />}>
          <GLBMeshRenderer url="/models/c42.glb" carId={selectedCarId} />
        </Suspense>
      </group>
    );
  }

  // Default: Team-specific bespoke 2024 aerodynamic packages (Red Bull, Ferrari, McLaren, Mercedes)
  return <CarModelAssembly />;
};
