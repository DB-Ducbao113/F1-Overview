import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useNavigationStore } from '../../store/useNavigationStore';

export const PrivacyPolicyPage: React.FC = () => {
  const vi = useNavigationStore((state) => state.lang) === 'vi';
  const sections = vi
    ? [
        [
          'Dữ liệu PODIUM xử lý',
          'Máy chủ lưu trữ có thể ghi nhận địa chỉ IP, thiết bị, thời gian truy cập và lỗi kỹ thuật trong nhật ký bảo mật. Ứng dụng lưu ngôn ngữ, dữ liệu mùa giải đã cache và lựa chọn quyền riêng tư trên trình duyệt của bạn.',
        ],
        [
          'Đo lường tùy chọn',
          'Vercel Analytics và Speed Insights chỉ được tải sau khi bạn đồng ý mục Đo lường hiệu năng. Bạn có thể rút lại lựa chọn bất cứ lúc nào qua nút Cài đặt quyền riêng tư ở chân trang.',
        ],
        [
          'Quảng cáo',
          'PODIUM chưa tích hợp mạng quảng cáo. Lựa chọn Quảng cáo trong CMP được chuẩn bị cho tương lai; bất kỳ nhà cung cấp nào được thêm sau này sẽ phải tuân theo lựa chọn của bạn và chính sách này sẽ được cập nhật trước khi kích hoạt.',
        ],
        [
          'Nguồn dữ liệu bên ngoài',
          'Trang có thể lấy dữ liệu thể thao từ các API công khai như Jolpica và OpenF1 thông qua hạ tầng của PODIUM. Không nhập thông tin nhạy cảm vào website.',
        ],
        [
          'Quyền và liên hệ',
          'Bạn có thể xóa dữ liệu lưu cục bộ bằng cài đặt trình duyệt hoặc thay đổi đồng ý trong CMP. Với yêu cầu về quyền riêng tư hoặc bản quyền, hãy liên hệ tác giả qua kênh được nêu tại trang About.',
        ],
      ]
    : [
        [
          'Data PODIUM processes',
          'The hosting platform may record IP address, device, access time, and technical errors in security logs. The app stores language, cached season data, and privacy choices in your browser.',
        ],
        [
          'Optional measurement',
          'Vercel Analytics and Speed Insights load only after you consent to Performance analytics. You can withdraw consent at any time through Privacy settings in the footer.',
        ],
        [
          'Advertising',
          'PODIUM does not currently integrate an advertising network. The CMP advertising choice is reserved for future use; any future provider must honor your choice and this policy will be updated before activation.',
        ],
        [
          'External data sources',
          'The site may retrieve sports data from public APIs such as Jolpica and OpenF1 through PODIUM infrastructure. Do not submit sensitive information to the website.',
        ],
        [
          'Your choices and contact',
          'You can clear locally stored data in your browser or change consent in the CMP. For privacy or copyright requests, contact the author through the channel listed on the About page.',
        ],
      ];

  return (
    <div className="min-h-[70vh] bg-studio-100 py-12 sm:py-16">
      <article className="page-container max-w-4xl">
        <div className="rounded-3xl border border-studio-200 bg-white p-6 shadow-subtle sm:p-10">
          <div className="flex items-center gap-3 text-f1red">
            <ShieldCheck className="h-6 w-6" />
            <span className="text-xs font-black uppercase tracking-[0.24em]">PODIUM / LEGAL</span>
          </div>
          <h1 className="mt-5 font-display text-4xl font-black uppercase text-studio-950 sm:text-5xl">
            {vi ? 'Chính sách quyền riêng tư' : 'Privacy Policy'}
          </h1>
          <p className="mt-3 text-sm text-studio-500">
            {vi ? 'Cập nhật lần cuối: 09/10/2026' : 'Last updated: October 9, 2026'}
          </p>
          <p className="mt-6 text-sm leading-7 text-studio-700">
            {vi
              ? 'PODIUM là một dự án độc lập về dữ liệu và trải nghiệm đua xe. Chính sách này giải thích dữ liệu nào được xử lý và cách bạn kiểm soát các công nghệ tùy chọn.'
              : 'PODIUM is an independent motorsport data and experience project. This policy explains what data is processed and how you control optional technologies.'}
          </p>
          <div className="mt-8 space-y-7">
            {sections.map(([title, body]) => (
              <section key={title}>
                <h2 className="font-display text-lg font-black uppercase text-studio-950">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-studio-600">{body}</p>
              </section>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap gap-4 border-t border-studio-200 pt-6 text-sm font-bold">
            <Link to="/cookies" className="text-f1red hover:underline">
              {vi ? 'Xem Chính sách Cookie' : 'View Cookie Policy'}
            </Link>
            <Link to="/about" className="text-studio-600 hover:text-f1red">
              {vi ? 'Về PODIUM' : 'About PODIUM'}
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};
