import React from 'react';
import { F1Canvas } from './components/canvas/F1Canvas';
import { Header } from './components/hud/Header';
import { TelemetryHUD } from './components/hud/TelemetryHUD';
import { CameraPresetsBar } from './components/hud/CameraPresetsBar';
import { ExplodedControlBar } from './components/hud/ExplodedControlBar';
import { PartInspectionModal } from './components/hud/PartInspectionModal';
import { useCarStore } from './store/useCarStore';
import { ANATOMY_PARTS } from './data/parts';
import { MousePointerClick, Info } from 'lucide-react';

export const App: React.FC = () => {
  const { selectedPartId, selectPart } = useCarStore();

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#08080b]">
      {/* 3D Scene Canvas */}
      <F1Canvas />

      {/* Top Header */}
      <Header />

      {/* Left Aerodynamic Telemetry HUD */}
      <TelemetryHUD />

      {/* Camera Angle Presets */}
      <CameraPresetsBar />

      {/* Center Exploded View / Scrolly Scrub Control */}
      <ExplodedControlBar />

      {/* Right Slide-in Part Detail Modal */}
      <PartInspectionModal />

      {/* Bottom Right: Quick Parts Inspection Drawer */}
      <div className="absolute top-24 right-6 z-20 pointer-events-auto hidden md:flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto pr-1">
        {!selectedPartId && (
          <div className="bg-zinc-950/75 backdrop-blur-md p-2.5 rounded-xl border border-zinc-800 text-[11px] font-mono text-zinc-400 w-52 shadow-xl mb-1 flex items-center gap-2">
            <MousePointerClick className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Click linh kiện trên xe hoặc chọn bên dưới:</span>
          </div>
        )}

        {!selectedPartId &&
          ANATOMY_PARTS.map((part) => (
            <button
              key={part.id}
              onClick={() => selectPart(part.id)}
              className="text-left px-3 py-1.5 rounded-lg text-xs font-mono bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 hover:border-cyan-500/50 hover:bg-zinc-800/80 text-zinc-300 hover:text-white transition-all flex items-center justify-between group"
            >
              <span className="truncate">{part.vietnameseName}</span>
              <span className="text-[10px] text-zinc-500 group-hover:text-cyan-400">
                {part.weightKg}kg
              </span>
            </button>
          ))}
      </div>

      {/* Subdued Bottom Guide */}
      <div className="absolute bottom-2 left-6 z-10 pointer-events-none hidden sm:flex items-center gap-2 text-[11px] font-mono text-zinc-600">
        <Info className="w-3.5 h-3.5" />
        <span>Kéo chuột để xoay 360° • Cuộn để Zoom • Click linh kiện để giải phẫu</span>
      </div>
    </main>
  );
};

export default App;
