import { r as m, m as p, j as e } from './vendor-react-B62-MmwA.js';
import { u as h } from './index-CS6oMniN.js';
import { f } from './dateUtils-C4Mh2J_m.js';
import { g as i } from './teamColors-B_bsvcV9.js';
import { g as r } from './teamNames-KiqqJwCB.js';
import {
  j as d,
  e as u,
  C as b,
  V as j,
  X as N,
  T as x,
  y as w,
  l as g,
} from './vendor-icons-Brb4Fsqu.js';
import './vendor-core-ckwbz45p.js';
const P = ({ race: t, onClose: l }) => {
  const { lang: o } = h(),
    a = o === 'vi';
  return (
    m.useEffect(() => {
      if (!t) return;
      const s = (n) => {
        n.key === 'Escape' && l();
      };
      return (
        window.addEventListener('keydown', s),
        () => window.removeEventListener('keydown', s)
      );
    }, [t, l]),
    t
      ? p.createPortal(
          e.jsx('div', {
            className:
              'fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in',
            onClick: l,
            children: e.jsxs('div', {
              className:
                'relative w-full max-w-5xl bg-studio-950 border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-white animate-scale-up',
              onClick: (s) => s.stopPropagation(),
              children: [
                e.jsx('div', {
                  className: 'h-1.5 bg-gradient-to-r from-f1red via-amber-500 to-f1red',
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
                            e.jsx('span', {
                              className:
                                'text-xs font-mono font-bold uppercase tracking-wider text-f1red bg-f1red/15 px-2.5 py-0.5 rounded-full border border-f1red/30',
                              children: a
                                ? `Vòng ${t.round} · ${t.season}`
                                : `Round ${t.round} · ${t.season}`,
                            }),
                            t.isSynthesized
                              ? e.jsxs('span', {
                                  className:
                                    'inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20',
                                  children: [
                                    e.jsx(d, { className: 'w-3 h-3' }),
                                    ' ',
                                    a
                                      ? 'Dữ liệu suy diễn (Unofficial) — chỉ để hiển thị, không tính BXH'
                                      : 'Synthesized data (Unofficial) — display only, excluded from standings',
                                  ],
                                })
                              : e.jsxs('span', {
                                  className:
                                    'inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20',
                                  children: [
                                    e.jsx(d, { className: 'w-3 h-3' }),
                                    ' ',
                                    a ? 'Kết Quả Chính Thức' : 'Official Classification',
                                  ],
                                }),
                          ],
                        }),
                        e.jsx('h3', {
                          className:
                            'font-display text-xl sm:text-2xl font-black uppercase text-white tracking-wide',
                          children: t.grandPrix,
                        }),
                        e.jsxs('div', {
                          className: 'flex items-center gap-4 text-xs text-studio-400 flex-wrap',
                          children: [
                            e.jsxs('span', {
                              className: 'flex items-center gap-1',
                              children: [
                                e.jsx(u, { className: 'w-3.5 h-3.5 text-studio-500' }),
                                t.circuit,
                              ],
                            }),
                            e.jsxs('span', {
                              className: 'flex items-center gap-1',
                              children: [
                                e.jsx(b, { className: 'w-3.5 h-3.5 text-studio-500' }),
                                f(t.date, o),
                              ],
                            }),
                            e.jsxs('span', {
                              className: 'flex items-center gap-1 font-mono',
                              children: [
                                e.jsx(j, { className: 'w-3.5 h-3.5 text-studio-500' }),
                                e.jsx('span', { children: t.lapsTotal }),
                                e.jsx('span', { children: a ? 'Vòng' : 'Laps' }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsx('button', {
                      onClick: l,
                      className:
                        'p-2 rounded-xl text-studio-400 hover:text-white hover:bg-white/10 transition-colors shrink-0',
                      'aria-label': 'Close',
                      children: e.jsx(N, { className: 'w-5 h-5' }),
                    }),
                  ],
                }),
                e.jsxs('div', {
                  className:
                    'bg-black/40 border-b border-white/10 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs',
                  children: [
                    t.winner &&
                      e.jsxs('div', {
                        className: 'flex items-center gap-2',
                        children: [
                          e.jsx(x, { className: 'w-4 h-4 text-amber-400' }),
                          e.jsx('span', {
                            className: 'text-studio-400',
                            children: a ? 'Chiến thắng:' : 'Winner:',
                          }),
                          e.jsx('span', {
                            className: 'font-bold',
                            style: { color: i(t.winner.team || t.winner.driver, !0) },
                            children: t.winner.driver,
                          }),
                          e.jsxs('span', {
                            className: 'text-studio-500 font-mono',
                            children: ['(', r(t.winner.team, t.season), ')'],
                          }),
                          e.jsx('span', {
                            className: 'font-mono text-amber-400 ml-1 font-bold',
                            children: t.winner.time,
                          }),
                        ],
                      }),
                    t.fastestLap &&
                      e.jsxs('div', {
                        className: 'flex items-center gap-2',
                        children: [
                          e.jsx(w, { className: 'w-4 h-4 text-purple-400' }),
                          e.jsx('span', {
                            className: 'text-studio-400',
                            children: a ? 'Vòng nhanh nhất:' : 'Fastest Lap:',
                          }),
                          e.jsx('span', {
                            className: 'font-bold',
                            style: { color: i(t.fastestLap.team || t.fastestLap.driver, !0) },
                            children: t.fastestLap.driver,
                          }),
                          e.jsx('span', {
                            className: 'font-mono text-purple-300 font-bold ml-1',
                            children: t.fastestLap.time,
                          }),
                        ],
                      }),
                  ],
                }),
                e.jsx('div', {
                  className: 'p-4 sm:p-6 overflow-y-auto flex-1',
                  children: e.jsx('div', {
                    className: 'overflow-x-auto rounded-2xl border border-white/10',
                    children: e.jsxs('table', {
                      className: 'w-full text-left border-collapse text-xs',
                      children: [
                        e.jsx('thead', {
                          children: e.jsxs('tr', {
                            className:
                              'bg-white/5 border-b border-white/10 text-studio-400 uppercase tracking-wider text-[10px] font-bold',
                            children: [
                              e.jsx('th', {
                                className: 'py-3 px-4 w-12 text-center',
                                children: a ? 'Hạng' : 'Pos',
                              }),
                              e.jsx('th', {
                                className: 'py-3 px-3 w-12 text-center',
                                children: a ? 'Số' : 'No',
                              }),
                              e.jsx('th', {
                                className: 'py-3 px-4',
                                children: a ? 'Tay Đua' : 'Driver',
                              }),
                              e.jsx('th', {
                                className: 'py-3 px-4',
                                children: a ? 'Đội Đua' : 'Constructor',
                              }),
                              e.jsx('th', {
                                className: 'py-3 px-3 text-center',
                                children: a ? 'Số Vòng' : 'Laps',
                              }),
                              e.jsx('th', {
                                className: 'py-3 px-4 text-right',
                                children: a ? 'Thời Gian / Cách Biệt' : 'Time / Gap',
                              }),
                              e.jsx('th', {
                                className: 'py-3 px-4 text-right',
                                children: a ? 'Điểm (PTS)' : 'Points',
                              }),
                            ],
                          }),
                        }),
                        e.jsx('tbody', {
                          className: 'divide-y divide-white/5 font-medium',
                          children: t.entries.map((s) => {
                            const n = s.position >= 1 && s.position <= 3,
                              c =
                                s.status.toLowerCase().includes('dnf') ||
                                s.status.toLowerCase().includes('dns');
                            return e.jsxs(
                              'tr',
                              {
                                className: `hover:bg-white/[0.03] transition-colors ${n ? 'bg-white/[0.015]' : ''}`,
                                children: [
                                  e.jsx('td', {
                                    className: 'py-3 px-4 text-center font-bold',
                                    children:
                                      s.position === 1
                                        ? e.jsx('span', {
                                            className:
                                              'inline-flex w-6 h-6 rounded-full bg-amber-400 text-black font-black text-xs items-center justify-center shadow',
                                            children: '1',
                                          })
                                        : s.position === 2
                                          ? e.jsx('span', {
                                              className:
                                                'inline-flex w-6 h-6 rounded-full bg-slate-300 text-black font-black text-xs items-center justify-center',
                                              children: '2',
                                            })
                                          : s.position === 3
                                            ? e.jsx('span', {
                                                className:
                                                  'inline-flex w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs items-center justify-center',
                                                children: '3',
                                              })
                                            : e.jsx('span', {
                                                className: 'font-mono text-studio-400',
                                                children: s.position,
                                              }),
                                  }),
                                  e.jsxs('td', {
                                    className:
                                      'py-3 px-3 text-center font-mono font-bold text-studio-400',
                                    children: ['#', s.driverNumber],
                                  }),
                                  e.jsxs('td', {
                                    className: 'py-3 px-4 font-bold flex items-center gap-2',
                                    children: [
                                      s.position === 1 &&
                                        e.jsx(x, {
                                          className: 'w-3.5 h-3.5 text-amber-400 shrink-0',
                                        }),
                                      e.jsx('span', {
                                        style: { color: i(s.teamId || s.teamName, !0) },
                                        children: s.driverName,
                                      }),
                                    ],
                                  }),
                                  e.jsx('td', {
                                    className: 'py-3 px-4',
                                    children: e.jsx('span', {
                                      className:
                                        'inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border',
                                      style: {
                                        backgroundColor: `${i(s.teamId || s.teamName, !0)}18`,
                                        borderColor: `${i(s.teamId || s.teamName, !0)}55`,
                                        color: i(s.teamId || s.teamName, !0),
                                      },
                                      children: r(s.teamName, t.season),
                                    }),
                                  }),
                                  e.jsx('td', {
                                    className: 'py-3 px-3 text-center font-mono text-studio-300',
                                    children: s.laps,
                                  }),
                                  e.jsx('td', {
                                    className: 'py-3 px-4 text-right font-mono',
                                    children: c
                                      ? e.jsx('span', {
                                          className: 'text-red-400 font-bold uppercase',
                                          children: s.status,
                                        })
                                      : e.jsx('span', {
                                          className:
                                            s.position === 1
                                              ? 'text-amber-400 font-bold'
                                              : 'text-studio-300',
                                          children: s.timeOrGap,
                                        }),
                                  }),
                                  e.jsx('td', {
                                    className: 'py-3 px-4 text-right font-mono font-bold',
                                    children:
                                      s.points > 0
                                        ? e.jsxs('span', {
                                            className:
                                              'inline-block px-2 py-0.5 rounded bg-white/10 text-white',
                                            children: ['+', s.points],
                                          })
                                        : e.jsx('span', {
                                            className: 'text-studio-500',
                                            children: '0',
                                          }),
                                  }),
                                ],
                              },
                              `${t.id}-${s.driverId}`,
                            );
                          }),
                        }),
                      ],
                    }),
                  }),
                }),
                e.jsxs('div', {
                  className:
                    'p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-studio-400',
                  children: [
                    e.jsxs('div', {
                      className: 'flex items-center gap-2',
                      children: [
                        e.jsx(g, { className: 'w-4 h-4 text-f1red' }),
                        e.jsx('span', { children: 'FIA Formula 1 World Championship' }),
                      ],
                    }),
                    e.jsx('button', {
                      onClick: l,
                      className:
                        'px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer',
                      children: a ? 'Đóng' : 'Close',
                    }),
                  ],
                }),
              ],
            }),
          }),
          document.body,
        )
      : null
  );
};
export { P as RaceClassificationModal, P as default };
