const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      'assets/PracticeClassificationModal-5zoMZEVS.js',
      'assets/vendor-react-B62-MmwA.js',
      'assets/index-CS6oMniN.js',
      'assets/vendor-core-ckwbz45p.js',
      'assets/vendor-icons-Brb4Fsqu.js',
      'assets/index-B7qEOR9J.css',
      'assets/dateUtils-C4Mh2J_m.js',
      'assets/teamColors-B_bsvcV9.js',
      'assets/teamNames-KiqqJwCB.js',
      'assets/QualifyingClassificationModal-B_PDJBEg.js',
    ]),
) => i.map((i) => d[i]);
import { _ as re } from './vendor-core-ckwbz45p.js';
import { R as Re, r as c, j as s } from './vendor-react-B62-MmwA.js';
import { u as Te, a as Pe, o as Ee, g as _e } from './index-CS6oMniN.js';
import { P as se, Q as te } from './circuitsData-dFLaj098.js';
import { f as ne, a as Qe, t as Ve, b as Le } from './dateUtils-C4Mh2J_m.js';
import { C as Be } from './Card3DTilt-DK6ssBNb.js';
import { a as R, g as Ie } from './raceSchedule-C_1d8gwS.js';
import {
  y as ie,
  q as U,
  a7 as ae,
  v as Ue,
  i as Ke,
  e as Ae,
  k as qe,
  l as De,
  T as Xe,
} from './vendor-icons-Brb4Fsqu.js';
const Oe = c.lazy(() =>
    re(
      () => import('./PracticeClassificationModal-5zoMZEVS.js'),
      __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8]),
    ).then((j) => ({ default: j.PracticeClassificationModal })),
  ),
  Fe = c.lazy(() =>
    re(
      () => import('./QualifyingClassificationModal-B_PDJBEg.js'),
      __vite__mapDeps([9, 1, 2, 3, 4, 5, 7, 8, 6]),
    ).then((j) => ({ default: j.QualifyingClassificationModal })),
  ),
  T = Ee,
  ts = Re.memo(({ season: j }) => {
    const { lang: N } = Te(),
      n = N === 'vi',
      {
        detailedResults: oe,
        setActiveSubTab: le,
        selectedSeason: ce,
        setSelectedSeason: de,
        setSelectedRaceRound: K,
      } = Pe(),
      f = j ?? ce ?? 2026,
      b = _e(f),
      g = f === 2026,
      [v, ue] = c.useState(() => Date.now());
    c.useEffect(() => {
      const e = () => ue(Date.now()),
        i = window.setInterval(e, 3e4);
      return (
        document.addEventListener('visibilitychange', e),
        () => {
          (window.clearInterval(i), document.removeEventListener('visibilitychange', e));
        }
      );
    }, []);
    const xe = oe[f] || [],
      y = new Set([
        ...b.filter((e) => R(e, v) === 'completed').map((e) => e.round),
        ...xe.filter((e) => e.status === 'completed').map((e) => e.round),
      ]),
      A = b.filter((e) => !y.has(e.round)),
      a = A.find((e) => R(e, v) === 'current') || A.find((e) => R(e, v) === 'upcoming'),
      q = b.filter((e) => e.hasSprint).length,
      [D, X] = c.useState(1),
      [P, O] = c.useState(null),
      [me, pe] = c.useState('fp1'),
      [E, _] = c.useState(null),
      [he, F] = c.useState('qualifying'),
      fe = (e) => {
        const i = D !== e;
        (X(i ? e : null),
          i &&
            requestAnimationFrame(() => {
              setTimeout(() => {
                const r = document.getElementById(`calendar-round-${e}`);
                r && r.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 50);
            }));
      },
      H = (() => {
        if (!g || !P) return null;
        const e = se[P],
          i = T.practice[P];
        return i
          ? {
              ...(e || i),
              sessions: { ...((e == null ? void 0 : e.sessions) || {}), ...i.sessions },
            }
          : e || null;
      })(),
      M = (() => {
        if (!g || !E) return null;
        const e = te[E],
          i = T.qualifying[E];
        return i
          ? {
              ...(e || i),
              sessions: { ...((e == null ? void 0 : e.sessions) || {}), ...i.sessions },
            }
          : e || null;
      })(),
      z = (e, i = f) => {
        (de(i), K(e || null), le('results'));
      },
      be = () => {
        a &&
          (X(a.round),
          requestAnimationFrame(() => {
            setTimeout(() => {
              const e = document.getElementById(`calendar-round-${a.round}`);
              e && e.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
          }));
      };
    return s.jsxs('div', {
      className: 'space-y-4',
      children: [
        s.jsxs(Be, {
          maxTilt: 2,
          glareOpacity: 0.08,
          className:
            'flex items-center justify-between p-4 bg-white rounded-xl border border-studio-200 gap-3',
          children: [
            s.jsxs('div', {
              children: [
                s.jsx('h3', {
                  className:
                    'font-display text-base font-bold uppercase tracking-wider text-studio-900',
                  children: n
                    ? `Lịch Thi Đấu Giải Vô Địch Formula 1 ${f}`
                    : `${f} FIA Formula 1 World Championship Calendar`,
                }),
                s.jsx('p', {
                  className: 'text-xs text-studio-500 font-medium',
                  children: n
                    ? `${y.size} / ${b.length} chặng đã đua · ${q} Cuối Tuần Đua Sprint`
                    : `${y.size} / ${b.length} rounds completed · ${q} Sprint Weekends`,
                }),
              ],
            }),
            a
              ? s.jsxs('button', {
                  onClick: be,
                  className:
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-f1red/10 hover:bg-f1red text-f1red hover:text-white border border-f1red/20 hover:border-f1red text-xs font-bold transition-all shadow-2xs group cursor-pointer shrink-0',
                  title: n
                    ? `Chuyển tới chặng kế tiếp: Vòng ${a.round} (${a.name})`
                    : `Jump to next race: Round ${a.round} (${a.name})`,
                  children: [
                    s.jsx(ie, {
                      className:
                        'w-3.5 h-3.5 fill-current animate-pulse text-amber-500 group-hover:text-amber-300',
                    }),
                    s.jsx('span', {
                      children: n ? `Chặng kế tiếp: Vòng ${a.round}` : `Next: Round ${a.round}`,
                    }),
                    s.jsx(U, {
                      className: 'w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform',
                    }),
                  ],
                })
              : s.jsx('span', {
                  className: 'text-xs font-bold text-studio-500',
                  children: n ? 'Mùa giải hoàn tất' : 'Season complete',
                }),
          ],
        }),
        s.jsx('div', {
          className: 'grid grid-cols-1 gap-3',
          children: b.map((e) => {
            const i = D === e.round,
              r = y.has(e.round),
              C = R(e, v) === 'current' && !r,
              k = e.round === (a == null ? void 0 : a.round),
              w = g ? se[e.round] : void 0,
              Q = g ? T.practice[e.round] : void 0,
              o = Q
                ? {
                    ...(w || Q),
                    sessions: { ...((w == null ? void 0 : w.sessions) || {}), ...Q.sessions },
                  }
                : w,
              V = !!o,
              L = ['fp1', 'fp2', 'fp3'].filter((t) => {
                const d = (o == null ? void 0 : o.sessions[t]) ?? e.sessions[t];
                return (d == null ? void 0 : d.status) === 'finished';
              }),
              ge = L.length > 0,
              G = L.length > 0 ? L.map((t) => t.toUpperCase()).join(', ') : '';
            return s.jsxs(
              'div',
              {
                id: `calendar-round-${e.round}`,
                className: `rounded-xl border transition-all scroll-mt-24 hover-depth-3d ${C || (k && V) ? 'bg-white border-f1red shadow-md ring-1 ring-f1red/20' : k ? 'bg-white border-f1red/50 shadow-xs ring-1 ring-f1red/10' : 'bg-white border-studio-200 hover:border-studio-300 shadow-xs'}`,
                children: [
                  s.jsxs('div', {
                    onClick: () => fe(e.round),
                    className: 'p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer',
                    children: [
                      s.jsxs('div', {
                        className: 'flex items-center gap-4',
                        children: [
                          s.jsxs('div', {
                            className: `w-10 h-10 rounded-lg flex flex-col items-center justify-center shrink-0 font-bold ${C || (k && V) ? 'bg-f1red text-white' : r ? 'bg-studio-100 text-studio-600' : 'bg-studio-900 text-white'}`,
                            children: [
                              s.jsxs('span', {
                                className: 'text-[9px] uppercase tracking-wider',
                                children: [n ? 'VÒNG' : 'RND', ' '],
                              }),
                              s.jsx('span', {
                                className: 'text-sm font-black leading-none',
                                children: e.round,
                              }),
                            ],
                          }),
                          s.jsxs('div', {
                            children: [
                              s.jsxs('div', {
                                className: 'flex items-center gap-2 mb-1 flex-wrap',
                                children: [
                                  s.jsx('span', {
                                    className: 'text-base',
                                    title: e.country,
                                    children: e.flag,
                                  }),
                                  s.jsx('span', {
                                    className:
                                      'text-xs font-semibold uppercase tracking-wider text-studio-500',
                                    children: e.country,
                                  }),
                                  e.hasSprint &&
                                    s.jsx('span', {
                                      className:
                                        'px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800',
                                      children: 'Sprint',
                                    }),
                                  !r &&
                                    ge &&
                                    s.jsxs('span', {
                                      className:
                                        'px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 flex items-center gap-1 border border-sky-300',
                                      children: [
                                        s.jsx(ae, {
                                          className: 'w-3 h-3 text-sky-600 animate-pulse',
                                        }),
                                        n ? `Đã Chạy ${G}` : `${G} Completed`,
                                      ],
                                    }),
                                  C &&
                                    s.jsx('span', {
                                      className:
                                        'px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-f1red/10 text-f1red animate-pulse',
                                      children: n ? 'Đang Diễn Ra' : 'Active Weekend',
                                    }),
                                  !C &&
                                    k &&
                                    !V &&
                                    s.jsx('span', {
                                      className:
                                        'px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800',
                                      children: n ? 'Chặng Tiếp Theo' : 'Up Next',
                                    }),
                                  r &&
                                    s.jsx('span', {
                                      className:
                                        'px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-studio-100 text-studio-500',
                                      children: n ? 'Đã Hoàn Tất' : 'Completed',
                                    }),
                                ],
                              }),
                              s.jsx('h4', {
                                className:
                                  'font-display text-base sm:text-lg font-bold text-studio-950',
                                children: e.name,
                              }),
                            ],
                          }),
                        ],
                      }),
                      s.jsxs('div', {
                        className: 'flex items-center gap-3 sm:gap-6',
                        children: [
                          s.jsxs('div', {
                            className: 'text-right hidden sm:block',
                            children: [
                              s.jsx('span', {
                                className: 'font-bold text-xs text-studio-900 block',
                                children: ne(e.dates, N),
                              }),
                              s.jsx('span', {
                                className:
                                  'text-[11px] text-studio-500 truncate max-w-[200px] block',
                                children: e.circuit,
                              }),
                            ],
                          }),
                          s.jsx('button', {
                            className:
                              'p-1 rounded-full text-studio-400 hover:text-studio-900 transition-colors',
                            'aria-label': 'Expand schedule',
                            children: i
                              ? s.jsx(Ue, { className: 'w-5 h-5' })
                              : s.jsx(Ke, { className: 'w-5 h-5' }),
                          }),
                        ],
                      }),
                    ],
                  }),
                  i &&
                    s.jsxs('div', {
                      className:
                        'px-5 pb-5 pt-2 border-t border-studio-100 bg-studio-50/50 rounded-b-xl space-y-4 animate-fade-in',
                      children: [
                        s.jsxs('div', {
                          className:
                            'flex flex-wrap items-center justify-between gap-4 text-xs text-studio-600 pt-1',
                          children: [
                            s.jsxs('span', {
                              className: 'flex items-center gap-1.5 font-medium',
                              children: [
                                s.jsx(Ae, { className: 'w-3.5 h-3.5 text-f1red' }),
                                ' ',
                                e.circuit,
                                ', ',
                                e.location,
                              ],
                            }),
                            s.jsx('span', {
                              className: 'font-medium',
                              children: n
                                ? `${e.laps} Vòng · ${e.circuitLengthKm} km · Đua chính: ${e.raceDistanceKm} km`
                                : `${e.laps} Laps · ${e.circuitLengthKm} km · Race: ${e.raceDistanceKm} km`,
                            }),
                          ],
                        }),
                        s.jsx('div', {
                          className: 'grid grid-cols-2 sm:grid-cols-5 gap-2.5',
                          children: (e.hasSprint
                            ? ['fp1', 'sprintQualifying', 'sprint', 'qualifying', 'race']
                            : ['fp1', 'fp2', 'fp3', 'qualifying', 'race']
                          ).map((t) => {
                            const d = g ? te[e.round] : void 0,
                              B = g ? T.qualifying[e.round] : void 0,
                              S = B
                                ? {
                                    ...(d || B),
                                    sessions: {
                                      ...((d == null ? void 0 : d.sessions) || {}),
                                      ...B.sessions,
                                    },
                                  }
                                : d,
                              W = t === 'fp1' || t === 'fp2' || t === 'fp3',
                              ve = t === 'qualifying' || t === 'sprintQualifying',
                              Se = t === 'sprint',
                              J = t === 'race';
                            let l = e.sessions[t];
                            if (!l && W && o != null && o.sessions[t]) {
                              const u = o.sessions[t];
                              l = {
                                name:
                                  t === 'fp1'
                                    ? 'Practice 1'
                                    : t === 'fp2'
                                      ? 'Practice 2'
                                      : 'Practice 3',
                                dateStr: u.dateStr,
                                timeStr: t === 'fp1' ? '12:30' : t === 'fp2' ? '16:00' : '12:30',
                                status: u.status,
                              };
                            }
                            if (!l) return null;
                            const Y = W ? (o == null ? void 0 : o.sessions[t]) : void 0,
                              Z = ve ? (S == null ? void 0 : S.sessions[t]) : void 0,
                              ee = Se ? (S == null ? void 0 : S.sessions.sprint) : void 0,
                              x = !!(Y && (Y.status === 'finished' || r)),
                              m = !!(Z && (Z.status === 'finished' || r)),
                              p = !!(ee && (ee.status === 'finished' || r)),
                              h = J && (r || l.status === 'finished'),
                              I = J ? Ie(e, 'race') : null,
                              je = !!I && v >= I.start.getTime() && v < I.end.getTime() && !h,
                              $ =
                                x || m || p || h || l.status === 'finished'
                                  ? 'finished'
                                  : je
                                    ? 'live'
                                    : l.status,
                              Ne =
                                $ === 'finished'
                                  ? n
                                    ? 'hoàn tất'
                                    : 'finished'
                                  : $ === 'live'
                                    ? n
                                      ? 'trực tiếp'
                                      : 'live'
                                    : n
                                      ? 'sắp tới'
                                      : 'upcoming',
                              we = () => {
                                x
                                  ? (O(e.round), pe(t))
                                  : m
                                    ? (_(e.round), F(t))
                                    : p
                                      ? (_(e.round), F('sprint'))
                                      : h && z(e.round, e.season);
                              },
                              ye = x || m || p || h,
                              Ce = x
                                ? 'bg-sky-50/80 border-sky-200 hover:border-sky-400 hover:bg-sky-100/60 cursor-pointer group'
                                : m
                                  ? 'bg-purple-50/80 border-purple-200 hover:border-purple-400 hover:bg-purple-100/60 cursor-pointer group'
                                  : p
                                    ? 'bg-amber-50/80 border-amber-200 hover:border-amber-400 hover:bg-amber-100/60 cursor-pointer group'
                                    : h
                                      ? 'bg-emerald-50/80 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100/60 cursor-pointer group'
                                      : 'bg-white border-studio-200',
                              ke =
                                $ === 'finished'
                                  ? x
                                    ? 'text-sky-700 font-extrabold'
                                    : m
                                      ? 'text-purple-700 font-extrabold'
                                      : p
                                        ? 'text-amber-700 font-extrabold'
                                        : h
                                          ? 'text-emerald-700 font-extrabold'
                                          : 'text-studio-400'
                                  : $ === 'live'
                                    ? 'text-f1red animate-pulse'
                                    : 'text-emerald-600';
                            return s.jsxs(
                              'div',
                              {
                                onClick: we,
                                className: `p-2.5 rounded-lg border shadow-xs space-y-1 transition-all ${Ce}`,
                                children: [
                                  s.jsxs('div', {
                                    className: 'flex items-center justify-between',
                                    children: [
                                      s.jsx('span', {
                                        className:
                                          'text-[10px] font-bold uppercase tracking-wider text-studio-500 block truncate',
                                        children: Qe(l.name, N),
                                      }),
                                      ye &&
                                        s.jsx(U, {
                                          className: `w-3 h-3 group-hover:translate-x-0.5 transition-transform ${x ? 'text-sky-600' : m ? 'text-purple-600' : p ? 'text-amber-600' : 'text-emerald-600'}`,
                                        }),
                                    ],
                                  }),
                                  s.jsx('span', {
                                    className: 'text-xs font-bold text-studio-900 block',
                                    children: ne(l.dateStr, N),
                                  }),
                                  s.jsxs('div', {
                                    className:
                                      'flex items-center justify-between text-[11px] text-studio-600',
                                    children: [
                                      s.jsxs('span', {
                                        className: 'flex items-center gap-1',
                                        children: [
                                          s.jsx(qe, { className: 'w-3 h-3 text-studio-400' }),
                                          e.venueUtcOffset !== void 0
                                            ? (() => {
                                                const u = Ve(l.timeStr, e.venueUtcOffset),
                                                  $e =
                                                    u.dayShift === 0
                                                      ? ''
                                                      : ` · ${Le(l.dateStr, e.season, u.dayShift, N)}`;
                                                return `${u.time} UTC+7${$e}`;
                                              })()
                                            : l.timeStr,
                                        ],
                                      }),
                                      s.jsx('span', {
                                        className: `text-[9px] font-bold uppercase ${ke}`,
                                        children: Ne,
                                      }),
                                    ],
                                  }),
                                  x &&
                                    s.jsxs('span', {
                                      className:
                                        'text-[9px] text-sky-700 font-bold block pt-1 border-t border-sky-200/60 flex items-center gap-1',
                                      children: [
                                        s.jsx(ae, { className: 'w-2.5 h-2.5 text-sky-600' }),
                                        n
                                          ? `Xem BXH ${t.toUpperCase()}`
                                          : `View ${t.toUpperCase()} Table`,
                                      ],
                                    }),
                                  m &&
                                    s.jsxs('span', {
                                      className:
                                        'text-[9px] text-purple-700 font-bold block pt-1 border-t border-purple-200/60 flex items-center gap-1',
                                      children: [
                                        s.jsx(De, { className: 'w-2.5 h-2.5 text-purple-600' }),
                                        t === 'sprintQualifying'
                                          ? n
                                            ? 'Xem BXH Sprint Quali'
                                            : 'View Sprint Quali'
                                          : n
                                            ? 'Xem BXH Phân Hạng'
                                            : 'View Qualifying Table',
                                      ],
                                    }),
                                  p &&
                                    s.jsxs('span', {
                                      className:
                                        'text-[9px] text-amber-700 font-bold block pt-1 border-t border-amber-200/60 flex items-center gap-1',
                                      children: [
                                        s.jsx(ie, { className: 'w-2.5 h-2.5 text-amber-600' }),
                                        n ? 'Xem BXH Sprint' : 'View Sprint Table',
                                      ],
                                    }),
                                  h &&
                                    s.jsxs('button', {
                                      type: 'button',
                                      onClick: (u) => {
                                        (u.stopPropagation(), z(e.round, e.season));
                                      },
                                      className:
                                        'text-[9px] text-emerald-700 font-bold block pt-1 border-t border-emerald-200/60 flex items-center justify-between gap-1 w-full hover:text-emerald-900 cursor-pointer',
                                      children: [
                                        s.jsxs('span', {
                                          className: 'flex items-center gap-1',
                                          children: [
                                            s.jsx(Xe, {
                                              className: 'w-2.5 h-2.5 text-emerald-600',
                                            }),
                                            n ? 'Xem kết quả chặng' : 'View Race Results',
                                          ],
                                        }),
                                        s.jsx(U, {
                                          className:
                                            'w-2.5 h-2.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform',
                                        }),
                                      ],
                                    }),
                                ],
                              },
                              t,
                            );
                          }),
                        }),
                      ],
                    }),
                ],
              },
              e.round,
            );
          }),
        }),
        H &&
          s.jsx(c.Suspense, {
            fallback: null,
            children: s.jsx(Oe, { practiceData: H, initialSessionKey: me, onClose: () => O(null) }),
          }),
        M &&
          s.jsx(c.Suspense, {
            fallback: null,
            children: s.jsx(Fe, {
              qualifyingData: M,
              initialSessionKey: he,
              onClose: () => _(null),
            }),
          }),
      ],
    });
  });
export { ts as RaceCalendar };
