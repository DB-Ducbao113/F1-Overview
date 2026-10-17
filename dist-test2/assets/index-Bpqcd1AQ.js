const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      'assets/HomeView-B2llQla6.js',
      'assets/vendor-react-B62-MmwA.js',
      'assets/circuitsData-DyBO7Cz4.js',
      'assets/ConstructorLogo-BPzo8jEn.js',
      'assets/drivers-C-W_3F2K.js',
      'assets/vendor-icons-Brb4Fsqu.js',
      'assets/dateUtils-C4Mh2J_m.js',
      'assets/raceSchedule-C_1d8gwS.js',
      'assets/Card3DTilt-DK6ssBNb.js',
      'assets/teamColors-B_bsvcV9.js',
      'assets/teamNames-DMoXlsIr.js',
      'assets/vendor-core-ckwbz45p.js',
      'assets/ChampionshipView-vwyw361T.js',
      'assets/ShowroomView-B_ycYY2X.js',
      'assets/2026-CHO3mofV.js',
      'assets/TeamDetailPage-CvLzehG3.js',
      'assets/index-BB-pzTkF.js',
      'assets/teamSeasons-C1XHo0kd.js',
      'assets/DriverDetailPage-CzknJUCU.js',
      'assets/CarDetailPage-DwlwaOCs.js',
      'assets/TeamsDirectoryPage-CKgCYTec.js',
      'assets/ViewportImage-C-v4fzqx.js',
      'assets/DriversDirectoryPage-gxgfyEPz.js',
      'assets/AboutPage-BKPYwubd.js',
      'assets/RaceClassificationModal-DZCDQYyd.js',
    ]),
) => i.map((i) => d[i]);
var aa = Object.defineProperty;
var ra = (e, r, i) =>
  r in e ? aa(e, r, { enumerable: !0, configurable: !0, writable: !0, value: i }) : (e[r] = i);
