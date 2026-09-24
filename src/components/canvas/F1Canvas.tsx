import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Grid } from '@react-three/drei';
import { CarModelAssembly } from './CarModelAssembly';
import { WindTunnelStreamlines } from './WindTunnelStreamlines';
import { CameraController } from './CameraController';

export const F1Canvas: React.FC = () => {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        camera={{ position: [3.8, 2.0, 3.6], fov: 42 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#08080b']} />
        <fog attach="fog" args={['#08080b', 8, 20]} />

        {/* Studio Lighting System */}
        <ambientLight intensity={0.4} />
        
        {/* Overhead Track Spotlights */}
        <directionalLight
          position={[5, 8, 4]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        
        {/* Soft Cool Rim Light (emphasizes carbon curves) */}
        <directionalLight position={[-6, 4, -4]} intensity={1.2} color="#00f0ff" />
        
        {/* Warm Rear Exhaust Accent Light */}
        <directionalLight position={[0, 2, -6]} intensity={0.9} color="#ff3b30" />
        
        {/* Front Nose Key Spotlight */}
        <spotLight
          position={[0, 5, 5]}
          intensity={2.2}
          angle={0.6}
          penumbra={0.8}
          color="#ffffff"
          castShadow
        />

        <Suspense fallback={null}>
          {/* Main 3D F1 Assembly */}
          <CarModelAssembly />

          {/* Aerodynamic Wind Tunnel Smoke Streamlines */}
          <WindTunnelStreamlines />

          {/* Contact Shadows on Floor */}
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.85}
            scale={10}
            blur={1.5}
            far={4.5}
            resolution={1024}
            color="#000000"
          />

          {/* High-Tech Showroom Floor Grid */}
          <Grid
            position={[0, 0, 0]}
            args={[20, 20]}
            cellSize={0.5}
            cellThickness={0.6}
            cellColor="#181822"
            sectionSize={2.0}
            sectionThickness={1.2}
            sectionColor="#27273a"
            fadeDistance={15}
            fadeStrength={1.5}
          />

          {/* Dynamic Orbit & Preset Camera Controller */}
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
};
