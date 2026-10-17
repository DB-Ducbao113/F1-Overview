const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      'assets/RaceClassificationModal-DZCDQYyd.js',
      'assets/vendor-react-B62-MmwA.js',
      'assets/index-Bpqcd1AQ.js',
      'assets/vendor-core-ckwbz45p.js',
      'assets/vendor-icons-Brb4Fsqu.js',
      'assets/index-CWaiePfj.css',
      'assets/dateUtils-C4Mh2J_m.js',
      'assets/teamColors-B_bsvcV9.js',
      'assets/teamNames-DMoXlsIr.js',
    ]),
) => i.map((i) => d[i]);
import { _ as M } from './vendor-core-ckwbz45p.js';
import { R as _, r, j as e } from './vendor-react-B62-MmwA.js';
import { u as D, a as F, S as O, e as q, f as V } from './index-Bpqcd1AQ.js';
import './circuitsData-DyBO7Cz4.js';
import { f as T } from './dateUtils-C4Mh2J_m.js';
import { g as n } from './teamColors-B_bsvcV9.js';
import { g as m } from './teamNames-DMoXlsIr.js';
import { C as A } from './Card3DTilt-DK6ssBNb.js';
import {
  g as E,
  a8 as H,
  a9 as I,
  a1 as Q,
  X,
  V as K,
  e as z,
  T as B,
  y as S,
  q as P,
} from './vendor-icons-Brb4Fsqu.js';
const U = r.lazy(() =>
    M(
      () => import('./RaceClassificationModal-DZCDQYyd.js'),
      __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8]),
    ).then((a) => ({ default: a.RaceClassificationModal })),
  ),
  le = _.memo(({ season: a }) => {
    const { lang: d } = D(),
      { detailedResults: j, selectedRaceRound: w, setSelectedRaceRound: g } = F(),
      [p, y] = r.useState(''),
      [o, k] = r.useState('all'),
      [N, C] = r.useState('grid'),
      u = r.useMemo(() => {
        const t = j[a] || [],
          i = V(a),
          l = new Set(i.map((s) => s.round)),
          v = t.flatMap((s) => {
            if (l.has(s.round)) return [];
            const x = s.entries.find((b) => b.position === 1),
              h = s.entries.find((b) => b.position === 2),
              f = s.entries.find((b) => b.position === 3);
            if (!x || !h || !f) return [];
            const R = s.fastestLap;
            return [
              {
                round: s.round,
                grandPrix: s.grandPrix,
                circuit: s.circuit,
                season: s.season,
                date: s.date,
                podium: {
                  p1: {
                    driver: x.driverName,
                    team: x.teamName,
                    time: x.timeOrGap,
                    points: x.points,
                  },
                  p2: {
                    driver: h.driverName,
                    team: h.teamName,
                    gap: h.timeOrGap,
                    points: h.points,
                  },
                  p3: {
                    driver: f.driverName,
                    team: f.teamName,
                    gap: f.timeOrGap,
                    points: f.points,
                  },
                },
                ...(R ? { fastestLap: R } : {}),
              },
            ];
          });
        return [...i, ...v].sort((s, x) => s.round - x.round);
      }, [j, a]),
      $ = r.useMemo(() => {
        var t;
        return ((t = O[a]) == null ? void 0 : t.constructors) || [];
      }, [a]),
      G = (t, i) => {
        const l = t.toLowerCase();
        return [
          i.podium.p1.team.toLowerCase(),
          i.podium.p2.team.toLowerCase(),
          i.podium.p3.team.toLowerCase(),
        ].some(
          (s) =>
            !!(
              s.includes(l) ||
              (l.includes('red bull') && s.includes('red bull')) ||
              (l === 'redbull' && s.includes('red bull')) ||
              ((l.includes('audi') || l.includes('sauber')) &&
                (s.includes('audi') || s.includes('sauber'))) ||
              ((l.includes('racing bulls') || l.includes('rb')) &&
                (s.includes('racing bulls') || s.includes('rb'))) ||
              (l.includes('aston') && s.includes('aston')) ||
              (l.includes('mercedes') && s.includes('mercedes')) ||
              (l.includes('ferrari') && s.includes('ferrari')) ||
              (l.includes('mclaren') && s.includes('mclaren')) ||
              (l.includes('williams') && s.includes('williams')) ||
              (l.includes('haas') && s.includes('haas')) ||
              (l.includes('alpine') && s.includes('alpine')) ||
              (l.includes('cadillac') && s.includes('cadillac'))
            ),
        );
      },
      c = r.useMemo(() => {
        const t = p.trim().toLowerCase();
        return u.filter((i) => {
          const l =
              !t ||
              i.grandPrix.toLowerCase().includes(t) ||
              i.circuit.toLowerCase().includes(t) ||
              i.podium.p1.driver.toLowerCase().includes(t) ||
              i.podium.p2.driver.toLowerCase().includes(t) ||
              i.podium.p3.driver.toLowerCase().includes(t) ||
              i.podium.p1.team.toLowerCase().includes(t) ||
              i.podium.p2.team.toLowerCase().includes(t) ||
              i.podium.p3.team.toLowerCase().includes(t),
            v = o === 'all' || G(o, i);
          return l && v;
        });
      }, [u, p, o]),
      L = r.useMemo(() => (w ? q(a, w, j[a]) : null), [a, w, j]);
    return e.jsxs('div', {
      className: 'space-y-6 animate-fade-in',
      children: [
        e.jsxs('div', {
          className:
            'p-5 bg-white rounded-2xl border border-studio-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4',
          children: [
            e.jsxs('div', {
              children: [
                e.jsxs('div', {
                  className: 'flex items-center gap-2 mb-1 flex-wrap',
                  children: [
                    e.jsx('h3', {
                      className:
                        'font-display text-xl font-bold uppercase tracking-wider text-studio-950',
                      children:
                        d === 'vi' ? `Kết Quả Các Chặng Đua (${a})` : `Grand Prix Results (${a})`,
                    }),
                    e.jsxs('span', {
                      className:
                        'inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200',
                      children: [
                        e.jsx(E, { className: 'w-3.5 h-3.5 text-emerald-600' }),
                        d === 'vi'
                          ? `${u.length} chặng hoàn thành`
                          : `${u.length} completed rounds`,
                      ],
                    }),
                  ],
                }),
                e.jsx('p', {
                  className: 'text-xs text-studio-500 font-medium',
                  children:
                    d === 'vi'
                      ? 'Chi tiết bảng xếp hạng, tay đua về nhất, bục vinh quang và vòng chạy nhanh nhất cho từng chặng.'
                      : 'Official race results, podium finishes, and fastest laps for each Grand Prix of the championship.',
                }),
              ],
            }),
            e.jsx('div', {
              className: 'flex items-center gap-2 self-start md:self-auto',
              children: e.jsxs('div', {
                className:
                  'flex items-center bg-studio-100 p-1 rounded-xl border border-studio-200',
                children: [
                  e.jsxs('button', {
                    onClick: () => C('grid'),
                    className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${N === 'grid' ? 'bg-white text-f1red shadow-xs' : 'text-studio-600 hover:text-studio-950'}`,
                    children: [
                      e.jsx(H, { className: 'w-3.5 h-3.5' }),
                      e.jsx('span', { children: d === 'vi' ? 'Thẻ' : 'Grid' }),
                    ],
                  }),
                  e.jsxs('button', {
                    onClick: () => C('table'),
                    className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${N === 'table' ? 'bg-white text-f1red shadow-xs' : 'text-studio-600 hover:text-studio-950'}`,
                    children: [
                      e.jsx(I, { className: 'w-3.5 h-3.5' }),
                      e.jsx('span', { children: d === 'vi' ? 'Bảng' : 'Table' }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        }),
        e.jsxs('div', {
          className:
            'flex flex-col gap-3.5 bg-white p-4 rounded-2xl border border-studio-200 shadow-xs',
          children: [
            e.jsxs('div', {
              className:
                'flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3',
              children: [
                e.jsxs('div', {
                  className: 'relative flex-1 max-w-md',
                  children: [
                    e.jsx(Q, {
                      className:
                        'absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-400',
                    }),
                    e.jsx('input', {
                      type: 'text',
                      value: p,
                      onChange: (t) => y(t.target.value),
                      placeholder:
                        d === 'vi'
                          ? 'Tìm chặng đua, trường đua hoặc tay đua...'
                          : 'Search Grand Prix, circuit or driver...',
                      className:
                        'w-full pl-9 pr-8 py-2 text-xs font-medium bg-studio-50 border border-studio-200 rounded-xl focus:outline-none focus:border-f1red focus:bg-white transition-all text-studio-900 placeholder:text-studio-400',
                    }),
                    p &&
                      e.jsx('button', {
                        onClick: () => y(''),
                        className:
                          'absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-studio-400 hover:text-studio-700',
                        children: e.jsx(X, { className: 'w-3.5 h-3.5' }),
                      }),
                  ],
                }),
                e.jsx('div', {
                  className: 'text-xs text-studio-500 font-medium',
                  children:
                    d === 'vi'
                      ? e.jsxs(e.Fragment, {
                          children: [
                            'Hiển thị ',
                            e.jsx('strong', { children: c.length }),
                            ' / ',
                            u.length,
                            ' chặng',
                          ],
                        })
                      : e.jsxs(e.Fragment, {
                          children: [
                            'Showing ',
                            e.jsx('strong', { children: c.length }),
                            ' of ',
                            u.length,
                            ' rounds',
                          ],
                        }),
                }),
              ],
            }),
            e.jsxs('div', {
              className: 'flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full',
              children: [
                e.jsx('button', {
                  onClick: () => k('all'),
                  className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${o === 'all' ? 'bg-studio-950 text-white shadow-xs' : 'bg-studio-100 text-studio-600 hover:bg-studio-200 hover:text-studio-950'}`,
                  children: d === 'vi' ? 'Tất cả đội' : 'All teams',
                }),
                $.map((t) => {
                  const i = o === t.teamName;
                  return e.jsxs(
                    'button',
                    {
                      onClick: () => k(i ? 'all' : t.teamName),
                      className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${i ? 'bg-f1red text-white shadow-xs' : 'bg-studio-100 text-studio-600 hover:bg-studio-200 hover:text-studio-950'}`,
                      children: [
                        e.jsx('span', { children: m(t.teamName, a) }),
                        t.podiums > 0 &&
                          e.jsxs('span', {
                            className: `text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${i ? 'bg-white/20 text-white' : 'bg-studio-200/80 text-studio-700'}`,
                            children: [t.podiums, 'P'],
                          }),
                      ],
                    },
                    t.teamId,
                  );
                }),
              ],
            }),
          ],
        }),
        c.length === 0 &&
          e.jsxs('div', {
            className: 'p-12 text-center bg-white rounded-2xl border border-studio-200',
            children: [
              e.jsx(K, { className: 'w-8 h-8 text-studio-300 mx-auto mb-2' }),
              e.jsx('p', {
                className: 'font-bold text-studio-700 text-sm',
                children:
                  d === 'vi'
                    ? `Không tìm thấy chặng đua phù hợp với "${o !== 'all' ? o : p}"`
                    : 'No matching Grand Prix found',
              }),
              o !== 'all' &&
                e.jsx('p', {
                  className: 'text-xs text-studio-500 mt-1 max-w-md mx-auto',
                  children:
                    d === 'vi'
                      ? `Đội ${o} chưa có chặng nào kết thúc trong top 3 trong mùa giải ${a}. Hãy bấm vào "Xem kết quả chi tiết" ở các chặng để xem thứ hạng hoàn thành của đội.`
                      : `Team ${o} has not achieved podium finishes in season ${a}.`,
                }),
              e.jsx('button', {
                onClick: () => {
                  (y(''), k('all'));
                },
                className:
                  'mt-4 px-4 py-1.5 rounded-lg bg-studio-100 hover:bg-studio-200 text-xs font-bold text-studio-800 transition cursor-pointer',
                children: d === 'vi' ? 'Đặt lại bộ lọc' : 'Reset filters',
              }),
            ],
          }),
        N === 'grid' &&
          c.length > 0 &&
          e.jsx('div', {
            className: 'grid grid-cols-1 md:grid-cols-2 gap-6',
            children: c.map((t) =>
              e.jsxs(
                A,
                {
                  maxTilt: 3,
                  glareOpacity: 0.12,
                  className:
                    'bg-white rounded-2xl border border-studio-200 shadow-subtle p-5 sm:p-6 space-y-4 hover:border-studio-300 hover:shadow-md transition-all flex flex-col h-full',
                  children: [
                    e.jsxs('div', {
                      className:
                        'flex items-start justify-between pb-3 border-b border-studio-100 gap-3',
                      children: [
                        e.jsxs('div', {
                          className: 'min-w-0',
                          children: [
                            e.jsxs('div', {
                              className: 'flex items-center gap-2 mb-1 flex-wrap',
                              children: [
                                e.jsxs('span', {
                                  className:
                                    'text-[11px] font-mono font-black uppercase tracking-wider text-f1red bg-f1red/10 px-2 py-0.5 rounded-md',
                                  children: ['ROUND ', t.round < 10 ? `0${t.round}` : t.round],
                                }),
                                e.jsx('span', {
                                  className: 'text-xs font-bold text-studio-400',
                                  children: '·',
                                }),
                                e.jsx('span', {
                                  className: 'text-xs font-medium text-studio-500',
                                  children: T(t.date, d),
                                }),
                              ],
                            }),
                            e.jsx('h4', {
                              className:
                                'font-display text-lg sm:text-xl font-black text-studio-950 truncate',
                              children: t.grandPrix,
                            }),
                            e.jsxs('p', {
                              className:
                                'text-xs text-studio-500 font-medium truncate flex items-center gap-1 mt-0.5',
                              children: [
                                e.jsx(z, { className: 'w-3 h-3 text-studio-400 shrink-0' }),
                                e.jsx('span', { children: t.circuit }),
                              ],
                            }),
                          ],
                        }),
                        e.jsx('div', {
                          className:
                            'w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0',
                          children: e.jsx(B, { className: 'w-5 h-5 text-amber-500' }),
                        }),
                      ],
                    }),
                    e.jsxs('div', {
                      className: 'space-y-2',
                      children: [
                        e.jsxs('div', {
                          className:
                            'p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between',
                          children: [
                            e.jsxs('div', {
                              className: 'flex items-center gap-3 min-w-0',
                              children: [
                                e.jsx('span', {
                                  className:
                                    'w-6 h-6 rounded-full bg-amber-400 text-black font-black text-xs flex items-center justify-center shrink-0 shadow-xs',
                                  children: '1',
                                }),
                                e.jsxs('div', {
                                  className: 'min-w-0',
                                  children: [
                                    e.jsx('span', {
                                      className: 'font-black text-sm block truncate',
                                      style: {
                                        color: n(t.podium.p1.team || t.podium.p1.driver, !1),
                                      },
                                      children: t.podium.p1.driver,
                                    }),
                                    e.jsx('span', {
                                      className: 'text-[11px] font-bold block truncate',
                                      style: {
                                        color: n(t.podium.p1.team || t.podium.p1.driver, !1),
                                      },
                                      children: m(t.podium.p1.team, a),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            e.jsxs('div', {
                              className: 'text-right shrink-0 ml-2',
                              children: [
                                e.jsx('span', {
                                  className: 'text-xs font-mono font-bold text-studio-900 block',
                                  children: t.podium.p1.time,
                                }),
                                e.jsxs('span', {
                                  className:
                                    'text-[10px] font-bold text-amber-800 bg-amber-200/60 px-1.5 py-0.5 rounded',
                                  children: ['+', t.podium.p1.points, ' PTS'],
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs('div', {
                          className:
                            'p-2.5 rounded-xl bg-studio-50/80 border border-studio-200 flex items-center justify-between',
                          children: [
                            e.jsxs('div', {
                              className: 'flex items-center gap-3 min-w-0',
                              children: [
                                e.jsx('span', {
                                  className:
                                    'w-5 h-5 rounded-full bg-studio-300 text-studio-900 font-black text-[11px] flex items-center justify-center shrink-0',
                                  children: '2',
                                }),
                                e.jsxs('div', {
                                  className: 'min-w-0',
                                  children: [
                                    e.jsx('span', {
                                      className: 'font-bold text-xs block truncate',
                                      style: {
                                        color: n(t.podium.p2.team || t.podium.p2.driver, !1),
                                      },
                                      children: t.podium.p2.driver,
                                    }),
                                    e.jsx('span', {
                                      className: 'text-[10px] font-bold block truncate',
                                      style: {
                                        color: n(t.podium.p2.team || t.podium.p2.driver, !1),
                                      },
                                      children: m(t.podium.p2.team, a),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            e.jsxs('div', {
                              className: 'text-right shrink-0 ml-2',
                              children: [
                                e.jsx('span', {
                                  className: 'text-xs font-mono text-studio-700 block',
                                  children: t.podium.p2.gap,
                                }),
                                e.jsxs('span', {
                                  className: 'text-[10px] font-bold text-studio-700',
                                  children: ['+', t.podium.p2.points, ' PTS'],
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs('div', {
                          className:
                            'p-2.5 rounded-xl bg-studio-50/80 border border-studio-200 flex items-center justify-between',
                          children: [
                            e.jsxs('div', {
                              className: 'flex items-center gap-3 min-w-0',
                              children: [
                                e.jsx('span', {
                                  className:
                                    'w-5 h-5 rounded-full bg-amber-700 text-white font-black text-[11px] flex items-center justify-center shrink-0',
                                  children: '3',
                                }),
                                e.jsxs('div', {
                                  className: 'min-w-0',
                                  children: [
                                    e.jsx('span', {
                                      className: 'font-bold text-xs block truncate',
                                      style: {
                                        color: n(t.podium.p3.team || t.podium.p3.driver, !1),
                                      },
                                      children: t.podium.p3.driver,
                                    }),
                                    e.jsx('span', {
                                      className: 'text-[10px] font-bold block truncate',
                                      style: {
                                        color: n(t.podium.p3.team || t.podium.p3.driver, !1),
                                      },
                                      children: m(t.podium.p3.team, a),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            e.jsxs('div', {
                              className: 'text-right shrink-0 ml-2',
                              children: [
                                e.jsx('span', {
                                  className: 'text-xs font-mono text-studio-700 block',
                                  children: t.podium.p3.gap,
                                }),
                                e.jsxs('span', {
                                  className: 'text-[10px] font-bold text-studio-700',
                                  children: ['+', t.podium.p3.points, ' PTS'],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    t.fastestLap &&
                      e.jsxs('div', {
                        className:
                          'pt-2 border-t border-studio-100 flex items-center justify-between text-xs text-studio-600',
                        children: [
                          e.jsxs('span', {
                            className: 'flex items-center gap-1.5 font-medium min-w-0 truncate',
                            children: [
                              e.jsx(S, { className: 'w-3.5 h-3.5 text-purple-600 shrink-0' }),
                              e.jsx('span', {
                                children: d === 'vi' ? 'Vòng nhanh nhất:' : 'Fastest Lap:',
                              }),
                              e.jsx('strong', {
                                className: 'truncate font-black',
                                style: { color: n(t.fastestLap.team || t.fastestLap.driver, !1) },
                                children: t.fastestLap.driver,
                              }),
                            ],
                          }),
                          e.jsx('span', {
                            className: 'font-mono font-bold text-purple-700 shrink-0 ml-2',
                            children: t.fastestLap.time,
                          }),
                        ],
                      }),
                    e.jsxs('button', {
                      onClick: () => g(t.round),
                      className:
                        'w-full mt-auto py-2.5 px-4 rounded-xl bg-studio-950 hover:bg-f1red text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]',
                      children: [
                        e.jsx('span', {
                          children:
                            d === 'vi' ? 'Xem kết quả chi tiết' : 'View full classification',
                        }),
                        e.jsx(P, { className: 'w-4 h-4' }),
                      ],
                    }),
                  ],
                },
                t.round,
              ),
            ),
          }),
        N === 'table' &&
          c.length > 0 &&
          e.jsx('div', {
            className: 'bg-white rounded-2xl border border-studio-200 shadow-xs overflow-hidden',
            children: e.jsx('div', {
              className: 'overflow-x-auto',
              children: e.jsxs('table', {
                className: 'w-full text-left border-collapse text-xs',
                children: [
                  e.jsx('thead', {
                    children: e.jsxs('tr', {
                      className:
                        'bg-studio-50 border-b border-studio-200 text-studio-600 uppercase tracking-wider text-[11px] font-black',
                      children: [
                        e.jsx('th', {
                          className: 'py-3.5 px-4 text-center w-14',
                          children: 'Round',
                        }),
                        e.jsx('th', {
                          className: 'py-3.5 px-4 min-w-[200px]',
                          children: 'Grand Prix / Circuit',
                        }),
                        e.jsx('th', { className: 'py-3.5 px-4 min-w-[100px]', children: 'Ngày' }),
                        e.jsx('th', {
                          className: 'py-3.5 px-4 min-w-[180px]',
                          children: 'Về Nhất (P1)',
                        }),
                        e.jsx('th', {
                          className: 'py-3.5 px-4 min-w-[150px]',
                          children: 'Hạng 2 (P2)',
                        }),
                        e.jsx('th', {
                          className: 'py-3.5 px-4 min-w-[150px]',
                          children: 'Hạng 3 (P3)',
                        }),
                        e.jsx('th', {
                          className: 'py-3.5 px-4 min-w-[140px]',
                          children: 'Fastest Lap',
                        }),
                        e.jsx('th', {
                          className: 'py-3.5 px-4 text-right w-24',
                          children: 'Chi tiết',
                        }),
                      ],
                    }),
                  }),
                  e.jsx('tbody', {
                    className: 'divide-y divide-studio-100 font-medium',
                    children: c.map((t) =>
                      e.jsxs(
                        'tr',
                        {
                          className: 'hover:bg-studio-50/80 transition-colors cursor-pointer',
                          onClick: () => g(t.round),
                          children: [
                            e.jsxs('td', {
                              className: 'py-3.5 px-4 text-center font-mono font-bold text-f1red',
                              children: ['R', t.round < 10 ? `0${t.round}` : t.round],
                            }),
                            e.jsxs('td', {
                              className: 'py-3.5 px-4',
                              children: [
                                e.jsx('span', {
                                  className: 'font-bold text-studio-950 block text-sm',
                                  children: t.grandPrix,
                                }),
                                e.jsx('span', {
                                  className: 'text-[11px] text-studio-500',
                                  children: t.circuit,
                                }),
                              ],
                            }),
                            e.jsx('td', {
                              className: 'py-3.5 px-4 font-mono text-studio-600 text-[11px]',
                              children: T(t.date, d),
                            }),
                            e.jsx('td', {
                              className: 'py-3.5 px-4',
                              children: e.jsxs('div', {
                                className: 'flex items-center gap-2',
                                children: [
                                  e.jsx('span', {
                                    className:
                                      'w-5 h-5 rounded-full bg-amber-400 text-black font-black text-[10px] flex items-center justify-center shrink-0',
                                    children: '1',
                                  }),
                                  e.jsxs('div', {
                                    children: [
                                      e.jsx('span', {
                                        className: 'font-extrabold block',
                                        style: {
                                          color: n(t.podium.p1.team || t.podium.p1.driver, !1),
                                        },
                                        children: t.podium.p1.driver,
                                      }),
                                      e.jsxs('span', {
                                        className: 'text-[10px] font-mono',
                                        children: [
                                          e.jsx('span', {
                                            className: 'font-bold',
                                            style: {
                                              color: n(t.podium.p1.team || t.podium.p1.driver, !1),
                                            },
                                            children: m(t.podium.p1.team, a),
                                          }),
                                          e.jsxs('span', {
                                            className: 'text-studio-500',
                                            children: [' · ', t.podium.p1.time],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            }),
                            e.jsxs('td', {
                              className: 'py-3.5 px-4',
                              children: [
                                e.jsx('span', {
                                  className: 'font-extrabold block',
                                  style: { color: n(t.podium.p2.team || t.podium.p2.driver, !1) },
                                  children: t.podium.p2.driver,
                                }),
                                e.jsxs('span', {
                                  className: 'text-[10px] font-mono',
                                  children: [
                                    e.jsx('span', {
                                      className: 'font-bold',
                                      style: {
                                        color: n(t.podium.p2.team || t.podium.p2.driver, !1),
                                      },
                                      children: m(t.podium.p2.team, a),
                                    }),
                                    e.jsxs('span', {
                                      className: 'text-studio-500',
                                      children: [' (', t.podium.p2.gap, ')'],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            e.jsxs('td', {
                              className: 'py-3.5 px-4',
                              children: [
                                e.jsx('span', {
                                  className: 'font-extrabold block',
                                  style: { color: n(t.podium.p3.team || t.podium.p3.driver, !1) },
                                  children: t.podium.p3.driver,
                                }),
                                e.jsxs('span', {
                                  className: 'text-[10px] font-mono',
                                  children: [
                                    e.jsx('span', {
                                      className: 'font-bold',
                                      style: {
                                        color: n(t.podium.p3.team || t.podium.p3.driver, !1),
                                      },
                                      children: m(t.podium.p3.team, a),
                                    }),
                                    e.jsxs('span', {
                                      className: 'text-studio-500',
                                      children: [' (', t.podium.p3.gap, ')'],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            e.jsx('td', {
                              className: 'py-3.5 px-4',
                              children: t.fastestLap
                                ? e.jsxs('div', {
                                    className: 'flex items-center gap-1.5',
                                    children: [
                                      e.jsx(S, { className: 'w-3 h-3 text-purple-600 shrink-0' }),
                                      e.jsxs('div', {
                                        children: [
                                          e.jsx('span', {
                                            className: 'font-extrabold block',
                                            style: {
                                              color: n(
                                                t.fastestLap.team || t.fastestLap.driver,
                                                !1,
                                              ),
                                            },
                                            children: t.fastestLap.driver,
                                          }),
                                          e.jsx('span', {
                                            className: 'font-mono text-[10px] text-purple-700',
                                            children: t.fastestLap.time,
                                          }),
                                        ],
                                      }),
                                    ],
                                  })
                                : e.jsx('span', {
                                    className: 'text-studio-400 font-mono',
                                    children: '-',
                                  }),
                            }),
                            e.jsx('td', {
                              className: 'py-3.5 px-4 text-right',
                              children: e.jsx('button', {
                                onClick: (i) => {
                                  (i.stopPropagation(), g(t.round));
                                },
                                className:
                                  'p-2 rounded-lg bg-studio-100 hover:bg-f1red hover:text-white text-studio-700 transition cursor-pointer',
                                children: e.jsx(P, { className: 'w-4 h-4' }),
                              }),
                            }),
                          ],
                        },
                        t.round,
                      ),
                    ),
                  }),
                ],
              }),
            }),
          }),
        L &&
          e.jsx(r.Suspense, {
            fallback: null,
            children: e.jsx(U, { race: L, onClose: () => g(null) }),
          }),
      ],
    });
  });
export { le as RaceResults };
