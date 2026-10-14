import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  ShieldAlert,
  Cpu,
  Database,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  User,
  Heart,
  Layers,
  Palette,
  Compass,
  Facebook,
  MessageSquare,
} from 'lucide-react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { author } from '../../data/author';
import { DonationQr } from '../common/DonationQr';

export const AboutPage: React.FC = () => {
  const lang = useNavigationStore((state) => state.lang);
  const isVi = lang === 'vi';

  return (
    <div className="page-container py-12 md:py-16 max-w-5xl">
      {/* Top Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-studio-500 hover:text-f1red transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {isVi ? 'Quay lại Trang chủ' : 'Back to Home'}
        </Link>
      </div>

      {/* Hero Header */}
      <header className="border-b border-studio-200 pb-8 mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-block text-xs font-black uppercase tracking-widest text-f1red bg-f1red/10 px-3 py-1 rounded-full">
            {isVi ? 'Giới thiệu Dự án & Kiến trúc' : 'Project Architecture & Creator'}
          </span>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-studio-600 bg-studio-200/70 px-3 py-1 rounded-full">
            {isVi ? 'Phi Thương Mại · Non-Commercial' : 'Open Fan Tribute'}
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-studio-950">
          PODIUM — Effet de Sol
        </h1>
        <p className="mt-4 text-base sm:text-lg text-studio-600 max-w-3xl leading-relaxed">
          {isVi
            ? 'Không gian trải nghiệm 3D tương tác và trung tâm lưu trữ dữ liệu chuyên sâu dành riêng cho kỷ nguyên khí động học hiệu ứng mặt đất Formula 1 (2022–2026).'
            : 'Interactive 3D technical showcase and championship data archive dedicated to the Formula 1 Ground Effect era (2022–2026).'}
        </p>
      </header>

      {/* Creator Profile Section */}
      <section className="bg-gradient-to-br from-studio-900 to-studio-950 text-white rounded-2xl p-6 sm:p-8 mb-10 shadow-lg border border-studio-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-f1red to-yellow-500 flex items-center justify-center text-white shadow-md shrink-0">
            <User className="w-9 h-9" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide">BaoBungBu</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-studio-300 font-mono">
                {isVi ? 'Tác giả & Nhà phát triển' : 'Creator & Lead Developer'}
              </span>
            </div>
            <p className="mt-3 text-sm text-studio-300 leading-relaxed max-w-3xl">
              {isVi
                ? 'Dự án được khởi xướng và phát triển độc lập bởi BaoBungBu xuất phát từ niềm đam mê sâu sắc với tốc độ, kỹ thuật chế tạo xe đua Formula 1 và đồ họa không gian ba chiều WebGL. Toàn bộ nền tảng được xây dựng với mục tiêu mang đến một góc nhìn trực quan, hiện đại và hoàn toàn miễn phí cho cộng đồng người hâm mộ thể thao tốc độ.'
                : 'PODIUM — Effet de Sol was conceived and engineered independently by BaoBungBu, driven by a profound enthusiasm for modern Formula 1 engineering, aerodynamics, and real-time WebGL experiences. The hub is built as a 100% free, community-first tribute for motorsport enthusiasts.'}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-studio-400 font-mono">
              <span className="flex items-center gap-1.5 text-f1red">
                <Heart className="w-3.5 h-3.5 fill-current" />
                {isVi ? 'Xây dựng vì đam mê thể thao' : 'Built for the racing community'}
              </span>
              <span>•</span>
              <span>{isVi ? 'Độc lập & Phi lợi nhuận' : 'Independent & Non-profit'}</span>
              <span>•</span>
              <span>2024–2026</span>
            </div>
            <a
              href={author.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/20 px-4 py-3 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:outline-f1red"
            >
              <Facebook className="h-4 w-4" aria-hidden="true" />
              {isVi ? 'Liên hệ tác giả qua Facebook' : 'Contact the creator on Facebook'}
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="feedback-heading"
        className="mb-10 rounded-2xl border border-studio-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-f1red/10 text-f1red">
          <MessageSquare className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2
          id="feedback-heading"
          className="font-display text-2xl font-bold uppercase tracking-tight text-studio-950"
        >
          {isVi ? 'Góp ý cho PODIUM' : 'Help improve PODIUM'}
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-studio-600">
          {isVi
            ? 'Bạn gặp lỗi, có ý tưởng tính năng mới hoặc muốn góp ý về trải nghiệm? Chia sẻ phản hồi để giúp PODIUM tốt hơn. Biểu mẫu hỗ trợ tiếng Việt và tiếng Anh.'
            : 'Found a bug, have a feature idea, or want to share your experience? Send your feedback to help make PODIUM better. The form supports Vietnamese and English.'}
        </p>
        <a
          href={author.feedbackFormUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-f1red px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-f1red-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-f1red"
        >
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          {isVi ? 'Gửi góp ý' : 'Send feedback'}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
        <p className="mt-3 text-xs leading-5 text-studio-500">
          {isVi ? 'Mở Google Forms trong tab mới.' : 'Opens Google Forms in a new tab.'}
        </p>
      </section>

      <section
        aria-labelledby="donate-heading"
        className="mb-10 grid grid-cols-1 gap-8 rounded-2xl border border-studio-200 bg-white p-6 shadow-sm sm:p-8 md:grid-cols-[1fr_18rem] md:items-start"
      >
        <div>
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-f1red/10 text-f1red">
            <Heart className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2
            id="donate-heading"
            className="font-display text-2xl font-bold uppercase tracking-tight text-studio-950"
          >
            {isVi ? 'Ủng hộ tác giả' : 'Support the creator'}
          </h2>
          <p className="mt-4 text-sm leading-7 text-studio-600">
            {isVi
              ? 'Ủng hộ tác giả để tiếp tục phát triển web. Nếu bạn yêu thích PODIUM, bạn có thể donate để ủng hộ thời gian và công sức phát triển dự án. Mọi đóng góp đều tự nguyện; bạn vẫn có thể sử dụng toàn bộ website miễn phí.'
              : 'Support the creator to keep developing the website. If you enjoy PODIUM, you can donate to support the time and effort behind the project. Contributions are voluntary, and the entire website remains free to use.'}
          </p>
          <p className="mt-3 text-sm leading-7 text-studio-600">
            {isVi
              ? 'Quét mã bằng ứng dụng ngân hàng, hoặc tải ảnh QR để sử dụng trên điện thoại. Cảm ơn bạn đã đồng hành!'
              : 'Scan with your banking app, or download the QR image to use on your phone. Thank you for your support!'}
          </p>
          <dl className="mt-6 space-y-4 rounded-xl border border-studio-200 bg-studio-50 p-5 text-sm">
            <div>
              <dt className="text-xs text-studio-500">{isVi ? 'Ngân hàng' : 'Bank'}</dt>
              <dd className="mt-1 font-semibold text-studio-900">{author.donation.bank}</dd>
            </div>
            <div>
              <dt className="text-xs text-studio-500">
                {isVi ? 'Chủ tài khoản' : 'Account holder'}
              </dt>
              <dd className="mt-1 font-semibold text-studio-900">{author.donation.recipient}</dd>
            </div>
            <div>
              <dt className="text-xs text-studio-500">
                {isVi ? 'Số tài khoản' : 'Account number'}
              </dt>
              <dd className="mt-1 select-all font-mono font-semibold text-studio-900">
                {author.donation.account}
              </dd>
            </div>
          </dl>
        </div>
        <div className="flex justify-center text-studio-700">
          <DonationQr />
        </div>
      </section>

      {/* Grid: Architecture & Technical Decisions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Card 1: 3D Geometry & Procedural Livery */}
        <section className="bg-white border border-studio-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-f1red/10 text-f1red flex items-center justify-center mb-5">
              <Box className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-studio-900 mb-3">
              {isVi
                ? 'Kiến trúc 3D & Tối ưu Hiệu năng'
                : '3D Architecture & Performance Engineering'}
            </h3>
            <div className="text-sm text-studio-600 leading-relaxed space-y-3">
              <p>
                {isVi
                  ? 'Để đảm bảo trải nghiệm tức thì trên cả trình duyệt máy tính lẫn điện thoại, showroom áp dụng giải pháp tối ưu: sử dụng một khung gầm 3D chuẩn mực (Alfa Romeo C42 base mesh) làm hình học đại diện cho toàn bộ quy định khí động học Venturi.'
                  : 'To achieve instantaneous page loads and sustained 60 FPS performance across mobile and desktop devices, the showroom adopts an optimized architectural decision: a single unified Ground Effect chassis geometry (Alfa Romeo C42 base mesh) acts as the representative canvas.'}
              </p>
              <p>
                {isVi
                  ? 'Nhận diện và màu sắc của 11 đội đua được chiếu động bằng Canvas Procedural Texture Generator và hệ thống Shaders PBR. Nhờ đó, người dùng chỉ cần tải một file hình học 3D tối ưu (~2,4 MB) thay vì 11 file độc lập cồng kềnh (>200 MB).'
                  : 'Liveries and textures for all 11 teams are procedurally synthesized via an in-memory canvas engine and custom PBR shaders, cutting network transfer from >200 MB down to a single compact asset.'}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-studio-100 flex items-center gap-2 text-xs font-semibold text-studio-500 font-mono">
            <Cpu className="w-4 h-4 text-f1red" />
            <span>WebGL · Three.js · React Three Fiber · PBR Materials</span>
          </div>
        </section>

        {/* Card 2: Live Data & Engine */}
        <section className="bg-white border border-studio-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-5">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-studio-900 mb-3">
              {isVi ? 'Cơ sở Dữ liệu & Tự động Hóa' : 'Automated Data Pipeline & Telemetry'}
            </h3>
            <div className="text-sm text-studio-600 leading-relaxed space-y-3">
              <p>
                {isVi
                  ? 'Lịch thi đấu, kết quả từng vòng phân hạng và bảng xếp hạng giải đua được đồng bộ hóa từ Jolpica Ergast F1 API — cơ sở dữ liệu mở uy tín phục vụ cộng đồng đua xe thế giới.'
                  : 'Season calendars, qualifying classifications, and championship points are automatically retrieved from the open community Jolpica Ergast F1 API.'}
              </p>
              <p>
                {isVi
                  ? 'Hệ thống vận hành theo nguyên lý Static-First: dữ liệu chính thức được kiểm định và tích hợp vào mã nguồn qua GitHub Actions CI/CD, kết hợp với cơ chế hòa giải dữ liệu trực tiếp khi có diễn biến chặng đua mới.'
                  : 'The engine uses an authoritative static baseline committed via CI/CD pipelines, harmonized with non-intrusive client-side synchronization for real-time race weekend updates.'}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-studio-100 flex items-center justify-between text-xs font-semibold text-studio-500 font-mono">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Jolpica Ergast API · CI/CD Sync</span>
            </span>
            <a
              href="https://jolpi.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-f1red hover:underline"
            >
              jolpi.ca <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </section>
      </div>

      {/* Card 3: Transformative Fan Tribute Art */}
      <section className="bg-white border border-studio-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold uppercase text-studio-900">
              {isVi ? 'Bộ sưu tập Nghệ thuật Chuyển thể' : 'Bespoke Transformative Art Archive'}
            </h3>
            <p className="text-xs text-studio-500 font-mono">
              {isVi
                ? 'Tránh vi phạm bản quyền phóng viên báo chí'
                : 'Replacing unverified press imagery with original fan art'}
            </p>
          </div>
        </div>
        <p className="text-sm text-studio-600 leading-relaxed mb-4">
          {isVi
            ? 'Nhằm giải quyết dứt điểm các rủi ro liên quan đến bản quyền ảnh chụp từ bên thứ ba (Pinterest/báo chí), PODIUM — Effet de Sol đã và đang thay thế toàn bộ hình ảnh tay đua bằng các tác phẩm tranh poster nghệ thuật chuyển thể (Bespoke Transformative Fan Tribute Art). Mỗi poster là một tác phẩm đồ họa thể thao độc bản, kết hợp ánh sáng studio kịch tính, số hiệu và nhận diện phong cách của từng tay đua.'
            : 'To respect intellectual property and eliminate reliance on unverified editorial wire photos, PODIUM — Effet de Sol features custom transformative fan tribute art posters for each driver. Each artwork combines high-impact typography, studio rim lighting, dynamic racing helmets, and motion-blurred cars to celebrate the sporting legends of the paddock.'}
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-mono text-studio-500">
          <span className="px-2.5 py-1 rounded-md bg-studio-100 text-studio-700">
            🎨 Transformative Fan Tribute
          </span>
          <span className="px-2.5 py-1 rounded-md bg-studio-100 text-studio-700">
            🏎️ 11 Teams / 22 Drivers
          </span>
          <span className="px-2.5 py-1 rounded-md bg-studio-100 text-studio-700">
            ⚡ 8K High Impact Style
          </span>
        </div>
      </section>

      {/* Legal Disclaimer & Fair Use */}
      <section className="bg-studio-950 text-white rounded-2xl p-6 sm:p-10 border border-studio-800 shadow-xl mb-10">
        <div className="flex items-center gap-3 text-f1red mb-5">
          <ShieldAlert className="w-6 h-6" />
          <h2 className="font-display text-lg sm:text-xl font-black uppercase tracking-wider text-white">
            {isVi
              ? 'Tuyên bố Bản quyền & Miễn trừ Trách nhiệm'
              : 'Legal Disclaimer & Fair Use Notice'}
          </h2>
        </div>
        <div className="text-xs sm:text-sm text-studio-300 leading-relaxed space-y-4 font-mono">
          <p>
            {isVi
              ? '1. TÍNH CHẤT PHI THƯƠNG MẠI: PODIUM — Effet de Sol là một dự án nghiên cứu công nghệ, giao lưu văn hóa và tôn vinh thể thao hoàn toàn phi thương mại (non-commercial, non-profit open fan tribute). Trang web không bán sản phẩm, không thu phí người dùng, không chạy quảng cáo thương mại và không tạo ra bất kỳ doanh thu nào.'
              : '1. NON-COMMERCIAL STATUS: PODIUM — Effet de Sol is an independent, non-commercial, non-monetized educational showcase and technical fan tribute. The website does not sell products, charges no fees, hosts no advertisements, and generates zero commercial revenue.'}
          </p>
          <p>
            {isVi
              ? '2. BẢN QUYỀN VÀ NHÃN HIỆU: Formula 1, F1, FORMULA ONE, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX và các biểu trưng liên quan là tài sản trí tuệ độc quyền được đăng ký bảo hộ của Formula One Licensing B.V. và Liên đoàn Ô tô Quốc tế (FIA). Tên gọi các đội đua, tay đua và logo xuất hiện trong ứng dụng được sử dụng thuần túy nhằm mục đích đưa tin thể thao, tra cứu thông tin lịch sử và xác thực kỹ thuật theo nguyên tắc Fair Use.'
              : '2. TRADEMARKS & RIGHTS: FORMULA 1, F1, FORMULA ONE, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of Formula One Licensing B.V. All team names, constructor trademarks, and driver identifiers are referenced strictly under fair use doctrine for informational, statistical, and historical appreciation.'}
          </p>
          <p>
            {isVi
              ? '3. TÁC GIẢ & LIÊN HỆ: Nền tảng được tạo ra bởi BaoBungBu. Nếu bạn là chủ sở hữu quyền tác giả của bất kỳ tư liệu nào và có yêu cầu điều chỉnh, xin vui lòng liên hệ trực tiếp với chúng tôi để được giải quyết nhanh chóng trên tinh thần hợp tác và tôn trọng bản quyền.'
              : '3. AUTHORSHIP & CONTACT: Curated and maintained by BaoBungBu. If you are a rightsholder with questions or modification requests regarding any referenced material, please reach out directly for immediate assistance in full respect of copyright.'}
          </p>
          <p>
            {isVi
              ? '4. NGUỒN MÔ HÌNH 3D: Hình học xe C42 được chuyển thể từ model mã nguồn mở của Mark Stein (markste-in/c42), phát hành theo giấy phép WTFPL v2. Phiên bản trên website đã được nén Meshopt, loại bỏ texture gốc và phủ bộ nhận diện tạo bằng thủ tục.'
              : '4. 3D MODEL SOURCE: The C42 car geometry is adapted from the open-source model by Mark Stein (markste-in/c42), released under the WTFPL v2 license. The website version is Meshopt-compressed, has its original textures removed, and uses procedurally generated liveries.'}
          </p>
        </div>
      </section>

      {/* Bottom Navigation CTA */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link
          to="/showroom"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-f1red text-white text-xs font-black uppercase tracking-wider hover:bg-red-700 transition-colors shadow-md"
        >
          <Compass className="w-4 h-4" />
          {isVi ? 'Trải nghiệm 3D Showroom' : 'Explore 3D Showroom'}
        </Link>
        <Link
          to="/season/2026"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-studio-200 text-studio-900 text-xs font-black uppercase tracking-wider hover:bg-studio-300 transition-colors"
        >
          <Layers className="w-4 h-4" />
          {isVi ? 'Bảng xếp hạng Mùa giải 2026' : '2026 Championship Hub'}
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
