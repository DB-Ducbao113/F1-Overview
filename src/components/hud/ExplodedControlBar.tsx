import React from 'react';
import { useCarStore } from '../../store/useCarStore';
import { Play, RotateCcw, Zap, Sparkles } from 'lucide-react';

export const ExplodedControlBar: React.FC = () => {
  const {
    isExploded,
    explodedProgress,
    toggleExploded,
    setExplodedProgress,
    drsActive,
    toggleDrs,
  } = useCarStore();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setExplodedProgress(val);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto w-[92%] max-w-xl">
      <div className="bg-zinc-950/85 backdrop-blur-xl border border-zinc-800/80 p-4 rounded-2xl shadow-2xl flex flex-col gap-3">
        {/* Top row: Button & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleExploded}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 border ${
                isExploded
                  ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-lg shadow-red-900/30'
                  : 'bg-zinc-800 text-zinc-200 border-zinc-700 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              {isExploded ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Thu Hồi (Assemble)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Giải Phẫu 3D (Explode)</span>
                </>
              )}
            </button>

            {/* DRS Active Wing Trigger */}
            <button
              onClick={toggleDrs}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold tracking-wider font-mono uppercase transition-all duration-200 border ${
                drsActive
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/60 shadow-lg shadow-emerald-900/30'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
              }`}
              title="Kích hoạt cánh gió DRS phía sau"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>DRS: {drsActive ? 'OPEN' : 'CLOSED'}</span>
            </button>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono text-zinc-400 block">
              Độ Bung Linh Kiện: <span className="text-cyan-400 font-bold">{Math.round(explodedProgress * 100)}%</span>
            </span>
          </div>
        </div>

        {/* Range Slider for Manual Scrollytelling Scrubbing */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            0% (Khép)
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={explodedProgress}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            100% (Bung)
          </span>
        </div>
      </div>
    </div>
  );
};
