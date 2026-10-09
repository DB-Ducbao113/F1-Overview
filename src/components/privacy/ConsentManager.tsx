import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';
import { useConsentStore } from '../../store/useConsentStore';
import { useNavigationStore } from '../../store/useNavigationStore';

export const ConsentManager: React.FC = () => {
  const lang = useNavigationStore((state) => state.lang);
  const {
    hasDecided,
    analytics,
    advertising,
    settingsOpen,
    acceptAll,
    rejectOptional,
    savePreferences,
    closeSettings,
  } = useConsentStore();
  const [analyticsChoice, setAnalyticsChoice] = useState(analytics);
  const [advertisingChoice, setAdvertisingChoice] = useState(advertising);

  useEffect(() => {
    if (settingsOpen) {
      setAnalyticsChoice(analytics);
      setAdvertisingChoice(advertising);
    }
  }, [settingsOpen, analytics, advertising]);

  if (hasDecided && !settingsOpen) return null;

  const vi = lang === 'vi';

  if (settingsOpen) {
    return (
      <div
        className="fixed inset-0 z-[120] flex items-end justify-center bg-black/70 p-3 backdrop-blur-sm sm:items-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-title"
      >
        <section className="w-full max-w-xl rounded-2xl border border-white/15 bg-[#101116] p-5 text-white shadow-2xl sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-f1red">
                PODIUM PRIVACY
              </p>
              <h2 id="consent-title" className="mt-2 font-display text-2xl font-black uppercase">
                {vi ? 'Tùy chọn quyền riêng tư' : 'Privacy preferences'}
              </h2>
            </div>
            {hasDecided && (
              <button
                onClick={closeSettings}
                aria-label={vi ? 'Đóng' : 'Close'}
                className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <PreferenceRow
              title={vi ? 'Thiết yếu' : 'Essential'}
              description={
                vi
                  ? 'Lưu ngôn ngữ, lựa chọn riêng tư và dữ liệu cần để trang hoạt động.'
                  : 'Stores language, privacy choices, and data required for the site to work.'
              }
              checked
              disabled
              onChange={() => undefined}
            />
            <PreferenceRow
              title={vi ? 'Đo lường hiệu năng' : 'Performance analytics'}
              description={
                vi
                  ? 'Cho phép Vercel Analytics và Speed Insights đo lượt xem và hiệu năng.'
                  : 'Allows Vercel Analytics and Speed Insights to measure visits and performance.'
              }
              checked={analyticsChoice}
              onChange={setAnalyticsChoice}
            />
            <PreferenceRow
              title={vi ? 'Quảng cáo' : 'Advertising'}
              description={
                vi
                  ? 'Dành cho quảng cáo trong tương lai. Hiện website chưa tải mạng quảng cáo nào.'
                  : 'Reserved for future ads. No advertising network is currently loaded.'
              }
              checked={advertisingChoice}
              onChange={setAdvertisingChoice}
            />
          </div>

          <p className="mt-5 text-xs leading-5 text-white/50">
            {vi
              ? 'Bạn có thể đổi lựa chọn bất cứ lúc nào ở chân trang.'
              : 'You can change these choices at any time from the footer.'}{' '}
            <Link to="/cookies" className="text-white underline underline-offset-4">
              {vi ? 'Chính sách Cookie' : 'Cookie Policy'}
            </Link>
          </p>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              onClick={rejectOptional}
              className="rounded-xl border border-white/15 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white/80 hover:bg-white/10"
            >
              {vi ? 'Từ chối tùy chọn' : 'Reject optional'}
            </button>
            <button
              onClick={() =>
                savePreferences({ analytics: analyticsChoice, advertising: advertisingChoice })
              }
              className="rounded-xl bg-white px-4 py-2.5 text-xs font-black uppercase tracking-wider text-black hover:bg-studio-200"
            >
              {vi ? 'Lưu lựa chọn' : 'Save choices'}
            </button>
            <button
              onClick={acceptAll}
              className="rounded-xl bg-f1red px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-red-700"
            >
              {vi ? 'Đồng ý tất cả' : 'Accept all'}
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <aside
      className="fixed inset-x-3 bottom-3 z-[110] mx-auto max-w-4xl rounded-2xl border border-white/15 bg-[#101116]/95 p-4 text-white shadow-2xl backdrop-blur-xl sm:p-5"
      aria-label={vi ? 'Thông báo quyền riêng tư' : 'Privacy notice'}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <div>
            <h2 className="text-sm font-black uppercase tracking-wide">
              {vi ? 'Quyền riêng tư của bạn' : 'Your privacy'}
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-white/60">
              {vi
                ? 'PODIUM chỉ bật đo lường hiệu năng hoặc quảng cáo khi bạn cho phép. Thành phần thiết yếu luôn hoạt động.'
                : 'PODIUM enables performance measurement or advertising only with your permission. Essential functions always remain active.'}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            onClick={rejectOptional}
            className="rounded-lg border border-white/15 px-3 py-2 text-[10px] font-black uppercase tracking-wider hover:bg-white/10"
          >
            {vi ? 'Từ chối' : 'Reject'}
          </button>
          <button
            onClick={() => useConsentStore.getState().openSettings()}
            className="rounded-lg border border-white/15 px-3 py-2 text-[10px] font-black uppercase tracking-wider hover:bg-white/10"
          >
            {vi ? 'Tùy chỉnh' : 'Customize'}
          </button>
          <button
            onClick={acceptAll}
            className="rounded-lg bg-f1red px-3 py-2 text-[10px] font-black uppercase tracking-wider hover:bg-red-700"
          >
            {vi ? 'Đồng ý tất cả' : 'Accept all'}
          </button>
        </div>
      </div>
    </aside>
  );
};

const PreferenceRow: React.FC<{
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}> = ({ title, description, checked, disabled = false, onChange }) => (
  <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
    <span>
      <span className="block text-sm font-bold">{title}</span>
      <span className="mt-1 block text-xs leading-5 text-white/50">{description}</span>
    </span>
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(event) => onChange(event.target.checked)}
      className="h-5 w-5 shrink-0 accent-red-600"
    />
  </label>
);
