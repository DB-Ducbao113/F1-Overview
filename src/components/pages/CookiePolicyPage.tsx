import React from 'react';
import { Cookie } from 'lucide-react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { useConsentStore } from '../../store/useConsentStore';

export const CookiePolicyPage: React.FC = () => {
  const vi = useNavigationStore((state) => state.lang) === 'vi';
  const openSettings = useConsentStore((state) => state.openSettings);

  return (
    <div className="min-h-[70vh] bg-studio-100 py-12 sm:py-16">
      <article className="page-container max-w-4xl">
        <div className="rounded-3xl border border-studio-200 bg-white p-6 shadow-subtle sm:p-10">
          <div className="flex items-center gap-3 text-f1red">
            <Cookie className="h-6 w-6" />
            <span className="text-xs font-black uppercase tracking-[0.24em]">PODIUM / CONSENT</span>
          </div>
          <h1 className="mt-5 font-display text-4xl font-black uppercase text-studio-950 sm:text-5xl">
            {vi ? 'Chính sách Cookie' : 'Cookie Policy'}
          </h1>
          <p className="mt-3 text-sm text-studio-500">
            {vi ? 'Cập nhật lần cuối: 09/10/2026' : 'Last updated: October 9, 2026'}
          </p>
          <p className="mt-6 text-sm leading-7 text-studio-700">
            {vi
              ? 'PODIUM chủ yếu dùng bộ nhớ cục bộ của trình duyệt thay cho cookie truyền thống. CMP áp dụng cùng nguyên tắc đồng ý trước cho mọi công nghệ lưu trữ hoặc đo lường không thiết yếu.'
              : 'PODIUM primarily uses browser local storage rather than traditional cookies. The CMP applies the same prior-consent rule to all non-essential storage and measurement technologies.'}
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-studio-200">
            {[
              [
                vi ? 'Thiết yếu' : 'Essential',
                'podium-navigation, podium-consent-v1',
                vi
                  ? 'Ghi nhớ ngôn ngữ và lựa chọn quyền riêng tư. Luôn bật.'
                  : 'Remembers language and privacy choices. Always on.',
              ],
              [
                vi ? 'Dữ liệu ứng dụng' : 'Application data',
                'championship cache / local storage',
                vi
                  ? 'Giảm số lần gọi API và giúp tải trang nhanh hơn. Không dùng để quảng cáo.'
                  : 'Reduces API requests and improves loading. Not used for advertising.',
              ],
              [
                vi ? 'Đo lường' : 'Analytics',
                'Vercel Analytics / Speed Insights',
                vi
                  ? 'Chỉ tải khi bạn đồng ý; dùng để hiểu lượt truy cập và hiệu năng.'
                  : 'Loads only with consent; used to understand visits and performance.',
              ],
              [
                vi ? 'Quảng cáo' : 'Advertising',
                vi ? 'Chưa hoạt động' : 'Not active',
                vi
                  ? 'Không có mạng quảng cáo nào được tải ở phiên bản hiện tại.'
                  : 'No advertising network is loaded in the current version.',
              ],
            ].map(([category, technology, purpose]) => (
              <section
                key={category}
                className="grid gap-2 border-b border-studio-200 p-5 last:border-0 sm:grid-cols-[140px_1fr]"
              >
                <h2 className="font-display text-sm font-black uppercase text-studio-950">
                  {category}
                </h2>
                <div>
                  <p className="font-mono text-xs text-f1red">{technology}</p>
                  <p className="mt-1 text-sm leading-6 text-studio-600">{purpose}</p>
                </div>
              </section>
            ))}
          </div>
          <button
            onClick={openSettings}
            className="mt-8 rounded-xl bg-studio-950 px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-f1red"
          >
            {vi ? 'Mở cài đặt quyền riêng tư' : 'Open privacy settings'}
          </button>
        </div>
      </article>
    </div>
  );
};
