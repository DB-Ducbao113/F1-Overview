import React from 'react';
import { useCarStore } from '../../store/useCarStore';
import { CameraPreset } from '../../types';
import { Camera, Compass } from 'lucide-react';

const PRESETS: { id: CameraPreset; label: string; desc: string }[] = [
  { id: 'isometric', label: 'Toàn Cảnh', desc: 'Góc 3D chuẩn Showroom' },
  { id: 'front', label: 'Cánh Trước', desc: 'Mũi xe & Front Wing' },
  { id: 'side', label: 'Thân Xe', desc: 'Hốc gió Undercut' },
  { id: 'floor', label: 'Sàn Venturi', desc: 'Gầm khí động học' },
  { id: 'rear', label: 'Cánh Đuôi', desc: 'DRS & Diffuser' },
  { id: 'top', label: 'Nhìn Trên', desc: 'Bird Eye View' },
];

export const CameraPresetsBar: React.FC = () => {
  const { cameraPreset, setCameraPreset } = useCarStore();

  return (
    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
      <div className="flex items-center gap-1.5 bg-zinc-950/70 backdrop-blur-md p-1.5 rounded-full border border-zinc-800 shadow-xl overflow-x-auto max-w-[94vw]">
        {PRESETS.map((p) => {
          const isActive = cameraPreset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setCameraPreset(p.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-mono whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              title={p.desc}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
