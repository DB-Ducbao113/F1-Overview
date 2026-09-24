import React from 'react';
import { useCarStore } from '../../store/useCarStore';
import { CARS_DATA } from '../../data/cars';
import { CarId } from '../../types';
import { Wind, Eye, Layers, Github } from 'lucide-react';

export const Header: React.FC = () => {
  const { selectedCarId, setCarId, viewMode, setViewMode, windTunnelActive, toggleWindTunnel, wireframe, toggleWireframe } = useCarStore();

  const cars = Object.values(CARS_DATA);

  return (
    <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Brand & Project Identity */}
      <div className="pointer-events-auto flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center font-black tracking-tighter text-white shadow-lg shadow-red-900/40 border border-red-500/30">
          F1
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-bold tracking-wider text-white uppercase font-f1">
              Evolution of Speed
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 uppercase">
              Ground Effect Era
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono">
            3D Anatomy & Aerodynamic Showroom
          </p>
        </div>
      </div>

      {/* Modern F1 Car Selector */}
      <div className="pointer-events-auto flex items-center bg-zinc-900/80 backdrop-blur-md p-1 rounded-xl border border-zinc-800 shadow-xl">
        {cars.map((car) => {
          const isActive = selectedCarId === car.id;
          return (
            <button
              key={car.id}
              onClick={() => setCarId(car.id as CarId)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 flex items-center gap-2 ${
                isActive
                  ? 'bg-zinc-800 text-white shadow-md border border-zinc-700/80'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: car.accentColor }}
              />
              {car.name}
            </button>
          );
        })}
      </div>

      {/* Mode Controls & GitHub Link */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Wind Tunnel Mode */}
        <button
          onClick={toggleWindTunnel}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 border ${
            windTunnelActive
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-lg shadow-cyan-900/30'
              : 'bg-zinc-900/70 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
          }`}
          title="Kích hoạt luồng khí khí động học trong hầm gió"
        >
          <Wind className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Aero Flow</span>
        </button>

        {/* X-Ray / Wireframe Mode */}
        <button
          onClick={toggleWireframe}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 border ${
            wireframe
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-lg shadow-amber-900/30'
              : 'bg-zinc-900/70 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
          }`}
          title="Xem khung xương dây và cấu trúc giải phẫu bên trong"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">X-Ray</span>
        </button>

        {/* GitHub Link */}
        <a
          href="https://github.com/DB-Ducbao113/F1-Overview"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-zinc-900/70 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700 transition-colors"
          title="Xem kho lưu trữ GitHub"
        >
          <Github className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
};
