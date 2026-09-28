import React, { useState } from 'react';
import { useChampionshipStore } from '../../store/useChampionshipStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { SeasonYear } from '../../types';
import { t } from '../../i18n/translations';
import { StandingsTable } from './StandingsTable';
import { RaceCalendar } from './RaceCalendar';
import { RaceResults } from './RaceResults';
import { RaceClassificationModal } from './RaceClassificationModal';
import {
  Trophy,
  Calendar,
  CheckCircle2,
  RefreshCw,
  PlayCircle,
  Database,
  Radio,
  Sparkles,
  Info,
} from 'lucide-react';

export const ChampionshipView: React.FC = () => {
  const { lang } = useNavigationStore();
  const {
    selectedSeason,
    setSelectedSeason,
    activeSubTab,
    setActiveSubTab,
    detailedResults,
    selectedRaceForModal,
    closeRaceModal,
    syncMeta,
    syncSeasonData,
    simulateNewRace,
  } = useChampionshipStore();

  const strings = t[lang].championship;
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const SEASONS: SeasonYear[] = [2026, 2025, 2024];
  const completedRaces = detailedResults[selectedSeason]?.length || 0;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleManualSync = async () => {
    await syncSeasonData(selectedSeason);
    showToast(
      lang === 'vi'
        ? `Đã đồng bộ dữ liệu F1 mùa giải ${selectedSeason} thành công!`
        : `Successfully synced F1 ${selectedSeason} data!`
    );
  };

  const handleSimulateRace = () => {
    setIsSimulating(true);
    setTimeout(() => {
      simulateNewRace(selectedSeason);
      setIsSimulating(false);
      showToast(
        lang === 'vi'
          ? `Đã phát hiện kết quả Grand Prix mới! Bảng điểm BXH đã tự động tính lại.`
          : `New Grand Prix result detected! Standings automatically recalculated.`
      );
    }, 400);
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

        {/* ── F1 AUTOMATED DATA PIPELINE STATUS BAR ── */}
        <div className="p-4 sm:p-5 rounded-2xl bg-studio-950 text-white shadow-md border border-studio-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-black uppercase tracking-wider border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Automated Data Pipeline</span>
              </span>

              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-studio-400 bg-studio-900 px-2.5 py-0.5 rounded-full border border-studio-800">
                <Database className="w-3 h-3 text-sky-400" />
                <span>Engine: Ergast / Jolpica + Client Recalculation</span>
              </span>

              <span className="text-[11px] text-studio-400">
                Chặng đã hoàn thành: <strong className="text-white">{completedRaces}</strong>
              </span>
            </div>

            <p className="text-xs text-studio-300 max-w-2xl leading-relaxed">
              {lang === 'vi'
                ? 'Hệ thống tự động phát hiện kết quả Grand Prix mới từ Formula 1®, lưu raw classification 20 tay đua và tự động tính lại BXH Driver & Constructor thay vì sửa JSON thủ công.'
                : 'Automated data pipeline detects new Grand Prix classifications from Formula 1®, stores raw 20-car entries, and dynamically recalculates Driver & Constructor Standings.'}
            </p>
            <div className="text-[10px] text-studio-500 font-mono">
              Status: <span className="text-emerald-400 uppercase font-bold">{syncMeta.syncStatus}</span> · {syncMeta.message}
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={handleManualSync}
              disabled={syncMeta.syncStatus === 'syncing'}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-studio-900 hover:bg-studio-800 text-white text-xs font-bold uppercase tracking-wider border border-studio-700 transition-all disabled:opacity-50"
              title="Đồng bộ kết quả từ API Formula 1"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${syncMeta.syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              <span>{syncMeta.syncStatus === 'syncing' ? 'Syncing...' : 'Sync F1 Data'}</span>
            </button>

            <button
              onClick={handleSimulateRace}
              disabled={isSimulating}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-f1red to-red-700 hover:from-red-600 hover:to-red-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50"
              title="Mô phỏng chặng đua mới kết thúc để kiểm tra việc tự động tính điểm BXH"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'vi' ? 'Mô Phỏng Chặng Mới' : 'Simulate New GP'}</span>
            </button>
          </div>
        </div>

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
            {SEASONS.map((season) => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedSeason === season
                    ? 'bg-white text-f1red shadow-xs font-black'
                    : 'text-studio-600 hover:text-studio-950'
                }`}
              >
                <span>{season}</span>
                {season === 2026 ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Ongoing season" />
                ) : (
                  <span className="text-[10px] text-studio-400 font-normal">Final</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Render based on Subtab */}
        {activeSubTab === 'standings' && <StandingsTable season={selectedSeason} />}
        {activeSubTab === 'calendar' && <RaceCalendar />}
        {activeSubTab === 'results' && <RaceResults />}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-studio-950 text-white px-5 py-3 rounded-xl shadow-2xl border border-studio-700 flex items-center gap-3 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Official 20-Car Classification Modal */}
      {selectedRaceForModal && (
        <RaceClassificationModal race={selectedRaceForModal} onClose={closeRaceModal} />
      )}
    </div>
  );
};

