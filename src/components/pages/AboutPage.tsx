import React from 'react';
import { Link } from 'react-router-dom';
import { Box, ShieldAlert, Cpu, Database, Sparkles, ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigationStore } from '../../store/useNavigationStore';

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
        <span className="inline-block text-xs font-black uppercase tracking-widest text-f1red bg-f1red/10 px-3 py-1 rounded-full mb-3">
          {isVi ? 'Thông tin Dự án & Kiến trúc' : 'Project Architecture & Legal'}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-studio-950">
          F1 Ground Effect Hub
        </h1>
        <p className="mt-4 text-base sm:text-lg text-studio-600 max-w-3xl leading-relaxed">
          {isVi
            ? 'Nền tảng trưng bày kỹ thuật số 3D tương tác và trung tâm dữ liệu thời gian thực cho kỷ nguyên xe đua hiệu ứng mặt đất Formula 1 (2022–2026).'
            : 'Interactive 3D technical showcase and real-time championship data hub dedicated to the Formula 1 Ground Effect era (2022–2026).'}
        </p>
      </header>

      {/* Main Grid Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Section 1: 3D Technical Architecture */}
        <section className="bg-white border border-studio-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-f1red/10 text-f1red flex items-center justify-center mb-5">
              <Box className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl font-bold uppercase text-studio-900 mb-3">
              {isVi ? 'Kiến trúc 3D & Lựa chọn Thiết kế' : '3D Architecture & Technical Trade-offs'}
            </h2>
            <div className="text-sm text-studio-600 leading-relaxed space-y-3">
              <p>
                {isVi
                  ? 'Để tối ưu hóa thời gian tải và đảm bảo tốc độ khung hình 60 FPS mượt mà trên mọi thiết bị di động, showroom sử dụng một mô hình hình học thống nhất (chassis mesh Alfa Romeo C42) đại diện cho quy chuẩn khí động học Ground Effect.'
                  : 'To ensure ultra-fast load times and steady 60 FPS performance on all mobile browsers, the showroom utilizes a single unified Ground Effect chassis geometry (Alfa Romeo C42 base mesh).'}
              </p>
              <p>
                {isVi
                  ? 'Màu sắc và nhận diện của 11 đội đua được tổng hợp động thông qua hệ thống Canvas Procedural Livery Texture Generator & Custom Shader Materials. Giải pháp này giúp trang web chỉ cần tải 1 file 3D duy nhất (~18 MB) thay vì 11 mô hình độc lập (>200 MB).'
                  : 'Livery liveries for all 11 teams are dynamically generated using an in-memory Procedural Canvas Texture Generator and custom PBR shaders, avoiding more than 200 MB of duplicate geometric data downloads.'}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-studio-100 flex items-center gap-2 text-xs font-semibold text-studio-500">
            <Cpu className="w-4 h-4 text-f1red" />
            <span>WebGL / Three.js / React Three Fiber / PBR Shaders</span>
          </div>
        </section>

        {/* Section 2: Data Architecture */}
        <section className="bg-white border border-studio-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-5">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl font-bold uppercase text-studio-900 mb-3">
              {isVi ? 'Nguồn Dữ liệu & Tự động Đồng bộ' : 'Data Pipeline & Automated Sync'}
            </h2>
            <div className="text-sm text-studio-600 leading-relaxed space-y-3">
              <p>
                {isVi
                  ? 'Dữ liệu kết quả chặng đua, bảng xếp hạng tay đua và đội đua được thu thập từ Jolpica F1 Ergast API — một cơ sở dữ liệu mở chất lượng cao phục vụ cộng đồng người hâm mộ Formula 1.'
                  : 'Race classifications, driver standings, and constructor points are retrieved from the open community Jolpica F1 Ergast API.'}
              </p>
              <p>
                {isVi
                  ? 'Hệ thống áp dụng kiến trúc tĩnh ưu tiên (Static-First Baseline) tích hợp tự động qua GitHub Actions CI/CD và kết hợp bộ nhớ đệm thông minh phía client để luôn đảm bảo tính cập nhật mà không làm chậm trải nghiệm duyệt web.'
                  : 'The architecture employs an authoritative static baseline synced via GitHub Actions CI/CD with non-intrusive client reconciliation for live updates.'}
              </p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-studio-100 flex items-center justify-between text-xs font-semibold text-studio-500">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Jolpica Ergast API / Open F1 Data</span>
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

      {/* Section 3: Legal Disclaimer & Fair Use Notice */}
      <section className="bg-studio-950 text-white rounded-2xl p-6 sm:p-10 border border-studio-800 shadow-xl mb-10">
        <div className="flex items-center gap-3 text-f1red mb-4">
          <ShieldAlert className="w-6 h-6" />
          <h2 className="font-display text-lg sm:text-xl font-black uppercase tracking-wider text-white">
            {isVi
              ? 'Tuyên bố Miễn trừ Trách nhiệm & Quyền Sở hữu Trí tuệ'
              : 'Legal Disclaimer & Trademark Notices'}
          </h2>
        </div>
        <div className="text-xs sm:text-sm text-studio-300 leading-relaxed space-y-3 font-mono">
          <p>
            {isVi
              ? 'F1 Ground Effect Hub là một dự án nghiên cứu công nghệ, giáo dục và tôn vinh thể thao phi thương mại (non-commercial, non-profit fan tribute showcase). Trang web không bán hàng, không thu phí dịch vụ và không liên kết trực tiếp với Formula One Group.'
              : 'F1 Ground Effect Hub is an independent, non-commercial educational showcase and technical fan tribute. It is not affiliated with, sponsored by, or endorsed by Formula One Licensing B.V. or the FIA.'}
          </p>
          <p>
            {isVi
              ? 'Formula 1, F1, FORMULA ONE, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX và các nhãn hiệu liên quan là tài sản trí tuệ độc quyền của Formula One Licensing B.V. và Liên đoàn Ô tô Quốc tế (FIA). Tên các đội đua, tay đua và logo xuất hiện trong ứng dụng được đề cập nhằm mục đích đưa tin, phân tích dữ liệu thể thao và xác thực nhận diện theo nguyên tắc Fair Use.'
              : 'FORMULA 1, F1, FORMULA ONE, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks of Formula One Licensing B.V. All team names, driver names, and brand identifiers are used strictly under fair use principles for informational, editorial, and historical identification purposes.'}
          </p>
          <p>
            {isVi
              ? 'Toàn bộ hình ảnh chân dung tay đua trong bộ sưu tập là các tác phẩm nghệ thuật chuyển thể (Bespoke Transformative Fan Tribute Art) được sáng tác nhằm tôn vinh phong cách thể thao hiện đại.'
              : 'All driver portraits within the directory are bespoke transformative fan tribute artwork created to celebrate the aesthetic and heroes of contemporary motorsport.'}
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link
          to="/showroom"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-f1red text-white text-xs font-black uppercase tracking-wider hover:bg-red-700 transition-colors shadow-md"
        >
          {isVi ? 'Khám phá 3D Showroom →' : 'Explore 3D Showroom →'}
        </Link>
      </div>
    </div>
  );
};
export default AboutPage;
