import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { F1Car3DModel } from './F1Car3DModel';
import { CameraController, type CameraPreset } from './CameraController';
import { Showroom3DLoader } from './Showroom3DLoader';
import { StudioW15Stage } from './StudioW15Stage';
import type { HotspotItem } from '../../data/showroom/hotspotsData';
import type { TeamId } from '../../types';

interface ShowroomSceneProps {
  selectedTeamId: TeamId;
  lang: 'vi' | 'en';
  isCanvasActive: boolean;
  sceneRevision: string;
  activeHotspot: HotspotItem | null;
  handleSelectHotspot: (hotspot: HotspotItem) => void;
  showHotspots: boolean;
  cameraPreset: CameraPreset | null;
  presetTrigger: number;
  autoRotate: boolean;
  enableWheelZoom: boolean;
  zoomTrigger: number;
  zoomDirection: 'in' | 'out' | null;
  onContextStateChange: (isLost: boolean) => void;
}

const WebGLContextGuard: React.FC<{
  onContextStateChange: (isLost: boolean) => void;
}> = ({ onContextStateChange }) => {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLost = (event: Event) => {
      event.preventDefault();
      onContextStateChange(true);
    };
    const handleRestored = () => onContextStateChange(false);

    canvas.addEventListener('webglcontextlost', handleLost);
    canvas.addEventListener('webglcontextrestored', handleRestored);
    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost);
      canvas.removeEventListener('webglcontextrestored', handleRestored);
    };
  }, [gl, onContextStateChange]);

  return null;
};

const ShowroomFrameInvalidator: React.FC<{
  active: boolean;
  sceneRevision: string;
}> = ({ active, sceneRevision }) => {
  const { invalidate, size } = useThree();

  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate, sceneRevision, size.height, size.width]);

  return null;
};

export const ShowroomScene: React.FC<ShowroomSceneProps> = ({
  selectedTeamId,
  lang,
  isCanvasActive,
  sceneRevision,
  activeHotspot,
  handleSelectHotspot,
  showHotspots,
  cameraPreset,
  presetTrigger,
  autoRotate,
  enableWheelZoom,
  zoomTrigger,
  zoomDirection,
  onContextStateChange,
}) => (
  <Canvas
    shadows
    dpr={[1, 1.25]}
    frameloop={isCanvasActive ? 'demand' : 'never'}
    camera={{ position: [3.4, 1.25, -2.8], fov: 38 }}
    gl={{
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      toneMappingExposure: 1.2,
    }}
    className="w-full h-full cursor-grab active:cursor-grabbing"
  >
    <WebGLContextGuard onContextStateChange={onContextStateChange} />
    <ShowroomFrameInvalidator active={isCanvasActive} sceneRevision={sceneRevision} />
    {/* ── Authentic Studio W15 Photography Stage (Cyclorama cove, overhead softbox rig, rim lights & mirror floor) ── */}
    <StudioW15Stage teamId={selectedTeamId} lang={lang} />

    {/* F1 3D Car Model with Suspense Loading HUD */}
    <Suspense fallback={<Showroom3DLoader />}>
      <F1Car3DModel
        teamId={selectedTeamId}
        activeHotspot={activeHotspot}
        onSelectHotspot={handleSelectHotspot}
        lang={lang}
        showHotspots={showHotspots}
      />
    </Suspense>

    {/* Dynamic Ground Contact Shadows */}
    <ContactShadows
      position={[0, 0, 0]}
      opacity={0.9}
      scale={10}
      blur={2.0}
      far={4.5}
      frames={1}
      resolution={256}
      color="#000000"
    />

    {/* Smooth Camera Controller & OrbitControls */}
    <CameraController
      activeHotspot={activeHotspot}
      cameraPreset={cameraPreset}
      presetTrigger={presetTrigger}
      autoRotate={autoRotate}
      enableWheelZoom={enableWheelZoom}
      zoomTrigger={zoomTrigger}
      zoomDirection={zoomDirection}
    />
  </Canvas>
);
