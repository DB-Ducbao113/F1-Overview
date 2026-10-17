import { j as e, L as s } from './vendor-react-B62-MmwA.js';
import { u as d, c as n, d as c } from './index-CS6oMniN.js';
import {
  O as l,
  a2 as h,
  b as a,
  F as m,
  E as i,
  a as r,
  B as u,
  a3 as x,
  a4 as p,
  S as g,
  r as b,
  a5 as f,
  w as j,
  a6 as v,
} from './vendor-icons-Brb4Fsqu.js';
import './vendor-core-ckwbz45p.js';
const D = () => {
  const t = d((o) => o.lang) === 'vi';
  return e.jsxs('div', {
    className: 'page-container py-12 md:py-16 max-w-5xl',
    children: [
      e.jsx('div', {
        className: 'mb-6',
        children: e.jsxs(s, {
          to: '/',
          className:
            'inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-studio-500 hover:text-f1red transition-colors',
          children: [
            e.jsx(l, { className: 'w-3.5 h-3.5' }),
            t ? 'Quay lại Trang chủ' : 'Back to Home',
          ],
        }),
      }),
      e.jsxs('header', {
        className: 'border-b border-studio-200 pb-8 mb-10',
        children: [
          e.jsxs('div', {
            className: 'flex flex-wrap items-center gap-2 mb-3',
            children: [
              e.jsx('span', {
                className:
                  'inline-block text-xs font-black uppercase tracking-widest text-f1red bg-f1red/10 px-3 py-1 rounded-full',
                children: t ? 'Giới thiệu Dự án & Kiến trúc' : 'Project Architecture & Creator',
              }),
              e.jsx('span', {
                className:
                  'inline-block text-xs font-bold uppercase tracking-wider text-studio-600 bg-studio-200/70 px-3 py-1 rounded-full',
                children: t ? 'Phi Thương Mại · Non-Commercial' : 'Open Fan Tribute',
              }),
            ],
          }),
          e.jsx('h1', {
            className:
              'font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-studio-950',
            children: 'PODIUM — Effet de Sol',
          }),
          e.jsx('p', {
            className: 'mt-4 text-base sm:text-lg text-studio-600 max-w-3xl leading-relaxed',
            children: t
              ? 'Không gian trải nghiệm 3D tương tác và trung tâm lưu trữ dữ liệu chuyên sâu dành riêng cho kỷ nguyên khí động học hiệu ứng mặt đất Formula 1 (2022–2026).'
              : 'Interactive 3D technical showcase and championship data archive dedicated to the Formula 1 Ground Effect era (2022–2026).',
          }),
        ],
      }),
      e.jsx('section', {
        className:
          'bg-gradient-to-br from-studio-900 to-studio-950 text-white rounded-2xl p-6 sm:p-8 mb-10 shadow-lg border border-studio-800',
        children: e.jsxs('div', {
          className: 'flex flex-col items-start gap-6',
          children: [
            e.jsx('div', {
              className:
                'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-f1red to-yellow-500 flex items-center justify-center text-white shadow-md shrink-0',
              children: e.jsx(h, { className: 'w-9 h-9' }),
            }),
            e.jsxs('div', {
              className: 'flex-1',
              children: [
                e.jsxs('div', {
                  className: 'flex flex-wrap items-center gap-3',
                  children: [
                    e.jsx('h2', {
                      className: 'font-display text-2xl font-bold uppercase tracking-wide',
                      children: 'BaoBungBu',
                    }),
                    e.jsx('span', {
                      className:
                        'text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-studio-300 font-mono',
                      children: t ? 'Tác giả & Nhà phát triển' : 'Creator & Lead Developer',
                    }),
                  ],
                }),
                e.jsx('p', {
                  className: 'mt-3 text-sm text-studio-300 leading-relaxed max-w-3xl',
                  children: t
                    ? 'Dự án được khởi xướng và phát triển độc lập bởi BaoBungBu xuất phát từ niềm đam mê sâu sắc với tốc độ, kỹ thuật chế tạo xe đua Formula 1 và đồ họa không gian ba chiều WebGL. Toàn bộ nền tảng được xây dựng với mục tiêu mang đến một góc nhìn trực quan, hiện đại và hoàn toàn miễn phí cho cộng đồng người hâm mộ thể thao tốc độ.'
                    : 'PODIUM — Effet de Sol was conceived and engineered independently by BaoBungBu, driven by a profound enthusiasm for modern Formula 1 engineering, aerodynamics, and real-time WebGL experiences. The hub is built as a 100% free, community-first tribute for motorsport enthusiasts.',
                }),
                e.jsxs('div', {
                  className:
                    'mt-4 flex flex-wrap items-center gap-4 text-xs text-studio-400 font-mono',
                  children: [
                    e.jsxs('span', {
                      className: 'flex items-center gap-1.5 text-f1red',
                      children: [
                        e.jsx(a, { className: 'w-3.5 h-3.5 fill-current' }),
                        t ? 'Xây dựng vì đam mê thể thao' : 'Built for the racing community',
                      ],
                    }),
                    e.jsx('span', { children: '•' }),
                    e.jsx('span', {
                      children: t ? 'Độc lập & Phi lợi nhuận' : 'Independent & Non-profit',
                    }),
                    e.jsx('span', { children: '•' }),
                    e.jsx('span', { children: '2024–2026' }),
                  ],
                }),
                e.jsxs('a', {
                  href: n.facebook,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className:
                    'mt-5 inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:outline-f1red',
                  children: [
                    e.jsx(m, { className: 'h-4 w-4', 'aria-hidden': 'true' }),
                    t ? 'Liên hệ tác giả qua Facebook' : 'Contact the creator on Facebook',
                    e.jsx(i, { className: 'h-3.5 w-3.5', 'aria-hidden': 'true' }),
                  ],
                }),
              ],
            }),
          ],
        }),
      }),
      e.jsxs('section', {
        'aria-labelledby': 'feedback-heading',
        className: 'mb-10 rounded-2xl border border-studio-200 bg-white p-6 shadow-sm sm:p-8',
        children: [
          e.jsx('div', {
            className:
              'mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-f1red/10 text-f1red',
            children: e.jsx(r, { className: 'h-5 w-5', 'aria-hidden': 'true' }),
          }),
          e.jsx('h2', {
            id: 'feedback-heading',
            className: 'font-display text-2xl font-bold uppercase tracking-tight text-studio-950',
            children: t ? 'Góp ý cho PODIUM' : 'Help improve PODIUM',
          }),
          e.jsx('p', {
            className: 'mt-4 max-w-3xl text-sm leading-7 text-studio-600',
            children: t
              ? 'Bạn gặp lỗi, có ý tưởng tính năng mới hoặc muốn góp ý về trải nghiệm? Chia sẻ phản hồi để giúp PODIUM tốt hơn. Biểu mẫu hỗ trợ tiếng Việt và tiếng Anh.'
              : 'Found a bug, have a feature idea, or want to share your experience? Send your feedback to help make PODIUM better. The form supports Vietnamese and English.',
          }),
          e.jsxs('a', {
            href: n.feedbackFormUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
            className:
              'mt-6 inline-flex items-center gap-2 rounded-lg bg-f1red px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-f1red-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-f1red',
            children: [
              e.jsx(r, { className: 'h-4 w-4', 'aria-hidden': 'true' }),
              t ? 'Gửi góp ý' : 'Send feedback',
              e.jsx(i, { className: 'h-3.5 w-3.5', 'aria-hidden': 'true' }),
            ],
          }),
          e.jsx('p', {
            className: 'mt-3 text-xs leading-5 text-studio-500',
            children: t ? 'Mở Google Forms trong tab mới.' : 'Opens Google Forms in a new tab.',
          }),
        ],
      }),
      e.jsxs('section', {
        'aria-labelledby': 'donate-heading',
        className:
          'mb-10 grid grid-cols-1 gap-8 rounded-2xl border border-studio-200 bg-white p-6 shadow-sm sm:p-8 md:grid-cols-[1fr_18rem] md:items-start',
        children: [
          e.jsxs('div', {
            children: [
              e.jsx('div', {
                className:
                  'mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-f1red/10 text-f1red',
                children: e.jsx(a, { className: 'h-5 w-5', 'aria-hidden': 'true' }),
              }),
              e.jsx('h2', {
                id: 'donate-heading',
                className:
                  'font-display text-2xl font-bold uppercase tracking-tight text-studio-950',
                children: t ? 'Ủng hộ tác giả' : 'Support the creator',
              }),
              e.jsx('p', {
                className: 'mt-4 text-sm leading-7 text-studio-600',
                children: t
                  ? 'Ủng hộ tác giả để tiếp tục phát triển web. Nếu bạn yêu thích PODIUM, bạn có thể donate để ủng hộ thời gian và công sức phát triển dự án. Mọi đóng góp đều tự nguyện; bạn vẫn có thể sử dụng toàn bộ website miễn phí.'
                  : 'Support the creator to keep developing the website. If you enjoy PODIUM, you can donate to support the time and effort behind the project. Contributions are voluntary, and the entire website remains free to use.',
              }),
              e.jsx('p', {
                className: 'mt-3 text-sm leading-7 text-studio-600',
                children: t
                  ? 'Quét mã bằng ứng dụng ngân hàng, hoặc tải ảnh QR để sử dụng trên điện thoại. Cảm ơn bạn đã đồng hành!'
                  : 'Scan with your banking app, or download the QR image to use on your phone. Thank you for your support!',
              }),
              e.jsxs('dl', {
                className:
                  'mt-6 space-y-4 rounded-xl border border-studio-200 bg-studio-50 p-5 text-sm',
                children: [
                  e.jsxs('div', {
                    children: [
                      e.jsx('dt', {
                        className: 'text-xs text-studio-500',
                        children: t ? 'Ngân hàng' : 'Bank',
                      }),
                      e.jsx('dd', {
                        className: 'mt-1 font-semibold text-studio-900',
                        children: n.donation.bank,
                      }),
                    ],
                  }),
                  e.jsxs('div', {
                    children: [
                      e.jsx('dt', {
                        className: 'text-xs text-studio-500',
                        children: t ? 'Chủ tài khoản' : 'Account holder',
                      }),
                      e.jsx('dd', {
                        className: 'mt-1 font-semibold text-studio-900',
                        children: n.donation.recipient,
                      }),
                    ],
                  }),
                  e.jsxs('div', {
                    children: [
                      e.jsx('dt', {
                        className: 'text-xs text-studio-500',
                        children: t ? 'Số tài khoản' : 'Account number',
                      }),
                      e.jsx('dd', {
                        className: 'mt-1 select-all font-mono font-semibold text-studio-900',
                        children: n.donation.account,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          e.jsx('div', {
            className: 'flex justify-center text-studio-700',
            children: e.jsx(c, {}),
          }),
        ],
      }),
      e.jsxs('div', {
        className: 'grid grid-cols-1 md:grid-cols-2 gap-8 mb-12',
        children: [
          e.jsxs('section', {
            className:
              'bg-white border border-studio-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between',
            children: [
              e.jsxs('div', {
                children: [
                  e.jsx('div', {
                    className:
                      'w-10 h-10 rounded-xl bg-f1red/10 text-f1red flex items-center justify-center mb-5',
                    children: e.jsx(u, { className: 'w-5 h-5' }),
                  }),
                  e.jsx('h3', {
                    className: 'font-display text-xl font-bold uppercase text-studio-900 mb-3',
                    children: t
                      ? 'Kiến trúc 3D & Tối ưu Hiệu năng'
                      : '3D Architecture & Performance Engineering',
                  }),
                  e.jsxs('div', {
                    className: 'text-sm text-studio-600 leading-relaxed space-y-3',
                    children: [
                      e.jsx('p', {
                        children: t
                          ? 'Để đảm bảo trải nghiệm tức thì trên cả trình duyệt máy tính lẫn điện thoại, showroom áp dụng giải pháp tối ưu: sử dụng một khung gầm 3D chuẩn mực (Alfa Romeo C42 base mesh) làm hình học đại diện cho toàn bộ quy định khí động học Venturi.'
                          : 'To achieve instantaneous page loads and sustained 60 FPS performance across mobile and desktop devices, the showroom adopts an optimized architectural decision: a single unified Ground Effect chassis geometry (Alfa Romeo C42 base mesh) acts as the representative canvas.',
                      }),
                      e.jsx('p', {
                        children: t
                          ? 'Nhận diện và màu sắc của 11 đội đua được chiếu động bằng Canvas Procedural Texture Generator và hệ thống Shaders PBR. Nhờ đó, người dùng chỉ cần tải một file hình học 3D tối ưu (~2,4 MB) thay vì 11 file độc lập cồng kềnh (>200 MB).'
                          : 'Liveries and textures for all 11 teams are procedurally synthesized via an in-memory canvas engine and custom PBR shaders, cutting network transfer from >200 MB down to a single compact asset.',
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs('div', {
                className:
                  'mt-6 pt-4 border-t border-studio-100 flex items-center gap-2 text-xs font-semibold text-studio-500 font-mono',
                children: [
                  e.jsx(x, { className: 'w-4 h-4 text-f1red' }),
                  e.jsx('span', {
                    children: 'WebGL · Three.js · React Three Fiber · PBR Materials',
                  }),
                ],
              }),
            ],
          }),
          e.jsxs('section', {
            className:
              'bg-white border border-studio-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between',
            children: [
              e.jsxs('div', {
                children: [
                  e.jsx('div', {
                    className:
                      'w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-5',
                    children: e.jsx(p, { className: 'w-5 h-5' }),
                  }),
                  e.jsx('h3', {
                    className: 'font-display text-xl font-bold uppercase text-studio-900 mb-3',
                    children: t
                      ? 'Cơ sở Dữ liệu & Tự động Hóa'
                      : 'Automated Data Pipeline & Telemetry',
                  }),
                  e.jsxs('div', {
                    className: 'text-sm text-studio-600 leading-relaxed space-y-3',
                    children: [
                      e.jsx('p', {
                        children: t
                          ? 'Lịch thi đấu, kết quả từng vòng phân hạng và bảng xếp hạng giải đua được đồng bộ hóa từ Jolpica Ergast F1 API — cơ sở dữ liệu mở uy tín phục vụ cộng đồng đua xe thế giới.'
                          : 'Season calendars, qualifying classifications, and championship points are automatically retrieved from the open community Jolpica Ergast F1 API.',
                      }),
                      e.jsx('p', {
                        children: t
                          ? 'Hệ thống vận hành theo nguyên lý Static-First: dữ liệu chính thức được kiểm định và tích hợp vào mã nguồn qua GitHub Actions CI/CD, kết hợp với cơ chế hòa giải dữ liệu trực tiếp khi có diễn biến chặng đua mới.'
                          : 'The engine uses an authoritative static baseline committed via CI/CD pipelines, harmonized with non-intrusive client-side synchronization for real-time race weekend updates.',
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs('div', {
                className:
                  'mt-6 pt-4 border-t border-studio-100 flex items-center justify-between text-xs font-semibold text-studio-500 font-mono',
                children: [
                  e.jsxs('span', {
                    className: 'flex items-center gap-2',
                    children: [
                      e.jsx(g, { className: 'w-4 h-4 text-blue-500' }),
                      e.jsx('span', { children: 'Jolpica Ergast API · CI/CD Sync' }),
                    ],
                  }),
                  e.jsxs('a', {
                    href: 'https://jolpi.ca',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    className: 'inline-flex items-center gap-1 text-f1red hover:underline',
                    children: ['jolpi.ca ', e.jsx(i, { className: 'w-3 h-3' })],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      e.jsxs('section', {
        className: 'bg-white border border-studio-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-12',
        children: [
          e.jsxs('div', {
            className: 'flex items-center gap-3 mb-4',
            children: [
              e.jsx('div', {
                className:
                  'w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center',
                children: e.jsx(b, { className: 'w-5 h-5' }),
              }),
              e.jsxs('div', {
                children: [
                  e.jsx('h3', {
                    className: 'font-display text-xl font-bold uppercase text-studio-900',
                    children: t
                      ? 'Bộ sưu tập Nghệ thuật Chuyển thể'
                      : 'Bespoke Transformative Art Archive',
                  }),
                  e.jsx('p', {
                    className: 'text-xs text-studio-500 font-mono',
                    children: t
                      ? 'Tránh vi phạm bản quyền phóng viên báo chí'
                      : 'Replacing unverified press imagery with original fan art',
                  }),
                ],
              }),
            ],
          }),
          e.jsx('p', {
            className: 'text-sm text-studio-600 leading-relaxed mb-4',
            children: t
              ? 'Nhằm giải quyết dứt điểm các rủi ro liên quan đến bản quyền ảnh chụp từ bên thứ ba (Pinterest/báo chí), PODIUM — Effet de Sol đã và đang thay thế toàn bộ hình ảnh tay đua bằng các tác phẩm tranh poster nghệ thuật chuyển thể (Bespoke Transformative Fan Tribute Art). Mỗi poster là một tác phẩm đồ họa thể thao độc bản, kết hợp ánh sáng studio kịch tính, số hiệu và nhận diện phong cách của từng tay đua.'
              : 'To respect intellectual property and eliminate reliance on unverified editorial wire photos, PODIUM — Effet de Sol features custom transformative fan tribute art posters for each driver. Each artwork combines high-impact typography, studio rim lighting, dynamic racing helmets, and motion-blurred cars to celebrate the sporting legends of the paddock.',
          }),
          e.jsxs('div', {
            className: 'flex flex-wrap gap-2 text-xs font-mono text-studio-500',
            children: [
              e.jsx('span', {
                className: 'px-2.5 py-1 rounded-md bg-studio-100 text-studio-700',
                children: '🎨 Transformative Fan Tribute',
              }),
              e.jsx('span', {
                className: 'px-2.5 py-1 rounded-md bg-studio-100 text-studio-700',
                children: '🏎️ 11 Teams / 22 Drivers',
              }),
              e.jsx('span', {
                className: 'px-2.5 py-1 rounded-md bg-studio-100 text-studio-700',
                children: '⚡ 8K High Impact Style',
              }),
            ],
          }),
        ],
      }),
      e.jsxs('section', {
        className:
          'bg-studio-950 text-white rounded-2xl p-6 sm:p-10 border border-studio-800 shadow-xl mb-10',
        children: [
          e.jsxs('div', {
            className: 'flex items-center gap-3 text-f1red mb-5',
            children: [
              e.jsx(f, { className: 'w-6 h-6' }),
              e.jsx('h2', {
                className:
                  'font-display text-lg sm:text-xl font-black uppercase tracking-wider text-white',
                children: t
                  ? 'Tuyên bố Bản quyền & Miễn trừ Trách nhiệm'
                  : 'Legal Disclaimer & Fair Use Notice',
              }),
            ],
          }),
          e.jsxs('div', {
            className: 'text-xs sm:text-sm text-studio-300 leading-relaxed space-y-4 font-mono',
            children: [
              e.jsx('p', {
                children: t
                  ? '1. TÍNH CHẤT PHI THƯƠNG MẠI: PODIUM — Effet de Sol là một dự án nghiên cứu công nghệ, giao lưu văn hóa và tôn vinh thể thao hoàn toàn phi thương mại (non-commercial, non-profit open fan tribute). Trang web không bán sản phẩm, không thu phí người dùng, không chạy quảng cáo thương mại và không tạo ra bất kỳ doanh thu nào.'
                  : '1. NON-COMMERCIAL STATUS: PODIUM — Effet de Sol is an independent, non-commercial, non-monetized educational showcase and technical fan tribute. The website does not sell products, charges no fees, hosts no advertisements, and generates zero commercial revenue.',
              }),
              e.jsx('p', {
                children: t
                  ? '2. BẢN QUYỀN VÀ NHÃN HIỆU: Formula 1, F1, FORMULA ONE, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX và các biểu trưng liên quan là tài sản trí tuệ độc quyền được đăng ký bảo hộ của Formula One Licensing B.V. và Liên đoàn Ô tô Quốc tế (FIA). Tên gọi các đội đua, tay đua và logo xuất hiện trong ứng dụng được sử dụng thuần túy nhằm mục đích đưa tin thể thao, tra cứu thông tin lịch sử và xác thực kỹ thuật theo nguyên tắc Fair Use.'
                  : '2. TRADEMARKS & RIGHTS: FORMULA 1, F1, FORMULA ONE, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of Formula One Licensing B.V. All team names, constructor trademarks, and driver identifiers are referenced strictly under fair use doctrine for informational, statistical, and historical appreciation.',
              }),
              e.jsx('p', {
                children: t
                  ? '3. TÁC GIẢ & LIÊN HỆ: Nền tảng được tạo ra bởi BaoBungBu. Nếu bạn là chủ sở hữu quyền tác giả của bất kỳ tư liệu nào và có yêu cầu điều chỉnh, xin vui lòng liên hệ trực tiếp với chúng tôi để được giải quyết nhanh chóng trên tinh thần hợp tác và tôn trọng bản quyền.'
                  : '3. AUTHORSHIP & CONTACT: Curated and maintained by BaoBungBu. If you are a rightsholder with questions or modification requests regarding any referenced material, please reach out directly for immediate assistance in full respect of copyright.',
              }),
              e.jsx('p', {
                children: t
                  ? '4. NGUỒN MÔ HÌNH 3D: Hình học xe C42 được chuyển thể từ model mã nguồn mở của Mark Stein (markste-in/c42), phát hành theo giấy phép WTFPL v2. Phiên bản trên website đã được nén Meshopt, loại bỏ texture gốc và phủ bộ nhận diện tạo bằng thủ tục.'
                  : '4. 3D MODEL SOURCE: The C42 car geometry is adapted from the open-source model by Mark Stein (markste-in/c42), released under the WTFPL v2 license. The website version is Meshopt-compressed, has its original textures removed, and uses procedurally generated liveries.',
              }),
            ],
          }),
        ],
      }),
      e.jsxs('div', {
        className: 'flex flex-wrap items-center justify-center gap-4 pt-4',
        children: [
          e.jsxs(s, {
            to: '/showroom',
            className:
              'inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-f1red text-white text-xs font-black uppercase tracking-wider hover:bg-red-700 transition-colors shadow-md',
            children: [
              e.jsx(j, { className: 'w-4 h-4' }),
              t ? 'Trải nghiệm 3D Showroom' : 'Explore 3D Showroom',
            ],
          }),
          e.jsxs(s, {
            to: '/season/2026',
            className:
              'inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-studio-200 text-studio-900 text-xs font-black uppercase tracking-wider hover:bg-studio-300 transition-colors',
            children: [
              e.jsx(v, { className: 'w-4 h-4' }),
              t ? 'Bảng xếp hạng Mùa giải 2026' : '2026 Championship Hub',
            ],
          }),
        ],
      }),
    ],
  });
};
export { D as AboutPage, D as default };
