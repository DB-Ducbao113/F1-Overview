import React, { useEffect, useState } from 'react';
import { useChampionshipStore } from '../../store/useChampionshipStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { SeasonYear } from '../../types';
import { t } from '../../i18n/translations';
import { StandingsTable } from './StandingsTable';
import { RaceCalendar } from './RaceCalendar';
import { RaceResults } from './RaceResults';
import { TeamsDirectoryPage } from '../pages/TeamsDirectoryPage';
import { DriversDirectoryPage } from '../pages/DriversDirectoryPage';
import {
  Trophy,
  Calendar,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Users,
  UserRound,
} from 'lucide-react';

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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-studio-200 shadow-xs overflow-hidden">
          {/* Subtabs (Standings, Calendar, Results, Teams, Drivers) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 custom-scrollbar max-w-full -mx-1 px-1 sm:mx-0 sm:px-0">
            <button
              onClick={() => setActiveSubTab('standings')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
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
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
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
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'results'
                  ? 'bg-f1red text-white shadow-sm'
                  : 'bg-studio-100 text-studio-700 hover:bg-studio-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{strings.tabResults}</span>
            </button>
            <button
              onClick={() => setActiveSubTab('teams')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'teams'
                  ? 'bg-f1red text-white shadow-sm'
                  : 'bg-studio-100 text-studio-700 hover:bg-studio-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{strings.tabTeams}</span>
            </button>
            <button
              onClick={() => setActiveSubTab('drivers')}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                activeSubTab === 'drivers'
                  ? 'bg-f1red text-white shadow-sm'
                  : 'bg-studio-100 text-studio-700 hover:bg-studio-200'
              }`}
            >
              <UserRound className="w-3.5 h-3.5" />
              <span>{strings.tabDrivers}</span>
            </button>
          </div>

          {/* Season Switcher & Refresh */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-studio-100">
            <button
              onClick={handleManualSync}
              disabled={syncMeta.syncStatus === 'syncing' || !!pendingSyncReview}
              className="p-2 rounded-lg bg-studio-100 hover:bg-studio-200 text-studio-600 hover:text-studio-900 border border-studio-200 transition-all disabled:opacity-50 cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              title={lang === 'vi' ? 'Làm mới dữ liệu kết quả' : 'Refresh season data'}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${syncMeta.syncStatus === 'syncing' ? 'animate-spin text-f1red' : ''}`}
              />
            </button>

            <div className="flex items-center gap-1 bg-studio-100 p-1 rounded-lg border border-studio-200">
              {SEASONS.map((seasonOption) => (
                <button
                  key={seasonOption}
                  onClick={() => onSeasonChange(seasonOption)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    season === seasonOption
                      ? 'bg-white text-f1red shadow-xs font-black'
                      : 'text-studio-600 hover:text-studio-950'
                  }`}
                >
                  <span>{seasonOption}</span>
                  {seasonOption === 2026 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Render based on Subtab */}
        {activeSubTab === 'standings' && <StandingsTable season={season} />}
        {activeSubTab === 'calendar' && <RaceCalendar />}
        {activeSubTab === 'results' && <RaceResults season={season} />}
        {activeSubTab === 'teams' && <TeamsDirectoryPage initialSeason={season} hideHeader />}
        {activeSubTab === 'drivers' && <DriversDirectoryPage initialSeason={season} hideHeader />}
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
