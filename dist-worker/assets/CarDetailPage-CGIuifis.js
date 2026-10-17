import { h as j, k as b, j as e, L as r, R as N } from './vendor-react-B62-MmwA.js';
import { a as w } from './index-DioB7If-.js';
import { u as y, T as k } from './index-C6VPy6l3.js';
import { g as C } from './teamSeasons-C1XHo0kd.js';
import { C as T } from './ConstructorLogo-BPzo8jEn.js';
import {
  O as I,
  A as S,
  B as $,
  _ as D,
  $ as d,
  t as E,
  a0 as H,
} from './vendor-icons-Brb4Fsqu.js';
import './2026-CZ0b0NTE.js';
import './vendor-core-ckwbz45p.js';
const G = () => {
    var m, p, g, u, f;
    const { carId: l } = j(),
      c = b(),
      t = y((i) => i.lang),
      s = l ? w(l) : void 0;
    if (!s)
      return e.jsxs('div', {
        className: 'page-container py-24 min-h-[60vh] text-center',
        children: [
          e.jsx('p', { className: 'text-f1red font-black text-5xl', children: '404' }),
          e.jsx('h1', {
            className: 'mt-4 text-xl font-bold',
            children: t === 'vi' ? 'Không tìm thấy xe đua' : 'Car not found',
          }),
          e.jsx(r, {
            className: 'inline-block mt-6 text-f1red font-bold',
            to: '/season/2026',
            children: t === 'vi' ? 'Về mùa giải' : 'Back to season',
          }),
        ],
      });
    const x = k[s.teamId],
      o = C(s.teamId, s.season),
      a = s.officialSpecs,
      h = [
        [
          t === 'vi' ? 'Hệ thống treo trước' : 'Front suspension',
          (m = s.technicalHighlights) == null ? void 0 : m.frontSuspension,
        ],
        [
          t === 'vi' ? 'Hệ thống treo sau' : 'Rear suspension',
          (p = s.technicalHighlights) == null ? void 0 : p.rearSuspension,
        ],
        [
          t === 'vi' ? 'Triết lý khí động học' : 'Aerodynamic philosophy',
          (g = s.technicalHighlights) == null ? void 0 : g.aeroPhilosophy,
        ],
        [
          t === 'vi' ? 'Hiệu ứng mặt đất' : 'Ground effect',
          (u = s.technicalHighlights) == null ? void 0 : u.groundEffectNotes,
        ],
        [
          t === 'vi' ? 'Kết cấu khung gầm' : 'Chassis construction',
          (f = s.technicalHighlights) == null ? void 0 : f.chassisConstruction,
        ],
      ].filter(([, i]) => !!i);
    return e.jsx('div', {
      className: 'min-h-[70vh] bg-studio-100 py-10 sm:py-16',
      children: e.jsxs('div', {
        className: 'page-container space-y-8',
        children: [
          e.jsxs('div', {
            className: 'flex items-center gap-3',
            children: [
              e.jsxs('button', {
                onClick: () => {
                  window.history.length > 2 ? c(-1) : c(`/teams/${s.teamId}?season=${s.season}`);
                },
                className:
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-studio-200 text-xs font-bold uppercase tracking-wider text-studio-700 hover:text-f1red hover:border-f1red transition-all shadow-xs cursor-pointer active:scale-95',
                children: [
                  e.jsx(I, { className: 'h-4 w-4' }),
                  e.jsx('span', { children: t === 'vi' ? 'Quay lại' : 'Back' }),
                ],
              }),
              e.jsxs('div', {
                className:
                  'flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-studio-400',
                children: [
                  e.jsxs(r, {
                    to: `/teams/${s.teamId}?season=${s.season}`,
                    className: 'hover:text-f1red transition-colors text-studio-500',
                    children: [x.name, ' (', s.season, ')'],
                  }),
                  e.jsx('span', { children: '/' }),
                  e.jsx('span', { className: 'text-studio-900', children: s.name }),
                ],
              }),
            ],
          }),
          e.jsxs('header', {
            className:
              'relative min-h-[360px] overflow-hidden rounded-3xl bg-studio-950 text-white',
            children: [
              s.heroImage &&
                e.jsx('img', {
                  src: s.heroImage,
                  alt: s.name,
                  decoding: 'async',
                  className: 'absolute inset-0 h-full w-full object-cover opacity-55',
                  onError: (i) => {
                    i.currentTarget.style.display = 'none';
                  },
                }),
              e.jsx('div', {
                className:
                  'absolute inset-0 bg-gradient-to-r from-studio-950 via-studio-950/75 to-studio-950/15',
              }),
              e.jsx('div', {
                className: 'absolute inset-y-0 left-0 w-2',
                style: { backgroundColor: s.primaryColor },
              }),
              e.jsxs('div', {
                className: 'relative flex min-h-[360px] flex-col justify-end p-7 sm:p-12',
                children: [
                  e.jsxs('div', {
                    className: 'flex items-center gap-2.5',
                    children: [
                      e.jsx(T, { teamId: s.teamId, size: 'sm' }),
                      e.jsxs('span', {
                        className: 'text-xs font-black uppercase tracking-[0.25em]',
                        style: { color: s.primaryColor },
                        children: [
                          s.season,
                          ' · ',
                          (o == null ? void 0 : o.fullName) || x.fullName,
                        ],
                      }),
                    ],
                  }),
                  e.jsx('h1', {
                    className:
                      'mt-3 max-w-3xl font-display text-4xl font-black uppercase tracking-tight sm:text-6xl',
                    children: s.name,
                  }),
                  (t === 'vi' ? s.descriptionVi : s.descriptionEn) &&
                    e.jsx('p', {
                      className: 'mt-4 max-w-2xl text-sm leading-relaxed text-studio-200',
                      children: t === 'vi' ? s.descriptionVi : s.descriptionEn,
                    }),
                  e.jsxs('div', {
                    className: 'mt-6 flex flex-wrap gap-3',
                    children: [
                      e.jsxs(r, {
                        to: `/teams/${s.teamId}?season=${s.season}`,
                        className:
                          'inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wider text-studio-950 hover:bg-studio-100',
                        children: [
                          t === 'vi' ? 'Hồ sơ đội' : 'Team profile',
                          e.jsx(S, { className: 'h-4 w-4' }),
                        ],
                      }),
                      e.jsxs(r, {
                        to: `/showroom?team=${s.teamId}`,
                        className:
                          'inline-flex items-center gap-2 rounded-lg bg-f1red hover:bg-red-600 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg hover:shadow-f1red/30 transition-all hover:scale-105',
                        children: [
                          e.jsx($, { className: 'w-4 h-4' }),
                          e.jsx('span', {
                            children: t === 'vi' ? 'Xem trong Showroom 3D' : 'View in 3D Showroom',
                          }),
                        ],
                      }),
                    ],
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
                  e.jsx('p', {
                    className: 'text-xs font-bold uppercase tracking-widest text-f1red',
                    children: t === 'vi' ? 'Thông số' : 'Specifications',
                  }),
                  e.jsx('h2', {
                    className: 'font-display text-2xl font-black uppercase sm:text-3xl',
                    children: t === 'vi' ? 'Thông số xe' : 'Car specification',
                  }),
                ],
              }),
              a
                ? e.jsxs('div', {
                    className: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
                    children: [
                      e.jsx(n, {
                        icon: e.jsx(D, {}),
                        label: t === 'vi' ? 'Khối lượng tối thiểu' : 'Minimum weight',
                        value: `${a.minWeightKg} kg`,
                      }),
                      e.jsx(n, {
                        icon: e.jsx(d, {}),
                        label: t === 'vi' ? 'Cấu hình động cơ' : 'Engine configuration',
                        value: a.engineConfig,
                      }),
                      e.jsx(n, {
                        icon: e.jsx(d, {}),
                        label: t === 'vi' ? 'Dung tích' : 'Displacement',
                        value: `${a.displacementLiters} L`,
                      }),
                      e.jsx(n, {
                        icon: e.jsx(E, {}),
                        label: t === 'vi' ? 'Hộp số' : 'Gearbox',
                        value: a.gearbox,
                      }),
                      e.jsx(n, {
                        icon: e.jsx(H, {}),
                        label: t === 'vi' ? 'Kích thước bánh xe' : 'Wheel size',
                        value: `${a.wheelSizeInch} in`,
                      }),
                      e.jsx(n, {
                        icon: e.jsx(d, {}),
                        label: t === 'vi' ? 'Dung lượng nhiên liệu' : 'Fuel capacity',
                        value: `${a.fuelCapacityKg} kg`,
                      }),
                    ],
                  })
                : e.jsx('p', {
                    className:
                      'rounded-2xl border border-dashed border-studio-300 bg-white p-5 text-sm text-studio-600',
                    children:
                      t === 'vi'
                        ? 'Thông số kỹ thuật chi tiết chưa được xác minh cho mẫu xe này.'
                        : 'Detailed technical specifications have not been verified for this car.',
                  }),
              a &&
                e.jsx('p', {
                  className: 'text-[11px] text-studio-500',
                  children:
                    t === 'vi'
                      ? 'Thông số được hiển thị theo dữ liệu mẫu của dự án.'
                      : 'Specifications are shown as provided in the project dataset.',
                }),
            ],
          }),
          e.jsxs('section', {
            className: 'grid gap-8 lg:grid-cols-[0.8fr_1.2fr]',
            children: [
              e.jsxs('div', {
                className: 'rounded-2xl bg-studio-950 p-6 text-white sm:p-8',
                children: [
                  e.jsx('p', {
                    className: 'text-xs font-bold uppercase tracking-widest text-f1red',
                    children: t === 'vi' ? 'Đội ngũ phát triển' : 'Engineering',
                  }),
                  e.jsx('h2', {
                    className: 'mt-2 font-display text-2xl font-black uppercase',
                    children: t === 'vi' ? 'Thông tin xe' : 'Car details',
                  }),
                  e.jsxs('dl', {
                    className: 'mt-6 space-y-4 text-sm',
                    children: [
                      e.jsxs('div', {
                        children: [
                          e.jsx('dt', {
                            className: 'text-xs text-studio-400',
                            children: t === 'vi' ? 'Nhà thiết kế' : 'Designer',
                          }),
                          e.jsx('dd', {
                            className: 'mt-1 font-bold',
                            children:
                              s.designer || (t === 'vi' ? 'Chưa có dữ liệu' : 'Not available'),
                          }),
                        ],
                      }),
                      e.jsxs('div', {
                        children: [
                          e.jsx('dt', {
                            className: 'text-xs text-studio-400',
                            children: t === 'vi' ? 'Đơn vị động lực' : 'Power unit',
                          }),
                          e.jsx('dd', { className: 'mt-1 font-bold', children: s.powerUnit }),
                        ],
                      }),
                      e.jsxs('div', {
                        children: [
                          e.jsx('dt', {
                            className: 'text-xs text-studio-400',
                            children: t === 'vi' ? 'Tay đua' : 'Drivers',
                          }),
                          e.jsx('dd', {
                            className: 'mt-1 space-y-1 font-bold',
                            children: s.drivers.map((i) =>
                              e.jsx('span', { className: 'block', children: i }, i),
                            ),
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'space-y-4',
                children: [
                  e.jsxs('div', {
                    children: [
                      e.jsx('p', {
                        className: 'text-xs font-bold uppercase tracking-widest text-f1red',
                        children: 'Engineering notes',
                      }),
                      e.jsx('h2', {
                        className: 'font-display text-2xl font-black uppercase sm:text-3xl',
                        children: t === 'vi' ? 'Điểm kỹ thuật' : 'Technical highlights',
                      }),
                    ],
                  }),
                  e.jsxs('div', {
                    className:
                      'divide-y divide-studio-200 rounded-2xl border border-studio-200 bg-white px-5 shadow-subtle',
                    children: [
                      h.map(([i, v]) =>
                        e.jsxs(
                          'div',
                          {
                            className: 'py-4',
                            children: [
                              e.jsx('h3', {
                                className:
                                  'text-xs font-black uppercase tracking-wide text-studio-500',
                                children: i,
                              }),
                              e.jsx('p', {
                                className: 'mt-1 text-sm leading-relaxed text-studio-800',
                                children: v,
                              }),
                            ],
                          },
                          i,
                        ),
                      ),
                      !h.length &&
                        e.jsx('p', {
                          className: 'py-4 text-sm text-studio-500',
                          children:
                            t === 'vi'
                              ? 'Chưa có ghi chú kỹ thuật đã xác minh.'
                              : 'No verified technical notes available.',
                        }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    });
  },
  n = ({ icon: l, label: c, value: t }) =>
    e.jsxs('div', {
      className: 'rounded-2xl border border-studio-200 bg-white p-5 shadow-subtle',
      children: [
        e.jsx('span', {
          className: 'flex h-9 w-9 items-center justify-center rounded-lg bg-f1red/10 text-f1red',
          children: N.cloneElement(l, { className: 'h-4 w-4' }),
        }),
        e.jsx('p', {
          className: 'mt-4 text-[10px] font-black uppercase tracking-widest text-studio-400',
          children: c,
        }),
        e.jsx('p', {
          className: 'mt-1 text-sm font-bold leading-relaxed text-studio-900',
          children: t,
        }),
      ],
    });
export { G as CarDetailPage };
