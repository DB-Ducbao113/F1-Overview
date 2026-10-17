import { R as y, r as n, j as e, L as b } from './vendor-react-B62-MmwA.js';
import { u as w, S as g } from './index-C6VPy6l3.js';
import './circuitsData-CkwD4Tuo.js';
import { D as k, g as T } from './drivers-CmneIBY8.js';
import { C as I } from './ConstructorLogo-BPzo8jEn.js';
import { V as C } from './ViewportImage-C-v4fzqx.js';
import { g as S } from './teamColors-B_bsvcV9.js';
import { g as p } from './teamNames-Bb9SyeFa.js';
import { a1 as D, A as j, T as A } from './vendor-icons-Brb4Fsqu.js';
import './vendor-core-ckwbz45p.js';
const E = [2026, 2025, 2024],
  q = y.memo(({ initialSeason: c = 2026, hideHeader: o = !1 }) => {
    const s = w((t) => t.lang),
      [a, h] = n.useState(c),
      [i, x] = n.useState('all'),
      [m, v] = n.useState('');
    n.useEffect(() => {
      (h(c), x('all'));
    }, [c]);
    const d = n.useMemo(() => {
      const t = m.trim().toLowerCase();
      return g[a].drivers.filter((r) =>
        i !== 'all' && r.teamId !== i
          ? !1
          : !t || [r.driverName, r.driverCode, r.teamName].some((l) => l.toLowerCase().includes(t)),
      );
    }, [m, a, i]);
    return e.jsx('div', {
      className: o ? 'space-y-6' : 'min-h-[70vh] bg-studio-100 py-10 sm:py-16',
      children: e.jsxs('div', {
        className: o ? 'space-y-6' : 'page-container space-y-8',
        children: [
          !o &&
            e.jsxs('header', {
              className: 'max-w-3xl space-y-3',
              children: [
                e.jsx('span', {
                  className: 'text-xs font-bold uppercase tracking-widest text-f1red',
                  children: 'F1 Driver Directory',
                }),
                e.jsx('h1', {
                  className:
                    'font-display text-4xl font-black uppercase tracking-tight text-studio-950 sm:text-5xl',
                  children: s === 'vi' ? 'Các tay đua' : 'The drivers',
                }),
                e.jsx('p', {
                  className: 'text-sm leading-relaxed text-studio-600',
                  children:
                    s === 'vi'
                      ? 'Duyệt bảng xếp hạng tay đua theo mùa giải hoặc lọc theo đội.'
                      : 'Browse the driver standings by season or filter the grid by constructor.',
                }),
              ],
            }),
          e.jsxs('div', {
            className:
              'grid gap-3 rounded-2xl border border-studio-200 bg-white p-4 shadow-subtle sm:grid-cols-[1fr_auto_auto]',
            children: [
              e.jsxs('label', {
                className: 'relative',
                children: [
                  e.jsx(D, {
                    className: 'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-studio-400',
                  }),
                  e.jsx('input', {
                    value: m,
                    onChange: (t) => v(t.target.value),
                    placeholder: s === 'vi' ? 'Tìm tay đua hoặc đội…' : 'Search driver or team…',
                    className:
                      'w-full rounded-xl border border-studio-200 bg-studio-50 py-3 pl-10 pr-3 text-sm outline-none focus:border-f1red',
                  }),
                ],
              }),
              !o &&
                e.jsxs('label', {
                  className:
                    'flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-studio-500',
                  children: [
                    s === 'vi' ? 'Mùa giải' : 'Season',
                    e.jsx('select', {
                      value: a,
                      onChange: (t) => {
                        (h(Number(t.target.value)), x('all'));
                      },
                      className:
                        'rounded-xl border border-studio-200 bg-studio-50 px-3 py-3 text-sm font-bold text-studio-900 outline-none focus:border-f1red',
                      children: E.map((t) => e.jsx('option', { value: t, children: t }, t)),
                    }),
                  ],
                }),
              e.jsxs('label', {
                className:
                  'flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-studio-500',
                children: [
                  s === 'vi' ? 'Đội' : 'Team',
                  e.jsxs('select', {
                    value: i,
                    onChange: (t) => x(t.target.value),
                    className:
                      'max-w-48 rounded-xl border border-studio-200 bg-studio-50 px-3 py-3 text-sm font-bold text-studio-900 outline-none focus:border-f1red',
                    children: [
                      e.jsx('option', {
                        value: 'all',
                        children: s === 'vi' ? 'Tất cả đội' : 'All teams',
                      }),
                      g[a].constructors.map((t) =>
                        e.jsx('option', { value: t.teamId, children: p(t.teamId, a) }, t.teamId),
                      ),
                    ],
                  }),
                ],
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'flex items-center justify-between text-xs text-studio-500',
            children: [
              e.jsx('span', {
                children: s === 'vi' ? `Tìm thấy ${d.length} tay đua` : `${d.length} drivers found`,
              }),
              e.jsxs(b, {
                to: o ? `/season/${a}?tab=teams` : '/teams',
                className: 'inline-flex items-center gap-1 font-bold text-f1red hover:underline',
                children: [
                  s === 'vi' ? 'Danh sách đội đua' : 'Team directory',
                  e.jsx(j, { className: 'h-3.5 w-3.5' }),
                ],
              }),
            ],
          }),
          d.length
            ? e.jsx('div', {
                className: 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3',
                children: d.map((t) => {
                  const r = k[t.driverId],
                    l = T(t.driverId, a),
                    f = r == null ? void 0 : r.imageUrl,
                    u = S(t.teamId, !1);
                  return e.jsxs(
                    b,
                    {
                      to: `/drivers/${t.driverId}?season=${a}`,
                      className:
                        'group relative overflow-hidden rounded-2xl border bg-white shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between',
                      style: { borderColor: `${u}40` },
                      children: [
                        e.jsxs('div', {
                          className: 'relative w-full aspect-video bg-studio-950 overflow-hidden',
                          children: [
                            f
                              ? e.jsx(C, {
                                  src: f,
                                  alt: t.driverName,
                                  onError: (N) => {
                                    N.currentTarget.style.display = 'none';
                                  },
                                  className:
                                    'w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700',
                                })
                              : e.jsxs('div', {
                                  className:
                                    'w-full h-full flex items-center justify-center font-display font-black text-white/20 text-4xl',
                                  children: ['#', l ?? '—'],
                                }),
                            e.jsx('div', {
                              className:
                                'absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none',
                            }),
                            e.jsxs('span', {
                              className:
                                'absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/65 backdrop-blur-md px-2.5 py-1 text-xs font-black text-white shadow-xs border border-white/20',
                              children: [
                                e.jsx(A, { className: 'h-3.5 w-3.5 text-amber-400' }),
                                e.jsxs('span', { children: ['P', t.rank] }),
                              ],
                            }),
                            e.jsx('div', {
                              className: 'absolute bottom-0 inset-x-0 h-1',
                              style: { backgroundColor: u },
                            }),
                          ],
                        }),
                        e.jsxs('div', {
                          className: 'relative p-5 sm:p-6 flex-1 flex flex-col justify-between',
                          children: [
                            e.jsx('div', {
                              className:
                                'absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-10 blur-2xl pointer-events-none group-hover:opacity-25 transition-opacity',
                              style: { backgroundColor: u },
                            }),
                            e.jsxs('div', {
                              className: 'relative z-10',
                              children: [
                                e.jsxs('div', {
                                  className:
                                    'flex items-center justify-between text-xs font-black uppercase tracking-widest text-studio-400',
                                  children: [
                                    e.jsxs('span', {
                                      className: 'flex items-center gap-1.5',
                                      children: [
                                        e.jsx('span', {
                                          className: 'text-base',
                                          children: t.countryFlag,
                                        }),
                                        e.jsx('span', { children: t.driverCode }),
                                        l &&
                                          e.jsxs('span', {
                                            className: 'text-studio-400 font-mono',
                                            children: ['#', l],
                                          }),
                                      ],
                                    }),
                                    e.jsx('span', {
                                      className:
                                        'text-[11px] font-mono font-bold text-studio-400 uppercase',
                                      children: p(t.teamId, a),
                                    }),
                                  ],
                                }),
                                e.jsx('h2', {
                                  className:
                                    'mt-2 font-display text-xl sm:text-2xl font-black text-studio-950 group-hover:text-f1red transition-colors',
                                  children: t.driverName,
                                }),
                                e.jsxs('div', {
                                  className:
                                    'mt-1.5 flex items-center gap-2 text-xs font-semibold text-studio-600',
                                  children: [
                                    e.jsx(I, { teamId: t.teamId, size: 'sm' }),
                                    e.jsxs('span', { children: [p(t.teamName, a), ' · ', a] }),
                                  ],
                                }),
                              ],
                            }),
                            e.jsxs('div', {
                              className:
                                'relative z-10 mt-6 flex items-end justify-between border-t border-studio-100 pt-4',
                              children: [
                                e.jsxs('div', {
                                  className: 'flex gap-4 text-xs text-studio-500',
                                  children: [
                                    e.jsxs('span', {
                                      children: [
                                        e.jsx('strong', {
                                          className: 'block text-lg font-black text-studio-900',
                                          children: t.wins,
                                        }),
                                        s === 'vi' ? 'Thắng' : 'Wins',
                                      ],
                                    }),
                                    e.jsxs('span', {
                                      children: [
                                        e.jsx('strong', {
                                          className: 'block text-lg font-black text-studio-900',
                                          children: t.podiums,
                                        }),
                                        s === 'vi' ? 'Lần lên bục' : 'Podiums',
                                      ],
                                    }),
                                  ],
                                }),
                                e.jsxs('span', {
                                  className: 'text-right',
                                  children: [
                                    e.jsx('strong', {
                                      className: 'block text-xl font-black text-f1red',
                                      children: t.points,
                                    }),
                                    e.jsxs('span', {
                                      className: 'text-[10px] font-bold uppercase text-studio-400',
                                      children: [
                                        'PTS',
                                        ' ',
                                        e.jsx(j, {
                                          className:
                                            'inline h-3 w-3 group-hover:translate-x-0.5 transition-transform',
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    },
                    t.driverId,
                  );
                }),
              })
            : e.jsx('div', {
                className:
                  'rounded-2xl border border-dashed border-studio-300 bg-white p-12 text-center text-sm text-studio-500',
                children:
                  s === 'vi' ? 'Không tìm thấy tay đua phù hợp.' : 'No matching drivers found.',
              }),
        ],
      }),
    });
  });
export { q as DriversDirectoryPage };
