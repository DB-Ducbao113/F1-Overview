import { create } from 'zustand';
import { CarId, ViewMode, CameraPreset, NavTab } from '../types';

export type Language = 'vi' | 'en';

interface CarStoreState {
  // Localization
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;

  // Navigation
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  // 3D State
  selectedCarId: CarId;
  isExploded: boolean;
  explodedProgress: number; // 0.0 to 1.0
  viewMode: ViewMode;
  drsActive: boolean;
  windTunnelActive: boolean;
  selectedPartId: string | null;
  cameraPreset: CameraPreset;
  wireframe: boolean;

  // Display toggles
  showTelemetry: boolean; // default false so car is not blocked
  showHotspots: boolean;
  zenMode: boolean; // 100% full screen view without HUD

  // Model Mode: 'real' (external high-poly GLB) or 'aero' (bespoke aerodynamic design)
  modelMode: 'real' | 'aero';
  setModelMode: (mode: 'real' | 'aero') => void;
  customModelUrl: string | null;
  setCustomModelUrl: (url: string | null) => void;

  // Actions
  setCarId: (id: CarId) => void;
  openCarIn3D: (id: CarId) => void;
  inspectPartIn3D: (partId: string) => void;
  toggleExploded: () => void;
  setExplodedProgress: (progress: number) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleDrs: () => void;
  toggleWindTunnel: () => void;
  selectPart: (partId: string | null) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  toggleWireframe: () => void;
  toggleTelemetry: () => void;
  toggleHotspots: () => void;
  toggleZenMode: () => void;
}

export const useCarStore = create<CarStoreState>((set) => ({
  lang: 'vi',
  setLang: (lang) => set({ lang }),
  toggleLang: () => set((state) => ({ lang: state.lang === 'vi' ? 'en' : 'vi' })),

  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),

  selectedCarId: 'w15',
  isExploded: false,
  explodedProgress: 0,
  viewMode: 'showroom',
  drsActive: false,
  windTunnelActive: false,
  selectedPartId: null,
  cameraPreset: 'isometric',
  wireframe: false,

  // HUD view controls: Telemetry is collapsed by default so the car is completely visible
  showTelemetry: false,
  showHotspots: true,
  zenMode: false,

  modelMode: 'aero',
  setModelMode: (mode) => set({ modelMode: mode }),
  customModelUrl: null,
  setCustomModelUrl: (url) => set({ customModelUrl: url }),

  setCarId: (id) => set({ selectedCarId: id, selectedPartId: null }),

  openCarIn3D: (id) => set({
    selectedCarId: id,
    selectedPartId: null,
    activeTab: 'models',
    cameraPreset: 'isometric',
    explodedProgress: 0,
    isExploded: false,
    showTelemetry: false,
    zenMode: false,
  }),

  inspectPartIn3D: (partId) => set({
    selectedPartId: partId,
    activeTab: 'models',
    isExploded: true,
    explodedProgress: 0.65,
    showTelemetry: false,
  }),
  
  toggleExploded: () => set((state) => {
    const nextState = !state.isExploded;
    return {
      isExploded: nextState,
      explodedProgress: nextState ? 1 : 0
    };
  }),

  setExplodedProgress: (progress) => set({
    explodedProgress: progress,
    isExploded: progress > 0.05
  }),

  setViewMode: (mode) => set({
    viewMode: mode,
    wireframe: mode === 'xray',
    windTunnelActive: mode === 'aero'
  }),

  toggleDrs: () => set((state) => ({ drsActive: !state.drsActive })),

  toggleWindTunnel: () => set((state) => ({
    windTunnelActive: !state.windTunnelActive,
    viewMode: !state.windTunnelActive ? 'aero' : 'showroom'
  })),

  selectPart: (partId) => set({ selectedPartId: partId }),

  setCameraPreset: (preset) => set({ cameraPreset: preset }),

  toggleWireframe: () => set((state) => ({
    wireframe: !state.wireframe,
    viewMode: !state.wireframe ? 'xray' : 'showroom'
  })),

  toggleTelemetry: () => set((state) => ({ showTelemetry: !state.showTelemetry })),
  toggleHotspots: () => set((state) => ({ showHotspots: !state.showHotspots })),
  toggleZenMode: () => set((state) => ({ zenMode: !state.zenMode })),
}));
