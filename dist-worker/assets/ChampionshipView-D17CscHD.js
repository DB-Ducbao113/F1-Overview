const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      'assets/RaceCalendar-BwCfbrDn.js',
      'assets/vendor-core-ckwbz45p.js',
      'assets/vendor-react-B62-MmwA.js',
      'assets/index-C6VPy6l3.js',
      'assets/vendor-icons-Brb4Fsqu.js',
      'assets/index-B7qEOR9J.css',
      'assets/circuitsData-CkwD4Tuo.js',
      'assets/dateUtils-C4Mh2J_m.js',
      'assets/Card3DTilt-DK6ssBNb.js',
      'assets/raceSchedule-C_1d8gwS.js',
      'assets/RaceResults-BMa_dhZ-.js',
      'assets/teamColors-B_bsvcV9.js',
      'assets/teamNames-Bb9SyeFa.js',
      'assets/TeamsDirectoryPage-BJtg6oU1.js',
      'assets/teamSeasons-C1XHo0kd.js',
      'assets/ConstructorLogo-BPzo8jEn.js',
      'assets/ViewportImage-C-v4fzqx.js',
      'assets/DriversDirectoryPage-d3qpsSpl.js',
      'assets/drivers-CmneIBY8.js',
    ]),
) => i.map((i) => d[i]);
import { _ as y } from './vendor-core-ckwbz45p.js';
import { R as D, j as e, L as N, r as p } from './vendor-react-B62-MmwA.js';
import { u as T, a as v, t as _, b as R } from './index-C6VPy6l3.js';
import './circuitsData-CkwD4Tuo.js';
import { D as I } from './drivers-CmneIBY8.js';
import { g as j } from './teamColors-B_bsvcV9.js';
import { g as w } from './teamNames-Bb9SyeFa.js';
import { C as E } from './Card3DTilt-DK6ssBNb.js';
import {
  j as P,
  k as L,
  E as A,
  l as M,
  T as $,
  C as U,
  g as S,
  U as O,
  m as V,
  R as z,
} from './vendor-icons-Brb4Fsqu.js';
const F = D.memo(({ season: t }) => {
    var k, C;
    const { lang: o } = T(),
      { standingsCategory: l, setStandingsCategory: u, calculatedStandings: r } = v(),
      a = _[o].championship,
      n = R(t),
      b = ((k = r[t]) == null ? void 0 : k.drivers) || n.drivers,
      i = ((C = r[t]) == null ? void 0 : C.constructors) || n.constructors,
      h = n.status === 'ongoing',
      g =
        l === 'drivers'
          ? `https://www.formula1.com/en/results/${t}/drivers`
          : `https://www.formula1.com/en/results/${t}/team`,
      x = b[0],
      c = i[0],
      f = x ? j(x.teamId, !1) : '#18181b',
      d = c ? j(c.teamId, !1) : '#18181b';
    return e.jsxs('div', {
      className: 'space-y-6',
      children: [
        e.jsx(E, {
          maxTilt: 2,
          glareOpacity: 0.08,
          className: `p-4 sm:p-5 rounded-2xl border transition-all ${h ? 'bg-gradient-to-r from-emerald-50/60 via-white to-white border-emerald-200/80 shadow-xs border-l-4 border-l-emerald-500' : 'bg-white border-studio-200 text-studio-900 shadow-xs border-l-4 border-l-studio-300'}`,
          children: e.jsxs('div', {
            className: 'flex flex-col sm:flex-row sm:items-center justify-between gap-4',
            children: [
              e.jsxs('div', {
                className: 'space-y-2',
                children: [
                  e.jsxs('div', {
                    className: 'flex items-center gap-2 flex-wrap',
                    children: [
                      h
                        ? e.jsxs('span', {
                            className:
                              'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200',
                            children: [
                              e.jsxs('span', {
                                className: 'relative flex h-2 w-2',
                                children: [
                                  e.jsx('span', {
                                    className:
                                      'animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75',
                                  }),
                                  e.jsx('span', {
                                    className:
                                      'relative inline-flex rounded-full h-2 w-2 bg-emerald-600',
                                  }),
                                ],
                              }),
                              e.jsx('span', {
                                children: o === 'vi' ? 'Mùa giải đang diễn ra' : 'Ongoing Season',
                              }),
                            ],
                          })
                        : e.jsxs('span', {
                            className:
                              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-100 text-studio-700 text-xs font-bold uppercase tracking-wider border border-studio-200',
                            children: [
                              e.jsx(P, { className: 'w-3.5 h-3.5 text-emerald-600' }),
                              e.jsx('span', {
                                children:
                                  o === 'vi'
                                    ? 'Kết quả chung cuộc chính thức'
                                    : 'Official Final Standings',
                              }),
                            ],
                          }),
                      n.lastUpdated &&
                        e.jsxs('span', {
                          className:
                            'inline-flex items-center gap-1.5 text-xs font-medium text-studio-600 bg-studio-100 px-2.5 py-1 rounded-full border border-studio-200',
                          children: [
                            e.jsx(L, { className: 'w-3 h-3 text-studio-400' }),
                            e.jsx('span', { children: o === 'vi' ? 'Cập nhật:' : 'Updated:' }),
                            e.jsx('time', { dateTime: n.lastUpdated, children: n.lastUpdated }),
                          ],
                        }),
                    ],
                  }),
                  h && x && c
                    ? e.jsxs('div', {
                        className: 'flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-0.5',
                        children: [
                          e.jsx('span', {
                            className: 'text-xs font-bold uppercase tracking-wider text-studio-500',
                            children: o === 'vi' ? 'Dẫn đầu BXH:' : 'Championship Leaders:',
                          }),
                          e.jsxs('div', {
                            className: 'flex items-center gap-2.5 flex-wrap',
                            children: [
                              e.jsxs('span', {
                                className:
                                  'inline-flex items-center gap-1.5 font-bold text-sm sm:text-base text-studio-950',
                                children: [
                                  e.jsx('span', {
                                    className: 'w-2.5 h-2.5 rounded-full inline-block shrink-0',
                                    style: { backgroundColor: f },
                                  }),
                                  e.jsx('span', { style: { color: f }, children: x.driverName }),
                                  e.jsxs('span', {
                                    className:
                                      'inline-flex items-center gap-1 font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200',
                                    children: [
                                      x.points || 0,
                                      e.jsx('span', { children: o === 'vi' ? 'ĐIỂM' : 'PTS' }),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsx('span', {
                                className: 'text-studio-300 hidden sm:inline',
                                children: '·',
                              }),
                              e.jsxs('span', {
                                className:
                                  'inline-flex items-center gap-1.5 font-bold text-sm sm:text-base text-studio-950',
                                children: [
                                  e.jsx('span', {
                                    className: 'w-2.5 h-2.5 rounded-full inline-block shrink-0',
                                    style: { backgroundColor: d },
                                  }),
                                  e.jsx('span', {
                                    style: { color: d },
                                    children: w(c.teamName, t),
                                  }),
                                  e.jsxs('span', {
                                    className:
                                      'inline-flex items-center gap-1 font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200',
                                    children: [
                                      c.points || 0,
                                      e.jsx('span', { children: o === 'vi' ? 'ĐIỂM' : 'PTS' }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      })
                    : e.jsx('h3', {
                        className:
                          'font-display text-lg sm:text-xl font-bold uppercase tracking-tight text-studio-950',
                        children: n.leaderTitle || `${a.title} ${t}`,
                      }),
                ],
              }),
              e.jsxs('a', {
                href: g,
                target: '_blank',
                rel: 'noopener noreferrer',
                className:
                  'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all self-start sm:self-center shrink-0 bg-studio-100 hover:bg-studio-200 text-studio-800 border border-studio-200 hover:border-studio-300 shadow-2xs',
                children: [
                  e.jsx('span', { children: 'F1.com Official Source' }),
                  e.jsx(A, { className: 'w-3.5 h-3.5 text-studio-500' }),
                ],
              }),
            ],
          }),
        }),
        e.jsxs('div', {
          className:
            'flex items-center gap-2 p-1 rounded-xl bg-white border border-studio-200 max-w-md shadow-xs',
          children: [
            e.jsxs('button', {
              onClick: () => u('drivers'),
              className: `flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${l === 'drivers' ? 'bg-f1red text-white shadow-sm' : 'text-studio-600 hover:text-studio-950'}`,
              children: [
                e.jsx(M, { className: 'w-4 h-4' }),
                e.jsx('span', { children: a.driversTab }),
              ],
            }),
            e.jsxs('button', {
              onClick: () => u('constructors'),
              className: `flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${l === 'constructors' ? 'bg-f1red text-white shadow-sm' : 'text-studio-600 hover:text-studio-950'}`,
              children: [
                e.jsx($, { className: 'w-4 h-4' }),
                e.jsx('span', { children: a.constructorsTab }),
              ],
            }),
          ],
        }),
        l === 'drivers' &&
          e.jsx('div', {
            className:
              'bg-white rounded-xl sm:rounded-2xl border border-studio-200 shadow-subtle overflow-hidden',
            children: e.jsx('div', {
              className: 'overflow-x-auto custom-scrollbar',
              children: e.jsxs('table', {
                className: 'w-full text-left text-xs min-w-[600px]',
                children: [
                  e.jsx('thead', {
                    className:
                      'bg-studio-100/80 border-b border-studio-200 text-studio-600 uppercase font-bold tracking-wider',
                    children: e.jsxs('tr', {
                      children: [
                        e.jsx('th', {
                          className: 'py-3 sm:py-3.5 px-3 sm:px-4 w-12 sm:w-16 text-center',
                          children: a.pos,
                        }),
                        e.jsx('th', {
                          className: 'py-3 sm:py-3.5 px-3 sm:px-4',
                          children: a.driver,
                        }),
                        e.jsx('th', { className: 'py-3 sm:py-3.5 px-3 sm:px-4', children: a.team }),
                        e.jsx('th', {
                          className: 'py-3 sm:py-3.5 px-3 sm:px-4 text-center',
                          children: a.wins,
                        }),
                        e.jsx('th', {
                          className: 'py-3 sm:py-3.5 px-3 sm:px-4 text-center',
                          children: a.podiums,
                        }),
                        e.jsx('th', {
                          className:
                            'py-3 sm:py-3.5 px-4 sm:px-6 text-right font-black text-studio-950',
                          children: a.points,
                        }),
                      ],
                    }),
                  }),
                  e.jsx('tbody', {
                    className: 'divide-y divide-studio-100',
                    children: b.map((s) => {
                      const m = j(s.teamId, !1);
                      return e.jsxs(
                        'tr',
                        {
                          className: 'hover:bg-studio-50 transition-colors',
                          children: [
                            e.jsx('td', {
                              className:
                                'py-3 sm:py-3.5 px-3 sm:px-4 text-center font-display font-black text-xs sm:text-sm',
                              children: e.jsx('span', {
                                className: `inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full ${s.rank === 1 ? 'bg-amber-400 text-black shadow-xs' : s.rank === 2 ? 'bg-studio-300 text-studio-900' : s.rank === 3 ? 'bg-amber-700 text-white' : 'text-studio-700'}`,
                                children: s.rank,
                              }),
                            }),
                            e.jsx('td', {
                              className: 'py-3 sm:py-3.5 px-3 sm:px-4',
                              children: e.jsxs('div', {
                                className: 'flex items-center gap-2 sm:gap-2.5',
                                children: [
                                  e.jsx('span', {
                                    className: 'text-sm sm:text-base shrink-0',
                                    title: s.countryFlag,
                                    children: s.countryFlag,
                                  }),
                                  e.jsxs('div', {
                                    children: [
                                      I[s.driverId]
                                        ? e.jsx(N, {
                                            to: `/drivers/${s.driverId}?season=${t}`,
                                            className:
                                              'font-extrabold block text-xs sm:text-sm hover:underline leading-tight',
                                            style: { color: m },
                                            children: s.driverName,
                                          })
                                        : e.jsx('span', {
                                            className:
                                              'font-extrabold block text-xs sm:text-sm leading-tight',
                                            style: { color: m },
                                            children: s.driverName,
                                          }),
                                      e.jsx('span', {
                                        className:
                                          'text-[9px] sm:text-[10px] text-studio-400 font-mono',
                                        children: s.driverCode,
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            }),
                            e.jsx('td', {
                              className: 'py-3 sm:py-3.5 px-3 sm:px-4',
                              children: e.jsxs('div', {
                                className: 'flex items-center gap-2',
                                children: [
                                  e.jsx('span', {
                                    className: 'w-2.5 h-2.5 rounded-full shrink-0',
                                    style: { backgroundColor: m },
                                  }),
                                  e.jsx(N, {
                                    to: `/teams/${s.teamId}`,
                                    className:
                                      'font-bold hover:underline truncate max-w-[140px] sm:max-w-none block text-xs',
                                    style: { color: m },
                                    children: w(s.teamName, t),
                                  }),
                                ],
                              }),
                            }),
                            e.jsx('td', {
                              className:
                                'py-3 sm:py-3.5 px-3 sm:px-4 text-center font-semibold text-studio-700',
                              children: s.wins,
                            }),
                            e.jsx('td', {
                              className:
                                'py-3 sm:py-3.5 px-3 sm:px-4 text-center font-semibold text-studio-700',
                              children: s.podiums,
                            }),
                            e.jsx('td', {
                              className:
                                'py-3 sm:py-3.5 px-4 sm:px-6 text-right font-display font-black text-sm sm:text-base text-f1red',
                              children: s.points,
                            }),
                          ],
                        },
                        `${s.driverId}-${s.teamId}`,
                      );
                    }),
                  }),
                ],
              }),
            }),
          }),
        l === 'constructors' &&
          e.jsx('div', {
            className:
              'bg-white rounded-xl sm:rounded-2xl border border-studio-200 shadow-subtle overflow-hidden',
            children: e.jsx('div', {
              className: 'overflow-x-auto custom-scrollbar',
              children: e.jsxs('table', {
                className: 'w-full text-left text-xs min-w-[600px]',
                children: [
                  e.jsx('thead', {
                    className:
                      'bg-studio-100/80 border-b border-studio-200 text-studio-600 uppercase font-bold tracking-wider',
                    children: e.jsxs('tr', {
                      children: [
                        e.jsx('th', {
                          className: 'py-3 sm:py-3.5 px-3 sm:px-4 w-12 sm:w-16 text-center',
                          children: a.pos,
                        }),
                        e.jsx('th', { className: 'py-3 sm:py-3.5 px-3 sm:px-4', children: a.team }),
                        e.jsx('th', {
                          className: 'py-3 sm:py-3.5 px-3 sm:px-4',
                          children: a.engine,
                        }),
                        e.jsx('th', {
                          className: 'py-3 sm:py-3.5 px-3 sm:px-4 text-center',
                          children: a.wins,
                        }),
                        e.jsx('th', {
                          className: 'py-3 sm:py-3.5 px-3 sm:px-4 text-center',
                          children: a.podiums,
                        }),
                        e.jsx('th', {
                          className:
                            'py-3 sm:py-3.5 px-4 sm:px-6 text-right font-black text-studio-950',
                          children: a.points,
                        }),
                      ],
                    }),
                  }),
                  e.jsx('tbody', {
                    className: 'divide-y divide-studio-100',
                    children: i.map((s) => {
                      const m = j(s.teamId, !1);
                      return e.jsxs(
                        'tr',
                        {
                          className: 'hover:bg-studio-50 transition-colors',
                          children: [
                            e.jsx('td', {
                              className:
                                'py-3 sm:py-3.5 px-3 sm:px-4 text-center font-display font-black text-xs sm:text-sm',
                              children: e.jsx('span', {
                                className: `inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full ${s.rank === 1 ? 'bg-amber-400 text-black shadow-xs' : s.rank === 2 ? 'bg-studio-300 text-studio-900' : s.rank === 3 ? 'bg-amber-700 text-white' : 'text-studio-700'}`,
                                children: s.rank,
                              }),
                            }),
                            e.jsx('td', {
                              className: 'py-3 sm:py-3.5 px-3 sm:px-4',
                              children: e.jsxs('div', {
                                className: 'flex items-center gap-2.5',
                                children: [
                                  e.jsx('span', {
                                    className: 'w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0',
                                    style: { backgroundColor: m },
                                  }),
                                  e.jsx(N, {
                                    to: `/teams/${s.teamId}`,
                                    className: 'font-extrabold text-xs sm:text-sm hover:underline',
                                    style: { color: m },
                                    children: w(s.teamName, t),
                                  }),
                                ],
                              }),
                            }),
                            e.jsx('td', {
                              className:
                                'py-3 sm:py-3.5 px-3 sm:px-4 font-medium text-studio-600 text-xs',
                              children: s.engine,
                            }),
                            e.jsx('td', {
                              className:
                                'py-3 sm:py-3.5 px-3 sm:px-4 text-center font-semibold text-studio-700',
                              children: s.wins,
                            }),
                            e.jsx('td', {
                              className:
                                'py-3 sm:py-3.5 px-3 sm:px-4 text-center font-semibold text-studio-700',
                              children: s.podiums,
                            }),
                            e.jsx('td', {
                              className:
                                'py-3 sm:py-3.5 px-4 sm:px-6 text-right font-display font-black text-sm sm:text-base text-f1red',
                              children: s.points,
                            }),
                          ],
                        },
                        `${s.teamId}-${s.rank}`,
                      );
                    }),
                  }),
                ],
              }),
            }),
          }),
      ],
    });
  }),
  H = p.lazy(() =>
    y(
      () => import('./RaceCalendar-BwCfbrDn.js'),
      __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]),
    ).then((t) => ({ default: t.RaceCalendar })),
  ),
  q = p.lazy(() =>
    y(
      () => import('./RaceResults-BMa_dhZ-.js'),
      __vite__mapDeps([10, 1, 2, 3, 4, 5, 6, 7, 11, 12, 8]),
    ).then((t) => ({ default: t.RaceResults })),
  ),
  B = p.lazy(() =>
    y(
      () => import('./TeamsDirectoryPage-BJtg6oU1.js'),
      __vite__mapDeps([13, 2, 3, 1, 4, 5, 6, 14, 15, 16, 11]),
    ).then((t) => ({ default: t.TeamsDirectoryPage })),
  ),
  K = p.lazy(() =>
    y(
      () => import('./DriversDirectoryPage-d3qpsSpl.js'),
      __vite__mapDeps([17, 2, 3, 1, 4, 5, 6, 18, 15, 16, 11, 12]),
    ).then((t) => ({ default: t.DriversDirectoryPage })),
  ),
  te = ({ season: t, onSeasonChange: o }) => {
    const { lang: l } = T(),
      {
        setSelectedSeason: u,
        activeSubTab: r,
        setActiveSubTab: a,
        syncMeta: n,
        syncSeasonData: b,
      } = v(),
      i = _[l].championship,
      [h, g] = p.useState(null),
      x = [2026, 2025, 2024];
    p.useEffect(() => {
      u(t);
    }, [t, u]);
    const c = (d) => {
        (g(d), setTimeout(() => g(null), 3500));
      },
      f = async () => {
        (await b(t),
          c(
            v.getState().syncMeta.message || (l === 'vi' ? 'Đồng bộ hoàn tất.' : 'Sync complete.'),
          ));
      };
    return e.jsxs('div', {
      className: 'bg-studio-100 min-h-screen py-12 animate-fade-in relative',
      children: [
        e.jsxs('div', {
          className: 'page-container space-y-8',
          children: [
            e.jsxs('div', {
              className: 'max-w-3xl space-y-3',
              children: [
                e.jsx('span', {
                  className: 'text-xs font-bold uppercase tracking-widest text-f1red block',
                  children: i.badge,
                }),
                e.jsx('h1', {
                  className:
                    'font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-studio-950',
                  children: i.title,
                }),
                e.jsx('p', {
                  className: 'text-sm sm:text-base text-studio-600 font-light leading-relaxed',
                  children: i.desc,
                }),
              ],
            }),
            e.jsxs('div', {
              className:
                'flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-studio-200 shadow-xs overflow-hidden',
              children: [
                e.jsxs('div', {
                  className:
                    'flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 custom-scrollbar max-w-full -mx-1 px-1 sm:mx-0 sm:px-0',
                  children: [
                    e.jsxs('button', {
                      onClick: () => a('standings'),
                      className: `flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${r === 'standings' ? 'bg-f1red text-white shadow-sm' : 'bg-studio-100 text-studio-700 hover:bg-studio-200'}`,
                      children: [
                        e.jsx($, { className: 'w-3.5 h-3.5' }),
                        e.jsx('span', { children: i.tabStandings }),
                      ],
                    }),
                    e.jsxs('button', {
                      onClick: () => a('calendar'),
                      className: `flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${r === 'calendar' ? 'bg-f1red text-white shadow-sm' : 'bg-studio-100 text-studio-700 hover:bg-studio-200'}`,
                      children: [
                        e.jsx(U, { className: 'w-3.5 h-3.5' }),
                        e.jsx('span', { children: i.tabCalendar }),
                      ],
                    }),
                    e.jsxs('button', {
                      onClick: () => a('results'),
                      className: `flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${r === 'results' ? 'bg-f1red text-white shadow-sm' : 'bg-studio-100 text-studio-700 hover:bg-studio-200'}`,
                      children: [
                        e.jsx(S, { className: 'w-3.5 h-3.5' }),
                        e.jsx('span', { children: i.tabResults }),
                      ],
                    }),
                    e.jsxs('button', {
                      onClick: () => a('teams'),
                      className: `flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${r === 'teams' ? 'bg-f1red text-white shadow-sm' : 'bg-studio-100 text-studio-700 hover:bg-studio-200'}`,
                      children: [
                        e.jsx(O, { className: 'w-3.5 h-3.5' }),
                        e.jsx('span', { children: i.tabTeams }),
                      ],
                    }),
                    e.jsxs('button', {
                      onClick: () => a('drivers'),
                      className: `flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${r === 'drivers' ? 'bg-f1red text-white shadow-sm' : 'bg-studio-100 text-studio-700 hover:bg-studio-200'}`,
                      children: [
                        e.jsx(V, { className: 'w-3.5 h-3.5' }),
                        e.jsx('span', { children: i.tabDrivers }),
                      ],
                    }),
                  ],
                }),
                e.jsxs('div', {
                  className:
                    'flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-studio-100',
                  children: [
                    e.jsx('button', {
                      onClick: f,
                      disabled: n.syncStatus === 'syncing',
                      className:
                        'p-2 rounded-lg bg-studio-100 hover:bg-studio-200 text-studio-600 hover:text-studio-900 border border-studio-200 transition-all disabled:opacity-50 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center',
                      title: l === 'vi' ? 'Làm mới dữ liệu kết quả' : 'Refresh season data',
                      children: e.jsx(z, {
                        className: `w-3.5 h-3.5 ${n.syncStatus === 'syncing' ? 'animate-spin text-f1red' : ''}`,
                      }),
                    }),
                    e.jsx('div', {
                      className:
                        'flex items-center gap-1 bg-studio-100 p-1 rounded-lg border border-studio-200',
                      children: x.map((d) =>
                        e.jsxs(
                          'button',
                          {
                            onClick: () => o(d),
                            className: `px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${t === d ? 'bg-white text-f1red shadow-xs font-black' : 'text-studio-600 hover:text-studio-950'}`,
                            children: [
                              e.jsx('span', { children: d }),
                              d === 2026 &&
                                e.jsx('span', {
                                  className:
                                    'w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse',
                                }),
                            ],
                          },
                          d,
                        ),
                      ),
                    }),
                  ],
                }),
              ],
            }),
            e.jsx(p.Suspense, {
              fallback: e.jsxs('div', {
                className:
                  'min-h-[32rem] animate-pulse rounded-2xl border border-studio-200 bg-white p-5',
                'aria-label': l === 'vi' ? 'Đang tải nội dung' : 'Loading content',
                children: [
                  e.jsx('div', { className: 'h-20 rounded-xl bg-studio-100' }),
                  e.jsx('div', { className: 'mt-5 h-10 rounded-xl bg-studio-100' }),
                  e.jsx('div', { className: 'mt-3 h-64 rounded-xl bg-studio-100' }),
                ],
              }),
              children: e.jsxs(
                'div',
                {
                  className: 'animate-f1-depth-enter',
                  children: [
                    r === 'standings' && e.jsx(F, { season: t }),
                    r === 'calendar' && e.jsx(H, { season: t }),
                    r === 'results' && e.jsx(q, { season: t }),
                    r === 'teams' && e.jsx(B, { initialSeason: t, hideHeader: !0 }),
                    r === 'drivers' && e.jsx(K, { initialSeason: t, hideHeader: !0 }),
                  ],
                },
                r,
              ),
            }),
          ],
        }),
        h &&
          e.jsx('div', {
            className: 'fixed bottom-6 right-6 z-50 animate-bounce',
            children: e.jsxs('div', {
              className:
                'bg-studio-950 text-white px-5 py-3 rounded-xl shadow-2xl border border-studio-700 flex items-center gap-3 text-xs font-bold',
              children: [
                e.jsx(S, { className: 'w-4 h-4 text-emerald-400' }),
                e.jsx('span', { children: h }),
              ],
            }),
          }),
      ],
    });
  };
export { te as ChampionshipView };
