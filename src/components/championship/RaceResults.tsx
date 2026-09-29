import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getRaceResults } from '../../data/championship';
import { useChampionshipStore } from '../../store/useChampionshipStore';
import { useNavigationStore } from '../../store/useNavigationStore';
import { Trophy, Zap, CheckCircle2, ChevronRight, ListOrdered, Database } from 'lucide-react';
import { RaceResult } from '../../types';

export const RaceResults: React.FC<{ season: import('../../types').SeasonYear }> = ({ season }) => {
  const navigate = useNavigate();
  const { lang } = useNavigationStore();
  const { detailedResults, syncMeta } = useChampionshipStore();

  const detailedRaces = detailedResults[season] || [];
  const fallbackResults = getRaceResults(season);
  const fallbackRounds = new Set(fallbackResults.map((race) => race.round));
  const syncedSummaries: RaceResult[] = detailedRaces.flatMap((race) => {
    if (fallbackRounds.has(race.round)) return [];
    const p1 = race.entries.find((entry) => entry.position === 1);
    const p2 = race.entries.find((entry) => entry.position === 2);
    const p3 = race.entries.find((entry) => entry.position === 3);
    if (!p1 || !p2 || !p3) return [];
    const fastestLap = race.fastestLap;
    return [
      {
        round: race.round,
        grandPrix: race.grandPrix,
        circuit: race.circuit,
        season: race.season,
        date: race.date,
        dataSource: race.dataSource,
        dataUpdatedAt: race.dataUpdatedAt,
        podium: {
          p1: { driver: p1.driverName, team: p1.teamName, time: p1.timeOrGap, points: p1.points },
          p2: { driver: p2.driverName, team: p2.teamName, gap: p2.timeOrGap, points: p2.points },
          p3: { driver: p3.driverName, team: p3.teamName, gap: p3.timeOrGap, points: p3.points },
        },
        ...(fastestLap ? { fastestLap } : {}),
      },
    ];
  });
  const resultCards = [...fallbackResults, ...syncedSummaries].sort((a, b) => a.round - b.round);
  const displayRacesCount = resultCards.length;
  const [sourceFilter, setSourceFilter] = React.useState('all');
  const [updateFilter, setUpdateFilter] = React.useState<'all' | 'recorded' | 'missing'>('all');
  const getRaceMetadata = (res: RaceResult) => {
    const detailedRace = detailedRaces.find((race) => race.round === res.round);
    const isAwaitingReview = syncMeta.syncStatus === 'review';
    return {
      source:
        detailedRace?.dataSource ||
        res.dataSource ||
        (!isAwaitingReview && syncMeta.source !== 'Local saved snapshot'
          ? syncMeta.source
          : lang === 'vi'
            ? 'Bản lưu tĩnh của website'
            : 'Bundled website snapshot'),
      timestamp:
        detailedRace?.dataUpdatedAt ||
        res.dataUpdatedAt ||
        (!isAwaitingReview && syncMeta.source !== 'Local saved snapshot'
          ? syncMeta.lastSyncTimestamp
          : undefined),
    };
  };
  const sources = [...new Set(resultCards.map((race) => getRaceMetadata(race).source))];
  const filteredResults = resultCards.filter((race) => {
    const { source, timestamp } = getRaceMetadata(race);
    return (
      (sourceFilter === 'all' || source === sourceFilter) &&
      (updateFilter === 'all' || (updateFilter === 'recorded' ? !!timestamp : !timestamp))
    );
  });
  const formatUpdatedAt = (timestamp?: string) => {
    if (!timestamp) return lang === 'vi' ? 'Chưa ghi nhận' : 'Not recorded';
    if (/^\d{4}-\d{2}-\d{2}$/.test(timestamp)) return timestamp;
    const parsed = new Date(timestamp);
    if (Number.isNaN(parsed.getTime())) return timestamp;
    return new Intl.DateTimeFormat(lang === 'vi' ? 'vi-VN' : 'en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(parsed);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 bg-white rounded-xl border border-studio-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-display text-lg font-bold uppercase tracking-wider text-studio-900">
              {lang === 'vi'
                ? `Kết Quả Các Chặng Đua (${season})`
                : `Grand Prix Results (${season})`}
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />{' '}
              {lang === 'vi'
                ? `${displayRacesCount} chặng có kết quả`
                : `${displayRacesCount} rounds with results`}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              <ListOrdered className="w-3 h-3" />{' '}
              {lang === 'vi' ? 'Kết quả từ bản lưu và đồng bộ' : 'Saved and synced results'}
            </span>
          </div>
          <p className="text-xs text-studio-500 font-medium">
            {lang === 'vi'
              ? 'Podium được lưu sẵn để trang vẫn hiển thị khi nguồn đồng bộ tạm thời gián đoạn.'
              : 'Podiums are cached locally so results remain visible when the data source is unavailable.'}
          </p>
        </div>
        <span className="text-xs font-bold text-studio-600 bg-studio-100 px-3 py-1.5 rounded-lg border border-studio-200 shrink-0">
          {lang === 'vi' ? (
            <>
              Hiển thị <strong>{filteredResults.length}</strong> / {displayRacesCount} Grands Prix
            </>
          ) : (
            <>
              Showing <strong>{filteredResults.length}</strong> of {displayRacesCount} Grands Prix
            </>
          )}
        </span>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-studio-200 bg-white p-4">
        <label className="flex min-w-48 flex-1 flex-col gap-1 text-xs font-bold text-studio-700">
          {lang === 'vi' ? 'Nguồn dữ liệu' : 'Data source'}
          <select
            value={sourceFilter}
            onChange={(event) => setSourceFilter(event.target.value)}
            className="rounded-lg border border-studio-200 bg-white px-3 py-2 text-sm font-medium"
          >
            <option value="all">{lang === 'vi' ? 'Tất cả nguồn' : 'All sources'}</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-48 flex-1 flex-col gap-1 text-xs font-bold text-studio-700">
          {lang === 'vi' ? 'Trạng thái cập nhật' : 'Update status'}
          <select
            value={updateFilter}
            onChange={(event) => setUpdateFilter(event.target.value as typeof updateFilter)}
            className="rounded-lg border border-studio-200 bg-white px-3 py-2 text-sm font-medium"
          >
            <option value="all">{lang === 'vi' ? 'Tất cả trạng thái' : 'All statuses'}</option>
            <option value="recorded">
              {lang === 'vi' ? 'Có thời điểm cập nhật' : 'Update recorded'}
            </option>
            <option value="missing">
              {lang === 'vi' ? 'Chưa ghi nhận thời điểm' : 'No update recorded'}
            </option>
          </select>
        </label>
        <span className="text-xs text-studio-500" aria-live="polite">
          {lang === 'vi'
            ? `Hiển thị ${filteredResults.length}/${displayRacesCount} chặng`
            : `Showing ${filteredResults.length}/${displayRacesCount} rounds`}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResults.map((res) => (
          <div
            key={res.round}
            className="bg-white rounded-xl border border-studio-200 shadow-subtle p-6 space-y-4 hover:border-studio-300 hover:shadow-md transition-all flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-studio-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-f1red">
                  Round {res.round} · {res.date}
                </span>
                <h4 className="font-display text-xl font-bold text-studio-950">{res.grandPrix}</h4>
                <span className="text-xs text-studio-500">{res.circuit}</span>
                {(() => {
                  const { source, timestamp } = getRaceMetadata(res);
                  return (
                    <span className="mt-1 flex flex-wrap items-center gap-x-2 text-[10px] text-studio-500">
                      <span className="inline-flex items-center gap-1">
                        <Database className="h-3 w-3" />
                        {lang === 'vi' ? 'Nguồn' : 'Source'}: {source}
                      </span>
                      <span>
                        {lang === 'vi' ? 'Cập nhật' : 'Updated'}: {formatUpdatedAt(timestamp)}
                      </span>
                    </span>
                  );
                })()}
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
                    <span className="text-[11px] text-studio-600 font-medium">
                      {res.podium.p1.team}
                    </span>
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
                Fastest Lap: <strong>{res.fastestLap?.driver}</strong> ({res.fastestLap?.team})
              </span>
              <span className="font-mono font-bold text-purple-700">{res.fastestLap?.time}</span>
            </div>
            <button
              onClick={() => navigate(`/season/${season}/race/${res.round}`)}
              className="w-full mt-auto py-2.5 px-4 rounded-lg bg-studio-900 hover:bg-f1red text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              {lang === 'vi' ? 'Xem kết quả chặng' : 'View race result'}{' '}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