var k = (e, r, i) => ra(e, typeof r != 'symbol' ? r + '' : r, i);
import {
  d as Oe,
  p as ia,
  j as a,
  R as le,
  u as ce,
  r as g,
  L as q,
  e as ta,
  f as T,
  N as $,
  h as Ge,
  i as sa,
  k as Ee,
  l as na,
  B as da,
} from './vendor-react-B62-MmwA.js';
import { _ as E } from './vendor-core-ckwbz45p.js';
import {
  H as Be,
  T as oa,
  B as ma,
  X as la,
  M as ca,
  E as se,
  D as ua,
  F as pa,
  a as va,
  b as fa,
  c as ga,
  R as ha,
  d as Sa,
} from './vendor-icons-Brb4Fsqu.js';
(function () {
  const r = document.createElement('link').relList;
  if (r && r.supports && r.supports('modulepreload')) return;
  for (const t of document.querySelectorAll('link[rel="modulepreload"]')) s(t);
  new MutationObserver((t) => {
    for (const d of t)
      if (d.type === 'childList')
        for (const n of d.addedNodes) n.tagName === 'LINK' && n.rel === 'modulepreload' && s(n);
  }).observe(document, { childList: !0, subtree: !0 });
  function i(t) {
    const d = {};
    return (
      t.integrity && (d.integrity = t.integrity),
      t.referrerPolicy && (d.referrerPolicy = t.referrerPolicy),
      t.crossOrigin === 'use-credentials'
        ? (d.credentials = 'include')
        : t.crossOrigin === 'anonymous'
          ? (d.credentials = 'omit')
          : (d.credentials = 'same-origin'),
      d
    );
  }
  function s(t) {
    if (t.ep) return;
    t.ep = !0;
    const d = i(t);
    fetch(t.href, d);
  }
})();
const re = Oe()(
    ia(
      (e) => ({
        lang: 'vi',
        setLang: (r) => e({ lang: r }),
        toggleLang: () => e((r) => ({ lang: r.lang === 'vi' ? 'en' : 'vi' })),
      }),
      { name: 'podium-navigation', partialize: (e) => ({ lang: e.lang }) },
    ),
  ),
  ne = {
    vi: {
      nav: {
        home: 'Trang chủ',
        championship: 'Giải đấu',
        collection: 'Showroom 3D',
        brandTitle: 'PODIUM',
        brandSub: 'Effet de Sol · 3D Racing Archive',
      },
      home: {
        heroTitle1: 'Đỉnh Cao Tốc Độ.',
        heroTitle2: 'Kỷ Nguyên Mới.',
        viewStandings: 'Bảng Điểm Mùa Giải',
      },
      championship: {
        badge: 'Giải đua xe Công thức 1 FIA',
        title: 'Trung Tâm Giải Đấu',
        desc: 'Theo dõi bảng xếp hạng tay đua, đội đua chính thức, lịch trình 23 chặng đua toàn cầu và diễn biến mùa giải Formula 1.',
        tabStandings: 'Bảng Xếp Hạng',
        tabCalendar: 'Lịch Thi Đấu',
        tabResults: 'Kết Quả Chặng',
        tabTeams: 'Đội Đua',
        tabDrivers: 'Tay Đua',
        driversTab: 'Bảng xếp hạng Tay đua',
        constructorsTab: 'Bảng xếp hạng Đội đua',
        pos: 'Hạng',
        driver: 'Tay đua',
        team: 'Đội đua',
        points: 'Điểm',
        wins: 'Thắng',
        podiums: 'Lần lên bục',
        engine: 'Động cơ',
      },
      footer: {
        desc: 'PODIUM — Effet de Sol: nền tảng mô phỏng kỹ thuật 3D, kết quả chặng đua sau phiên và không gian lưu trữ di sản Formula 1.',
        colExplore: 'Khám Phá',
        colLegal: 'Bản Quyền & Ghi Nhận',
        disclaimer:
          'Dự án fan không chính thức, độc lập và phi lợi nhuận; không liên kết, tài trợ hay được chứng thực bởi Formula 1 hoặc bất kỳ đội đua nào. Formula 1, F1, Grand Prix cùng các thương hiệu và tài sản trí tuệ liên quan thuộc quyền sở hữu của Formula One Licensing B.V. và các chủ sở hữu tương ứng.',
        copyright:
          '© 2026 PODIUM — Effet de Sol · Phát triển bởi BaoBungBu · Tôn vinh kỷ nguyên hiệu ứng mặt đất F1.',
      },
    },
    en: {
      nav: {
        home: 'Home',
        championship: 'Championship',
        collection: '3D Showroom',
        brandTitle: 'PODIUM',
        brandSub: 'Effet de Sol · 3D Racing Archive',
      },
      home: {
        heroTitle1: 'Pinnacle Pace.',
        heroTitle2: 'The New Era.',
        viewStandings: 'Season Standings',
      },
      championship: {
        badge: 'FIA Formula One World Championship',
        title: 'Championship Hub',
        desc: 'Follow official Driver and Constructor classifications, the full 23-round season calendar, and Grand Prix race classifications.',
        tabStandings: 'Standings',
        tabCalendar: 'Race Calendar',
        tabResults: 'Race Results',
        tabTeams: 'Teams',
        tabDrivers: 'Drivers',
        driversTab: 'Drivers Classification',
        constructorsTab: 'Constructors Classification',
        pos: 'Pos',
        driver: 'Driver',
        team: 'Team',
        points: 'PTS',
        wins: 'Wins',
        podiums: 'Podiums',
        engine: 'Power Unit',
      },
      footer: {
        desc: 'PODIUM — Effet de Sol: an interactive 3D engineering platform, published post-session results, and Formula 1 heritage archive.',
        colExplore: 'Explore',
        colLegal: 'Attribution & Provenance',
        disclaimer:
          'Unofficial, independent, non-commercial fan project; not affiliated with, sponsored by, or endorsed by Formula 1 or any team. F1, FORMULA ONE, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX, and associated marks belong to Formula One Licensing B.V. and their respective owners.',
        copyright:
          '© 2026 PODIUM — Effet de Sol · Engineered by BaoBungBu · Celebrating the Ground Effect F1 era.',
      },
    },
  },
  Na = {
    full: { sm: 'h-8', md: 'h-11', lg: 'h-14', xl: 'h-20' },
    compact: { sm: 'h-7', md: 'h-9', lg: 'h-11', xl: 'h-14' },
    mark: { sm: 'h-7', md: 'h-9', lg: 'h-12', xl: 'h-16' },
    responsive: { sm: 'h-7 sm:h-8', md: 'h-9 sm:h-11', lg: 'h-11 sm:h-14', xl: 'h-14 sm:h-20' },
  },
  Ia = {
    full: { src: '/logo/logo-full.webp', width: 430, height: 160 },
    compact: { src: '/logo/logo-compact.png', width: 135, height: 60 },
    mark: { src: '/logo/icon-192.png', width: 192, height: 192 },
    responsive: { src: '/logo/logo-compact.png', width: 135, height: 60 },
  },
  De = ({ className: e = '', size: r = 'md', variant: i = 'full', priority: s = !1 }) => {
    const t = Ia[i],
      d = a.jsx('img', {
        src: t.src,
        width: t.width,
        height: t.height,
        alt: i === 'mark' ? '' : i === 'compact' ? 'EDS' : 'PODIUM — Effet de Sol',
        'aria-hidden': i === 'mark' ? !0 : void 0,
        className: `${Na[i][r]} ${i === 'mark' ? 'aspect-square' : ''} w-auto max-w-full shrink-0 select-none object-contain transition-all duration-300 group-hover:brightness-110 ${e}`,
        loading: s ? 'eager' : 'lazy',
        ...(s ? { fetchpriority: 'high' } : {}),
      });
    return i === 'responsive'
      ? a.jsxs('picture', {
          children: [
            a.jsx('source', {
              media: '(min-width: 640px)',
              srcSet: '/logo/logo-full.webp',
              type: 'image/webp',
            }),
            d,
          ],
        })
      : d;
  },
  Aa = le.memo(() => {
    const { lang: e, setLang: r } = re(),
      i = ce(),
      [s, t] = g.useState(!1),
      [d, n] = g.useState(!1),
      v = ne[e].nav,
      c = g.useMemo(
        () => [
          { id: 'home', path: '/', label: v.home, icon: a.jsx(Be, { className: 'w-4 h-4' }) },
          {
            id: 'championship',
            path: '/season/2026',
            label: v.championship,
            icon: a.jsx(oa, { className: 'w-4 h-4' }),
          },
          {
            id: 'collection',
            path: '/showroom',
            label: v.collection,
            icon: a.jsx(ma, { className: 'w-4 h-4' }),
          },
        ],
        [v],
      );
    return (
      g.useEffect(() => {
        const p = () => t(window.scrollY > 20);
        return (
          window.addEventListener('scroll', p, { passive: !0 }),
          () => window.removeEventListener('scroll', p)
        );
      }, []),
      a.jsxs(a.Fragment, {
        children: [
          a.jsx('header', {
            className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${s ? 'bg-[#08080b]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_12px_35px_rgba(0,0,0,0.35)]' : 'bg-[#08080b]/90 backdrop-blur-md border-b border-white/10'}`,
            style: { height: 64 },
            children: a.jsxs('div', {
              className: 'page-container h-full flex items-center justify-between gap-2 sm:gap-6',
              children: [
                a.jsx(q, {
                  to: '/',
                  className:
                    'group focus:outline-none focus-visible:ring-2 focus-visible:ring-f1red rounded',
                  'aria-label': 'PODIUM — Effet de Sol',
                  children: a.jsx(De, { size: 'md', variant: 'responsive', priority: !0 }),
                }),
                a.jsx('nav', {
                  className: 'hidden md:flex items-center gap-4 lg:gap-6',
                  'aria-label': 'Main navigation',
                  children: c.map((p) => {
                    const I =
                      p.id === 'home'
                        ? i.pathname === '/'
                        : p.id === 'championship'
                          ? i.pathname.startsWith('/season') ||
                            i.pathname.startsWith('/teams') ||
                            i.pathname.startsWith('/drivers')
                          : i.pathname.startsWith('/showroom') || i.pathname.startsWith('/gallery');
                    return a.jsxs(
                      q,
                      {
                        to: p.path,
                        className: `flex items-center gap-1.5 lg:gap-2 py-1 text-[11px] lg:text-[13px] font-bold uppercase tracking-wider transition-all duration-200 border-b-2 ${I ? 'border-f1red text-f1red' : 'border-transparent text-studio-300 hover:text-white hover:border-white/30'}`,
                        children: [
                          a.jsx('span', {
                            className: I ? 'text-f1red' : 'text-studio-400',
                            children: p.icon,
                          }),
                          p.label,
                        ],
                      },
                      p.id,
                    );
                  }),
                }),
                a.jsxs('div', {
                  className: 'flex items-center gap-2 sm:gap-3 shrink-0',
                  children: [
                    a.jsxs('div', {
                      className:
                        'flex items-center bg-white/5 p-0.5 rounded-full border border-white/10',
                      children: [
                        a.jsx('button', {
                          onClick: () => r('vi'),
                          className: `px-2 sm:px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-200 min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center ${e === 'vi' ? 'bg-f1red text-white shadow-sm' : 'text-studio-300 hover:text-white'}`,
                          title: 'Tiếng Việt',
                          children: 'VI',
                        }),
                        a.jsx('button', {
                          onClick: () => r('en'),
                          className: `px-2 sm:px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all duration-200 min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center ${e === 'en' ? 'bg-f1red text-white shadow-sm' : 'text-studio-300 hover:text-white'}`,
                          title: 'English',
                          children: 'EN',
                        }),
                      ],
                    }),
                    a.jsx('button', {
                      onClick: () => n(!d),
                      className:
                        'md:hidden p-2 text-studio-200 hover:text-white transition-colors focus:ring-2 focus:ring-f1red rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer',
                      'aria-label': d ? 'Close navigation menu' : 'Open navigation menu',
                      'aria-expanded': d,
                      'aria-controls': 'mobile-nav-menu',
                      children: d
                        ? a.jsx(la, { className: 'w-5 h-5' })
                        : a.jsx(ca, { className: 'w-5 h-5' }),
                    }),
                  ],
                }),
              ],
            }),
          }),
          d &&
            a.jsx('div', {
              className:
                'fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in',
              onClick: () => n(!1),
              children: a.jsx('div', {
                className:
                  'fixed top-16 left-0 right-0 bg-[#0b0b0f]/98 border-b border-white/10 shadow-2xl p-6 flex flex-col gap-4 animate-slide-down',
                onClick: (p) => p.stopPropagation(),
                children: c.map((p) => {
                  const I =
                    p.id === 'home'
                      ? i.pathname === '/'
                      : p.id === 'championship'
                        ? i.pathname.startsWith('/season') ||
                          i.pathname.startsWith('/teams') ||
                          i.pathname.startsWith('/drivers')
                        : i.pathname.startsWith('/showroom') || i.pathname.startsWith('/gallery');
                  return a.jsxs(
                    q,
                    {
                      to: p.path,
                      onClick: () => n(!1),
                      className: `flex items-center gap-3 p-3 rounded-md text-sm font-bold uppercase tracking-wider text-left transition-colors ${I ? 'bg-f1red/10 text-f1red font-black' : 'text-studio-200 hover:text-white hover:bg-white/5'}`,
                      children: [p.icon, p.label],
                    },
                    p.id,
                  );
                }),
              }),
            }),
        ],
      })
    );
  }),
  w = {
    name: 'BaoBungBu',
    facebook: 'https://www.facebook.com/nguyen.duc.bao.313/',
    feedbackFormUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSfJfA4tEzFegKjKex28h8C-OXutZ1l8-GzPgY49PACejXc90w/viewform',
    donation: {
      qrImage: '/qr/QR-Donate.png',
      bank: 'Techcombank',
      recipient: 'NGUYEN DUC BAO',
      account: '1903 8222 8050 13',
      transferMessage: 'Ung ho phat trien web',
    },
  },
  ba = () => {
    const e = re((r) => r.lang === 'vi');
    return a.jsxs('div', {
      className: 'w-full max-w-xs',
      children: [
        a.jsxs('figure', {
          className: 'rounded-xl border border-studio-200 bg-white p-4 text-center text-studio-900',
          children: [
            a.jsx('p', {
              className: 'text-sm font-bold uppercase tracking-wider text-f1red',
              children: w.donation.bank,
            }),
            a.jsx('a', {
              href: w.donation.qrImage,
              target: '_blank',
              rel: 'noopener noreferrer',
              className:
                'mt-2 block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-f1red',
              'aria-label': e
                ? 'Mở ảnh QR donate kích thước đầy đủ'
                : 'Open full-size donation QR image',
              children: a.jsx('img', {
                src: w.donation.qrImage,
                alt: e
                  ? 'Mã QR donate Techcombank của NGUYEN DUC BAO'
                  : 'Techcombank donation QR code for NGUYEN DUC BAO',
                className: 'h-auto w-full',
                width: 540,
                height: 540,
                loading: 'lazy',
                decoding: 'async',
              }),
            }),
            a.jsxs('figcaption', {
              className: 'text-xs leading-6',
              children: [
                a.jsx('p', { className: 'font-bold', children: w.donation.recipient }),
                a.jsx('p', { className: 'select-all font-mono', children: w.donation.account }),
                a.jsxs('div', {
                  className: 'mt-3 border-t border-studio-200 pt-3',
                  children: [
                    a.jsx('p', {
                      className: 'text-studio-500',
                      children: e ? 'Nội dung chuyển khoản' : 'Transfer message',
                    }),
                    a.jsx('p', {
                      className: 'select-all font-mono font-semibold',
                      children: w.donation.transferMessage,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        a.jsxs('div', {
          className: 'mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold',
          children: [
            a.jsxs('a', {
              href: w.donation.qrImage,
              target: '_blank',
              rel: 'noopener noreferrer',
              className:
                'inline-flex min-h-10 items-center gap-2 hover:underline focus-visible:outline-f1red',
              children: [
                a.jsx(se, { className: 'h-3.5 w-3.5', 'aria-hidden': 'true' }),
                e ? 'Mở ảnh QR' : 'Open QR image',
              ],
            }),
            a.jsxs('a', {
              href: w.donation.qrImage,
              download: 'BaoBungBu-donate-QR.png',
              className:
                'inline-flex min-h-10 items-center gap-2 hover:underline focus-visible:outline-f1red',
              children: [
                a.jsx(ua, { className: 'h-3.5 w-3.5', 'aria-hidden': 'true' }),
                e ? 'Tải mã QR' : 'Download QR',
              ],
            }),
          ],
        }),
      ],
    });
  },
  Ra = le.memo(() => {
    const { lang: e } = re(),
      r = ne[e].footer,
      i = ne[e].nav,
      s = [
        { to: '/', label: i.home },
        { to: '/season/2026', label: i.championship },
        { to: '/showroom', label: i.collection },
        { to: '/teams', label: e === 'vi' ? 'Danh sách đội đua' : 'Teams' },
        { to: '/drivers', label: e === 'vi' ? 'Danh sách tay đua' : 'Drivers' },
        { to: '/about', label: e === 'vi' ? 'Về dự án' : 'About' },
      ];
    return a.jsxs('footer', {
      className:
        'relative mt-auto overflow-hidden border-t border-white/10 bg-[#070709] text-white',
      children: [
        a.jsxs('div', {
          'aria-hidden': 'true',
          className: 'pointer-events-none absolute inset-0 opacity-60',
          children: [
            a.jsx('div', { className: 'absolute left-[7%] top-0 h-px w-40 bg-f1red' }),
            a.jsx('div', {
              className:
                'absolute right-[9%] top-24 h-px w-56 bg-gradient-to-r from-transparent via-white/15 to-transparent',
            }),
            a.jsx('div', {
              className:
                'absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-f1red/[0.04] blur-3xl',
            }),
          ],
        }),
        a.jsxs('div', {
          className: 'page-container relative py-14 md:py-20',
          children: [
            a.jsxs('div', {
              className:
                'mb-12 flex items-center justify-between border-b border-white/10 pb-5 text-[9px] font-semibold uppercase tracking-[0.34em] text-white/35',
              children: [
                a.jsx('span', { children: 'PDM / Archive 026' }),
                a.jsx('span', {
                  className: 'hidden sm:inline',
                  children: 'Aerodynamics · Telemetry · Heritage',
                }),
                a.jsx('span', { children: '43° N / 12° E' }),
              ],
            }),
            a.jsxs('div', {
              className: 'grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10',
              children: [
                a.jsxs('section', {
                  className: 'lg:col-span-5 lg:pr-10',
                  children: [
                    a.jsx(De, { size: 'lg', variant: 'full' }),
                    a.jsx('p', {
                      className:
                        'mt-9 font-display text-[clamp(2.7rem,4.5vw,5.2rem)] font-semibold uppercase italic leading-[0.82] tracking-[-0.055em] text-white',
                      children:
                        e === 'vi'
                          ? a.jsxs(a.Fragment, {
                              children: [
                                'Chính xác',
                                a.jsx('br', {}),
                                a.jsx('span', {
                                  className: 'text-white/30',
                                  children: 'trong chuyển động.',
                                }),
                              ],
                            })
                          : a.jsxs(a.Fragment, {
                              children: [
                                'Precision',
                                a.jsx('br', {}),
                                a.jsx('span', {
                                  className: 'text-white/30',
                                  children: 'in motion.',
                                }),
                              ],
                            }),
                    }),
                    a.jsxs('div', {
                      className: 'mt-8 flex items-start gap-5',
                      children: [
                        a.jsx('span', { className: 'mt-2 h-px w-12 shrink-0 bg-f1red' }),
                        a.jsx('p', {
                          className: 'max-w-md text-[13px] font-light leading-6 text-white/55',
                          children: r.desc,
                        }),
                      ],
                    }),
                  ],
                }),
                a.jsxs('nav', {
                  className: 'lg:col-span-3',
                  'aria-label': r.colExplore,
                  children: [
                    a.jsxs('div', {
                      className: 'mb-5 flex items-center gap-3',
                      children: [
                        a.jsx('span', {
                          className: 'font-display text-3xl italic text-f1red',
                          children: '01',
                        }),
                        a.jsxs('div', {
                          children: [
                            a.jsx('p', {
                              className: 'text-[9px] uppercase tracking-[0.34em] text-white/35',
                              children: 'Index',
                            }),
                            a.jsx('h3', {
                              className: 'text-xs font-bold uppercase tracking-[0.2em] text-white',
                              children: r.colExplore,
                            }),
                          ],
                        }),
                      ],
                    }),
                    a.jsx('ul', {
                      className: 'border-t border-white/10',
                      children: s.map((t, d) =>
                        a.jsx(
                          'li',
                          {
                            className: 'border-b border-white/10',
                            children: a.jsxs(q, {
                              to: t.to,
                              className:
                                'group flex items-center justify-between py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55 transition-colors hover:text-white',
                              children: [
                                a.jsxs('span', {
                                  className: 'flex items-center gap-3',
                                  children: [
                                    a.jsx('span', {
                                      className:
                                        'font-display text-[10px] italic text-white/20 transition-colors group-hover:text-f1red',
                                      children: String(d + 1).padStart(2, '0'),
                                    }),
                                    t.label,
                                  ],
                                }),
                                a.jsx('span', {
                                  className:
                                    'translate-x-0 text-f1red opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100',
                                  children: '↗',
                                }),
                              ],
                            }),
                          },
                          t.to,
                        ),
                      ),
                    }),
                  ],
                }),
                a.jsxs('section', {
                  className: 'lg:col-span-4 lg:pl-8',
                  children: [
                    a.jsxs('div', {
                      className: 'mb-5 flex items-center gap-3',
                      children: [
                        a.jsx('span', {
                          className: 'font-display text-3xl italic text-f1red',
                          children: '02',
                        }),
                        a.jsxs('div', {
                          children: [
                            a.jsx('p', {
                              className: 'text-[9px] uppercase tracking-[0.34em] text-white/35',
                              children: 'Provenance',
                            }),
                            a.jsx('h3', {
                              className: 'text-xs font-bold uppercase tracking-[0.2em] text-white',
                              children: r.colLegal,
                            }),
                          ],
                        }),
                      ],
                    }),
                    a.jsxs('div', {
                      className:
                        'border-l border-f1red/50 pl-5 text-[11px] font-light leading-5 text-white/45',
                      children: [
                        a.jsx('p', {
                          className: 'mb-4 uppercase tracking-[0.08em] text-white/65',
                          children:
                            'Photography / LAT Images / DPPI / Motorsport Images / Red Bull Media House / Official team press kits',
                        }),
                        a.jsx('p', { children: r.disclaimer }),
                      ],
                    }),
                    a.jsxs('div', {
                      className:
                        'mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-white/45',
                      children: [
                        a.jsx('span', {
                          className:
                            'h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]',
                        }),
                        'Independent digital archive',
                      ],
                    }),
                  ],
                }),
              ],
            }),
            a.jsxs('div', {
              className: 'mt-12 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-2',
              children: [
                a.jsxs('section', {
                  children: [
                    a.jsx('h3', {
                      className: 'text-xs font-bold uppercase tracking-[0.2em] text-white',
                      children: e === 'vi' ? 'Liên hệ tác giả' : 'Contact the creator',
                    }),
                    a.jsxs('div', {
                      className: 'mt-4 flex flex-wrap gap-3',
                      children: [
                        a.jsxs('a', {
                          href: w.facebook,
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          className:
                            'inline-flex items-center gap-3 rounded-lg border border-white/15 px-4 py-3 text-sm text-white/75 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-f1red',
                          children: [
                            a.jsx(pa, { className: 'h-4 w-4', 'aria-hidden': 'true' }),
                            w.name,
                            ' / Facebook',
                            a.jsx(se, { className: 'h-3.5 w-3.5', 'aria-hidden': 'true' }),
                          ],
                        }),
                        a.jsxs('a', {
                          href: w.feedbackFormUrl,
                          target: '_blank',
                          rel: 'noopener noreferrer',
                          className:
                            'inline-flex items-center gap-3 rounded-lg border border-f1red/50 bg-f1red/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-f1red hover:bg-f1red/20 focus-visible:outline-f1red',
                          children: [
                            a.jsx(va, { className: 'h-4 w-4', 'aria-hidden': 'true' }),
                            e === 'vi' ? 'Gửi góp ý' : 'Send feedback',
                            a.jsx(se, { className: 'h-3.5 w-3.5', 'aria-hidden': 'true' }),
                          ],
                        }),
                      ],
                    }),
                    a.jsx('p', {
                      className: 'mt-3 text-xs leading-5 text-white/55',
                      children:
                        e === 'vi'
                          ? 'Báo lỗi hoặc đề xuất tính năng qua Google Forms.'
                          : 'Report a bug or suggest a feature through Google Forms.',
                    }),
                  ],
                }),
                a.jsxs('details', {
                  className: 'group self-start rounded-xl border border-white/15 p-5',
                  children: [
                    a.jsx('summary', {
                      className:
                        'cursor-pointer text-sm font-semibold text-white/85 focus-visible:outline-f1red',
                      children: a.jsxs('span', {
                        className: 'ml-2 inline-flex items-center gap-2 align-middle',
                        children: [
                          a.jsx(fa, { className: 'h-4 w-4 text-f1red', 'aria-hidden': 'true' }),
                          e === 'vi'
                            ? 'Ủng hộ tác giả · QR donate'
                            : 'Support the creator · Donate QR',
                        ],
                      }),
                    }),
                    a.jsx('p', {
                      className: 'mt-4 text-sm leading-6 text-white/60',
                      children:
                        e === 'vi'
                          ? 'Ủng hộ tác giả để tiếp tục phát triển web. Quét mã bằng ứng dụng ngân hàng để donate. Mọi đóng góp đều tự nguyện. Cảm ơn bạn!'
                          : 'Support the creator to keep developing the website. Scan with your banking app to donate. All contributions are voluntary. Thank you!',
                    }),
                    a.jsx('div', {
                      className: 'mt-5 max-w-[280px] text-white/80',
                      children: a.jsx(ba, {}),
                    }),
                  ],
                }),
              ],
            }),
            a.jsxs('div', {
              className:
                'mt-10 flex min-w-0 flex-col gap-5 border-t border-white/10 pt-7 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50 sm:flex-row sm:items-start sm:justify-between sm:text-xs',
              children: [
                a.jsx('p', {
                  className:
                    'min-w-0 max-w-3xl break-words text-[13px] font-medium normal-case leading-6 tracking-normal text-white/65 sm:flex-1 sm:text-sm',
                  children: r.copyright,
                }),
                a.jsxs('div', {
                  className: 'flex shrink-0 items-center gap-5 whitespace-nowrap',
                  children: [
                    a.jsx('span', { children: '© MMXXVI' }),
                    a.jsx('span', { className: 'h-px w-8 bg-f1red' }),
                    a.jsxs('a', {
                      href: w.facebook,
                      target: '_blank',
                      rel: 'noopener noreferrer',
                      className: 'transition-colors hover:text-white focus-visible:outline-f1red',
                      children: ['Designed by ', w.name],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }),
  F = {
    firstLightMs: 120,
    lightIntervalMs: 220,
    holdMs: 1e3,
    lightsOutMs: 1400,
    launchMs: 1700,
    logoHoldMs: 400,
    revealDurationMs: 400,
    totalMs: 2500,
  },
  Pa = "IT'S LIGHTS OUT AND AWAY WE GO!";
function Re(e) {
  const r = Math.max(0, e),
    i =
      r >= F.totalMs
        ? 'complete'
        : r >= F.launchMs
          ? 'launch'
          : r >= F.lightsOutMs
            ? 'lights-out'
            : r >= F.holdMs
              ? 'hold'
              : r >= F.firstLightMs
                ? 'pressure'
                : 'awakening',
    s =
      r < F.firstLightMs || r >= F.lightsOutMs
        ? 0
        : Math.min(5, Math.floor((r - F.firstLightMs) / F.lightIntervalMs) + 1);
  return { phase: i, litColumns: s };
}
const ke = 'podium-start-lights-seen';
let je = !1;
function Ca() {
  var e;
  if (je) return !1;
  if (typeof window > 'u') return !0;
  if ((e = window.matchMedia) != null && e.call(window, '(prefers-reduced-motion: reduce)').matches)
    return !1;
  try {
    return window.sessionStorage.getItem(ke) !== '1';
  } catch {
    return !0;
  }
}
function La() {
  je = !0;
  try {
    window.sessionStorage.setItem(ke, '1');
  } catch {}
}
const Ma = () => {
    const [e] = g.useState(Ca),
      [r, i] = g.useState(() => Re(0)),
      [s] = g.useState(() => performance.now()),
      [t, d] = g.useState(!1),
      n = g.useCallback(() => d(!0), []),
      v = e && !t && r.phase !== 'complete';
    if (
      (g.useEffect(() => {
        if (!v) return;
        La();
        const b = () => i(Re(performance.now() - s)),
          h = [
            ...Array.from({ length: 5 }, (S, O) => F.firstLightMs + O * F.lightIntervalMs),
            F.lightsOutMs,
            F.launchMs,
            F.totalMs,
          ].map((S) => window.setTimeout(b, Math.max(0, S - (performance.now() - s)) + 1)),
          R = () => {
            document.hidden || b();
          },
          P = (S) => {
            (S.key === 'Escape' || S.key === ' ') && (S.preventDefault(), n());
          };
        return (
          document.addEventListener('visibilitychange', R),
          window.addEventListener('keydown', P),
          () => {
            (h.forEach(window.clearTimeout),
              document.removeEventListener('visibilitychange', R),
              window.removeEventListener('keydown', P));
          }
        );
      }, [n, v, s]),
      g.useEffect(() => {
        if (!v) return;
        const b = document.body.style.overflow;
        return (
          (document.body.style.overflow = 'hidden'),
          () => {
            document.body.style.overflow = b;
          }
        );
      }, [v]),
      !v)
    )
      return null;
    const { phase: c, litColumns: p } = r,
      I = c === 'lights-out' || c === 'launch';
    return a.jsxs('div', {
      role: 'dialog',
      'aria-label': 'F1 Start Lights Preloader',
      className: 'podium-intro',
      'data-phase': c,
      children: [
        a.jsxs('div', {
          className: 'podium-intro__sheet',
          style: {
            '--intro-logo-hold': `${F.logoHoldMs}ms`,
            '--intro-reveal-duration': `${F.revealDurationMs}ms`,
          },
          children: [
            a.jsx('div', { className: 'podium-intro__edge', 'aria-hidden': 'true' }),
            a.jsxs('div', {
              className: 'podium-intro__scene',
              children: [
                a.jsx('div', { className: 'podium-intro__grid', 'aria-hidden': 'true' }),
                a.jsx('div', { className: 'podium-intro__vignette', 'aria-hidden': 'true' }),
                a.jsx('div', { className: 'podium-intro__sweep', 'aria-hidden': 'true' }),
                a.jsxs('div', {
                  className: 'podium-intro__signature',
                  'aria-hidden': 'true',
                  children: [
                    a.jsxs('strong', { children: ['PODIUM', a.jsx('span', { children: '.' })] }),
                    a.jsx('span', { children: 'EFFET DE SOL' }),
                  ],
                }),
                !I &&
                  a.jsxs('div', {
                    className: 'podium-intro__grid-stage',
                    children: [
                      p > 0 &&
                        a.jsx(
                          'div',
                          { className: 'podium-intro__pressure', 'aria-hidden': 'true' },
                          p,
                        ),
                      a.jsx('p', {
                        className: 'podium-intro__eyebrow',
                        children: 'THE GRID IS SET.',
                      }),
                      a.jsx('div', {
                        className: 'podium-intro__rack',
                        'aria-label': `${p} of 5 red lights on`,
                        children: [1, 2, 3, 4, 5].map((b) =>
                          a.jsx(
                            'div',
                            {
                              className: 'podium-intro__column',
                              children: [0, 1].map((u) =>
                                a.jsx(
                                  'span',
                                  {
                                    'data-testid': 'start-light',
                                    className: `podium-intro__lamp${b <= p ? ' is-on' : ''}`,
                                  },
                                  u,
                                ),
                              ),
                            },
                            b,
                          ),
                        ),
                      }),
                      a.jsx('p', {
                        className: 'podium-intro__status',
                        children:
                          c === 'awakening'
                            ? 'PREPARING GRID...'
                            : c === 'hold'
                              ? 'HOLD YOUR BREATH.'
                              : 'STAND BY FOR START',
                      }),
                      a.jsxs('div', {
                        className: 'podium-intro__count',
                        'aria-hidden': 'true',
                        children: [
                          a.jsx('span', { children: String(p).padStart(2, '0') }),
                          a.jsx('i', {}),
                          '05',
                        ],
                      }),
                    ],
                  }),
                I &&
                  a.jsxs(a.Fragment, {
                    children: [
                      a.jsx('div', {
                        className: 'podium-intro__speed',
                        'aria-hidden': 'true',
                        children: [0, 1, 2, 3, 4, 5].map((b) =>
                          a.jsx('i', { style: { '--line': b } }, b),
                        ),
                      }),
                      c === 'launch' &&
                        a.jsxs('div', {
                          className: 'podium-intro__launch-brand',
                          'aria-label': 'PODIUM — Effet de Sol',
                          children: [
                            a.jsxs('strong', {
                              children: ['PODIUM', a.jsx('span', { children: '.' })],
                            }),
                            a.jsx('span', { children: 'EFFET DE SOL' }),
                          ],
                        }),
                      a.jsx('div', {
                        className: `podium-intro__cue${c === 'launch' ? ' is-launching' : ''}`,
                        role: 'status',
                        'aria-label': Pa,
                        'aria-hidden': c === 'launch' || void 0,
                        children: a.jsxs('div', {
                          'aria-hidden': 'true',
                          children: [
                            a.jsx('span', { className: 'podium-intro__its', children: "IT'S" }),
                            a.jsx('strong', { children: 'LIGHTS OUT.' }),
                            a.jsx('span', {
                              className: 'podium-intro__away',
                              children: 'AND AWAY WE GO!',
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                c === 'lights-out' &&
                  a.jsx('div', { className: 'podium-intro__flash', 'aria-hidden': 'true' }),
                a.jsxs('div', {
                  className: 'podium-intro__footer',
                  'aria-hidden': 'true',
                  children: [
                    a.jsx('span', { children: 'FIVE LIGHTS. ONE MOMENT.' }),
                    a.jsx('span', { children: 'EFFET DE SOL' }),
                  ],
                }),
              ],
            }),
          ],
        }),
        a.jsxs('button', {
          type: 'button',
          onClick: n,
          className: 'podium-intro__skip',
          children: ['Bỏ qua / Skip ', a.jsx('span', { children: 'ESC' })],
        }),
      ],
    });
  },
  xa = [2026, 2025, 2024],
  ya = (e) => {
    if (e == null || e === '') return !1;
    const r = Number(e);
    return xa.includes(r);
  },
  D = 'unknown',
  Fa = [
    {
      id: 'race-2024-r1-bahrain',
      season: 2024,
      round: 1,
      grandPrix: 'Bahrain Grand Prix',
      officialName: 'FORMULA 1 GULF AIR BAHRAIN GRAND PRIX 2024',
      circuit: 'Bahrain International Circuit, Sakhir',
      location: 'Sakhir',
      country: 'Bahrain',
      date: '02 Mar 2024',
      status: 'completed',
      lapsTotal: 57,
      winner: { driver: 'Max Verstappen', team: 'Oracle Red Bull Racing', time: '1:31:44.742' },
      fastestLap: { driver: 'Max Verstappen', team: 'Oracle Red Bull Racing', time: '1:32.608' },
      entries: [
        {
          position: 1,
          driverId: 'verstappen',
          driverName: 'Max Verstappen',
          driverCode: 'VER',
          driverNumber: 1,
          teamId: 'redbull',
          teamName: 'Oracle Red Bull Racing',
          laps: 57,
          status: 'Finished',
          timeOrGap: '1:31:44.742',
          points: 26,
          fastestLap: !0,
          fastestLapTime: '1:32.608',
          gridPosition: 1,
        },
        {
          position: 2,
          driverId: 'perez',
          driverName: 'Sergio Pérez',
          driverCode: 'PER',
          driverNumber: 11,
          teamId: 'redbull',
          teamName: 'Oracle Red Bull Racing',
          laps: 57,
          status: 'Finished',
          timeOrGap: '+22.457s',
          points: 18,
          gridPosition: 5,
        },
        {
          position: 3,
          driverId: 'sainz',
          driverName: 'Carlos Sainz',
          driverCode: 'SAI',
          driverNumber: 55,
          teamId: 'ferrari',
          teamName: 'Scuderia Ferrari HP',
          laps: 57,
          status: 'Finished',
          timeOrGap: '+25.110s',
          points: 15,
          gridPosition: 4,
        },
        {
          position: 4,
          driverId: 'leclerc',
          driverName: 'Charles Leclerc',
          driverCode: 'LEC',
          driverNumber: 16,
          teamId: 'ferrari',
          teamName: 'Scuderia Ferrari HP',
          laps: 57,
          status: 'Finished',
          timeOrGap: '+39.669s',
          points: 12,
          gridPosition: 2,
        },
        {
          position: 5,
          driverId: 'russell',
          driverName: 'George Russell',
          driverCode: 'RUS',
          driverNumber: 63,
          teamId: 'mercedes',
          teamName: 'Mercedes-AMG PETRONAS F1',
          laps: 57,
          status: 'Finished',
          timeOrGap: '+46.788s',
          points: 10,
          gridPosition: 3,
        },
        {
          position: 6,
          driverId: 'norris',
          driverName: 'Lando Norris',
          driverCode: 'NOR',
          driverNumber: 4,
          teamId: 'mclaren',
          teamName: 'McLaren Formula 1 Team',
          laps: 57,
          status: 'Finished',
          timeOrGap: '+48.458s',
          points: 8,
          gridPosition: 7,
        },
        {
          position: 7,
          driverId: 'hamilton',
          driverName: 'Lewis Hamilton',
          driverCode: 'HAM',
          driverNumber: 44,
          teamId: 'mercedes',
          teamName: 'Mercedes-AMG PETRONAS F1',
          laps: 57,
          status: 'Finished',
          timeOrGap: '+50.324s',
          points: 6,
          gridPosition: 9,
        },
        {
          position: 8,
          driverId: 'piastri',
          driverName: 'Oscar Piastri',
          driverCode: 'PIA',
          driverNumber: 81,
          teamId: 'mclaren',
          teamName: 'McLaren Formula 1 Team',
          laps: 57,
          status: 'Finished',
          timeOrGap: '+56.082s',
          points: 4,
          gridPosition: 8,
        },
        {
          position: 9,
          driverId: 'alonso',
          driverName: 'Fernando Alonso',
          driverCode: 'ALO',
          driverNumber: 14,
          teamId: 'astonmartin',
          teamName: 'Aston Martin Aramco F1',
          laps: 57,
          status: 'Finished',
          timeOrGap: '+74.887s',
          points: 2,
          gridPosition: 6,
        },
        {
          position: 10,
          driverId: 'stroll',
          driverName: 'Lance Stroll',
          driverCode: 'STR',
          driverNumber: 18,
          teamId: 'astonmartin',
          teamName: 'Aston Martin Aramco F1',
          laps: 57,
          status: 'Finished',
          timeOrGap: '+93.216s',
          points: 1,
          gridPosition: 12,
        },
        {
          position: 11,
          driverId: 'zhou',
          driverName: 'Guanyu Zhou',
          driverCode: 'ZHO',
          driverNumber: 24,
          teamId: 'audi',
          teamName: 'Kick Sauber F1 Team',
          laps: 56,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 17,
        },
        {
          position: 12,
          driverId: 'magnussen',
          driverName: 'Kevin Magnussen',
          driverCode: 'MAG',
          driverNumber: 20,
          teamId: 'haas',
          teamName: 'MoneyGram Haas F1 Team',
          laps: 56,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 15,
        },
        {
          position: 13,
          driverId: 'ricciardo',
          driverName: 'Daniel Ricciardo',
          driverCode: 'RIC',
          driverNumber: 3,
          teamId: 'racingbulls',
          teamName: 'Visa Cash App RB F1',
          laps: 56,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 14,
        },
        {
          position: 14,
          driverId: 'tsunoda',
          driverName: 'Yuki Tsunoda',
          driverCode: 'TSU',
          driverNumber: 22,
          teamId: 'racingbulls',
          teamName: 'Visa Cash App RB F1',
          laps: 56,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 11,
        },
        {
          position: 15,
          driverId: 'albon',
          driverName: 'Alexander Albon',
          driverCode: 'ALB',
          driverNumber: 23,
          teamId: 'williams',
          teamName: 'Williams Racing',
          laps: 56,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 13,
        },
        {
          position: 16,
          driverId: 'hulkenberg',
          driverName: 'Nico Hülkenberg',
          driverCode: 'HUL',
          driverNumber: 27,
          teamId: 'haas',
          teamName: 'MoneyGram Haas F1 Team',
          laps: 56,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 10,
        },
        {
          position: 17,
          driverId: 'ocon',
          driverName: 'Esteban Ocon',
          driverCode: 'OCO',
          driverNumber: 31,
          teamId: 'alpine',
          teamName: 'BWT Alpine F1 Team',
          laps: 56,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 19,
        },
        {
          position: 18,
          driverId: 'gasly',
          driverName: 'Pierre Gasly',
          driverCode: 'GAS',
          driverNumber: 10,
          teamId: 'alpine',
          teamName: 'BWT Alpine F1 Team',
          laps: 56,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 20,
        },
        {
          position: 19,
          driverId: 'bottas',
          driverName: 'Valtteri Bottas',
          driverCode: 'BOT',
          driverNumber: 77,
          teamId: 'audi',
          teamName: 'Kick Sauber F1 Team',
          laps: 56,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 16,
        },
        {
          position: 20,
          driverId: 'sargeant',
          driverName: 'Logan Sargeant',
          driverCode: 'SAR',
          driverNumber: 2,
          teamId: 'williams',
          teamName: 'Williams Racing',
          laps: 55,
          status: '+2 Laps',
          timeOrGap: '+2 Laps',
          points: 0,
          gridPosition: 18,
        },
      ],
    },
    {
      id: 'race-2024-r2-saudi-arabia',
      season: 2024,
      round: 2,
      grandPrix: 'Saudi Arabian Grand Prix',
      officialName: 'FORMULA 1 STC SAUDI ARABIAN GRAND PRIX 2024',
      circuit: 'Jeddah Corniche Circuit',
      location: 'Jeddah',
      country: 'Saudi Arabia',
      date: '09 Mar 2024',
      status: 'completed',
      lapsTotal: 50,
      winner: { driver: 'Max Verstappen', team: 'Oracle Red Bull Racing', time: '1:20:43.273' },
      fastestLap: { driver: 'Charles Leclerc', team: 'Scuderia Ferrari HP', time: '1:31.632' },
      entries: [
        {
          position: 1,
          driverId: 'verstappen',
          driverName: 'Max Verstappen',
          driverCode: 'VER',
          driverNumber: 1,
          teamId: 'redbull',
          teamName: 'Oracle Red Bull Racing',
          laps: 50,
          status: 'Finished',
          timeOrGap: '1:20:43.273',
          points: 25,
          gridPosition: 1,
        },
        {
          position: 2,
          driverId: 'perez',
          driverName: 'Sergio Pérez',
          driverCode: 'PER',
          driverNumber: 11,
          teamId: 'redbull',
          teamName: 'Oracle Red Bull Racing',
          laps: 50,
          status: 'Finished',
          timeOrGap: '+13.643s',
          points: 18,
          gridPosition: 3,
        },
        {
          position: 3,
          driverId: 'leclerc',
          driverName: 'Charles Leclerc',
          driverCode: 'LEC',
          driverNumber: 16,
          teamId: 'ferrari',
          teamName: 'Scuderia Ferrari HP',
          laps: 50,
          status: 'Finished',
          timeOrGap: '+18.639s',
          points: 16,
          fastestLap: !0,
          fastestLapTime: '1:31.632',
          gridPosition: 2,
        },
        {
          position: 4,
          driverId: 'piastri',
          driverName: 'Oscar Piastri',
          driverCode: 'PIA',
          driverNumber: 81,
          teamId: 'mclaren',
          teamName: 'McLaren Formula 1 Team',
          laps: 50,
          status: 'Finished',
          timeOrGap: '+32.007s',
          points: 12,
          gridPosition: 5,
        },
        {
          position: 5,
          driverId: 'alonso',
          driverName: 'Fernando Alonso',
          driverCode: 'ALO',
          driverNumber: 14,
          teamId: 'astonmartin',
          teamName: 'Aston Martin Aramco F1',
          laps: 50,
          status: 'Finished',
          timeOrGap: '+35.759s',
          points: 10,
          gridPosition: 4,
        },
        {
          position: 6,
          driverId: 'russell',
          driverName: 'George Russell',
          driverCode: 'RUS',
          driverNumber: 63,
          teamId: 'mercedes',
          teamName: 'Mercedes-AMG PETRONAS F1',
          laps: 50,
          status: 'Finished',
          timeOrGap: '+39.936s',
          points: 8,
          gridPosition: 7,
        },
        {
          position: 7,
          driverId: 'bearman',
          driverName: 'Oliver Bearman',
          driverCode: 'BEA',
          driverNumber: 38,
          teamId: 'ferrari',
          teamName: 'Scuderia Ferrari HP',
          laps: 50,
          status: 'Finished',
          timeOrGap: '+42.679s',
          points: 6,
          gridPosition: 11,
        },
        {
          position: 8,
          driverId: 'norris',
          driverName: 'Lando Norris',
          driverCode: 'NOR',
          driverNumber: 4,
          teamId: 'mclaren',
          teamName: 'McLaren Formula 1 Team',
          laps: 50,
          status: 'Finished',
          timeOrGap: '+45.708s',
          points: 4,
          gridPosition: 6,
        },
        {
          position: 9,
          driverId: 'hamilton',
          driverName: 'Lewis Hamilton',
          driverCode: 'HAM',
          driverNumber: 44,
          teamId: 'mercedes',
          teamName: 'Mercedes-AMG PETRONAS F1',
          laps: 50,
          status: 'Finished',
          timeOrGap: '+47.391s',
          points: 2,
          gridPosition: 8,
        },
        {
          position: 10,
          driverId: 'hulkenberg',
          driverName: 'Nico Hülkenberg',
          driverCode: 'HUL',
          driverNumber: 27,
          teamId: 'haas',
          teamName: 'MoneyGram Haas F1 Team',
          laps: 50,
          status: 'Finished',
          timeOrGap: '+76.996s',
          points: 1,
          gridPosition: 15,
        },
        {
          position: 11,
          driverId: 'albon',
          driverName: 'Alexander Albon',
          driverCode: 'ALB',
          driverNumber: 23,
          teamId: 'williams',
          teamName: 'Williams Racing',
          laps: 50,
          status: 'Finished',
          timeOrGap: '+88.354s',
          points: 0,
          gridPosition: 12,
        },
        {
          position: 12,
          driverId: 'magnussen',
          driverName: 'Kevin Magnussen',
          driverCode: 'MAG',
          driverNumber: 20,
          teamId: 'haas',
          teamName: 'MoneyGram Haas F1 Team',
          laps: 50,
          status: 'Finished',
          timeOrGap: '+105.737s',
          points: 0,
          gridPosition: 13,
        },
        {
          position: 13,
          driverId: 'ocon',
          driverName: 'Esteban Ocon',
          driverCode: 'OCO',
          driverNumber: 31,
          teamId: 'alpine',
          teamName: 'BWT Alpine F1 Team',
          laps: 49,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 17,
        },
        {
          position: 14,
          driverId: 'tsunoda',
          driverName: 'Yuki Tsunoda',
          driverCode: 'TSU',
          driverNumber: 22,
          teamId: 'racingbulls',
          teamName: 'Visa Cash App RB F1',
          laps: 49,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 9,
        },
        {
          position: 15,
          driverId: 'sargeant',
          driverName: 'Logan Sargeant',
          driverCode: 'SAR',
          driverNumber: 2,
          teamId: 'williams',
          teamName: 'Williams Racing',
          laps: 49,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 19,
        },
        {
          position: 16,
          driverId: 'ricciardo',
          driverName: 'Daniel Ricciardo',
          driverCode: 'RIC',
          driverNumber: 3,
          teamId: 'racingbulls',
          teamName: 'Visa Cash App RB F1',
          laps: 49,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 14,
        },
        {
          position: 17,
          driverId: 'bottas',
          driverName: 'Valtteri Bottas',
          driverCode: 'BOT',
          driverNumber: 77,
          teamId: 'audi',
          teamName: 'Kick Sauber F1 Team',
          laps: 49,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 16,
        },
        {
          position: 18,
          driverId: 'zhou',
          driverName: 'Guanyu Zhou',
          driverCode: 'ZHO',
          driverNumber: 24,
          teamId: 'audi',
          teamName: 'Kick Sauber F1 Team',
          laps: 49,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 20,
        },
        {
          position: 19,
          driverId: 'stroll',
          driverName: 'Lance Stroll',
          driverCode: 'STR',
          driverNumber: 18,
          teamId: 'astonmartin',
          teamName: 'Aston Martin Aramco F1',
          laps: 5,
          status: 'DNF (Accident)',
          timeOrGap: 'Lap 5',
          points: 0,
          gridPosition: 10,
        },
        {
          position: 20,
          driverId: 'gasly',
          driverName: 'Pierre Gasly',
          driverCode: 'GAS',
          driverNumber: 10,
          teamId: 'alpine',
          teamName: 'BWT Alpine F1 Team',
          laps: 1,
          status: 'DNF (Gearbox)',
          timeOrGap: 'Lap 1',
          points: 0,
          gridPosition: 18,
        },
      ],
    },
    {
      id: 'race-2024-r3-australia',
      season: 2024,
      round: 3,
      grandPrix: 'Australian Grand Prix',
      officialName: 'FORMULA 1 ROLEX AUSTRALIAN GRAND PRIX 2024',
      circuit: 'Albert Park Circuit, Melbourne',
      location: 'Melbourne',
      country: 'Australia',
      date: '24 Mar 2024',
      status: 'completed',
      lapsTotal: 58,
      winner: { driver: 'Carlos Sainz', team: 'Scuderia Ferrari HP', time: '1:20:26.843' },
      fastestLap: { driver: 'Charles Leclerc', team: 'Scuderia Ferrari HP', time: '1:19.813' },
      entries: [
        {
          position: 1,
          driverId: 'sainz',
          driverName: 'Carlos Sainz',
          driverCode: 'SAI',
          driverNumber: 55,
          teamId: 'ferrari',
          teamName: 'Scuderia Ferrari HP',
          laps: 58,
          status: 'Finished',
          timeOrGap: '1:20:26.843',
          points: 25,
          gridPosition: 2,
        },
        {
          position: 2,
          driverId: 'leclerc',
          driverName: 'Charles Leclerc',
          driverCode: 'LEC',
          driverNumber: 16,
          teamId: 'ferrari',
          teamName: 'Scuderia Ferrari HP',
          laps: 58,
          status: 'Finished',
          timeOrGap: '+2.366s',
          points: 19,
          fastestLap: !0,
          fastestLapTime: '1:19.813',
          gridPosition: 4,
        },
        {
          position: 3,
          driverId: 'norris',
          driverName: 'Lando Norris',
          driverCode: 'NOR',
          driverNumber: 4,
          teamId: 'mclaren',
          teamName: 'McLaren Formula 1 Team',
          laps: 58,
          status: 'Finished',
          timeOrGap: '+5.904s',
          points: 15,
          gridPosition: 3,
        },
        {
          position: 4,
          driverId: 'piastri',
          driverName: 'Oscar Piastri',
          driverCode: 'PIA',
          driverNumber: 81,
          teamId: 'mclaren',
          teamName: 'McLaren Formula 1 Team',
          laps: 58,
          status: 'Finished',
          timeOrGap: '+35.770s',
          points: 12,
          gridPosition: 5,
        },
        {
          position: 5,
          driverId: 'perez',
          driverName: 'Sergio Pérez',
          driverCode: 'PER',
          driverNumber: 11,
          teamId: 'redbull',
          teamName: 'Oracle Red Bull Racing',
          laps: 58,
          status: 'Finished',
          timeOrGap: '+56.309s',
          points: 10,
          gridPosition: 6,
        },
        {
          position: 6,
          driverId: 'stroll',
          driverName: 'Lance Stroll',
          driverCode: 'STR',
          driverNumber: 18,
          teamId: 'astonmartin',
          teamName: 'Aston Martin Aramco F1',
          laps: 58,
          status: 'Finished',
          timeOrGap: '+93.222s',
          points: 8,
          gridPosition: 9,
        },
        {
          position: 7,
          driverId: 'tsunoda',
          driverName: 'Yuki Tsunoda',
          driverCode: 'TSU',
          driverNumber: 22,
          teamId: 'racingbulls',
          teamName: 'Visa Cash App RB F1',
          laps: 58,
          status: 'Finished',
          timeOrGap: '+95.601s',
          points: 6,
          gridPosition: 8,
        },
        {
          position: 8,
          driverId: 'alonso',
          driverName: 'Fernando Alonso',
          driverCode: 'ALO',
          driverNumber: 14,
          teamId: 'astonmartin',
          teamName: 'Aston Martin Aramco F1',
          laps: 58,
          status: 'Finished',
          timeOrGap: '+80.999s',
          points: 4,
          gridPosition: 10,
        },
        {
          position: 9,
          driverId: 'hulkenberg',
          driverName: 'Nico Hülkenberg',
          driverCode: 'HUL',
          driverNumber: 27,
          teamId: 'haas',
          teamName: 'MoneyGram Haas F1 Team',
          laps: 58,
          status: 'Finished',
          timeOrGap: '+104.553s',
          points: 2,
          gridPosition: 16,
        },
        {
          position: 10,
          driverId: 'magnussen',
          driverName: 'Kevin Magnussen',
          driverCode: 'MAG',
          driverNumber: 20,
          teamId: 'haas',
          teamName: 'MoneyGram Haas F1 Team',
          laps: 57,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 1,
          gridPosition: 14,
        },
        {
          position: 11,
          driverId: 'albon',
          driverName: 'Alexander Albon',
          driverCode: 'ALB',
          driverNumber: 23,
          teamId: 'williams',
          teamName: 'Williams Racing',
          laps: 57,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 12,
        },
        {
          position: 12,
          driverId: 'ricciardo',
          driverName: 'Daniel Ricciardo',
          driverCode: 'RIC',
          driverNumber: 3,
          teamId: 'racingbulls',
          teamName: 'Visa Cash App RB F1',
          laps: 57,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 18,
        },
        {
          position: 13,
          driverId: 'gasly',
          driverName: 'Pierre Gasly',
          driverCode: 'GAS',
          driverNumber: 10,
          teamId: 'alpine',
          teamName: 'BWT Alpine F1 Team',
          laps: 57,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 17,
        },
        {
          position: 14,
          driverId: 'bottas',
          driverName: 'Valtteri Bottas',
          driverCode: 'BOT',
          driverNumber: 77,
          teamId: 'audi',
          teamName: 'Kick Sauber F1 Team',
          laps: 57,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 13,
        },
        {
          position: 15,
          driverId: 'zhou',
          driverName: 'Guanyu Zhou',
          driverCode: 'ZHO',
          driverNumber: 24,
          teamId: 'audi',
          teamName: 'Kick Sauber F1 Team',
          laps: 57,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 19,
        },
        {
          position: 16,
          driverId: 'ocon',
          driverName: 'Esteban Ocon',
          driverCode: 'OCO',
          driverNumber: 31,
          teamId: 'alpine',
          teamName: 'BWT Alpine F1 Team',
          laps: 57,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 15,
        },
        {
          position: 17,
          driverId: 'russell',
          driverName: 'George Russell',
          driverCode: 'RUS',
          driverNumber: 63,
          teamId: 'mercedes',
          teamName: 'Mercedes-AMG PETRONAS F1',
          laps: 56,
          status: 'DNF (Crash)',
          timeOrGap: 'Lap 56',
          points: 0,
          gridPosition: 7,
        },
        {
          position: 18,
          driverId: 'hamilton',
          driverName: 'Lewis Hamilton',
          driverCode: 'HAM',
          driverNumber: 44,
          teamId: 'mercedes',
          teamName: 'Mercedes-AMG PETRONAS F1',
          laps: 15,
          status: 'DNF (Engine)',
          timeOrGap: 'Lap 15',
          points: 0,
          gridPosition: 11,
        },
        {
          position: 19,
          driverId: 'verstappen',
          driverName: 'Max Verstappen',
          driverCode: 'VER',
          driverNumber: 1,
          teamId: 'redbull',
          teamName: 'Oracle Red Bull Racing',
          laps: 3,
          status: 'DNF (Brakes)',
          timeOrGap: 'Lap 3',
          points: 0,
          gridPosition: 1,
        },
        {
          position: 20,
          driverId: 'sargeant',
          driverName: 'Logan Sargeant',
          driverCode: 'SAR',
          driverNumber: 2,
          teamId: 'williams',
          teamName: 'Williams Racing',
          laps: 0,
          status: 'DNS (Car given to Albon)',
          timeOrGap: 'DNS',
          points: 0,
          gridPosition: 20,
        },
      ],
    },
    {
      id: 'race-2024-r17-azerbaijan',
      season: 2024,
      round: 17,
      grandPrix: 'Azerbaijan Grand Prix',
      officialName: 'FORMULA 1 QATAR AIRWAYS AZERBAIJAN GRAND PRIX 2024',
      circuit: 'Baku City Circuit',
      location: 'Baku',
      country: 'Azerbaijan',
      date: '15 Sep 2024',
      status: 'completed',
      lapsTotal: 51,
      winner: { driver: 'Oscar Piastri', team: 'McLaren Formula 1 Team', time: '1:32:58.007' },
      fastestLap: { driver: 'Lando Norris', team: 'McLaren Formula 1 Team', time: '1:45.255' },
      entries: [
        {
          position: 1,
          driverId: 'piastri',
          driverName: 'Oscar Piastri',
          driverCode: 'PIA',
          driverNumber: 81,
          teamId: 'mclaren',
          teamName: 'McLaren Formula 1 Team',
          laps: 51,
          status: 'Finished',
          timeOrGap: '1:32:58.007',
          points: 25,
          gridPosition: 2,
        },
        {
          position: 2,
          driverId: 'leclerc',
          driverName: 'Charles Leclerc',
          driverCode: 'LEC',
          driverNumber: 16,
          teamId: 'ferrari',
          teamName: 'Scuderia Ferrari HP',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+10.910s',
          points: 18,
          gridPosition: 1,
        },
        {
          position: 3,
          driverId: 'russell',
          driverName: 'George Russell',
          driverCode: 'RUS',
          driverNumber: 63,
          teamId: 'mercedes',
          teamName: 'Mercedes-AMG PETRONAS F1',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+31.328s',
          points: 15,
          gridPosition: 5,
        },
        {
          position: 4,
          driverId: 'norris',
          driverName: 'Lando Norris',
          driverCode: 'NOR',
          driverNumber: 4,
          teamId: 'mclaren',
          teamName: 'McLaren Formula 1 Team',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+36.143s',
          points: 13,
          fastestLap: !0,
          fastestLapTime: '1:45.255',
          gridPosition: 15,
        },
        {
          position: 5,
          driverId: 'verstappen',
          driverName: 'Max Verstappen',
          driverCode: 'VER',
          driverNumber: 1,
          teamId: 'redbull',
          teamName: 'Oracle Red Bull Racing',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+77.098s',
          points: 10,
          gridPosition: 6,
        },
        {
          position: 6,
          driverId: 'alonso',
          driverName: 'Fernando Alonso',
          driverCode: 'ALO',
          driverNumber: 14,
          teamId: 'astonmartin',
          teamName: 'Aston Martin Aramco F1',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+85.468s',
          points: 8,
          gridPosition: 7,
        },
        {
          position: 7,
          driverId: 'albon',
          driverName: 'Alexander Albon',
          driverCode: 'ALB',
          driverNumber: 23,
          teamId: 'williams',
          teamName: 'Williams Racing',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+87.323s',
          points: 6,
          gridPosition: 9,
        },
        {
          position: 8,
          driverId: 'colapinto',
          driverName: 'Franco Colapinto',
          driverCode: 'COL',
          driverNumber: 43,
          teamId: 'williams',
          teamName: 'Williams Racing',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+89.541s',
          points: 4,
          gridPosition: 8,
        },
        {
          position: 9,
          driverId: 'hamilton',
          driverName: 'Lewis Hamilton',
          driverCode: 'HAM',
          driverNumber: 44,
          teamId: 'mercedes',
          teamName: 'Mercedes-AMG PETRONAS F1',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+92.401s',
          points: 2,
          gridPosition: 7,
        },
        {
          position: 10,
          driverId: 'bearman',
          driverName: 'Oliver Bearman',
          driverCode: 'BEA',
          driverNumber: 50,
          teamId: 'haas',
          teamName: 'MoneyGram Haas F1 Team',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+93.127s',
          points: 1,
          gridPosition: 10,
        },
        {
          position: 11,
          driverId: 'hulkenberg',
          driverName: 'Nico Hülkenberg',
          driverCode: 'HUL',
          driverNumber: 27,
          teamId: 'haas',
          teamName: 'MoneyGram Haas F1 Team',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+93.465s',
          points: 0,
          gridPosition: 12,
        },
        {
          position: 12,
          driverId: 'gasly',
          driverName: 'Pierre Gasly',
          driverCode: 'GAS',
          driverNumber: 10,
          teamId: 'alpine',
          teamName: 'BWT Alpine F1 Team',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+117.189s',
          points: 0,
          gridPosition: 18,
        },
        {
          position: 13,
          driverId: 'ricciardo',
          driverName: 'Daniel Ricciardo',
          driverCode: 'RIC',
          driverNumber: 3,
          teamId: 'racingbulls',
          teamName: 'Visa Cash App RB F1',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+146.907s',
          points: 0,
          gridPosition: 14,
        },
        {
          position: 14,
          driverId: 'zhou',
          driverName: 'Guanyu Zhou',
          driverCode: 'ZHO',
          driverNumber: 24,
          teamId: 'audi',
          teamName: 'Kick Sauber F1 Team',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+148.841s',
          points: 0,
          gridPosition: 17,
        },
        {
          position: 15,
          driverId: 'ocon',
          driverName: 'Esteban Ocon',
          driverCode: 'OCO',
          driverNumber: 31,
          teamId: 'alpine',
          teamName: 'BWT Alpine F1 Team',
          laps: 50,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 19,
        },
        {
          position: 16,
          driverId: 'bottas',
          driverName: 'Valtteri Bottas',
          driverCode: 'BOT',
          driverNumber: 77,
          teamId: 'audi',
          teamName: 'Kick Sauber F1 Team',
          laps: 50,
          status: '+1 Lap',
          timeOrGap: '+1 Lap',
          points: 0,
          gridPosition: 16,
        },
        {
          position: 17,
          driverId: 'perez',
          driverName: 'Sergio Pérez',
          driverCode: 'PER',
          driverNumber: 11,
          teamId: 'redbull',
          teamName: 'Oracle Red Bull Racing',
          laps: 49,
          status: 'DNF (Collision with Sainz)',
          timeOrGap: 'Lap 49',
          points: 0,
          gridPosition: 4,
        },
        {
          position: 18,
          driverId: 'sainz',
          driverName: 'Carlos Sainz',
          driverCode: 'SAI',
          driverNumber: 55,
          teamId: 'ferrari',
          teamName: 'Scuderia Ferrari HP',
          laps: 49,
          status: 'DNF (Collision with Perez)',
          timeOrGap: 'Lap 49',
          points: 0,
          gridPosition: 3,
        },
        {
          position: 19,
          driverId: 'stroll',
          driverName: 'Lance Stroll',
          driverCode: 'STR',
          driverNumber: 18,
          teamId: 'astonmartin',
          teamName: 'Aston Martin Aramco F1',
          laps: 45,
          status: 'DNF (Brakes)',
          timeOrGap: 'Lap 45',
          points: 0,
          gridPosition: 13,
        },
        {
          position: 20,
          driverId: 'tsunoda',
          driverName: 'Yuki Tsunoda',
          driverCode: 'TSU',
          driverNumber: 22,
          teamId: 'racingbulls',
          teamName: 'Visa Cash App RB F1',
          laps: 14,
          status: 'DNF (Sidepod Damage)',
          timeOrGap: 'Lap 14',
          points: 0,
          gridPosition: 11,
        },
      ],
    },
  ],
  Ta = [
    {
      id: 'race-2026-r15-azerbaijan',
      season: 2026,
      round: 15,
      grandPrix: 'Azerbaijan Grand Prix',
      officialName: 'FORMULA 1 QATAR AIRWAYS AZERBAIJAN GRAND PRIX 2026',
      circuit: 'Baku City Circuit',
      location: 'Baku',
      country: 'Azerbaijan',
      date: '26 Sep 2026',
      dataSource: 'Formula1.com result snapshot',
      dataUpdatedAt: '2026-09-28',
      status: 'completed',
      lapsTotal: 51,
      winner: { driver: 'George Russell', team: 'Mercedes-AMG PETRONAS F1', time: '1:38:02.143' },
      fastestLap: { driver: 'George Russell', team: 'Mercedes-AMG PETRONAS F1', time: '1:44.916' },
      entries: [
        {
          position: 1,
          driverId: 'russell',
          driverName: 'George Russell',
          driverCode: 'RUS',
          driverNumber: 63,
          teamId: 'mercedes',
          teamName: 'Mercedes-AMG PETRONAS F1',
          laps: 51,
          status: 'Finished',
          timeOrGap: '1:38:02.143',
          points: 25,
          fastestLap: !0,
          fastestLapTime: '1:44.916',
        },
        {
          position: 2,
          driverId: 'verstappen',
          driverName: 'Max Verstappen',
          driverCode: 'VER',
          driverNumber: 3,
          teamId: 'redbull',
          teamName: 'Oracle Red Bull Racing',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+0.196s',
          points: 18,
        },
        {
          position: 3,
          driverId: 'hadjar',
          driverName: 'Isack Hadjar',
          driverCode: 'HAD',
          driverNumber: 6,
          teamId: 'redbull',
          teamName: 'Oracle Red Bull Racing',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+10.704s',
          points: 15,
        },
        {
          position: 4,
          driverId: 'leclerc',
          driverName: 'Charles Leclerc',
          driverCode: 'LEC',
          driverNumber: 16,
          teamId: 'ferrari',
          teamName: 'Scuderia Ferrari HP',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+14.136s',
          points: 12,
        },
        {
          position: 5,
          driverId: 'antonelli',
          driverName: 'Kimi Antonelli',
          driverCode: 'ANT',
          driverNumber: 12,
          teamId: 'mercedes',
          teamName: 'Mercedes-AMG PETRONAS F1',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+14.512s',
          points: 10,
        },
        {
          position: 6,
          driverId: 'hamilton',
          driverName: 'Lewis Hamilton',
          driverCode: 'HAM',
          driverNumber: 44,
          teamId: 'ferrari',
          teamName: 'Scuderia Ferrari HP',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+22.382s',
          points: 8,
        },
        {
          position: 7,
          driverId: 'lindblad',
          driverName: 'Arvid Lindblad',
          driverCode: 'LIN',
          driverNumber: 41,
          teamId: 'racingbulls',
          teamName: 'Visa Cash App Racing Bulls',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+31.159s',
          points: 6,
        },
        {
          position: 8,
          driverId: 'ocon',
          driverName: 'Esteban Ocon',
          driverCode: 'OCO',
          driverNumber: 31,
          teamId: 'haas',
          teamName: 'MoneyGram Haas F1 Team',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+31.189s',
          points: 4,
        },
        {
          position: 9,
          driverId: 'bearman',
          driverName: 'Oliver Bearman',
          driverCode: 'BEA',
          driverNumber: 87,
          teamId: 'haas',
          teamName: 'MoneyGram Haas F1 Team',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+31.929s',
          points: 2,
        },
        {
          position: 10,
          driverId: 'sainz',
          driverName: 'Carlos Sainz',
          driverCode: 'SAI',
          driverNumber: 55,
          teamId: 'williams',
          teamName: 'Williams Racing',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+32.416s',
          points: 1,
        },
        {
          position: 11,
          driverId: 'hulkenberg',
          driverName: 'Nico Hülkenberg',
          driverCode: 'HUL',
          driverNumber: 27,
          teamId: 'audi',
          teamName: 'Audi Revolut F1 Team',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+33.231s',
          points: 0,
        },
        {
          position: 12,
          driverId: 'lawson',
          driverName: 'Liam Lawson',
          driverCode: 'LAW',
          driverNumber: 30,
          teamId: 'racingbulls',
          teamName: 'Visa Cash App Racing Bulls',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+34.013s',
          points: 0,
        },
        {
          position: 13,
          driverId: 'piastri',
          driverName: 'Oscar Piastri',
          driverCode: 'PIA',
          driverNumber: 81,
          teamId: 'mclaren',
          teamName: 'McLaren Mastercard F1 Team',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+36.401s',
          points: 0,
        },
        {
          position: 14,
          driverId: 'perez',
          driverName: 'Sergio Perez',
          driverCode: 'PER',
          driverNumber: 11,
          teamId: 'cadillac',
          teamName: 'Cadillac Formula 1 Team',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+41.400s',
          points: 0,
        },
        {
          position: 15,
          driverId: 'bortoleto',
          driverName: 'Gabriel Bortoleto',
          driverCode: 'BOR',
          driverNumber: 5,
          teamId: 'audi',
          teamName: 'Audi Revolut F1 Team',
          laps: 51,
          status: 'Finished',
          timeOrGap: '+44.230s',
          points: 0,
        },
        {
          position: 16,
          driverId: 'bottas',
          driverName: 'Valtteri Bottas',
          driverCode: 'BOT',
          driverNumber: 77,
          teamId: 'cadillac',
          teamName: 'Cadillac Formula 1 Team',
          laps: 49,
          status: 'DNF',
          timeOrGap: 'DNF',
          points: 0,
        },
        {
          position: 17,
          driverId: 'colapinto',
          driverName: 'Franco Colapinto',
          driverCode: 'COL',
          driverNumber: 43,
          teamId: 'alpine',
          teamName: 'BWT Alpine F1 Team',
          laps: 36,
          status: 'DNF',
          timeOrGap: 'DNF',
          points: 0,
        },
        {
          position: 18,
          driverId: 'gasly',
          driverName: 'Pierre Gasly',
          driverCode: 'GAS',
          driverNumber: 10,
          teamId: 'alpine',
          teamName: 'BWT Alpine F1 Team',
          laps: 35,
          status: 'DNF',
          timeOrGap: 'DNF',
          points: 0,
        },
        {
          position: 19,
          driverId: 'norris',
          driverName: 'Lando Norris',
          driverCode: 'NOR',
          driverNumber: 1,
          teamId: 'mclaren',
          teamName: 'McLaren Mastercard F1 Team',
          laps: 35,
          status: 'DNF',
          timeOrGap: 'DNF',
          points: 0,
        },
        {
          position: 20,
          driverId: 'albon',
          driverName: 'Alexander Albon',
          driverCode: 'ALB',
          driverNumber: 23,
          teamId: 'williams',
          teamName: 'Williams Racing',
          laps: 29,
          status: 'DNF',
          timeOrGap: 'DNF',
          points: 0,
        },
        {
          position: 21,
          driverId: 'alonso',
          driverName: 'Fernando Alonso',
          driverCode: 'ALO',
          driverNumber: 14,
          teamId: 'astonmartin',
          teamName: 'Aston Martin Aramco F1 Team',
          laps: 20,
          status: 'DNF',
          timeOrGap: 'DNF',
          points: 0,
        },
        {
          position: 22,
          driverId: 'stroll',
          driverName: 'Lance Stroll',
          driverCode: 'STR',
          driverNumber: 18,
          teamId: 'astonmartin',
          teamName: 'Aston Martin Aramco F1 Team',
          laps: 7,
          status: 'DNF',
          timeOrGap: 'DNF',
          points: 0,
        },
      ],
    },
  ],
  ue = [
    {
      rank: 1,
      driverId: 'verstappen',
      driverName: 'Max Verstappen',
      driverCode: 'VER',
      teamId: 'redbull',
      teamName: 'Red Bull Racing',
      points: 437,
      wins: 9,
      podiums: 14,
      countryFlag: '🇳🇱',
    },
    {
      rank: 2,
      driverId: 'norris',
      driverName: 'Lando Norris',
      driverCode: 'NOR',
      teamId: 'mclaren',
      teamName: 'McLaren',
      points: 374,
      wins: 4,
      podiums: 15,
      countryFlag: '🇬🇧',
    },
    {
      rank: 3,
      driverId: 'leclerc',
      driverName: 'Charles Leclerc',
      driverCode: 'LEC',
      teamId: 'ferrari',
      teamName: 'Ferrari',
      points: 356,
      wins: 3,
      podiums: 13,
      countryFlag: '🇲🇨',
    },
    {
      rank: 4,
      driverId: 'piastri',
      driverName: 'Oscar Piastri',
      driverCode: 'PIA',
      teamId: 'mclaren',
      teamName: 'McLaren',
      points: 292,
      wins: 2,
      podiums: 8,
      countryFlag: '🇦🇺',
    },
    {
      rank: 5,
      driverId: 'sainz',
      driverName: 'Carlos Sainz',
      driverCode: 'SAI',
      teamId: 'ferrari',
      teamName: 'Ferrari',
      points: 290,
      wins: 2,
      podiums: 8,
      countryFlag: '🇪🇸',
    },
    {
      rank: 6,
      driverId: 'russell',
      driverName: 'George Russell',
      driverCode: 'RUS',
      teamId: 'mercedes',
      teamName: 'Mercedes',
      points: 245,
      wins: 2,
      podiums: 4,
      countryFlag: '🇬🇧',
    },
    {
      rank: 7,
      driverId: 'hamilton',
      driverName: 'Lewis Hamilton',
      driverCode: 'HAM',
      teamId: 'mercedes',
      teamName: 'Mercedes',
      points: 223,
      wins: 2,
      podiums: 5,
      countryFlag: '🇬🇧',
    },
    {
      rank: 8,
      driverId: 'perez',
      driverName: 'Sergio Perez',
      driverCode: 'PER',
      teamId: 'redbull',
      teamName: 'Red Bull Racing',
      points: 152,
      wins: 0,
      podiums: 4,
      countryFlag: '🇲🇽',
    },
    {
      rank: 9,
      driverId: 'alonso',
      driverName: 'Fernando Alonso',
      driverCode: 'ALO',
      teamId: 'astonmartin',
      teamName: 'Aston Martin',
      points: 70,
      wins: 0,
      podiums: 0,
      countryFlag: '🇪🇸',
    },
    {
      rank: 10,
      driverId: 'gasly',
      driverName: 'Pierre Gasly',
      driverCode: 'GAS',
      teamId: 'alpine',
      teamName: 'Alpine',
      points: 42,
      wins: 0,
      podiums: 1,
      countryFlag: '🇫🇷',
    },
    {
      rank: 11,
      driverId: 'hulkenberg',
      driverName: 'Nico Hülkenberg',
      driverCode: 'HUL',
      teamId: 'haas',
      teamName: 'Haas',
      points: 41,
      wins: 0,
      podiums: 0,
      countryFlag: '🇩🇪',
    },
    {
      rank: 12,
      driverId: 'tsunoda',
      driverName: 'Yuki Tsunoda',
      driverCode: 'TSU',
      teamId: 'racingbulls',
      teamName: 'RB',
      points: 30,
      wins: 0,
      podiums: 0,
      countryFlag: '🇯🇵',
    },
    {
      rank: 13,
      driverId: 'stroll',
      driverName: 'Lance Stroll',
      driverCode: 'STR',
      teamId: 'astonmartin',
      teamName: 'Aston Martin',
      points: 24,
      wins: 0,
      podiums: 0,
      countryFlag: '🇨🇦',
    },
    {
      rank: 14,
      driverId: 'ocon',
      driverName: 'Esteban Ocon',
      driverCode: 'OCO',
      teamId: 'alpine',
      teamName: 'Alpine',
      points: 23,
      wins: 0,
      podiums: 1,
      countryFlag: '🇫🇷',
    },
    {
      rank: 15,
      driverId: 'magnussen',
      driverName: 'Kevin Magnussen',
      driverCode: 'MAG',
      teamId: 'haas',
      teamName: 'Haas',
      points: 16,
      wins: 0,
      podiums: 0,
      countryFlag: '🇩🇰',
    },
    {
      rank: 16,
      driverId: 'albon',
      driverName: 'Alexander Albon',
      driverCode: 'ALB',
      teamId: 'williams',
      teamName: 'Williams',
      points: 12,
      wins: 0,
      podiums: 0,
      countryFlag: '🇹🇭',
    },
    {
      rank: 17,
      driverId: 'ricciardo',
      driverName: 'Daniel Ricciardo',
      driverCode: 'RIC',
      teamId: 'racingbulls',
      teamName: 'RB',
      points: 12,
      wins: 0,
      podiums: 0,
      countryFlag: '🇦🇺',
    },
    {
      rank: 18,
      driverId: 'bearman',
      driverName: 'Oliver Bearman',
      driverCode: 'BEA',
      teamId: 'haas',
      teamName: 'Haas',
      points: 7,
      wins: 0,
      podiums: 0,
      countryFlag: '🇬🇧',
    },
    {
      rank: 19,
      driverId: 'colapinto',
      driverName: 'Franco Colapinto',
      driverCode: 'COL',
      teamId: 'williams',
      teamName: 'Williams',
      points: 5,
      wins: 0,
      podiums: 0,
      countryFlag: '🇦🇷',
    },
    {
      rank: 20,
      driverId: 'zhou',
      driverName: 'Zhou Guanyu',
      driverCode: 'ZHO',
      teamId: 'audi',
      teamName: 'Kick Sauber',
      points: 4,
      wins: 0,
      podiums: 0,
      countryFlag: '🇨🇳',
    },
    {
      rank: 21,
      driverId: 'lawson',
      driverName: 'Liam Lawson',
      driverCode: 'LAW',
      teamId: 'racingbulls',
      teamName: 'RB',
      points: 4,
      wins: 0,
      podiums: 0,
      countryFlag: '🇳🇿',
    },
    {
      rank: 22,
      driverId: 'bottas',
      driverName: 'Valtteri Bottas',
      driverCode: 'BOT',
      teamId: 'audi',
      teamName: 'Kick Sauber',
      points: 0,
      wins: 0,
      podiums: 0,
      countryFlag: '🇫🇮',
    },
    {
      rank: 23,
      driverId: 'sargeant',
      driverName: 'Logan Sargeant',
      driverCode: 'SAR',
      teamId: 'williams',
      teamName: 'Williams',
      points: 0,
      wins: 0,
      podiums: 0,
      countryFlag: '🇺🇸',
    },
    {
      rank: 24,
      driverId: 'doohan',
      driverName: 'Jack Doohan',
      driverCode: 'DOO',
      teamId: 'alpine',
      teamName: 'Alpine',
      points: 0,
      wins: 0,
      podiums: 0,
      countryFlag: '🇦🇺',
    },
  ],
  pe = [
    {
      rank: 1,
      teamId: 'mclaren',
      teamName: 'McLaren',
      points: 666,
      wins: 6,
      podiums: 23,
      engine: 'Mercedes',
    },
    {
      rank: 2,
      teamId: 'ferrari',
      teamName: 'Ferrari',
      points: 652,
      wins: 5,
      podiums: 21,
      engine: 'Ferrari',
    },
    {
      rank: 3,
      teamId: 'redbull',
      teamName: 'Red Bull Racing',
      points: 589,
      wins: 9,
      podiums: 18,
      engine: 'Honda RBPT',
    },
    {
      rank: 4,
      teamId: 'mercedes',
      teamName: 'Mercedes',
      points: 468,
      wins: 4,
      podiums: 9,
      engine: 'Mercedes',
    },
    {
      rank: 5,
      teamId: 'astonmartin',
      teamName: 'Aston Martin',
      points: 94,
      wins: 0,
      podiums: 0,
      engine: 'Mercedes',
    },
    {
      rank: 6,
      teamId: 'alpine',
      teamName: 'Alpine',
      points: 65,
      wins: 0,
      podiums: 2,
      engine: 'Renault',
    },
    {
      rank: 7,
      teamId: 'haas',
      teamName: 'Haas',
      points: 58,
      wins: 0,
      podiums: 0,
      engine: 'Ferrari',
    },
    {
      rank: 8,
      teamId: 'racingbulls',
      teamName: 'RB',
      points: 46,
      wins: 0,
      podiums: 0,
      engine: 'Honda RBPT',
    },
    {
      rank: 9,
      teamId: 'williams',
      teamName: 'Williams',
      points: 17,
      wins: 0,
      podiums: 0,
      engine: 'Mercedes',
    },
    {
      rank: 10,
      teamId: 'audi',
      teamName: 'Kick Sauber',
      points: 4,
      wins: 0,
      podiums: 0,
      engine: 'Ferrari',
    },
  ],
  ve = [
    {
      rank: 1,
      driverId: 'norris',
      driverName: 'Lando Norris',
      driverCode: 'NOR',
      teamId: 'mclaren',
      teamName: 'McLaren',
      points: 423,
      wins: 7,
      podiums: 16,
      countryFlag: '🇬🇧',
    },
    {
      rank: 2,
      driverId: 'verstappen',
      driverName: 'Max Verstappen',
      driverCode: 'VER',
      teamId: 'redbull',
      teamName: 'Red Bull Racing',
      points: 421,
      wins: 8,
      podiums: 15,
      countryFlag: '🇳🇱',
    },
    {
      rank: 3,
      driverId: 'piastri',
      driverName: 'Oscar Piastri',
      driverCode: 'PIA',
      teamId: 'mclaren',
      teamName: 'McLaren',
      points: 410,
      wins: 4,
      podiums: 14,
      countryFlag: '🇦🇺',
    },
    {
      rank: 4,
      driverId: 'russell',
      driverName: 'George Russell',
      driverCode: 'RUS',
      teamId: 'mercedes',
      teamName: 'Mercedes',
      points: 319,
      wins: 2,
      podiums: 8,
      countryFlag: '🇬🇧',
    },
    {
      rank: 5,
      driverId: 'leclerc',
      driverName: 'Charles Leclerc',
      driverCode: 'LEC',
      teamId: 'ferrari',
      teamName: 'Ferrari',
      points: 242,
      wins: 2,
      podiums: 7,
      countryFlag: '🇲🇨',
    },
    {
      rank: 6,
      driverId: 'hamilton',
      driverName: 'Lewis Hamilton',
      driverCode: 'HAM',
      teamId: 'ferrari',
      teamName: 'Ferrari',
      points: 156,
      wins: 1,
      podiums: 4,
      countryFlag: '🇬🇧',
    },
    {
      rank: 7,
      driverId: 'antonelli',
      driverName: 'Kimi Antonelli',
      driverCode: 'ANT',
      teamId: 'mercedes',
      teamName: 'Mercedes',
      points: 150,
      wins: 0,
      podiums: 3,
      countryFlag: '🇮🇹',
    },
    {
      rank: 8,
      driverId: 'albon',
      driverName: 'Alexander Albon',
      driverCode: 'ALB',
      teamId: 'williams',
      teamName: 'Williams',
      points: 73,
      wins: 0,
      podiums: 1,
      countryFlag: '🇹🇭',
    },
    {
      rank: 9,
      driverId: 'sainz',
      driverName: 'Carlos Sainz',
      driverCode: 'SAI',
      teamId: 'williams',
      teamName: 'Williams',
      points: 64,
      wins: 0,
      podiums: 1,
      countryFlag: '🇪🇸',
    },
    {
      rank: 10,
      driverId: 'alonso',
      driverName: 'Fernando Alonso',
      driverCode: 'ALO',
      teamId: 'astonmartin',
      teamName: 'Aston Martin',
      points: 56,
      wins: 0,
      podiums: 0,
      countryFlag: '🇪🇸',
    },
    {
      rank: 11,
      driverId: 'hulkenberg',
      driverName: 'Nico Hülkenberg',
      driverCode: 'HUL',
      teamId: 'audi',
      teamName: 'Kick Sauber',
      points: 51,
      wins: 0,
      podiums: 0,
      countryFlag: '🇩🇪',
    },
    {
      rank: 12,
      driverId: 'hadjar',
      driverName: 'Isack Hadjar',
      driverCode: 'HAD',
      teamId: 'racingbulls',
      teamName: 'Racing Bulls',
      points: 51,
      wins: 0,
      podiums: 0,
      countryFlag: '🇫🇷',
    },
    {
      rank: 13,
      driverId: 'bearman',
      driverName: 'Oliver Bearman',
      driverCode: 'BEA',
      teamId: 'haas',
      teamName: 'Haas',
      points: 41,
      wins: 0,
      podiums: 0,
      countryFlag: '🇬🇧',
    },
    {
      rank: 14,
      driverId: 'lawson',
      driverName: 'Liam Lawson',
      driverCode: 'LAW',
      teamId: 'racingbulls',
      teamName: 'Racing Bulls',
      points: 38,
      wins: 0,
      podiums: 0,
      countryFlag: '🇳🇿',
    },
    {
      rank: 15,
      driverId: 'ocon',
      driverName: 'Esteban Ocon',
      driverCode: 'OCO',
      teamId: 'haas',
      teamName: 'Haas',
      points: 38,
      wins: 0,
      podiums: 0,
      countryFlag: '🇫🇷',
    },
    {
      rank: 16,
      driverId: 'stroll',
      driverName: 'Lance Stroll',
      driverCode: 'STR',
      teamId: 'astonmartin',
      teamName: 'Aston Martin',
      points: 33,
      wins: 0,
      podiums: 0,
      countryFlag: '🇨🇦',
    },
    {
      rank: 17,
      driverId: 'tsunoda',
      driverName: 'Yuki Tsunoda',
      driverCode: 'TSU',
      teamId: 'redbull',
      teamName: 'Red Bull Racing',
      points: 33,
      wins: 0,
      podiums: 0,
      countryFlag: '🇯🇵',
    },
    {
      rank: 18,
      driverId: 'gasly',
      driverName: 'Pierre Gasly',
      driverCode: 'GAS',
      teamId: 'alpine',
      teamName: 'Alpine',
      points: 22,
      wins: 0,
      podiums: 0,
      countryFlag: '🇫🇷',
    },
    {
      rank: 19,
      driverId: 'bortoleto',
      driverName: 'Gabriel Bortoleto',
      driverCode: 'BOR',
      teamId: 'audi',
      teamName: 'Kick Sauber',
      points: 19,
      wins: 0,
      podiums: 0,
      countryFlag: '🇧🇷',
    },
    {
      rank: 20,
      driverId: 'colapinto',
      driverName: 'Franco Colapinto',
      driverCode: 'COL',
      teamId: 'alpine',
      teamName: 'Alpine',
      points: 0,
      wins: 0,
      podiums: 0,
      countryFlag: '🇦🇷',
    },
    {
      rank: 21,
      driverId: 'doohan',
      driverName: 'Jack Doohan',
      driverCode: 'DOO',
      teamId: 'alpine',
      teamName: 'Alpine',
      points: 0,
      wins: 0,
      podiums: 0,
      countryFlag: '🇦🇺',
    },
  ],
  fe = [
    {
      rank: 1,
      teamId: 'mclaren',
      teamName: 'McLaren',
      points: 833,
      wins: 11,
      podiums: 30,
      engine: 'Mercedes',
    },
    {
      rank: 2,
      teamId: 'mercedes',
      teamName: 'Mercedes',
      points: 469,
      wins: 2,
      podiums: 11,
      engine: 'Mercedes',
    },
    {
      rank: 3,
      teamId: 'redbull',
      teamName: 'Red Bull Racing',
      points: 451,
      wins: 8,
      podiums: 15,
      engine: 'Honda RBPT',
    },
    {
      rank: 4,
      teamId: 'ferrari',
      teamName: 'Ferrari',
      points: 398,
      wins: 3,
      podiums: 11,
      engine: 'Ferrari',
    },
    {
      rank: 5,
      teamId: 'williams',
      teamName: 'Williams',
      points: 137,
      wins: 0,
      podiums: 2,
      engine: 'Mercedes',
    },
    {
      rank: 6,
      teamId: 'racingbulls',
      teamName: 'Racing Bulls',
      points: 92,
      wins: 0,
      podiums: 0,
      engine: 'Honda RBPT',
    },
    {
      rank: 7,
      teamId: 'astonmartin',
      teamName: 'Aston Martin',
      points: 89,
      wins: 0,
      podiums: 0,
      engine: 'Mercedes',
    },
    {
      rank: 8,
      teamId: 'haas',
      teamName: 'Haas',
      points: 79,
      wins: 0,
      podiums: 0,
      engine: 'Ferrari',
    },
    {
      rank: 9,
      teamId: 'audi',
      teamName: 'Kick Sauber',
      points: 70,
      wins: 0,
      podiums: 0,
      engine: 'Ferrari',
    },
    {
      rank: 10,
      teamId: 'alpine',
      teamName: 'Alpine',
      points: 22,
      wins: 0,
      podiums: 0,
      engine: 'Renault',
    },
  ],
  ie = [
    {
      rank: 1,
      driverId: 'antonelli',
      driverName: 'Andrea Kimi Antonelli',
      driverCode: 'ANT',
      teamId: 'mercedes',
      teamName: 'Mercedes',
      points: 340,
      wins: 8,
      podiums: 14,
      countryFlag: '🇮🇹',
    },
    {
      rank: 2,
      driverId: 'russell',
      driverName: 'George Russell',
      driverCode: 'RUS',
      teamId: 'mercedes',
      teamName: 'Mercedes',
      points: 238,
      wins: 3,
      podiums: 8,
      countryFlag: '🇬🇧',
    },
    {
      rank: 3,
      driverId: 'hamilton',
      driverName: 'Lewis Hamilton',
      driverCode: 'HAM',
      teamId: 'ferrari',
      teamName: 'Ferrari',
      points: 229,
      wins: 1,
      podiums: 6,
      countryFlag: '🇬🇧',
    },
    {
      rank: 4,
      driverId: 'verstappen',
      driverName: 'Max Verstappen',
      driverCode: 'VER',
      teamId: 'redbull',
      teamName: 'Red Bull',
      points: 221,
      wins: 2,
      podiums: 9,
      countryFlag: '🇳🇱',
    },
    {
      rank: 5,
      driverId: 'leclerc',
      driverName: 'Charles Leclerc',
      driverCode: 'LEC',
      teamId: 'ferrari',
      teamName: 'Ferrari',
      points: 215,
      wins: 1,
      podiums: 5,
      countryFlag: '🇲🇨',
    },
    {
      rank: 6,
      driverId: 'norris',
      driverName: 'Lando Norris',
      driverCode: 'NOR',
      teamId: 'mclaren',
      teamName: 'McLaren',
      points: 201,
      wins: 2,
      podiums: 5,
      countryFlag: '🇬🇧',
    },
    {
      rank: 7,
      driverId: 'piastri',
      driverName: 'Oscar Piastri',
      driverCode: 'PIA',
      teamId: 'mclaren',
      teamName: 'McLaren',
      points: 138,
      wins: 0,
      podiums: 2,
      countryFlag: '🇦🇺',
    },
    {
      rank: 8,
      driverId: 'hadjar',
      driverName: 'Isack Hadjar',
      driverCode: 'HAD',
      teamId: 'redbull',
      teamName: 'Red Bull',
      points: 97,
      wins: 0,
      podiums: 2,
      countryFlag: '🇫🇷',
    },
    {
      rank: 9,
      driverId: 'lawson',
      driverName: 'Liam Lawson',
      driverCode: 'LAW',
      teamId: 'racingbulls',
      teamName: 'RB F1 Team',
      points: 75,
      wins: 0,
      podiums: 0,
      countryFlag: '🇳🇿',
    },
    {
      rank: 10,
      driverId: 'gasly',
      driverName: 'Pierre Gasly',
      driverCode: 'GAS',
      teamId: 'alpine',
      teamName: 'Alpine F1 Team',
      points: 41,
      wins: 0,
      podiums: 0,
      countryFlag: '🇫🇷',
    },
    {
      rank: 11,
      driverId: 'lindblad',
      driverName: 'Arvid Lindblad',
      driverCode: 'LIN',
      teamId: 'racingbulls',
      teamName: 'RB F1 Team',
      points: 38,
      wins: 0,
      podiums: 0,
      countryFlag: '🇬🇧',
    },
    {
      rank: 12,
      driverId: 'colapinto',
      driverName: 'Franco Colapinto',
      driverCode: 'COL',
      teamId: 'alpine',
      teamName: 'Alpine F1 Team',
      points: 27,
      wins: 0,
      podiums: 0,
      countryFlag: '🇦🇷',
    },
    {
      rank: 13,
      driverId: 'bearman',
      driverName: 'Oliver Bearman',
      driverCode: 'BEA',
      teamId: 'haas',
      teamName: 'Haas F1 Team',
      points: 23,
      wins: 0,
      podiums: 0,
      countryFlag: '🇬🇧',
    },
    {
      rank: 14,
      driverId: 'hulkenberg',
      driverName: 'Nico Hülkenberg',
      driverCode: 'HUL',
      teamId: 'audi',
      teamName: 'Audi',
      points: 13,
      wins: 0,
      podiums: 0,
      countryFlag: '🇩🇪',
    },
    {
      rank: 15,
      driverId: 'bortoleto',
      driverName: 'Gabriel Bortoleto',
      driverCode: 'BOR',
      teamId: 'audi',
      teamName: 'Audi',
      points: 10,
      wins: 0,
      podiums: 0,
      countryFlag: '🇧🇷',
    },
    {
      rank: 16,
      driverId: 'ocon',
      driverName: 'Esteban Ocon',
      driverCode: 'OCO',
      teamId: 'haas',
      teamName: 'Haas F1 Team',
      points: 7,
      wins: 0,
      podiums: 0,
      countryFlag: '🇫🇷',
    },
    {
      rank: 17,
      driverId: 'alonso',
      driverName: 'Fernando Alonso',
      driverCode: 'ALO',
      teamId: 'astonmartin',
      teamName: 'Aston Martin',
      points: 7,
      wins: 0,
      podiums: 0,
      countryFlag: '🇪🇸',
    },
    {
      rank: 18,
      driverId: 'sainz',
      driverName: 'Carlos Sainz',
      driverCode: 'SAI',
      teamId: 'williams',
      teamName: 'Williams',
      points: 7,
      wins: 0,
      podiums: 0,
      countryFlag: '🇪🇸',
    },
    {
      rank: 19,
      driverId: 'albon',
      driverName: 'Alexander Albon',
      driverCode: 'ALB',
      teamId: 'williams',
      teamName: 'Williams',
      points: 5,
      wins: 0,
      podiums: 0,
      countryFlag: '🇹🇭',
    },
    {
      rank: 20,
      driverId: 'stroll',
      driverName: 'Lance Stroll',
      driverCode: 'STR',
      teamId: 'astonmartin',
      teamName: 'Aston Martin',
      points: 0,
      wins: 0,
      podiums: 0,
      countryFlag: '🇨🇦',
    },
    {
      rank: 21,
      driverId: 'bottas',
      driverName: 'Valtteri Bottas',
      driverCode: 'BOT',
      teamId: 'cadillac',
      teamName: 'Cadillac F1 Team',
      points: 0,
      wins: 0,
      podiums: 0,
      countryFlag: '🇫🇮',
    },
    {
      rank: 22,
      driverId: 'perez',
      driverName: 'Sergio Pérez',
      driverCode: 'PER',
      teamId: 'cadillac',
      teamName: 'Cadillac F1 Team',
      points: 0,
      wins: 0,
      podiums: 0,
      countryFlag: '🇲🇽',
    },
  ],
  ge = [
    {
      rank: 1,
      teamId: 'mercedes',
      teamName: 'Mercedes',
      points: 578,
      wins: 11,
      podiums: 22,
      engine: 'Mercedes',
    },
    {
      rank: 2,
      teamId: 'ferrari',
      teamName: 'Ferrari',
      points: 444,
      wins: 2,
      podiums: 11,
      engine: 'Ferrari',
    },
    {
      rank: 3,
      teamId: 'mclaren',
      teamName: 'McLaren',
      points: 339,
      wins: 2,
      podiums: 7,
      engine: 'Mercedes',
    },
    {
      rank: 4,
      teamId: 'redbull',
      teamName: 'Red Bull',
      points: 332,
      wins: 2,
      podiums: 11,
      engine: 'Red Bull Ford',
    },
    {
      rank: 5,
      teamId: 'racingbulls',
      teamName: 'RB F1 Team',
      points: 100,
      wins: 0,
      podiums: 0,
      engine: 'Red Bull Ford',
    },
    {
      rank: 6,
      teamId: 'alpine',
      teamName: 'Alpine F1 Team',
      points: 68,
      wins: 0,
      podiums: 0,
      engine: 'Mercedes',
    },
    {
      rank: 7,
      teamId: 'haas',
      teamName: 'Haas F1 Team',
      points: 30,
      wins: 0,
      podiums: 0,
      engine: 'Ferrari',
    },
    { rank: 8, teamId: 'audi', teamName: 'Audi', points: 23, wins: 0, podiums: 0, engine: 'Audi' },
    {
      rank: 9,
      teamId: 'williams',
      teamName: 'Williams',
      points: 12,
      wins: 0,
      podiums: 0,
      engine: 'Mercedes',
    },
    {
      rank: 10,
      teamId: 'astonmartin',
      teamName: 'Aston Martin',
      points: 7,
      wins: 0,
      podiums: 0,
      engine: 'Honda',
    },
    {
      rank: 11,
      teamId: 'cadillac',
      teamName: 'Cadillac F1 Team',
      points: 0,
      wins: 0,
      podiums: 0,
      engine: 'Ferrari',
    },
  ],
  Pe = {
    2024: {
      season: 2024,
      status: 'completed',
      notes: 'Official Final Classification · Max Verstappen & McLaren Champions',
      leaderTitle: 'World Champion: Max Verstappen (437 pts) · Constructors: McLaren (666 pts)',
      drivers: ue,
      constructors: pe,
    },
    2025: {
      season: 2025,
      status: 'completed',
      notes: 'Official Final Classification · Lando Norris & McLaren Champions',
      leaderTitle: 'World Champion: Lando Norris (423 pts) · Constructors: McLaren (833 pts)',
      drivers: ve,
      constructors: fe,
    },
    2026: {
      season: 2026,
      status: 'ongoing',
      lastUpdated: '2026-10-15',
      notes: 'Official Live Standings after 17 events · Mercedes & Andrea Kimi Antonelli Leading',
      leaderTitle:
        'Current Championship Leader: Andrea Kimi Antonelli (340 pts) · Mercedes (578 pts)',
      drivers: ie,
      constructors: ge,
    },
  },
  ri = (e) => Pe[e] || Pe[2024],
  He = [
    {
      round: 1,
      name: 'Bahrain Grand Prix',
      officialName: 'FORMULA 1 GULF AIR BAHRAIN GRAND PRIX 2024',
      circuit: 'Bahrain International Circuit',
      location: 'Sakhir',
      country: 'Bahrain',
      countryCode: 'BH',
      flag: '🇧🇭',
      dates: '29 Feb – 02 Mar 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !1,
      laps: 57,
      circuitLengthKm: 5.412,
      raceDistanceKm: 308.238,
      lapRecord: { time: '1:31.447', driver: 'Pedro de la Rosa', year: 2005 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Thu 29 Feb', timeStr: '14:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Thu 29 Feb', timeStr: '18:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Fri 01 Mar', timeStr: '15:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Fri 01 Mar',
          timeStr: '19:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sat 02 Mar', timeStr: '18:00', status: 'finished' },
      },
    },
    {
      round: 2,
      name: 'Saudi Arabian Grand Prix',
      officialName: 'FORMULA 1 STC SAUDI ARABIAN GRAND PRIX 2024',
      circuit: 'Jeddah Corniche Circuit',
      location: 'Jeddah',
      country: 'Saudi Arabia',
      countryCode: 'SA',
      flag: '🇸🇦',
      dates: '07 – 09 Mar 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !1,
      laps: 50,
      circuitLengthKm: 6.174,
      raceDistanceKm: 308.45,
      lapRecord: { time: '1:30.734', driver: 'Lewis Hamilton', year: 2021 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Thu 07 Mar', timeStr: '16:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Thu 07 Mar', timeStr: '20:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Fri 08 Mar', timeStr: '16:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Fri 08 Mar',
          timeStr: '20:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sat 09 Mar', timeStr: '20:00', status: 'finished' },
      },
    },
    {
      round: 3,
      name: 'Australian Grand Prix',
      officialName: 'FORMULA 1 ROLEX AUSTRALIAN GRAND PRIX 2024',
      circuit: 'Albert Park Grand Prix Circuit',
      location: 'Melbourne',
      country: 'Australia',
      countryCode: 'AU',
      flag: '🇦🇺',
      dates: '22 – 24 Mar 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !1,
      laps: 58,
      circuitLengthKm: 5.278,
      raceDistanceKm: 306.124,
      lapRecord: { time: '1:19.813', driver: 'Charles Leclerc', year: 2024 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 22 Mar', timeStr: '12:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 22 Mar', timeStr: '16:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 23 Mar', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 23 Mar',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 24 Mar', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 4,
      name: 'Japanese Grand Prix',
      officialName: 'FORMULA 1 MSC CRUISES JAPANESE GRAND PRIX 2024',
      circuit: 'Suzuka International Racing Course',
      location: 'Suzuka',
      country: 'Japan',
      countryCode: 'JP',
      flag: '🇯🇵',
      dates: '05 – 07 Apr 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !1,
      laps: 53,
      circuitLengthKm: 5.807,
      raceDistanceKm: 307.471,
      lapRecord: { time: '1:30.983', driver: 'Lewis Hamilton', year: 2019 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 05 Apr', timeStr: '11:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 05 Apr', timeStr: '15:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 06 Apr', timeStr: '11:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 06 Apr',
          timeStr: '15:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 07 Apr', timeStr: '14:00', status: 'finished' },
      },
    },
    {
      round: 5,
      name: 'Chinese Grand Prix',
      officialName: 'FORMULA 1 LENOVO CHINESE GRAND PRIX 2024',
      circuit: 'Shanghai International Circuit',
      location: 'Shanghai',
      country: 'China',
      countryCode: 'CN',
      flag: '🇨🇳',
      dates: '19 – 21 Apr 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !0,
      laps: 56,
      circuitLengthKm: 5.451,
      raceDistanceKm: 305.066,
      lapRecord: { time: '1:32.238', driver: 'Michael Schumacher', year: 2004 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 19 Apr', timeStr: '11:30', status: 'finished' },
        sprintQualifying: {
          name: 'Sprint Qualifying',
          dateStr: 'Fri 19 Apr',
          timeStr: '15:30',
          status: 'finished',
        },
        sprint: { name: 'Sprint', dateStr: 'Sat 20 Apr', timeStr: '11:00', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 20 Apr',
          timeStr: '15:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 21 Apr', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 6,
      name: 'Miami Grand Prix',
      officialName: 'FORMULA 1 CRYPTO.COM MIAMI GRAND PRIX 2024',
      circuit: 'Miami International Autodrome',
      location: 'Miami',
      country: 'United States',
      countryCode: 'US',
      flag: '🇺🇸',
      dates: '03 – 05 May 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !0,
      laps: 57,
      circuitLengthKm: 5.412,
      raceDistanceKm: 308.326,
      lapRecord: { time: '1:29.708', driver: 'Max Verstappen', year: 2023 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 03 May', timeStr: '12:30', status: 'finished' },
        sprintQualifying: {
          name: 'Sprint Qualifying',
          dateStr: 'Fri 03 May',
          timeStr: '16:30',
          status: 'finished',
        },
        sprint: { name: 'Sprint', dateStr: 'Sat 04 May', timeStr: '12:00', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 04 May',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 05 May', timeStr: '16:00', status: 'finished' },
      },
    },
    {
      round: 7,
      name: 'Emilia Romagna Grand Prix',
      officialName:
        "FORMULA 1 MSC CRUISES GRAN PREMIO DEL MADE IN ITALY E DELL'EMILIA-ROMAGNA 2024",
      circuit: 'Autodromo Enzo e Dino Ferrari',
      location: 'Imola',
      country: 'Italy',
      countryCode: 'IT',
      flag: '🇮🇹',
      dates: '17 – 19 May 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !1,
      laps: 63,
      circuitLengthKm: 4.909,
      raceDistanceKm: 309.049,
      lapRecord: { time: '1:15.484', driver: 'Lewis Hamilton', year: 2020 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 17 May', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 17 May', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 18 May', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 18 May',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 19 May', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 8,
      name: 'Monaco Grand Prix',
      officialName: 'FORMULA 1 GRAND PRIX DE MONACO 2024',
      circuit: 'Circuit de Monaco',
      location: 'Monte Carlo',
      country: 'Monaco',
      countryCode: 'MC',
      flag: '🇲🇨',
      dates: '24 – 26 May 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !1,
      laps: 78,
      circuitLengthKm: 3.337,
      raceDistanceKm: 260.286,
      lapRecord: { time: '1:12.909', driver: 'Lewis Hamilton', year: 2021 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 24 May', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 24 May', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 25 May', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 25 May',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 26 May', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 9,
      name: 'Canadian Grand Prix',
      officialName: 'FORMULA 1 AWS GRAND PRIX DU CANADA 2024',
      circuit: 'Circuit Gilles-Villeneuve',
      location: 'Montreal',
      country: 'Canada',
      countryCode: 'CA',
      flag: '🇨🇦',
      dates: '07 – 09 Jun 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !1,
      laps: 70,
      circuitLengthKm: 4.361,
      raceDistanceKm: 305.27,
      lapRecord: { time: '1:13.078', driver: 'Valtteri Bottas', year: 2019 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 07 Jun', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 07 Jun', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 08 Jun', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 08 Jun',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 09 Jun', timeStr: '14:00', status: 'finished' },
      },
    },
    {
      round: 10,
      name: 'Spanish Grand Prix',
      officialName: 'FORMULA 1 ARAMCO GRAN PREMIO DE ESPAÑA 2024',
      circuit: 'Circuit de Barcelona-Catalunya',
      location: 'Barcelona',
      country: 'Spain',
      countryCode: 'ES',
      flag: '🇪🇸',
      dates: '21 – 23 Jun 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !1,
      laps: 66,
      circuitLengthKm: 4.657,
      raceDistanceKm: 307.236,
      lapRecord: { time: '1:16.330', driver: 'Max Verstappen', year: 2023 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 21 Jun', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 21 Jun', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 22 Jun', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 22 Jun',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 23 Jun', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 11,
      name: 'Austrian Grand Prix',
      officialName: 'FORMULA 1 QATAR AIRWAYS AUSTRIAN GRAND PRIX 2024',
      circuit: 'Red Bull Ring',
      location: 'Spielberg',
      country: 'Austria',
      countryCode: 'AT',
      flag: '🇦🇹',
      dates: '28 – 30 Jun 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !0,
      laps: 71,
      circuitLengthKm: 4.318,
      raceDistanceKm: 306.452,
      lapRecord: { time: '1:05.619', driver: 'Carlos Sainz', year: 2020 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 28 Jun', timeStr: '12:30', status: 'finished' },
        sprintQualifying: {
          name: 'Sprint Qualifying',
          dateStr: 'Fri 28 Jun',
          timeStr: '16:30',
          status: 'finished',
        },
        sprint: { name: 'Sprint', dateStr: 'Sat 29 Jun', timeStr: '12:00', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 29 Jun',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 30 Jun', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 12,
      name: 'British Grand Prix',
      officialName: 'FORMULA 1 QATAR AIRWAYS BRITISH GRAND PRIX 2024',
      circuit: 'Silverstone Circuit',
      location: 'Silverstone',
      country: 'Great Britain',
      countryCode: 'GB',
      flag: '🇬🇧',
      dates: '05 – 07 Jul 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !1,
      laps: 52,
      circuitLengthKm: 5.891,
      raceDistanceKm: 306.198,
      lapRecord: { time: '1:27.097', driver: 'Max Verstappen', year: 2020 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 05 Jul', timeStr: '12:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 05 Jul', timeStr: '16:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 06 Jul', timeStr: '11:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 06 Jul',
          timeStr: '15:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 07 Jul', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 13,
      name: 'Hungarian Grand Prix',
      officialName: 'FORMULA 1 HUNGARIAN GRAND PRIX 2024',
      circuit: 'Hungaroring',
      location: 'Budapest',
      country: 'Hungary',
      countryCode: 'HU',
      flag: '🇭🇺',
      dates: '19 – 21 Jul 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !1,
      laps: 70,
      circuitLengthKm: 4.381,
      raceDistanceKm: 306.63,
      lapRecord: { time: '1:16.627', driver: 'Lewis Hamilton', year: 2020 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 19 Jul', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 19 Jul', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 20 Jul', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 20 Jul',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 21 Jul', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 14,
      name: 'Belgian Grand Prix',
      officialName: 'FORMULA 1 ROLEX BELGIAN GRAND PRIX 2024',
      circuit: 'Circuit de Spa-Francorchamps',
      location: 'Spa-Francorchamps',
      country: 'Belgium',
      countryCode: 'BE',
      flag: '🇧🇪',
      dates: '26 – 28 Jul 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !1,
      laps: 44,
      circuitLengthKm: 7.004,
      raceDistanceKm: 308.052,
      lapRecord: { time: '1:44.701', driver: 'Sergio Perez', year: 2024 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 26 Jul', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 26 Jul', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 27 Jul', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 27 Jul',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 28 Jul', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 15,
      name: 'Dutch Grand Prix',
      officialName: 'FORMULA 1 HEINEKEN DUTCH GRAND PRIX 2024',
      circuit: 'Circuit Zandvoort',
      location: 'Zandvoort',
      country: 'Netherlands',
      countryCode: 'NL',
      flag: '🇳🇱',
      dates: '23 – 25 Aug 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !1,
      laps: 72,
      circuitLengthKm: 4.259,
      raceDistanceKm: 306.587,
      lapRecord: { time: '1:11.097', driver: 'Lewis Hamilton', year: 2021 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 23 Aug', timeStr: '12:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 23 Aug', timeStr: '16:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 24 Aug', timeStr: '11:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 24 Aug',
          timeStr: '15:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 25 Aug', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 16,
      name: 'Italian Grand Prix',
      officialName: 'FORMULA 1 PIRELLI GRAN PREMIO D’ITALIA 2024',
      circuit: 'Autodromo Nazionale Monza',
      location: 'Monza',
      country: 'Italy',
      countryCode: 'IT',
      flag: '🇮🇹',
      dates: '30 Aug – 01 Sep 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !1,
      laps: 53,
      circuitLengthKm: 5.793,
      raceDistanceKm: 306.72,
      lapRecord: { time: '1:21.046', driver: 'Rubens Barrichello', year: 2004 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 30 Aug', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 30 Aug', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 31 Aug', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 31 Aug',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 01 Sep', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 17,
      name: 'Azerbaijan Grand Prix',
      officialName: 'FORMULA 1 QATAR AIRWAYS AZERBAIJAN GRAND PRIX 2024',
      circuit: 'Baku City Circuit',
      location: 'Baku',
      country: 'Azerbaijan',
      countryCode: 'AZ',
      flag: '🇦🇿',
      dates: '13 – 15 Sep 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !1,
      laps: 51,
      circuitLengthKm: 6.003,
      raceDistanceKm: 306.049,
      lapRecord: { time: '1:43.009', driver: 'Charles Leclerc', year: 2019 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 13 Sep', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 13 Sep', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 14 Sep', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 14 Sep',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 15 Sep', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 18,
      name: 'Singapore Grand Prix',
      officialName: 'FORMULA 1 SINGAPORE AIRLINES SINGAPORE GRAND PRIX 2024',
      circuit: 'Marina Bay Street Circuit',
      location: 'Marina Bay',
      country: 'Singapore',
      countryCode: 'SG',
      flag: '🇸🇬',
      dates: '20 – 22 Sep 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !1,
      laps: 62,
      circuitLengthKm: 4.94,
      raceDistanceKm: 306.143,
      lapRecord: { time: '1:34.486', driver: 'Daniel Ricciardo', year: 2024 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 20 Sep', timeStr: '17:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 20 Sep', timeStr: '21:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 21 Sep', timeStr: '17:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 21 Sep',
          timeStr: '21:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 22 Sep', timeStr: '20:00', status: 'finished' },
      },
    },
    {
      round: 19,
      name: 'United States Grand Prix',
      officialName: 'FORMULA 1 PIRELLI UNITED STATES GRAND PRIX 2024',
      circuit: 'Circuit of The Americas',
      location: 'Austin',
      country: 'United States',
      countryCode: 'US',
      flag: '🇺🇸',
      dates: '18 – 20 Oct 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !0,
      laps: 56,
      circuitLengthKm: 5.513,
      raceDistanceKm: 308.405,
      lapRecord: { time: '1:36.169', driver: 'Charles Leclerc', year: 2019 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 18 Oct', timeStr: '12:30', status: 'finished' },
        sprintQualifying: {
          name: 'Sprint Qualifying',
          dateStr: 'Fri 18 Oct',
          timeStr: '16:30',
          status: 'finished',
        },
        sprint: { name: 'Sprint', dateStr: 'Sat 19 Oct', timeStr: '13:00', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 19 Oct',
          timeStr: '17:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 20 Oct', timeStr: '14:00', status: 'finished' },
      },
    },
    {
      round: 20,
      name: 'Mexico City Grand Prix',
      officialName: 'FORMULA 1 GRAN PREMIO DE LA CIUDAD DE MÉXICO 2024',
      circuit: 'Autódromo Hermanos Rodríguez',
      location: 'Mexico City',
      country: 'Mexico',
      countryCode: 'MX',
      flag: '🇲🇽',
      dates: '25 – 27 Oct 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !1,
      laps: 71,
      circuitLengthKm: 4.304,
      raceDistanceKm: 305.354,
      lapRecord: { time: '1:17.774', driver: 'Valtteri Bottas', year: 2021 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 25 Oct', timeStr: '12:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 25 Oct', timeStr: '16:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 26 Oct', timeStr: '11:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 26 Oct',
          timeStr: '15:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 27 Oct', timeStr: '14:00', status: 'finished' },
      },
    },
    {
      round: 21,
      name: 'Sao Paulo Grand Prix',
      officialName: 'FORMULA 1 LENOVO GRANDE PRÊMIO DE SÃO PAULO 2024',
      circuit: 'Autódromo José Carlos Pace',
      location: 'São Paulo',
      country: 'Brazil',
      countryCode: 'BR',
      flag: '🇧🇷',
      dates: '01 – 03 Nov 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !0,
      laps: 69,
      circuitLengthKm: 4.309,
      raceDistanceKm: 297.261,
      lapRecord: { time: '1:10.540', driver: 'Valtteri Bottas', year: 2018 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 01 Nov', timeStr: '11:30', status: 'finished' },
        sprintQualifying: {
          name: 'Sprint Qualifying',
          dateStr: 'Fri 01 Nov',
          timeStr: '15:30',
          status: 'finished',
        },
        sprint: { name: 'Sprint', dateStr: 'Sat 02 Nov', timeStr: '11:00', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sun 03 Nov',
          timeStr: '07:30',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 03 Nov', timeStr: '12:30', status: 'finished' },
      },
    },
    {
      round: 22,
      name: 'Las Vegas Grand Prix',
      officialName: 'FORMULA 1 HEINEKEN SILVER LAS VEGAS GRAND PRIX 2024',
      circuit: 'Las Vegas Strip Circuit',
      location: 'Las Vegas',
      country: 'United States',
      countryCode: 'US',
      flag: '🇺🇸',
      dates: '21 – 23 Nov 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !1,
      laps: 50,
      circuitLengthKm: 6.201,
      raceDistanceKm: 309.958,
      lapRecord: { time: '1:35.490', driver: 'Oscar Piastri', year: 2023 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Thu 21 Nov', timeStr: '18:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Thu 21 Nov', timeStr: '22:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Fri 22 Nov', timeStr: '18:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Fri 22 Nov',
          timeStr: '22:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sat 23 Nov', timeStr: '22:00', status: 'finished' },
      },
    },
    {
      round: 23,
      name: 'Qatar Grand Prix',
      officialName: 'FORMULA 1 QATAR AIRWAYS QATAR GRAND PRIX 2024',
      circuit: 'Lusail International Circuit',
      location: 'Lusail',
      country: 'Qatar',
      countryCode: 'QA',
      flag: '🇶🇦',
      dates: '29 Nov – 01 Dec 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !0,
      laps: 57,
      circuitLengthKm: 5.419,
      raceDistanceKm: 308.611,
      lapRecord: { time: '1:24.319', driver: 'Max Verstappen', year: 2023 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 29 Nov', timeStr: '16:30', status: 'finished' },
        sprintQualifying: {
          name: 'Sprint Qualifying',
          dateStr: 'Fri 29 Nov',
          timeStr: '20:30',
          status: 'finished',
        },
        sprint: { name: 'Sprint', dateStr: 'Sat 30 Nov', timeStr: '16:00', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 30 Nov',
          timeStr: '20:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 01 Dec', timeStr: '19:00', status: 'finished' },
      },
    },
    {
      round: 24,
      name: 'Abu Dhabi Grand Prix',
      officialName: 'FORMULA 1 ETIHAD AIRWAYS ABU DHABI GRAND PRIX 2024',
      circuit: 'Yas Marina Circuit',
      location: 'Yas Island',
      country: 'United Arab Emirates',
      countryCode: 'AE',
      flag: '🇦🇪',
      dates: '06 – 08 Dec 2024',
      season: 2024,
      status: 'completed',
      hasSprint: !1,
      laps: 58,
      circuitLengthKm: 5.281,
      raceDistanceKm: 306.183,
      lapRecord: { time: '1:26.103', driver: 'Max Verstappen', year: 2021 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 06 Dec', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 06 Dec', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 07 Dec', timeStr: '14:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 07 Dec',
          timeStr: '18:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 08 Dec', timeStr: '17:00', status: 'finished' },
      },
    },
  ],
  Ue = [
    {
      round: 1,
      name: 'Australian Grand Prix',
      officialName: 'FORMULA 1 LOUIS VUITTON AUSTRALIAN GRAND PRIX 2025',
      circuit: 'Albert Park Grand Prix Circuit',
      location: 'Melbourne',
      country: 'Australia',
      countryCode: 'AU',
      flag: '🇦🇺',
      dates: '14 – 16 Mar 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !1,
      laps: 58,
      circuitLengthKm: 5.278,
      raceDistanceKm: 306.124,
      lapRecord: { time: '1:19.813', driver: 'Charles Leclerc', year: 2024 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 14 Mar', timeStr: '12:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 14 Mar', timeStr: '16:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 15 Mar', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 15 Mar',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 16 Mar', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 2,
      name: 'Chinese Grand Prix',
      officialName: 'FORMULA 1 HEINEKEN CHINESE GRAND PRIX 2025',
      circuit: 'Shanghai International Circuit',
      location: 'Shanghai',
      country: 'China',
      countryCode: 'CN',
      flag: '🇨🇳',
      dates: '21 – 23 Mar 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !0,
      laps: 56,
      circuitLengthKm: 5.451,
      raceDistanceKm: 305.066,
      lapRecord: { time: '1:32.238', driver: 'Michael Schumacher', year: 2004 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 21 Mar', timeStr: '11:30', status: 'finished' },
        sprintQualifying: {
          name: 'Sprint Qualifying',
          dateStr: 'Fri 21 Mar',
          timeStr: '15:30',
          status: 'finished',
        },
        sprint: { name: 'Sprint', dateStr: 'Sat 22 Mar', timeStr: '11:00', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 22 Mar',
          timeStr: '15:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 23 Mar', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 3,
      name: 'Japanese Grand Prix',
      officialName: 'FORMULA 1 LENOVO JAPANESE GRAND PRIX 2025',
      circuit: 'Suzuka International Racing Course',
      location: 'Suzuka',
      country: 'Japan',
      countryCode: 'JP',
      flag: '🇯🇵',
      dates: '04 – 06 Apr 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !1,
      laps: 53,
      circuitLengthKm: 5.807,
      raceDistanceKm: 307.471,
      lapRecord: { time: '1:30.983', driver: 'Lewis Hamilton', year: 2019 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 04 Apr', timeStr: '11:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 04 Apr', timeStr: '15:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 05 Apr', timeStr: '11:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 05 Apr',
          timeStr: '15:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 06 Apr', timeStr: '14:00', status: 'finished' },
      },
    },
    {
      round: 4,
      name: 'Bahrain Grand Prix',
      officialName: 'FORMULA 1 GULF AIR BAHRAIN GRAND PRIX 2025',
      circuit: 'Bahrain International Circuit',
      location: 'Sakhir',
      country: 'Bahrain',
      countryCode: 'BH',
      flag: '🇧🇭',
      dates: '11 – 13 Apr 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !1,
      laps: 57,
      circuitLengthKm: 5.412,
      raceDistanceKm: 308.238,
      lapRecord: { time: '1:31.447', driver: 'Pedro de la Rosa', year: 2005 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 11 Apr', timeStr: '14:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 11 Apr', timeStr: '18:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 12 Apr', timeStr: '15:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 12 Apr',
          timeStr: '19:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 13 Apr', timeStr: '18:00', status: 'finished' },
      },
    },
    {
      round: 5,
      name: 'Saudi Arabian Grand Prix',
      officialName: 'FORMULA 1 STC SAUDI ARABIAN GRAND PRIX 2025',
      circuit: 'Jeddah Corniche Circuit',
      location: 'Jeddah',
      country: 'Saudi Arabia',
      countryCode: 'SA',
      flag: '🇸🇦',
      dates: '18 – 20 Apr 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !1,
      laps: 50,
      circuitLengthKm: 6.174,
      raceDistanceKm: 308.45,
      lapRecord: { time: '1:30.734', driver: 'Lewis Hamilton', year: 2021 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 18 Apr', timeStr: '16:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 18 Apr', timeStr: '20:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 19 Apr', timeStr: '16:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 19 Apr',
          timeStr: '20:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 20 Apr', timeStr: '20:00', status: 'finished' },
      },
    },
    {
      round: 6,
      name: 'Miami Grand Prix',
      officialName: 'FORMULA 1 CRYPTO.COM MIAMI GRAND PRIX 2025',
      circuit: 'Miami International Autodrome',
      location: 'Miami',
      country: 'United States',
      countryCode: 'US',
      flag: '🇺🇸',
      dates: '02 – 04 May 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !0,
      laps: 57,
      circuitLengthKm: 5.412,
      raceDistanceKm: 308.326,
      lapRecord: { time: '1:29.708', driver: 'Max Verstappen', year: 2023 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 02 May', timeStr: '12:30', status: 'finished' },
        sprintQualifying: {
          name: 'Sprint Qualifying',
          dateStr: 'Fri 02 May',
          timeStr: '16:30',
          status: 'finished',
        },
        sprint: { name: 'Sprint', dateStr: 'Sat 03 May', timeStr: '12:00', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 03 May',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 04 May', timeStr: '16:00', status: 'finished' },
      },
    },
    {
      round: 7,
      name: 'Emilia Romagna Grand Prix',
      officialName: "FORMULA 1 GRAN PREMIO DEL MADE IN ITALY E DELL'EMILIA-ROMAGNA 2025",
      circuit: 'Autodromo Enzo e Dino Ferrari',
      location: 'Imola',
      country: 'Italy',
      countryCode: 'IT',
      flag: '🇮🇹',
      dates: '16 – 18 May 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !1,
      laps: 63,
      circuitLengthKm: 4.909,
      raceDistanceKm: 309.049,
      lapRecord: { time: '1:15.484', driver: 'Lewis Hamilton', year: 2020 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 16 May', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 16 May', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 17 May', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 17 May',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 18 May', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 8,
      name: 'Monaco Grand Prix',
      officialName: 'FORMULA 1 GRAND PRIX DE MONACO 2025',
      circuit: 'Circuit de Monaco',
      location: 'Monte Carlo',
      country: 'Monaco',
      countryCode: 'MC',
      flag: '🇲🇨',
      dates: '23 – 25 May 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !1,
      laps: 78,
      circuitLengthKm: 3.337,
      raceDistanceKm: 260.286,
      lapRecord: { time: '1:12.909', driver: 'Lewis Hamilton', year: 2021 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 23 May', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 23 May', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 24 May', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 24 May',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 25 May', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 9,
      name: 'Spanish Grand Prix',
      officialName: 'FORMULA 1 ARAMCO GRAN PREMIO DE ESPAÑA 2025',
      circuit: 'Circuit de Barcelona-Catalunya',
      location: 'Barcelona',
      country: 'Spain',
      countryCode: 'ES',
      flag: '🇪🇸',
      dates: '30 May – 01 Jun 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !1,
      laps: 66,
      circuitLengthKm: 4.657,
      raceDistanceKm: 307.236,
      lapRecord: { time: '1:16.330', driver: 'Max Verstappen', year: 2023 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 30 May', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 30 May', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 31 May', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 31 May',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 01 Jun', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 10,
      name: 'Canadian Grand Prix',
      officialName: 'FORMULA 1 AWS GRAND PRIX DU CANADA 2025',
      circuit: 'Circuit Gilles-Villeneuve',
      location: 'Montreal',
      country: 'Canada',
      countryCode: 'CA',
      flag: '🇨🇦',
      dates: '13 – 15 Jun 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !1,
      laps: 70,
      circuitLengthKm: 4.361,
      raceDistanceKm: 305.27,
      lapRecord: { time: '1:13.078', driver: 'Valtteri Bottas', year: 2019 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 13 Jun', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 13 Jun', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 14 Jun', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 14 Jun',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 15 Jun', timeStr: '14:00', status: 'finished' },
      },
    },
    {
      round: 11,
      name: 'Austrian Grand Prix',
      officialName: 'FORMULA 1 QATAR AIRWAYS AUSTRIAN GRAND PRIX 2025',
      circuit: 'Red Bull Ring',
      location: 'Spielberg',
      country: 'Austria',
      countryCode: 'AT',
      flag: '🇦🇹',
      dates: '27 – 29 Jun 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !1,
      laps: 71,
      circuitLengthKm: 4.318,
      raceDistanceKm: 306.452,
      lapRecord: { time: '1:05.619', driver: 'Carlos Sainz', year: 2020 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 27 Jun', timeStr: '12:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 27 Jun', timeStr: '16:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 28 Jun', timeStr: '11:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 28 Jun',
          timeStr: '15:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 29 Jun', timeStr: '14:00', status: 'finished' },
      },
    },
    {
      round: 12,
      name: 'British Grand Prix',
      officialName: 'FORMULA 1 QATAR AIRWAYS BRITISH GRAND PRIX 2025',
      circuit: 'Silverstone Circuit',
      location: 'Silverstone',
      country: 'Great Britain',
      countryCode: 'GB',
      flag: '🇬🇧',
      dates: '04 – 06 Jul 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !1,
      laps: 52,
      circuitLengthKm: 5.891,
      raceDistanceKm: 306.198,
      lapRecord: { time: '1:27.097', driver: 'Max Verstappen', year: 2020 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 04 Jul', timeStr: '12:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 04 Jul', timeStr: '16:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 05 Jul', timeStr: '11:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 05 Jul',
          timeStr: '15:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 06 Jul', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 13,
      name: 'Belgian Grand Prix',
      officialName: 'FORMULA 1 ROLEX BELGIAN GRAND PRIX 2025',
      circuit: 'Circuit de Spa-Francorchamps',
      location: 'Spa-Francorchamps',
      country: 'Belgium',
      countryCode: 'BE',
      flag: '🇧🇪',
      dates: '25 – 27 Jul 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !0,
      laps: 44,
      circuitLengthKm: 7.004,
      raceDistanceKm: 308.052,
      lapRecord: { time: '1:44.701', driver: 'Sergio Perez', year: 2024 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 25 Jul', timeStr: '13:30', status: 'finished' },
        sprintQualifying: {
          name: 'Sprint Qualifying',
          dateStr: 'Fri 25 Jul',
          timeStr: '17:30',
          status: 'finished',
        },
        sprint: { name: 'Sprint', dateStr: 'Sat 26 Jul', timeStr: '13:00', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 26 Jul',
          timeStr: '17:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 27 Jul', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 14,
      name: 'Hungarian Grand Prix',
      officialName: 'FORMULA 1 HUNGARIAN GRAND PRIX 2025',
      circuit: 'Hungaroring',
      location: 'Budapest',
      country: 'Hungary',
      countryCode: 'HU',
      flag: '🇭🇺',
      dates: '01 – 03 Aug 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !1,
      laps: 70,
      circuitLengthKm: 4.381,
      raceDistanceKm: 306.63,
      lapRecord: { time: '1:16.627', driver: 'Lewis Hamilton', year: 2020 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 01 Aug', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 01 Aug', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 02 Aug', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 02 Aug',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 03 Aug', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 15,
      name: 'Dutch Grand Prix',
      officialName: 'FORMULA 1 HEINEKEN DUTCH GRAND PRIX 2025',
      circuit: 'Circuit Zandvoort',
      location: 'Zandvoort',
      country: 'Netherlands',
      countryCode: 'NL',
      flag: '🇳🇱',
      dates: '29 – 31 Aug 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !1,
      laps: 72,
      circuitLengthKm: 4.259,
      raceDistanceKm: 306.587,
      lapRecord: { time: '1:11.097', driver: 'Lewis Hamilton', year: 2021 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 29 Aug', timeStr: '12:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 29 Aug', timeStr: '16:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 30 Aug', timeStr: '11:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 30 Aug',
          timeStr: '15:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 31 Aug', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 16,
      name: 'Italian Grand Prix',
      officialName: 'FORMULA 1 PIRELLI GRAN PREMIO D’ITALIA 2025',
      circuit: 'Autodromo Nazionale Monza',
      location: 'Monza',
      country: 'Italy',
      countryCode: 'IT',
      flag: '🇮🇹',
      dates: '05 – 07 Sep 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !1,
      laps: 53,
      circuitLengthKm: 5.793,
      raceDistanceKm: 306.72,
      lapRecord: { time: '1:21.046', driver: 'Rubens Barrichello', year: 2004 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 05 Sep', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 05 Sep', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 06 Sep', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 06 Sep',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 07 Sep', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 17,
      name: 'Azerbaijan Grand Prix',
      officialName: 'FORMULA 1 QATAR AIRWAYS AZERBAIJAN GRAND PRIX 2025',
      circuit: 'Baku City Circuit',
      location: 'Baku',
      country: 'Azerbaijan',
      countryCode: 'AZ',
      flag: '🇦🇿',
      dates: '19 – 21 Sep 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !1,
      laps: 51,
      circuitLengthKm: 6.003,
      raceDistanceKm: 306.049,
      lapRecord: { time: '1:43.009', driver: 'Charles Leclerc', year: 2019 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 19 Sep', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 19 Sep', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 20 Sep', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 20 Sep',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 21 Sep', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 18,
      name: 'Singapore Grand Prix',
      officialName: 'FORMULA 1 SINGAPORE AIRLINES SINGAPORE GRAND PRIX 2025',
      circuit: 'Marina Bay Street Circuit',
      location: 'Marina Bay',
      country: 'Singapore',
      countryCode: 'SG',
      flag: '🇸🇬',
      dates: '03 – 05 Oct 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !1,
      laps: 62,
      circuitLengthKm: 4.94,
      raceDistanceKm: 306.143,
      lapRecord: { time: '1:34.486', driver: 'Daniel Ricciardo', year: 2024 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 03 Oct', timeStr: '17:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 03 Oct', timeStr: '21:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 04 Oct', timeStr: '17:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 04 Oct',
          timeStr: '21:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 05 Oct', timeStr: '20:00', status: 'finished' },
      },
    },
    {
      round: 19,
      name: 'United States Grand Prix',
      officialName: 'FORMULA 1 PIRELLI UNITED STATES GRAND PRIX 2025',
      circuit: 'Circuit of The Americas',
      location: 'Austin',
      country: 'United States',
      countryCode: 'US',
      flag: '🇺🇸',
      dates: '17 – 19 Oct 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !0,
      laps: 56,
      circuitLengthKm: 5.513,
      raceDistanceKm: 308.405,
      lapRecord: { time: '1:36.169', driver: 'Charles Leclerc', year: 2019 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 17 Oct', timeStr: '12:30', status: 'finished' },
        sprintQualifying: {
          name: 'Sprint Qualifying',
          dateStr: 'Fri 17 Oct',
          timeStr: '16:30',
          status: 'finished',
        },
        sprint: { name: 'Sprint', dateStr: 'Sat 18 Oct', timeStr: '13:00', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 18 Oct',
          timeStr: '17:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 19 Oct', timeStr: '14:00', status: 'finished' },
      },
    },
    {
      round: 20,
      name: 'Mexico City Grand Prix',
      officialName: 'FORMULA 1 GRAN PREMIO DE LA CIUDAD DE MÉXICO 2025',
      circuit: 'Autódromo Hermanos Rodríguez',
      location: 'Mexico City',
      country: 'Mexico',
      countryCode: 'MX',
      flag: '🇲🇽',
      dates: '24 – 26 Oct 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !1,
      laps: 71,
      circuitLengthKm: 4.304,
      raceDistanceKm: 305.354,
      lapRecord: { time: '1:17.774', driver: 'Valtteri Bottas', year: 2021 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 24 Oct', timeStr: '12:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 24 Oct', timeStr: '16:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 25 Oct', timeStr: '11:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 25 Oct',
          timeStr: '15:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 26 Oct', timeStr: '14:00', status: 'finished' },
      },
    },
    {
      round: 21,
      name: 'Sao Paulo Grand Prix',
      officialName: 'FORMULA 1 LENOVO GRANDE PRÊMIO DE SÃO PAULO 2025',
      circuit: 'Autódromo José Carlos Pace',
      location: 'São Paulo',
      country: 'Brazil',
      countryCode: 'BR',
      flag: '🇧🇷',
      dates: '07 – 09 Nov 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !0,
      laps: 69,
      circuitLengthKm: 4.309,
      raceDistanceKm: 297.261,
      lapRecord: { time: '1:10.540', driver: 'Valtteri Bottas', year: 2018 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 07 Nov', timeStr: '11:30', status: 'finished' },
        sprintQualifying: {
          name: 'Sprint Qualifying',
          dateStr: 'Fri 07 Nov',
          timeStr: '15:30',
          status: 'finished',
        },
        sprint: { name: 'Sprint', dateStr: 'Sat 08 Nov', timeStr: '11:00', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sun 09 Nov',
          timeStr: '07:30',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 09 Nov', timeStr: '12:30', status: 'finished' },
      },
    },
    {
      round: 22,
      name: 'Las Vegas Grand Prix',
      officialName: 'FORMULA 1 HEINEKEN SILVER LAS VEGAS GRAND PRIX 2025',
      circuit: 'Las Vegas Strip Circuit',
      location: 'Las Vegas',
      country: 'United States',
      countryCode: 'US',
      flag: '🇺🇸',
      dates: '20 – 22 Nov 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !1,
      laps: 50,
      circuitLengthKm: 6.201,
      raceDistanceKm: 309.958,
      lapRecord: { time: '1:35.490', driver: 'Oscar Piastri', year: 2023 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Thu 20 Nov', timeStr: '18:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Thu 20 Nov', timeStr: '22:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Fri 21 Nov', timeStr: '18:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Fri 21 Nov',
          timeStr: '22:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sat 22 Nov', timeStr: '22:00', status: 'finished' },
      },
    },
    {
      round: 23,
      name: 'Qatar Grand Prix',
      officialName: 'FORMULA 1 QATAR AIRWAYS QATAR GRAND PRIX 2025',
      circuit: 'Lusail International Circuit',
      location: 'Lusail',
      country: 'Qatar',
      countryCode: 'QA',
      flag: '🇶🇦',
      dates: '28 – 30 Nov 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !0,
      laps: 57,
      circuitLengthKm: 5.419,
      raceDistanceKm: 308.611,
      lapRecord: { time: '1:24.319', driver: 'Max Verstappen', year: 2023 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 28 Nov', timeStr: '16:30', status: 'finished' },
        sprintQualifying: {
          name: 'Sprint Qualifying',
          dateStr: 'Fri 28 Nov',
          timeStr: '20:30',
          status: 'finished',
        },
        sprint: { name: 'Sprint', dateStr: 'Sat 29 Nov', timeStr: '16:00', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 29 Nov',
          timeStr: '20:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 30 Nov', timeStr: '19:00', status: 'finished' },
      },
    },
    {
      round: 24,
      name: 'Abu Dhabi Grand Prix',
      officialName: 'FORMULA 1 ETIHAD AIRWAYS ABU DHABI GRAND PRIX 2025',
      circuit: 'Yas Marina Circuit',
      location: 'Yas Island',
      country: 'United Arab Emirates',
      countryCode: 'AE',
      flag: '🇦🇪',
      dates: '05 – 07 Dec 2025',
      season: 2025,
      status: 'completed',
      hasSprint: !1,
      laps: 58,
      circuitLengthKm: 5.281,
      raceDistanceKm: 306.183,
      lapRecord: { time: '1:26.103', driver: 'Max Verstappen', year: 2021 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 05 Dec', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 05 Dec', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 06 Dec', timeStr: '14:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 06 Dec',
          timeStr: '18:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 07 Dec', timeStr: '17:00', status: 'finished' },
      },
    },
  ],
  he = [
    {
      round: 1,
      name: 'Australian Grand Prix',
      officialName: 'Formula 1 Qatar Airways Australian Grand Prix 2026',
      circuit: 'Albert Park Grand Prix Circuit',
      location: 'Melbourne',
      country: 'Australia',
      countryCode: 'AU',
      flag: '🇦🇺',
      dates: '06 – 08 Mar 2026',
      season: 2026,
      status: 'completed',
      hasSprint: !1,
      venueUtcOffset: 11,
      laps: 58,
      circuitLengthKm: 5.278,
      raceDistanceKm: 306.124,
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 06 Mar', timeStr: '12:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 06 Mar', timeStr: '16:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 07 Mar', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 07 Mar',
          timeStr: '15:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 08 Mar', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 2,
      name: 'Chinese Grand Prix',
      officialName: 'Formula 1 Heineken Chinese Grand Prix 2026',
      circuit: 'Shanghai International Circuit',
      location: 'Shanghai',
      country: 'China',
      countryCode: 'CN',
      flag: '🇨🇳',
      dates: '13 – 15 Mar 2026',
      season: 2026,
      status: 'completed',
      hasSprint: !0,
      venueUtcOffset: 8,
      laps: 56,
      circuitLengthKm: 5.451,
      raceDistanceKm: 305.256,
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 13 Mar', timeStr: '12:30', status: 'finished' },
        sprintQualifying: {
          name: 'Sprint Qualifying',
          dateStr: 'Fri 13 Mar',
          timeStr: '15:30',
          status: 'finished',
        },
        sprint: { name: 'Sprint', dateStr: 'Sat 14 Mar', timeStr: '11:00', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 14 Mar',
          timeStr: '15:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 15 Mar', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 3,
      name: 'Japanese Grand Prix',
      officialName: 'Formula 1 Aramco Japanese Grand Prix 2026',
      circuit: 'Suzuka International Racing Course',
      location: 'Suzuka',
      country: 'Japan',
      countryCode: 'JP',
      flag: '🇯🇵',
      dates: '27 – 29 Mar 2026',
      season: 2026,
      status: 'completed',
      hasSprint: !1,
      venueUtcOffset: 9,
      laps: 53,
      circuitLengthKm: 5.807,
      raceDistanceKm: 307.771,
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 27 Mar', timeStr: '11:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 27 Mar', timeStr: '15:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 28 Mar', timeStr: '11:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 28 Mar',
          timeStr: '15:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 29 Mar', timeStr: '14:00', status: 'finished' },
      },
    },
    {
      round: 4,
      name: 'Miami Grand Prix',
      officialName: 'Formula 1 Crypto.com Miami Grand Prix 2026',
      circuit: 'Miami International Autodrome',
      location: 'Miami Gardens',
      country: 'United States',
      countryCode: 'US',
      flag: '🇺🇸',
      dates: '01 – 03 May 2026',
      season: 2026,
      status: 'completed',
      hasSprint: !0,
      venueUtcOffset: -4,
      laps: 57,
      circuitLengthKm: 5.412,
      raceDistanceKm: 308.484,
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 01 May', timeStr: '12:30', status: 'finished' },
        sprintQualifying: {
          name: 'Sprint Qualifying',
          dateStr: 'Fri 01 May',
          timeStr: '15:30',
          status: 'finished',
        },
        sprint: { name: 'Sprint', dateStr: 'Sat 02 May', timeStr: '11:00', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 02 May',
          timeStr: '15:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 03 May', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 5,
      name: 'Canadian Grand Prix',
      officialName: 'Formula 1 Lenovo Grand Prix du Canada 2026',
      circuit: 'Circuit Gilles-Villeneuve',
      location: 'Montréal',
      country: 'Canada',
      countryCode: 'CA',
      flag: '🇨🇦',
      dates: '22 – 24 May 2026',
      season: 2026,
      status: 'completed',
      hasSprint: !0,
      venueUtcOffset: -4,
      laps: 68,
      circuitLengthKm: 4.361,
      raceDistanceKm: 296.548,
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 22 May', timeStr: '12:30', status: 'finished' },
        sprintQualifying: {
          name: 'Sprint Qualifying',
          dateStr: 'Fri 22 May',
          timeStr: '15:30',
          status: 'finished',
        },
        sprint: { name: 'Sprint', dateStr: 'Sat 23 May', timeStr: '11:00', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 23 May',
          timeStr: '15:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 24 May', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 6,
      name: 'Monaco Grand Prix',
      officialName: 'Formula 1 Louis Vuitton Grand Prix de Monaco 2026',
      circuit: 'Circuit de Monaco',
      location: 'Monte Carlo',
      country: 'Monaco',
      countryCode: 'MC',
      flag: '🇲🇨',
      dates: '05 – 07 Jun 2026',
      season: 2026,
      status: 'completed',
      hasSprint: !1,
      venueUtcOffset: 2,
      laps: 78,
      circuitLengthKm: 3.337,
      raceDistanceKm: 260.286,
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 05 Jun', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 05 Jun', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 06 Jun', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 06 Jun',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 07 Jun', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 7,
      name: 'Barcelona-Catalunya Grand Prix',
      officialName: 'Formula 1 MSC Cruises Gran Premio de Barcelona-Catalunya 2026',
      circuit: 'Circuit de Barcelona-Catalunya',
      location: 'Barcelona',
      country: 'Spain',
      countryCode: 'ES',
      flag: '🇪🇸',
      dates: '12 – 14 Jun 2026',
      season: 2026,
      status: 'completed',
      hasSprint: !1,
      venueUtcOffset: 2,
      laps: 66,
      circuitLengthKm: 4.657,
      raceDistanceKm: 307.362,
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 12 Jun', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 12 Jun', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 13 Jun', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 13 Jun',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 14 Jun', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 8,
      name: 'Austrian Grand Prix',
      officialName: 'Formula 1 Lenovo Austrian Grand Prix 2026',
      circuit: 'Red Bull Ring',
      location: 'Spielberg',
      country: 'Austria',
      countryCode: 'AT',
      flag: '🇦🇹',
      dates: '26 – 28 Jun 2026',
      season: 2026,
      status: 'completed',
      hasSprint: !1,
      venueUtcOffset: 2,
      laps: 71,
      circuitLengthKm: 4.318,
      raceDistanceKm: 306.578,
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 26 Jun', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 26 Jun', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 27 Jun', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 27 Jun',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 28 Jun', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 9,
      name: 'British Grand Prix',
      officialName: 'Formula 1 Pirelli British Grand Prix 2026',
      circuit: 'Silverstone Circuit',
      location: 'Silverstone',
      country: 'United Kingdom',
      countryCode: 'GB',
      flag: '🇬🇧',
      dates: '03 – 05 Jul 2026',
      season: 2026,
      status: 'completed',
      hasSprint: !0,
      venueUtcOffset: 1,
      laps: 52,
      circuitLengthKm: 5.891,
      raceDistanceKm: 306.332,
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 03 Jul', timeStr: '12:30', status: 'finished' },
        sprintQualifying: {
          name: 'Sprint Qualifying',
          dateStr: 'Fri 03 Jul',
          timeStr: '15:30',
          status: 'finished',
        },
        sprint: { name: 'Sprint', dateStr: 'Sat 04 Jul', timeStr: '11:00', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 04 Jul',
          timeStr: '15:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 05 Jul', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 10,
      name: 'Belgian Grand Prix',
      officialName: 'Formula 1 Moët & Chandon Belgian Grand Prix 2026',
      circuit: 'Circuit de Spa-Francorchamps',
      location: 'Stavelot',
      country: 'Belgium',
      countryCode: 'BE',
      flag: '🇧🇪',
      dates: '17 – 19 Jul 2026',
      season: 2026,
      status: 'completed',
      hasSprint: !1,
      venueUtcOffset: 2,
      laps: 44,
      circuitLengthKm: 7.004,
      raceDistanceKm: 308.176,
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 17 Jul', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 17 Jul', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 18 Jul', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 18 Jul',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 19 Jul', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 11,
      name: 'Hungarian Grand Prix',
      officialName: 'Formula 1 AWS Hungarian Grand Prix 2026',
      circuit: 'Hungaroring',
      location: 'Mogyoród',
      country: 'Hungary',
      countryCode: 'HU',
      flag: '🇭🇺',
      dates: '24 – 26 Jul 2026',
      season: 2026,
      status: 'completed',
      hasSprint: !1,
      venueUtcOffset: 2,
      laps: 70,
      circuitLengthKm: 4.381,
      raceDistanceKm: 306.67,
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 24 Jul', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 24 Jul', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 25 Jul', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 25 Jul',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 26 Jul', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 12,
      name: 'Dutch Grand Prix',
      officialName: 'Formula 1 Heineken Dutch Grand Prix 2026',
      circuit: 'Circuit Zandvoort',
      location: 'Zandvoort',
      country: 'Netherlands',
      countryCode: 'NL',
      flag: '🇳🇱',
      dates: '21 – 23 Aug 2026',
      season: 2026,
      status: 'completed',
      hasSprint: !0,
      venueUtcOffset: 2,
      laps: 72,
      circuitLengthKm: 4.259,
      raceDistanceKm: 306.648,
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 21 Aug', timeStr: '12:30', status: 'finished' },
        sprintQualifying: {
          name: 'Sprint Qualifying',
          dateStr: 'Fri 21 Aug',
          timeStr: '15:30',
          status: 'finished',
        },
        sprint: { name: 'Sprint', dateStr: 'Sat 22 Aug', timeStr: '11:00', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 22 Aug',
          timeStr: '15:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 23 Aug', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 13,
      name: 'Italian Grand Prix',
      officialName: 'Formula 1 Pirelli Gran Premio d’Italia 2026',
      circuit: 'Autodromo Nazionale Monza',
      location: 'Monza',
      country: 'Italy',
      countryCode: 'IT',
      flag: '🇮🇹',
      dates: '04 – 06 Sep 2026',
      season: 2026,
      status: 'completed',
      hasSprint: !1,
      venueUtcOffset: 2,
      laps: 53,
      circuitLengthKm: 5.793,
      raceDistanceKm: 307.029,
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 04 Sep', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 04 Sep', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 05 Sep', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 05 Sep',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 06 Sep', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 14,
      name: 'Spanish Grand Prix',
      officialName: 'Formula 1 TAG Heuer Gran Premio de España 2026',
      circuit: 'Madring',
      location: 'Madrid',
      country: 'Spain',
      countryCode: 'ES',
      flag: '🇪🇸',
      dates: '11 – 13 Sep 2026',
      season: 2026,
      status: 'completed',
      hasSprint: !1,
      venueUtcOffset: 2,
      laps: 57,
      circuitLengthKm: 5.474,
      raceDistanceKm: 312.018,
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 11 Sep', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 11 Sep', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 12 Sep', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 12 Sep',
          timeStr: '16:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 13 Sep', timeStr: '15:00', status: 'finished' },
      },
    },
    {
      round: 15,
      name: 'Azerbaijan Grand Prix',
      officialName: 'Formula 1 Qatar Airways Azerbaijan Grand Prix 2026',
      circuit: 'Baku City Circuit',
      location: 'Baku',
      country: 'Azerbaijan',
      countryCode: 'AZ',
      flag: '🇦🇿',
      dates: '24 – 26 Sep 2026',
      season: 2026,
      status: 'completed',
      hasSprint: !1,
      venueUtcOffset: 4,
      laps: 51,
      circuitLengthKm: 6.003,
      raceDistanceKm: 306.049,
      lapRecord: { time: '1:43.009', driver: 'Charles Leclerc', year: 2019 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Thu 24 Sep', timeStr: '13:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Thu 24 Sep', timeStr: '17:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Fri 25 Sep', timeStr: '12:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Fri 25 Sep',
          timeStr: '16:00',
          status: 'finished',
        },
        race: {
          name: 'Grand Prix Race',
          dateStr: 'Sat 26 Sep',
          timeStr: '15:00',
          status: 'finished',
        },
      },
    },
    {
      round: 16,
      name: 'Malaysia Grand Prix',
      officialName: 'Formula 1 Petronas Malaysia Grand Prix 2026',
      circuit: 'Sepang International Circuit',
      location: 'Kuala Lumpur',
      country: 'Malaysia',
      countryCode: 'MY',
      flag: '🇲🇾',
      dates: '02 – 04 Oct 2026',
      season: 2026,
      status: 'completed',
      hasSprint: !1,
      venueUtcOffset: 8,
      laps: 56,
      circuitLengthKm: 5.543,
      raceDistanceKm: 310.408,
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 02 Oct', timeStr: '11:30', status: 'finished' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 02 Oct', timeStr: '15:00', status: 'finished' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 03 Oct', timeStr: '11:30', status: 'finished' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 03 Oct',
          timeStr: '15:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 04 Oct', timeStr: '14:00', status: 'finished' },
      },
    },
    {
      round: 17,
      name: 'Singapore Grand Prix',
      officialName: 'Formula 1 Singapore Airlines Singapore Grand Prix 2026',
      circuit: 'Marina Bay Street Circuit',
      location: 'Marina Bay',
      country: 'Singapore',
      countryCode: 'SG',
      flag: '🇸🇬',
      dates: '09 – 11 Oct 2026',
      season: 2026,
      status: 'completed',
      hasSprint: !0,
      venueUtcOffset: 8,
      laps: 62,
      circuitLengthKm: 4.94,
      raceDistanceKm: 306.143,
      lapRecord: { time: '1:34.486', driver: 'Daniel Ricciardo', year: 2024 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 09 Oct', timeStr: '16:30', status: 'finished' },
        sprintQualifying: {
          name: 'Sprint Qualifying',
          dateStr: 'Fri 09 Oct',
          timeStr: '20:30',
          status: 'finished',
        },
        sprint: {
          name: 'Sprint Race',
          dateStr: 'Sat 10 Oct',
          timeStr: '17:00',
          status: 'finished',
        },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 10 Oct',
          timeStr: '21:00',
          status: 'finished',
        },
        race: { name: 'Race', dateStr: 'Sun 11 Oct', timeStr: '20:00', status: 'finished' },
      },
    },
    {
      round: 18,
      name: 'United States Grand Prix',
      officialName: 'Formula 1 Pirelli United States Grand Prix 2026',
      circuit: 'Circuit of The Americas',
      location: 'Austin, Texas',
      country: 'United States',
      countryCode: 'US',
      flag: '🇺🇸',
      dates: '23 – 25 Oct 2026',
      season: 2026,
      status: 'upcoming',
      hasSprint: !1,
      venueUtcOffset: -5,
      laps: 56,
      circuitLengthKm: 5.513,
      raceDistanceKm: 308.405,
      lapRecord: { time: '1:36.169', driver: 'Charles Leclerc', year: 2019 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 23 Oct', timeStr: '12:30', status: 'scheduled' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 23 Oct', timeStr: '16:30', status: 'scheduled' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 24 Oct', timeStr: '13:00', status: 'scheduled' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 24 Oct',
          timeStr: '17:00',
          status: 'scheduled',
        },
        race: { name: 'Race', dateStr: 'Sun 25 Oct', timeStr: '14:00', status: 'scheduled' },
      },
    },
    {
      round: 19,
      name: 'Mexico City Grand Prix',
      officialName: 'Formula 1 Gran Premio de la Ciudad de México 2026',
      circuit: 'Autódromo Hermanos Rodríguez',
      location: 'Mexico City',
      country: 'Mexico',
      countryCode: 'MX',
      flag: '🇲🇽',
      dates: '30 Oct – 01 Nov 2026',
      season: 2026,
      status: 'upcoming',
      hasSprint: !1,
      venueUtcOffset: -6,
      laps: 71,
      circuitLengthKm: 4.304,
      raceDistanceKm: 305.354,
      lapRecord: { time: '1:17.774', driver: 'Valtteri Bottas', year: 2021 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 30 Oct', timeStr: '12:30', status: 'scheduled' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 30 Oct', timeStr: '16:00', status: 'scheduled' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 31 Oct', timeStr: '11:30', status: 'scheduled' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 31 Oct',
          timeStr: '15:00',
          status: 'scheduled',
        },
        race: { name: 'Race', dateStr: 'Sun 01 Nov', timeStr: '14:00', status: 'scheduled' },
      },
    },
    {
      round: 20,
      name: 'São Paulo Grand Prix',
      officialName: 'Formula 1 Lenovo Grande Prêmio de São Paulo 2026',
      circuit: 'Autódromo José Carlos Pace (Interlagos)',
      location: 'São Paulo',
      country: 'Brazil',
      countryCode: 'BR',
      flag: '🇧🇷',
      dates: '06 – 08 Nov 2026',
      season: 2026,
      status: 'upcoming',
      hasSprint: !1,
      venueUtcOffset: -3,
      laps: 71,
      circuitLengthKm: 4.309,
      raceDistanceKm: 305.879,
      lapRecord: { time: '1:10.540', driver: 'Valtteri Bottas', year: 2018 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 06 Nov', timeStr: '11:30', status: 'scheduled' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 06 Nov', timeStr: '15:30', status: 'scheduled' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 07 Nov', timeStr: '11:00', status: 'scheduled' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 07 Nov',
          timeStr: '15:00',
          status: 'scheduled',
        },
        race: { name: 'Race', dateStr: 'Sun 08 Nov', timeStr: '14:00', status: 'scheduled' },
      },
    },
    {
      round: 21,
      name: 'Las Vegas Grand Prix',
      officialName: 'Formula 1 Heineken Silver Las Vegas Grand Prix 2026',
      circuit: 'Las Vegas Strip Circuit',
      location: 'Las Vegas, Nevada',
      country: 'United States',
      countryCode: 'US',
      flag: '🇺🇸',
      dates: '19 – 21 Nov 2026',
      season: 2026,
      status: 'upcoming',
      hasSprint: !1,
      venueUtcOffset: -8,
      laps: 50,
      circuitLengthKm: 6.201,
      raceDistanceKm: 309.958,
      lapRecord: { time: '1:35.490', driver: 'Oscar Piastri', year: 2023 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Thu 19 Nov', timeStr: '18:30', status: 'scheduled' },
        fp2: { name: 'Practice 2', dateStr: 'Thu 19 Nov', timeStr: '22:00', status: 'scheduled' },
        fp3: { name: 'Practice 3', dateStr: 'Fri 20 Nov', timeStr: '18:30', status: 'scheduled' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Fri 20 Nov',
          timeStr: '22:00',
          status: 'scheduled',
        },
        race: { name: 'Race', dateStr: 'Sat 21 Nov', timeStr: '22:00', status: 'scheduled' },
      },
    },
    {
      round: 22,
      name: 'Qatar Grand Prix',
      officialName: 'Formula 1 Qatar Airways Qatar Grand Prix 2026',
      circuit: 'Lusail International Circuit',
      location: 'Lusail',
      country: 'Qatar',
      countryCode: 'QA',
      flag: '🇶🇦',
      dates: '27 – 29 Nov 2026',
      season: 2026,
      status: 'upcoming',
      hasSprint: !1,
      venueUtcOffset: 3,
      laps: 57,
      circuitLengthKm: 5.419,
      raceDistanceKm: 308.611,
      lapRecord: { time: '1:24.319', driver: 'Max Verstappen', year: 2023 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 27 Nov', timeStr: '16:30', status: 'scheduled' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 27 Nov', timeStr: '20:30', status: 'scheduled' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 28 Nov', timeStr: '16:00', status: 'scheduled' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 28 Nov',
          timeStr: '20:00',
          status: 'scheduled',
        },
        race: { name: 'Race', dateStr: 'Sun 29 Nov', timeStr: '19:00', status: 'scheduled' },
      },
    },
    {
      round: 23,
      name: 'Abu Dhabi Grand Prix',
      officialName: 'Formula 1 Etihad Airways Abu Dhabi Grand Prix 2026',
      circuit: 'Yas Marina Circuit',
      location: 'Yas Island',
      country: 'United Arab Emirates',
      countryCode: 'AE',
      flag: '🇦🇪',
      dates: '04 – 06 Dec 2026',
      season: 2026,
      status: 'upcoming',
      hasSprint: !1,
      venueUtcOffset: 4,
      laps: 58,
      circuitLengthKm: 5.281,
      raceDistanceKm: 306.183,
      lapRecord: { time: '1:26.103', driver: 'Max Verstappen', year: 2021 },
      sessions: {
        fp1: { name: 'Practice 1', dateStr: 'Fri 04 Dec', timeStr: '13:30', status: 'scheduled' },
        fp2: { name: 'Practice 2', dateStr: 'Fri 04 Dec', timeStr: '17:00', status: 'scheduled' },
        fp3: { name: 'Practice 3', dateStr: 'Sat 05 Dec', timeStr: '14:30', status: 'scheduled' },
        qualifying: {
          name: 'Qualifying',
          dateStr: 'Sat 05 Dec',
          timeStr: '18:00',
          status: 'scheduled',
        },
        race: { name: 'Race', dateStr: 'Sun 06 Dec', timeStr: '17:00', status: 'scheduled' },
      },
    },
  ],
  ii = (e) => {
    switch (e) {
      case 2024:
        return He;
      case 2025:
        return Ue;
      case 2026:
      default:
        return he;
    }
  },
  wa = {
    ferrari: {
      id: 'ferrari',
      name: 'Ferrari',
      fullName: 'Scuderia Ferrari HP',
      base: 'Maranello, Italy',
      teamPrincipal: 'Frédéric Vasseur',
      powerUnit: 'Ferrari 066/12 1.6L V6 Turbo Hybrid',
      primaryColor: '#dc0000',
      accentColor: '#ffe500',
      highlightColor: '#ffffff',
      drivers: ['leclerc', 'hamilton'],
    },
    mclaren: {
      id: 'mclaren',
      name: 'McLaren',
      fullName: 'McLaren Formula 1 Team',
      base: 'Woking, United Kingdom',
      teamPrincipal: 'Andrea Stella',
      powerUnit: 'Mercedes-AMG M15 1.6L V6 Turbo Hybrid',
      primaryColor: '#ff8000',
      accentColor: '#47c7fc',
      highlightColor: '#141416',
      drivers: ['norris', 'piastri'],
    },
    redbull: {
      id: 'redbull',
      name: 'Red Bull Racing',
      fullName: 'Oracle Red Bull Racing',
      base: 'Milton Keynes, United Kingdom',
      teamPrincipal: 'Christian Horner',
      powerUnit: 'Honda RBPTH002 1.6L V6 Turbo Hybrid',
      primaryColor: '#050f26',
      accentColor: '#e10600',
      highlightColor: '#fcd700',
      drivers: ['verstappen', 'hadjar'],
    },
    mercedes: {
      id: 'mercedes',
      name: 'Mercedes',
      fullName: 'Mercedes-AMG PETRONAS Formula One Team',
      base: 'Brackley, United Kingdom',
      teamPrincipal: 'Toto Wolff',
      powerUnit: 'Mercedes-AMG M15 1.6L V6 Turbo Hybrid',
      primaryColor: '#c8ccce',
      accentColor: '#00a19c',
      highlightColor: '#eb142b',
      drivers: ['russell', 'antonelli'],
    },
    astonmartin: {
      id: 'astonmartin',
      name: 'Aston Martin',
      fullName: 'Aston Martin Aramco Formula One Team',
      base: 'Silverstone, United Kingdom',
      teamPrincipal: 'Mike Krack',
      powerUnit: 'Mercedes-AMG M15 1.6L V6 Turbo Hybrid',
      primaryColor: '#00594f',
      accentColor: '#cedc00',
      highlightColor: '#0b1311',
      drivers: ['alonso', 'stroll'],
    },
    alpine: {
      id: 'alpine',
      name: 'Alpine',
      fullName: 'BWT Alpine Formula One Team',
      base: 'Enstone, United Kingdom / Viry, France',
      teamPrincipal: 'Oliver Oakes',
      powerUnit: 'Renault E-Tech RE25 1.6L V6 Turbo Hybrid',
      primaryColor: '#0090ff',
      accentColor: '#ff87bc',
      highlightColor: '#111827',
      drivers: ['gasly', 'colapinto'],
    },
    racingbulls: {
      id: 'racingbulls',
      name: 'Racing Bulls',
      fullName: 'Visa Cash App Racing Bulls Formula One Team',
      base: 'Faenza, Italy',
      teamPrincipal: 'Laurent Mekies',
      powerUnit: 'Honda RBPTH002 1.6L V6 Turbo Hybrid',
      primaryColor: '#1634cb',
      accentColor: '#ffffff',
      highlightColor: '#d90429',
      drivers: ['lawson', 'lindblad'],
    },
    haas: {
      id: 'haas',
      name: 'Haas',
      fullName: 'MoneyGram Haas F1 Team',
      base: 'Kannapolis, United States / Banbury, UK',
      teamPrincipal: 'Ayao Komatsu',
      powerUnit: 'Ferrari 066/12 1.6L V6 Turbo Hybrid',
      primaryColor: '#e5e7eb',
      accentColor: '#e6002b',
      highlightColor: '#18181b',
      drivers: ['ocon', 'bearman'],
    },
    williams: {
      id: 'williams',
      name: 'Williams',
      fullName: 'Williams Racing',
      base: 'Grove, United Kingdom',
      teamPrincipal: 'James Vowles',
      powerUnit: 'Mercedes-AMG M15 1.6L V6 Turbo Hybrid',
      primaryColor: '#002447',
      accentColor: '#00e5ff',
      highlightColor: '#00a0de',
      drivers: ['sainz', 'albon'],
    },
    audi: {
      id: 'audi',
      name: 'Audi',
      fullName: 'Audi Formula One Team',
      base: 'Hinwil, Switzerland / Neuburg, Germany',
      teamPrincipal: 'Mattia Binotto',
      powerUnit: 'Audi Sport F1 Power Unit',
      primaryColor: '#c4c8cc',
      accentColor: '#f50537',
      highlightColor: '#1c1917',
      drivers: ['hulkenberg', 'bortoleto'],
    },
    cadillac: {
      id: 'cadillac',
      name: 'Cadillac',
      fullName: 'Cadillac Formula 1 Team',
      base: 'Fishers, Indiana, United States / Silverstone, UK',
      teamPrincipal: 'Michael Andretti',
      powerUnit: 'Ferrari 066/12 / GM F1 Twin-Turbo V6 Hybrid',
      primaryColor: '#141518',
      accentColor: '#d4af37',
      highlightColor: '#3a3d45',
      drivers: ['perez', 'bottas'],
    },
  },
  Oa = {
    ferrari: '/images/teams/sf24.webp',
    mclaren: '/images/teams/mcl38.webp',
    redbull: '/images/teams/rb20.webp',
    mercedes: '/images/teams/w15.webp',
    astonmartin: '/images/teams/astonmartin.webp',
    alpine: '/images/teams/alpine.webp',
    racingbulls: '/images/teams/racingbulls.webp',
    haas: '/images/teams/haas.webp',
    williams: '/images/teams/williams.webp',
    audi: '/images/teams/audi.webp',
    cadillac: '/images/teams/cadillac.webp',
  },
  de = Object.fromEntries(
    Object.entries(wa).map(([e, r]) => [e, { ...r, imageUrl: Oa[e] || `/images/teams/${e}.webp` }]),
  ),
  Ga = {
    17: {
      round: 17,
      grandPrix: 'Singapore Grand Prix',
      season: 2026,
      circuit: 'Singapore',
      sessions: {
        fp1: {
          sessionKey: 'fp1',
          sessionName: 'Practice 1',
          dateStr: '2026-10-09T08:30:00.000Z',
          status: 'finished',
          fastestDriver: { driver: 'George Russell', team: 'Mercedes', time: '1:32.274' },
          entries: [
            {
              position: 1,
              driverId: 'russell',
              driverName: 'George Russell',
              driverCode: 'RUS',
              driverNumber: 63,
              teamId: 'mercedes',
              teamName: 'Mercedes',
              lapsCompleted: 28,
              bestLapTime: '1:32.274',
              gapToP1: 'LEADER',
            },
            {
              position: 2,
              driverId: 'leclerc',
              driverName: 'Charles Leclerc',
              driverCode: 'LEC',
              driverNumber: 16,
              teamId: 'ferrari',
              teamName: 'Ferrari',
              lapsCompleted: 26,
              bestLapTime: '1:32.472',
              gapToP1: '+0.198s',
            },
            {
              position: 3,
              driverId: 'norris',
              driverName: 'Lando Norris',
              driverCode: 'NOR',
              driverNumber: 1,
              teamId: 'mclaren',
              teamName: 'McLaren',
              lapsCompleted: 24,
              bestLapTime: '1:32.547',
              gapToP1: '+0.273s',
            },
            {
              position: 4,
              driverId: 'hamilton',
              driverName: 'Lewis Hamilton',
              driverCode: 'HAM',
              driverNumber: 44,
              teamId: 'ferrari',
              teamName: 'Ferrari',
              lapsCompleted: 26,
              bestLapTime: '1:32.773',
              gapToP1: '+0.499s',
            },
            {
              position: 5,
              driverId: 'piastri',
              driverName: 'Oscar Piastri',
              driverCode: 'PIA',
              driverNumber: 81,
              teamId: 'mclaren',
              teamName: 'McLaren',
              lapsCompleted: 27,
              bestLapTime: '1:32.838',
              gapToP1: '+0.564s',
            },
            {
              position: 6,
              driverId: 'verstappen',
              driverName: 'Max Verstappen',
              driverCode: 'VER',
              driverNumber: 3,
              teamId: 'redbull',
              teamName: 'Red Bull Racing',
              lapsCompleted: 22,
              bestLapTime: '1:33.006',
              gapToP1: '+0.732s',
            },
            {
              position: 7,
              driverId: 'antonelli',
              driverName: 'Andrea Kimi Antonelli',
              driverCode: 'ANT',
              driverNumber: 12,
              teamId: 'mercedes',
              teamName: 'Mercedes',
              lapsCompleted: 28,
              bestLapTime: '1:33.525',
              gapToP1: '+1.251s',
            },
            {
              position: 8,
              driverId: 'hadjar',
              driverName: 'Isack Hadjar',
              driverCode: 'HAD',
              driverNumber: 6,
              teamId: 'redbull',
              teamName: 'Red Bull Racing',
              lapsCompleted: 27,
              bestLapTime: '1:33.723',
              gapToP1: '+1.449s',
            },
            {
              position: 9,
              driverId: 'gasly',
              driverName: 'Pierre Gasly',
              driverCode: 'GAS',
              driverNumber: 10,
              teamId: 'alpine',
              teamName: 'Alpine',
              lapsCompleted: 26,
              bestLapTime: '1:34.038',
              gapToP1: '+1.764s',
            },
            {
              position: 10,
              driverId: 'lawson',
              driverName: 'Liam Lawson',
              driverCode: 'LAW',
              driverNumber: 30,
              teamId: 'racingbulls',
              teamName: 'Racing Bulls',
              lapsCompleted: 25,
              bestLapTime: '1:34.155',
              gapToP1: '+1.881s',
            },
            {
              position: 11,
              driverId: 'bearman',
              driverName: 'Oliver Bearman',
              driverCode: 'BEA',
              driverNumber: 87,
              teamId: 'haas',
              teamName: 'Haas F1 Team',
              lapsCompleted: 29,
              bestLapTime: '1:34.331',
              gapToP1: '+2.057s',
            },
            {
              position: 12,
              driverId: 'lindblad',
              driverName: 'Arvid Lindblad',
              driverCode: 'LIN',
              driverNumber: 41,
              teamId: 'racingbulls',
              teamName: 'Racing Bulls',
              lapsCompleted: 27,
              bestLapTime: '1:34.476',
              gapToP1: '+2.202s',
            },
            {
              position: 13,
              driverId: 'ocon',
              driverName: 'Esteban Ocon',
              driverCode: 'OCO',
              driverNumber: 31,
              teamId: 'haas',
              teamName: 'Haas F1 Team',
              lapsCompleted: 25,
              bestLapTime: '1:34.481',
              gapToP1: '+2.207s',
            },
            {
              position: 14,
              driverId: 'alonso',
              driverName: 'Fernando Alonso',
              driverCode: 'ALO',
              driverNumber: 14,
              teamId: 'astonmartin',
              teamName: 'Aston Martin',
              lapsCompleted: 27,
              bestLapTime: '1:34.495',
              gapToP1: '+2.221s',
            },
            {
              position: 15,
              driverId: 'sainz',
              driverName: 'Carlos Sainz',
              driverCode: 'SAI',
              driverNumber: 55,
              teamId: 'williams',
              teamName: 'Williams',
              lapsCompleted: 31,
              bestLapTime: '1:34.651',
              gapToP1: '+2.377s',
            },
            {
              position: 16,
              driverId: 'bortoleto',
              driverName: 'Gabriel Bortoleto',
              driverCode: 'BOR',
              driverNumber: 5,
              teamId: 'audi',
              teamName: 'Audi',
              lapsCompleted: 25,
              bestLapTime: '1:34.736',
              gapToP1: '+2.462s',
            },
            {
              position: 17,
              driverId: 'albon',
              driverName: 'Alexander Albon',
              driverCode: 'ALB',
              driverNumber: 23,
              teamId: 'williams',
              teamName: 'Williams',
              lapsCompleted: 30,
              bestLapTime: '1:34.805',
              gapToP1: '+2.531s',
            },
            {
              position: 18,
              driverId: 'hulkenberg',
              driverName: 'Nico Hülkenberg',
              driverCode: 'HUL',
              driverNumber: 27,
              teamId: 'audi',
              teamName: 'Audi',
              lapsCompleted: 16,
              bestLapTime: '1:34.884',
              gapToP1: '+2.610s',
            },
            {
              position: 19,
              driverId: 'colapinto',
              driverName: 'Franco Colapinto',
              driverCode: 'COL',
              driverNumber: 43,
              teamId: 'alpine',
              teamName: 'Alpine',
              lapsCompleted: 27,
              bestLapTime: '1:34.983',
              gapToP1: '+2.709s',
            },
            {
              position: 20,
              driverId: 'stroll',
              driverName: 'Lance Stroll',
              driverCode: 'STR',
              driverNumber: 18,
              teamId: 'astonmartin',
              teamName: 'Aston Martin',
              lapsCompleted: 26,
              bestLapTime: '1:35.268',
              gapToP1: '+2.994s',
            },
            {
              position: 21,
              driverId: 'perez',
              driverName: 'Sergio Pérez',
              driverCode: 'PER',
              driverNumber: 11,
              teamId: 'cadillac',
              teamName: 'Cadillac',
              lapsCompleted: 21,
              bestLapTime: '1:35.299',
              gapToP1: '+3.025s',
            },
            {
              position: 22,
              driverId: 'bottas',
              driverName: 'Valtteri Bottas',
              driverCode: 'BOT',
              driverNumber: 77,
              teamId: 'cadillac',
              teamName: 'Cadillac',
              lapsCompleted: 25,
              bestLapTime: '1:35.620',
              gapToP1: '+3.346s',
            },
          ],
        },
      },
    },
  },
  Ea = JSON.parse(
    '{"17":{"round":17,"grandPrix":"Singapore Grand Prix","season":2026,"circuit":"Marina Bay Street Circuit","sessions":{"sprintQualifying":{"sessionKey":"sprintQualifying","sessionName":"Sprint Qualifying","dateStr":"2026-10-09T12:30:00.000Z","status":"finished","poleDriver":{"driver":"Max Verstappen","team":"Red Bull Racing","time":"1:31.156"},"entries":[{"position":1,"driverId":"verstappen","driverName":"Max Verstappen","driverCode":"VER","driverNumber":3,"teamId":"redbull","teamName":"Red Bull Racing","lapsCompleted":15,"bestLapTime":"1:31.156","q1Time":"1:33.477","q2Time":"1:32.701","q3Time":"1:31.156","gapToPole":"POLE"},{"position":2,"driverId":"russell","driverName":"George Russell","driverCode":"RUS","driverNumber":63,"teamId":"mercedes","teamName":"Mercedes","lapsCompleted":21,"bestLapTime":"1:31.276","q1Time":"1:33.573","q2Time":"1:32.614","q3Time":"1:31.276","gapToPole":"+0.120s"},{"position":3,"driverId":"leclerc","driverName":"Charles Leclerc","driverCode":"LEC","driverNumber":16,"teamId":"ferrari","teamName":"Ferrari","lapsCompleted":19,"bestLapTime":"1:31.399","q1Time":"1:33.495","q2Time":"1:32.246","q3Time":"1:31.399","gapToPole":"+0.243s"},{"position":4,"driverId":"piastri","driverName":"Oscar Piastri","driverCode":"PIA","driverNumber":81,"teamId":"mclaren","teamName":"McLaren","lapsCompleted":19,"bestLapTime":"1:31.454","q1Time":"1:34.277","q2Time":"1:33.106","q3Time":"1:31.454","gapToPole":"+0.298s"},{"position":5,"driverId":"norris","driverName":"Lando Norris","driverCode":"NOR","driverNumber":1,"teamId":"mclaren","teamName":"McLaren","lapsCompleted":15,"bestLapTime":"1:31.587","q1Time":"1:34.257","q2Time":"1:32.572","q3Time":"1:31.587","gapToPole":"+0.431s"},{"position":6,"driverId":"hamilton","driverName":"Lewis Hamilton","driverCode":"HAM","driverNumber":44,"teamId":"ferrari","teamName":"Ferrari","lapsCompleted":14,"bestLapTime":"1:31.702","q1Time":"1:33.748","q2Time":"1:32.562","q3Time":"1:31.702","gapToPole":"+0.546s"},{"position":7,"driverId":"antonelli","driverName":"Andrea Kimi Antonelli","driverCode":"ANT","driverNumber":12,"teamId":"mercedes","teamName":"Mercedes","lapsCompleted":20,"bestLapTime":"1:31.849","q1Time":"1:34.392","q2Time":"1:32.998","q3Time":"1:31.849","gapToPole":"+0.693s"},{"position":8,"driverId":"lawson","driverName":"Liam Lawson","driverCode":"LAW","driverNumber":30,"teamId":"racingbulls","teamName":"Racing Bulls","lapsCompleted":15,"bestLapTime":"1:32.341","q1Time":"1:34.855","q2Time":"1:33.133","q3Time":"1:32.341","gapToPole":"+1.185s"},{"position":9,"driverId":"hadjar","driverName":"Isack Hadjar","driverCode":"HAD","driverNumber":6,"teamId":"redbull","teamName":"Red Bull Racing","lapsCompleted":15,"bestLapTime":"1:32.947","q1Time":"1:34.182","q2Time":"1:32.947","gapToPole":"+1.791s"},{"position":10,"driverId":"gasly","driverName":"Pierre Gasly","driverCode":"GAS","driverNumber":10,"teamId":"alpine","teamName":"Alpine","lapsCompleted":15,"bestLapTime":"1:33.155","q1Time":"1:34.673","q2Time":"1:33.155","gapToPole":"+1.999s"},{"position":11,"driverId":"colapinto","driverName":"Franco Colapinto","driverCode":"COL","driverNumber":43,"teamId":"alpine","teamName":"Alpine","lapsCompleted":12,"bestLapTime":"1:33.249","q1Time":"1:35.048","q2Time":"1:33.249","gapToPole":"+2.093s"},{"position":12,"driverId":"hulkenberg","driverName":"Nico Hülkenberg","driverCode":"HUL","driverNumber":27,"teamId":"audi","teamName":"Audi","lapsCompleted":14,"bestLapTime":"1:33.420","q1Time":"1:34.128","q2Time":"1:33.420","gapToPole":"+2.264s"},{"position":13,"driverId":"bearman","driverName":"Oliver Bearman","driverCode":"BEA","driverNumber":87,"teamId":"haas","teamName":"Haas F1 Team","lapsCompleted":12,"bestLapTime":"1:33.423","q1Time":"1:34.950","q2Time":"1:33.423","gapToPole":"+2.267s"},{"position":14,"driverId":"bortoleto","driverName":"Gabriel Bortoleto","driverCode":"BOR","driverNumber":5,"teamId":"audi","teamName":"Audi","lapsCompleted":14,"bestLapTime":"1:33.466","q1Time":"1:34.690","q2Time":"1:33.466","gapToPole":"+2.310s"},{"position":15,"driverId":"alonso","driverName":"Fernando Alonso","driverCode":"ALO","driverNumber":14,"teamId":"astonmartin","teamName":"Aston Martin","lapsCompleted":12,"bestLapTime":"1:33.734","q1Time":"1:34.960","q2Time":"1:33.734","gapToPole":"+2.578s"},{"position":16,"driverId":"ocon","driverName":"Esteban Ocon","driverCode":"OCO","driverNumber":31,"teamId":"haas","teamName":"Haas F1 Team","lapsCompleted":12,"bestLapTime":"1:34.368","q1Time":"1:35.004","q2Time":"1:34.368","gapToPole":"+3.212s"},{"position":17,"driverId":"lindblad","driverName":"Arvid Lindblad","driverCode":"LIN","driverNumber":41,"teamId":"racingbulls","teamName":"Racing Bulls","lapsCompleted":6,"bestLapTime":"1:35.136","q1Time":"1:35.136","gapToPole":"+3.980s"},{"position":18,"driverId":"stroll","driverName":"Lance Stroll","driverCode":"STR","driverNumber":18,"teamId":"astonmartin","teamName":"Aston Martin","lapsCompleted":6,"bestLapTime":"1:35.662","q1Time":"1:35.662","gapToPole":"+4.506s"},{"position":19,"driverId":"albon","driverName":"Alexander Albon","driverCode":"ALB","driverNumber":23,"teamId":"williams","teamName":"Williams","lapsCompleted":7,"bestLapTime":"1:36.130","q1Time":"1:36.130","gapToPole":"+4.974s"},{"position":20,"driverId":"perez","driverName":"Sergio Pérez","driverCode":"PER","driverNumber":11,"teamId":"cadillac","teamName":"Cadillac","lapsCompleted":8,"bestLapTime":"1:36.760","q1Time":"1:36.760","gapToPole":"+5.604s"},{"position":21,"driverId":"bottas","driverName":"Valtteri Bottas","driverCode":"BOT","driverNumber":77,"teamId":"cadillac","teamName":"Cadillac","lapsCompleted":9,"bestLapTime":"1:36.868","q1Time":"1:36.868","gapToPole":"+5.712s"},{"position":22,"driverId":"sainz","driverName":"Carlos Sainz","driverCode":"SAI","driverNumber":55,"teamId":"williams","teamName":"Williams","lapsCompleted":7,"bestLapTime":"1:37.376","q1Time":"1:37.376","gapToPole":"+6.220s"}]},"sprint":{"sessionKey":"sprint","sessionName":"Sprint","dateStr":"2026-10-11","status":"finished","poleDriver":{"driver":"Max Verstappen","team":"Red Bull","time":"LEADER"},"entries":[{"position":1,"driverId":"verstappen","driverName":"Max Verstappen","driverCode":"VER","driverNumber":3,"teamId":"redbull","teamName":"Red Bull","lapsCompleted":20,"bestLapTime":"LEADER","gapToPole":"LEADER","sprintPoints":8},{"position":2,"driverId":"hamilton","driverName":"Lewis Hamilton","driverCode":"HAM","driverNumber":44,"teamId":"ferrari","teamName":"Ferrari","lapsCompleted":20,"bestLapTime":"+2.591s","gapToPole":"+2.591s","sprintPoints":7},{"position":3,"driverId":"leclerc","driverName":"Charles Leclerc","driverCode":"LEC","driverNumber":16,"teamId":"ferrari","teamName":"Ferrari","lapsCompleted":20,"bestLapTime":"+16.871s","gapToPole":"+16.871s","sprintPoints":6},{"position":4,"driverId":"antonelli","driverName":"Andrea Kimi Antonelli","driverCode":"ANT","driverNumber":12,"teamId":"mercedes","teamName":"Mercedes","lapsCompleted":20,"bestLapTime":"+17.238s","gapToPole":"+17.238s","sprintPoints":5},{"position":5,"driverId":"lawson","driverName":"Liam Lawson","driverCode":"LAW","driverNumber":30,"teamId":"racingbulls","teamName":"RB F1 Team","lapsCompleted":20,"bestLapTime":"+20.632s","gapToPole":"+20.632s","sprintPoints":4},{"position":6,"driverId":"bearman","driverName":"Oliver Bearman","driverCode":"BEA","driverNumber":87,"teamId":"haas","teamName":"Haas F1 Team","lapsCompleted":20,"bestLapTime":"+24.321s","gapToPole":"+24.321s","sprintPoints":3},{"position":7,"driverId":"hulkenberg","driverName":"Nico Hülkenberg","driverCode":"HUL","driverNumber":27,"teamId":"audi","teamName":"Audi","lapsCompleted":20,"bestLapTime":"+27.525s","gapToPole":"+27.525s","sprintPoints":2},{"position":8,"driverId":"norris","driverName":"Lando Norris","driverCode":"NOR","driverNumber":1,"teamId":"mclaren","teamName":"McLaren","lapsCompleted":20,"bestLapTime":"+28.272s","gapToPole":"+28.272s","sprintPoints":1},{"position":9,"driverId":"gasly","driverName":"Pierre Gasly","driverCode":"GAS","driverNumber":10,"teamId":"alpine","teamName":"Alpine F1 Team","lapsCompleted":20,"bestLapTime":"+36.220s","gapToPole":"+36.220s","sprintPoints":0},{"position":10,"driverId":"ocon","driverName":"Esteban Ocon","driverCode":"OCO","driverNumber":31,"teamId":"haas","teamName":"Haas F1 Team","lapsCompleted":20,"bestLapTime":"+37.640s","gapToPole":"+37.640s","sprintPoints":0},{"position":11,"driverId":"alonso","driverName":"Fernando Alonso","driverCode":"ALO","driverNumber":14,"teamId":"astonmartin","teamName":"Aston Martin","lapsCompleted":20,"bestLapTime":"+50.464s","gapToPole":"+50.464s","sprintPoints":0},{"position":12,"driverId":"sainz","driverName":"Carlos Sainz","driverCode":"SAI","driverNumber":55,"teamId":"williams","teamName":"Williams","lapsCompleted":20,"bestLapTime":"+52.467s","gapToPole":"+52.467s","sprintPoints":0},{"position":13,"driverId":"lindblad","driverName":"Arvid Lindblad","driverCode":"LIN","driverNumber":41,"teamId":"racingbulls","teamName":"RB F1 Team","lapsCompleted":20,"bestLapTime":"+55.792s","gapToPole":"+55.792s","sprintPoints":0},{"position":14,"driverId":"piastri","driverName":"Oscar Piastri","driverCode":"PIA","driverNumber":81,"teamId":"mclaren","teamName":"McLaren","lapsCompleted":19,"bestLapTime":"","gapToPole":"","sprintPoints":0},{"position":15,"driverId":"albon","driverName":"Alexander Albon","driverCode":"ALB","driverNumber":23,"teamId":"williams","teamName":"Williams","lapsCompleted":14,"bestLapTime":"","gapToPole":"","sprintPoints":0},{"position":16,"driverId":"bortoleto","driverName":"Gabriel Bortoleto","driverCode":"BOR","driverNumber":5,"teamId":"audi","teamName":"Audi","lapsCompleted":6,"bestLapTime":"","gapToPole":"","sprintPoints":0},{"position":17,"driverId":"bottas","driverName":"Valtteri Bottas","driverCode":"BOT","driverNumber":77,"teamId":"cadillac","teamName":"Cadillac F1 Team","lapsCompleted":6,"bestLapTime":"","gapToPole":"","sprintPoints":0},{"position":18,"driverId":"hadjar","driverName":"Isack Hadjar","driverCode":"HAD","driverNumber":6,"teamId":"redbull","teamName":"Red Bull","lapsCompleted":2,"bestLapTime":"","gapToPole":"","sprintPoints":0},{"position":19,"driverId":"colapinto","driverName":"Franco Colapinto","driverCode":"COL","driverNumber":43,"teamId":"alpine","teamName":"Alpine F1 Team","lapsCompleted":2,"bestLapTime":"","gapToPole":"","sprintPoints":0},{"position":20,"driverId":"russell","driverName":"George Russell","driverCode":"RUS","driverNumber":63,"teamId":"mercedes","teamName":"Mercedes","lapsCompleted":1,"bestLapTime":"","gapToPole":"","sprintPoints":0},{"position":21,"driverId":"perez","driverName":"Sergio Pérez","driverCode":"PER","driverNumber":11,"teamId":"cadillac","teamName":"Cadillac F1 Team","lapsCompleted":1,"bestLapTime":"","gapToPole":"","sprintPoints":0},{"position":22,"driverId":"stroll","driverName":"Lance Stroll","driverCode":"STR","driverNumber":18,"teamId":"astonmartin","teamName":"Aston Martin","lapsCompleted":0,"bestLapTime":"","gapToPole":"","sprintPoints":0}]},"qualifying":{"sessionKey":"qualifying","sessionName":"Qualifying","dateStr":"2026-10-11","status":"finished","poleDriver":{"driver":"Max Verstappen","team":"Red Bull","time":"1:31.373"},"entries":[{"position":1,"driverId":"verstappen","driverName":"Max Verstappen","driverCode":"VER","driverNumber":3,"teamId":"redbull","teamName":"Red Bull","q1Time":"1:33.241","q2Time":"1:31.639","q3Time":"1:31.373","bestLapTime":"1:31.373","gapToPole":"POLE"},{"position":2,"driverId":"leclerc","driverName":"Charles Leclerc","driverCode":"LEC","driverNumber":16,"teamId":"ferrari","teamName":"Ferrari","q1Time":"1:32.774","q2Time":"1:31.953","q3Time":"1:31.427","bestLapTime":"1:31.427","gapToPole":"+0.054s"},{"position":3,"driverId":"hamilton","driverName":"Lewis Hamilton","driverCode":"HAM","driverNumber":44,"teamId":"ferrari","teamName":"Ferrari","q1Time":"1:32.429","q2Time":"1:31.529","q3Time":"1:31.496","bestLapTime":"1:31.496","gapToPole":"+0.123s"},{"position":4,"driverId":"antonelli","driverName":"Andrea Kimi Antonelli","driverCode":"ANT","driverNumber":12,"teamId":"mercedes","teamName":"Mercedes","q1Time":"1:33.601","q2Time":"1:32.079","q3Time":"1:31.562","bestLapTime":"1:31.562","gapToPole":"+0.189s"},{"position":5,"driverId":"norris","driverName":"Lando Norris","driverCode":"NOR","driverNumber":1,"teamId":"mclaren","teamName":"McLaren","q1Time":"1:32.775","q2Time":"1:31.895","q3Time":"1:31.712","bestLapTime":"1:31.712","gapToPole":"+0.339s"},{"position":6,"driverId":"russell","driverName":"George Russell","driverCode":"RUS","driverNumber":63,"teamId":"mercedes","teamName":"Mercedes","q1Time":"1:33.617","q2Time":"1:32.212","q3Time":"1:31.747","bestLapTime":"1:31.747","gapToPole":"+0.374s"},{"position":7,"driverId":"piastri","driverName":"Oscar Piastri","driverCode":"PIA","driverNumber":81,"teamId":"mclaren","teamName":"McLaren","q1Time":"1:33.076","q2Time":"1:32.245","q3Time":"1:31.860","bestLapTime":"1:31.860","gapToPole":"+0.487s"},{"position":8,"driverId":"gasly","driverName":"Pierre Gasly","driverCode":"GAS","driverNumber":10,"teamId":"alpine","teamName":"Alpine F1 Team","q1Time":"1:33.182","q2Time":"1:32.602","q3Time":"1:32.225","bestLapTime":"1:32.225","gapToPole":"+0.852s"},{"position":9,"driverId":"lawson","driverName":"Liam Lawson","driverCode":"LAW","driverNumber":30,"teamId":"racingbulls","teamName":"RB F1 Team","q1Time":"1:32.885","q2Time":"1:32.319","q3Time":"1:32.369","bestLapTime":"1:32.319","gapToPole":"+0.946s"},{"position":10,"driverId":"lindblad","driverName":"Arvid Lindblad","driverCode":"LIN","driverNumber":41,"teamId":"racingbulls","teamName":"RB F1 Team","q1Time":"1:33.288","q2Time":"1:32.498","q3Time":"1:32.781","bestLapTime":"1:32.498","gapToPole":"+1.125s"},{"position":11,"driverId":"hulkenberg","driverName":"Nico Hülkenberg","driverCode":"HUL","driverNumber":27,"teamId":"audi","teamName":"Audi","q1Time":"1:33.147","q2Time":"1:32.784","bestLapTime":"1:32.784","gapToPole":"+1.411s"},{"position":12,"driverId":"bearman","driverName":"Oliver Bearman","driverCode":"BEA","driverNumber":87,"teamId":"haas","teamName":"Haas F1 Team","q1Time":"1:33.356","q2Time":"1:32.908","bestLapTime":"1:32.908","gapToPole":"+1.535s"},{"position":13,"driverId":"ocon","driverName":"Esteban Ocon","driverCode":"OCO","driverNumber":31,"teamId":"haas","teamName":"Haas F1 Team","q1Time":"1:33.803","q2Time":"1:33.323","bestLapTime":"1:33.323","gapToPole":"+1.950s"},{"position":14,"driverId":"sainz","driverName":"Carlos Sainz","driverCode":"SAI","driverNumber":55,"teamId":"williams","teamName":"Williams","q1Time":"1:33.774","q2Time":"1:33.526","bestLapTime":"1:33.526","gapToPole":"+2.153s"},{"position":15,"driverId":"bortoleto","driverName":"Gabriel Bortoleto","driverCode":"BOR","driverNumber":5,"teamId":"audi","teamName":"Audi","q1Time":"1:34.169","q2Time":"1:33.658","bestLapTime":"1:33.658","gapToPole":"+2.285s"},{"position":16,"driverId":"colapinto","driverName":"Franco Colapinto","driverCode":"COL","driverNumber":43,"teamId":"alpine","teamName":"Alpine F1 Team","q1Time":"1:33.261","q2Time":"1:33.787","bestLapTime":"1:33.261","gapToPole":"+1.888s"},{"position":17,"driverId":"alonso","driverName":"Fernando Alonso","driverCode":"ALO","driverNumber":14,"teamId":"astonmartin","teamName":"Aston Martin","q1Time":"1:34.223","bestLapTime":"1:34.223","gapToPole":"+2.850s"},{"position":18,"driverId":"albon","driverName":"Alexander Albon","driverCode":"ALB","driverNumber":23,"teamId":"williams","teamName":"Williams","q1Time":"1:34.289","bestLapTime":"1:34.289","gapToPole":"+2.916s"},{"position":19,"driverId":"stroll","driverName":"Lance Stroll","driverCode":"STR","driverNumber":18,"teamId":"astonmartin","teamName":"Aston Martin","q1Time":"1:34.946","bestLapTime":"1:34.946","gapToPole":"+3.573s"},{"position":20,"driverId":"perez","driverName":"Sergio Pérez","driverCode":"PER","driverNumber":11,"teamId":"cadillac","teamName":"Cadillac F1 Team","q1Time":"1:35.123","bestLapTime":"1:35.123","gapToPole":"+3.750s"},{"position":21,"driverId":"bottas","driverName":"Valtteri Bottas","driverCode":"BOT","driverNumber":77,"teamId":"cadillac","teamName":"Cadillac F1 Team","q1Time":"1:35.984","bestLapTime":"1:35.984","gapToPole":"+4.611s"},{"position":22,"driverId":"hadjar","driverName":"Isack Hadjar","driverCode":"HAD","driverNumber":6,"teamId":"redbull","teamName":"Red Bull","bestLapTime":"","gapToPole":""}]}}}}',
  ),
  Ba = { practice: Ga, qualifying: Ea },
  Da = [8, 7, 6, 5, 4, 3, 2, 1];
function _e(e, r) {
  return Number.isFinite(r) ? r : e >= 1 && e <= 8 ? Da[e - 1] : 0;
}
function Ke(e) {
  return e in de;
}
function ka(e) {
  return e.map((r) => ({
    ...r,
    teamId: Ke(r.teamId) ? r.teamId : D,
    points: Number.isFinite(r.points) ? r.points : _e(r.position),
  }));
}
const ja = {
  getFinishedSprintEntries(e, r) {
    var t, d;
    if (e !== 2026) return null;
    const i = (t = Ba.qualifying) == null ? void 0 : t[r],
      s = (d = i == null ? void 0 : i.sessions) == null ? void 0 : d.sprint;
    return !s || s.status !== 'finished' || !Array.isArray(s.entries)
      ? null
      : s.entries
          .filter((n) => n && Number.isFinite(n.position))
          .map((n) => ({
            position: n.position,
            driverId: n.driverId,
            driverName: n.driverName,
            driverCode: n.driverCode,
            driverNumber: n.driverNumber,
            teamId: Ke(n.teamId) ? n.teamId : D,
            teamName: n.teamName,
            laps: n.lapsCompleted || 0,
            status: 'Finished',
            timeOrGap: n.bestLapTime || '',
            points: _e(n.position, n.sprintPoints),
          }));
  },
};
function Ha(e, r, i) {
  if (e !== 2026) return null;
  const s = he.find((t) => t.round === r);
  return s
    ? {
        id: `race-${e}-r${r}-sprint-provisional`,
        season: e,
        round: r,
        grandPrix: s.name,
        officialName: s.officialName,
        circuit: s.circuit,
        location: s.location,
        country: s.country,
        date: s.dates,
        status: 'scheduled',
        lapsTotal: s.laps,
        entries: [],
        sprintEntries: i,
        sprintProvenance: 'provisional',
        dataSource: 'OpenF1 live timing (provisional)',
      }
    : null;
}
function oe(e, r = ja) {
  const i = [2024, 2025, 2026],
    s = {};
  for (const t of i) {
    const d = Array.isArray(e[t]) ? e[t] : [],
      n = new Map(d.filter(Boolean).map((c) => [c.round, c])),
      v = new Set(n.keys());
    for (let c = 1; c <= 30; c++) {
      const p = r.getFinishedSprintEntries(t, c);
      !p || p.length === 0 || v.add(c);
    }
    s[t] = [...v]
      .sort((c, p) => c - p)
      .map((c) => {
        const p = n.get(c);
        if (
          p &&
          p.sprintEntries &&
          p.sprintEntries.length > 0 &&
          (p.sprintProvenance === 'official' || !p.sprintProvenance)
        )
          return p;
        const I = r.getFinishedSprintEntries(t, c) || [];
        if (I.length === 0) return p || null;
        const b = ka(I);
        return p ? { ...p, sprintEntries: b, sprintProvenance: 'provisional' } : Ha(t, c, b);
      })
      .filter((c) => c !== null);
  }
  return s;
}
const Ve = 'f1_detailed_results_v3',
  ze = 'f1_sync_meta_v2',
  Ua = 'f1_sync_review_v1',
  _a = 'f1_sync_review_dismissed_v1';
function Ka(e, r, i, s) {
  return `/api/jolpica?${new URLSearchParams({ path: `ergast/f1/${e}/${r}.json`, limit: String(i), offset: String(s) }).toString()}`;
}
const B = { 2024: Fa, 2025: [], 2026: Ta },
  Ce = {
    red_bull: 'redbull',
    cadillac: 'cadillac',
    ferrari: 'ferrari',
    mclaren: 'mclaren',
    mercedes: 'mercedes',
    aston_martin: 'astonmartin',
    alpine: 'alpine',
    rb: 'racingbulls',
    sauber: 'audi',
    audi: 'audi',
    haas: 'haas',
    williams: 'williams',
  };
function Le(e) {
  return e && Ce[e]
    ? Ce[e]
    : (typeof console < 'u' &&
        console.warn(`Unmapped constructorId "${e ?? ''}", falling back to 'unknown'.`),
      D);
}
const Me = { max_verstappen: 'verstappen', arvid_lindblad: 'lindblad' },
  Va = new Set(ie.map((e) => e.driverId));
function J(e) {
  if (!e) return 'unknown';
  if (Me[e]) return Me[e];
  const r = e.split('_').pop();
  return r && Va.has(r) ? r : e;
}
function te(e) {
  return (Array.isArray(e) ? e : []).map((r) => {
    if (!r) return r;
    const i = Array.isArray(r.entries) ? r.entries : [],
      s = i.map((n) => {
        if (!n) return n;
        const { sprintPoints: v, ...c } = n;
        return { ...c, driverId: J(n.driverId) };
      }),
      t = i
        .filter((n) => (n == null ? void 0 : n.sprintPoints))
        .map((n) => ({
          ...n,
          driverId: J(n.driverId),
          points: n.sprintPoints || 0,
          sprintPoints: void 0,
        })),
      d =
        r.sprintEntries && r.sprintEntries.length > 0
          ? r.sprintEntries.map((n) => ({ ...n, driverId: J(n.driverId) }))
          : t;
    return { ...r, entries: s, sprintEntries: d };
  });
}
function za(e, r) {
  var t, d;
  const i = new Map(),
    s = (n) => !!(n && Array.isArray(n.entries) && n.entries.length > 0);
  for (const n of r)
    n &&
      typeof n.round == 'number' &&
      !((t = n.id) != null && t.includes('simulated')) &&
      s(n) &&
      i.set(n.round, n);
  for (const n of e) n && typeof n.round == 'number' && !s(i.get(n.round)) && i.set(n.round, n);
  for (const n of r)
    n &&
      typeof n.round == 'number' &&
      !((d = n.id) != null && d.includes('simulated')) &&
      (i.has(n.round) || i.set(n.round, n));
  return Array.from(i.values()).sort((n, v) => n.round - v.round);
}
function qa() {
  try {
    const e = localStorage.getItem(Ve);
    if (e) {
      const r = JSON.parse(e);
      return oe({
        2024: r[2024] && r[2024].length > 0 ? te(r[2024]) : B[2024],
        2025: te(r[2025] || B[2025]),
        2026: za(B[2026] || [], te(r[2026] || [])),
      });
    }
  } catch {}
  return oe(B);
}
function Ja() {
  try {
    (localStorage.removeItem(Ua), localStorage.removeItem(_a));
  } catch {}
}
function Qa(e) {
  try {
    localStorage.setItem(Ve, JSON.stringify(e));
  } catch {}
}
function Wa() {
  try {
    const e = localStorage.getItem(ze);
    if (e) return JSON.parse(e);
  } catch {}
  return {
    lastSyncTimestamp: 'Chưa đồng bộ',
    syncStatus: 'idle',
    source: 'Local snapshot',
    completedRoundsCount: B[2026].length,
    message: 'Đang chờ kiểm tra dữ liệu mới từ Jolpica.',
  };
}
function xe(e) {
  try {
    localStorage.setItem(ze, JSON.stringify(e));
  } catch {}
}
class me extends Error {
  constructor(i, s) {
    super(i);
    k(this, 'partial', !0);
    k(this, 'loadedPages');
    this.loadedPages = s;
  }
}
function $a(e) {
  return new Promise((r) => setTimeout(r, e));
}
function Xa(e, r) {
  if (r) {
    const i = Number.parseInt(r, 10);
    if (Number.isFinite(i) && i >= 0) return Math.min(i * 1e3, 3e4);
  }
  return Math.min(1e3 * 2 ** e, 8e3);
}
async function Ya(e) {
  const t = Date.now() + 3e4;
  let d = 0;
  for (let n = 0; n < 3; n++) {
    const v = t - Date.now();
    if (v <= 0) throw new Error('Jolpica endpoint timed out (retry budget of 30s exhausted)');
    const c = await fetch(e, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(Math.min(12e3, v)),
    });
    if (c.ok) return c;
    if (((d = c.status), !(c.status === 429 || c.status >= 500) || n === 2))
      throw new Error(`Jolpica endpoint returned ${c.status}`);
    const I = Xa(n, c.headers.get('Retry-After'));
    if (Date.now() + I >= t)
      throw new Error(`Jolpica endpoint returned ${c.status} (retry budget exhausted)`);
    await $a(I);
  }
  throw new Error(`Jolpica endpoint returned ${d}`);
}
async function ye(e, r = 'results') {
  var v, c, p, I, b, u, h;
  let t = 0,
    d = 0;
  const n = new Map();
  for (;;) {
    const R = Ka(e, r, 100, t);
    let P;
    try {
      P = await Ya(R);
    } catch (f) {
      throw n.size === 0
        ? f
        : new me(`Jolpica ${r} page ${d + 1} failed after ${d} page(s) loaded`, d);
    }
    const S = await P.json(),
      O =
        ((c = (v = S == null ? void 0 : S.MRData) == null ? void 0 : v.RaceTable) == null
          ? void 0
          : c.Races) || [],
      G = parseInt(((p = S == null ? void 0 : S.MRData) == null ? void 0 : p.total) || '0', 10),
      m = Number.isFinite(G) && G >= 0 ? G : 0;
    if (d === 0 && m > 500)
      throw new me(`Jolpica ${r} total ${m} exceeds the 500-entry page cap`, 0);
    const N = Math.min(m, 500);
    for (const f of O) {
      const A = parseInt(f.round, 10);
      if (Number.isFinite(A))
        if (!n.has(A))
          n.set(A, {
            ...f,
            Results: f.Results ? [...f.Results] : [],
            SprintResults: f.SprintResults ? [...f.SprintResults] : [],
          });
        else {
          const C = n.get(A),
            l = new Set(
              (C.Results || []).map((o) => {
                var L;
                return (L = o == null ? void 0 : o.Driver) == null ? void 0 : L.driverId;
              }),
            );
          if (f.Results)
            for (const o of f.Results)
              ((I = o == null ? void 0 : o.Driver) != null &&
                I.driverId &&
                l.has(o.Driver.driverId)) ||
                (l.add((b = o == null ? void 0 : o.Driver) == null ? void 0 : b.driverId),
                C.Results.push(o));
          const x = new Set(
            (C.SprintResults || []).map((o) => {
              var L;
              return (L = o == null ? void 0 : o.Driver) == null ? void 0 : L.driverId;
            }),
          );
          if (f.SprintResults)
            for (const o of f.SprintResults)
              ((u = o == null ? void 0 : o.Driver) != null &&
                u.driverId &&
                x.has(o.Driver.driverId)) ||
                (x.add((h = o == null ? void 0 : o.Driver) == null ? void 0 : h.driverId),
                C.SprintResults.push(o));
        }
    }
    if (((d += 1), (t += 100), t >= N || O.length === 0 || d >= 5)) break;
  }
  return [...n.values()].sort((R, P) => parseInt(R.round, 10) - parseInt(P.round, 10));
}
async function Za(e, r) {
  try {
    const s = await ye(e, 'results');
    let t = [],
      d = '';
    try {
      t = await ye(e, 'sprint');
    } catch (n) {
      ((d = ' Không thể làm mới kết quả Sprint; vẫn giữ điểm Sprint đã lưu gần nhất.'),
        console.warn('Sprint classification refresh failed:', n));
    }
    if (s.length > 0 || t.length > 0) {
      const n = new Date().toISOString(),
        v = new Map();
      (s.forEach((u) => v.set(parseInt(u.round, 10), u)),
        t.forEach((u) => {
          const h = parseInt(u.round, 10),
            R = v.get(h);
          v.set(h, {
            ...u,
            ...R,
            SprintResults: u.SprintResults || (R == null ? void 0 : R.SprintResults) || [],
          });
        }));
      const c = new Map(r.map((u) => [u.round, u])),
        p = [...v.values()].map((u) => {
          var N, f, A, C, l, x;
          const h = (u.Results || []).map((o) => {
              var M, H, U, _, K, V, z, Ne, Ie, Ae, be;
              const L = Le((M = o.Constructor) == null ? void 0 : M.constructorId);
              return {
                position: parseInt(o.position, 10) || 20,
                driverId: J((H = o.Driver) == null ? void 0 : H.driverId),
                driverName:
                  `${((U = o.Driver) == null ? void 0 : U.givenName) || ''} ${((_ = o.Driver) == null ? void 0 : _.familyName) || ''}`.trim(),
                driverCode: ((K = o.Driver) == null ? void 0 : K.code) || 'F1',
                driverNumber:
                  parseInt((V = o.Driver) == null ? void 0 : V.permanentNumber, 10) || void 0,
                teamId: L,
                teamName: ((z = o.Constructor) == null ? void 0 : z.name) || 'Constructor',
                laps: parseInt(o.laps, 10) || 0,
                status: o.status || 'Finished',
                timeOrGap: ((Ne = o.Time) == null ? void 0 : Ne.time) || o.status || '+1 Lap',
                points: parseFloat(o.points) || 0,
                fastestLap: ((Ie = o.FastestLap) == null ? void 0 : Ie.rank) === '1',
                fastestLapTime:
                  (be = (Ae = o.FastestLap) == null ? void 0 : Ae.Time) == null ? void 0 : be.time,
                gridPosition: parseInt(o.grid, 10) || void 0,
              };
            }),
            R = (u.SprintResults || []).map((o, L) => {
              var y, M, H, U, _, K, V, z;
              return {
                position: parseInt(o.position, 10) || L + 1,
                driverId: J((y = o.Driver) == null ? void 0 : y.driverId),
                driverName:
                  `${((M = o.Driver) == null ? void 0 : M.givenName) || ''} ${((H = o.Driver) == null ? void 0 : H.familyName) || ''}`.trim(),
                driverCode: ((U = o.Driver) == null ? void 0 : U.code) || 'F1',
                driverNumber:
                  parseInt((_ = o.Driver) == null ? void 0 : _.permanentNumber, 10) || void 0,
                teamId: Le((K = o.Constructor) == null ? void 0 : K.constructorId),
                teamName: ((V = o.Constructor) == null ? void 0 : V.name) || 'Constructor',
                laps: parseInt(o.laps, 10) || 0,
                status: o.status || 'Finished',
                timeOrGap: ((z = o.Time) == null ? void 0 : z.time) || o.status || '',
                points: parseFloat(o.points) || 0,
                gridPosition: parseInt(o.grid, 10) || void 0,
              };
            }),
            P = c.get(parseInt(u.round, 10)),
            S =
              R.length > 0
                ? R
                : (P == null ? void 0 : P.sprintEntries) ||
                  (P == null
                    ? void 0
                    : P.entries
                        .filter((o) => o.sprintPoints)
                        .map((o) => ({
                          ...o,
                          points: o.sprintPoints || 0,
                          sprintPoints: void 0,
                        }))) ||
                  [],
            O =
              R.length > 0
                ? 'official'
                : S.length > 0
                  ? ((P == null ? void 0 : P.sprintProvenance) ?? 'provisional')
                  : void 0,
            G = parseInt(u.round, 10);
          if (!Number.isFinite(G)) return null;
          const m =
            typeof u.raceName == 'string' && u.raceName.length > 0
              ? u.raceName
              : `Round ${Number.isFinite(G) ? G : 'unknown'}`;
          return {
            id: `race-${e}-r${u.round}-${m.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            season: e,
            round: G,
            grandPrix: m,
            officialName: m,
            circuit: ((N = u.Circuit) == null ? void 0 : N.circuitName) || 'Circuit',
            location:
              (A = (f = u.Circuit) == null ? void 0 : f.Location) == null ? void 0 : A.locality,
            country:
              (l = (C = u.Circuit) == null ? void 0 : C.Location) == null ? void 0 : l.country,
            date: u.date,
            dataSource: 'Jolpica F1 API',
            dataUpdatedAt: n,
            status: h.length > 0 ? 'completed' : 'scheduled',
            lapsTotal: ((x = h[0]) == null ? void 0 : x.laps) || 57,
            winner: h[0]
              ? { driver: h[0].driverName, team: h[0].teamName, time: h[0].timeOrGap }
              : void 0,
            fastestLap: h.find((o) => o.fastestLap)
              ? {
                  driver: h.find((o) => o.fastestLap).driverName,
                  team: h.find((o) => o.fastestLap).teamName,
                  time: h.find((o) => o.fastestLap).fastestLapTime || '',
                }
              : void 0,
            entries: h,
            sprintEntries: S,
            sprintProvenance: O,
          };
        }),
        I = new Map(p.filter((u) => u !== null).map((u) => [u.round, u]));
      for (const u of B[e] || [])
        u && typeof u.round == 'number' && !I.has(u.round) && I.set(u.round, u);
      const b = oe({ ...B, [e]: [...I.values()].sort((u, h) => u.round - h.round) })[e];
      return {
        success: !0,
        results: b,
        message: `Đã đồng bộ ${b.length} chặng, gồm cả điểm Sprint nếu có, từ Jolpica.${d}`,
        source: 'Jolpica F1 API',
      };
    }
  } catch (s) {
    const t = s instanceof me,
      d = r.length > 0 ? r : B[e];
    return {
      success: !1,
      partial: t || void 0,
      results: d,
      message: t
        ? 'Đồng bộ dở dang (một số trang lỗi); đang giữ nguyên dữ liệu đã lưu, không báo thành công.'
        : 'Không thể kết nối Jolpica lúc này; đang giữ dữ liệu đã lưu gần nhất.',
      source: 'Local saved snapshot',
    };
  }
  return {
    success: !1,
    results: r.length > 0 ? r : B[e],
    message: 'Jolpica chua co du lieu moi; dang giu du lieu da luu gan nhat.',
    source: 'Local saved snapshot',
  };
}
const qe = {
    2024: {
      completedRounds: 24,
      final: !0,
      source: 'FIA official final classification (formula1.com/en/results)',
      meaning: 'Toàn bộ mùa đã khóa; không tính lại từ sync.',
    },
    2025: {
      completedRounds: 24,
      final: !0,
      source: 'FIA official final classification (formula1.com/en/results)',
      meaning: 'Toàn bộ mùa đã khóa; không tính lại từ sync.',
    },
    2026: {
      completedRounds: 17,
      final: !1,
      source: 'Official live standings after 17 events (src/data/championship/standings.ts)',
      meaning:
        'Rounds 1–17 đã khóa trong baseline; chỉ rounds > 17 được cộng thêm từ dữ liệu đồng bộ.',
    },
  },
  Fe = {
    verstappen: { code: 'VER', flag: '🇳🇱', teamId: 'redbull', teamName: 'Oracle Red Bull Racing' },
    perez: { code: 'PER', flag: '🇲🇽', teamId: 'redbull', teamName: 'Oracle Red Bull Racing' },
    leclerc: { code: 'LEC', flag: '🇲🇨', teamId: 'ferrari', teamName: 'Scuderia Ferrari HP' },
    sainz: { code: 'SAI', flag: '🇪🇸', teamId: 'williams', teamName: 'Williams Racing' },
    norris: { code: 'NOR', flag: '🇬🇧', teamId: 'mclaren', teamName: 'McLaren Formula 1 Team' },
    piastri: { code: 'PIA', flag: '🇦🇺', teamId: 'mclaren', teamName: 'McLaren Formula 1 Team' },
    hamilton: { code: 'HAM', flag: '🇬🇧', teamId: 'ferrari', teamName: 'Scuderia Ferrari HP' },
    russell: { code: 'RUS', flag: '🇬🇧', teamId: 'mercedes', teamName: 'Mercedes-AMG PETRONAS F1' },
    antonelli: {
      code: 'ANT',
      flag: '🇮🇹',
      teamId: 'mercedes',
      teamName: 'Mercedes-AMG PETRONAS F1',
    },
    alonso: { code: 'ALO', flag: '🇪🇸', teamId: 'astonmartin', teamName: 'Aston Martin Aramco F1' },
    stroll: { code: 'STR', flag: '🇨🇦', teamId: 'astonmartin', teamName: 'Aston Martin Aramco F1' },
    gasly: { code: 'GAS', flag: '🇫🇷', teamId: 'alpine', teamName: 'BWT Alpine F1 Team' },
    doohan: { code: 'DOO', flag: '🇦🇺', teamId: 'alpine', teamName: 'BWT Alpine F1 Team' },
    albon: { code: 'ALB', flag: '🇹🇭', teamId: 'williams', teamName: 'Williams Racing' },
    tsunoda: { code: 'TSU', flag: '🇯🇵', teamId: 'racingbulls', teamName: 'Visa Cash App RB F1' },
    hadjar: { code: 'HAD', flag: '🇫🇷', teamId: 'racingbulls', teamName: 'Visa Cash App RB F1' },
    hulkenberg: { code: 'HUL', flag: '🇩🇪', teamId: 'audi', teamName: 'Audi Formula 1 Team' },
    bortoleto: { code: 'BOR', flag: '🇧🇷', teamId: 'audi', teamName: 'Audi Formula 1 Team' },
    bearman: { code: 'BEA', flag: '🇬🇧', teamId: 'haas', teamName: 'MoneyGram Haas F1 Team' },
    ocon: { code: 'OCO', flag: '🇫🇷', teamId: 'haas', teamName: 'MoneyGram Haas F1 Team' },
    lawson: { code: 'LAW', flag: '🇳🇿', teamId: 'redbull', teamName: 'Oracle Red Bull Racing' },
    colapinto: { code: 'COL', flag: '🇦🇷', teamId: 'williams', teamName: 'Williams Racing' },
    ricciardo: { code: 'RIC', flag: '🇦🇺', teamId: 'racingbulls', teamName: 'Visa Cash App RB F1' },
    magnussen: { code: 'MAG', flag: '🇩🇰', teamId: 'haas', teamName: 'MoneyGram Haas F1 Team' },
    bottas: { code: 'BOT', flag: '🇫🇮', teamId: 'audi', teamName: 'Kick Sauber F1 Team' },
    zhou: { code: 'ZHO', flag: '🇨🇳', teamId: 'audi', teamName: 'Kick Sauber F1 Team' },
    sargeant: { code: 'SAR', flag: '🇺🇸', teamId: 'williams', teamName: 'Williams Racing' },
  },
  X = {
    piastri: { teamId: 'mclaren', teamName: 'McLaren' },
    norris: { teamId: 'mclaren', teamName: 'McLaren' },
    russell: { teamId: 'mercedes', teamName: 'Mercedes' },
    antonelli: { teamId: 'mercedes', teamName: 'Mercedes' },
    hamilton: { teamId: 'ferrari', teamName: 'Ferrari' },
    leclerc: { teamId: 'ferrari', teamName: 'Ferrari' },
    verstappen: { teamId: 'redbull', teamName: 'Red Bull' },
    hadjar: { teamId: 'redbull', teamName: 'Red Bull' },
    lawson: { teamId: 'racingbulls', teamName: 'Racing Bulls' },
    lindblad: { teamId: 'racingbulls', teamName: 'Racing Bulls' },
    gasly: { teamId: 'alpine', teamName: 'Alpine F1 Team' },
    colapinto: { teamId: 'alpine', teamName: 'Alpine F1 Team' },
    bearman: { teamId: 'haas', teamName: 'Haas F1 Team' },
    ocon: { teamId: 'haas', teamName: 'Haas F1 Team' },
    hulkenberg: { teamId: 'audi', teamName: 'Audi' },
    bortoleto: { teamId: 'audi', teamName: 'Audi' },
    alonso: { teamId: 'astonmartin', teamName: 'Aston Martin' },
    stroll: { teamId: 'astonmartin', teamName: 'Aston Martin' },
    sainz: { teamId: 'williams', teamName: 'Williams' },
    albon: { teamId: 'williams', teamName: 'Williams' },
    bottas: { teamId: 'cadillac', teamName: 'Cadillac F1 Team' },
    perez: { teamId: 'cadillac', teamName: 'Cadillac F1 Team' },
  };
function Je(e, r, i = [], s = []) {
  var G;
  if (e !== 2026) return { drivers: i, constructors: s };
  const t = new Map(),
    d = new Map(),
    n = i.filter((m) => (m == null ? void 0 : m.driverId) && m.driverId !== 'unknown'),
    v = s.filter((m) => (m == null ? void 0 : m.teamId) && m.teamId !== D);
  if (
    (n.forEach((m) => {
      const N = X[m.driverId];
      t.set(m.driverId, {
        driverId: m.driverId,
        driverName: m.driverName,
        driverCode: m.driverCode,
        teamId: (N == null ? void 0 : N.teamId) || m.teamId,
        teamName: (N == null ? void 0 : N.teamName) || m.teamName,
        points: m.points,
        wins: m.wins,
        podiums: m.podiums,
        countryFlag: m.countryFlag,
      });
    }),
    v.forEach((m) => {
      d.set(m.teamId, {
        teamId: m.teamId,
        teamName: m.teamName,
        points: m.points,
        wins: m.wins,
        podiums: m.podiums,
        engine: m.engine,
      });
    }),
    !i.some((m) => (m.podiums || 0) > 0) && Array.isArray(r) && r.length > 0)
  ) {
    const m = new Map(),
      N = new Map();
    (r
      .filter((f) => f && f.status === 'completed')
      .forEach((f) => {
        (f.entries || []).forEach((A) => {
          !A ||
            A.position < 1 ||
            A.position > 3 ||
            (A.driverId &&
              A.driverId !== 'unknown' &&
              m.set(A.driverId, (m.get(A.driverId) || 0) + 1),
            A.teamId && A.teamId !== D && N.set(A.teamId, (N.get(A.teamId) || 0) + 1));
        });
      }),
      t.forEach((f, A) => {
        const C = m.get(A);
        C !== void 0 && (f.podiums = C);
      }),
      d.forEach((f, A) => {
        const C = N.get(A);
        C !== void 0 && (f.podiums = C);
      }));
  }
  const p = ((G = qe[e]) == null ? void 0 : G.completedRounds) ?? 16;
  (Array.isArray(r) ? r : [])
    .filter((m) => m && !m.isSynthesized && m.round > p)
    .forEach((m) => {
      const N = m.status === 'completed' && Array.isArray(m.entries) ? m.entries : [];
      N.forEach((l) => {
        if (!l || !l.driverId || l.driverId === 'unknown') return;
        const x = t.get(l.driverId),
          o = X[l.driverId];
        if (x)
          ((x.points += l.points || 0),
            l.position === 1 && (x.wins += 1),
            l.position >= 1 && l.position <= 3 && (x.podiums += 1),
            (x.teamId = (o == null ? void 0 : o.teamId) || l.teamId),
            (x.teamName = (o == null ? void 0 : o.teamName) || l.teamName),
            t.set(l.driverId, x));
        else {
          const y = Fe[l.driverId] || {
            code: l.driverCode || 'F1',
            flag: '🏁',
            teamId: (o == null ? void 0 : o.teamId) || l.teamId,
            teamName: (o == null ? void 0 : o.teamName) || l.teamName,
          };
          t.set(l.driverId, {
            driverId: l.driverId,
            driverName: l.driverName,
            driverCode: y.code,
            teamId: (o == null ? void 0 : o.teamId) || l.teamId,
            teamName: (o == null ? void 0 : o.teamName) || l.teamName,
            points: l.points || 0,
            wins: l.position === 1 ? 1 : 0,
            podiums: l.position >= 1 && l.position <= 3 ? 1 : 0,
            countryFlag: y.flag,
          });
        }
        const L = l.teamId;
        if (L && L !== D) {
          const y = d.get(L);
          if (y)
            ((y.points += l.points || 0),
              l.position === 1 && (y.wins += 1),
              l.position >= 1 && l.position <= 3 && (y.podiums += 1),
              d.set(L, y));
          else {
            const M = de[L];
            d.set(L, {
              teamId: L,
              teamName: (M == null ? void 0 : M.name) || l.teamName,
              points: l.points || 0,
              wins: l.position === 1 ? 1 : 0,
              podiums: l.position >= 1 && l.position <= 3 ? 1 : 0,
              engine: (M == null ? void 0 : M.powerUnit) || 'Hybrid Turbo V6',
            });
          }
        }
      });
      const f = Array.isArray(m.sprintEntries) ? m.sprintEntries : [],
        A =
          f.length === 0
            ? N.filter((l) => l && l.sprintPoints).map((l) => ({
                ...l,
                points: l.sprintPoints || 0,
              }))
            : [];
      [...f, ...A].forEach((l) => {
        if (!l || !l.driverId || l.driverId === 'unknown') return;
        const x = l.points || 0,
          o = X[l.driverId],
          L = t.get(l.driverId);
        if (L) L.points += x;
        else {
          const y = Fe[l.driverId] || {
            code: l.driverCode || 'F1',
            flag: '🏁',
            teamId: (o == null ? void 0 : o.teamId) || l.teamId,
            teamName: (o == null ? void 0 : o.teamName) || l.teamName,
          };
          t.set(l.driverId, {
            driverId: l.driverId,
            driverName: l.driverName,
            driverCode: y.code,
            teamId: (o == null ? void 0 : o.teamId) || l.teamId,
            teamName: (o == null ? void 0 : o.teamName) || l.teamName,
            points: x,
            wins: 0,
            podiums: 0,
            countryFlag: y.flag,
          });
        }
        if (l.teamId && l.teamId !== D) {
          const y = d.get(l.teamId);
          if (y) y.points += x;
          else {
            const M = de[l.teamId];
            d.set(l.teamId, {
              teamId: l.teamId,
              teamName: (M == null ? void 0 : M.name) || l.teamName,
              points: x,
              wins: 0,
              podiums: 0,
              engine: (M == null ? void 0 : M.powerUnit) || 'Hybrid Turbo V6',
            });
          }
        }
      });
    });
  const b = new Map(),
    u = new Map(),
    h = (m, N, f) => {
      if (f < 1 || f > 10) return;
      let A = m.get(N);
      (A || ((A = new Array(11).fill(0)), m.set(N, A)), (A[f] += 1));
    };
  (Array.isArray(r) ? r : [])
    .filter((m) => m && !m.isSynthesized)
    .forEach((m) => {
      (m.status === 'completed' && Array.isArray(m.entries) ? m.entries : []).forEach((f) => {
        f && (h(b, f.driverId, f.position), h(u, f.teamId, f.position));
      });
    });
  const R = () => new Array(11).fill(0),
    P = (m, N, f, A) => {
      if (N.points !== m.points) return N.points - m.points;
      if (N.wins !== m.wins) return N.wins - m.wins;
      for (let C = 2; C <= 10; C++) if (A[C] !== f[C]) return A[C] - f[C];
      return N.podiums - m.podiums;
    },
    S = Array.from(t.values())
      .sort((m, N) => P(m, N, b.get(m.driverId) || R(), b.get(N.driverId) || R()))
      .map((m, N) => {
        const f = X[m.driverId];
        return {
          ...m,
          teamId: (f == null ? void 0 : f.teamId) || m.teamId,
          teamName: (f == null ? void 0 : f.teamName) || m.teamName,
          rank: N + 1,
        };
      }),
    O = Array.from(d.values())
      .sort((m, N) => P(m, N, u.get(m.teamId) || R(), u.get(N.teamId) || R()))
      .map((m, N) => ({ ...m, rank: N + 1 }));
  return { drivers: S, constructors: O };
}
const Qe = { 2024: ue, 2025: ve, 2026: ie },
  We = { 2024: pe, 2025: fe, 2026: ge },
  Te = qa();
Ja();
function er(e) {
  const r = {
    2024: { drivers: ue, constructors: pe },
    2025: { drivers: ve, constructors: fe },
    2026: { drivers: ie, constructors: ge },
  };
  try {
    const i = e == null ? void 0 : e[2026],
      s = qe[2026].completedRounds;
    Array.isArray(i) &&
      i.some((t) => {
        var d;
        return (
          t &&
          !t.isSynthesized &&
          t.round > s &&
          (t.status === 'completed' ||
            (((d = t.sprintEntries) == null ? void 0 : d.length) || 0) > 0)
        );
      }) &&
      (r[2026] = Je(2026, i, Qe[2026], We[2026]));
  } catch (i) {
    console.warn('Initial standings compute error, using base standings:', i);
  }
  return r;
}
const Q = Oe((e, r) => ({
    selectedSeason: 2026,
    activeSubTab: 'standings',
    standingsCategory: 'drivers',
    selectedRaceRound: null,
    detailedResults: Te,
    calculatedStandings: er(Te),
    syncMeta: Wa(),
    setSelectedSeason: (i) => e({ selectedSeason: i }),
    setActiveSubTab: (i) => e({ activeSubTab: i }),
    setStandingsCategory: (i) => e({ standingsCategory: i }),
    setSelectedRaceRound: (i) => e({ selectedRaceRound: i }),
    syncSeasonData: async (i) => {
      try {
        e({
          syncMeta: {
            ...r().syncMeta,
            syncStatus: 'syncing',
            message: `Đang kết nối và đối chiếu dữ liệu mùa giải ${i}...`,
          },
        });
        const s = r().detailedResults[i] || [],
          t = await Za(i, s);
        if (!t.success) {
          const p = {
            lastSyncTimestamp: new Date().toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              day: '2-digit',
              month: '2-digit',
            }),
            syncStatus: 'error',
            source: t.source,
            completedRoundsCount: s.length,
            message: t.message,
          };
          (xe(p), e({ syncMeta: p }));
          return;
        }
        const d = { ...r().detailedResults, [i]: t.results },
          n = Je(i, t.results, Qe[i], We[i]),
          v = { ...r().calculatedStandings, [i]: n },
          c = {
            lastSyncTimestamp: new Date().toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              day: '2-digit',
              month: '2-digit',
            }),
            syncStatus: t.success ? 'success' : 'error',
            source: t.source,
            completedRoundsCount: t.results.length,
            message: t.message,
          };
        (Qa(d), xe(c), e({ detailedResults: d, calculatedStandings: v, syncMeta: c }));
      } catch (s) {
        console.error('syncSeasonData safe catch:', s);
        const t = {
          ...r().syncMeta,
          syncStatus: 'error',
          message: 'Đồng bộ tạm gián đoạn; đang sử dụng dữ liệu nội bộ sẵn có.',
        };
        e({ syncMeta: t });
      }
    },
  })),
  ar = [
    {
      round: 1,
      grandPrix: 'Australian Grand Prix',
      circuit: 'Albert Park Circuit',
      season: 2025,
      date: '16 Mar 2025',
      podium: {
        p1: { driver: 'Lando Norris', team: 'McLaren', time: '1:21:40.821', points: 26 },
        p2: { driver: 'Max Verstappen', team: 'Red Bull Racing', gap: '+2.140s', points: 18 },
        p3: { driver: 'George Russell', team: 'Mercedes', gap: '+8.390s', points: 15 },
      },
      fastestLap: { driver: 'Lando Norris', team: 'McLaren', time: '1:19.412' },
    },
    {
      round: 2,
      grandPrix: 'Chinese Grand Prix',
      circuit: 'Shanghai International Circuit',
      season: 2025,
      date: '23 Mar 2025',
      podium: {
        p1: { driver: 'Max Verstappen', team: 'Red Bull Racing', time: '1:38:12.304', points: 26 },
        p2: { driver: 'Oscar Piastri', team: 'McLaren', gap: '+4.120s', points: 18 },
        p3: { driver: 'Lando Norris', team: 'McLaren', gap: '+7.810s', points: 15 },
      },
      fastestLap: { driver: 'Max Verstappen', team: 'Red Bull Racing', time: '1:35.819' },
    },
    {
      round: 3,
      grandPrix: 'Japanese Grand Prix',
      circuit: 'Suzuka International Racing Course',
      season: 2025,
      date: '06 Apr 2025',
      podium: {
        p1: { driver: 'Max Verstappen', team: 'Red Bull Racing', time: '1:44:11.205', points: 26 },
        p2: { driver: 'Lando Norris', team: 'McLaren', gap: '+6.230s', points: 18 },
        p3: { driver: 'Oscar Piastri', team: 'McLaren', gap: '+11.450s', points: 15 },
      },
      fastestLap: { driver: 'Max Verstappen', team: 'Red Bull Racing', time: '1:32.408' },
    },
    {
      round: 4,
      grandPrix: 'Bahrain Grand Prix',
      circuit: 'Bahrain International Circuit',
      season: 2025,
      date: '13 Apr 2025',
      podium: {
        p1: { driver: 'Oscar Piastri', team: 'McLaren', time: '1:31:02.441', points: 26 },
        p2: { driver: 'Lando Norris', team: 'McLaren', gap: '+1.870s', points: 18 },
        p3: { driver: 'George Russell', team: 'Mercedes', gap: '+12.510s', points: 15 },
      },
      fastestLap: { driver: 'Oscar Piastri', team: 'McLaren', time: '1:31.905' },
    },
    {
      round: 5,
      grandPrix: 'Saudi Arabian Grand Prix',
      circuit: 'Jeddah Corniche Circuit',
      season: 2025,
      date: '20 Apr 2025',
      podium: {
        p1: { driver: 'Max Verstappen', team: 'Red Bull Racing', time: '1:21:18.420', points: 26 },
        p2: { driver: 'Oscar Piastri', team: 'McLaren', gap: '+3.140s', points: 18 },
        p3: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+14.280s', points: 15 },
      },
      fastestLap: { driver: 'Max Verstappen', team: 'Red Bull Racing', time: '1:30.912' },
    },
    {
      round: 6,
      grandPrix: 'Miami Grand Prix',
      circuit: 'Miami International Autodrome',
      season: 2025,
      date: '04 May 2025',
      podium: {
        p1: { driver: 'Lando Norris', team: 'McLaren', time: '1:29:48.330', points: 26 },
        p2: { driver: 'Max Verstappen', team: 'Red Bull Racing', gap: '+4.550s', points: 18 },
        p3: { driver: 'Oscar Piastri', team: 'McLaren', gap: '+8.900s', points: 15 },
      },
      fastestLap: { driver: 'Lando Norris', team: 'McLaren', time: '1:29.814' },
    },
    {
      round: 7,
      grandPrix: 'Emilia Romagna Grand Prix',
      circuit: 'Autodromo Enzo e Dino Ferrari (Imola)',
      season: 2025,
      date: '18 May 2025',
      podium: {
        p1: { driver: 'Max Verstappen', team: 'Red Bull Racing', time: '1:24:59.102', points: 25 },
        p2: { driver: 'Lando Norris', team: 'McLaren', gap: '+0.890s', points: 18 },
        p3: { driver: 'Oscar Piastri', team: 'McLaren', gap: '+6.420s', points: 15 },
      },
      fastestLap: { driver: 'George Russell', team: 'Mercedes', time: '1:18.210' },
    },
    {
      round: 8,
      grandPrix: 'Monaco Grand Prix',
      circuit: 'Circuit de Monaco',
      season: 2025,
      date: '25 May 2025',
      podium: {
        p1: { driver: 'Charles Leclerc', team: 'Ferrari', time: '2:12:30.124', points: 25 },
        p2: { driver: 'Oscar Piastri', team: 'McLaren', gap: '+7.152s', points: 18 },
        p3: { driver: 'Lando Norris', team: 'McLaren', gap: '+9.380s', points: 15 },
      },
      fastestLap: { driver: 'Lewis Hamilton', team: 'Ferrari', time: '1:14.165' },
    },
    {
      round: 9,
      grandPrix: 'Spanish Grand Prix',
      circuit: 'Circuit de Barcelona-Catalunya',
      season: 2025,
      date: '01 Jun 2025',
      podium: {
        p1: { driver: 'Max Verstappen', team: 'Red Bull Racing', time: '1:28:20.220', points: 26 },
        p2: { driver: 'Lando Norris', team: 'McLaren', gap: '+2.219s', points: 18 },
        p3: { driver: 'George Russell', team: 'Mercedes', gap: '+13.820s', points: 15 },
      },
      fastestLap: { driver: 'Max Verstappen', team: 'Red Bull Racing', time: '1:17.114' },
    },
    {
      round: 10,
      grandPrix: 'Canadian Grand Prix',
      circuit: 'Circuit Gilles Villeneuve',
      season: 2025,
      date: '15 Jun 2025',
      podium: {
        p1: { driver: 'Max Verstappen', team: 'Red Bull Racing', time: '1:45:47.927', points: 25 },
        p2: { driver: 'Lando Norris', team: 'McLaren', gap: '+3.879s', points: 18 },
        p3: { driver: 'George Russell', team: 'Mercedes', gap: '+4.317s', points: 15 },
      },
      fastestLap: { driver: 'Lewis Hamilton', team: 'Ferrari', time: '1:14.856' },
    },
    {
      round: 11,
      grandPrix: 'Austrian Grand Prix',
      circuit: 'Red Bull Ring, Spielberg',
      season: 2025,
      date: '29 Jun 2025',
      podium: {
        p1: { driver: 'George Russell', team: 'Mercedes', time: '1:24:22.798', points: 25 },
        p2: { driver: 'Oscar Piastri', team: 'McLaren', gap: '+1.906s', points: 19 },
        p3: { driver: 'Carlos Sainz', team: 'Williams', gap: '+4.533s', points: 15 },
      },
      fastestLap: { driver: 'Oscar Piastri', team: 'McLaren', time: '1:07.694' },
    },
    {
      round: 12,
      grandPrix: 'British Grand Prix',
      circuit: 'Silverstone Circuit',
      season: 2025,
      date: '06 Jul 2025',
      podium: {
        p1: { driver: 'Lewis Hamilton', team: 'Ferrari', time: '1:22:27.059', points: 25 },
        p2: { driver: 'Max Verstappen', team: 'Red Bull Racing', gap: '+1.465s', points: 18 },
        p3: { driver: 'Lando Norris', team: 'McLaren', gap: '+7.514s', points: 15 },
      },
      fastestLap: { driver: 'Carlos Sainz', team: 'Williams', time: '1:28.293' },
    },
    {
      round: 13,
      grandPrix: 'Belgian Grand Prix',
      circuit: 'Circuit de Spa-Francorchamps',
      season: 2025,
      date: '27 Jul 2025',
      podium: {
        p1: { driver: 'Oscar Piastri', team: 'McLaren', time: '1:20:04.256', points: 25 },
        p2: { driver: 'Lando Norris', team: 'McLaren', gap: '+1.220s', points: 19 },
        p3: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+8.905s', points: 15 },
      },
      fastestLap: { driver: 'Lando Norris', team: 'McLaren', time: '1:44.701' },
    },
    {
      round: 14,
      grandPrix: 'Hungarian Grand Prix',
      circuit: 'Hungaroring',
      season: 2025,
      date: '03 Aug 2025',
      podium: {
        p1: { driver: 'Oscar Piastri', team: 'McLaren', time: '1:38:01.989', points: 25 },
        p2: { driver: 'Lando Norris', team: 'McLaren', gap: '+2.141s', points: 18 },
        p3: { driver: 'Lewis Hamilton', team: 'Ferrari', gap: '+14.880s', points: 15 },
      },
      fastestLap: { driver: 'George Russell', team: 'Mercedes', time: '1:20.305' },
    },
    {
      round: 15,
      grandPrix: 'Dutch Grand Prix',
      circuit: 'Circuit Zandvoort',
      season: 2025,
      date: '31 Aug 2025',
      podium: {
        p1: { driver: 'Lando Norris', team: 'McLaren', time: '1:30:45.519', points: 26 },
        p2: { driver: 'Max Verstappen', team: 'Red Bull Racing', gap: '+22.896s', points: 18 },
        p3: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+25.439s', points: 15 },
      },
      fastestLap: { driver: 'Lando Norris', team: 'McLaren', time: '1:13.817' },
    },
    {
      round: 16,
      grandPrix: 'Italian Grand Prix',
      circuit: 'Autodromo Nazionale di Monza',
      season: 2025,
      date: '07 Sep 2025',
      podium: {
        p1: { driver: 'Charles Leclerc', team: 'Ferrari', time: '1:14:40.727', points: 25 },
        p2: { driver: 'Oscar Piastri', team: 'McLaren', gap: '+2.664s', points: 18 },
        p3: { driver: 'Lando Norris', team: 'McLaren', gap: '+6.153s', points: 16 },
      },
      fastestLap: { driver: 'Lando Norris', team: 'McLaren', time: '1:21.432' },
    },
    {
      round: 17,
      grandPrix: 'Azerbaijan Grand Prix',
      circuit: 'Baku City Circuit',
      season: 2025,
      date: '21 Sep 2025',
      podium: {
        p1: { driver: 'Oscar Piastri', team: 'McLaren', time: '1:32:58.007', points: 25 },
        p2: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+10.910s', points: 18 },
        p3: { driver: 'George Russell', team: 'Mercedes', gap: '+31.328s', points: 15 },
      },
      fastestLap: { driver: 'Lando Norris', team: 'McLaren', time: '1:45.255' },
    },
    {
      round: 18,
      grandPrix: 'Singapore Grand Prix',
      circuit: 'Marina Bay Street Circuit',
      season: 2025,
      date: '05 Oct 2025',
      podium: {
        p1: { driver: 'Lando Norris', team: 'McLaren', time: '1:40:52.571', points: 25 },
        p2: { driver: 'Max Verstappen', team: 'Red Bull Racing', gap: '+20.945s', points: 18 },
        p3: { driver: 'Oscar Piastri', team: 'McLaren', gap: '+41.823s', points: 15 },
      },
      fastestLap: { driver: 'Daniel Ricciardo', team: 'Racing Bulls', time: '1:34.486' },
    },
    {
      round: 19,
      grandPrix: 'United States Grand Prix',
      circuit: 'Circuit of the Americas, Austin',
      season: 2025,
      date: '19 Oct 2025',
      podium: {
        p1: { driver: 'Charles Leclerc', team: 'Ferrari', time: '1:35:09.639', points: 25 },
        p2: { driver: 'Carlos Sainz', team: 'Williams', gap: '+8.562s', points: 18 },
        p3: { driver: 'Max Verstappen', team: 'Red Bull Racing', gap: '+19.412s', points: 15 },
      },
      fastestLap: { driver: 'Max Verstappen', team: 'Red Bull Racing', time: '1:37.330' },
    },
    {
      round: 20,
      grandPrix: 'Mexico City Grand Prix',
      circuit: 'Autódromo Hermanos Rodríguez',
      season: 2025,
      date: '26 Oct 2025',
      podium: {
        p1: { driver: 'Carlos Sainz', team: 'Williams', time: '1:40:55.800', points: 25 },
        p2: { driver: 'Lando Norris', team: 'McLaren', gap: '+4.705s', points: 18 },
        p3: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+34.387s', points: 16 },
      },
      fastestLap: { driver: 'Charles Leclerc', team: 'Ferrari', time: '1:18.336' },
    },
    {
      round: 21,
      grandPrix: 'São Paulo Grand Prix',
      circuit: 'Autódromo José Carlos Pace (Interlagos)',
      season: 2025,
      date: '09 Nov 2025',
      podium: {
        p1: { driver: 'Max Verstappen', team: 'Red Bull Racing', time: '2:06:54.430', points: 26 },
        p2: { driver: 'Esteban Ocon', team: 'Haas', gap: '+19.419s', points: 18 },
        p3: { driver: 'Pierre Gasly', team: 'Alpine', gap: '+22.532s', points: 15 },
      },
      fastestLap: { driver: 'Max Verstappen', team: 'Red Bull Racing', time: '1:20.472' },
    },
    {
      round: 22,
      grandPrix: 'Las Vegas Grand Prix',
      circuit: 'Las Vegas Strip Circuit',
      season: 2025,
      date: '22 Nov 2025',
      podium: {
        p1: { driver: 'George Russell', team: 'Mercedes', time: '1:22:05.969', points: 25 },
        p2: { driver: 'Lewis Hamilton', team: 'Ferrari', gap: '+7.313s', points: 18 },
        p3: { driver: 'Carlos Sainz', team: 'Williams', gap: '+11.900s', points: 15 },
      },
      fastestLap: { driver: 'Lando Norris', team: 'McLaren', time: '1:35.329' },
    },
    {
      round: 23,
      grandPrix: 'Qatar Grand Prix',
      circuit: 'Lusail International Circuit',
      season: 2025,
      date: '30 Nov 2025',
      podium: {
        p1: { driver: 'Max Verstappen', team: 'Red Bull Racing', time: '1:31:05.323', points: 25 },
        p2: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+6.031s', points: 18 },
        p3: { driver: 'Oscar Piastri', team: 'McLaren', gap: '+6.819s', points: 15 },
      },
      fastestLap: { driver: 'Lando Norris', team: 'McLaren', time: '1:23.196' },
    },
    {
      round: 24,
      grandPrix: 'Abu Dhabi Grand Prix',
      circuit: 'Yas Marina Circuit',
      season: 2025,
      date: '07 Dec 2025',
      podium: {
        p1: { driver: 'Lando Norris', team: 'McLaren', time: '1:27:59.106', points: 25 },
        p2: { driver: 'Carlos Sainz', team: 'Williams', gap: '+5.832s', points: 18 },
        p3: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+7.489s', points: 15 },
      },
      fastestLap: { driver: 'Lando Norris', team: 'McLaren', time: '1:26.541' },
    },
  ],
  $e = [
    {
      round: 1,
      grandPrix: 'Bahrain Grand Prix',
      circuit: 'Bahrain International Circuit',
      season: 2024,
      date: '02 Mar 2024',
      podium: {
        p1: {
          driver: 'Max Verstappen',
          team: 'Red Bull Racing Honda RBPT',
          time: '1:31:44.742',
          points: 26,
        },
        p2: {
          driver: 'Sergio Pérez',
          team: 'Red Bull Racing Honda RBPT',
          gap: '+22.457s',
          points: 18,
        },
        p3: { driver: 'Carlos Sainz', team: 'Ferrari', gap: '+25.110s', points: 15 },
      },
      fastestLap: { driver: 'Max Verstappen', team: 'Red Bull Racing', time: '1:32.608' },
    },
    {
      round: 2,
      grandPrix: 'Saudi Arabian Grand Prix',
      circuit: 'Jeddah Corniche Circuit',
      season: 2024,
      date: '09 Mar 2024',
      podium: {
        p1: {
          driver: 'Max Verstappen',
          team: 'Red Bull Racing Honda RBPT',
          time: '1:20:43.273',
          points: 25,
        },
        p2: {
          driver: 'Sergio Pérez',
          team: 'Red Bull Racing Honda RBPT',
          gap: '+13.643s',
          points: 18,
        },
        p3: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+18.639s', points: 16 },
      },
      fastestLap: { driver: 'Charles Leclerc', team: 'Ferrari', time: '1:31.632' },
    },
    {
      round: 3,
      grandPrix: 'Australian Grand Prix',
      circuit: 'Albert Park Circuit',
      season: 2024,
      date: '24 Mar 2024',
      podium: {
        p1: { driver: 'Carlos Sainz', team: 'Ferrari', time: '1:20:26.843', points: 25 },
        p2: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+2.366s', points: 19 },
        p3: { driver: 'Lando Norris', team: 'McLaren Mercedes', gap: '+5.904s', points: 15 },
      },
      fastestLap: { driver: 'Charles Leclerc', team: 'Ferrari', time: '1:19.813' },
    },
    {
      round: 4,
      grandPrix: 'Japanese Grand Prix',
      circuit: 'Suzuka International Racing Course',
      season: 2024,
      date: '07 Apr 2024',
      podium: {
        p1: {
          driver: 'Max Verstappen',
          team: 'Red Bull Racing Honda RBPT',
          time: '1:54:23.566',
          points: 26,
        },
        p2: {
          driver: 'Sergio Pérez',
          team: 'Red Bull Racing Honda RBPT',
          gap: '+12.535s',
          points: 18,
        },
        p3: { driver: 'Carlos Sainz', team: 'Ferrari', gap: '+20.866s', points: 15 },
      },
      fastestLap: { driver: 'Max Verstappen', team: 'Red Bull Racing', time: '1:33.706' },
    },
    {
      round: 5,
      grandPrix: 'Chinese Grand Prix',
      circuit: 'Shanghai International Circuit',
      season: 2024,
      date: '21 Apr 2024',
      podium: {
        p1: {
          driver: 'Max Verstappen',
          team: 'Red Bull Racing Honda RBPT',
          time: '1:40:52.554',
          points: 25,
        },
        p2: { driver: 'Lando Norris', team: 'McLaren Mercedes', gap: '+13.773s', points: 18 },
        p3: {
          driver: 'Sergio Pérez',
          team: 'Red Bull Racing Honda RBPT',
          gap: '+15.660s',
          points: 15,
        },
      },
      fastestLap: { driver: 'Fernando Alonso', team: 'Aston Martin', time: '1:37.810' },
    },
    {
      round: 6,
      grandPrix: 'Miami Grand Prix',
      circuit: 'Miami International Autodrome',
      season: 2024,
      date: '05 May 2024',
      podium: {
        p1: { driver: 'Lando Norris', team: 'McLaren Mercedes', time: '1:30:49.876', points: 25 },
        p2: {
          driver: 'Max Verstappen',
          team: 'Red Bull Racing Honda RBPT',
          gap: '+7.612s',
          points: 18,
        },
        p3: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+9.920s', points: 15 },
      },
      fastestLap: { driver: 'Oscar Piastri', team: 'McLaren', time: '1:30.634' },
    },
    {
      round: 7,
      grandPrix: 'Emilia Romagna Grand Prix',
      circuit: 'Autodromo Enzo e Dino Ferrari (Imola)',
      season: 2024,
      date: '19 May 2024',
      podium: {
        p1: {
          driver: 'Max Verstappen',
          team: 'Red Bull Racing Honda RBPT',
          time: '1:25:25.252',
          points: 25,
        },
        p2: { driver: 'Lando Norris', team: 'McLaren Mercedes', gap: '+0.725s', points: 18 },
        p3: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+7.916s', points: 15 },
      },
      fastestLap: { driver: 'George Russell', team: 'Mercedes', time: '1:18.589' },
    },
    {
      round: 8,
      grandPrix: 'Monaco Grand Prix',
      circuit: 'Circuit de Monaco',
      season: 2024,
      date: '26 May 2024',
      podium: {
        p1: { driver: 'Charles Leclerc', team: 'Ferrari', time: '2:23:15.554', points: 25 },
        p2: { driver: 'Oscar Piastri', team: 'McLaren Mercedes', gap: '+7.152s', points: 18 },
        p3: { driver: 'Carlos Sainz', team: 'Ferrari', gap: '+7.585s', points: 15 },
      },
      fastestLap: { driver: 'Lewis Hamilton', team: 'Mercedes', time: '1:14.165' },
    },
    {
      round: 9,
      grandPrix: 'Canadian Grand Prix',
      circuit: 'Circuit Gilles-Villeneuve',
      season: 2024,
      date: '09 Jun 2024',
      podium: {
        p1: {
          driver: 'Max Verstappen',
          team: 'Red Bull Racing Honda RBPT',
          time: '1:45:47.927',
          points: 25,
        },
        p2: { driver: 'Lando Norris', team: 'McLaren Mercedes', gap: '+3.879s', points: 18 },
        p3: { driver: 'George Russell', team: 'Mercedes', gap: '+4.317s', points: 15 },
      },
      fastestLap: { driver: 'Lewis Hamilton', team: 'Mercedes', time: '1:14.856' },
    },
    {
      round: 10,
      grandPrix: 'Spanish Grand Prix',
      circuit: 'Circuit de Barcelona-Catalunya',
      season: 2024,
      date: '23 Jun 2024',
      podium: {
        p1: {
          driver: 'Max Verstappen',
          team: 'Red Bull Racing Honda RBPT',
          time: '1:28:20.227',
          points: 25,
        },
        p2: { driver: 'Lando Norris', team: 'McLaren Mercedes', gap: '+2.219s', points: 19 },
        p3: { driver: 'Lewis Hamilton', team: 'Mercedes', gap: '+17.790s', points: 15 },
      },
      fastestLap: { driver: 'Lando Norris', team: 'McLaren', time: '1:17.115' },
    },
    {
      round: 11,
      grandPrix: 'Austrian Grand Prix',
      circuit: 'Red Bull Ring',
      season: 2024,
      date: '30 Jun 2024',
      podium: {
        p1: { driver: 'George Russell', team: 'Mercedes', time: '1:24:22.798', points: 25 },
        p2: { driver: 'Oscar Piastri', team: 'McLaren Mercedes', gap: '+1.906s', points: 18 },
        p3: { driver: 'Carlos Sainz', team: 'Ferrari', gap: '+4.533s', points: 15 },
      },
      fastestLap: { driver: 'Fernando Alonso', team: 'Aston Martin', time: '1:07.694' },
    },
    {
      round: 12,
      grandPrix: 'British Grand Prix',
      circuit: 'Silverstone Circuit',
      season: 2024,
      date: '07 Jul 2024',
      podium: {
        p1: { driver: 'Lewis Hamilton', team: 'Mercedes', time: '1:22:27.059', points: 25 },
        p2: {
          driver: 'Max Verstappen',
          team: 'Red Bull Racing Honda RBPT',
          gap: '+1.465s',
          points: 18,
        },
        p3: { driver: 'Lando Norris', team: 'McLaren Mercedes', gap: '+7.547s', points: 15 },
      },
      fastestLap: { driver: 'Carlos Sainz', team: 'Ferrari', time: '1:28.293' },
    },
    {
      round: 13,
      grandPrix: 'Hungarian Grand Prix',
      circuit: 'Hungaroring',
      season: 2024,
      date: '21 Jul 2024',
      podium: {
        p1: { driver: 'Oscar Piastri', team: 'McLaren Mercedes', time: '1:38:01.989', points: 25 },
        p2: { driver: 'Lando Norris', team: 'McLaren Mercedes', gap: '+2.141s', points: 18 },
        p3: { driver: 'Lewis Hamilton', team: 'Mercedes', gap: '+14.880s', points: 15 },
      },
      fastestLap: { driver: 'George Russell', team: 'Mercedes', time: '1:20.305' },
    },
    {
      round: 14,
      grandPrix: 'Belgian Grand Prix',
      circuit: 'Circuit de Spa-Francorchamps',
      season: 2024,
      date: '28 Jul 2024',
      podium: {
        p1: { driver: 'Lewis Hamilton', team: 'Mercedes', time: '1:19:57.566', points: 25 },
        p2: { driver: 'Oscar Piastri', team: 'McLaren Mercedes', gap: '+0.647s', points: 18 },
        p3: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+8.023s', points: 15 },
      },
      fastestLap: { driver: 'Sergio Pérez', team: 'Red Bull Racing', time: '1:44.701' },
    },
    {
      round: 15,
      grandPrix: 'Dutch Grand Prix',
      circuit: 'Circuit Zandvoort',
      season: 2024,
      date: '25 Aug 2024',
      podium: {
        p1: { driver: 'Lando Norris', team: 'McLaren Mercedes', time: '1:30:45.519', points: 26 },
        p2: {
          driver: 'Max Verstappen',
          team: 'Red Bull Racing Honda RBPT',
          gap: '+22.896s',
          points: 18,
        },
        p3: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+25.439s', points: 15 },
      },
      fastestLap: { driver: 'Lando Norris', team: 'McLaren', time: '1:13.817' },
    },
    {
      round: 16,
      grandPrix: 'Italian Grand Prix',
      circuit: 'Autodromo Nazionale Monza',
      season: 2024,
      date: '01 Sep 2024',
      podium: {
        p1: { driver: 'Charles Leclerc', team: 'Ferrari', time: '1:14:40.727', points: 25 },
        p2: { driver: 'Oscar Piastri', team: 'McLaren Mercedes', gap: '+2.664s', points: 18 },
        p3: { driver: 'Lando Norris', team: 'McLaren Mercedes', gap: '+6.153s', points: 16 },
      },
      fastestLap: { driver: 'Lando Norris', team: 'McLaren', time: '1:21.432' },
    },
    {
      round: 17,
      grandPrix: 'Azerbaijan Grand Prix',
      circuit: 'Baku City Circuit',
      season: 2024,
      date: '15 Sep 2024',
      podium: {
        p1: { driver: 'Oscar Piastri', team: 'McLaren Mercedes', time: '1:32:58.007', points: 25 },
        p2: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+10.910s', points: 18 },
        p3: { driver: 'George Russell', team: 'Mercedes', gap: '+31.328s', points: 15 },
      },
      fastestLap: { driver: 'Lando Norris', team: 'McLaren', time: '1:45.255' },
    },
    {
      round: 18,
      grandPrix: 'Singapore Grand Prix',
      circuit: 'Marina Bay Street Circuit',
      season: 2024,
      date: '22 Sep 2024',
      podium: {
        p1: { driver: 'Lando Norris', team: 'McLaren Mercedes', time: '1:40:52.571', points: 25 },
        p2: {
          driver: 'Max Verstappen',
          team: 'Red Bull Racing Honda RBPT',
          gap: '+20.945s',
          points: 18,
        },
        p3: { driver: 'Oscar Piastri', team: 'McLaren Mercedes', gap: '+41.823s', points: 15 },
      },
      fastestLap: { driver: 'Daniel Ricciardo', team: 'RB Honda RBPT', time: '1:34.486' },
    },
    {
      round: 19,
      grandPrix: 'United States Grand Prix',
      circuit: 'Circuit of The Americas (Austin)',
      season: 2024,
      date: '20 Oct 2024',
      podium: {
        p1: { driver: 'Charles Leclerc', team: 'Ferrari', time: '1:35:09.639', points: 25 },
        p2: { driver: 'Carlos Sainz', team: 'Ferrari', gap: '+8.562s', points: 18 },
        p3: {
          driver: 'Max Verstappen',
          team: 'Red Bull Racing Honda RBPT',
          gap: '+19.412s',
          points: 15,
        },
      },
      fastestLap: { driver: 'Esteban Ocon', team: 'Alpine', time: '1:37.330' },
    },
    {
      round: 20,
      grandPrix: 'Mexico City Grand Prix',
      circuit: 'Autódromo Hermanos Rodríguez',
      season: 2024,
      date: '27 Oct 2024',
      podium: {
        p1: { driver: 'Carlos Sainz', team: 'Ferrari', time: '1:40:55.800', points: 25 },
        p2: { driver: 'Lando Norris', team: 'McLaren Mercedes', gap: '+4.705s', points: 18 },
        p3: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+34.387s', points: 16 },
      },
      fastestLap: { driver: 'Charles Leclerc', team: 'Ferrari', time: '1:18.336' },
    },
    {
      round: 21,
      grandPrix: 'São Paulo Grand Prix',
      circuit: 'Autódromo José Carlos Pace (Interlagos)',
      season: 2024,
      date: '03 Nov 2024',
      podium: {
        p1: {
          driver: 'Max Verstappen',
          team: 'Red Bull Racing Honda RBPT',
          time: '2:06:54.430',
          points: 26,
        },
        p2: { driver: 'Esteban Ocon', team: 'Alpine Renault', gap: '+19.477s', points: 18 },
        p3: { driver: 'Pierre Gasly', team: 'Alpine Renault', gap: '+22.532s', points: 15 },
      },
      fastestLap: { driver: 'Max Verstappen', team: 'Red Bull Racing', time: '1:20.472' },
    },
    {
      round: 22,
      grandPrix: 'Las Vegas Grand Prix',
      circuit: 'Las Vegas Strip Circuit',
      season: 2024,
      date: '23 Nov 2024',
      podium: {
        p1: { driver: 'George Russell', team: 'Mercedes', time: '1:22:05.969', points: 25 },
        p2: { driver: 'Lewis Hamilton', team: 'Mercedes', gap: '+7.313s', points: 18 },
        p3: { driver: 'Carlos Sainz', team: 'Ferrari', gap: '+11.906s', points: 15 },
      },
      fastestLap: { driver: 'Lando Norris', team: 'McLaren', time: '1:35.908' },
    },
    {
      round: 23,
      grandPrix: 'Qatar Grand Prix',
      circuit: 'Lusail International Circuit',
      season: 2024,
      date: '01 Dec 2024',
      podium: {
        p1: {
          driver: 'Max Verstappen',
          team: 'Red Bull Racing Honda RBPT',
          time: '1:31:05.323',
          points: 25,
        },
        p2: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+6.031s', points: 18 },
        p3: { driver: 'Oscar Piastri', team: 'McLaren Mercedes', gap: '+6.819s', points: 15 },
      },
      fastestLap: { driver: 'Lando Norris', team: 'McLaren', time: '1:23.774' },
    },
    {
      round: 24,
      grandPrix: 'Abu Dhabi Grand Prix',
      circuit: 'Yas Marina Circuit',
      season: 2024,
      date: '08 Dec 2024',
      podium: {
        p1: { driver: 'Lando Norris', team: 'McLaren Mercedes', time: '1:26:33.291', points: 25 },
        p2: { driver: 'Carlos Sainz', team: 'Ferrari', gap: '+5.832s', points: 18 },
        p3: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+8.514s', points: 15 },
      },
      fastestLap: { driver: 'Kevin Magnussen', team: 'Haas', time: '1:25.637' },
    },
  ],
  rr = [
    {
      round: 1,
      grandPrix: 'Australian Grand Prix',
      circuit: 'Albert Park Grand Prix Circuit',
      season: 2026,
      dataSource: 'Jolpica F1 API',
      dataUpdatedAt: '2026-10-15',
      date: '08 Mar 2026',
      podium: {
        p1: { driver: 'George Russell', team: 'Mercedes', time: '1:23:06.801', points: 25 },
        p2: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', gap: '+2.974', points: 18 },
        p3: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+15.519', points: 15 },
      },
      fastestLap: { driver: 'Max Verstappen', team: 'Red Bull', time: '1:22.091' },
    },
    {
      round: 2,
      grandPrix: 'Chinese Grand Prix',
      circuit: 'Shanghai International Circuit',
      season: 2026,
      dataSource: 'Jolpica F1 API',
      dataUpdatedAt: '2026-10-15',
      date: '15 Mar 2026',
      podium: {
        p1: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', time: '1:33:15.607', points: 25 },
        p2: { driver: 'George Russell', team: 'Mercedes', gap: '+5.515', points: 18 },
        p3: { driver: 'Lewis Hamilton', team: 'Ferrari', gap: '+25.267', points: 15 },
      },
      fastestLap: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', time: '1:35.275' },
    },
    {
      round: 3,
      grandPrix: 'Japanese Grand Prix',
      circuit: 'Suzuka Circuit',
      season: 2026,
      dataSource: 'Jolpica F1 API',
      dataUpdatedAt: '2026-10-15',
      date: '29 Mar 2026',
      podium: {
        p1: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', time: '1:28:03.403', points: 25 },
        p2: { driver: 'Oscar Piastri', team: 'McLaren', gap: '+13.722', points: 18 },
        p3: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+15.270', points: 15 },
      },
      fastestLap: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', time: '1:32.432' },
    },
    {
      round: 4,
      grandPrix: 'Miami Grand Prix',
      circuit: 'Miami International Autodrome',
      season: 2026,
      dataSource: 'Jolpica F1 API',
      dataUpdatedAt: '2026-10-15',
      date: '03 May 2026',
      podium: {
        p1: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', time: '1:33:19.273', points: 25 },
        p2: { driver: 'Lando Norris', team: 'McLaren', gap: '+3.264', points: 18 },
        p3: { driver: 'Oscar Piastri', team: 'McLaren', gap: '+27.092', points: 15 },
      },
      fastestLap: { driver: 'Lando Norris', team: 'McLaren', time: '1:31.869' },
    },
    {
      round: 5,
      grandPrix: 'Canadian Grand Prix',
      circuit: 'Circuit Gilles Villeneuve',
      season: 2026,
      dataSource: 'Jolpica F1 API',
      dataUpdatedAt: '2026-10-15',
      date: '24 May 2026',
      podium: {
        p1: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', time: '1:28:15.758', points: 25 },
        p2: { driver: 'Lewis Hamilton', team: 'Ferrari', gap: '+10.768', points: 18 },
        p3: { driver: 'Max Verstappen', team: 'Red Bull', gap: '+11.276', points: 15 },
      },
      fastestLap: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', time: '1:14.210' },
    },
    {
      round: 6,
      grandPrix: 'Monaco Grand Prix',
      circuit: 'Circuit de Monaco',
      season: 2026,
      dataSource: 'Jolpica F1 API',
      dataUpdatedAt: '2026-10-15',
      date: '07 Jun 2026',
      podium: {
        p1: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', time: '2:23:31.243', points: 25 },
        p2: { driver: 'Lewis Hamilton', team: 'Ferrari', gap: '+6.271', points: 18 },
        p3: { driver: 'Isack Hadjar', team: 'Red Bull', gap: '+23.394', points: 15 },
      },
      fastestLap: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', time: '1:13.481' },
    },
    {
      round: 7,
      grandPrix: 'Barcelona-Catalunya Grand Prix',
      circuit: 'Circuit de Barcelona-Catalunya',
      season: 2026,
      dataSource: 'Jolpica F1 API',
      dataUpdatedAt: '2026-10-15',
      date: '14 Jun 2026',
      podium: {
        p1: { driver: 'Lewis Hamilton', team: 'Ferrari', time: '1:32:28.105', points: 25 },
        p2: { driver: 'George Russell', team: 'Mercedes', gap: '+19.561', points: 18 },
        p3: { driver: 'Lando Norris', team: 'McLaren', gap: '+23.719', points: 15 },
      },
      fastestLap: { driver: 'Lewis Hamilton', team: 'Ferrari', time: '1:20.122' },
    },
    {
      round: 8,
      grandPrix: 'Austrian Grand Prix',
      circuit: 'Red Bull Ring',
      season: 2026,
      dataSource: 'Jolpica F1 API',
      dataUpdatedAt: '2026-10-15',
      date: '28 Jun 2026',
      podium: {
        p1: { driver: 'George Russell', team: 'Mercedes', time: '1:26:37.979', points: 25 },
        p2: { driver: 'Max Verstappen', team: 'Red Bull', gap: '+1.611', points: 18 },
        p3: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', gap: '+1.986', points: 15 },
      },
      fastestLap: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', time: '1:10.374' },
    },
    {
      round: 9,
      grandPrix: 'British Grand Prix',
      circuit: 'Silverstone Circuit',
      season: 2026,
      dataSource: 'Jolpica F1 API',
      dataUpdatedAt: '2026-10-15',
      date: '05 Jul 2026',
      podium: {
        p1: { driver: 'Charles Leclerc', team: 'Ferrari', time: '1:27:11.335', points: 25 },
        p2: { driver: 'George Russell', team: 'Mercedes', gap: '+0.427', points: 18 },
        p3: { driver: 'Lewis Hamilton', team: 'Ferrari', gap: '+0.772', points: 15 },
      },
      fastestLap: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', time: '1:31.777' },
    },
    {
      round: 10,
      grandPrix: 'Belgian Grand Prix',
      circuit: 'Circuit de Spa-Francorchamps',
      season: 2026,
      dataSource: 'Jolpica F1 API',
      dataUpdatedAt: '2026-10-15',
      date: '19 Jul 2026',
      podium: {
        p1: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', time: '1:24:42.479', points: 25 },
        p2: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+1.952', points: 18 },
        p3: { driver: 'Max Verstappen', team: 'Red Bull', gap: '+11.586', points: 15 },
      },
      fastestLap: { driver: 'Lando Norris', team: 'McLaren', time: '1:48.890' },
    },
    {
      round: 11,
      grandPrix: 'Hungarian Grand Prix',
      circuit: 'Hungaroring',
      season: 2026,
      dataSource: 'Jolpica F1 API',
      dataUpdatedAt: '2026-10-15',
      date: '26 Jul 2026',
      podium: {
        p1: { driver: 'Lando Norris', team: 'McLaren', time: '1:39:56.180', points: 25 },
        p2: { driver: 'Max Verstappen', team: 'Red Bull', gap: '+15.080', points: 18 },
        p3: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', gap: '+18.728', points: 15 },
      },
      fastestLap: { driver: 'Charles Leclerc', team: 'Ferrari', time: '1:22.000' },
    },
    {
      round: 12,
      grandPrix: 'Dutch Grand Prix',
      circuit: 'Circuit Park Zandvoort',
      season: 2026,
      dataSource: 'Jolpica F1 API',
      dataUpdatedAt: '2026-10-15',
      date: '23 Aug 2026',
      podium: {
        p1: { driver: 'Lando Norris', team: 'McLaren', time: '2:04:44.859', points: 25 },
        p2: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', gap: '+11.536', points: 18 },
        p3: { driver: 'George Russell', team: 'Mercedes', gap: '+15.906', points: 15 },
      },
      fastestLap: { driver: 'Charles Leclerc', team: 'Ferrari', time: '1:14.230' },
    },
    {
      round: 13,
      grandPrix: 'Italian Grand Prix',
      circuit: 'Autodromo Nazionale di Monza',
      season: 2026,
      dataSource: 'Jolpica F1 API',
      dataUpdatedAt: '2026-10-15',
      date: '06 Sep 2026',
      podium: {
        p1: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', time: '1:51:15.281', points: 25 },
        p2: { driver: 'George Russell', team: 'Mercedes', gap: '+3.857', points: 18 },
        p3: { driver: 'Max Verstappen', team: 'Red Bull', gap: '+14.718', points: 15 },
      },
      fastestLap: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', time: '1:23.504' },
    },
    {
      round: 14,
      grandPrix: 'Spanish Grand Prix',
      circuit: 'Madring',
      season: 2026,
      dataSource: 'Jolpica F1 API',
      dataUpdatedAt: '2026-10-15',
      date: '13 Sep 2026',
      podium: {
        p1: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', time: '1:34:23.754', points: 25 },
        p2: { driver: 'Max Verstappen', team: 'Red Bull', gap: '+4.351', points: 18 },
        p3: { driver: 'Lando Norris', team: 'McLaren', gap: '+5.089', points: 15 },
      },
      fastestLap: { driver: 'George Russell', team: 'Mercedes', time: '1:35.587' },
    },
    {
      round: 15,
      grandPrix: 'Azerbaijan Grand Prix',
      circuit: 'Baku City Circuit',
      season: 2026,
      dataSource: 'Jolpica F1 API',
      dataUpdatedAt: '2026-10-15',
      date: '26 Sep 2026',
      podium: {
        p1: { driver: 'George Russell', team: 'Mercedes', time: '1:38:02.143', points: 25 },
        p2: { driver: 'Max Verstappen', team: 'Red Bull', gap: '+0.196', points: 18 },
        p3: { driver: 'Isack Hadjar', team: 'Red Bull', gap: '+10.704', points: 15 },
      },
      fastestLap: { driver: 'George Russell', team: 'Mercedes', time: '1:44.916' },
    },
    {
      round: 16,
      grandPrix: 'Malaysia Grand Prix',
      circuit: 'Sepang International Circuit',
      season: 2026,
      dataSource: 'Jolpica F1 API',
      dataUpdatedAt: '2026-10-15',
      date: '04 Oct 2026',
      podium: {
        p1: { driver: 'Max Verstappen', team: 'Red Bull', time: '1:47:14.808', points: 25 },
        p2: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', gap: '+2.307', points: 18 },
        p3: { driver: 'Lewis Hamilton', team: 'Ferrari', gap: '+4.919', points: 15 },
      },
      fastestLap: { driver: 'Max Verstappen', team: 'Red Bull', time: '1:38.220' },
    },
    {
      round: 17,
      grandPrix: 'Singapore Grand Prix',
      circuit: 'Marina Bay Street Circuit',
      season: 2026,
      dataSource: 'Jolpica F1 API',
      dataUpdatedAt: '2026-10-15',
      date: '11 Oct 2026',
      podium: {
        p1: { driver: 'Max Verstappen', team: 'Red Bull', time: '1:42:00.785', points: 25 },
        p2: { driver: 'Charles Leclerc', team: 'Ferrari', gap: '+7.335', points: 18 },
        p3: { driver: 'Andrea Kimi Antonelli', team: 'Mercedes', gap: '+24.573', points: 15 },
      },
      fastestLap: { driver: 'Charles Leclerc', team: 'Ferrari', time: '1:35.202' },
    },
  ],
  ir = { 2024: $e, 2025: ar, 2026: rr },
  tr = (e = 2024) => ir[e] || $e,
  sr = [
    {
      driverId: 'russell',
      driverName: 'George Russell',
      driverCode: 'RUS',
      driverNumber: 63,
      teamId: 'mercedes',
      teamName: 'Mercedes-AMG PETRONAS F1',
    },
    {
      driverId: 'antonelli',
      driverName: 'Andrea Kimi Antonelli',
      driverCode: 'ANT',
      driverNumber: 12,
      teamId: 'mercedes',
      teamName: 'Mercedes-AMG PETRONAS F1',
    },
    {
      driverId: 'verstappen',
      driverName: 'Max Verstappen',
      driverCode: 'VER',
      driverNumber: 3,
      teamId: 'redbull',
      teamName: 'Oracle Red Bull Racing',
    },
    {
      driverId: 'hadjar',
      driverName: 'Isack Hadjar',
      driverCode: 'HAD',
      driverNumber: 6,
      teamId: 'redbull',
      teamName: 'Oracle Red Bull Racing',
    },
    {
      driverId: 'leclerc',
      driverName: 'Charles Leclerc',
      driverCode: 'LEC',
      driverNumber: 16,
      teamId: 'ferrari',
      teamName: 'Scuderia Ferrari HP',
    },
    {
      driverId: 'hamilton',
      driverName: 'Lewis Hamilton',
      driverCode: 'HAM',
      driverNumber: 44,
      teamId: 'ferrari',
      teamName: 'Scuderia Ferrari HP',
    },
    {
      driverId: 'norris',
      driverName: 'Lando Norris',
      driverCode: 'NOR',
      driverNumber: 1,
      teamId: 'mclaren',
      teamName: 'McLaren Mastercard F1 Team',
    },
    {
      driverId: 'piastri',
      driverName: 'Oscar Piastri',
      driverCode: 'PIA',
      driverNumber: 81,
      teamId: 'mclaren',
      teamName: 'McLaren Mastercard F1 Team',
    },
    {
      driverId: 'sainz',
      driverName: 'Carlos Sainz',
      driverCode: 'SAI',
      driverNumber: 55,
      teamId: 'williams',
      teamName: 'Williams Racing',
    },
    {
      driverId: 'albon',
      driverName: 'Alexander Albon',
      driverCode: 'ALB',
      driverNumber: 23,
      teamId: 'williams',
      teamName: 'Williams Racing',
    },
    {
      driverId: 'alonso',
      driverName: 'Fernando Alonso',
      driverCode: 'ALO',
      driverNumber: 14,
      teamId: 'astonmartin',
      teamName: 'Aston Martin Aramco F1',
    },
    {
      driverId: 'stroll',
      driverName: 'Lance Stroll',
      driverCode: 'STR',
      driverNumber: 18,
      teamId: 'astonmartin',
      teamName: 'Aston Martin Aramco F1',
    },
    {
      driverId: 'lawson',
      driverName: 'Liam Lawson',
      driverCode: 'LAW',
      driverNumber: 30,
      teamId: 'racingbulls',
      teamName: 'Visa Cash App Racing Bulls',
    },
    {
      driverId: 'lindblad',
      driverName: 'Arvid Lindblad',
      driverCode: 'LIN',
      driverNumber: 41,
      teamId: 'racingbulls',
      teamName: 'Visa Cash App Racing Bulls',
    },
    {
      driverId: 'ocon',
      driverName: 'Esteban Ocon',
      driverCode: 'OCO',
      driverNumber: 31,
      teamId: 'haas',
      teamName: 'MoneyGram Haas F1 Team',
    },
    {
      driverId: 'bearman',
      driverName: 'Oliver Bearman',
      driverCode: 'BEA',
      driverNumber: 87,
      teamId: 'haas',
      teamName: 'MoneyGram Haas F1 Team',
    },
    {
      driverId: 'hulkenberg',
      driverName: 'Nico Hülkenberg',
      driverCode: 'HUL',
      driverNumber: 27,
      teamId: 'audi',
      teamName: 'Audi Revolut F1 Team',
    },
    {
      driverId: 'bortoleto',
      driverName: 'Gabriel Bortoleto',
      driverCode: 'BOR',
      driverNumber: 5,
      teamId: 'audi',
      teamName: 'Audi Revolut F1 Team',
    },
    {
      driverId: 'gasly',
      driverName: 'Pierre Gasly',
      driverCode: 'GAS',
      driverNumber: 10,
      teamId: 'alpine',
      teamName: 'BWT Alpine F1 Team',
    },
    {
      driverId: 'colapinto',
      driverName: 'Franco Colapinto',
      driverCode: 'COL',
      driverNumber: 43,
      teamId: 'alpine',
      teamName: 'BWT Alpine F1 Team',
    },
    {
      driverId: 'perez',
      driverName: 'Sergio Pérez',
      driverCode: 'PER',
      driverNumber: 11,
      teamId: 'cadillac',
      teamName: 'Cadillac Formula 1 Team',
    },
    {
      driverId: 'bottas',
      driverName: 'Valtteri Bottas',
      driverCode: 'BOT',
      driverNumber: 77,
      teamId: 'cadillac',
      teamName: 'Cadillac Formula 1 Team',
    },
  ],
  nr = [
    {
      driverId: 'norris',
      driverName: 'Lando Norris',
      driverCode: 'NOR',
      driverNumber: 4,
      teamId: 'mclaren',
      teamName: 'McLaren Formula 1 Team',
    },
    {
      driverId: 'piastri',
      driverName: 'Oscar Piastri',
      driverCode: 'PIA',
      driverNumber: 81,
      teamId: 'mclaren',
      teamName: 'McLaren Formula 1 Team',
    },
    {
      driverId: 'verstappen',
      driverName: 'Max Verstappen',
      driverCode: 'VER',
      driverNumber: 1,
      teamId: 'redbull',
      teamName: 'Oracle Red Bull Racing',
    },
    {
      driverId: 'tsunoda',
      driverName: 'Yuki Tsunoda',
      driverCode: 'TSU',
      driverNumber: 22,
      teamId: 'redbull',
      teamName: 'Oracle Red Bull Racing',
    },
    {
      driverId: 'leclerc',
      driverName: 'Charles Leclerc',
      driverCode: 'LEC',
      driverNumber: 16,
      teamId: 'ferrari',
      teamName: 'Scuderia Ferrari HP',
    },
    {
      driverId: 'hamilton',
      driverName: 'Lewis Hamilton',
      driverCode: 'HAM',
      driverNumber: 44,
      teamId: 'ferrari',
      teamName: 'Scuderia Ferrari HP',
    },
    {
      driverId: 'russell',
      driverName: 'George Russell',
      driverCode: 'RUS',
      driverNumber: 63,
      teamId: 'mercedes',
      teamName: 'Mercedes-AMG PETRONAS F1',
    },
    {
      driverId: 'antonelli',
      driverName: 'Andrea Kimi Antonelli',
      driverCode: 'ANT',
      driverNumber: 12,
      teamId: 'mercedes',
      teamName: 'Mercedes-AMG PETRONAS F1',
    },
    {
      driverId: 'sainz',
      driverName: 'Carlos Sainz',
      driverCode: 'SAI',
      driverNumber: 55,
      teamId: 'williams',
      teamName: 'Williams Racing',
    },
    {
      driverId: 'albon',
      driverName: 'Alexander Albon',
      driverCode: 'ALB',
      driverNumber: 23,
      teamId: 'williams',
      teamName: 'Williams Racing',
    },
    {
      driverId: 'alonso',
      driverName: 'Fernando Alonso',
      driverCode: 'ALO',
      driverNumber: 14,
      teamId: 'astonmartin',
      teamName: 'Aston Martin Aramco F1',
    },
    {
      driverId: 'stroll',
      driverName: 'Lance Stroll',
      driverCode: 'STR',
      driverNumber: 18,
      teamId: 'astonmartin',
      teamName: 'Aston Martin Aramco F1',
    },
    {
      driverId: 'hadjar',
      driverName: 'Isack Hadjar',
      driverCode: 'HAD',
      driverNumber: 6,
      teamId: 'racingbulls',
      teamName: 'Racing Bulls F1 Team',
    },
    {
      driverId: 'lawson',
      driverName: 'Liam Lawson',
      driverCode: 'LAW',
      driverNumber: 30,
      teamId: 'racingbulls',
      teamName: 'Racing Bulls F1 Team',
    },
    {
      driverId: 'hulkenberg',
      driverName: 'Nico Hülkenberg',
      driverCode: 'HUL',
      driverNumber: 27,
      teamId: 'audi',
      teamName: 'Kick Sauber F1 Team',
    },
    {
      driverId: 'bortoleto',
      driverName: 'Gabriel Bortoleto',
      driverCode: 'BOR',
      driverNumber: 5,
      teamId: 'audi',
      teamName: 'Kick Sauber F1 Team',
    },
    {
      driverId: 'bearman',
      driverName: 'Oliver Bearman',
      driverCode: 'BEA',
      driverNumber: 87,
      teamId: 'haas',
      teamName: 'MoneyGram Haas F1 Team',
    },
    {
      driverId: 'ocon',
      driverName: 'Esteban Ocon',
      driverCode: 'OCO',
      driverNumber: 31,
      teamId: 'haas',
      teamName: 'MoneyGram Haas F1 Team',
    },
    {
      driverId: 'gasly',
      driverName: 'Pierre Gasly',
      driverCode: 'GAS',
      driverNumber: 10,
      teamId: 'alpine',
      teamName: 'BWT Alpine F1 Team',
    },
    {
      driverId: 'colapinto',
      driverName: 'Franco Colapinto',
      driverCode: 'COL',
      driverNumber: 43,
      teamId: 'alpine',
      teamName: 'BWT Alpine F1 Team',
    },
  ],
  dr = [
    {
      driverId: 'verstappen',
      driverName: 'Max Verstappen',
      driverCode: 'VER',
      driverNumber: 1,
      teamId: 'redbull',
      teamName: 'Oracle Red Bull Racing',
    },
    {
      driverId: 'norris',
      driverName: 'Lando Norris',
      driverCode: 'NOR',
      driverNumber: 4,
      teamId: 'mclaren',
      teamName: 'McLaren Formula 1 Team',
    },
    {
      driverId: 'leclerc',
      driverName: 'Charles Leclerc',
      driverCode: 'LEC',
      driverNumber: 16,
      teamId: 'ferrari',
      teamName: 'Scuderia Ferrari HP',
    },
    {
      driverId: 'piastri',
      driverName: 'Oscar Piastri',
      driverCode: 'PIA',
      driverNumber: 81,
      teamId: 'mclaren',
      teamName: 'McLaren Formula 1 Team',
    },
    {
      driverId: 'sainz',
      driverName: 'Carlos Sainz',
      driverCode: 'SAI',
      driverNumber: 55,
      teamId: 'ferrari',
      teamName: 'Scuderia Ferrari HP',
    },
    {
      driverId: 'russell',
      driverName: 'George Russell',
      driverCode: 'RUS',
      driverNumber: 63,
      teamId: 'mercedes',
      teamName: 'Mercedes-AMG PETRONAS F1',
    },
    {
      driverId: 'hamilton',
      driverName: 'Lewis Hamilton',
      driverCode: 'HAM',
      driverNumber: 44,
      teamId: 'mercedes',
      teamName: 'Mercedes-AMG PETRONAS F1',
    },
    {
      driverId: 'perez',
      driverName: 'Sergio Pérez',
      driverCode: 'PER',
      driverNumber: 11,
      teamId: 'redbull',
      teamName: 'Oracle Red Bull Racing',
    },
    {
      driverId: 'alonso',
      driverName: 'Fernando Alonso',
      driverCode: 'ALO',
      driverNumber: 14,
      teamId: 'astonmartin',
      teamName: 'Aston Martin Aramco F1',
    },
    {
      driverId: 'gasly',
      driverName: 'Pierre Gasly',
      driverCode: 'GAS',
      driverNumber: 10,
      teamId: 'alpine',
      teamName: 'BWT Alpine F1 Team',
    },
    {
      driverId: 'hulkenberg',
      driverName: 'Nico Hülkenberg',
      driverCode: 'HUL',
      driverNumber: 27,
      teamId: 'haas',
      teamName: 'MoneyGram Haas F1 Team',
    },
    {
      driverId: 'tsunoda',
      driverName: 'Yuki Tsunoda',
      driverCode: 'TSU',
      driverNumber: 22,
      teamId: 'racingbulls',
      teamName: 'Visa Cash App RB F1',
    },
    {
      driverId: 'stroll',
      driverName: 'Lance Stroll',
      driverCode: 'STR',
      driverNumber: 18,
      teamId: 'astonmartin',
      teamName: 'Aston Martin Aramco F1',
    },
    {
      driverId: 'ocon',
      driverName: 'Esteban Ocon',
      driverCode: 'OCO',
      driverNumber: 31,
      teamId: 'alpine',
      teamName: 'BWT Alpine F1 Team',
    },
    {
      driverId: 'magnussen',
      driverName: 'Kevin Magnussen',
      driverCode: 'MAG',
      driverNumber: 20,
      teamId: 'haas',
      teamName: 'MoneyGram Haas F1 Team',
    },
    {
      driverId: 'albon',
      driverName: 'Alexander Albon',
      driverCode: 'ALB',
      driverNumber: 23,
      teamId: 'williams',
      teamName: 'Williams Racing',
    },
    {
      driverId: 'colapinto',
      driverName: 'Franco Colapinto',
      driverCode: 'COL',
      driverNumber: 43,
      teamId: 'williams',
      teamName: 'Williams Racing',
    },
    {
      driverId: 'zhou',
      driverName: 'Zhou Guanyu',
      driverCode: 'ZHO',
      driverNumber: 24,
      teamId: 'audi',
      teamName: 'Kick Sauber F1 Team',
    },
    {
      driverId: 'bottas',
      driverName: 'Valtteri Bottas',
      driverCode: 'BOT',
      driverNumber: 77,
      teamId: 'audi',
      teamName: 'Kick Sauber F1 Team',
    },
    {
      driverId: 'ricciardo',
      driverName: 'Daniel Ricciardo',
      driverCode: 'RIC',
      driverNumber: 3,
      teamId: 'racingbulls',
      teamName: 'Visa Cash App RB F1',
    },
  ],
  or = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
