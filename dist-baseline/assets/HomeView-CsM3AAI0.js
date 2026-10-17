var de = Object.defineProperty;
var me = (t, s, a) =>
  s in t ? de(t, s, { enumerable: !0, configurable: !0, writable: !0, value: a }) : (t[s] = a);
var V = (t, s, a) => me(t, typeof s != 'symbol' ? s + '' : s, a);
import { R as ue, k as U, r as c, j as e } from './vendor-react-B62-MmwA.js';
import { u as L, t as xe, g as Q, C as A, D as pe, a as q, S as Z } from './index-C6BcaiY-.js';
import './circuitsData-CDnJ1HHt.js';
import { C as Y } from './ConstructorLogo-BPzo8jEn.js';
import { g as O } from './drivers-C2G4xaIm.js';
import {
  S as he,
  T as K,
  A as P,
  e as fe,
  C as ge,
  f as re,
  g as be,
  P as ve,
  h as we,
  i as Ne,
  j as je,
  B as ye,
} from './vendor-icons-Brb4Fsqu.js';
import { f as ke } from './dateUtils-C4Mh2J_m.js';
import { g as oe, a as G } from './raceSchedule-C_1d8gwS.js';
import { C as W } from './Card3DTilt-DK6ssBNb.js';
import { g as J } from './teamColors-B_bsvcV9.js';
import { g as ee } from './teamNames-Dn1_-17Y.js';
import './vendor-core-ckwbz45p.js';
const X = 0;
function te(t, s) {
  if (!Number.isInteger(t) || !Number.isInteger(s) || s <= 0) return [];
  const a = ((t % s) + s) % s;
  return [...new Set([(a - 1 + s) % s, a, (a + 1) % s])];
}
const T = [
    {
      id: 'sf26',
      name: 'Ferrari SF-26',
      shortName: 'SF-26',
      team: 'Ferrari',
      teamId: 'ferrari',
      watermark: 'FERRARI',
      color: '#dc0000',
      imageUrl: '/images/teams/sf24.webp',
      drivers: 'Charles Leclerc #16 · Lewis Hamilton #44',
    },
    {
      id: 'mcl40',
      name: 'McLaren MCL40',
      shortName: 'MCL40',
      team: 'McLaren',
      teamId: 'mclaren',
      watermark: 'MCLAREN',
      color: '#ff8000',
      imageUrl: '/images/teams/mcl38.webp',
      drivers: `Lando Norris #${O('norris')} · Oscar Piastri #${O('piastri')}`,
    },
    {
      id: 'rb22',
      name: 'Red Bull Racing RB22',
      shortName: 'RB22',
      team: 'Red Bull Racing',
      teamId: 'redbull',
      watermark: 'RED BULL',
      color: '#050f26',
      imageUrl: '/images/teams/rb20.webp',
      drivers: `Max Verstappen #${O('verstappen')} · Isack Hadjar #${O('hadjar')}`,
    },
    {
      id: 'w17',
      name: 'Mercedes-AMG F1 W17 E Performance',
      shortName: 'W17',
      team: 'Mercedes',
      teamId: 'mercedes',
      watermark: 'MERCEDES',
      color: '#c8ccce',
      imageUrl: '/images/teams/w15.webp',
      drivers: 'George Russell #63 · Kimi Antonelli #12',
    },
    {
      id: 'amr26',
      name: 'Aston Martin AMR26',
      shortName: 'AMR26',
      team: 'Aston Martin',
      teamId: 'astonmartin',
      watermark: 'ASTON MARTIN',
      color: '#00594f',
      imageUrl: '/images/teams/astonmartin.webp',
      drivers: 'Fernando Alonso #14 · Lance Stroll #18',
    },
    {
      id: 'a526',
      name: 'Alpine A526',
      shortName: 'A526',
      team: 'Alpine',
      teamId: 'alpine',
      watermark: 'ALPINE',
      color: '#0090ff',
      imageUrl: '/images/teams/alpine.webp',
      drivers: 'Pierre Gasly #10 · Franco Colapinto #43',
    },
    {
      id: 'vcarb03',
      name: 'Racing Bulls VCARB 03',
      shortName: 'VCARB 03',
      team: 'Racing Bulls',
      teamId: 'racingbulls',
      watermark: 'RACING BULLS',
      color: '#1634cb',
      imageUrl: '/images/teams/racingbulls.webp',
      drivers: 'Liam Lawson #30 · Arvid Lindblad #41',
    },
    {
      id: 'vf26',
      name: 'TGR Haas VF-26',
      shortName: 'VF-26',
      team: 'Haas',
      teamId: 'haas',
      watermark: 'HAAS',
      color: '#e5e7eb',
      imageUrl: '/images/teams/haas.webp',
      drivers: 'Esteban Ocon #31 · Oliver Bearman #87',
    },
    {
      id: 'fw48',
      name: 'Atlassian Williams FW48',
      shortName: 'FW48',
      team: 'Williams',
      teamId: 'williams',
      watermark: 'WILLIAMS',
      color: '#002447',
      imageUrl: '/images/teams/williams.webp',
      drivers: 'Carlos Sainz #55 · Alex Albon #23',
    },
    {
      id: 'audi-r26',
      name: 'Audi F1 R26 Factory Works',
      shortName: 'Audi R26',
      team: 'Audi',
      teamId: 'audi',
      watermark: 'AUDI F1',
      color: '#c4c8cc',
      imageUrl: '/images/teams/audi.webp',
      drivers: 'Nico Hülkenberg #27 · Gabriel Bortoleto #5',
    },
    {
      id: 'cadillac-mac26',
      name: 'Cadillac MAC-26',
      shortName: 'CADILLAC',
      team: 'Cadillac',
      teamId: 'cadillac',
      watermark: 'CADILLAC',
      color: '#d4af37',
      imageUrl: '/images/teams/cadillac.webp',
      drivers: 'Sergio Pérez #11 · Valtteri Bottas #77',
    },
  ],
  se = ({ children: t, className: s, onClick: a }) => {
    const i = c.useRef(null),
      [r, m] = c.useState({ x: 0, y: 0 }),
      d = (h) => {
        if (!i.current) return;
        const p = i.current.getBoundingClientRect(),
          N = p.left + p.width / 2,
          w = p.top + p.height / 2,
          v = (h.clientX - N) * 0.22,
          j = (h.clientY - w) * 0.22;
        m({ x: Math.max(-6, Math.min(6, v)), y: Math.max(-6, Math.min(6, j)) });
      },
      u = () => {
        m({ x: 0, y: 0 });
      };
    return e.jsx('button', {
      ref: i,
      onClick: a,
      onMouseMove: d,
      onMouseLeave: u,
      style: {
        transform: `translate(${r.x}px, ${r.y}px)`,
        transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
      },
      className: s,
      children: t,
    });
  },
  Ie = ue.memo(() => {
    const { lang: t } = L(),
      s = U(),
      a = xe[t].home,
      [i, r] = c.useState(null),
      m = c.useRef(null),
      d = c.useRef([]),
      [u, h] = c.useState(() => new Set(te(X, T.length))),
      p = i !== null,
      N = c.useCallback((l) => {
        h((b) => {
          const y = new Set(b);
          return (te(l, T.length).forEach((D) => y.add(D)), y.size === b.size ? b : y);
        });
      }, []),
      w = c.useCallback(
        (l) => {
          ((m.current = l), r(l), N(l));
        },
        [N],
      ),
      v = c.useCallback(() => {
        ((m.current = null), r(null));
      }, []),
      j = c.useCallback(
        (l) => {
          m.current === l ? v() : w(l);
        },
        [w, v],
      ),
      x = c.useRef(null),
      [n, f] = c.useState({ x: 0, y: 0, visible: !1 }),
      S = (l) => {
        if (!x.current) return;
        const b = x.current.getBoundingClientRect();
        f({ x: l.clientX - b.left, y: l.clientY - b.top, visible: !0 });
      },
      o = () => {
        f((l) => ({ ...l, visible: !1 }));
      },
      [g, I] = c.useState(null),
      M = (l) => {
        const b = l.currentTarget.getBoundingClientRect(),
          y = l.clientX - b.left,
          D = l.clientY - b.top,
          k = b.width / 2,
          C = b.height / 2,
          F = ((C - D) / C) * 5,
          ce = ((y - k) / k) * 5;
        I({ rotateX: F, rotateY: ce, glareX: (y / b.width) * 100, glareY: (D / b.height) * 100 });
      },
      le = () => {
        I(null);
      },
      $ = c.useRef(null),
      E = c.useRef(null),
      B = c.useRef(!1),
      _ = c.useCallback(() => {
        (E.current && clearInterval(E.current),
          (E.current = window.setInterval(() => {
            if (B.current) return;
            const l = m.current === null ? X : (m.current + 1) % T.length;
            w(l);
          }, 5e3)));
      }, [w]),
      R = c.useCallback(() => {
        ((B.current = !0),
          E.current && clearInterval(E.current),
          $.current && clearTimeout($.current),
          ($.current = window.setTimeout(() => {
            ((B.current = !1), _());
          }, 8e3)));
      }, [_]);
    return (
      c.useEffect(
        () => (
          ($.current = window.setTimeout(_, 8e3)),
          () => {
            ($.current && clearTimeout($.current), E.current && clearInterval(E.current));
          }
        ),
        [_],
      ),
      e.jsxs('div', {
        ref: x,
        onMouseMove: S,
        onMouseLeave: o,
        className:
          'relative w-full bg-[#050508] text-white pt-6 pb-10 overflow-hidden select-none border-b border-studio-800',
        children: [
          n.visible &&
            e.jsx('div', {
              'aria-hidden': 'true',
              className: 'absolute pointer-events-none z-[1] transition-opacity duration-200',
              style: {
                top: n.y - 250,
                left: n.x - 250,
                width: 500,
                height: 500,
                background:
                  'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 45%, transparent 70%)',
              },
            }),
          e.jsxs('div', {
            className:
              'absolute inset-y-0 right-0 w-2/3 pointer-events-none overflow-hidden z-0 motion-reduce:hidden',
            children: [
              e.jsx('div', {
                className:
                  'absolute top-1/4 right-1/4 w-[2px] h-[35vh] bg-gradient-to-b from-transparent via-white to-transparent transform -rotate-45 animate-speed-drift-1',
              }),
              e.jsx('div', {
                className:
                  'absolute top-1/3 right-1/2 w-[1.5px] h-[40vh] bg-gradient-to-b from-transparent via-white to-transparent transform -rotate-45 animate-speed-drift-2',
              }),
              e.jsx('div', {
                className:
                  'absolute top-1/2 right-1/6 w-[2px] h-[30vh] bg-gradient-to-b from-transparent via-white to-transparent transform -rotate-45 animate-speed-drift-3',
              }),
            ],
          }),
          e.jsxs('div', {
            className:
              'page-container mb-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 relative z-10',
            children: [
              e.jsxs('div', {
                className: 'space-y-2 max-w-xl',
                children: [
                  e.jsxs('div', {
                    className:
                      'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold uppercase tracking-widest text-f1red',
                    children: [
                      e.jsx('span', { className: 'w-2 h-2 rounded-full bg-f1red animate-pulse' }),
                      e.jsx('span', {
                        children:
                          t === 'vi'
                            ? '11 ĐỘI ĐUA 2026 · HÌNH ẢNH LƯU TRỮ'
                            : '11 TEAMS FOR 2026 · ARCHIVE IMAGERY',
                      }),
                    ],
                  }),
                  e.jsxs('h1', {
                    className:
                      'font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight',
                    children: [a.heroTitle1, ' · ', a.heroTitle2],
                  }),
                ],
              }),
              e.jsxs('div', {
                className: 'flex items-center gap-3 shrink-0 flex-wrap',
                children: [
                  e.jsxs(se, {
                    onClick: () => {
                      s('/showroom');
                    },
                    className:
                      'flex items-center gap-2 px-5 py-2.5 rounded-xl bg-f1red text-white text-xs font-bold uppercase tracking-wider hover:bg-f1red/90 shadow-lg hover:shadow-f1red/30 cursor-pointer',
                    children: [
                      e.jsx(he, { className: 'w-3.5 h-3.5' }),
                      e.jsx('span', {
                        children: t === 'vi' ? 'Khám Phá Showroom 3D' : 'Explore 3D Showroom',
                      }),
                    ],
                  }),
                  e.jsxs(se, {
                    onClick: () => {
                      s('/season/2026');
                    },
                    className:
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider border border-white/15 backdrop-blur-md cursor-pointer',
                    children: [
                      e.jsx(K, { className: 'w-3.5 h-3.5 text-amber-400' }),
                      e.jsx('span', { children: a.viewStandings }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'page-container relative z-10',
            children: [
              e.jsx('div', {
                onMouseLeave: () => {
                  (v(), R());
                },
                onMouseEnter: R,
                onTouchStart: R,
                className:
                  'relative w-full h-[560px] sm:h-[640px] lg:h-[700px] rounded-3xl overflow-hidden bg-[#07070b] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-row',
                children: T.map((l, b) => {
                  const y = b === i,
                    D = u.has(b);
                  return e.jsxs(
                    'div',
                    {
                      ref: (k) => {
                        d.current[b] = k;
                      },
                      tabIndex: b === (i ?? X) ? 0 : -1,
                      'aria-label': `${l.name} carousel panel`,
                      'aria-expanded': y,
                      onMouseEnter: () => {
                        (R(), w(b));
                      },
                      onMouseMove: y ? M : void 0,
                      onMouseLeave: () => {
                        y && le();
                      },
                      onClick: () => {
                        (R(), j(b));
                      },
                      onTouchEnd: (k) => {
                        (k.preventDefault(), R(), w(b));
                      },
                      onKeyDown: (k) => {
                        var F;
                        let C = null;
                        (k.key === 'ArrowRight' && (C = (b + 1) % T.length),
                          k.key === 'ArrowLeft' && (C = (b - 1 + T.length) % T.length),
                          k.key === 'Home' && (C = 0),
                          k.key === 'End' && (C = T.length - 1),
                          C !== null
                            ? (k.preventDefault(),
                              R(),
                              w(C),
                              (F = d.current[C]) == null || F.focus())
                            : (k.key === 'Enter' || k.key === ' ') &&
                              (k.preventDefault(), R(), j(b)));
                      },
                      style: {
                        flex: y ? 12 : 1,
                        transition:
                          y && g
                            ? 'flex 450ms cubic-bezier(0.25, 1, 0.5, 1)'
                            : 'flex 450ms cubic-bezier(0.25, 1, 0.5, 1), transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
                        transform:
                          y && g
                            ? `perspective(1000px) rotateX(${g.rotateX.toFixed(2)}deg) rotateY(${g.rotateY.toFixed(2)}deg)`
                            : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
                      },
                      className: `relative h-full overflow-hidden cursor-pointer select-none group border-r border-white/10 last:border-r-0 min-w-[28px] sm:min-w-[32px] ${y ? 'z-20 shadow-2xl' : 'z-10 hover:brightness-125'}`,
                      children: [
                        y &&
                          g &&
                          e.jsx('div', {
                            'aria-hidden': 'true',
                            className:
                              'absolute inset-0 pointer-events-none z-30 transition-opacity duration-300',
                            style: {
                              background: `radial-gradient(circle at ${g.glareX}% ${g.glareY}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
                            },
                          }),
                        e.jsxs('div', {
                          className: `absolute inset-0 flex flex-col justify-between items-center py-6 px-1 transition-opacity duration-300 pointer-events-none ${y ? 'opacity-0 pointer-events-none' : 'opacity-100'}`,
                          children: [
                            D &&
                              e.jsx('img', {
                                src: l.imageUrl,
                                alt: l.name,
                                className: `absolute inset-0 w-full h-full object-cover object-center filter contrast-125 group-hover:scale-110 transition-all duration-700 ${p ? 'brightness-[0.35]' : 'brightness-[0.45] group-hover:brightness-[0.7]'}`,
                                loading: 'lazy',
                                decoding: 'async',
                              }),
                            e.jsx('div', {
                              className:
                                'absolute inset-0 opacity-40 mix-blend-screen transition-opacity duration-300 group-hover:opacity-75',
                              style: {
                                background: `linear-gradient(to bottom, transparent 20%, ${l.color} 100%)`,
                              },
                            }),
                            e.jsx('div', {
                              className: `absolute inset-0 transition-colors ${p ? 'bg-black/40 group-hover:bg-black/10' : 'bg-black/35 group-hover:bg-black/10'}`,
                            }),
                            e.jsx('div', {
                              className: 'z-10 flex flex-col items-center',
                              children: e.jsx('div', {
                                className: `rounded-full shadow-sm transition-all duration-300 ${p ? 'w-1.5 h-8 group-hover:h-12' : 'w-2 h-7 group-hover:h-10'}`,
                                style: { backgroundColor: l.color },
                              }),
                            }),
                            e.jsx('div', {
                              className:
                                'z-10 flex flex-col items-center justify-center flex-1 my-auto',
                              children: e.jsx(Y, {
                                teamId: l.teamId,
                                size: 'lg',
                                className: `rounded-xl border border-white/10 bg-black/25 p-1.5 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.55)] transition-all duration-300 group-hover:border-white/30 group-hover:bg-black/45 ${p ? 'scale-[0.68] opacity-85 group-hover:scale-75 group-hover:opacity-100' : 'scale-100 opacity-100 group-hover:scale-110'}`,
                              }),
                            }),
                            e.jsxs('div', {
                              className: 'z-10 flex flex-col items-center gap-1.5 pb-2',
                              children: [
                                !p &&
                                  e.jsx('span', {
                                    className:
                                      'text-[10px] font-mono font-bold text-white/70 group-hover:text-white transition-colors',
                                    children: l.teamId.slice(0, 3).toUpperCase(),
                                  }),
                                e.jsx('span', {
                                  className:
                                    'w-2.5 h-2.5 rounded-full shadow-xs ring-2 ring-white/20 transition-transform group-hover:scale-125',
                                  style: { backgroundColor: l.color },
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs('div', {
                          className: `absolute inset-0 w-full h-full flex flex-col justify-between p-6 sm:p-10 transition-all duration-500 ${y ? 'opacity-100 pointer-events-auto delay-75 scale-100' : 'opacity-0 pointer-events-none scale-98'}`,
                          children: [
                            e.jsx('div', {
                              className:
                                'absolute inset-0 pointer-events-none opacity-30 transition-all duration-1000',
                              style: {
                                background: `radial-gradient(ellipse at 50% 50%, ${l.color} 0%, transparent 70%)`,
                              },
                            }),
                            e.jsx('div', {
                              className:
                                'absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0',
                              children: e.jsx('span', {
                                className:
                                  'font-display text-[12vw] font-black uppercase tracking-widest text-white/[0.04] whitespace-nowrap select-none',
                                children: l.watermark,
                              }),
                            }),
                            e.jsx('div', {
                              className:
                                'relative z-10 w-full flex-1 flex items-center justify-center my-auto',
                              children: e.jsxs('div', {
                                className:
                                  'relative w-full h-[300px] sm:h-[390px] lg:h-[450px] flex items-center justify-center',
                                children: [
                                  y &&
                                    e.jsx('img', {
                                      src: l.imageUrl,
                                      alt: l.name,
                                      className:
                                        'max-h-full max-w-full object-contain filter drop-shadow-[0_30px_45px_rgba(0,0,0,0.95)] hover:scale-102 transition-transform duration-500 ease-out animate-ken-burns',
                                      loading: 'lazy',
                                      decoding: 'async',
                                    }),
                                  e.jsx('div', {
                                    className:
                                      'absolute -bottom-6 w-3/4 h-12 rounded-full blur-2xl pointer-events-none opacity-50 transition-all duration-700',
                                    style: { backgroundColor: l.color },
                                  }),
                                ],
                              }),
                            }),
                            e.jsxs('div', {
                              className:
                                'relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-6 rounded-2xl border border-white/10 backdrop-blur-md',
                              children: [
                                e.jsxs('div', {
                                  className: 'space-y-1',
                                  children: [
                                    e.jsxs('div', {
                                      className: 'flex items-center gap-2',
                                      children: [
                                        e.jsx(Y, { teamId: l.teamId, size: 'sm' }),
                                        e.jsx('span', {
                                          className:
                                            'text-xs font-bold uppercase tracking-widest text-white/90',
                                          children: l.team,
                                        }),
                                      ],
                                    }),
                                    e.jsx('h2', {
                                      className:
                                        'font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none',
                                      children: l.name,
                                    }),
                                    e.jsx('p', {
                                      className:
                                        'text-xs sm:text-sm font-mono text-studio-300 font-medium pt-1',
                                      children: l.drivers,
                                    }),
                                  ],
                                }),
                                e.jsxs('button', {
                                  onClick: (k) => {
                                    (k.stopPropagation(),
                                      s(`/showroom?team=${l.teamId}`),
                                      window.scrollTo({ top: 0, behavior: 'smooth' }));
                                  },
                                  className:
                                    'flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-studio-950 hover:bg-white/90 text-xs font-black uppercase tracking-wider shadow-xl hover:scale-105 transition-all shrink-0 cursor-pointer',
                                  children: [
                                    e.jsx('span', {
                                      children: t === 'vi' ? 'Xem Showroom 3D' : 'View 3D Showroom',
                                    }),
                                    e.jsx(P, { className: 'w-4 h-4 text-f1red' }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    },
                    l.id,
                  );
                }),
              }),
              e.jsx('div', {
                className: 'flex items-center justify-center gap-2 mt-4 select-none',
                children: T.map((l, b) => {
                  const y = i === b;
                  return e.jsx(
                    'button',
                    {
                      onClick: () => {
                        (R(), w(b));
                      },
                      title: l.name,
                      'aria-label': `Select ${l.name}`,
                      className: `transition-all duration-300 rounded-full cursor-pointer ${y ? 'w-7 h-2 bg-f1red shadow-xs' : 'w-2 h-2 bg-white/20 hover:bg-white/50'}`,
                    },
                    l.id,
                  );
                }),
              }),
            ],
          }),
        ],
      })
    );
  });
class Se {
  constructor() {
    V(this, 'channel', null);
    V(this, 'handlers', new Map());
    if (typeof window < 'u' && typeof BroadcastChannel < 'u')
      try {
        ((this.channel = new BroadcastChannel('f1_tab_sync')),
          (this.channel.onmessage = (s) => {
            const { type: a, payload: i } = s.data || {};
            a && this.notify(a, i);
          }));
      } catch {}
    typeof window < 'u' &&
      window.addEventListener('storage', (s) => {
        if (s.key === 'f1_tab_sync_msg' && s.newValue)
          try {
            const { type: a, payload: i } = JSON.parse(s.newValue);
            a && this.notify(a, i);
          } catch {}
      });
  }
  broadcast(s, a) {
    if (this.channel)
      try {
        this.channel.postMessage({ type: s, payload: a, timestamp: Date.now() });
      } catch {}
    if (typeof window < 'u' && window.localStorage)
      try {
        window.localStorage.setItem(
          'f1_tab_sync_msg',
          JSON.stringify({ type: s, payload: a, timestamp: Date.now() }),
        );
      } catch {}
    this.notify(s, a);
  }
  subscribe(s, a) {
    return (
      this.handlers.has(s) || this.handlers.set(s, new Set()),
      this.handlers.get(s).add(a),
      () => {
        var i;
        (i = this.handlers.get(s)) == null || i.delete(a);
      }
    );
  }
  notify(s, a) {
    const i = this.handlers.get(s);
    i &&
      i.forEach((r) => {
        try {
          r(a);
        } catch (m) {
          console.error('[TabSync] Handler error', m);
        }
      });
  }
}
const Ce = new Se();
function Re(t) {
  let s = null,
    a = !0;
  const i = () => {
    if (!a) return;
    t();
    const m = Date.now(),
      d = Math.max(10, 1e3 - (m % 1e3));
    s = setTimeout(i, d);
  };
  t();
  const r = Math.max(10, 1e3 - (Date.now() % 1e3));
  return (
    (s = setTimeout(i, r)),
    () => {
      ((a = !1), s !== null && clearTimeout(s));
    }
  );
}
const ae = {
    fp1: { vi: 'Luyện Tập 1 (FP1)', en: 'Practice 1 (FP1)' },
    fp2: { vi: 'Luyện Tập 2 (FP2)', en: 'Practice 2 (FP2)' },
    fp3: { vi: 'Luyện Tập 3 (FP3)', en: 'Practice 3 (FP3)' },
    sprintQualifying: { vi: 'Phân Hạng Sprint', en: 'Sprint Qualifying' },
    sprint: { vi: 'Đua Sprint', en: 'Sprint Race' },
    qualifying: { vi: 'Phân Hạng', en: 'Qualifying' },
    race: { vi: 'Chặng Đua Chính', en: 'Grand Prix Race' },
  },
  z = {
    fp1: { vi: 'Luyện Tập 1', en: 'FP1' },
    fp2: { vi: 'Luyện Tập 2', en: 'FP2' },
    fp3: { vi: 'Luyện Tập 3', en: 'FP3' },
    sprintQualifying: { vi: 'Phân Hạng Sprint', en: 'Sprint Quali' },
    sprint: { vi: 'Sprint', en: 'Sprint' },
    qualifying: { vi: 'Phân Hạng', en: 'Qualifying' },
    race: { vi: 'Đua Chính', en: 'Grand Prix' },
  };
function Te(t, s) {
  const a = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Bangkok',
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(t),
    i = (m) => {
      var d;
      return ((d = a.find((u) => u.type === m)) == null ? void 0 : d.value) || '';
    },
    r = new Date(t.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }));
  return {
    day: s === 'vi' ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][r.getDay()] : i('weekday'),
    date: `${i('day')}/${i('month')}`,
    time: `${i('hour')}:${i('minute')}`,
  };
}
const ne = ({ digit: t }) =>
    e.jsx('span', {
      className:
        'relative inline-block overflow-hidden h-[1.15em] w-[0.62em] tabular-nums text-center',
      children: e.jsx(
        'span',
        { className: 'inline-block animate-digit-slide motion-reduce:animate-none', children: t },
        t,
      ),
    }),
  H = ({ value: t, label: s }) => {
    const a = Math.max(0, t).toString().padStart(2, '0'),
      i = a[0],
      r = a[1];
    return e.jsxs('div', {
      className: 'flex flex-col items-center',
      children: [
        e.jsxs('div', {
          className:
            'flex items-center text-3xl sm:text-4xl lg:text-[42px] font-mono font-bold text-studio-950 tracking-tight leading-none tabular-nums',
          children: [e.jsx(ne, { digit: i }), e.jsx(ne, { digit: r })],
        }),
        e.jsx('span', {
          className:
            'text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] text-studio-500 mt-1',
          children: s,
        }),
      ],
    });
  },
  Ae = ({ race: t }) => {
    const { lang: s } = L(),
      a = U(),
      [i, r] = c.useState(() => Date.now()),
      m = c.useMemo(
        () =>
          Object.keys(t.sessions)
            .flatMap((o) => {
              const g = oe(t, o);
              return g
                ? [
                    {
                      id: o,
                      nameVi: ae[o].vi,
                      nameEn: ae[o].en,
                      startIso: g.start.toISOString(),
                      endIso: g.end.toISOString(),
                    },
                  ]
                : [];
            })
            .sort((o, g) => o.startIso.localeCompare(g.startIso)),
        [t],
      );
    c.useEffect(() => {
      const o = Re(() => {
          r(Date.now());
        }),
        g = () => {
          document.visibilityState === 'visible' && r(Date.now());
        };
      document.addEventListener('visibilitychange', g);
      const I = Ce.subscribe('countdown_sync', () => {
        r(Date.now());
      });
      return () => {
        (o(), document.removeEventListener('visibilitychange', g), I());
      };
    }, []);
    let d = 'finished',
      u = null,
      h = null,
      p;
    {
      const o = m.find((g) => {
        const I = new Date(g.startIso).getTime(),
          M = new Date(g.endIso).getTime();
        return i >= I && i <= M;
      });
      if (o) ((d = 'live'), (u = o), (h = null), (p = 0));
      else {
        const g = m.find((I) => i < new Date(I.startIso).getTime());
        if (g) {
          const M = new Date(g.startIso).getTime() - i;
          ((d = 'upcoming'), (u = null), (h = g), (p = Math.max(0, M)));
        } else ((d = 'finished'), (u = null), (h = null), (p = 0));
      }
    }
    const N = Math.floor(p / 1e3),
      w = Math.floor(N / (3600 * 24)),
      v = Math.floor((N % (3600 * 24)) / 3600),
      j = Math.floor((N % 3600) / 60),
      x = N % 60,
      n = d === 'live',
      f = m.map((o) => ({ ...o, local: Te(new Date(o.startIso), s) })),
      S = (u == null ? void 0 : u.id) === 'race' && i < new Date(u.endIso).getTime();
    return e.jsx('section', {
      className: 'page-container select-none',
      children: e.jsxs(W, {
        maxTilt: 3,
        glareOpacity: 0.12,
        className:
          'p-6 sm:p-8 rounded-3xl bg-white border border-studio-200 transition-all duration-500 relative overflow-hidden flex flex-col gap-8 shadow-subtle',
        children: [
          e.jsx('div', {
            'aria-hidden': 'true',
            className:
              'absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none animate-scanline-sweep z-20',
          }),
          e.jsx('div', {
            className: 'absolute top-0 left-0 w-2.5 h-full bg-f1red transition-colors duration-500',
          }),
          e.jsxs('div', {
            className:
              'flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 pl-2 relative z-10',
            children: [
              e.jsxs('div', {
                className: 'space-y-2.5 max-w-xl',
                children: [
                  e.jsxs('div', {
                    className: 'flex items-center gap-2',
                    children: [
                      e.jsx('span', {
                        className: `px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-500 ${n ? 'bg-f1red text-white animate-live-glow scale-105 shadow-md shadow-f1red/30' : 'bg-f1red/10 text-f1red'}`,
                        children: n
                          ? S
                            ? s === 'vi'
                              ? '● ĐUA CHÍNH ĐANG DIỄN RA'
                              : '● MAIN RACE IN PROGRESS'
                            : s === 'vi'
                              ? '● ĐANG DIỄN RA'
                              : '● SESSION IN PROGRESS'
                          : s === 'vi'
                            ? `Chặng ${t.round} · Tuần Lễ Thi Đấu`
                            : `Round ${t.round} · Active Race Weekend`,
                      }),
                      e.jsx('span', {
                        className: 'text-xs text-studio-500 font-semibold',
                        children: t.country,
                      }),
                    ],
                  }),
                  e.jsx('h2', {
                    className:
                      'font-display text-2xl sm:text-3xl lg:text-4xl font-black uppercase text-studio-950 tracking-tight leading-tight',
                    children: t.name,
                  }),
                  e.jsxs('div', {
                    className:
                      'flex flex-wrap items-center gap-4 text-xs text-studio-600 font-medium pt-0.5',
                    children: [
                      e.jsxs('span', {
                        className: 'flex items-center gap-1.5',
                        children: [e.jsx(fe, { className: 'w-4 h-4 text-f1red' }), ' ', t.circuit],
                      }),
                      e.jsxs('span', {
                        className: 'flex items-center gap-1.5',
                        children: [
                          e.jsx(ge, { className: 'w-4 h-4 text-f1red' }),
                          ' ',
                          ke(t.dates, s),
                        ],
                      }),
                      e.jsx('span', { className: 'text-studio-300', children: '|' }),
                      e.jsxs('span', {
                        className: 'inline-flex flex-wrap items-center gap-x-1.5',
                        children: [
                          e.jsx('span', { children: t.laps }),
                          e.jsx('span', { children: s === 'vi' ? 'Vòng' : 'Laps' }),
                          e.jsxs('span', { children: ['(', t.raceDistanceKm, ' km)'] }),
                        ],
                      }),
                      e.jsx('span', { className: 'text-studio-300', children: '|' }),
                      e.jsx('span', {
                        className: 'text-studio-500 font-mono text-[11px]',
                        children: s === 'vi' ? 'Việt Nam (UTC+7)' : 'Vietnam (UTC+7)',
                      }),
                    ],
                  }),
                  e.jsxs('div', {
                    className: 'pt-2 max-w-md space-y-1.5',
                    children: [
                      e.jsxs('div', {
                        className:
                          'flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-studio-400',
                        children: [
                          e.jsx('span', {
                            children: s === 'vi' ? 'Tiến trình tuần đua' : 'Weekend Progress',
                          }),
                          e.jsxs('span', {
                            className: 'text-f1red font-semibold',
                            children: [
                              m.filter((o) => i > new Date(o.endIso).getTime()).length,
                              ' /',
                              ' ',
                              m.length,
                            ],
                          }),
                        ],
                      }),
                      e.jsx('div', {
                        className: 'grid grid-cols-5 gap-1.5 h-1.5 w-full',
                        children: m.map((o) => {
                          const g = i > new Date(o.endIso).getTime(),
                            I =
                              (d === 'live' && (u == null ? void 0 : u.id) === o.id) ||
                              (d === 'upcoming' && (h == null ? void 0 : h.id) === o.id);
                          return e.jsx(
                            'div',
                            {
                              title: `${o.nameVi} · ${o.startIso}`,
                              className: `h-full rounded-full transition-all duration-300 ${g ? 'bg-f1red shadow-xs' : I ? 'bg-f1red animate-pulse ring-2 ring-f1red/30' : 'bg-studio-200'}`,
                            },
                            o.id,
                          );
                        }),
                      }),
                      e.jsx('div', {
                        className:
                          'grid grid-cols-5 text-[9px] text-center font-bold text-studio-400',
                        children: f.map((o) =>
                          e.jsx('span', { children: s === 'vi' ? z[o.id].vi : z[o.id].en }, o.id),
                        ),
                      }),
                    ],
                  }),
                ],
              }),
              n &&
                u &&
                e.jsxs('div', {
                  className:
                    'flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-studio-50 border border-studio-200 p-4 sm:p-5 rounded-2xl animate-fade-in',
                  children: [
                    e.jsxs('div', {
                      className: 'space-y-1',
                      children: [
                        e.jsxs('div', {
                          className: 'flex items-center gap-2',
                          children: [
                            e.jsx('span', {
                              className: 'w-2.5 h-2.5 rounded-full bg-f1red animate-ping',
                            }),
                            e.jsx('span', {
                              className:
                                'font-display text-base sm:text-lg font-black uppercase text-f1red tracking-wide',
                              children: s === 'vi' ? u.nameVi : u.nameEn,
                            }),
                          ],
                        }),
                        e.jsx('p', {
                          className: 'text-xs text-studio-600 font-medium',
                          children: S
                            ? s === 'vi'
                              ? 'Cuộc đua chính đang diễn ra · Kết quả sẽ được cập nhật sau phiên'
                              : 'Main race in progress · Results update after the session'
                            : s === 'vi'
                              ? 'Phiên đang diễn ra theo lịch · Kết quả cập nhật sau phiên'
                              : 'Scheduled session in progress · Results available after the session',
                        }),
                      ],
                    }),
                    e.jsxs('button', {
                      onClick: () => a(`/season/${t.season}?tab=results`),
                      className:
                        'group flex items-center gap-2 px-5 py-3 rounded-full bg-studio-950 hover:bg-f1red text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 shadow-md cursor-pointer shrink-0',
                      children: [
                        e.jsx(re, { className: 'w-4 h-4 text-white animate-pulse' }),
                        e.jsx('span', { children: s === 'vi' ? 'Xem kết quả' : 'View results' }),
                        e.jsx(P, {
                          className: 'w-3.5 h-3.5 group-hover:translate-x-1 transition-transform',
                        }),
                      ],
                    }),
                  ],
                }),
              d === 'upcoming' &&
                h &&
                e.jsxs('div', {
                  className:
                    'flex flex-col items-start lg:items-end gap-2 bg-studio-50/80 border border-studio-200/80 p-4 sm:p-5 rounded-2xl',
                  children: [
                    e.jsxs('div', {
                      className:
                        'flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-f1red',
                      children: [
                        e.jsx('span', { className: 'w-2 h-2 rounded-full bg-f1red animate-pulse' }),
                        e.jsx('span', {
                          children:
                            s === 'vi' ? `${h.nameVi} Bắt Đầu Sau:` : `${h.nameEn} Starts In:`,
                        }),
                      ],
                    }),
                    e.jsxs('div', {
                      className: 'grid grid-cols-4 sm:flex items-center gap-2 sm:gap-3 mt-1',
                      children: [
                        e.jsx(H, { value: w, label: s === 'vi' ? 'Ngày' : 'Days' }),
                        e.jsx('span', {
                          className:
                            'text-2xl sm:text-3xl font-mono font-bold text-studio-400 self-start mt-1 animate-colon-pulse',
                          children: ':',
                        }),
                        e.jsx(H, { value: v, label: s === 'vi' ? 'Giờ' : 'Hours' }),
                        e.jsx('span', {
                          className:
                            'text-2xl sm:text-3xl font-mono font-bold text-studio-400 self-start mt-1 animate-colon-pulse',
                          children: ':',
                        }),
                        e.jsx(H, { value: j, label: s === 'vi' ? 'Phút' : 'Mins' }),
                        e.jsx('span', {
                          className:
                            'text-2xl sm:text-3xl font-mono font-bold text-studio-400 self-start mt-1 animate-colon-pulse',
                          children: ':',
                        }),
                        e.jsx(H, { value: x, label: s === 'vi' ? 'Giây' : 'Secs' }),
                      ],
                    }),
                  ],
                }),
              d === 'finished' &&
                e.jsxs('div', {
                  className:
                    'flex items-center gap-4 bg-studio-50 border border-studio-200 p-4 sm:p-5 rounded-2xl',
                  children: [
                    e.jsxs('div', {
                      className: 'flex items-center gap-2.5',
                      children: [
                        e.jsx(be, { className: 'w-5 h-5 text-emerald-600' }),
                        e.jsxs('div', {
                          children: [
                            e.jsx('span', {
                              className:
                                'font-display text-sm font-bold uppercase text-studio-950 block',
                              children:
                                s === 'vi' ? 'Chặng Đua Đã Kết Thúc' : 'Grand Prix Concluded',
                            }),
                            e.jsx('span', {
                              className: 'text-xs text-studio-500',
                              children:
                                s === 'vi'
                                  ? 'Đầy đủ kết quả đã được ghi nhận'
                                  : 'All race results archived',
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs('button', {
                      onClick: () => a(`/season/${t.season}?tab=results`),
                      className:
                        'flex items-center gap-2 px-4 py-2.5 rounded-xl bg-studio-900 hover:bg-f1red text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer',
                      children: [
                        e.jsx(K, { className: 'w-3.5 h-3.5 text-amber-400' }),
                        e.jsx('span', { children: s === 'vi' ? 'Xem Kết Quả' : 'View Results' }),
                      ],
                    }),
                  ],
                }),
            ],
          }),
          e.jsxs('div', {
            className:
              'pt-4 border-t border-studio-100 flex flex-wrap items-center justify-between gap-3 pl-2',
            children: [
              e.jsx('div', {
                className: 'flex items-center gap-2.5 flex-wrap',
                children: f.map((o) => {
                  const g = s === 'vi' ? z[o.id].vi : z[o.id].en,
                    I = o.id === 'race',
                    M = o.id === 'sprint';
                  return e.jsxs(
                    'div',
                    {
                      className: `p-2.5 sm:p-3 rounded-xl border text-center min-w-[95px] sm:min-w-[105px] ${I ? 'bg-studio-900 border-studio-900 text-white shadow-sm' : 'bg-studio-50 border-studio-200'}`,
                      children: [
                        e.jsx('span', {
                          className: `text-[10px] uppercase font-bold block ${I ? 'text-amber-400' : M ? 'text-amber-600' : 'text-studio-400'}`,
                          children: g,
                        }),
                        e.jsxs('span', {
                          className: `text-xs font-bold block ${I ? 'text-white' : 'text-studio-900'}`,
                          children: [o.local.day, ' · ', o.local.date],
                        }),
                        e.jsxs('span', {
                          className: `inline-flex items-center gap-1 text-[10px] font-mono ${I ? 'text-studio-300' : 'text-studio-500'}`,
                          children: [
                            e.jsx('span', { children: o.local.time }),
                            e.jsx('span', { children: 'UTC+7' }),
                          ],
                        }),
                      ],
                    },
                    o.id,
                  );
                }),
              }),
              e.jsxs('button', {
                onClick: () => a(`/season/${t.season}?tab=calendar`),
                className:
                  'px-4 py-2.5 rounded-xl border border-studio-300 hover:border-f1red text-studio-700 hover:text-f1red transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer ml-auto',
                children: [
                  e.jsx('span', {
                    children:
                      s === 'vi'
                        ? `Lịch ${Q(t.season).length} Chặng Chi Tiết`
                        : `${Q(t.season).length}-Race Calendar`,
                  }),
                  e.jsx(P, { className: 'w-3.5 h-3.5' }),
                ],
              }),
            ],
          }),
        ],
      }),
    });
  },
  Me = () => {
    var j;
    const { lang: t } = L(),
      s = U(),
      [a, i] = c.useState(!0),
      [r, m] = c.useState(() => Date.now());
    c.useEffect(() => {
      const x = window.setInterval(() => m(Date.now()), 6e4);
      return () => window.clearInterval(x);
    }, []);
    const d = A.flatMap((x) =>
        Object.keys(x.sessions).flatMap((n) => {
          const f = oe(x, n),
            S = x.sessions[n];
          return f && S && f.start.getTime() > r
            ? [{ race: x, session: S, sessionKey: n, start: f.start }]
            : [];
        }),
      ).sort((x, n) => x.start.getTime() - n.start.getTime())[0],
      u = A.filter((x) => G(x, r) === 'completed').length,
      h = (j = pe.find((x) => x.driverId === 'antonelli')) == null ? void 0 : j.points,
      p = d
        ? new Intl.DateTimeFormat(t === 'vi' ? 'vi-VN' : 'en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
          }).format(d.start)
        : '',
      N = {
        fp1: 'FP1',
        fp2: 'FP2',
        fp3: 'FP3',
        sprintQualifying: 'SPRINT QUALI',
        sprint: 'SPRINT',
        qualifying: 'QUALIFYING',
        race: 'RACE',
      },
      w = d == null ? void 0 : d.race.name.replace(' Grand Prix', ' GP'),
      v = [
        {
          badge: d ? (t === 'vi' ? 'SẮP DIỄN RA' : 'NEXT UP') : t === 'vi' ? 'MÙA GIẢI' : 'SEASON',
          text:
            d && w
              ? t === 'vi'
                ? `CHẶNG ${d.race.round} ${w.toUpperCase()} · ${N[d.sessionKey]} ${p} GIỜ VIỆT NAM`
                : `ROUND ${d.race.round} ${w.toUpperCase()} · ${N[d.sessionKey]} ${p} VIETNAM TIME`
              : t === 'vi'
                ? 'MÙA GIẢI ĐÃ KẾT THÚC'
                : 'SEASON COMPLETE',
          link: '/season/2026?tab=calendar',
        },
        {
          badge: t === 'vi' ? 'KẾT QUẢ' : 'LATEST',
          text:
            t === 'vi'
              ? 'CHẶNG 17 SINGAPORE GP: VERSTAPPEN P1 · LECLERC P2 · ANTONELLI P3'
              : 'ROUND 17 SINGAPORE GP: VERSTAPPEN P1 · LECLERC P2 · ANTONELLI P3',
          link: '/season/2026?tab=results',
        },
        {
          badge: t === 'vi' ? 'TIẾN TRÌNH' : 'PROGRESS',
          text:
            t === 'vi'
              ? `MÙA GIẢI F1 2026: ${u} / ${A.length} CHẶNG ĐÃ HOÀN THÀNH`
              : `2026 FIA F1 SEASON: ${u} OF ${A.length} ROUNDS COMPLETED`,
          link: '/season/2026?tab=calendar',
        },
        {
          badge: t === 'vi' ? 'DẪN ĐẦU' : 'LEADER',
          text:
            t === 'vi'
              ? `BẢNG XẾP HẠNG TAY ĐUA: ANTONELLI (MERCEDES) ${h} ĐIỂM`
              : `DRIVERS CLASSIFICATION: ANTONELLI (MERCEDES) ${h} PTS`,
          link: '/season/2026?tab=drivers',
        },
      ];
    return e.jsxs('div', {
      className:
        'w-full h-9 bg-[#050508] border-b border-white/10 overflow-hidden flex items-center select-none text-white relative z-40',
      children: [
        e.jsxs('div', {
          className: 'h-full px-3 bg-f1red flex items-center gap-2 shrink-0 z-20 shadow-md',
          children: [
            e.jsx(re, { className: 'w-3.5 h-3.5 text-white animate-pulse' }),
            e.jsx('span', {
              className: 'font-display font-black text-[11px] tracking-widest uppercase text-white',
              children: 'F1 FEED',
            }),
            e.jsx('button', {
              type: 'button',
              onClick: () => i((x) => !x),
              className:
                'ml-0.5 p-1 rounded hover:bg-black/25 text-white/90 hover:text-white transition-colors cursor-pointer',
              title: a
                ? t === 'vi'
                  ? 'Tạm dừng chạy chữ'
                  : 'Pause ticker'
                : t === 'vi'
                  ? 'Tiếp tục chạy chữ'
                  : 'Resume ticker',
              'aria-label': a ? 'Pause feed' : 'Resume feed',
              children: a
                ? e.jsx(ve, { className: 'w-2.5 h-2.5' })
                : e.jsx(we, { className: 'w-2.5 h-2.5' }),
            }),
          ],
        }),
        e.jsx('div', {
          className: 'flex-1 overflow-hidden relative h-full flex items-center',
          children: e.jsx('div', {
            style: { animationPlayState: a ? 'running' : 'paused' },
            className:
              'flex shrink-0 w-max items-center whitespace-nowrap animate-ticker-marquee will-change-transform hover:[animation-play-state:paused]',
            children: [...v, ...v, ...v, ...v].map((x, n) =>
              e.jsxs(
                'div',
                {
                  onClick: () => x.link && s(x.link),
                  className:
                    'inline-flex shrink-0 items-center text-xs tracking-wider font-semibold cursor-pointer group px-2 py-1',
                  children: [
                    e.jsx('span', {
                      className:
                        'px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-bold text-amber-400 mr-2 group-hover:bg-amber-400 group-hover:text-black transition-colors',
                      children: x.badge,
                    }),
                    e.jsx('span', {
                      className: 'text-studio-200 group-hover:text-white transition-colors',
                      children: x.text,
                    }),
                    e.jsx('span', {
                      className: 'text-f1red font-black px-4 select-none tracking-widest',
                      children: '///',
                    }),
                  ],
                },
                n,
              ),
            ),
          }),
        }),
      ],
    });
  };
function Ee(t, s = 1200, a = !0) {
  const [i, r] = c.useState(a ? 0 : t),
    [m, d] = c.useState(!a),
    u = c.useRef(!1);
  return (
    c.useEffect(() => {
      if (!a || u.current) {
        (r(t), d(!0));
        return;
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        (r(t), d(!0), (u.current = !0));
        return;
      }
      u.current = !0;
      let h = null,
        p;
      const N = (w) => {
        h || (h = w);
        const v = w - h,
          j = Math.min(1, v / s),
          x = j === 1 ? 1 : 1 - Math.pow(2, -10 * j),
          n = Math.round(x * t);
        (r(n), j < 1 ? (p = requestAnimationFrame(N)) : (r(t), d(!0)));
      };
      return ((p = requestAnimationFrame(N)), () => cancelAnimationFrame(p));
    }, [t, s, a]),
    { value: i, isDone: m }
  );
}
const ie = ({
  rank: t,
  name: s,
  subName: a,
  flag: i,
  teamId: r,
  teamColor: m,
  points: d,
  wins: u,
  podiums: h,
  inView: p,
  lang: N,
  onClick: w,
  actionButton: v,
}) => {
  const [j, x] = c.useState(!1),
    { value: n, isDone: f } = Ee(d, 1200, p);
  return e.jsxs('div', {
    onClick: w,
    onMouseEnter: () => x(!0),
    onMouseLeave: () => x(!1),
    style: {
      borderColor: j ? `${m}90` : `${m}40`,
      boxShadow: j ? `0 10px 25px -5px ${m}33` : void 0,
    },
    className:
      'flex items-center justify-between p-3 sm:p-3.5 rounded-xl bg-studio-50 border hover:bg-white hover:-translate-y-1 transition-all duration-300 cursor-pointer group select-none relative overflow-hidden',
    children: [
      e.jsx('div', {
        'aria-hidden': 'true',
        className: `absolute inset-0 pointer-events-none origin-left transition-all ${j ? 'scale-x-100 opacity-15' : 'scale-x-0 opacity-0'}`,
        style: {
          backgroundColor: m,
          transitionDuration: '350ms',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        },
      }),
      e.jsxs('div', {
        className: 'flex items-center gap-3 relative z-10 min-w-0',
        children: [
          e.jsx('span', {
            className: `w-6 h-6 rounded-full flex items-center justify-center font-display font-black text-xs shrink-0 ${t === 1 ? 'bg-amber-400 text-black shadow-xs ring-2 ring-amber-400/30' : t === 2 ? 'bg-studio-300 text-studio-900' : 'bg-amber-700 text-white'}`,
            children: t,
          }),
          e.jsxs('div', {
            className: 'min-w-0',
            children: [
              e.jsxs('div', {
                className: 'flex items-center gap-1.5 flex-wrap',
                children: [
                  e.jsx('span', {
                    className: 'font-bold text-sm block truncate group-hover:underline',
                    style: { color: m },
                    children: s,
                  }),
                  i && e.jsx('span', { className: 'text-xs', title: i, children: i }),
                ],
              }),
              a &&
                e.jsxs('div', {
                  className: 'flex items-center gap-1.5 mt-0.5',
                  children: [
                    e.jsx('div', {
                      className: 'group-hover:scale-105 transition-transform duration-300 shrink-0',
                      children: e.jsx(Y, { teamId: r, size: 'sm' }),
                    }),
                    e.jsx('span', {
                      className: 'text-xs font-semibold truncate text-studio-600 block',
                      children: a,
                    }),
                  ],
                }),
            ],
          }),
        ],
      }),
      e.jsxs('div', {
        className: 'flex items-center gap-3 shrink-0 relative z-10 pl-2',
        children: [
          e.jsxs('div', {
            className: 'text-right',
            children: [
              e.jsxs('span', {
                className: `inline-flex items-baseline justify-end gap-1 font-display font-black text-base text-studio-950 tabular-nums leading-none ${t === 1 && f ? 'animate-champion-flash text-amber-500' : ''} ${j ? 'animate-score-flicker' : ''}`,
                children: [
                  n,
                  e.jsx('span', {
                    className: 'text-xs font-sans text-studio-500',
                    children: N === 'vi' ? 'ĐIỂM' : 'PTS',
                  }),
                ],
              }),
              e.jsx('span', {
                className: 'text-[10px] text-studio-400 block mt-1',
                children:
                  N === 'vi'
                    ? `${u} chiến thắng · ${h} lần lên bục`
                    : `${u} ${u === 1 ? 'win' : 'wins'} · ${h} ${h === 1 ? 'podium' : 'podiums'}`,
              }),
            ],
          }),
          v,
        ],
      }),
    ],
  });
};
function $e(t = 0.15) {
  const s = c.useRef(null),
    [a, i] = c.useState(!1);
  return (
    c.useEffect(() => {
      const r = s.current;
      if (!r) return;
      if (typeof IntersectionObserver > 'u') {
        i(!0);
        return;
      }
      const m = new IntersectionObserver(
        ([d]) => {
          d.isIntersecting && (i(!0), m.unobserve(r));
        },
        { threshold: t },
      );
      return (m.observe(r), () => m.disconnect());
    }, [t]),
    { ref: s, isRevealed: a }
  );
}
const De = () => {
    const t = L((a) => a.lang),
      s = () => {
        var a;
        (a = document.getElementById('official-grid')) == null ||
          a.scrollIntoView({ behavior: 'smooth' });
      };
    return e.jsxs('section', {
      className:
        'podium-hero relative isolate min-h-[620px] h-[calc(100svh-64px)] max-h-[920px] overflow-hidden bg-[#050507] text-white',
      'aria-labelledby': 'podium-hero-title',
      children: [
        e.jsx('img', {
          src: '/images/podium-diffuser-hero-v2.webp',
          alt: '',
          'aria-hidden': 'true',
          width: 2172,
          height: 724,
          className:
            'absolute inset-0 h-full w-full object-cover object-[50%_60%] podium-hero-image',
          fetchpriority: 'high',
          decoding: 'async',
        }),
        e.jsx('div', {
          className:
            'absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,6,0.28)_0%,rgba(4,4,6,0.01)_38%,rgba(4,4,6,0.08)_72%,rgba(4,4,6,0.72)_100%)]',
        }),
        e.jsx('div', {
          className:
            'absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_38%,rgba(2,2,4,0.3)_100%)]',
        }),
        e.jsx('div', {
          className: 'absolute left-6 right-6 top-8 z-10 h-px bg-white/20 md:left-12 md:right-12',
          children: e.jsx('span', {
            className:
              'absolute left-[8%] top-0 h-px w-32 bg-f1red shadow-[0_0_12px_rgba(225,6,0,0.8)]',
          }),
        }),
        e.jsx('div', {
          className:
            'absolute bottom-16 left-6 right-6 z-10 h-px bg-white/35 md:left-12 md:right-12',
          children: e.jsx('span', {
            className:
              'absolute right-[4%] top-0 h-px w-36 bg-f1red shadow-[0_0_12px_rgba(225,6,0,0.8)]',
          }),
        }),
        e.jsxs('div', {
          className:
            'page-container relative z-20 flex h-full flex-col justify-between py-16 md:py-20',
          children: [
            e.jsxs('div', {
              className:
                'flex items-center justify-between gap-6 text-[9px] font-bold uppercase tracking-[0.32em] text-white/70 [text-shadow:0_2px_8px_rgba(0,0,0,0.95)] md:text-[10px]',
              children: [
                e.jsx('span', { children: 'Ground effect archive' }),
                e.jsx('span', {
                  className: 'hidden sm:block',
                  children: 'Aerodynamics · Telemetry · Heritage',
                }),
                e.jsx('span', { children: 'MMXXVI' }),
              ],
            }),
            e.jsxs('div', {
              className: 'relative flex flex-1 items-center py-10',
              children: [
                e.jsx('h1', {
                  id: 'podium-hero-title',
                  className: 'sr-only',
                  children: 'PODIUM — Effet de Sol',
                }),
                e.jsxs('div', {
                  className: 'podium-copy podium-copy-left absolute left-0 top-[17%] md:top-[23%]',
                  children: [
                    e.jsx('span', {
                      className:
                        'mb-3 block text-[9px] font-bold uppercase tracking-[0.42em] text-[#ff3028] [text-shadow:0_2px_8px_rgba(0,0,0,1)] md:text-[10px]',
                      children: t === 'vi' ? 'Tốc độ được điêu khắc' : 'Speed, sculpted',
                    }),
                    e.jsx('p', {
                      className:
                        'podium-metal-text font-display text-[clamp(4.3rem,11.2vw,11.5rem)] font-semibold uppercase leading-[0.73] tracking-[-0.065em]',
                      children: 'Podium',
                    }),
                    e.jsx('span', {
                      className:
                        'mt-6 block h-[2px] w-32 bg-f1red shadow-[0_0_18px_rgba(225,6,0,0.7)] md:w-44',
                    }),
                  ],
                }),
                e.jsxs('div', {
                  className:
                    'podium-copy podium-copy-right absolute bottom-[15%] right-0 text-right md:bottom-[18%]',
                  children: [
                    e.jsx('span', {
                      className:
                        'mb-3 block text-[9px] font-bold uppercase tracking-[0.42em] text-white/80 [text-shadow:0_2px_8px_rgba(0,0,0,1)] md:text-[10px]',
                      children: t === 'vi' ? 'Nghệ thuật của lực ép' : 'The art of downforce',
                    }),
                    e.jsxs('p', {
                      className:
                        'podium-metal-text font-display text-[clamp(3rem,6.4vw,7.2rem)] font-semibold uppercase leading-[0.78] tracking-[-0.055em]',
                      children: ['Effet', e.jsx('br', {}), 'de Sol'],
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs('div', {
              className: 'flex items-end justify-between gap-6',
              children: [
                e.jsx('p', {
                  className:
                    'max-w-[28rem] text-[10px] font-semibold uppercase leading-relaxed tracking-[0.25em] text-white/70 [text-shadow:0_2px_8px_rgba(0,0,0,1)] sm:text-xs',
                  children:
                    t === 'vi'
                      ? 'Khám phá nơi không khí, carbon và tốc độ hội tụ.'
                      : 'Where airflow, carbon and speed converge.',
                }),
                e.jsxs('button', {
                  type: 'button',
                  onClick: s,
                  className:
                    'group flex shrink-0 items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/90 [text-shadow:0_2px_8px_rgba(0,0,0,1)] transition-colors hover:text-white',
                  children: [
                    e.jsx('span', {
                      className: 'hidden sm:inline',
                      children: t === 'vi' ? 'Khám phá' : 'Explore',
                    }),
                    e.jsx('span', {
                      className:
                        'flex h-10 w-10 items-center justify-center rounded-full border border-white/25 transition-all group-hover:border-f1red group-hover:bg-f1red',
                      children: e.jsx(Ne, { className: 'h-4 w-4' }),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
  Pe = () => {
    const t = c.useRef(null),
      [s, a] = c.useState(!1);
    return (
      c.useEffect(() => {
        const i = t.current;
        if (!i) return;
        const r = new IntersectionObserver(
          ([m]) => {
            m.isIntersecting && (a(!0), r.disconnect());
          },
          { rootMargin: '300px 0px' },
        );
        return (r.observe(i), () => r.disconnect());
      }, []),
      e.jsx('div', {
        ref: t,
        className: 'min-h-[560px] sm:min-h-[640px] lg:min-h-[700px]',
        children: s
          ? e.jsx(Ie, {})
          : e.jsx('div', { className: 'h-full bg-[#050508]', 'aria-hidden': 'true' }),
      })
    );
  },
  Ke = () => {
    const { lang: t } = L(),
      s = U(),
      { selectedSeason: a, calculatedStandings: i } = q(),
      [r, m] = c.useState(a || 2026),
      { ref: d, isRevealed: u } = $e(0.15),
      h = q((n) => {
        var f;
        return (f = n.detailedResults) == null ? void 0 : f[2026];
      }),
      [p, N] = c.useState(() => Date.now());
    c.useEffect(() => {
      const n = () => N(Date.now()),
        f = window.setInterval(n, 3e4);
      return (
        document.addEventListener('visibilitychange', n),
        () => {
          (window.clearInterval(f), document.removeEventListener('visibilitychange', n));
        }
      );
    }, []);
    const w = c.useMemo(() => {
        const n = h || [],
          f = new Set(
            (Array.isArray(n) ? n : [])
              .filter((o) => o && o.status === 'completed')
              .map((o) => o.round),
          ),
          S = A.filter((o) => o && !f.has(o.round) && G(o, p) !== 'completed');
        return (
          S.find((o) => G(o, p) === 'current') ||
          S.find((o) => G(o, p) === 'upcoming') ||
          A[A.length - 1] ||
          A[0]
        );
      }, [h, p]),
      v = c.useMemo(() => Z[r] || Z[2026], [r]),
      j = c.useMemo(() => {
        var f;
        return (
          ((f = i[r]) == null ? void 0 : f.drivers) ||
          (v == null ? void 0 : v.drivers) ||
          []
        ).slice(0, 3);
      }, [i, v, r]),
      x = c.useMemo(() => {
        var f;
        return (
          ((f = i[r]) == null ? void 0 : f.constructors) ||
          (v == null ? void 0 : v.constructors) ||
          []
        ).slice(0, 3);
      }, [i, v, r]);
    return e.jsxs('div', {
      className: 'bg-studio-100 min-h-screen pb-20 animate-fade-in',
      children: [
        e.jsx(De, {}),
        e.jsx(Me, {}),
        e.jsxs('div', {
          className: 'space-y-16',
          children: [
            e.jsx('div', {
              id: 'official-grid',
              className: 'scroll-mt-16',
              children: e.jsx(Pe, {}),
            }),
            e.jsx(Ae, { race: w }),
            e.jsxs('section', {
              ref: d,
              className:
                'page-container space-y-6 [content-visibility:auto] [contain-intrinsic-size:auto_900px]',
              children: [
                e.jsxs('div', {
                  className:
                    'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4',
                  children: [
                    e.jsxs('div', {
                      children: [
                        e.jsx('span', {
                          className:
                            'text-xs font-bold uppercase tracking-widest text-f1red block mb-1',
                          children: 'FIA Formula 1 World Championship',
                        }),
                        e.jsx('h2', {
                          className:
                            'font-display text-2xl sm:text-3xl font-black uppercase tracking-wide text-studio-950',
                          children:
                            t === 'vi'
                              ? `Bảng Xếp Hạng Điểm Số (${r})`
                              : `Championship Standings (${r})`,
                        }),
                      ],
                    }),
                    e.jsxs('div', {
                      className: 'flex items-center gap-3',
                      children: [
                        e.jsxs('div', {
                          className:
                            'relative flex items-center bg-white p-1 rounded-xl border border-studio-200 shadow-xs w-48 sm:w-56',
                          children: [
                            e.jsx('div', {
                              className:
                                'absolute top-1 bottom-1 rounded-lg bg-f1red shadow-xs transition-all duration-300 ease-out pointer-events-none',
                              style: {
                                width: 'calc((100% - 8px) / 3)',
                                left: `calc(4px + ${[2026, 2025, 2024].indexOf(r)} * ((100% - 8px) / 3))`,
                              },
                            }),
                            [2026, 2025, 2024].map((n) =>
                              e.jsxs(
                                'button',
                                {
                                  onClick: () => m(n),
                                  className: `relative z-10 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 flex-1 ${r === n ? 'text-white font-black' : 'text-studio-600 hover:text-studio-950'}`,
                                  children: [
                                    e.jsx('span', { children: n }),
                                    n === 2026 &&
                                      e.jsx('span', {
                                        className: `w-1.5 h-1.5 rounded-full ${r === 2026 ? 'bg-white' : 'bg-emerald-400'} animate-pulse`,
                                      }),
                                  ],
                                },
                                n,
                              ),
                            ),
                          ],
                        }),
                        e.jsxs('button', {
                          onClick: () => {
                            s(`/season/${r}`);
                          },
                          className:
                            'text-xs font-bold uppercase tracking-wider text-f1red hover:underline flex items-center gap-1 shrink-0',
                          children: [
                            e.jsx('span', {
                              children: t === 'vi' ? 'Xem đầy đủ BXH' : 'View Full Standings',
                            }),
                            e.jsx(P, { className: 'w-3.5 h-3.5' }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                e.jsxs('div', {
                  className: 'grid grid-cols-1 lg:grid-cols-2 gap-8',
                  children: [
                    e.jsxs(W, {
                      maxTilt: 3,
                      glareOpacity: 0.12,
                      className:
                        'bg-white rounded-xl border border-studio-200 shadow-subtle p-6 space-y-4',
                      children: [
                        e.jsxs('div', {
                          className:
                            'flex items-center justify-between pb-3 border-b border-studio-100',
                          children: [
                            e.jsxs('h3', {
                              className:
                                'font-display text-base font-bold uppercase tracking-wider text-studio-900 flex items-center gap-2',
                              children: [
                                e.jsx(K, { className: 'w-4 h-4 text-amber-500' }),
                                ' ',
                                t === 'vi'
                                  ? 'Bảng Điểm Tay Đua (Top 3)'
                                  : 'Drivers Championship (Top 3)',
                              ],
                            }),
                            e.jsx('span', {
                              className: 'text-xs font-semibold text-studio-500',
                              children: t === 'vi' ? `Mùa giải ${r}` : `${r} Season`,
                            }),
                          ],
                        }),
                        e.jsx(
                          'div',
                          {
                            className: 'space-y-3 animate-fade-in',
                            children: j.map((n, f) => {
                              const S = J(n.teamId, !1);
                              return e.jsx(
                                'div',
                                {
                                  style: {
                                    transitionDelay: `${f * 80}ms`,
                                    opacity: u ? 1 : 0,
                                    transform: u ? 'translateY(0)' : 'translateY(16px)',
                                    transitionProperty: 'opacity, transform',
                                    transitionDuration: '500ms',
                                  },
                                  children: e.jsx(ie, {
                                    rank: n.rank,
                                    name: n.driverName,
                                    subName: ee(n.teamName),
                                    flag: n.countryFlag,
                                    teamId: n.teamId,
                                    teamColor: S,
                                    points: n.points,
                                    wins: n.wins,
                                    podiums: n.podiums,
                                    inView: u,
                                    lang: t,
                                    onClick: () => s(`/drivers/${n.driverId}?season=${r}`),
                                    actionButton: e.jsx('button', {
                                      onClick: (o) => {
                                        (o.stopPropagation(),
                                          s(`/drivers/${n.driverId}?season=${r}`));
                                      },
                                      className:
                                        'p-1.5 rounded-lg bg-studio-100 hover:bg-studio-950 text-studio-600 hover:text-white border border-studio-200 text-[10px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer',
                                      title:
                                        t === 'vi' ? 'Xem hồ sơ tay đua' : 'View Driver Profile',
                                      children: e.jsx(P, { className: 'w-3.5 h-3.5 text-f1red' }),
                                    }),
                                  }),
                                },
                                n.driverId,
                              );
                            }),
                          },
                          `drivers-${r}`,
                        ),
                      ],
                    }),
                    e.jsxs(W, {
                      maxTilt: 3,
                      glareOpacity: 0.12,
                      className:
                        'bg-white rounded-xl border border-studio-200 shadow-subtle p-6 space-y-4',
                      children: [
                        e.jsxs('div', {
                          className:
                            'flex items-center justify-between pb-3 border-b border-studio-100',
                          children: [
                            e.jsxs('h3', {
                              className:
                                'font-display text-base font-bold uppercase tracking-wider text-studio-900 flex items-center gap-2',
                              children: [
                                e.jsx(je, { className: 'w-4 h-4 text-f1red' }),
                                ' ',
                                t === 'vi'
                                  ? 'Bảng Điểm Đội Đua (Top 3)'
                                  : 'Constructors Championship (Top 3)',
                              ],
                            }),
                            e.jsx('span', {
                              className: 'text-xs font-semibold text-studio-500',
                              children: t === 'vi' ? `Mùa giải ${r}` : `${r} Season`,
                            }),
                          ],
                        }),
                        e.jsx(
                          'div',
                          {
                            className: 'space-y-3 animate-fade-in',
                            children: x.map((n, f) => {
                              const S = J(n.teamId, !1);
                              return e.jsx(
                                'div',
                                {
                                  style: {
                                    transitionDelay: `${f * 80}ms`,
                                    opacity: u ? 1 : 0,
                                    transform: u ? 'translateY(0)' : 'translateY(16px)',
                                    transitionProperty: 'opacity, transform',
                                    transitionDuration: '500ms',
                                  },
                                  children: e.jsx(ie, {
                                    rank: n.rank,
                                    name: ee(n.teamName),
                                    teamId: n.teamId,
                                    teamColor: S,
                                    points: n.points,
                                    wins: n.wins,
                                    podiums: n.podiums,
                                    inView: u,
                                    lang: t,
                                    onClick: () => s(`/teams/${n.teamId}`),
                                    actionButton: e.jsxs('button', {
                                      onClick: (o) => {
                                        (o.stopPropagation(), s(`/showroom?team=${n.teamId}`));
                                      },
                                      className:
                                        'p-1.5 rounded-lg bg-studio-100 hover:bg-studio-950 text-studio-600 hover:text-white border border-studio-200 text-[10px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer',
                                      title:
                                        t === 'vi'
                                          ? 'Xem xe trong Showroom 3D'
                                          : 'View in 3D Showroom',
                                      children: [
                                        e.jsx(ye, { className: 'w-3.5 h-3.5 text-f1red' }),
                                        e.jsx('span', {
                                          className: 'hidden sm:inline',
                                          children: '3D',
                                        }),
                                      ],
                                    }),
                                  }),
                                },
                                n.teamId,
                              );
                            }),
                          },
                          `constructors-${r}`,
                        ),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  };
export { Ke as HomeView };
