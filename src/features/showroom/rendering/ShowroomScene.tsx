import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { StudioContactShadows } from './StudioContactShadows';
import { F1Car3DModel } from './F1Car3DModel';
import { CameraController } from './CameraController';
import { StudioW15Stage } from './StudioW15Stage';
import { ShowroomStartupCoordinator } from './ShowroomStartupCoordinator';
import { ensureSafeCompileAsync } from './safeCompileAsync';
import {
  GraphicsQualityMode,
  QualityTier,
  QualityProfile,
  DESKTOP_QUALITY_PROFILES,
} from '../performance/core';
import { ShowroomAdaptiveQualityMonitor } from './ShowroomAdaptiveQualityMonitor';
import { disposeAll, getCacheStats } from './resources/showroomTextureCache';

import type { HotspotItem } from '../data/hotspotsData';
import type { TeamId } from '../../../types';

interface ShowroomDiagnosticsWindow extends Window {
  __SHOWROOM_RENDERER_STATS__?: () => {
    memory: { geometries: number; textures: number };
    render: { calls: number; triangles: number };
    programs?: number;
  };
  __SHOWROOM_CACHE_STATS__?: () => {
    car: ReturnType<typeof getCacheStats>;
    studio: ReturnType<typeof getCacheStats>;
  };
}

const diagnosticsEnabled = (): boolean =>
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('showroomDiagnostics');

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

