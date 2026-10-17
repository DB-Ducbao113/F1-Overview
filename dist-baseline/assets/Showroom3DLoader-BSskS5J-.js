import { j as e } from './vendor-react-B62-MmwA.js';
import { H as n, u as d } from './vendor-three-CZCoFc9s.js';
import { f as l, a3 as i, $ as c } from './vendor-icons-Brb4Fsqu.js';
const x = () => {
    const { progress: t } = d(),
      a = Math.round(t);
    return e.jsxs('div', {
      'data-showroom-loader': !0,
      className:
        'w-[320px] sm:w-[380px] p-6 rounded-2xl bg-studio-950/95 backdrop-blur-xl border border-studio-700/80 shadow-2xl text-white select-none space-y-4',
      children: [
        e.jsxs('div', {
          className: 'flex items-center justify-between border-b border-studio-800 pb-3',
          children: [
            e.jsxs('div', {
              className: 'flex items-center gap-2',
              children: [
                e.jsx('span', { className: 'w-2.5 h-2.5 rounded-full bg-f1red animate-ping' }),
                e.jsxs('span', {
                  className:
                    'font-mono text-[11px] font-black uppercase tracking-widest text-f1red flex items-center gap-1.5',
                  children: [
                    e.jsx(l, { className: 'w-3.5 h-3.5 text-f1red' }),
                    'PIT WALL TELEMETRY',
                  ],
                }),
              ],
            }),
            e.jsxs('span', {
              className: 'font-mono text-xs font-black text-emerald-400',
              children: [a, '% LOADED'],
            }),
          ],
        }),
        e.jsxs('div', {
          className: 'space-y-1',
          children: [
            e.jsxs('h3', {
              className:
                'font-display text-sm sm:text-base font-black uppercase tracking-wider text-white flex items-center gap-2',
              children: [
                e.jsx(i, { className: 'w-4 h-4 text-studio-400' }),
                'Đang nạp mô hình 3D F1 C42',
              ],
            }),
            e.jsx('p', {
              className: 'text-[11px] text-studio-400 font-medium',
              children: 'Khởi tạo khí động học mặt đất, buồng lái Halo & thông số 11 đội đua...',
            }),
          ],
        }),
        e.jsxs('div', {
          className: 'space-y-1.5',
          children: [
            e.jsxs('div', {
              className:
                'flex items-center justify-between text-[10px] font-mono text-studio-500 font-bold uppercase',
              children: [
                e.jsx('span', { children: 'Aero Scan' }),
                e.jsx('span', { children: '18.3 MB Model' }),
              ],
            }),
            e.jsx('div', {
              className:
                'h-3 w-full bg-studio-900 rounded-md overflow-hidden p-0.5 border border-studio-800 flex gap-0.5',
              children: Array.from({ length: 24 }).map((m, s) => {
                const r = s / 24 <= t / 100,
                  o =
                    s < 12
                      ? 'bg-emerald-500 shadow-emerald-500/50'
                      : s < 18
                        ? 'bg-amber-400 shadow-amber-400/50'
                        : 'bg-f1red shadow-f1red/50';
                return e.jsx(
                  'div',
                  {
                    className: `flex-1 rounded-[1px] transition-all duration-150 ${r ? o : 'bg-studio-800/40'}`,
                  },
                  s,
                );
              }),
            }),
          ],
        }),
        e.jsxs('div', {
          className: 'pt-1 flex items-center justify-between text-[10px] font-mono text-studio-500',
          children: [
            e.jsxs('span', {
              className: 'flex items-center gap-1',
              children: [
                e.jsx(c, { className: 'w-3 h-3 text-studio-400' }),
                'FIA 2026 Ground Effect',
              ],
            }),
            e.jsx('span', { className: 'text-studio-400', children: 'Pirelli P-Zero 18"' }),
          ],
        }),
      ],
    });
  },
  f = () => e.jsx(n, { center: !0, zIndexRange: [1e3, 0], children: e.jsx(x, {}) });
export { f as Showroom3DLoader, x as ShowroomLoadingPanel };
