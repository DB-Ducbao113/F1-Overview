import React, { useState } from 'react';
import { CALENDAR_2026 } from '../../data/championship';
import { PRACTICE_RESULTS_2026 } from '../../data/championship/practiceResults2026';
import { QUALIFYING_RESULTS_2026 } from '../../data/championship/qualifyingResults2026';
import {
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Timer,
  ChevronRight,
  Award,
  Trophy,
  Zap,
} from 'lucide-react';
import { useChampionshipStore } from '../../store/useChampionshipStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { PracticeClassificationModal } from './PracticeClassificationModal';
import { QualifyingClassificationModal } from './QualifyingClassificationModal';
import { formatDateStr, formatSessionName } from '../../utils/dateUtils';
import { SeasonYear } from '../../types';

export const RaceCalendar: React.FC = React.memo(() => {
  const { lang } = useNavigationStore();
  const isVi = lang === 'vi';
  const {
    detailedResults,
    setActiveSubTab,
    setSelectedSeason,
    setSelectedRaceRound,
  } = useChampionshipStore();
  const seasonResults = detailedResults[2026] || [];
  const completedRounds = new Set([
    ...CALENDAR_2026.filter((gp) => gp.status === 'completed').map((gp) => gp.round),
    ...seasonResults.filter((race) => race.status === 'completed').map((race) => race.round),
  ]);
  const nextRace = CALENDAR_2026.find((gp) => !completedRounds.has(gp.round));
  const [expandedRound, setExpandedRound] = useState<number | null>(nextRace?.round ?? 16);

  // State cho Practice Modal
  const [selectedPracticeRound, setSelectedPracticeRound] = useState<number | null>(null);
  const [selectedPracticeSessionKey, setSelectedPracticeSessionKey] = useState<
    'fp1' | 'fp2' | 'fp3'
  >('fp1');

  // State cho Qualifying Modal
  const [selectedQualifyingRound, setSelectedQualifyingRound] = useState<number | null>(null);
  const [selectedQualifyingSessionKey, setSelectedQualifyingSessionKey] = useState<
    'qualifying' | 'sprintQualifying' | 'sprint'
  >('qualifying');

  const toggleExpand = (round: number) => {
    setExpandedRound(expandedRound === round ? null : round);
  };

  const activePracticeData = selectedPracticeRound
    ? PRACTICE_RESULTS_2026[selectedPracticeRound]
    : null;

  const activeQualifyingData = selectedQualifyingRound
    ? QUALIFYING_RESULTS_2026[selectedQualifyingRound]
    : null;

  const handleGoToRaceResults = (_round?: number, seasonYear: SeasonYear = 2026) => {
    setSelectedSeason(seasonYear);
    setSelectedRaceRound(null);
    setActiveSubTab('results');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-studio-200">
        <div>
          <h3 className="font-display text-base font-bold uppercase tracking-wider text-studio-900">
            {isVi
              ? 'Lịch Thi Đấu Giải Vô Địch Formula 1 2026'
              : '2026 FIA Formula 1 World Championship Calendar'}
          </h3>
          <p className="text-xs text-studio-500 font-medium">
            {isVi
              ? `${completedRounds.size} / ${CALENDAR_2026.length} chặng đã đua · 6 Cuối Tuần Đua Sprint`
              : `${completedRounds.size} / ${CALENDAR_2026.length} rounds completed · 6 Sprint Weekends`}
          </p>
        </div>
        <span className="text-xs font-bold text-f1red">
          {nextRace
            ? isVi
              ? `Chặng kế tiếp: Vòng ${nextRace.round}`
              : `Next: Round ${nextRace.round}`
            : isVi
              ? 'Mùa giải hoàn tất'
              : 'Season complete'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {CALENDAR_2026.map((gp) => {
          const isExpanded = expandedRound === gp.round;
          const isCompleted = completedRounds.has(gp.round);
          const isCurrent = gp.status === 'current' && !isCompleted;
          const isNext = gp.round === nextRace?.round;
          const hasPracticeData = Boolean(PRACTICE_RESULTS_2026[gp.round]);
          const finishedPracticeKeys = (['fp1', 'fp2', 'fp3'] as const).filter((key) => {
            const session = gp.sessions[key] ?? PRACTICE_RESULTS_2026[gp.round]?.sessions[key];
            return session?.status === 'finished';
          });
          const hasFinishedPractice = finishedPracticeKeys.length > 0;
          const practiceBadgeLabel =
            finishedPracticeKeys.length > 0
              ? finishedPracticeKeys.map((key) => key.toUpperCase()).join(', ')
              : '';

          return (
            <div
              key={gp.round}
              className={`rounded-xl border transition-all ${
                isCurrent || (isNext && hasPracticeData)
                  ? 'bg-white border-f1red shadow-md ring-1 ring-f1red/20'
                  : 'bg-white border-studio-200 hover:border-studio-300 shadow-xs'
              }`}
            >
              {/* Collapsed Bar */}
              <div
                onClick={() => toggleExpand(gp.round)}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Round number badge */}
                  <div
                    className={`w-10 h-10 rounded-lg flex flex-col items-center justify-center shrink-0 font-bold ${
                      isCurrent || (isNext && hasPracticeData)
                        ? 'bg-f1red text-white'
                        : isCompleted
                          ? 'bg-studio-100 text-studio-600'
                          : 'bg-studio-900 text-white'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider">
                      {isVi ? 'VÒNG' : 'RND'}
                    </span>
                    <span className="text-sm font-black leading-none">{gp.round}</span>
                  </div>

                  {/* Flag & Name */}
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-base" title={gp.country}>
                        {gp.flag}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-studio-500">
                        {gp.country}
                      </span>
                      {gp.hasSprint && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800">
                          Sprint
                        </span>
                      )}
                      {!isCompleted && hasFinishedPractice && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 flex items-center gap-1 border border-sky-300">
                          <Timer className="w-3 h-3 text-sky-600 animate-pulse" />
                          {isVi
                            ? `Đã Chạy ${practiceBadgeLabel}`
                            : `${practiceBadgeLabel} Completed`}
                        </span>
                      )}
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-f1red/10 text-f1red animate-pulse">
                          {isVi ? 'Đang Diễn Ra' : 'Active Weekend'}
                        </span>
                      )}
                      {!isCurrent && isNext && !hasPracticeData && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800">
                          {isVi ? 'Chặng Tiếp Theo' : 'Up Next'}
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-studio-100 text-studio-500">
                          {isVi ? 'Đã Hoàn Tất' : 'Completed'}
                        </span>
                      )}
                    </div>
                    <h4 className="font-display text-base sm:text-lg font-bold text-studio-950">
                      {gp.name}
                    </h4>
                  </div>
                </div>

                {/* Circuit & Date */}
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <span className="font-bold text-xs text-studio-900 block">
                      {formatDateStr(gp.dates, lang)}
                    </span>
                    <span className="text-[11px] text-studio-500 truncate max-w-[200px] block">
                      {gp.circuit}
                    </span>
                  </div>

                  <button
                    className="p-1 rounded-full text-studio-400 hover:text-studio-900 transition-colors"
                    aria-label="Expand schedule"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Session Breakdown */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-studio-100 bg-studio-50/50 rounded-b-xl space-y-4 animate-fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-studio-600 pt-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-f1red" /> {gp.circuit}, {gp.location}
                    </span>
                    <span className="font-medium">
                      {isVi
                        ? `${gp.laps} Vòng · ${gp.circuitLengthKm} km · Đua chính: ${gp.raceDistanceKm} km`
                        : `${gp.laps} Laps · ${gp.circuitLengthKm} km · Race: ${gp.raceDistanceKm} km`}
                    </span>
                  </div>

                  {/* Sessions grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {Object.entries(gp.sessions).map(([key, session]) => {
                      if (!session) return null;
                      const practiceDataForRound = PRACTICE_RESULTS_2026[gp.round];
                      const qualifyingDataForRound = QUALIFYING_RESULTS_2026[gp.round];

                      const isPracticeSession = key === 'fp1' || key === 'fp2' || key === 'fp3';
                      const isQualifyingSession = key === 'qualifying' || key === 'sprintQualifying';
                      const isSprintSession = key === 'sprint';
                      const isRaceSession = key === 'race';

                      const practiceSession = isPracticeSession
                        ? practiceDataForRound?.sessions[key as 'fp1' | 'fp2' | 'fp3']
                        : undefined;
                      const qualifyingSession = isQualifyingSession
                        ? qualifyingDataForRound?.sessions[key as 'qualifying' | 'sprintQualifying']
                        : undefined;
                      const sprintSession = isSprintSession
                        ? qualifyingDataForRound?.sessions.sprint
                        : undefined;

                      const isFinishedPractice = Boolean(
                        practiceSession && (practiceSession.status === 'finished' || isCompleted),
                      );
                      const isFinishedQualifying = Boolean(
                        qualifyingSession && (qualifyingSession.status === 'finished' || isCompleted),
                      );
                      const isFinishedSprint = Boolean(
                        sprintSession && (sprintSession.status === 'finished' || isCompleted),
                      );
                      const isFinishedRace = isRaceSession && (isCompleted || session.status === 'finished');

                      const isFinished =
                        isFinishedPractice ||
                        isFinishedQualifying ||
                        isFinishedSprint ||
                        isFinishedRace ||
                        session.status === 'finished';

                      const sessionStatus = isFinished ? 'finished' : session.status;

                      const statusLabel =
                        sessionStatus === 'finished'
                          ? isVi
                            ? 'hoàn tất'
                            : 'finished'
                          : sessionStatus === 'live'
                            ? isVi
                              ? 'trực tiếp'
                              : 'live'
                            : isVi
                              ? 'sắp tới'
                              : 'upcoming';

                      const handleSessionClick = () => {
                        if (isFinishedPractice) {
                          setSelectedPracticeRound(gp.round);
                          setSelectedPracticeSessionKey(key as 'fp1' | 'fp2' | 'fp3');
                        } else if (isFinishedQualifying) {
                          setSelectedQualifyingRound(gp.round);
                          setSelectedQualifyingSessionKey(key as 'qualifying' | 'sprintQualifying');
                        } else if (isFinishedSprint) {
                          setSelectedQualifyingRound(gp.round);
                          setSelectedQualifyingSessionKey('sprint');
                        } else if (isFinishedRace) {
                          handleGoToRaceResults(gp.round, gp.season);
                        }
                      };

                      const isClickable =
                        isFinishedPractice || isFinishedQualifying || isFinishedSprint || isFinishedRace;

                      const cardThemeClass = isFinishedPractice
                        ? 'bg-sky-50/80 border-sky-200 hover:border-sky-400 hover:bg-sky-100/60 cursor-pointer group'
                        : isFinishedQualifying
                          ? 'bg-purple-50/80 border-purple-200 hover:border-purple-400 hover:bg-purple-100/60 cursor-pointer group'
                          : isFinishedSprint
                            ? 'bg-amber-50/80 border-amber-200 hover:border-amber-400 hover:bg-amber-100/60 cursor-pointer group'
                            : isFinishedRace
                              ? 'bg-emerald-50/80 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100/60 cursor-pointer group'
                              : 'bg-white border-studio-200';

                      const statusTextClass =
                        sessionStatus === 'finished'
                          ? isFinishedPractice
                            ? 'text-sky-700 font-extrabold'
                            : isFinishedQualifying
                              ? 'text-purple-700 font-extrabold'
                              : isFinishedSprint
                                ? 'text-amber-700 font-extrabold'
                                : isFinishedRace
                                  ? 'text-emerald-700 font-extrabold'
                                  : 'text-studio-400'
                          : sessionStatus === 'live'
                            ? 'text-f1red animate-pulse'
                            : 'text-emerald-600';

                      return (
                        <div
                          key={key}
                          onClick={handleSessionClick}
                          className={`p-2.5 rounded-lg border shadow-xs space-y-1 transition-all ${cardThemeClass}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-studio-500 block truncate">
                              {formatSessionName(session.name, lang)}
                            </span>
                            {isClickable && (
                              <ChevronRight
                                className={`w-3 h-3 group-hover:translate-x-0.5 transition-transform ${
                                  isFinishedPractice
                                    ? 'text-sky-600'
                                    : isFinishedQualifying
                                      ? 'text-purple-600'
                                      : isFinishedSprint
                                        ? 'text-amber-600'
                                        : 'text-emerald-600'
                                }`}
                              />
                            )}
                          </div>
                          <span className="text-xs font-bold text-studio-900 block">
                            {formatDateStr(session.dateStr, lang)}
                          </span>
                          <div className="flex items-center justify-between text-[11px] text-studio-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-studio-400" />
                              {session.timeStr}
                            </span>
                            <span className={`text-[9px] font-bold uppercase ${statusTextClass}`}>
                              {statusLabel}
                            </span>
                          </div>

                          {/* Action Buttons for Finished Sessions */}
                          {isFinishedPractice && (
                            <span className="text-[9px] text-sky-700 font-bold block pt-1 border-t border-sky-200/60 flex items-center gap-1">
                              <Timer className="w-2.5 h-2.5 text-sky-600" />
                              {isVi ? 'Xem BXH Practice' : 'View Practice Table'}
                            </span>
                          )}

                          {isFinishedQualifying && (
                            <span className="text-[9px] text-purple-700 font-bold block pt-1 border-t border-purple-200/60 flex items-center gap-1">
                              <Award className="w-2.5 h-2.5 text-purple-600" />
                              {key === 'sprintQualifying'
                                ? isVi
                                  ? 'Xem BXH Sprint Quali'
                                  : 'View Sprint Quali'
                                : isVi
                                  ? 'Xem BXH Phân Hạng'
                                  : 'View Qualifying Table'}
                            </span>
                          )}

                          {isFinishedSprint && (
                            <span className="text-[9px] text-amber-700 font-bold block pt-1 border-t border-amber-200/60 flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5 text-amber-600" />
                              {isVi ? 'Xem BXH Sprint' : 'View Sprint Table'}
                            </span>
                          )}

                          {isFinishedRace && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGoToRaceResults(gp.round, gp.season);
                              }}
                              className="text-[9px] text-emerald-700 font-bold block pt-1 border-t border-emerald-200/60 flex items-center justify-between gap-1 w-full hover:text-emerald-900 cursor-pointer"
                            >
                              <span className="flex items-center gap-1">
                                <Trophy className="w-2.5 h-2.5 text-emerald-600" />
                                {isVi ? 'Xem kết quả chặng' : 'View Race Results'}
                              </span>
                              <ChevronRight className="w-2.5 h-2.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Practice Classification Modal Portal */}
      {activePracticeData && (
        <PracticeClassificationModal
          practiceData={activePracticeData}
          initialSessionKey={selectedPracticeSessionKey}
          onClose={() => setSelectedPracticeRound(null)}
        />
      )}

      {/* Qualifying Classification Modal Portal */}
      {activeQualifyingData && (
        <QualifyingClassificationModal
          qualifyingData={activeQualifyingData}
          initialSessionKey={selectedQualifyingSessionKey}
          onClose={() => setSelectedQualifyingRound(null)}
        />
      )}
    </div>
  );
});
