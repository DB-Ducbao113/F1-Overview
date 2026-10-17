import { R as S, r as p, j as e, L as f } from './vendor-react-B62-MmwA.js';
import { u as T, S as v, T as C } from './index-Bpqcd1AQ.js';
import './circuitsData-DyBO7Cz4.js';
import { g } from './teamSeasons-C1XHo0kd.js';
import { C as D } from './ConstructorLogo-BPzo8jEn.js';
import { V as A } from './ViewportImage-C-v4fzqx.js';
import { g as I } from './teamColors-B_bsvcV9.js';
import { a1 as L, A as N, T as $, e as E, U as P, B as U } from './vendor-icons-Brb4Fsqu.js';
import './vendor-core-ckwbz45p.js';
const B = [2026, 2025, 2024],
  K = S.memo(({ initialSeason: n = 2026, hideHeader: d = !1 }) => {
    const a = T((s) => s.lang),
      [w, y] = p.useState(n),
      [i, b] = p.useState(n);
    w !== n && (y(n), b(n));
    const [h, k] = p.useState(''),
      x = v[i].constructors,
      m = p.useMemo(() => {
        const s = h.trim().toLowerCase();
        return Object.values(C)
          .filter((t) => !!g(t.id, i))
          .filter((t) => {
            if (!s) return !0;
            const r = g(t.id, i);
            return [t.name, r.fullName, r.base, r.teamLead, r.powerUnit].some((l) =>
              l.toLowerCase().includes(s),
            );
          })
          .sort((t, r) => {
            var o, j;
            const l = ((o = x.find((u) => u.teamId === t.id)) == null ? void 0 : o.rank) ?? 99,
              c = ((j = x.find((u) => u.teamId === r.id)) == null ? void 0 : j.rank) ?? 99;
            return l - c || t.name.localeCompare(r.name);
          });
      }, [h, x, i]);
    return e.jsx('div', {
      className: d ? 'space-y-6' : 'min-h-[70vh] bg-studio-100 py-10 sm:py-16',
      children: e.jsxs('div', {
        className: d ? 'space-y-6' : 'page-container space-y-8',
        children: [
          !d &&
            e.jsxs('header', {
              className: 'max-w-3xl space-y-3',
              children: [
                e.jsx('span', {
                  className: 'text-xs font-bold uppercase tracking-widest text-f1red',
                  children: 'F1 Grid Directory',
                }),
                e.jsx('h1', {
                  className:
                    'font-display text-4xl font-black uppercase tracking-tight text-studio-950 sm:text-5xl',
                  children: a === 'vi' ? 'Các đội đua' : 'The teams',
                }),
                e.jsx('p', {
                  className: 'text-sm leading-relaxed text-studio-600',
                  children:
                    a === 'vi'
                      ? 'Tìm kiếm đội đua theo tên, trụ sở, team principal hoặc đơn vị động lực; xem thứ hạng theo mùa giải.'
                      : 'Search constructors by name, base, team principal, or power unit, then compare their season standings.',
                }),
                e.jsx('p', {
                  className: 'text-[11px] leading-relaxed text-studio-500',
                  children:
                    a === 'vi'
                      ? 'Tên đăng ký, cơ sở, người phụ trách, đơn vị động lực, roster và thứ hạng đều theo mùa đã chọn.'
                      : 'Entry name, base, leadership, power unit, line-up, and standings follow the selected season.',
                }),
              ],
            }),
          e.jsxs('div', {
            className:
              'flex flex-col gap-3 rounded-2xl border border-studio-200 bg-white p-4 shadow-subtle sm:flex-row',
            children: [
              e.jsxs('label', {
                className: 'relative flex-1',
                children: [
                  e.jsx(L, {
                    className: 'absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-studio-400',
                  }),
                  e.jsx('input', {
                    value: h,
                    onChange: (s) => k(s.target.value),
                    placeholder:
                      a === 'vi'
                        ? 'Tìm đội đua, trụ sở, động cơ…'
                        : 'Search team, base, power unit…',
                    className:
                      'w-full rounded-xl border border-studio-200 bg-studio-50 py-3 pl-10 pr-3 text-sm outline-none focus:border-f1red',
                  }),
                ],
              }),
              !d &&
                e.jsxs('label', {
                  className:
                    'flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-studio-500',
                  children: [
                    a === 'vi' ? 'Mùa giải' : 'Season',
                    e.jsx('select', {
                      value: i,
                      onChange: (s) => b(Number(s.target.value)),
                      className:
                        'rounded-xl border border-studio-200 bg-studio-50 px-3 py-3 text-sm font-bold text-studio-900 outline-none focus:border-f1red',
                      children: B.map((s) => e.jsx('option', { value: s, children: s }, s)),
                    }),
                  ],
                }),
            ],
          }),
          e.jsxs('div', {
            className: 'flex items-center justify-between text-xs text-studio-500',
            children: [
              e.jsx('span', {
                children: a === 'vi' ? `Tìm thấy ${m.length} đội` : `${m.length} teams found`,
              }),
              e.jsxs(f, {
                to: d ? `/season/${i}?tab=drivers` : '/drivers',
                className: 'inline-flex items-center gap-1 font-bold text-f1red hover:underline',
                children: [
                  a === 'vi' ? 'Danh sách tay đua' : 'Driver directory',
                  e.jsx(N, { className: 'h-3.5 w-3.5' }),
                ],
              }),
            ],
          }),
          m.length
            ? e.jsx('div', {
                className: 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3',
                children: m.map((s) => {
                  const t = g(s.id, i),
                    r = x.find((o) => o.teamId === s.id),
                    l = v[i].drivers.filter((o) => o.teamId === s.id),
                    c = I(s.id, !1);
                  return e.jsx(
                    'article',
                    {
                      className:
                        'overflow-hidden rounded-2xl border bg-white shadow-subtle transition hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between',
                      style: { borderColor: `${c}40` },
                      children: e.jsxs('div', {
                        children: [
                          e.jsx('div', { className: 'h-2', style: { backgroundColor: c } }),
                          s.imageUrl &&
                            e.jsxs('div', {
                              className: 'relative aspect-[16/7] overflow-hidden bg-studio-950',
                              children: [
                                e.jsx(A, {
                                  src: s.imageUrl,
                                  alt: t.fullName,
                                  className:
                                    'h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105',
                                }),
                                e.jsx('div', {
                                  className:
                                    'absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none',
                                }),
                                e.jsxs('div', {
                                  className:
                                    'absolute bottom-2 left-4 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-black uppercase text-white border border-white/10',
                                  children: [
                                    e.jsx('span', {
                                      className: 'w-1.5 h-1.5 rounded-full',
                                      style: { backgroundColor: c },
                                    }),
                                    e.jsxs('span', { children: [s.name, ' · ', i] }),
                                  ],
                                }),
                              ],
                            }),
                          e.jsxs('div', {
                            className: 'space-y-5 p-5 sm:p-6',
                            children: [
                              e.jsxs('div', {
                                className: 'flex items-start justify-between gap-3',
                                children: [
                                  e.jsxs('div', {
                                    className: 'flex items-center gap-3 min-w-0',
                                    children: [
                                      e.jsx(D, { teamId: s.id, size: 'md' }),
                                      e.jsxs('div', {
                                        className: 'min-w-0',
                                        children: [
                                          e.jsx('p', {
                                            className:
                                              'text-[10px] font-black uppercase tracking-widest text-studio-400',
                                            children: s.name,
                                          }),
                                          e.jsx('h2', {
                                            className:
                                              'mt-0.5 font-display text-lg sm:text-xl font-black uppercase text-studio-950 truncate',
                                            children: t.fullName,
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  r &&
                                    e.jsxs('span', {
                                      className:
                                        'inline-flex shrink-0 items-center gap-1 rounded-full bg-studio-100 px-2.5 py-1 text-[11px] font-black text-studio-700',
                                      children: [
                                        e.jsx($, { className: 'h-3 w-3 text-amber-500' }),
                                        'P',
                                        r.rank,
                                      ],
                                    }),
                                ],
                              }),
                              e.jsxs('div', {
                                className: 'space-y-2 text-xs text-studio-600',
                                children: [
                                  e.jsxs('p', {
                                    className: 'flex items-start gap-2',
                                    children: [
                                      e.jsx(E, {
                                        className: 'mt-0.5 h-3.5 w-3.5 shrink-0 text-f1red',
                                      }),
                                      t.base,
                                    ],
                                  }),
                                  e.jsxs('p', {
                                    className: 'pl-5 text-[11px] text-studio-500',
                                    children: [
                                      t.teamLeadTitle,
                                      ': ',
                                      t.teamLead,
                                      ' · ',
                                      t.powerUnit,
                                    ],
                                  }),
                                  e.jsxs('p', {
                                    className: 'flex items-start gap-2',
                                    children: [
                                      e.jsx(P, {
                                        className: 'mt-0.5 h-3.5 w-3.5 shrink-0 text-f1red',
                                      }),
                                      l.length
                                        ? l.map((o) => o.driverName).join(' · ')
                                        : a === 'vi'
                                          ? 'Chưa có roster trong dữ liệu mùa này'
                                          : 'No season roster in the available data',
                                    ],
                                  }),
                                ],
                              }),
                              r &&
                                e.jsxs('p', {
                                  className:
                                    'border-t border-studio-100 pt-3 text-xs font-bold text-studio-500',
                                  children: [
                                    r.points,
                                    ' PTS ',
                                    e.jsx('span', {
                                      className: 'mx-1 text-studio-300',
                                      children: '·',
                                    }),
                                    ' ',
                                    r.wins,
                                    ' ',
                                    a === 'vi' ? 'chiến thắng' : 'wins',
                                    ' ',
                                    e.jsx('span', {
                                      className: 'mx-1 text-studio-300',
                                      children: '·',
                                    }),
                                    ' ',
                                    i,
                                  ],
                                }),
                              e.jsxs('div', {
                                className:
                                  'flex items-center justify-between pt-3 border-t border-studio-100',
                                children: [
                                  e.jsxs(f, {
                                    to: `/teams/${s.id}?season=${i}`,
                                    className:
                                      'inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-studio-700 hover:text-f1red transition-colors',
                                    children: [
                                      e.jsx('span', {
                                        children: a === 'vi' ? 'Hồ sơ đội' : 'Team profile',
                                      }),
                                      e.jsx(N, { className: 'h-3.5 w-3.5 text-f1red' }),
                                    ],
                                  }),
                                  e.jsxs(f, {
                                    to: `/showroom?team=${s.id}`,
                                    className:
                                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-studio-950 hover:bg-f1red text-white text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm hover:scale-105 active:scale-95',
                                    title:
                                      a === 'vi'
                                        ? 'Xem cỗ máy F1 trong Showroom 3D'
                                        : 'Inspect 3D machine in Showroom',
                                    children: [
                                      e.jsx(U, { className: 'w-3.5 h-3.5 text-f1red' }),
                                      e.jsx('span', {
                                        children: a === 'vi' ? 'Xem Xe 3D' : '3D Showroom',
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    },
                    s.id,
                  );
                }),
              })
            : e.jsx(M, { lang: a }),
        ],
      }),
    });
  }),
  M = ({ lang: n }) =>
    e.jsx('div', {
      className:
        'rounded-2xl border border-dashed border-studio-300 bg-white p-12 text-center text-sm text-studio-500',
      children: n === 'vi' ? 'Không tìm thấy đội đua phù hợp.' : 'No matching teams found.',
    });
export { K as TeamsDirectoryPage };
