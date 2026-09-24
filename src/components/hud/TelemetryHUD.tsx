import React from 'react';
import { useCarStore } from '../../store/useCarStore';
import { CARS_DATA } from '../../data/cars';
import { Gauge, ShieldAlert, Cpu, Activity, Compass } from 'lucide-react';

export const TelemetryHUD: React.FC = () => {
  const { selectedCarId, drsActive, windTunnelActive } = useCarStore();
  const car = CARS_DATA[selectedCarId] || CARS_DATA.rb20;

  // Real-time calculation effect when DRS is active
  const dynamicDrag = drsActive ? (car.dragCoefficient * 0.78).toFixed(2) : car.dragCoefficient.toFixed(2);
  const dynamicTopSpeed = drsActive ? car.topSpeedKmh + 18 : car.topSpeedKmh;

  return (
    <div className="absolute top-24 left-6 z-20 pointer-events-auto hidden lg:flex flex-col gap-3 w-72">
      {/* Main Telemetry Box */}
      <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
              Aero Telemetry
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
            FIA 2024
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="space-y-3 font-mono text-xs">
          {/* Downforce */}
          <div>
            <div className="flex justify-between text-zinc-400 mb-1">
              <span>Lực Ép Khí Động Học</span>
              <span className="text-cyan-400 font-bold">{car.downforceAt250KmhKgf} kgf</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(car.downforceAt250KmhKgf / 2000) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-zinc-500 mt-0.5 block">
              ~60% sinh ra từ hai hầm Venturi đáy sàn
            </span>
          </div>

          {/* Drag Coefficient */}
          <div>
            <div className="flex justify-between text-zinc-400 mb-1">
              <span>Hệ Số Cản Gió (CdA)</span>
              <span className={`font-bold ${drsActive ? 'text-emerald-400' : 'text-zinc-200'}`}>
                {dynamicDrag} {drsActive && '(-22% DRS)'}
              </span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  drsActive ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
                style={{ width: `${(parseFloat(dynamicDrag) / 1.0) * 100}%` }}
              />
            </div>
          </div>

          {/* Top Speed & Horsepower */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-900">
            <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/50">
              <span className="text-[10px] text-zinc-500 block">Tốc Độ Tối Đa</span>
              <span className="text-sm font-bold text-white">{dynamicTopSpeed} km/h</span>
            </div>
            <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/50">
              <span className="text-[10px] text-zinc-500 block">Công Suất PU</span>
              <span className="text-sm font-bold text-red-400">{car.horsepower} bhp</span>
            </div>
          </div>

          {/* Minimum FIA Weight & Ground Clearance */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/50">
              <span className="text-[10px] text-zinc-500 block">Trọng Lượng Khô</span>
              <span className="text-sm font-bold text-white">{car.weightKg} kg</span>
            </div>
            <div className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/50">
              <span className="text-[10px] text-zinc-500 block">Khoảng Sáng Gầm</span>
              <span className="text-sm font-bold text-cyan-300">15 - 25 mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ground Effect Highlight Box */}
      <div className="bg-cyan-950/20 backdrop-blur-md border border-cyan-800/40 rounded-2xl p-3.5 shadow-xl">
        <div className="flex items-center gap-2 mb-1.5">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
            Bí Mật Khí Động Học
          </span>
        </div>
        <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
          {car.groundEffectNotes}
        </p>
      </div>
    </div>
  );
};
