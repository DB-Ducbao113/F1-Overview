import { h as E, k as I, i as R, j as e, L as m } from './vendor-react-B62-MmwA.js';
import { D as L, a as C, g as B } from './drivers-CmneIBY8.js';
import { g as G } from './teamSeasons-C1XHo0kd.js';
import { g as M } from './teamNames-Bb9SyeFa.js';
import { u as K, S as O } from './index-C6VPy6l3.js';
import './circuitsData-CkwD4Tuo.js';
import { C as D } from './ConstructorLogo-BPzo8jEn.js';
import { g as X } from './teamColors-B_bsvcV9.js';
import { O as z, A as P, B as A, T as h, l as k, V as F, Y as V } from './vendor-icons-Brb4Fsqu.js';
import './vendor-core-ckwbz45p.js';
const U = [2026, 2025, 2024],
  ae = () => {
    var T;
    const { driverId: n } = E(),
      p = I(),
      [j, u] = R(),
      s = K((r) => r.lang),
      i = n ? L[n] : void 0,
      o = C(n),
      g = n
        ? U.flatMap((r) =>
            O[r].drivers.filter(($) => $.driverId === n).map(($) => ({ ...$, season: r })),
          )
        : [],
      W = Number(j.get('season')),
      a = g.find((r) => r.season === W) ?? g[0];
    if (!i && !a)
      return e.jsxs('div', {
        className: 'page-container py-24 min-h-[60vh] text-center',
        children: [
          e.jsx('p', { className: 'text-f1red font-black text-5xl', children: '404' }),
          e.jsx('h1', {
            className: 'mt-4 text-xl font-bold',
            children: s === 'vi' ? 'Không tìm thấy tay đua' : 'Driver not found',
          }),
          e.jsx(m, {
            className: 'inline-block mt-6 text-f1red font-bold',
            to: '/drivers',
            children: s === 'vi' ? 'Về danh sách tay đua' : 'Back to driver directory',
          }),
        ],
      });
    const t = (a == null ? void 0 : a.season) ?? 2026,
      x = n ? B(n, t) : void 0,
      b = C(n, t),
      l = (a == null ? void 0 : a.teamId) ?? (i == null ? void 0 : i.teamId) ?? 'ferrari',
      w = M(l, t),
      d = X(l, !0),
      f = (i == null ? void 0 : i.name) ?? (a == null ? void 0 : a.driverName) ?? 'Driver',
      N = (i == null ? void 0 : i.code) ?? (a == null ? void 0 : a.driverCode) ?? 'DRV',
      y = (i == null ? void 0 : i.flagEmoji) ?? (a == null ? void 0 : a.countryFlag) ?? '',
      v = (i == null ? void 0 : i.country) ?? '',
      S = (i == null ? void 0 : i.imageUrl) || (n ? `/images/drivers/${n}.svg` : void 0);
    return e.jsx('div', {
      className: 'min-h-[70vh] bg-studio-100 py-10 sm:py-16',
      children: e.jsxs('div', {
        className: 'page-container max-w-5xl space-y-8',
        children: [
          e.jsxs('div', {
            className: 'flex flex-wrap items-center justify-between gap-4',
            children: [
              e.jsxs('div', {
                className: 'flex items-center gap-3',
                children: [
                  e.jsxs('button', {
                    onClick: () => {
                      window.history.length > 2 ? p(-1) : p(`/season/${t}?tab=drivers`);
                    },
                    className:
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-studio-200 text-xs font-bold uppercase tracking-wider text-studio-700 hover:text-f1red hover:border-f1red transition-all shadow-xs cursor-pointer active:scale-95',
                    children: [
                      e.jsx(z, { className: 'h-4 w-4' }),
                      e.jsx('span', { children: s === 'vi' ? 'Quay lại' : 'Back' }),
                    ],
                  }),
                  e.jsxs('div', {
                    className:
                      'flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-studio-400',
                    children: [
                      e.jsx(m, {
                        to: `/season/${t}?tab=drivers`,
                        className: 'hover:text-f1red transition-colors text-studio-500',
                        children: s === 'vi' ? `Tay đua (${t})` : `Drivers (${t})`,
                      }),
                      e.jsx('span', { children: '/' }),
                      e.jsx('span', { className: 'text-studio-900', children: f }),
                    ],
                  }),
                ],
              }),
              g.length > 0 &&
                e.jsxs('label', {
                  className:
                    'flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-studio-500',
                  children: [
                    s === 'vi' ? 'Mùa giải' : 'Season',
                    e.jsx('select', {
                      value: t,
                      onChange: (r) => u({ season: r.target.value }),
                      className:
                        'rounded-lg border border-studio-200 bg-white px-3 py-2 text-sm font-bold text-studio-900',
                      children: g.map((r) =>
                        e.jsx('option', { value: r.season, children: r.season }, r.season),
                      ),
                    }),
                  ],
                }),
            ],
          }),
          e.jsxs('header', {
            className:
              'relative overflow-hidden rounded-3xl bg-studio-950 p-6 sm:p-10 text-white shadow-2xl border border-studio-800',
            children: [
              e.jsx('div', {
                className: 'absolute inset-y-0 left-0 w-2.5 rounded-l-3xl',
                style: { backgroundColor: d },
              }),
              e.jsx('div', {
                className:
                  'absolute -right-16 -top-20 h-72 w-72 rounded-full opacity-25 blur-3xl pointer-events-none',
                style: { backgroundColor: d },
              }),
              e.jsx('div', {
                className:
                  'absolute -left-16 -bottom-20 h-72 w-72 rounded-full opacity-10 blur-3xl pointer-events-none',
                style: { backgroundColor: d },
              }),
              e.jsxs('div', {
                className:
                  'relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8',
                children: [
                  e.jsxs('div', {
                    className: 'space-y-4 max-w-xl',
                    children: [
                      e.jsxs('div', {
                        className: 'flex flex-wrap items-center gap-2',
                        children: [
                          e.jsxs('span', {
                            className: 'text-xs font-black uppercase tracking-[0.25em]',
                            style: { color: d },
                            children: [t, ' · ', N, ' · ', y, v ? ` ${v}` : ''],
                          }),
                          i &&
                            e.jsxs('span', {
                              className:
                                'px-2 py-0.5 rounded-md text-[11px] font-black font-mono uppercase text-white shadow-xs',
                              style: { backgroundColor: d },
                              children: ['#', x],
                            }),
                        ],
                      }),
                      e.jsx('h1', {
                        className:
                          'font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none',
                        children: f,
                      }),
                      e.jsxs('div', {
                        className: 'flex flex-wrap items-center gap-3 pt-2',
                        children: [
                          e.jsxs(m, {
                            to: `/teams/${l}?season=${t}`,
                            className:
                              'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all border border-white/10',
                            children: [
                              e.jsx(D, { teamId: l, size: 'sm' }),
                              e.jsx('span', {
                                children: ((T = G(l, t)) == null ? void 0 : T.fullName) ?? w,
                              }),
                              e.jsx(P, { className: 'h-3.5 w-3.5 text-studio-400' }),
                            ],
                          }),
                          e.jsxs(m, {
                            to: `/showroom?team=${l}`,
                            className:
                              'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-f1red/90 hover:bg-f1red text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-f1red/20 hover:scale-105',
                            title:
                              s === 'vi'
                                ? 'Xem cỗ máy trong Showroom 3D'
                                : 'View car in 3D Showroom',
                            children: [
                              e.jsx(A, { className: 'w-3.5 h-3.5' }),
                              e.jsx('span', { children: s === 'vi' ? 'Xem Xe 3D' : '3D Showroom' }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs('div', {
                        className:
                          'pt-2 flex flex-wrap items-center gap-3 text-xs text-studio-300 font-mono',
                        children: [
                          a &&
                            e.jsxs('div', {
                              className:
                                'flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10',
                              children: [
                                e.jsx(h, { className: 'w-3.5 h-3.5 text-amber-400' }),
                                e.jsxs('span', {
                                  children: [
                                    s === 'vi' ? `Mùa ${t}` : `Season ${t}`,
                                    ':',
                                    ' ',
                                    e.jsxs('strong', {
                                      className: 'text-white',
                                      children: ['P', a.rank],
                                    }),
                                    ' (',
                                    a.points,
                                    ' PTS)',
                                  ],
                                }),
                              ],
                            }),
                          (i || o.careerWins > 0 || o.podiums > 0) &&
                            e.jsxs('div', {
                              className:
                                'flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10',
                              children: [
                                e.jsx(k, { className: 'w-3.5 h-3.5 text-emerald-400' }),
                                e.jsxs('span', {
                                  children: [
                                    s === 'vi' ? 'Sự nghiệp' : 'Career',
                                    ':',
                                    ' ',
                                    e.jsx('strong', {
                                      className: 'text-white',
                                      children: o.careerWins,
                                    }),
                                    ' ',
                                    s === 'vi' ? 'thắng' : 'wins',
                                    ' ·',
                                    ' ',
                                    e.jsx('strong', {
                                      className: 'text-white',
                                      children: o.podiums,
                                    }),
                                    ' ',
                                    s === 'vi'
                                      ? 'lần lên bục'
                                      : o.podiums === 1
                                        ? 'podium'
                                        : 'podiums',
                                  ],
                                }),
                              ],
                            }),
                        ],
                      }),
                    ],
                  }),
                  e.jsx('div', {
                    className:
                      'relative shrink-0 self-center md:self-auto w-full sm:w-[360px] md:w-[420px] lg:w-[460px]',
                    children: e.jsx('div', {
                      className:
                        'relative w-full aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-black/80 bg-studio-950 flex flex-col items-center justify-center text-center group transition-all duration-300 hover:border-white/40',
                      style: { boxShadow: `0 20px 45px -10px ${d}40` },
                      children: S
                        ? e.jsxs(e.Fragment, {
                            children: [
                              e.jsx('img', {
                                src: S,
                                alt: f,
                                decoding: 'async',
                                onError: (r) => {
                                  r.currentTarget.style.display = 'none';
                                },
                                className:
                                  'w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700',
                              }),
                              e.jsx('div', {
                                className:
                                  'absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none',
                              }),
                              e.jsx('div', {
                                className:
                                  'absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold tracking-wider text-white uppercase opacity-75 group-hover:opacity-100 transition-opacity',
                                children: '16:9 POSTER',
                              }),
                            ],
                          })
                        : e.jsxs(e.Fragment, {
                            children: [
                              e.jsx('div', {
                                className: 'pt-2',
                                children: e.jsx(D, { teamId: l, size: 'md' }),
                              }),
                              e.jsxs('div', {
                                className: 'my-auto space-y-1',
                                children: [
                                  e.jsxs('span', {
                                    className:
                                      'block font-display text-5xl sm:text-6xl font-black tracking-tight',
                                    style: { color: d },
                                    children: ['#', x ?? '—'],
                                  }),
                                  e.jsx('span', {
                                    className:
                                      'block font-mono text-sm font-bold tracking-widest text-white/90',
                                    children: N,
                                  }),
                                ],
                              }),
                              e.jsxs('div', {
                                className:
                                  'pb-1 text-xs font-mono text-studio-400 flex items-center gap-1.5',
                                children: [
                                  e.jsx('span', { className: 'text-base', children: y }),
                                  e.jsx('span', { className: 'font-bold text-white', children: v }),
                                ],
                              }),
                            ],
                          }),
                    }),
                  }),
                ],
              }),
            ],
          }),
          a
            ? e.jsxs('div', {
                className: 'space-y-6',
                children: [
                  e.jsxs('div', {
                    children: [
                      e.jsxs('div', {
                        className: 'flex items-center justify-between mb-3',
                        children: [
                          e.jsxs('h3', {
                            className:
                              'text-xs font-black uppercase tracking-widest text-studio-600 flex items-center gap-2',
                            children: [
                              e.jsx(h, { className: 'w-4 h-4 text-f1red' }),
                              e.jsx('span', {
                                children:
                                  s === 'vi'
                                    ? `Thành tích Mùa giải ${t}`
                                    : `${t} Season Performance`,
                              }),
                            ],
                          }),
                          e.jsx('span', {
                            className: 'text-[11px] font-mono text-studio-400',
                            children:
                              s === 'vi' ? `Xếp hạng chính thức ${t}` : `Official ${t} Standings`,
                          }),
                        ],
                      }),
                      e.jsxs('div', {
                        className: 'grid gap-3 grid-cols-2 sm:grid-cols-4',
                        children: [
                          e.jsx(c, {
                            icon: e.jsx(h, { className: 'h-4 w-4 text-amber-500' }),
                            label: s === 'vi' ? `Thứ hạng mùa ${t}` : `Season ${t} Rank`,
                            value: `P${a.rank}`,
                            subValue: s === 'vi' ? 'Bảng xếp hạng cá nhân' : 'Drivers Championship',
                          }),
                          e.jsx(c, {
                            icon: e.jsx(F, { className: 'h-4 w-4 text-sky-500' }),
                            label: s === 'vi' ? `Điểm số mùa ${t}` : `Season ${t} Points`,
                            value: `${a.points} PTS`,
                            subValue: s === 'vi' ? 'Điểm tích lũy mùa giải' : 'Total points earned',
                          }),
                          e.jsx(c, {
                            icon: e.jsx(k, { className: 'h-4 w-4 text-emerald-500' }),
                            label: s === 'vi' ? `Chiến thắng mùa ${t}` : `Season ${t} Wins`,
                            value: `${a.wins} ${s === 'vi' ? 'chiến thắng' : a.wins === 1 ? 'win' : 'wins'}`,
                            subValue:
                              s === 'vi' ? 'Về nhất Grand Prix mùa này' : 'Grand Prix victories',
                          }),
                          e.jsx(c, {
                            icon: e.jsx(V, { className: 'h-4 w-4 text-amber-400' }),
                            label: s === 'vi' ? `Lần lên bục mùa ${t}` : `Season ${t} Podiums`,
                            value: `${a.podiums} ${s === 'vi' ? 'lần lên bục' : a.podiums === 1 ? 'podium' : 'podiums'}`,
                            subValue: s === 'vi' ? 'Top 3 về đích mùa này' : 'Top 3 finishes',
                          }),
                        ],
                      }),
                    ],
                  }),
                  (i || o.careerWins > 0 || o.podiums > 0) &&
                    e.jsxs('div', {
                      className: 'pt-2',
                      children: [
                        e.jsxs('div', {
                          className: 'flex items-center justify-between mb-3',
                          children: [
                            e.jsxs('h3', {
                              className:
                                'text-xs font-black uppercase tracking-widest text-studio-600 flex items-center gap-2',
                              children: [
                                e.jsx(k, { className: 'w-4 h-4 text-amber-500' }),
                                e.jsx('span', {
                                  children:
                                    s === 'vi'
                                      ? 'Kỷ lục trọn sự nghiệp F1 (All-Time Career)'
                                      : 'All-Time F1 Career Records',
                                }),
                              ],
                            }),
                            e.jsxs('span', {
                              className: 'text-[11px] font-mono text-studio-400',
                              children: [N, ' ', x ? `· #${x}` : ''],
                            }),
                          ],
                        }),
                        e.jsxs('div', {
                          className: 'grid gap-3 grid-cols-1 sm:grid-cols-3',
                          children: [
                            e.jsx(c, {
                              icon: e.jsx(h, { className: 'h-4 w-4 text-amber-500' }),
                              label:
                                s === 'vi'
                                  ? 'Tổng chiến thắng Grand Prix'
                                  : 'Career Grand Prix Wins',
                              value: `${o.careerWins}`,
                              subValue:
                                t < 2026
                                  ? s === 'vi'
                                    ? `Tính đến hết mùa ${t}: ${b.careerWins} chiến thắng`
                                    : `Through ${t}: ${b.careerWins} wins`
                                  : s === 'vi'
                                    ? 'Số lần về nhất sự nghiệp F1'
                                    : 'All-time F1 victories',
                            }),
                            e.jsx(c, {
                              icon: e.jsx(V, { className: 'h-4 w-4 text-emerald-500' }),
                              label: s === 'vi' ? 'Tổng số lần lên bục' : 'Career Total Podiums',
                              value: `${o.podiums}`,
                              subValue:
                                t < 2026
                                  ? s === 'vi'
                                    ? `Tính đến hết mùa ${t}: ${b.podiums} lần lên bục`
                                    : `Through ${t}: ${b.podiums} podiums`
                                  : s === 'vi'
                                    ? 'Top 3 trọn sự nghiệp F1'
                                    : 'All-time Top 3 finishes',
                            }),
                            e.jsx(c, {
                              icon: e.jsx(F, { className: 'h-4 w-4 text-sky-500' }),
                              label: s === 'vi' ? 'Số xe & Quốc tịch' : 'Car Number & Nation',
                              value: `${x ? `#${x} · ` : ''}${v || y}`,
                              subValue: (i == null ? void 0 : i.shortName) || f,
                            }),
                          ],
                        }),
                      ],
                    }),
                ],
              })
            : e.jsx(c, {
                icon: e.jsx(h, { className: 'h-4 w-4 text-amber-500' }),
                label: s === 'vi' ? 'Thành tích toàn sự nghiệp F1' : 'All-time F1 career record',
                value: `${o.careerWins} ${s === 'vi' ? 'chiến thắng' : 'wins'} · ${o.podiums} ${s === 'vi' ? 'lần lên bục' : 'podiums'}`,
              }),
          e.jsx('p', {
            className: 'text-[11px] text-studio-500',
            children:
              s === 'vi'
                ? 'Thứ hạng, điểm và kết quả mùa giải được trích xuất từ dữ liệu xếp hạng chính thức. Kỷ lục sự nghiệp thể hiện toàn bộ chiến thắng và số lần lên bục của tay đua trong lịch sử F1.'
                : 'Season rank, points, and results are sourced from official standings. Career records reflect all-time F1 victories and podium finishes.',
          }),
          e.jsxs(m, {
            to: `/showroom?team=${l}`,
            className:
              'inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-black uppercase tracking-wider text-studio-800 shadow-subtle hover:text-f1red',
            children: [
              e.jsx(A, { className: 'h-4 w-4 text-f1red' }),
              e.jsx('span', {
                children:
                  s === 'vi' ? `Khám phá Showroom 3D xe ${w}` : `Explore ${w} in 3D Showroom`,
              }),
              e.jsx(P, { className: 'h-4 w-4' }),
            ],
          }),
        ],
      }),
    });
  },
  c = ({ icon: n, label: p, value: j, subValue: u }) =>
    e.jsxs('div', {
      className:
        'rounded-2xl border border-studio-200 bg-white p-4 sm:p-5 shadow-subtle hover:border-studio-300 transition-colors flex flex-col justify-between',
      children: [
        e.jsxs('div', {
          children: [
            e.jsx('div', {
              className: 'flex items-center justify-between',
              children: e.jsx('span', {
                className: 'flex h-8 w-8 items-center justify-center rounded-lg bg-studio-100',
                children: n,
              }),
            }),
            e.jsx('p', {
              className: 'mt-3 text-[10px] font-black uppercase tracking-widest text-studio-400',
              children: p,
            }),
            e.jsx('p', {
              className:
                'mt-1 font-display text-xl sm:text-2xl font-black text-studio-950 tabular-nums',
              children: j,
            }),
          ],
        }),
        u &&
          e.jsx('p', {
            className:
              'mt-2 text-[11px] text-studio-500 font-medium border-t border-studio-100 pt-2',
            children: u,
          }),
      ],
    });
export { ae as DriverDetailPage };
