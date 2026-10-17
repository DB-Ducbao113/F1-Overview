import { r as x, m as j, j as e } from './vendor-react-B62-MmwA.js';
import { u as w } from './index-CS6oMniN.js';
import { a as g } from './dateUtils-C4Mh2J_m.js';
import { g as l } from './teamColors-B_bsvcV9.js';
import { g as u } from './teamNames-KiqqJwCB.js';
import { a7 as c, e as v, X as k, aa as y, ab as C } from './vendor-icons-Brb4Fsqu.js';
import './vendor-core-ckwbz45p.js';
const A = ({ practiceData: a, initialSessionKey: o = 'fp1', onClose: n }) => {
  const { lang: m } = w(),
    r = m === 'vi',
    [d, p] = x.useState(o),
    [b, N] = x.useState(o);
  if (
    (o !== b && (N(o), p(o)),
    x.useEffect(() => {
      if (!a) return;
      const s = (i) => {
        i.key === 'Escape' && n();
      };
      return (
        window.addEventListener('keydown', s),
        () => window.removeEventListener('keydown', s)
      );
    }, [a, n]),
    !a)
  )
    return null;
  const t = a.sessions[d] || a.sessions.fp1 || a.sessions.fp2 || a.sessions.fp3;
  return j.createPortal(
    e.jsx('div', {
      className:
        'fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in',
      onClick: n,
      children: e.jsxs('div', {
        className:
          'relative w-full max-w-5xl bg-studio-950 border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-white animate-scale-up',
        onClick: (s) => s.stopPropagation(),
        children: [
          e.jsx('div', {
            className: 'h-1.5 bg-gradient-to-r from-sky-500 via-emerald-400 to-sky-500',
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
                          'text-xs font-mono font-bold uppercase tracking-wider text-sky-400 bg-sky-500/15 px-2.5 py-0.5 rounded-full border border-sky-500/30',
                        children: [
                          r ? `Chặng ${a.round}` : `Round ${a.round}`,
                          ' ·',
                          ' ',
                          a.season,
                        ],
                      }),
                      e.jsxs('span', {
                        className:
                          'inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20',
                        children: [
                          e.jsx(c, { className: 'w-3.5 h-3.5' }),
                          r ? 'Bảng Điểm Tập Thử Practice' : 'Free Practice Classification',
                        ],
                      }),
                    ],
                  }),
                  e.jsx('h3', {
                    className:
                      'font-display text-xl sm:text-2xl font-black uppercase text-white tracking-wide',
                    children: a.grandPrix,
                  }),
                  e.jsx('div', {
                    className: 'flex items-center gap-4 text-xs text-studio-400 flex-wrap',
                    children: e.jsxs('span', {
                      className: 'flex items-center gap-1',
                      children: [e.jsx(v, { className: 'w-3.5 h-3.5 text-studio-500' }), a.circuit],
                    }),
                  }),
                ],
              }),
              e.jsx('button', {
                onClick: n,
                className:
                  'p-2 rounded-xl text-studio-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer',
                'aria-label': 'Close modal',
                children: e.jsx(k, { className: 'w-5 h-5' }),
              }),
            ],
          }),
          e.jsx('div', {
            className:
              'bg-black/50 border-b border-white/10 px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto',
            children: ['fp1', 'fp2', 'fp3'].map((s) => {
              const i = a.sessions[s];
              if (!i) return null;
              const h = d === s,
                f = i.status === 'finished';
              return e.jsxs(
                'button',
                {
                  onClick: () => p(s),
                  className: `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border shrink-0 ${h ? 'bg-sky-500 text-black border-sky-400 shadow-md font-black' : 'bg-white/5 text-studio-300 border-white/10 hover:bg-white/10 hover:text-white'}`,
                  children: [
                    e.jsx('span', { children: g(i.sessionName, m) }),
                    e.jsx('span', {
                      className: `text-[9px] px-1.5 py-0.2 rounded font-mono ${h ? 'bg-black/20 text-black font-bold' : f ? 'bg-emerald-500/20 text-emerald-400' : 'bg-studio-800 text-studio-400'}`,
                      children: f ? (r ? 'Đã chạy' : 'Finished') : r ? 'Sắp tới' : 'Scheduled',
                    }),
                  ],
                },
                s,
              );
            }),
          }),
          t &&
            e.jsxs('div', {
              className:
                'bg-black/40 border-b border-white/10 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs',
              children: [
                t.fastestDriver &&
                  e.jsxs('div', {
                    className: 'flex items-center gap-2',
                    children: [
                      e.jsx(c, { className: 'w-4 h-4 text-sky-400' }),
                      e.jsx('span', {
                        className: 'text-studio-400',
                        children: r ? 'Nhanh nhất phiên:' : 'Fastest in session:',
                      }),
                      e.jsx('span', {
                        className: 'font-bold',
                        style: { color: l(t.fastestDriver.team || t.fastestDriver.driver, !0) },
                        children: t.fastestDriver.driver,
                      }),
                      e.jsxs('span', {
                        className: 'text-studio-500 font-mono',
                        children: ['(', u(t.fastestDriver.team), ')'],
                      }),
                      e.jsx('span', {
                        className: 'font-mono text-sky-300 font-bold ml-1',
                        children: t.fastestDriver.time,
                      }),
                    ],
                  }),
                e.jsxs('div', {
                  className: 'flex items-center gap-3 text-studio-400 font-mono text-[11px]',
                  children: [
                    t.weather &&
                      e.jsxs('span', {
                        className: 'flex items-center gap-1',
                        children: [
                          e.jsx(y, { className: 'w-3.5 h-3.5 text-amber-400' }),
                          t.weather,
                        ],
                      }),
                    t.airTempC &&
                      e.jsxs('span', {
                        className: 'flex items-center gap-1',
                        children: [
                          e.jsx(C, { className: 'w-3.5 h-3.5 text-sky-400' }),
                          'Air: ',
                          t.airTempC,
                          '°C',
                        ],
                      }),
                    t.trackTempC &&
                      e.jsxs('span', {
                        className: 'text-studio-500',
                        children: ['Track: ', t.trackTempC, '°C'],
                      }),
                  ],
                }),
              ],
            }),
          e.jsx('div', {
            className: 'p-4 sm:p-6 overflow-y-auto flex-1',
            children: t
              ? e.jsx('div', {
                  className: 'overflow-x-auto rounded-2xl border border-white/10',
                  children: e.jsxs('table', {
                    className: 'w-full text-left border-collapse text-xs min-w-[620px]',
                    children: [
                      e.jsx('thead', {
                        children: e.jsxs('tr', {
                          className:
                            'bg-white/5 border-b border-white/10 text-studio-400 uppercase tracking-wider text-[10px] font-bold',
                          children: [
                            e.jsx('th', {
                              className: 'py-3 px-4 w-12 text-center',
                              children: r ? 'Hạng' : 'Pos',
                            }),
                            e.jsx('th', {
                              className: 'py-3 px-3 w-12 text-center',
                              children: r ? 'Số' : 'No',
                            }),
                            e.jsx('th', {
                              className: 'py-3 px-4',
                              children: r ? 'Tay Đua' : 'Driver',
                            }),
                            e.jsx('th', {
                              className: 'py-3 px-4',
                              children: r ? 'Đội Đua' : 'Constructor',
                            }),
                            e.jsx('th', {
                              className: 'py-3 px-4 text-right',
                              children: r ? 'Thời Gian Tốt Nhất' : 'Best Lap Time',
                            }),
                            e.jsx('th', {
                              className: 'py-3 px-4 text-right',
                              children: r ? 'Cách Biệt P1' : 'Gap to P1',
                            }),
                            e.jsx('th', {
                              className: 'py-3 px-3 text-center',
                              children: r ? 'Số Vòng' : 'Laps',
                            }),
                          ],
                        }),
                      }),
                      e.jsx('tbody', {
                        className: 'divide-y divide-white/5 font-medium',
                        children: t.entries.map((s) => {
                          const i = s.position === 1;
                          return e.jsxs(
                            'tr',
                            {
                              className: `hover:bg-white/[0.03] transition-colors ${i ? 'bg-sky-500/10' : ''}`,
                              children: [
                                e.jsx('td', {
                                  className: 'py-3 px-4 text-center font-bold',
                                  children: i
                                    ? e.jsx('span', {
                                        className:
                                          'inline-flex w-6 h-6 rounded-full bg-sky-400 text-black font-black text-xs items-center justify-center shadow',
                                        children: '1',
                                      })
                                    : s.position <= 3
                                      ? e.jsx('span', {
                                          className:
                                            'inline-flex w-6 h-6 rounded-full bg-white/20 text-white font-bold text-xs items-center justify-center',
                                          children: s.position,
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
                                    e.jsx('span', {
                                      className: 'font-mono text-xs text-studio-400 w-8',
                                      children: s.driverCode,
                                    }),
                                    e.jsx('span', {
                                      style: { color: l(s.teamId || s.teamName, !0) },
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
                                      backgroundColor: `${l(s.teamId || s.teamName, !0)}18`,
                                      borderColor: `${l(s.teamId || s.teamName, !0)}55`,
                                      color: l(s.teamId || s.teamName, !0),
                                    },
                                    children: u(s.teamName),
                                  }),
                                }),
                                e.jsx('td', {
                                  className:
                                    'py-3 px-4 text-right font-mono font-bold text-sky-300',
                                  children: s.bestLapTime,
                                }),
                                e.jsx('td', {
                                  className: 'py-3 px-4 text-right font-mono text-studio-300',
                                  children:
                                    s.gapToP1 === 'LEADER'
                                      ? e.jsx('span', {
                                          className: 'text-emerald-400 font-bold',
                                          children: 'LEADER',
                                        })
                                      : s.gapToP1,
                                }),
                                e.jsx('td', {
                                  className: 'py-3 px-3 text-center font-mono text-studio-400',
                                  children: s.lapsCompleted,
                                }),
                              ],
                            },
                            `${d}-${s.driverId}`,
                          );
                        }),
                      }),
                    ],
                  }),
                })
              : e.jsx('div', {
                  className: 'p-12 text-center text-studio-400 text-sm',
                  children: r ? 'Phiên chạy chưa diễn ra.' : 'Session not held yet.',
                }),
          }),
          e.jsxs('div', {
            className:
              'p-4 sm:p-5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs text-studio-400',
            children: [
              e.jsxs('div', {
                className: 'flex items-center gap-2',
                children: [
                  e.jsx(c, { className: 'w-4 h-4 text-sky-400' }),
                  e.jsx('span', {
                    children: 'FIA Formula 1 World Championship · Practice Telemetry',
                  }),
                ],
              }),
              e.jsx('button', {
                onClick: n,
                className:
                  'px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer',
                children: r ? 'Đóng' : 'Close',
              }),
            ],
          }),
        ],
      }),
    }),
    document.body,
  );
};
export { A as PracticeClassificationModal, A as default };
