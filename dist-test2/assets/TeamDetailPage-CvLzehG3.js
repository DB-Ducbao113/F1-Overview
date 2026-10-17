import { h as y, k as T, i as $, j as e, L as d, R as C } from './vendor-react-B62-MmwA.js';
import { u as S, T as j, S as w } from './index-Bpqcd1AQ.js';
import { g as P } from './index-BB-pzTkF.js';
import './circuitsData-DyBO7Cz4.js';
import { g as D } from './teamSeasons-C1XHo0kd.js';
import { C as A } from './ConstructorLogo-BPzo8jEn.js';
import { g as I } from './teamNames-DMoXlsIr.js';
import { g as N } from './teamColors-B_bsvcV9.js';
import {
  O as U,
  T as B,
  B as v,
  e as L,
  U as F,
  W as M,
  A as p,
  Q as R,
} from './vendor-icons-Brb4Fsqu.js';
import './vendor-core-ckwbz45p.js';
import './2026-CHO3mofV.js';
const q = () => {
    const { teamId: c } = y(),
      x = T(),
      [m, k] = $(),
      a = S((s) => s.lang),
      g = Number(m.get('season')),
      t = [2024, 2025, 2026].includes(g) ? g : 2026,
      i = c && c in j ? j[c] : void 0;
    if (!i)
      return e.jsxs('div', {
        className: 'page-container py-24 min-h-[60vh] text-center',
        children: [
          e.jsx('p', { className: 'text-f1red font-black text-5xl', children: '404' }),
          e.jsx('h1', {
            className: 'mt-4 text-xl font-bold',
            children: a === 'vi' ? 'Không tìm thấy đội đua' : 'Team not found',
          }),
          e.jsx(d, {
            className: 'inline-block mt-6 text-f1red font-bold',
            to: '/season/2026',
            children: a === 'vi' ? 'Về mùa giải' : 'Back to season',
          }),
        ],
      });
    const l = D(i.id, t),
      f = w[t].drivers.filter((s) => s.teamId === i.id),
      h = P(t).filter((s) => s.teamId === i.id),
      o = w[t].constructors.find((s) => s.teamId === i.id),
      r = h[0],
      n = N(i.id, !0),
      b = N(i.id, !1);
    return e.jsx('div', {
      className: 'min-h-[70vh] bg-studio-100 py-10 sm:py-16',
      children: e.jsxs('div', {
        className: 'page-container space-y-8',
        children: [
          e.jsxs('div', {
            className: 'flex flex-wrap items-center justify-between gap-4',
            children: [
              e.jsxs('div', {
                className: 'flex items-center gap-3',
                children: [
                  e.jsxs('button', {
                    onClick: () => {
                      window.history.length > 2 ? x(-1) : x(`/season/${t}?tab=teams`);
                    },
                    className:
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-studio-200 text-xs font-bold uppercase tracking-wider text-studio-700 hover:text-f1red hover:border-f1red transition-all shadow-xs cursor-pointer active:scale-95',
                    children: [
                      e.jsx(U, { className: 'w-4 h-4' }),
                      e.jsx('span', { children: a === 'vi' ? 'Quay lại' : 'Back' }),
                    ],
                  }),
                  e.jsxs('div', {
                    className:
                      'flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-studio-400',
                    children: [
                      e.jsx(d, {
                        to: `/season/${t}?tab=teams`,
                        className: 'hover:text-f1red transition-colors text-studio-500',
                        children: a === 'vi' ? `Đội đua (${t})` : `Teams (${t})`,
                      }),
                      e.jsx('span', { children: '/' }),
                      e.jsx('span', { className: 'text-studio-900', children: i.name }),
                    ],
                  }),
                ],
              }),
              e.jsxs('label', {
                className:
                  'flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-studio-500',
                children: [
                  a === 'vi' ? 'Mùa giải' : 'Season',
                  e.jsx('select', {
                    value: t,
                    onChange: (s) => k({ season: s.target.value }),
                    className:
                      'rounded-lg border border-studio-200 bg-white px-3 py-2 text-sm font-bold text-studio-900',
                    children: [2026, 2025, 2024].map((s) =>
                      e.jsx('option', { value: s, children: s }, s),
                    ),
                  }),
                ],
              }),
            ],
          }),
          l
            ? e.jsxs(e.Fragment, {
                children: [
                  e.jsxs('header', {
                    className:
                      'relative overflow-hidden rounded-3xl bg-studio-950 p-6 sm:p-10 text-white shadow-2xl border border-studio-800',
                    children: [
                      e.jsx('div', {
                        className: 'absolute inset-y-0 left-0 w-2.5 rounded-l-3xl',
                        style: { backgroundColor: n },
                      }),
                      e.jsx('div', {
                        className:
                          'absolute -right-20 -top-24 h-80 w-80 rounded-full opacity-25 blur-3xl pointer-events-none',
                        style: { backgroundColor: n },
                      }),
                      e.jsx('div', {
                        className:
                          'absolute -left-20 -bottom-24 h-80 w-80 rounded-full opacity-10 blur-3xl pointer-events-none',
                        style: { backgroundColor: n },
                      }),
                      e.jsxs('div', {
                        className:
                          'relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8',
                        children: [
                          e.jsxs('div', {
                            className: 'max-w-2xl space-y-4',
                            children: [
                              e.jsxs('div', {
                                className: 'flex items-center gap-3',
                                children: [
                                  e.jsx(A, { teamId: i.id, size: 'md' }),
                                  e.jsxs('span', {
                                    className: 'text-xs font-black uppercase tracking-[0.25em]',
                                    style: { color: n },
                                    children: [I(i.id, t), ' · ', t],
                                  }),
                                ],
                              }),
                              e.jsx('h1', {
                                className:
                                  'font-display text-4xl sm:text-6xl font-black uppercase tracking-tight',
                                children: l.fullName,
                              }),
                              e.jsx('p', {
                                className: 'max-w-2xl text-sm sm:text-base text-studio-300',
                                children:
                                  a === 'vi'
                                    ? `Đội hình, thứ hạng và xe đua theo dữ liệu mùa giải ${t}.`
                                    : `Driver line-up, standings, and car data for the ${t} season.`,
                              }),
                              e.jsxs('div', {
                                className: 'flex flex-wrap items-center gap-3 pt-1',
                                children: [
                                  o
                                    ? e.jsxs('div', {
                                        className:
                                          'inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold',
                                        children: [
                                          e.jsx(B, { className: 'w-4 h-4 text-amber-400' }),
                                          'P',
                                          o.rank,
                                          ' ·',
                                          ' ',
                                          o.points,
                                          ' PTS',
                                        ],
                                      })
                                    : e.jsx('span', {
                                        className:
                                          'inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-studio-300',
                                        children:
                                          a === 'vi'
                                            ? 'Không có thứ hạng đội trong dữ liệu mùa này'
                                            : 'No constructor standings for this season',
                                      }),
                                  e.jsxs(d, {
                                    to: `/showroom?team=${i.id}`,
                                    className:
                                      'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-f1red hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-f1red/30 transition-all hover:scale-105',
                                    children: [
                                      e.jsx(v, { className: 'w-4 h-4' }),
                                      e.jsx('span', {
                                        children:
                                          a === 'vi'
                                            ? 'Xem Xe Trong Showroom 3D'
                                            : 'View in 3D Showroom',
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          i.imageUrl &&
                            e.jsx('div', {
                              className:
                                'relative shrink-0 self-center lg:self-auto w-full max-w-sm sm:max-w-md lg:w-96',
                              children: e.jsxs('div', {
                                className:
                                  'group relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-studio-900 to-studio-950 shadow-2xl transition hover:-translate-y-1',
                                style: { boxShadow: `0 20px 40px -15px ${n}30` },
                                children: [
                                  e.jsxs('div', {
                                    className:
                                      'relative aspect-[16/10] overflow-hidden bg-black/60',
                                    children: [
                                      e.jsx('img', {
                                        src: i.imageUrl,
                                        alt: l.fullName,
                                        decoding: 'async',
                                        className:
                                          'h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105',
                                      }),
                                      e.jsx('div', {
                                        className:
                                          'absolute inset-0 bg-gradient-to-t from-studio-950 via-studio-950/20 to-transparent',
                                      }),
                                      e.jsxs('div', {
                                        className:
                                          'absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-black uppercase text-white border border-white/10',
                                        children: [
                                          e.jsx('span', {
                                            className: 'w-2 h-2 rounded-full',
                                            style: { backgroundColor: n },
                                          }),
                                          e.jsx('span', {
                                            children: (r == null ? void 0 : r.shortName) || i.name,
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsxs('div', {
                                    className: 'p-4 space-y-1.5 border-t border-white/10',
                                    children: [
                                      e.jsxs('div', {
                                        className: 'flex items-center justify-between',
                                        children: [
                                          e.jsxs('p', {
                                            className:
                                              'text-[10px] font-black uppercase tracking-widest text-studio-400',
                                            children: ['F1 ', t, ' Challenger'],
                                          }),
                                          e.jsx('span', {
                                            className: 'text-[10px] font-mono text-studio-400',
                                            children: l.powerUnit,
                                          }),
                                        ],
                                      }),
                                      e.jsx('h4', {
                                        className:
                                          'font-display text-sm font-black text-white truncate',
                                        children: (r == null ? void 0 : r.name) || l.fullName,
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs('section', {
                    className: 'grid gap-4 sm:grid-cols-3',
                    children: [
                      e.jsx(u, {
                        icon: e.jsx(L, {}),
                        label: a === 'vi' ? 'Cơ sở' : 'Base',
                        value: l.base,
                      }),
                      e.jsx(u, { icon: e.jsx(F, {}), label: l.teamLeadTitle, value: l.teamLead }),
                      e.jsx(u, {
                        icon: e.jsx(M, {}),
                        label: a === 'vi' ? `Động cơ · ${t}` : `Power unit · ${t}`,
                        value:
                          l.powerUnit ||
                          (r == null ? void 0 : r.powerUnit) ||
                          (o == null ? void 0 : o.engine) ||
                          (a === 'vi'
                            ? 'Chưa có dữ liệu động cơ theo mùa'
                            : 'No seasonal power unit data'),
                      }),
                    ],
                  }),
                  e.jsx('p', {
                    className: '-mt-5 text-[11px] text-studio-500',
                    children:
                      a === 'vi'
                        ? `Hồ sơ đội phản ánh tên đăng ký, cơ sở, người phụ trách và nhà cung cấp động lực ở cuối mùa ${t}.`
                        : `Team identity, base, leadership, and power unit reflect the end-of-season profile for ${t}.`,
                  }),
                  e.jsxs('section', {
                    className: 'space-y-4',
                    children: [
                      e.jsxs('div', {
                        className: 'flex flex-wrap items-end justify-between gap-3',
                        children: [
                          e.jsxs('div', {
                            children: [
                              e.jsxs('p', {
                                className: 'text-xs font-bold uppercase tracking-widest text-f1red',
                                children: [t, ' Grid'],
                              }),
                              e.jsx('h2', {
                                className: 'font-display text-2xl sm:text-3xl font-black uppercase',
                                children: a === 'vi' ? 'Đội hình tay đua' : 'Driver line-up',
                              }),
                            ],
                          }),
                          e.jsxs(d, {
                            to: `/showroom?team=${i.id}`,
                            className:
                              'inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-f1red hover:underline',
                            children: [
                              e.jsx(v, { className: 'w-3.5 h-3.5' }),
                              e.jsx('span', {
                                children:
                                  a === 'vi' ? 'Xem xe 3D trong Showroom' : 'View in 3D Showroom',
                              }),
                              e.jsx(p, { className: 'w-3.5 h-3.5' }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs('div', {
                        className: 'grid gap-4 sm:grid-cols-2',
                        children: [
                          f.map((s) =>
                            e.jsxs(
                              d,
                              {
                                to: `/drivers/${s.driverId}?season=${t}`,
                                className:
                                  'group flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-subtle transition hover:-translate-y-0.5 hover:shadow-md',
                                style: { borderColor: `${b}40` },
                                children: [
                                  e.jsxs('span', {
                                    className:
                                      'flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-2xl font-black text-white',
                                    style: { backgroundColor: b },
                                    children: ['P', s.rank],
                                  }),
                                  e.jsxs('span', {
                                    className: 'min-w-0 flex-1',
                                    children: [
                                      e.jsxs('span', {
                                        className:
                                          'block text-[10px] font-black uppercase tracking-widest text-studio-400',
                                        children: [s.driverCode, ' · ', s.countryFlag],
                                      }),
                                      e.jsx('span', {
                                        className:
                                          'mt-1 block font-display text-xl font-bold text-studio-950 group-hover:text-f1red',
                                        children: s.driverName,
                                      }),
                                      e.jsxs('span', {
                                        className: 'mt-1 block text-xs text-studio-500',
                                        children: [
                                          s.points,
                                          ' PTS · ',
                                          s.wins,
                                          ' ',
                                          a === 'vi'
                                            ? 'chiến thắng'
                                            : s.wins === 1
                                              ? 'win'
                                              : 'wins',
                                          ' ·',
                                          ' ',
                                          s.podiums,
                                          ' ',
                                          a === 'vi'
                                            ? 'lần lên bục'
                                            : s.podiums === 1
                                              ? 'podium'
                                              : 'podiums',
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsx(p, {
                                    className:
                                      'h-4 w-4 shrink-0 text-studio-300 group-hover:text-f1red',
                                  }),
                                ],
                              },
                              s.driverId,
                            ),
                          ),
                          !f.length &&
                            e.jsx('p', {
                              className:
                                'rounded-xl border border-dashed border-studio-300 bg-white p-6 text-sm text-studio-500',
                              children:
                                a === 'vi'
                                  ? 'Không có roster cho đội này trong dữ liệu mùa giải đã chọn.'
                                  : 'No driver line-up is available for this team in the selected season dataset.',
                            }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs('section', {
                    className: 'space-y-4',
                    children: [
                      e.jsxs('div', {
                        children: [
                          e.jsxs('p', {
                            className: 'text-xs font-bold uppercase tracking-widest text-f1red',
                            children: [t, ' Car'],
                          }),
                          e.jsx('h2', {
                            className: 'font-display text-2xl sm:text-3xl font-black uppercase',
                            children: a === 'vi' ? `Mẫu xe mùa ${t}` : `${t} car model`,
                          }),
                        ],
                      }),
                      h.length
                        ? e.jsx('div', {
                            className: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
                            children: h.map((s) =>
                              e.jsxs(
                                d,
                                {
                                  to: `/cars/${s.id}`,
                                  className:
                                    'group flex items-center gap-4 rounded-2xl border border-studio-200 bg-white p-5 shadow-subtle transition hover:-translate-y-0.5 hover:border-studio-400 hover:shadow-md',
                                  children: [
                                    e.jsx('span', {
                                      className:
                                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white',
                                      style: { backgroundColor: s.primaryColor },
                                      children: e.jsx(R, { className: 'h-5 w-5' }),
                                    }),
                                    e.jsxs('span', {
                                      className: 'min-w-0 flex-1',
                                      children: [
                                        e.jsxs('span', {
                                          className:
                                            'block text-[10px] font-black uppercase tracking-widest text-studio-400',
                                          children: [s.season, ' · ', s.shortName],
                                        }),
                                        e.jsx('span', {
                                          className:
                                            'mt-1 block font-bold text-studio-950 group-hover:text-f1red',
                                          children: s.name,
                                        }),
                                      ],
                                    }),
                                    e.jsx(p, {
                                      className:
                                        'h-4 w-4 shrink-0 text-studio-300 group-hover:text-f1red',
                                    }),
                                  ],
                                },
                                s.id,
                              ),
                            ),
                          })
                        : e.jsx('p', {
                            className: 'text-sm text-studio-500',
                            children:
                              a === 'vi'
                                ? 'Chưa có dữ liệu xe cho đội này.'
                                : 'No car data for this team yet.',
                          }),
                    ],
                  }),
                ],
              })
            : e.jsxs('section', {
                className:
                  'rounded-3xl border border-studio-200 bg-white p-8 text-center shadow-subtle',
                children: [
                  e.jsx('p', {
                    className: 'text-xs font-black uppercase tracking-[0.25em] text-f1red',
                    children: t,
                  }),
                  e.jsx('h1', {
                    className: 'mt-3 font-display text-3xl font-black uppercase text-studio-950',
                    children: i.name,
                  }),
                  e.jsx('p', {
                    className: 'mx-auto mt-3 max-w-xl text-sm leading-relaxed text-studio-600',
                    children:
                      a === 'vi'
                        ? 'Đội này chưa tham gia mùa giải đã chọn nên không có hồ sơ mùa, roster hay đơn vị động lực.'
                        : 'This team did not compete in the selected season, so no seasonal profile, line-up, or power unit is available.',
                  }),
                ],
              }),
        ],
      }),
    });
  },
  u = ({ icon: c, label: x, value: m }) =>
    e.jsxs('div', {
      className: 'rounded-2xl border border-studio-200 bg-white p-5 shadow-subtle',
      children: [
        e.jsx('span', {
          className: 'flex h-9 w-9 items-center justify-center rounded-lg bg-f1red/10 text-f1red',
          children: C.cloneElement(c, { className: 'h-4 w-4' }),
        }),
        e.jsx('p', {
          className: 'mt-4 text-[10px] font-black uppercase tracking-widest text-studio-400',
          children: x,
        }),
        e.jsx('p', {
          className: 'mt-1 text-sm font-bold leading-relaxed text-studio-900',
          children: m,
        }),
      ],
    });
export { q as TeamDetailPage };
