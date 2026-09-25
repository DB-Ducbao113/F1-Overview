import React from 'react';
import { getRaceResults } from '../../data/championship';
import { useChampionshipStore } from '../../store/useChampionshipStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { t } from '../../i18n/translations';
import { Trophy, Zap, Flag, Timer, CheckCircle2, ChevronRight, ListOrdered } from 'lucide-react';
import { DetailedRaceResult } from '../../types';

export const RaceResults: React.FC = () => {
  const { lang } = useNavigationStore();
  const { selectedSeason, detailedResults, openRaceModal } = useChampionshipStore();
  const strings = t[lang].championship;

  // Prefer detailed results for the season, fallback to summary results
  const detailedRaces = detailedResults[selectedSeason] || [];
  const fallbackResults = getRaceResults(selectedSeason);

  // Use detailed races if available, else map fallback
  const displayRacesCount = detailedRaces.length > 0 ? detailedRaces.length : fallbackResults.length;

  return (
    <div className="space-y-6">
      <div className="p-5 bg-white rounded-xl border border-studio-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-studio-900">
              {lang === 'vi' ? `Kết Quả Các Chặng Đua (${selectedSeason})` : `Grand Prix Results (${selectedSeason})`}
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" /> {detailedRaces.length > 0 ? (lang === 'vi' ? `${detailedRaces.length} Chặng hoàn thành` : `${detailedRaces.length} Completed Rounds`) : (lang === 'vi' ? 'Toàn bộ 24 Chặng' : 'All 24 Rounds')}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              <ListOrdered className="w-3 h-3" /> {lang === 'vi' ? 'Dữ liệu 20 tay đua / chặng' : '20 Drivers / Round'}
            </span>
          </div>
          <p className="text-xs text-studio-500 font-medium">
            {lang === 'vi'
              ? 'Bảng phân hạng chính thức 20 tay đua, thời gian hoàn thành, số vòng đua và điểm số theo quy chuẩn FIA.'
              : 'Official FIA classification, finish times, lap counts, and championship points.'}
          </p>
        </div>
        <span className="text-xs font-bold text-studio-600 bg-studio-100 px-3 py-1.5 rounded-lg border border-studio-200 shrink-0">
          {lang === 'vi' ? <>Hiển thị <strong>{displayRacesCount}</strong> Grands Prix</> : <>Showing <strong>{displayRacesCount}</strong> Grands Prix</>}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {detailedRaces.length > 0
          ? detailedRaces.map((race) => {
              const p1 = race.entries.find((e) => e.position === 1);
              const p2 = race.entries.find((e) => e.position === 2);
              const p3 = race.entries.find((e) => e.position === 3);

              return (
                <div
                  key={race.id || race.round}
                  className="bg-white rounded-xl border border-studio-200 shadow-subtle p-6 space-y-4 hover:border-studio-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-studio-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-f1red">
                            Round {race.round} · {race.date}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-studio-100 text-studio-600">
                            {race.status.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-display text-xl font-bold text-studio-950">
                          {race.grandPrix}
                        </h4>
                        <span className="text-xs text-studio-500">{race.circuit}</span>
                      </div>
                      <Trophy className="w-6 h-6 text-amber-500 shrink-0" />
                    </div>

                    {/* Podium Finishers */}
                    <div className="space-y-2.5">
                      {/* P1 */}
                      {p1 && (
                        <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-amber-400 text-black font-black text-xs flex items-center justify-center shrink-0">
                              1
                            </span>
                            <div>
                              <span className="font-bold text-sm text-studio-950 block">
                                {p1.driverName}
                              </span>
                              <span className="text-[11px] text-studio-600 font-medium">
                                {p1.teamName}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-studio-900 block">
                              {p1.timeOrGap}
                            </span>
                            <span className="text-[10px] font-bold text-f1red">
                              +{p1.points} PTS
                            </span>
                          </div>
                        </div>
                      )}

                      {/* P2 */}
                      {p2 && (
                        <div className="p-2.5 rounded-lg bg-studio-50 border border-studio-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-studio-300 text-studio-900 font-bold text-xs flex items-center justify-center shrink-0">
                              2
                            </span>
                            <div>
                              <span className="font-bold text-xs text-studio-900 block">
                                {p2.driverName}
                              </span>
                              <span className="text-[10px] text-studio-500">{p2.teamName}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono text-studio-700 block">
                              {p2.timeOrGap}
                            </span>
                            <span className="text-[10px] font-bold text-f1red">
                              +{p2.points} PTS
                            </span>
                          </div>
                        </div>
                      )}

                      {/* P3 */}
                      {p3 && (
                        <div className="p-2.5 rounded-lg bg-studio-50 border border-studio-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              3
                            </span>
                            <div>
                              <span className="font-bold text-xs text-studio-900 block">
                                {p3.driverName}
                              </span>
                              <span className="text-[10px] text-studio-500">{p3.teamName}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono text-studio-700 block">
                              {p3.timeOrGap}
                            </span>
                            <span className="text-[10px] font-bold text-f1red">
                              +{p3.points} PTS
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Fastest Lap Callout */}
                    {race.fastestLap && (
                      <div className="pt-2 border-t border-studio-100 flex items-center justify-between text-xs text-studio-600">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Zap className="w-3.5 h-3.5 text-purple-600" />
                          Fastest Lap: <strong>{race.fastestLap.driver}</strong> ({race.fastestLap.team})
                        </span>
                        <span className="font-mono font-bold text-purple-700">{race.fastestLap.time}</span>
                      </div>
                    )}
                  </div>

                  {/* Classification Inspection Button */}
                  <button
                    onClick={() => openRaceModal(race)}
                    className="w-full mt-2 py-2.5 px-4 rounded-lg bg-studio-900 hover:bg-f1red text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs group"
                  >
                    <span>{lang === 'vi' ? 'Xem Bảng Phân Hạng Toàn Bộ 20 Tay Đua' : 'View Full 20-Car Classification'}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              );
            })
          : fallbackResults.map((res) => (
              <div
                key={res.round}
                className="bg-white rounded-xl border border-studio-200 shadow-subtle p-6 space-y-4 hover:border-studio-300 hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-studio-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-f1red">
                      Round {res.round} · {res.date}
                    </span>
                    <h4 className="font-display text-xl font-bold text-studio-950">
                      {res.grandPrix}
                    </h4>
                    <span className="text-xs text-studio-500">{res.circuit}</span>
                  </div>
                  <Trophy className="w-6 h-6 text-amber-500" />
                </div>

                {/* Podium Finishers */}
                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-black font-black text-xs flex items-center justify-center">
                        1
                      </span>
                      <div>
                        <span className="font-bold text-sm text-studio-950 block">
                          {res.podium.p1.driver}
                        </span>
                        <span className="text-[11px] text-studio-600 font-medium">{res.podium.p1.team}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-studio-900 block">
                        {res.podium.p1.time}
                      </span>
                      <span className="text-[10px] font-bold text-f1red">
                        +{res.podium.p1.points} PTS
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-studio-50 border border-studio-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-studio-300 text-studio-900 font-bold text-xs flex items-center justify-center">
                        2
                      </span>
                      <div>
                        <span className="font-bold text-xs text-studio-900 block">
                          {res.podium.p2.driver}
                        </span>
                        <span className="text-[10px] text-studio-500">{res.podium.p2.team}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-studio-700 block">
                        {res.podium.p2.gap}
                      </span>
                      <span className="text-[10px] font-bold text-f1red">
                        +{res.podium.p2.points} PTS
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-studio-50 border border-studio-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center">
                        3
                      </span>
                      <div>
                        <span className="font-bold text-xs text-studio-900 block">
                          {res.podium.p3.driver}
                        </span>
                        <span className="text-[10px] text-studio-500">{res.podium.p3.team}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-studio-700 block">
                        {res.podium.p3.gap}
                      </span>
                      <span className="text-[10px] font-bold text-f1red">
                        +{res.podium.p3.points} PTS
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-studio-100 flex items-center justify-between text-xs text-studio-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Zap className="w-3.5 h-3.5 text-purple-600" />
                    Fastest Lap: <strong>{res.fastestLap.driver}</strong> ({res.fastestLap.team})
                  </span>
                  <span className="font-mono font-bold text-purple-700">{res.fastestLap.time}</span>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

