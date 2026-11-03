import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  GraphicsQualityMode,
  QualityTier,
  RollingFrameMetrics,
  ADAPTIVE_DOWNGRADE_COOLDOWN_MS,
  ADAPTIVE_UPGRADE_COOLDOWN_MS,
  STARTUP_GRACE_PERIOD_MS,
  ADAPTIVE_THRESHOLDS,
} from '../performance/core';

interface ShowroomAdaptiveQualityMonitorProps {
  active: boolean;
  mode: GraphicsQualityMode;
  currentTier: QualityTier;
  startupReady: boolean;
  onTierChange: (newTier: QualityTier) => void;
  sceneRevision: string;
}

interface AdaptiveDiagnosticsWindow extends Window {
  __SHOWROOM_ADAPTIVE_STATS__?: () => {
    mode: GraphicsQualityMode;
    currentTier: QualityTier;
    rollingFps: number;
    rollingFrameTimeMs: number;
    p95FrameTimeMs: number;
    sampleCount: number;
    cooldownRemainingMs: number;
  };
}

const diagnosticsEnabled = (): boolean =>
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('showroomDiagnostics');

export const ShowroomAdaptiveQualityMonitor: React.FC<ShowroomAdaptiveQualityMonitorProps> = ({
  active,
  mode,
  currentTier,
  startupReady,
  onTierChange,
  sceneRevision,
}) => {
  const metricsRef = useRef(new RollingFrameMetrics(120));
  const mountTimeRef = useRef(0);
  const lastChangeTimeRef = useRef(0);
  const prevRevisionRef = useRef(sceneRevision);
  const prevStartupReadyRef = useRef(startupReady);

  useEffect(() => {
    mountTimeRef.current = performance.now();
  }, []);

  // When scene switches (e.g. team change), restart grace period and clear frame buffer
  // so shader compilation or texture generation bursts never falsely trigger a quality downgrade.
  useEffect(() => {
    if (prevRevisionRef.current !== sceneRevision || prevStartupReadyRef.current !== startupReady) {
      prevRevisionRef.current = sceneRevision;
      prevStartupReadyRef.current = startupReady;
      mountTimeRef.current = performance.now();
      metricsRef.current.clear();
    }
  }, [sceneRevision, startupReady]);

  // Expose diagnostics for test harness and developer inspection
  useEffect(() => {
    if (!diagnosticsEnabled()) return;
    const diagWin = window as AdaptiveDiagnosticsWindow;
    diagWin.__SHOWROOM_ADAPTIVE_STATS__ = () => {
      const now = performance.now();
      const lastChange = lastChangeTimeRef.current;
      const cooldownRemaining = Math.max(0, lastChange + ADAPTIVE_DOWNGRADE_COOLDOWN_MS - now);
      const metrics = metricsRef.current;
      return {
        mode,
        currentTier,
        rollingFps: Number(metrics.averageFps.toFixed(1)),
        rollingFrameTimeMs: Number(metrics.averageFrameTime.toFixed(2)),
        p95FrameTimeMs: Number(metrics.getP95FrameTime().toFixed(2)),
        sampleCount: metrics.count,
        cooldownRemainingMs: Math.round(cooldownRemaining),
      };
    };

    return () => {
      delete diagWin.__SHOWROOM_ADAPTIVE_STATS__;
    };
  }, [currentTier, mode]);

  useFrame((_, delta) => {
    if (!active || !startupReady || mode !== 'auto') return;

    const now = performance.now();
    // 1. Startup & model/shader compilation grace window
    if (now - mountTimeRef.current < STARTUP_GRACE_PERIOD_MS) {
      return;
    }

    // 2. Filter frame delta to discard idle gaps (demand frameloop)
    const frameMs = delta * 1000;
    if (frameMs < 1 || frameMs > 180) {
      return;
    }

    metricsRef.current.add(frameMs);
    const metrics = metricsRef.current;

    // 3. Downgrade Check (sustained frame-time degradation)
    if (
      metrics.count >= ADAPTIVE_THRESHOLDS.downgradeMinSamples &&
      now - lastChangeTimeRef.current > ADAPTIVE_DOWNGRADE_COOLDOWN_MS
    ) {
      const avgFrameTime = metrics.averageFrameTime;
      if (avgFrameTime > ADAPTIVE_THRESHOLDS.downgradeFrameTimeMs) {
        if (currentTier === 'high') {
          lastChangeTimeRef.current = now;
          metrics.clear();
          onTierChange('average');
          return;
        } else if (currentTier === 'average') {
          lastChangeTimeRef.current = now;
          metrics.clear();
          onTierChange('performance');
          return;
        }
      }
    }

    // 4. Upgrade Check (sustained stable performance)
    if (
      metrics.count >= ADAPTIVE_THRESHOLDS.upgradeMinSamples &&
      now - lastChangeTimeRef.current > ADAPTIVE_UPGRADE_COOLDOWN_MS
    ) {
      const avgFrameTime = metrics.averageFrameTime;
      if (avgFrameTime < ADAPTIVE_THRESHOLDS.upgradeFrameTimeMs) {
        if (currentTier === 'performance') {
          lastChangeTimeRef.current = now;
          metrics.clear();
          onTierChange('average');
          return;
        } else if (currentTier === 'average') {
          lastChangeTimeRef.current = now;
          metrics.clear();
          onTierChange('high');
          return;
        }
      }
    }
  });

  return null;
};