const ShowroomResourceDiagnostics: React.FC<{
  qualityMode?: GraphicsQualityMode;
  qualityTier?: QualityTier;
  qualityProfile?: QualityProfile;
}> = ({ qualityMode, qualityTier, qualityProfile }) => {
  const { gl } = useThree();

  useEffect(() => {
    if (!diagnosticsEnabled()) return;
    const diagnosticsWindow = window as ShowroomDiagnosticsWindow;
    diagnosticsWindow.__SHOWROOM_RENDERER_STATS__ = () => ({
      memory: { ...gl.info.memory },
      render: { ...gl.info.render },
      programs: gl.info.programs?.length ?? 0,
      activeProfile: {
        mode: qualityMode,
        tier: qualityTier,
        profile: qualityProfile,
      },
    });
    diagnosticsWindow.__SHOWROOM_CACHE_STATS__ = () => ({
      car: getCacheStats('car'),
      studio: getCacheStats('studio'),
    });
    return () => {
      delete diagnosticsWindow.__SHOWROOM_RENDERER_STATS__;
      delete diagnosticsWindow.__SHOWROOM_CACHE_STATS__;
    };
  }, [gl, qualityMode, qualityTier, qualityProfile]);

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

interface ShowroomSceneProps {
  selectedTeamId: TeamId;
  lang: 'vi' | 'en';
  isCanvasActive: boolean;
  frameloopMode: 'demand' | 'never';
  sceneRevision: string;
  activeHotspot: HotspotItem | null;
  handleSelectHotspot: (hotspot: HotspotItem) => void;
  showHotspots: boolean;
  startupSceneKey: string;
  handleScenePartReady: (sceneKey: string, part: 'car' | 'studio') => void;
  cameraPreset: string | null;
  presetTrigger: number;
  autoRotate: boolean;
  startupReady: boolean;
  reducedMotion: boolean;
  enableWheelZoom: boolean;
  zoomTrigger: number;
  zoomDirection: 'in' | 'out' | null;
  onContextStateChange: (isLost: boolean) => void;
  isCarReady: boolean;
  isStudioReady: boolean;
  setUsableSceneKey: (key: string) => void;
  qualityMode?: GraphicsQualityMode;
  qualityTier?: QualityTier;
  qualityProfile?: QualityProfile;
  onTierChange?: (newTier: QualityTier) => void;
}

/**
 * WebGL layer of the Showroom, lazy-loaded behind the shell so the shell
 * chunk renders without the three.js bundle (release-gate contract from
 * main's check-showroom-bundle). Contains the reviewed branch lifecycle
 * verbatim: the M3B.1 frame invalidator, the M3B.2 reduced-motion camera,
 * M3B.3 cache-backed car textures, and the M3B.4 startup coordinator.
 */

export const ShowroomScene: React.FC<ShowroomSceneProps> = ({
  selectedTeamId,
  lang,
  isCanvasActive,
  frameloopMode,
  sceneRevision,
  activeHotspot,
  handleSelectHotspot,
  showHotspots,
  startupSceneKey,
  handleScenePartReady,
  cameraPreset,
  presetTrigger,
  autoRotate,
  startupReady,
  reducedMotion,
  enableWheelZoom,
  zoomTrigger,
  zoomDirection,
  onContextStateChange,
  isCarReady,
  isStudioReady,
  setUsableSceneKey,
  qualityMode = 'auto',
  qualityTier = 'high',
  qualityProfile = DESKTOP_QUALITY_PROFILES.high,
  onTierChange = () => {},
}) => {
  useEffect(() => {
    return () => {
      disposeAll();
    };
  }, []);

  return (
    <Canvas
      shadows={qualityProfile.shadows}
      dpr={qualityProfile.dpr}
      frameloop={frameloopMode}
      camera={{ position: [3.4, 1.25, -2.8], fov: 38 }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        toneMappingExposure: 1.2,
      }}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      onCreated={({ gl }) => {
        ensureSafeCompileAsync(gl);
      }}
    >
      <WebGLContextGuard onContextStateChange={onContextStateChange} />
      <ShowroomStartupCoordinator
        sceneKey={startupSceneKey}
        active={isCanvasActive}
        carReady={isCarReady}
        studioReady={isStudioReady}
        onFirstUsableFrame={setUsableSceneKey}
      />
      <ShowroomFrameInvalidator active={isCanvasActive} sceneRevision={sceneRevision} />
      <ShowroomAdaptiveQualityMonitor
        active={isCanvasActive}
        mode={qualityMode}
        currentTier={qualityTier}
        startupReady={startupReady}
        onTierChange={onTierChange}
        sceneRevision={sceneRevision}
      />
      {/* ── Authentic Studio W15 Photography Stage (Cyclorama cove, overhead softbox rig, rim lights & mirror floor) ── */}
      <StudioW15Stage
        teamId={selectedTeamId}
        lang={lang}
        readinessKey={startupSceneKey}
        onScenePartReady={handleScenePartReady}
        qualityProfile={qualityProfile}
      />

      {/* F1 3D Car Model with Suspense Loading HUD */}
      <Suspense fallback={null}>
        <F1Car3DModel
          teamId={selectedTeamId}
          activeHotspot={activeHotspot}
          onSelectHotspot={handleSelectHotspot}
          lang={lang}
          showHotspots={showHotspots}
          readinessKey={startupSceneKey}
          onScenePartReady={handleScenePartReady}
          qualityProfile={qualityProfile}
        />
      </Suspense>

      {/* Dynamic Ground Contact Shadows */}
      {qualityProfile.contactShadows && (
        <StudioContactShadows
          position={[0, 0, 0]}
          opacity={0.9}
          scale={10}
          blur={qualityProfile.contactShadowBlur}
          far={4.5}
          frames={1}
          resolution={qualityProfile.contactShadowResolution}
          color="#000000"
        />
      )}

      {/* Smooth Camera Controller & OrbitControls */}
      <CameraController
        activeHotspot={activeHotspot}
        cameraPreset={cameraPreset as Parameters<typeof CameraController>[0]['cameraPreset']}
        presetTrigger={presetTrigger}
        autoRotate={autoRotate}
        startupReady={startupReady}
        reducedMotion={reducedMotion}
        enableWheelZoom={enableWheelZoom}
        zoomTrigger={zoomTrigger}
        zoomDirection={zoomDirection}
      />
      {diagnosticsEnabled() && (
        <ShowroomResourceDiagnostics
          qualityMode={qualityMode}
          qualityTier={qualityTier}
          qualityProfile={qualityProfile}
        />
      )}
    </Canvas>
  );
};
