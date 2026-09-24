import React, { useState } from 'react';
import { useCarStore } from '../../store/useCarStore';
import { CARS_DATA } from '../../data/cars';
import { CarId } from '../../types';
import { t } from '../../i18n/translations';
import { ArrowRight } from 'lucide-react';

const fmt = (n: number) => n.toLocaleString('en-US');

export const CompareView: React.FC = () => {
  const { openCarIn3D, lang } = useCarStore();
  const [carAId, setCarAId] = useState<CarId>('rb20');
  const [carBId, setCarBId] = useState<CarId>('mcl38');

  const carA = CARS_DATA[carAId];
  const carB = CARS_DATA[carBId];
  const carList = Object.values(CARS_DATA);
  const strings = t[lang].compare;

  const metrics = [
    { label: strings.labels.power,       a: `${fmt(carA.horsepower)} bhp`,               b: `${fmt(carB.horsepower)} bhp`,                winner: carA.horsepower > carB.horsepower ? 'a' : carB.horsepower > carA.horsepower ? 'b' : 'tie' },
    { label: strings.labels.downforce,   a: `${fmt(carA.downforceAt250KmhKgf)} kgf`,     b: `${fmt(carB.downforceAt250KmhKgf)} kgf`,      winner: carA.downforceAt250KmhKgf > carB.downforceAt250KmhKgf ? 'a' : carB.downforceAt250KmhKgf > carA.downforceAt250KmhKgf ? 'b' : 'tie' },
    { label: strings.labels.drag,        a: `Cd ${carA.dragCoefficient}`,                 b: `Cd ${carB.dragCoefficient}`,                  winner: carA.dragCoefficient < carB.dragCoefficient ? 'a' : carB.dragCoefficient < carA.dragCoefficient ? 'b' : 'tie' },
    { label: strings.labels.topSpeed,    a: `${carA.topSpeedKmh} km/h`,                  b: `${carB.topSpeedKmh} km/h`,                   winner: carA.topSpeedKmh > carB.topSpeedKmh ? 'a' : carB.topSpeedKmh > carA.topSpeedKmh ? 'b' : 'tie' },
    { label: strings.labels.zero100,     a: `${carA.zeroToHundredSec} s`,                b: `${carB.zeroToHundredSec} s`,                  winner: carA.zeroToHundredSec < carB.zeroToHundredSec ? 'a' : carB.zeroToHundredSec < carA.zeroToHundredSec ? 'b' : 'tie' },
    { label: strings.labels.weight,      a: `${carA.weightKg} kg`,                       b: `${carB.weightKg} kg`,                         winner: 'tie' as const },
    { label: strings.labels.suspFront,   a: carA.suspensionFront,                         b: carB.suspensionFront,                          winner: 'tie' as const },
    { label: strings.labels.suspRear,    a: carA.suspensionRear,                          b: carB.suspensionRear,                           winner: 'tie' as const },
    { label: strings.labels.philosophy,  a: carA.aeroPhilosophy,                          b: carB.aeroPhilosophy,                           winner: 'tie' as const },
  ];

  return (
    <div className="bg-studio-100 text-studio-900 min-h-screen pt-16">

      {/* ── Page Header ── */}
      <div className="border-b border-studio-200 bg-white">
        <div className="page-container page-section !pb-14">
          <span className="label-overline mb-3 block">{strings.badge}</span>
          <h1 className="heading-display text-4xl sm:text-6xl font-light mb-4">
            {strings.title}
          </h1>
          <div className="w-12 h-[2px] bg-f1red mb-6" />
          <p className="text-sm font-body font-light text-studio-600 max-w-xl leading-relaxed">
            {strings.desc}
          </p>
        </div>
      </div>

      <div className="page-container py-14">

        {/* ── Selector Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {(['a', 'b'] as const).map((side) => {
            const id   = side === 'a' ? carAId : carBId;
            const setId = side === 'a' ? setCarAId : setCarBId;
            return (
              <div key={side} className="bg-white p-6 border border-studio-300 rounded-sm shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="spec-label block mb-1 text-studio-500 font-semibold">{side === 'a' ? strings.machineA : strings.machineB}</span>
                  <h3 className="font-display text-2xl font-bold text-studio-950">{CARS_DATA[id].name}</h3>
                </div>
                <select
                  value={id}
                  onChange={(e) => setId(e.target.value as CarId)}
                  className="bg-studio-50 border border-studio-300 text-studio-900 px-4 py-2 text-[11px] font-body uppercase tracking-wider font-semibold rounded-sm focus:outline-none focus:border-f1red cursor-pointer min-w-[200px]"
                >
                  {carList.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>

        {/* ── Comparison Table (White Studio) ── */}
        <div className="bg-white border border-studio-300 rounded-sm shadow-subtle overflow-hidden">

          {/* Column Headers */}
          <div className="grid grid-cols-3 border-b border-studio-200 bg-studio-50">
            <div className="col-span-1 px-6 py-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ background: carA.accentColor }} />
              <div>
                <span className="spec-label block">{carA.team}</span>
                <span className="text-sm font-body font-bold text-studio-950">{carA.shortName}</span>
              </div>
            </div>
            <div className="col-span-1 px-4 py-4 flex items-center justify-center">
              <span className="spec-label text-studio-400 font-bold">vs</span>
            </div>
            <div className="col-span-1 px-6 py-4 flex items-center gap-3 justify-end text-right">
              <div>
                <span className="spec-label block">{carB.team}</span>
                <span className="text-sm font-body font-bold text-studio-950">{carB.shortName}</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full shadow-xs shrink-0" style={{ background: carB.accentColor }} />
            </div>
          </div>

          {/* Metric Rows */}
          {metrics.map(({ label, a, b, winner }) => (
            <div key={label} className="grid grid-cols-3 border-b border-studio-200 last:border-0 hover:bg-studio-50 transition-colors">
              <div className="px-6 py-4">
                <p className={`text-[13px] font-body font-semibold leading-snug ${winner === 'a' ? 'text-studio-950' : 'text-studio-600'}`}>
                  {a}
                </p>
                {winner === 'a' && (
                  <span className="inline-block px-1.5 py-0.5 mt-1 bg-f1red/10 text-f1red text-[9px] font-body uppercase tracking-wider font-bold rounded-xs">
                    ● {strings.advantage}
                  </span>
                )}
              </div>
              <div className="px-4 py-4 flex items-center justify-center">
                <span className="spec-label text-center text-studio-700 font-bold">{label}</span>
              </div>
              <div className="px-6 py-4 text-right">
                <p className={`text-[13px] font-body font-semibold leading-snug ${winner === 'b' ? 'text-studio-950' : 'text-studio-600'}`}>
                  {b}
                </p>
                {winner === 'b' && (
                  <span className="inline-block px-1.5 py-0.5 mt-1 bg-f1red/10 text-f1red text-[9px] font-body uppercase tracking-wider font-bold rounded-xs ml-auto">
                    {strings.advantage} ●
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── 3D Launch Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {[carA, carB].map((c) => (
            <div key={c.id} className="bg-white px-6 py-5 border border-studio-300 rounded-sm shadow-subtle flex items-center justify-between">
              <p className="text-[12px] font-body text-studio-600">
                {strings.inspectIn3d}: <span className="text-studio-950 font-bold">{c.name}</span>
              </p>
              <button
                onClick={() => openCarIn3D(c.id)}
                className="flex items-center gap-2 text-[10px] font-body uppercase tracking-wider font-bold text-f1red hover:text-f1red-dark transition-colors group"
              >
                {strings.openBtn}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
