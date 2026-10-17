import { r as h, m as S, j as e, R as k } from './vendor-react-B62-MmwA.js';
import { u as C } from './index-C6BcaiY-.js';
import { g } from './teamColors-B_bsvcV9.js';
import { g as j } from './teamNames-Dn1_-17Y.js';
import { f as T } from './dateUtils-C4Mh2J_m.js';
import { y as N, l as p, e as E, C as R, X as F, T as H, j as B } from './vendor-icons-Brb4Fsqu.js';
import './vendor-core-ckwbz45p.js';
const X = ({ qualifyingData: r, initialSessionKey: l = 'qualifying', onClose: x }) => {
  const { lang: b } = C(),
    s = b === 'vi',
    [a, u] = h.useState(l),
    [w, v] = h.useState(l);
  if (
    (l !== w && (v(l), u(l)),
    h.useEffect(() => {
      if (!r) return;
      const t = (o) => {
        o.key === 'Escape' && x();
      };
      return (
        window.addEventListener('keydown', t),
        () => window.removeEventListener('keydown', t)
      );
    }, [r, x]),
    !r)
  )
    return null;
  const i =
      r.sessions[a] || r.sessions.qualifying || r.sessions.sprintQualifying || r.sessions.sprint,
    f = ['qualifying', 'sprintQualifying', 'sprint'].filter((t) => !!r.sessions[t]),
    n = a === 'sprint',
    y = a === 'sprintQualifying';
  return S.createPortal(
    e.jsx('div', {
      className:
        'fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in',
      onClick: x,
      children: e.jsxs('div', {
        className:
          'relative w-full max-w-5xl bg-studio-950 border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-white animate-scale-up',
        onClick: (t) => t.stopPropagation(),
        children: [
          e.jsx('div', {
            className: 'h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400',
          }),
          e.jsxs('div', {
            className:
              'p-5 sm:p-6 border-b border-white/10 flex items-start sm:items-center justify-between gap-4 bg-white/[0.02]',
            children: [
              e.jsxs('div', {
                className: 'space-y-1',
                children: [
                  e.jsxs('div', {
                    className: 'flex items-center gap-2 flex-wrap',
                    children: [
                      e.jsxs('span', {
                        className:
                          'text-xs font-mono font-bold uppercase tracking-wider text-purple-400 bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-500/30',
                        children: [
                          s ? `Chặng ${r.round}` : `Round ${r.round}`,
                          ' ·',
                          ' ',
                          r.season,
                        ],
                      }),
                      e.jsx('span', {
                        className:
                          'inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20',
                        children: n
                          ? e.jsxs(e.Fragment, {
                              children: [
                                e.jsx(N, { className: 'w-3.5 h-3.5 text-amber-400' }),
                                s ? 'Kết Quả Cuộc Đua Sprint' : 'Sprint Race Classification',
                              ],
                            })
                          : y
                            ? e.jsxs(e.Fragment, {
                                children: [
                                  e.jsx(p, { className: 'w-3.5 h-3.5 text-purple-400' }),
                                  s
                                    ? 'Bảng Xếp Hạng Phân Hạng Sprint'
                                    : 'Sprint Qualifying Classification',
                                ],
                              })
                            : e.jsxs(e.Fragment, {
                                children: [
                                  e.jsx(p, { className: 'w-3.5 h-3.5 text-purple-400' }),
                                  s ? 'Bảng Xếp Hạng Phân Hạng' : 'Qualifying Classification',
                                ],
                              }),
                      }),
                    ],
                  }),
                  e.jsx('h3', {
                    className:
                      'font-display text-xl sm:text-2xl font-black uppercase text-white tracking-wide',
                    children: r.grandPrix,
                  }),
                  e.jsxs('div', {
                    className: 'flex items-center gap-4 text-xs text-studio-400 flex-wrap',
                    children: [
                      e.jsxs('span', {
                        className: 'flex items-center gap-1',
                        children: [
                          e.jsx(E, { className: 'w-3.5 h-3.5 text-studio-500' }),
                          r.circuit,
                        ],
                      }),
                      i &&
                        e.jsxs('span', {
                          className: 'flex items-center gap-1 font-mono',
                          children: [
                            e.jsx(R, { className: 'w-3.5 h-3.5 text-studio-500' }),
                            T(i.dateStr, b),
                          ],
                        }),
                    ],
                  }),
                ],
              }),
              e.jsx('button', {
                onClick: x,
                className:
                  'p-2 rounded-xl text-studio-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer',
                'aria-label': 'Close modal',
                children: e.jsx(F, { className: 'w-5 h-5' }),
              }),
            ],
          }),
          f.length > 1 &&
            e.jsx('div', {
              className:
                'bg-black/50 border-b border-white/10 px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto',
              children: f.map((t) => {
                if (!r.sessions[t]) return null;
                const c = a === t,
                  d =
                    t === 'qualifying'
                      ? s
                        ? 'Đua phân hạng (Qualifying)'
                        : 'Qualifying'
                      : t === 'sprintQualifying'
                        ? s
                          ? 'Phân hạng Sprint (SQ)'
                          : 'Sprint Qualifying'
                        : s
                          ? 'Đua Sprint'
                          : 'Sprint Race';
                return e.jsxs(
                  'button',
                  {
                    onClick: () => u(t),
                    className: `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border shrink-0 ${c ? 'bg-purple-600 text-white border-purple-400 shadow-md font-black' : 'bg-white/5 text-studio-300 border-white/10 hover:bg-white/10 hover:text-white'}`,
                    children: [
                      t === 'sprint'
                        ? e.jsx(N, { className: 'w-3.5 h-3.5' })
                        : e.jsx(p, { className: 'w-3.5 h-3.5' }),
                      e.jsx('span', { children: d }),
                    ],
                  },
                  t,
                );
              }),
            }),
          (i == null ? void 0 : i.poleDriver) &&
            e.jsxs('div', {
              className:
                'bg-black/40 border-b border-white/10 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs',
              children: [
                e.jsxs('div', {
                  className: 'flex items-center gap-2.5',
                  children: [
                    e.jsx('span', {
                      className:
                        'p-1 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/40',
                      children: n
                        ? e.jsx(H, { className: 'w-4 h-4 text-amber-400' })
                        : e.jsx(p, { className: 'w-4 h-4 text-purple-300' }),
                    }),
                    e.jsx('span', {
                      className: 'text-studio-300',
                      children: n
                        ? s
                          ? 'Tay đua về nhất Sprint:'
                          : 'Sprint Winner:'
                        : s
                          ? 'Giành Vị Trí Pole (P1):'
                          : 'Pole Position (P1):',
                    }),
                    e.jsx('span', {
                      className: 'font-extrabold text-sm',
                      style: { color: g(i.poleDriver.team || i.poleDriver.driver, !0) },
                      children: i.poleDriver.driver,
                    }),
                    e.jsxs('span', {
                      className: 'text-studio-400 font-mono text-[11px]',
                      children: ['(', j(i.poleDriver.team), ')'],
                    }),
                    e.jsx('span', {
                      className:
                        'font-mono text-amber-300 font-bold ml-1.5 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20',
                      children: i.poleDriver.time,
                    }),
                  ],
                }),
                e.jsx('div', {
                  className: 'flex items-center gap-3 text-studio-400 font-mono text-[11px]',
                  children: e.jsxs('span', {
                    className:
                      'inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20',
                    children: [
                      e.jsx(B, { className: 'w-3 h-3' }),
                      s ? 'Kết quả chính thức' : 'Official result',
                    ],
                  }),
                }),
              ],
            }),
          e.jsx('div', {
            className: 'p-4 sm:p-6 overflow-y-auto flex-1',
            children: i
              ? e.jsx('div', {
                  className: 'overflow-x-auto rounded-2xl border border-white/10',
                  children: e.jsxs('table', {
                    className: 'w-full text-left border-collapse text-xs min-w-[650px]',
                    children: [
                      e.jsx('thead', {
                        children: e.jsxs('tr', {
                          className:
                            'bg-white/5 border-b border-white/10 text-studio-400 uppercase tracking-wider text-[10px] font-bold',
                          children: [
                            e.jsx('th', {
                              className: 'py-3 px-4 w-12 text-center',
                              children: s ? 'Hạng' : 'Pos',
                            }),
                            e.jsx('th', {
                              className: 'py-3 px-3 w-12 text-center',
                              children: s ? 'Số' : 'No',
                            }),
                            e.jsx('th', {
                              className: 'py-3 px-4',
                              children: s ? 'Tay Đua' : 'Driver',
                            }),
                            e.jsx('th', {
                              className: 'py-3 px-4',
                              children: s ? 'Đội Đua' : 'Constructor',
                            }),
                            !n &&
                              e.jsxs(e.Fragment, {
                                children: [
                                  e.jsx('th', {
                                    className: 'py-3 px-3 text-right font-mono',
                                    children: a === 'sprintQualifying' ? 'SQ1' : 'Q1',
                                  }),
                                  e.jsx('th', {
                                    className: 'py-3 px-3 text-right font-mono',
                                    children: a === 'sprintQualifying' ? 'SQ2' : 'Q2',
                                  }),
                                  e.jsx('th', {
                                    className: 'py-3 px-3 text-right font-mono',
                                    children: a === 'sprintQualifying' ? 'SQ3' : 'Q3',
                                  }),
                                ],
                              }),
                            e.jsx('th', {
                              className: 'py-3 px-4 text-right',
                              children: n
                                ? s
                                  ? 'Thời gian / Khoảng cách'
                                  : 'Time / Gap'
                                : s
                                  ? 'Vòng tốt nhất'
                                  : 'Best Lap',
                            }),
                            e.jsx('th', {
                              className: 'py-3 px-4 text-right',
                              children: n ? (s ? 'Điểm' : 'Pts') : s ? 'Cách Pole' : 'Gap',
                            }),
                            e.jsx('th', {
                              className: 'py-3 px-3 text-center w-16',
                              children: s ? 'Vòng' : 'Laps',
                            }),
                          ],
                        }),
                      }),
                      e.jsx('tbody', {
                        className: 'divide-y divide-white/5 font-medium',
                        children: i.entries.map((t) => {
                          const o = t.position === 1,
                            c = t.position === 2,
                            d = t.position === 3,
                            m = g(t.teamId || t.teamName, !0),
                            Q = !n && t.position === 10,
                            P = !n && t.position === 16;
                          return e.jsxs(
                            k.Fragment,
                            {
                              children: [
                                e.jsxs('tr', {
                                  className: `hover:bg-white/[0.04] transition-colors ${o ? 'bg-purple-500/10' : c || d ? 'bg-white/[0.02]' : ''}`,
                                  children: [
                                    e.jsx('td', {
                                      className: 'py-2.5 px-4 text-center',
                                      children: e.jsx('span', {
                                        className: `w-6 h-6 rounded-full inline-flex items-center justify-center font-mono font-bold text-xs ${o ? 'bg-amber-400 text-black shadow-xs font-black' : c ? 'bg-slate-300 text-black font-black' : d ? 'bg-amber-700 text-white font-black' : 'text-studio-400'}`,
                                        children: t.position,
                                      }),
                                    }),
                                    e.jsx('td', {
                                      className:
                                        'py-2.5 px-3 text-center font-mono text-studio-400 font-bold',
                                      children: t.driverNumber,
                                    }),
                                    e.jsx('td', {
                                      className: 'py-2.5 px-4 font-bold',
                                      children: e.jsxs('div', {
                                        className: 'flex items-center gap-2',
                                        children: [
                                          e.jsx('span', {
                                            style: { color: m },
                                            children: t.driverName,
                                          }),
                                          e.jsx('span', {
                                            className:
                                              'text-[10px] font-mono text-studio-400 px-1 py-0.2 rounded bg-white/5 border border-white/10',
                                            children: t.driverCode,
                                          }),
                                        ],
                                      }),
                                    }),
                                    e.jsx('td', {
                                      className: 'py-2.5 px-4',
                                      children: e.jsxs('div', {
                                        className: 'flex items-center gap-2',
                                        children: [
                                          e.jsx('span', {
                                            className: 'w-2.5 h-2.5 rounded-full shrink-0',
                                            style: { backgroundColor: m },
                                          }),
                                          e.jsx('span', {
                                            className: 'font-bold truncate max-w-[180px]',
                                            style: { color: m },
                                            children: j(t.teamName),
                                          }),
                                        ],
                                      }),
                                    }),
                                    !n &&
                                      e.jsxs(e.Fragment, {
                                        children: [
                                          e.jsx('td', {
                                            className:
                                              'py-2.5 px-3 text-right font-mono text-studio-400 text-[11px]',
                                            children: t.q1Time || '-',
                                          }),
                                          e.jsx('td', {
                                            className:
                                              'py-2.5 px-3 text-right font-mono text-studio-300 text-[11px]',
                                            children: t.q2Time || '-',
                                          }),
                                          e.jsx('td', {
                                            className:
                                              'py-2.5 px-3 text-right font-mono text-purple-300 font-bold text-[11px]',
                                            children: t.q3Time || '-',
                                          }),
                                        ],
                                      }),
                                    e.jsx('td', {
                                      className:
                                        'py-2.5 px-4 text-right font-mono font-bold text-white',
                                      children: t.bestLapTime,
                                    }),
                                    e.jsx('td', {
                                      className: 'py-2.5 px-4 text-right font-mono text-xs',
                                      children: n
                                        ? t.sprintPoints
                                          ? e.jsxs('span', {
                                              className:
                                                'font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20',
                                              children: ['+', t.sprintPoints, ' PTS'],
                                            })
                                          : e.jsx('span', {
                                              className: 'text-studio-500',
                                              children: '0 PTS',
                                            })
                                        : e.jsx('span', {
                                            className: o
                                              ? 'text-amber-400 font-extrabold tracking-wider'
                                              : 'text-studio-400',
                                            children: t.gapToPole,
                                          }),
                                    }),
                                    e.jsx('td', {
                                      className:
                                        'py-2.5 px-3 text-center font-mono text-studio-400 text-[11px]',
                                      children: t.lapsCompleted || '-',
                                    }),
                                  ],
                                }),
                                Q &&
                                  e.jsx('tr', {
                                    children: e.jsx('td', {
                                      colSpan: 10,
                                      className:
                                        'py-1 px-4 bg-purple-950/40 text-[10px] text-purple-300 font-bold tracking-wider text-center border-y border-purple-500/20',
                                      children: s
                                        ? '--- Vòng Q3: Top 10 Giành Pole ---'
                                        : '--- Q3 Cutoff: Top 10 Shootout ---',
                                    }),
                                  }),
                                P &&
                                  e.jsx('tr', {
                                    children: e.jsx('td', {
                                      colSpan: 10,
                                      className:
                                        'py-1 px-4 bg-studio-900/40 text-[10px] text-studio-400 font-bold tracking-wider text-center border-y border-white/10',
                                      children: s
                                        ? '--- Bị loại sau Q2 (Hạng 11 - 16) ---'
                                        : '--- Eliminated in Q2 (P11 - P16) ---',
                                    }),
                                  }),
                              ],
                            },
                            t.driverId,
                          );
                        }),
                      }),
                    ],
                  }),
                })
              : e.jsx('div', {
                  className: 'text-center py-12 text-studio-400 font-medium',
                  children: s
                    ? 'Chưa có dữ liệu phân hạng cho chặng này.'
                    : 'No qualifying data available for this round.',
                }),
          }),
        ],
      }),
    }),
    document.body,
  );
};
export { X as QualifyingClassificationModal };
