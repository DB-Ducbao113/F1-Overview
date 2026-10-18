import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';

const LegacyGeometry = () => {
  const { scene } = useGLTF('/models/c42.v2.glb');
  return <primitive object={scene.clone(true)} scale={0.105} rotation={[0, Math.PI, 0]} />;
};

export const LegacyShowroomComparison: React.FC = () => (
  <main className="min-h-screen bg-studio-950 text-white p-4 sm:p-8">
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
        <p className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
          DEV ONLY · EXCLUDED FROM COMMERCIAL BUILD
        </p>
        <h1 className="mt-1 font-display text-2xl font-black uppercase">
          Legacy C42 geometry comparison
        </h1>
        <p className="mt-2 text-sm text-studio-300">
          Local engineering reference only. This entry is not linked by the application and is
          rejected by the commercial artifact guard.
        </p>
      </div>
      <div className="h-[72vh] min-h-[520px] overflow-hidden rounded-2xl border border-studio-800 bg-[#07080c]">
        <Canvas camera={{ position: [3.2, 1.35, -3.1], fov: 38 }}>
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 7, -4]} intensity={2.2} />
          <Suspense fallback={null}>
            <LegacyGeometry />
          </Suspense>
          <Environment preset="studio" />
          <OrbitControls makeDefault enableDamping minDistance={1.2} maxDistance={8} />
        </Canvas>
      </div>
    </div>
  </main>
);