function we(e) {
  return e.toLowerCase().replace(/[^a-z]/g, '');
}
function mr(e, r) {
  const i = we(e);
  return r.find((s) => {
    const t = we(s.driverName);
    return t.includes(i) || i.includes(t) || s.driverCode.toLowerCase() === i;
  });
}
function lr(e, r, i) {
  const s = i == null ? void 0 : i.find((u) => u.round === r);
  if (s && s.entries && s.entries.length > 0) return s;
  const d = tr(e).find((u) => u.round === r);
  if (!d) return s || null;
  const n = e === 2026 ? sr : e === 2025 ? nr : dr,
    c = (e === 2026 ? he : e === 2025 ? Ue : He).find((u) => u.round === r),
    p =
      (c == null ? void 0 : c.laps) ||
      (d.circuit.toLowerCase().includes('monaco')
        ? 78
        : d.circuit.toLowerCase().includes('spa')
          ? 44
          : 57),
    b = [
      {
        position: 1,
        driver: d.podium.p1.driver,
        team: d.podium.p1.team,
        timeOrGap: d.podium.p1.time,
        points: d.podium.p1.points,
      },
      {
        position: 2,
        driver: d.podium.p2.driver,
        team: d.podium.p2.team,
        timeOrGap: d.podium.p2.gap,
        points: d.podium.p2.points,
      },
      {
        position: 3,
        driver: d.podium.p3.driver,
        team: d.podium.p3.team,
        timeOrGap: d.podium.p3.gap,
        points: d.podium.p3.points,
      },
    ].map((u) => {
      var S;
      const h = mr(u.driver, n),
        R = ((S = d.fastestLap) == null ? void 0 : S.driver) === u.driver,
        P = e < 2025 && R;
      return {
        position: u.position,
        driverId: (h == null ? void 0 : h.driverId) || 'unknown',
        driverName: u.driver,
        driverCode: (h == null ? void 0 : h.driverCode) || u.driver.slice(0, 3).toUpperCase(),
        driverNumber: h == null ? void 0 : h.driverNumber,
        teamId: (h == null ? void 0 : h.teamId) || D,
        teamName: u.team,
        laps: p,
        status: 'Finished',
        timeOrGap: u.timeOrGap,
        points: u.points ?? or[u.position - 1],
        fastestLap: P,
        fastestLapTime: P && d.fastestLap ? d.fastestLap.time : void 0,
      };
    });
  return {
    id: `race-${e}-r${r}`,
    season: e,
    round: r,
    grandPrix: d.grandPrix,
    officialName: `FORMULA 1 ${d.grandPrix.toUpperCase()} ${e}`,
    circuit: d.circuit,
    location: c == null ? void 0 : c.location,
    country: c == null ? void 0 : c.country,
    date: d.date,
    status: 'completed',
    lapsTotal: p,
    winner: { driver: d.podium.p1.driver, team: d.podium.p1.team, time: d.podium.p1.time },
    fastestLap: d.fastestLap,
    entries: b,
    isSynthesized: !0,
  };
}
const cr = () => {
    const e = navigator.connection;
    return (
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      !window.matchMedia('(max-width: 1023px)').matches &&
      !(e != null && e.saveData) &&
      (navigator.hardwareConcurrency ?? 4) >= 4
    );
  },
  ur = () => {
    const e = g.useRef(null),
      [r, i] = g.useState(!1);
    return (
      g.useEffect(() => {
        if (!cr()) return;
        const s = window.setTimeout(() => i(!0), 1200);
        return () => window.clearTimeout(s);
      }, []),
      g.useEffect(() => {
        if (!r) return;
        const s = e.current,
          t = s == null ? void 0 : s.getContext('2d', { alpha: !0 });
        if (!s || !t) return;
        let d = 0,
          n = 0,
          v = 0,
          c = 0,
          p = !document.hidden;
        const I = () => {
          ((n = s.width = window.innerWidth), (v = s.height = window.innerHeight));
        };
        I();
        const b = Array.from({ length: 20 }, () => ({
            x: Math.random() * n,
            y: Math.random() * v,
            length: 50 + Math.random() * 100,
            speed: 1.4 + Math.random() * 2.2,
            alpha: 0.05 + Math.random() * 0.12,
          })),
          u = (R) => {
            if (!p) return;
            if (R - c < 1e3 / 24) {
              d = requestAnimationFrame(u);
              return;
            }
            const P = Math.min(50, R - c || 16) / 16;
            ((c = R), t.clearRect(0, 0, n, v));
            for (const S of b) {
              const O = t.createLinearGradient(S.x, S.y, S.x + S.length, S.y);
              (O.addColorStop(0, 'rgba(255,255,255,0)'),
                O.addColorStop(1, `rgba(225,6,0,${S.alpha})`),
                t.beginPath(),
                (t.strokeStyle = O),
                (t.lineWidth = 1),
                t.moveTo(S.x, S.y),
                t.lineTo(S.x + S.length, S.y),
                t.stroke(),
                (S.x += S.speed * P),
                S.x > n + 30 && ((S.x = -S.length), (S.y = Math.random() * v)));
            }
            d = requestAnimationFrame(u);
          },
          h = () => {
            ((p = !document.hidden),
              p
                ? ((c = performance.now()), (d = requestAnimationFrame(u)))
                : cancelAnimationFrame(d));
          };
        return (
          window.addEventListener('resize', I, { passive: !0 }),
          document.addEventListener('visibilitychange', h),
          (d = requestAnimationFrame(u)),
          () => {
            (cancelAnimationFrame(d),
              window.removeEventListener('resize', I),
              document.removeEventListener('visibilitychange', h));
          }
        );
      }, [r]),
      r
        ? a.jsx('canvas', {
            ref: e,
            'aria-hidden': 'true',
            className: 'fixed inset-0 pointer-events-none z-[1] opacity-35',
          })
        : null
    );
  },
  pr = ({ pathname: e, children: r }) => {
    const [i, s] = g.useState(!1),
      t = g.useRef(e);
    return (
      g.useEffect(() => {
        if (t.current !== e) {
          ((t.current = e), s(!0));
          const d = setTimeout(() => {
            s(!1);
          }, 420);
          return () => clearTimeout(d);
        }
      }, [e]),
      a.jsxs('div', {
        className: 'relative w-full',
        children: [
          i &&
            a.jsx('div', {
              'aria-hidden': 'true',
              className: 'fixed inset-0 pointer-events-none z-[80] overflow-hidden',
              children: a.jsxs('div', {
                className: 'absolute inset-y-0 w-full animate-f1-speed-wipe',
                children: [
                  a.jsx('div', {
                    className:
                      'w-48 sm:w-72 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent blur-md',
                  }),
                  a.jsx('div', {
                    className:
                      'absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-white/70 via-white to-white/30 shadow-xs',
                  }),
                ],
              }),
            }),
          a.jsx('div', { className: 'animate-f1-depth-enter', children: r }, e),
        ],
      })
    );
  },
  vr = g.lazy(() =>
    E(
      () => import('./HomeView-B2llQla6.js'),
      __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    ).then((e) => ({ default: e.HomeView })),
  ),
  Xe = g.lazy(() =>
    E(
      () => import('./ChampionshipView-vwyw361T.js'),
      __vite__mapDeps([12, 11, 1, 2, 4, 9, 10, 8, 5]),
    ).then((e) => ({ default: e.ChampionshipView })),
  ),
  fr = g.lazy(() =>
    E(
      () => import('./ShowroomView-B_ycYY2X.js').then((e) => e.f),
      __vite__mapDeps([13, 11, 1, 14, 3, 5]),
    ).then((e) => ({ default: e.ShowroomView })),
  ),
  gr = g.lazy(() =>
    E(
      () => import('./TeamDetailPage-CvLzehG3.js'),
      __vite__mapDeps([15, 1, 16, 14, 2, 17, 3, 10, 9, 5, 11]),
    ).then((e) => ({ default: e.TeamDetailPage })),
  ),
  hr = g.lazy(() =>
    E(
      () => import('./DriverDetailPage-CzknJUCU.js'),
      __vite__mapDeps([18, 1, 4, 17, 10, 9, 2, 3, 5, 11]),
    ).then((e) => ({ default: e.DriverDetailPage })),
  ),
  Sr = g.lazy(() =>
    E(
      () => import('./CarDetailPage-DwlwaOCs.js'),
      __vite__mapDeps([19, 1, 16, 14, 17, 3, 5, 11]),
    ).then((e) => ({ default: e.CarDetailPage })),
  ),
  Nr = g.lazy(() =>
    E(
      () => import('./TeamsDirectoryPage-CKgCYTec.js'),
      __vite__mapDeps([20, 1, 2, 17, 3, 21, 9, 5, 11]),
    ).then((e) => ({ default: e.TeamsDirectoryPage })),
  ),
  Ir = g.lazy(() =>
    E(
      () => import('./DriversDirectoryPage-gxgfyEPz.js'),
      __vite__mapDeps([22, 1, 2, 4, 3, 21, 9, 10, 5, 11]),
    ).then((e) => ({ default: e.DriversDirectoryPage })),
  ),
  Ar = g.lazy(() =>
    E(() => import('./AboutPage-BKPYwubd.js'), __vite__mapDeps([23, 1, 5, 11])).then((e) => ({
      default: e.AboutPage,
    })),
  ),
  br = g.lazy(() =>
    E(
      () => import('./RaceClassificationModal-DZCDQYyd.js'),
      __vite__mapDeps([24, 1, 6, 9, 10, 5, 11]),
    ).then((e) => ({ default: e.RaceClassificationModal })),
  ),
  W = (e) => ya(e);
