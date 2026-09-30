import React, { useEffect, useState } from 'react';
import { useChampionshipStore } from '../../store/useChampionshipStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { SeasonYear } from '../../types';
import { t } from '../../i18n/translations';
import { StandingsTable } from './StandingsTable';
import { RaceCalendar } from './RaceCalendar';
import { RaceResults } from './RaceResults';
import { CALENDAR_2026 } from '../../data/championship';
import { Trophy, Calendar, CheckCircle2, RefreshCw, Database, AlertTriangle } from 'lucide-react';

interface ChampionshipViewProps {
  season: SeasonYear;
  onSeasonChange: (season: SeasonYear) => void;
}

export const ChampionshipView: React.FC<ChampionshipViewProps> = ({ season, onSeasonChange }) => {
  const { lang } = useNavigationStore();
  const {
    setSelectedSeason,
    activeSubTab,
    setActiveSubTab,
    detailedResults,
    syncMeta,
    syncSeasonData,
    pendingSyncReview,
    acceptSyncReview,
    dismissSyncReview,
  } = useChampionshipStore();

  const strings = t[lang].championship;
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const SEASONS: SeasonYear[] = [2026, 2025, 2024];
  useEffect(() => {
    setSelectedSeason(season);
  }, [season, setSelectedSeason]);

  const completedRaces =
    season === 2026
      ? new Set([
          ...CALENDAR_2026.filter((race) => race.status === 'completed').map((race) => race.round),
          ...(detailedResults[2026] || [])
            .filter((race) => race.status === 'completed')
            .map((race) => race.round),
        ]).size
      : detailedResults[season]?.length || 0;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleManualSync = async () => {
    await syncSeasonData(season);
    showToast(
      useChampionshipStore.getState().syncMeta.message ||
        (lang === 'vi' ? 'Đồng bộ hoàn tất.' : 'Sync complete.'),
    );
  };

  return (
    <div className="bg-studio-100 min-h-screen py-12 animate-fade-in relative">
      <div className="page-container space-y-8">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-f1red block">
            {strings.badge}
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-studio-950">
            {strings.title}
          </h1>
          <p className="text-sm sm:text-base text-studio-600 font-light leading-relaxed">
            {strings.desc}
          </p>
        </div>

        {/* F1 race data auto-refresh status */}
        <div className="p-4 sm:p-5 rounded-2xl bg-studio-950 text-white shadow-md border border-studio-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-black uppercase tracking-wider border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Auto-refreshing race data</span>
              </span>

              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-studio-400 bg-studio-900 px-2.5 py-0.5 rounded-full border border-studio-800">
                <Database className="w-3 h-3 text-sky-400" />
                <span>Source: Jolpica F1 API · refresh every 15 min</span>
              </span>

              <span className="text-[11px] text-studio-400">
                Chặng đã hoàn thành: <strong className="text-white">{completedRaces}</strong>
              </span>
            </div>

            <p className="text-xs text-studio-300 max-w-2xl leading-relaxed">
              {lang === 'vi'
                ? 'Khi website đang mở, dữ liệu tự được kiểm tra mỗi 15 phút. Bạn cũng có thể bấm Sync F1 Data để làm mới ngay; kết quả và bảng điểm sẽ được lưu trên trình duyệt này.'
                : 'While the website is open, race data is checked every 15 minutes. Use Sync F1 Data to refresh now; results and standings are saved in this browser.'}
            </p>
            <div className="text-[10px] text-studio-500 font-mono">
              Status:{' '}
              <span
                className={`${syncMeta.syncStatus === 'error' ? 'text-red-400' : syncMeta.syncStatus === 'review' ? 'text-amber-300' : syncMeta.syncStatus === 'success' ? 'text-emerald-400' : 'text-studio-300'} uppercase font-bold`}
              >
                {syncMeta.syncStatus}
              </span>{' '}
              · {syncMeta.message}
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={handleManualSync}
              disabled={syncMeta.syncStatus === 'syncing' || !!pendingSyncReview}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-studio-900 hover:bg-studio-800 text-white text-xs font-bold uppercase tracking-wider border border-studio-700 transition-all disabled:opacity-50"
              title="Làm mới kết quả từ Jolpica F1 API"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-sky-400 ${syncMeta.syncStatus === 'syncing' ? 'animate-spin' : ''}`}
              />
              <span>
                {syncMeta.syncStatus === 'syncing'
                  ? 'Syncing...'
                  : lang === 'vi'
                    ? 'Cập nhật ngay'
                    : 'Refresh now'}
              </span>
            </button>
          </div>
        </div>

        {pendingSyncReview && (
          <section
            aria-labelledby="sync-review-title"
            className="rounded-2xl border border-amber-300 bg-amber-50 p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <h2 id="sync-review-title" className="font-bold text-amber-950">
                    {lang === 'vi'
                      ? `Có kết quả ${pendingSyncReview.season} khác với bản lưu`
                      : `${pendingSyncReview.season} results differ from the saved snapshot`}
                  </h2>
                  <p className="mt-1 text-sm text-amber-900">
                    {lang === 'vi'
                      ? 'Bảng xếp hạng chưa được thay đổi. Hãy kiểm tra các chặng rồi chọn áp dụng dữ liệu mới hoặc giữ bản lưu.'
                      : 'Standings have not changed. Review the affected rounds, then apply the incoming results or keep the saved snapshot.'}
                  </p>
                </div>

                <ul className="space-y-3">
                  {pendingSyncReview.differences.map((difference) => (
                    <li
                      key={difference.round}
                      className="rounded-xl border border-amber-200 bg-white/80 p-3 text-xs"
                    >
                      <p className="font-bold text-studio-900">
                        R{difference.round} · {difference.grandPrix}
                      </p>
                      <p className="mt-1 text-studio-600">
                        <span className="font-semibold">
                          {lang === 'vi' ? 'Đang lưu:' : 'Saved:'}
                        </span>{' '}
                        {difference.previous}
                      </p>
                      <p className="mt-1 text-studio-800">
                        <span className="font-semibold">
                          {lang === 'vi' ? 'Nguồn mới:' : 'Incoming:'}
                        </span>{' '}
                        {difference.incoming}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={acceptSyncReview}
                    className="rounded-lg bg-amber-800 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-900"
                  >
                    {lang === 'vi'
                      ? 'Áp dụng kết quả mới và tính lại bảng điểm'
                      : 'Apply results and recalculate standings'}
                  </button>
                  <button
                    type="button"
                    onClick={dismissSyncReview}
                    className="rounded-lg border border-amber-300 bg-white px-4 py-2 text-xs font-bold text-amber-950 transition hover:bg-amber-100"
                  >
                    {lang === 'vi' ? 'Giữ bản lưu hiện tại' : 'Keep saved snapshot'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Top Control Bar: Season Selector & Subtabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-studio-200 shadow-xs">
          {/* Subtabs (Standings, Calendar, Results) */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveSubTab('standings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeSubTab === 'standings'
                  ? 'bg-f1red text-white shadow-sm'
                  : 'bg-studio-100 text-studio-700 hover:bg-studio-200'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{strings.tabStandings}</span>
            </button>
            <button
              onClick={() => setActiveSubTab('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeSubTab === 'calendar'
                  ? 'bg-f1red text-white shadow-sm'
                  : 'bg-studio-100 text-studio-700 hover:bg-studio-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{strings.tabCalendar}</span>
            </button>
            <button
              onClick={() => setActiveSubTab('results')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeSubTab === 'results'
                  ? 'bg-f1red text-white shadow-sm'
                  : 'bg-studio-100 text-studio-700 hover:bg-studio-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{strings.tabResults}</span>
            </button>
          </div>

          {/* Season Switcher */}
          <div className="flex items-center gap-1 bg-studio-100 p-1 rounded-lg border border-studio-200 self-start sm:self-auto">
            {SEASONS.map((seasonOption) => (
              <button
                key={seasonOption}
                onClick={() => onSeasonChange(seasonOption)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                  season === seasonOption
                    ? 'bg-white text-f1red shadow-xs font-black'
                    : 'text-studio-600 hover:text-studio-950'
                }`}
              >
                <span>{seasonOption}</span>
                {seasonOption === 2026 ? (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                    title="Ongoing season"
                  />
                ) : (
                  <span className="text-[10px] text-studio-400 font-normal">Final</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Render based on Subtab */}
        {activeSubTab === 'standings' && <StandingsTable season={season} />}
        {activeSubTab === 'calendar' && <RaceCalendar />}
        {activeSubTab === 'results' && <RaceResults season={season} />}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-studio-950 text-white px-5 py-3 rounded-xl shadow-2xl border border-studio-700 flex items-center gap-3 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
