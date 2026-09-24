import { create } from 'zustand';
import { CarId, ViewMode, CameraPreset } from '../types';

interface CarStoreState {
  selectedCarId: CarId;
  isExploded: boolean;
  explodedProgress: number; // 0.0 to 1.0
  viewMode: ViewMode;
  drsActive: boolean;
  windTunnelActive: boolean;
  selectedPartId: string | null;
  cameraPreset: CameraPreset;
  wireframe: boolean;

  // Actions
  setCarId: (id: CarId) => void;
  toggleExploded: () => void;
  setExplodedProgress: (progress: number) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleDrs: () => void;
  toggleWindTunnel: () => void;
  selectPart: (partId: string | null) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  toggleWireframe: () => void;
}

export const useCarStore = create<CarStoreState>((set) => ({
  selectedCarId: 'rb20',
  isExploded: false,
  explodedProgress: 0,
  viewMode: 'showroom',
  drsActive: false,
  windTunnelActive: false,
  selectedPartId: null,
  cameraPreset: 'isometric',
  wireframe: false,

  setCarId: (id) => set({ selectedCarId: id, selectedPartId: null }),
  
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
}));