function Rr() {
  const { year: e } = Ge(),
    [r] = sa(),
    i = Ee(),
    s = Q((n) => n.setSelectedSeason),
    t = Q((n) => n.setActiveSubTab),
    d = W(e) ? Number(e) : 2026;
  return (
    g.useEffect(() => {
      W(e) && s(d);
      const n = r.get('tab');
      n && ['standings', 'calendar', 'results', 'teams', 'drivers'].includes(n) && t(n);
    }, [e, d, s, r, t]),
    W(e) ? a.jsx(Xe, { season: d, onSeasonChange: (n) => i(`/season/${n}`) }) : a.jsx(Y, {})
  );
}
function Pr() {
  const { year: e, round: r } = Ge(),
    i = Ee(),
    s = Q((I) => I.detailedResults),
    t = Q((I) => I.setSelectedSeason),
    d = Q((I) => I.setActiveSubTab),
    n = W(e) && /^\d+$/.test(r || ''),
    v = W(e) ? Number(e) : 2026,
    c = Number(r);
  if (
    (g.useLayoutEffect(() => {
      n && (t(v), d('results'));
    }, [n, v, t, d]),
    !n)
  )
    return a.jsx(Y, {});
  const p = lr(v, c, s[v]);
  return p
    ? a.jsxs(a.Fragment, {
        children: [
          a.jsx(Xe, { season: v, onSeasonChange: (I) => i(`/season/${I}`) }),
          a.jsx(g.Suspense, {
            fallback: null,
            children: a.jsx(br, { race: p, onClose: () => i(`/season/${v}?tab=results`) }),
          }),
        ],
      })
    : a.jsx(Y, {});
}
function Y() {
  const e = re((r) => r.lang);
  return a.jsxs('div', {
    className: 'page-container py-24 min-h-[60vh] text-center',
    children: [
      a.jsx('p', { className: 'text-f1red font-black text-6xl', children: '404' }),
      a.jsx('h1', {
        className: 'font-display text-2xl font-bold mt-4',
        children: e === 'vi' ? 'Không tìm thấy trang' : 'Page not found',
      }),
      a.jsx(q, {
        className: 'inline-block mt-6 text-f1red font-bold',
        to: '/',
        children: e === 'vi' ? 'Về trang chủ' : 'Go home',
      }),
    ],
  });
}
const Cr = () => {
  const e = ce(),
    [r, i] = g.useState(0);
  return (
    g.useEffect(() => {
      let s = !1;
      const t = () => {
        s ||
          (requestAnimationFrame(() => {
            const d = document.documentElement.scrollHeight - window.innerHeight,
              n = window.scrollY,
              v = d > 0 ? Math.min(1, Math.max(0, n / d)) : 0;
            (i(v), (s = !1));
          }),
          (s = !0));
      };
      return (
        window.addEventListener('scroll', t, { passive: !0 }),
        t(),
        () => window.removeEventListener('scroll', t)
      );
    }, [e.pathname]),
    g.useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [e.pathname]),
    a.jsxs('div', {
      className:
        'min-h-screen bg-studio-100 text-studio-900 flex flex-col font-sans selection:bg-f1red selection:text-white relative',
      children: [
        a.jsx(Ma, {}),
        !e.pathname.startsWith('/showroom') && a.jsx(ur, {}),
        a.jsx('div', {
          'aria-hidden': 'true',
          className: 'fixed inset-0 pointer-events-none z-[45] opacity-[0.025] hidden lg:block',
          style: {
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,255,255,0.4) 4px)',
          },
        }),
        a.jsx(Aa, {}),
        a.jsx('div', {
          className:
            'fixed top-0 left-0 right-0 h-[2.5px] z-[70] pointer-events-none bg-black/20 overflow-hidden',
          children: a.jsx('div', {
            style: { transform: `scaleX(${r})`, transformOrigin: 'left' },
            className:
              'w-full h-full bg-gradient-to-r from-f1red via-amber-400 to-yellow-300 transition-transform duration-75 ease-out',
          }),
        }),
        a.jsx('main', {
          className: 'min-h-screen flex-1 pt-16',
          children: a.jsx(pr, {
            pathname: e.pathname,
            children: a.jsx(g.Suspense, {
              fallback: a.jsx('div', {
                className:
                  'min-h-[70vh] animate-pulse bg-gradient-to-b from-studio-100 via-white to-studio-100',
                children: a.jsxs('div', {
                  className: 'page-container pt-12 space-y-5',
                  children: [
                    a.jsx('div', { className: 'h-4 w-28 rounded bg-studio-200' }),
                    a.jsx('div', { className: 'h-14 max-w-xl rounded bg-studio-200' }),
                    a.jsx('div', { className: 'h-[46vh] rounded-3xl bg-studio-200' }),
                  ],
                }),
              }),
              children: a.jsxs(ta, {
                children: [
                  a.jsx(T, { path: '/', element: a.jsx(vr, {}) }),
                  ['/live', '/archive', '/timing'].map((s) =>
                    a.jsx(
                      T,
                      {
                        path: s,
                        element: a.jsx($, { to: '/season/2026?tab=results', replace: !0 }),
                      },
                      s,
                    ),
                  ),
                  a.jsx(T, {
                    path: '/season',
                    element: a.jsx($, { to: '/season/2026', replace: !0 }),
                  }),
                  a.jsx(T, {
                    path: '/championship',
                    element: a.jsx($, { to: '/season/2026', replace: !0 }),
                  }),
                  a.jsx(T, { path: '/season/:year', element: a.jsx(Rr, {}) }),
                  a.jsx(T, { path: '/season/:year/race/:round', element: a.jsx(Pr, {}) }),
                  a.jsx(T, { path: '/showroom', element: a.jsx(fr, {}) }),
                  a.jsx(T, {
                    path: '/gallery',
                    element: a.jsx($, { to: '/showroom', replace: !0 }),
                  }),
                  a.jsx(T, { path: '/teams/:teamId', element: a.jsx(gr, {}) }),
                  a.jsx(T, { path: '/drivers/:driverId', element: a.jsx(hr, {}) }),
                  a.jsx(T, { path: '/cars/:carId', element: a.jsx(Sr, {}) }),
                  a.jsx(T, { path: '/teams', element: a.jsx(Nr, {}) }),
                  a.jsx(T, { path: '/drivers', element: a.jsx(Ir, {}) }),
                  a.jsx(T, { path: '/about', element: a.jsx(Ar, {}) }),
                  a.jsx(T, { path: '*', element: a.jsx(Y, {}) }),
                ],
              }),
            }),
          }),
        }),
        a.jsx(Ra, {}),
      ],
    })
  );
};
class Lr extends g.Component {
  constructor() {
    super(...arguments);
    k(this, 'state', { hasError: !1, error: null, errorInfo: null });
    k(this, 'handleReset', () => {
      (this.setState({ hasError: !1, error: null, errorInfo: null }), window.location.reload());
    });
    k(this, 'handleClearStorageAndReload', () => {
      try {
        (localStorage.clear(), sessionStorage.clear());
      } catch {}
      window.location.href = '/';
    });
  }
  static getDerivedStateFromError(i) {
    return { hasError: !0, error: i, errorInfo: null };
  }
  componentDidCatch(i, s) {
    (console.error('CRITICAL REACT ERROR CAUGHT BY ERRORBOUNDARY:', i, s),
      this.setState({ error: i, errorInfo: s }));
  }
  render() {
    var i;
    return this.state.hasError
      ? this.props.fallback
        ? this.props.fallback
        : a.jsx('div', {
            className:
              'min-h-screen bg-[#09090b] text-white flex items-center justify-center p-6 font-sans',
            children: a.jsxs('div', {
              className:
                'max-w-2xl w-full bg-[#18181b] border border-red-500/30 rounded-2xl p-8 shadow-2xl space-y-6',
              children: [
                a.jsxs('div', {
                  className: 'flex items-center gap-4',
                  children: [
                    a.jsx('div', {
                      className:
                        'w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0',
                      children: a.jsx(ga, { className: 'w-8 h-8' }),
                    }),
                    a.jsxs('div', {
                      children: [
                        a.jsx('span', {
                          className:
                            'text-[11px] font-mono uppercase tracking-widest text-red-400 font-bold',
                          children: 'F1 SYSTEM PIT-STOP ERROR',
                        }),
                        a.jsx('h1', {
                          className: 'text-2xl font-black tracking-tight text-white mt-0.5',
                          children: 'Đã xảy ra sự cố hiển thị (Render Crash)',
                        }),
                      ],
                    }),
                  ],
                }),
                a.jsx('p', {
                  className: 'text-sm text-zinc-300 leading-relaxed',
                  children:
                    'Ứng dụng vừa gặp một lỗi xử lý dữ liệu giao diện không mong muốn. Để tránh gián đoạn trải nghiệm, bạn có thể thử tải lại hoặc xóa bộ nhớ tạm để hệ thống đồng bộ lại từ đầu.',
                }),
                this.state.error &&
                  a.jsxs('div', {
                    className:
                      'bg-black/60 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-red-300 overflow-x-auto max-h-48',
                    children: [
                      a.jsx('p', {
                        className: 'font-bold mb-1 text-red-400',
                        children: this.state.error.toString(),
                      }),
                      ((i = this.state.errorInfo) == null ? void 0 : i.componentStack) &&
                        a.jsx('pre', {
                          className: 'text-[10px] text-zinc-500 whitespace-pre-wrap',
                          children: this.state.errorInfo.componentStack,
                        }),
                    ],
                  }),
                a.jsxs('div', {
                  className: 'flex flex-wrap items-center gap-3 pt-2',
                  children: [
                    a.jsxs('button', {
                      onClick: this.handleReset,
                      className:
                        'flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-red-600/20 cursor-pointer',
                      children: [
                        a.jsx(ha, { className: 'w-4 h-4' }),
                        a.jsx('span', { children: 'Tải lại trang' }),
                      ],
                    }),
                    a.jsxs('button', {
                      onClick: this.handleClearStorageAndReload,
                      className:
                        'flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold uppercase tracking-wider transition-all border border-zinc-700 cursor-pointer',
                      children: [
                        a.jsx(Sa, { className: 'w-4 h-4 text-zinc-400' }),
                        a.jsx('span', { children: 'Xóa dữ liệu đệm & Khôi phục' }),
                      ],
                    }),
                    a.jsxs('a', {
                      href: '/',
                      className:
                        'flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all ml-auto',
                      children: [
                        a.jsx(Be, { className: 'w-4 h-4' }),
                        a.jsx('span', { children: 'Trang chủ' }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          })
      : this.props.children;
  }
}
var Z = {},
  Mr = () => {
    window.va ||
      (window.va = function (...r) {
        (window.vaq || (window.vaq = []), window.vaq.push(r));
      });
  },
  xr = '@vercel/analytics',
  yr = '2.0.1';
function Ye() {
  return typeof window < 'u';
}
function Ze() {
  try {
    const e = 'production';
  } catch {}
  return 'production';
}
function Fr(e = 'auto') {
  if (e === 'auto') {
    window.vam = Ze();
    return;
  }
  window.vam = e;
}
function Tr() {
  return (Ye() ? window.vam : Ze()) || 'production';
}
function Se() {
  return Tr() === 'development';
}
function wr(e) {
  return e.scriptSrc
    ? j(e.scriptSrc)
    : Se()
      ? 'https://va.vercel-scripts.com/v1/script.debug.js'
      : e.basePath
        ? j(`${e.basePath}/insights/script.js`)
        : '/_vercel/insights/script.js';
}
function Or(e, r) {
  var i;
  let s = e;
  if (r)
    try {
      s = { ...((i = JSON.parse(r)) == null ? void 0 : i.analytics), ...e };
    } catch {}
  Fr(s.mode);
  const t = { sdkn: xr + (s.framework ? `/${s.framework}` : ''), sdkv: yr };
  return (
    s.disableAutoTrack && (t.disableAutoTrack = '1'),
    s.viewEndpoint && (t.viewEndpoint = j(s.viewEndpoint)),
    s.eventEndpoint && (t.eventEndpoint = j(s.eventEndpoint)),
    s.sessionEndpoint && (t.sessionEndpoint = j(s.sessionEndpoint)),
    Se() && s.debug === !1 && (t.debug = 'false'),
    s.dsn && (t.dsn = s.dsn),
    s.endpoint
      ? (t.endpoint = s.endpoint)
      : s.basePath && (t.endpoint = j(`${s.basePath}/insights`)),
    { beforeSend: s.beforeSend, src: wr(s), dataset: t }
  );
}
function j(e) {
  return e.startsWith('http://') || e.startsWith('https://') || e.startsWith('/') ? e : `/${e}`;
}
function Gr(e = { debug: !0 }, r) {
  var i;
  if (!Ye()) return;
  const { beforeSend: s, src: t, dataset: d } = Or(e, r);
  if (
    (Mr(),
    s && ((i = window.va) == null || i.call(window, 'beforeSend', s)),
    document.head.querySelector(`script[src*="${t}"]`))
  )
    return;
  const n = document.createElement('script');
  n.src = t;
  for (const [v, c] of Object.entries(d)) n.dataset[v] = c;
  ((n.defer = !0),
    (n.onerror = () => {
      const v = Se()
        ? 'Please check if any ad blockers are enabled and try again.'
        : 'Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.';
      console.log(`[Vercel Web Analytics] Failed to load script from ${t}. ${v}`);
    }),
    document.head.appendChild(n));
}
function Er({ route: e, path: r }) {
  var i;
  (i = window.va) == null || i.call(window, 'pageview', { route: e, path: r });
}
function Br() {
  if (!(typeof process > 'u' || typeof Z > 'u')) return Z.REACT_APP_VERCEL_OBSERVABILITY_BASEPATH;
}
function Dr() {
  if (!(typeof process > 'u' || typeof Z > 'u'))
    return Z.REACT_APP_VERCEL_OBSERVABILITY_CLIENT_CONFIG;
}
function kr(e) {
  return (
    g.useEffect(() => {
      var r;
      e.beforeSend && ((r = window.va) == null || r.call(window, 'beforeSend', e.beforeSend));
    }, [e.beforeSend]),
    g.useEffect(() => {
      Gr(
        {
          framework: e.framework || 'react',
          basePath: e.basePath ?? Br(),
          ...(e.route !== void 0 && { disableAutoTrack: !0 }),
          ...e,
        },
        e.configString ?? Dr(),
      );
    }, []),
    g.useEffect(() => {
      e.route && e.path && Er({ route: e.route, path: e.path });
    }, [e.route, e.path]),
    null
  );
}
var ee = {},
  jr = () => {
    window.si ||
      (window.si = function (...r) {
        ((window.siq = window.siq || []), window.siq.push(r));
      });
  },
  Hr = '@vercel/speed-insights',
  Ur = '2.0.0';
function _r() {
  return typeof window < 'u';
}
function Kr() {
  try {
    const e = 'production';
  } catch {}
  return 'production';
}
function ea() {
  return Kr() === 'development';
}
function Vr(e) {
  return e.scriptSrc
    ? ae(e.scriptSrc)
    : ea()
      ? 'https://va.vercel-scripts.com/v1/speed-insights/script.debug.js'
      : e.dsn
        ? 'https://va.vercel-scripts.com/v1/speed-insights/script.js'
        : e.basePath
          ? ae(`${e.basePath}/speed-insights/script.js`)
          : '/_vercel/speed-insights/script.js';
}
function zr(e, r) {
  var i;
  let s = e;
  if (r)
    try {
      s = { ...((i = JSON.parse(r)) == null ? void 0 : i.speedInsights), ...e };
    } catch {}
  const t = { sdkn: Hr + (s.framework ? `/${s.framework}` : ''), sdkv: Ur };
  return (
    s.sampleRate && (t.sampleRate = s.sampleRate.toString()),
    s.route && (t.route = s.route),
    ea() && s.debug === !1 && (t.debug = 'false'),
    s.dsn && (t.dsn = s.dsn),
    s.endpoint
      ? (t.endpoint = ae(s.endpoint))
      : s.basePath && (t.endpoint = ae(`${s.basePath}/speed-insights/vitals`)),
    { src: Vr(s), beforeSend: s.beforeSend, dataset: t }
  );
}
function ae(e) {
  return e.startsWith('http://') || e.startsWith('https://') || e.startsWith('/') ? e : `/${e}`;
}
function qr(e = {}, r) {
  var i;
  if (!_r() || e.route === null) return null;
  jr();
  const { beforeSend: s, src: t, dataset: d } = zr(e, r);
  if (document.head.querySelector(`script[src*="${t}"]`)) return null;
  s && ((i = window.si) == null || i.call(window, 'beforeSend', s));
  const n = document.createElement('script');
  ((n.src = t), (n.defer = !0));
  for (const [v, c] of Object.entries(d)) n.dataset[v] = c;
  return (
    (n.onerror = () => {
      console.log(
        `[Vercel Speed Insights] Failed to load script from ${t}. Please check if any content blockers are enabled and try again.`,
      );
    }),
    document.head.appendChild(n),
    {
      setRoute: (v) => {
        n.dataset.route = v ?? void 0;
      },
    }
  );
}
function Jr() {
  if (!(typeof process > 'u' || typeof ee > 'u')) return ee.REACT_APP_VERCEL_OBSERVABILITY_BASEPATH;
}
function Qr() {
  if (!(typeof process > 'u' || typeof ee > 'u'))
    return ee.REACT_APP_VERCEL_OBSERVABILITY_CLIENT_CONFIG;
}
function Wr(e) {
  g.useEffect(() => {
    var i;
    e.beforeSend && ((i = window.si) == null || i.call(window, 'beforeSend', e.beforeSend));
  }, [e.beforeSend]);
  const r = g.useRef(null);
  return (
    g.useEffect(() => {
      if (!r.current) {
        const i = qr(
          { framework: e.framework ?? 'react', basePath: e.basePath ?? Jr(), ...e },
          e.configString ?? Qr(),
        );
        i && (r.current = i.setRoute);
      }
    }, [e]),
    g.useEffect(() => {
      r.current && e.route && r.current(e.route);
    }, [e.route]),
    null
  );
}
function $r(e) {
  try {
    const r = new URL(e);
    return ((r.search = ''), (r.hash = ''), r.toString());
  } catch {
    return e.split(/[?#]/, 1)[0];
  }
}
const Xr = () => {
  const { pathname: e } = ce(),
    r = g.useCallback((i) => ({ ...i, url: $r(i.url), route: e }), [e]);
  return a.jsx(Wr, { route: e, sampleRate: 1, beforeSend: r });
};
na.createRoot(document.getElementById('root')).render(
  a.jsx(le.StrictMode, {
    children: a.jsx(Lr, {
      children: a.jsxs(da, {
        children: [a.jsx(Cr, {}), a.jsx(kr, { mode: 'production' }), a.jsx(Xr, {})],
      }),
    }),
  }),
);
export {
  he as C,
  ie as D,
  Lr as E,
  Pe as S,
  de as T,
  Q as a,
  ri as b,
  w as c,
  ba as d,
  lr as e,
  tr as f,
  ii as g,
  Ba as o,
  ne as t,
  re as u,
};
