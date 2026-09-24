import React from 'react';
import { useCarStore } from '../../store/useCarStore';
import { CARS_DATA } from '../../data/cars';
import { CarId } from '../../types';
import { t } from '../../i18n/translations';
import { ANATOMY_PARTS } from '../../data/parts';
import { Wind, Layers, X, Info, MapPin, Upload } from 'lucide-react';

const CAR_ORDER: CarId[] = ['rb20', 'sf24', 'mcl38', 'w15'];

export const ShowroomHUD: React.FC = () => {
  const {
    selectedCarId,
    setCarId,
    setCustomModelUrl,
    isExploded,
    toggleExploded,
    explodedProgress,
    setExplodedProgress,
    drsActive,
    toggleDrs,
    windTunnelActive,
    toggleWindTunnel,
    wireframe,
    toggleWireframe,
    cameraPreset,
    setCameraPreset,
    selectedPartId,
    selectPart,
    showTelemetry,
    toggleTelemetry,
    showHotspots,
    toggleHotspots,
    modelMode,
    setModelMode,
    customModelUrl,
    lang,
  } = useCarStore();

  const car = CARS_DATA[selectedCarId];
  const strings = t[lang].showroom;

  return (
    <>
      {/* ── Top Model Selector Bar ── */}
      <div
        className="absolute top-0 left-0 right-0 z-30 border-b border-studio-200 bg-white/95 backdrop-blur-md shadow-subtle"
        style={{ height: 48 }}
      >
        <div className="h-full flex items-stretch overflow-x-auto no-scrollbar">
          {CAR_ORDER.map((id) => {
            const c = CARS_DATA[id];
            const active = selectedCarId === id;
            return (
              <button
                key={id}
                onClick={() => setCarId(id)}
                className={`h-full shrink-0 px-4 md:px-5 flex items-center gap-2 border-r border-studio-200 transition-all duration-200 relative ${
                  active ? 'bg-studio-100 text-studio-950 font-bold' : 'hover:bg-studio-50 text-studio-600'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ background: c.accentColor }} />
                <span className="text-[11px] font-body uppercase tracking-wider">
                  {c.shortName}
                </span>
                {active && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-f1red" />}
              </button>
            );
          })}

          {/* Right-aligned mode toggles */}
          <div className="ml-auto flex items-center border-l border-studio-200 pr-24 sm:pr-28">
            {/* Model Architecture Toggle: 2024 Bespoke Aero vs AR Spec GLB */}
            <div className="hidden lg:flex items-center h-full border-r border-studio-200 bg-studio-50/70 p-1 gap-1">
              <button
                onClick={() => {
                  setModelMode('aero');
                  if (customModelUrl) setCustomModelUrl(null);
                }}
                className={`h-full px-2.5 text-[9px] font-body uppercase tracking-wider font-semibold rounded-xs transition-all ${
                  modelMode === 'aero' && !customModelUrl
                    ? 'bg-white text-studio-950 font-bold shadow-xs border border-studio-200'
                    : 'text-studio-500 hover:text-studio-900'
                }`}
                title="Mô hình khí động học 2024 tùy biến riêng theo từng đội đua (Red Bull, Ferrari, McLaren, Mercedes)"
              >
                📐 {strings.modelModeAero}
              </button>
              <button
                onClick={() => {
                  setModelMode('real');
                  if (customModelUrl) setCustomModelUrl(null);
                }}
                className={`h-full px-2.5 text-[9px] font-body uppercase tracking-wider font-semibold rounded-xs transition-all ${
                  modelMode === 'real' && !customModelUrl
                    ? 'bg-white text-studio-950 font-bold shadow-xs border border-studio-200'
                    : 'text-studio-500 hover:text-studio-900'
                }`}
                title="Mô hình 3D AR Ground Effect C42 độ phân giải cao"
              >
                🏎️ {strings.modelModeReal}
              </button>
            </div>

            {/* If custom model loaded, show clear button */}
            {customModelUrl && (
              <button
                onClick={() => setCustomModelUrl(null)}
                className="h-full px-2.5 text-[10px] font-body uppercase text-f1red hover:bg-f1red/10 border-r border-studio-200 flex items-center gap-1 font-bold"
                title="Xóa model tùy chỉnh, quay lại cấu hình mặc định"
              >
                <X className="w-3 h-3" />
                <span className="hidden sm:inline">{strings.resetModel}</span>
              </button>
            )}

            {/* Custom .glb file loader */}
            <label
              className="cursor-pointer h-full px-3 text-[10px] font-body uppercase tracking-wider font-semibold transition-colors border-r border-studio-200 flex items-center gap-1 text-studio-600 hover:text-studio-950 hover:bg-studio-50"
              title="Nạp file .glb/.gltf từ máy tính của bạn"
            >
              <Upload className="w-3 h-3 text-studio-500" />
              <span className="hidden md:inline">{strings.loadGlb}</span>
              <input
                type="file"
                accept=".glb,.gltf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const blobUrl = URL.createObjectURL(file);
                    setCustomModelUrl(blobUrl);
                  }
                }}
              />
            </label>

            {/* Hotspots toggle */}
            <button
              onClick={toggleHotspots}
              className={`h-full px-3 text-[10px] font-body uppercase tracking-wider font-semibold transition-colors border-r border-studio-200 flex items-center gap-1.5 ${
                showHotspots
                  ? 'text-studio-950 bg-studio-100 font-bold'
                  : 'text-studio-400 hover:text-studio-700'
              }`}
              title="Bật/Tắt điểm ghim 3D"
            >
              <MapPin className="w-3 h-3 text-f1red" />
              <span className="hidden sm:inline">{lang === 'vi' ? 'Điểm ghim' : 'Hotspots'}</span>
            </button>

            {/* Aero flow simulation */}
            <button
              onClick={toggleWindTunnel}
              className={`h-full px-3.5 text-[10px] font-body uppercase tracking-wider font-semibold transition-colors border-r border-studio-200 ${
                windTunnelActive
                  ? 'text-f1red bg-f1red/5 font-bold border-b-2 border-b-f1red'
                  : 'text-studio-600 hover:text-studio-950 hover:bg-studio-50'
              }`}
            >
              {strings.aeroFlow}
            </button>

            {/* X-Ray wireframe */}
            <button
              onClick={toggleWireframe}
              className={`h-full px-3.5 text-[10px] font-body uppercase tracking-wider font-semibold transition-colors ${
                wireframe
                  ? 'text-f1red bg-f1red/5 font-bold border-b-2 border-b-f1red'
                  : 'text-studio-600 hover:text-studio-950 hover:bg-studio-50'
              }`}
            >
              {strings.xray}
            </button>
          </div>
        </div>
      </div>

      {/* ── Left Side — Non-Intrusive Telemetry: Discreet Pill OR Compact Drawer ── */}
      <div className="absolute top-[60px] left-4 z-20 pointer-events-none">
        <div className="pointer-events-auto">
          {!showTelemetry ? (
            /* Minimized Pill — Default state so the car is 100% visible */
            <button
              onClick={toggleTelemetry}
              className="flex items-center gap-2 px-3.5 py-2 bg-white/95 hover:bg-white text-studio-900 border border-studio-300 rounded-sm shadow-subtle hover:shadow-luxury transition-all backdrop-blur-sm group"
            >
              <Info className="w-3.5 h-3.5 text-f1red" />
              <span className="text-[11px] font-body uppercase tracking-wider font-bold">
                {car.shortName} · {lang === 'vi' ? 'Thông số xe' : 'Specs'}
              </span>
            </button>
          ) : (
            /* Expanded Compact Card — Fixed width 280px, strictly constrained so it never stretches! */
            <div className="w-72 max-w-[290px] bg-white/95 backdrop-blur-md border border-studio-300 rounded-sm shadow-luxury overflow-hidden animate-fade-in-up">
              {/* Header with Close Button */}
              <div className="flex items-start justify-between p-4 border-b border-studio-200 bg-studio-50/50">
                <div>
                  <span className="label-overline block mb-0.5 text-[9px]">{car.team}</span>
                  <h3 className="font-display text-lg font-bold text-studio-950 leading-tight">{car.name}</h3>
                  <p className="text-[10px] font-body text-studio-500 mt-0.5 leading-snug">{car.engine}</p>
                </div>
                <button
                  onClick={toggleTelemetry}
                  className="p-1 text-studio-400 hover:text-studio-950 hover:bg-studio-100 rounded-full transition-colors ml-2"
                  aria-label="Close Specs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Spec rows */}
              <div className="divide-y divide-studio-200">
                {[
                  { label: strings.telemetry.peakPower, val: `${car.horsepower.toLocaleString()} bhp` },
                  { label: strings.telemetry.downforce, val: `${car.downforceAt250KmhKgf.toLocaleString()} kgf` },
                  { label: strings.telemetry.drag,      val: `Cd ${car.dragCoefficient}` },
                  { label: strings.telemetry.topSpeed,  val: `${car.topSpeedKmh} km/h` },
                  { label: strings.telemetry.zeroTo100, val: `${car.zeroToHundredSec} s` },
                  { label: strings.telemetry.weight,    val: `${car.weightKg} kg` },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between items-baseline px-4 py-2">
                    <span className="spec-label text-[9px]">{label}</span>
                    <span className="spec-value text-[11px]">{val}</span>
                  </div>
                ))}
              </div>

              {/* Compact ground effect note */}
              <div className="p-3 border-t border-studio-200 bg-studio-50/70">
                <p className="text-[10px] font-body font-light text-studio-600 leading-relaxed">
                  {car.groundEffectNotes}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Center Bottom — Camera Preset Pills ── */}
      <div className="absolute bottom-[84px] left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
        <div className="flex items-center gap-0 border border-studio-300 bg-white/95 backdrop-blur-md rounded-full shadow-subtle overflow-hidden p-0.5">
          {[
            { id: 'isometric' as const, label: strings.presets.studio },
            { id: 'front'     as const, label: strings.presets.front  },
            { id: 'side'      as const, label: strings.presets.side   },
            { id: 'floor'     as const, label: strings.presets.floor  },
            { id: 'rear'      as const, label: strings.presets.rear   },
            { id: 'top'       as const, label: strings.presets.top    },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setCameraPreset(id)}
              className={`px-3.5 py-1.5 text-[10px] font-body uppercase tracking-wider font-semibold rounded-full transition-all duration-200 ${
                cameraPreset === id
                  ? 'bg-f1red text-white shadow-subtle'
                  : 'text-studio-600 hover:text-studio-950 hover:bg-studio-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Bottom Control Bar — Exploded + DRS ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 pointer-events-auto bg-white/95 backdrop-blur-md border-t border-studio-200 shadow-subtle"
        style={{ height: 68 }}
      >
        <div className="page-container h-full flex items-center gap-4">

          {/* Explode View Toggle */}
          <button
            onClick={toggleExploded}
            className={`shrink-0 h-8.5 px-3.5 flex items-center gap-1.5 text-[10px] font-body uppercase tracking-wider font-bold rounded-sm transition-all border ${
              isExploded
                ? 'border-f1red bg-f1red text-white shadow-subtle'
                : 'border-studio-300 bg-white text-studio-800 hover:border-studio-900'
            }`}
          >
            <Layers className="w-3 h-3" />
            {isExploded ? strings.assemble : strings.explode}
          </button>

          {/* DRS Toggle */}
          <button
            onClick={toggleDrs}
            className={`shrink-0 h-8.5 px-3.5 flex items-center gap-1.5 text-[10px] font-body uppercase tracking-wider font-bold rounded-sm transition-all border ${
              drsActive
                ? 'border-emerald-600 bg-emerald-600 text-white shadow-subtle'
                : 'border-studio-300 bg-white text-studio-800 hover:border-studio-900'
            }`}
          >
            <Wind className="w-3 h-3" />
            {drsActive ? strings.drsOpen : strings.drsClosed}
          </button>

          {/* Disassembly Scrub Slider */}
          <div className="flex-1 flex items-center gap-3">
            <span className="spec-label whitespace-nowrap shrink-0 hidden sm:inline">{strings.disassembly}</span>
            <input
              type="range" min="0" max="1" step="0.01"
              value={explodedProgress}
              onChange={(e) => setExplodedProgress(parseFloat(e.target.value))}
              className="w-full h-1 bg-studio-300 rounded-lg appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5
                         [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-f1red
                         [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-webkit-slider-thumb]:shadow-subtle"
            />
            <span className="spec-value whitespace-nowrap shrink-0 w-8 text-right text-xs">
              {Math.round(explodedProgress * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* ── Right Side — Part Inspector Drawer (ONLY when user clicks on a part) ── */}
      {selectedPartId && (
        <PartPanel
          partId={selectedPartId}
          onClose={() => selectPart(null)}
          lang={lang}
        />
      )}
    </>
  );
};

const PartPanel: React.FC<{ partId: string; onClose: () => void; lang: 'vi' | 'en' }> = ({
  partId,
  onClose,
  lang,
}) => {
  const part = ANATOMY_PARTS.find((p) => p.id === partId);
  const strings = t[lang].showroom.partPanel;
  if (!part) return null;

  const displayName = lang === 'vi' ? part.vietnameseName : part.name;
  const subName = lang === 'vi' ? part.name : part.vietnameseName;

  return (
    <div
      className="absolute top-[48px] right-0 z-30 w-76 max-w-[310px] pointer-events-auto border-l border-studio-200 bg-white/95 backdrop-blur-md shadow-luxury h-[calc(100%-48px-68px)] overflow-y-auto animate-slide-in-right"
    >
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-studio-200 bg-studio-50/50">
        <div>
          <span className="label-overline block mb-1 text-[9px]">{part.category}</span>
          <h3 className="font-display text-lg font-bold text-studio-950 leading-tight">{displayName}</h3>
          <p className="text-[10px] font-body text-studio-500 mt-0.5">{subName}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-studio-400 hover:text-studio-950 hover:bg-studio-100 rounded-full transition-colors ml-2"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Specs */}
      <div className="border-b border-studio-200">
        <div className="flex justify-between items-baseline px-5 py-2.5 border-b border-studio-200">
          <span className="spec-label text-[9px]">{strings.mass}</span>
          <span className="spec-value text-xs">{part.weightKg} kg</span>
        </div>
        <div className="px-5 py-3 border-b border-studio-200">
          <span className="spec-label block mb-0.5 text-[9px]">{strings.material}</span>
          <p className="text-[11px] font-body text-studio-800 leading-relaxed font-semibold">{part.material}</p>
        </div>
      </div>

      {/* Description */}
      <div className="p-5 border-b border-studio-200">
        <span className="spec-label block mb-1 text-[9px]">{strings.overview}</span>
        <p className="text-[11px] font-body font-light text-studio-700 leading-relaxed">{part.description}</p>
      </div>

      {/* Technical role */}
      <div className="p-4 border-l-2 border-f1red bg-studio-50 m-4 rounded-r-sm">
        <span className="spec-label block mb-1 text-f1red font-semibold text-[9px]">{strings.aeroRole}</span>
        <p className="text-[11px] font-body font-light text-studio-700 leading-relaxed">{part.technicalRole}</p>
      </div>
    </div>
  );
};
