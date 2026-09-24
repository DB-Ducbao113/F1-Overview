import React from 'react';
import { useCarStore } from '../../store/useCarStore';
import { ANATOMY_PARTS } from '../../data/parts';
import { X, Wrench, Shield, Zap, CircleDot, ArrowRight } from 'lucide-react';

export const PartInspectionModal: React.FC = () => {
  const { selectedPartId, selectPart } = useCarStore();

  if (!selectedPartId) return null;

  const part = ANATOMY_PARTS.find((p) => p.id === selectedPartId);
  if (!part) return null;

  return (
    <div className="absolute top-24 right-6 z-30 pointer-events-auto w-80 max-w-[90vw] animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-zinc-950/90 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-5 shadow-2xl shadow-cyan-950/40">
        {/* Header with Close */}
        <div className="flex items-start justify-between gap-2 border-b border-zinc-800 pb-3 mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block mb-1">
              Phân Tích Giải Phẫu 3D
            </span>
            <h3 className="text-base font-bold text-white leading-tight">
              {part.vietnameseName}
            </h3>
            <span className="text-xs text-zinc-400 font-mono">{part.name}</span>
          </div>
          <button
            onClick={() => selectPart(null)}
            className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Technical Attributes */}
        <div className="space-y-3 font-mono text-xs mb-4">
          {/* Material */}
          <div className="bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-800/60">
            <span className="text-[10px] text-zinc-400 block mb-1 flex items-center gap-1.5">
              <Wrench className="w-3 h-3 text-cyan-400" />
              Vật Liệu Chế Tạo
            </span>
            <p className="text-xs font-semibold text-zinc-100 font-sans">
              {part.material}
            </p>
          </div>

          {/* Weight & Category */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-800/60">
              <span className="text-[10px] text-zinc-400 block mb-0.5">Khối Lượng</span>
              <span className="text-sm font-bold text-cyan-300">{part.weightKg} kg</span>
            </div>
            <div className="bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-800/60">
              <span className="text-[10px] text-zinc-400 block mb-0.5">Hạng Mục</span>
              <span className="text-xs font-bold text-amber-400 uppercase">
                {part.category}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Explanation */}
        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
            Mô Tả Kỹ Thuật
          </h4>
          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
            {part.description}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/30 text-xs text-cyan-200 leading-relaxed font-sans">
          <strong className="block text-[11px] font-mono uppercase text-cyan-400 mb-1">
            Vai trò khí động học / vận hành:
          </strong>
          {part.technicalRole}
        </div>
      </div>
    </div>
  );
};
