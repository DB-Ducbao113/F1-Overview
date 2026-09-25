import React from 'react';
import { getStandings } from '../../data/championship';
import { TEAMS_DATA } from '../../data/teams';
import { SeasonYear } from '../../types';
import { t } from '../../i18n/translations';
import { useNavigationStore } from '../../store/useNavigationStore';
import { useChampionshipStore } from '../../store/useChampionshipStore';
import { Trophy, Award, ExternalLink, ShieldCheck, Clock, AlertCircle } from 'lucide-react';

interface StandingsTableProps {
  season: SeasonYear;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({ season }) => {
  const { lang } = useNavigationStore();
  const { standingsCategory, setStandingsCategory, calculatedStandings } = useChampionshipStore();
  const strings = t[lang].championship;

  const rawStandings = getStandings(season);
  const isCalculated = Boolean(calculatedStandings[season]);
  const activeDrivers = calculatedStandings[season]?.drivers || rawStandings.drivers;
  const activeConstructors = calculatedStandings[season]?.constructors || rawStandings.constructors;
  const isOngoing = rawStandings.status === 'ongoing';

  const f1SourceUrl =
    standingsCategory === 'drivers'
      ? `https://www.formula1.com/en/results/${season}/drivers`
      : `https://www.formula1.com/en/results/${season}/team`;

  const leaderDriver = activeDrivers[0];
  const leaderConstructor = activeConstructors[0];

  const dynamicLeaderTitle =
    isOngoing && leaderDriver && leaderConstructor
      ? `CURRENT CHAMPIONSHIP LEADER: ${leaderDriver.driverName.toUpperCase()} (${leaderDriver.points} PTS) · ${leaderConstructor.teamName.toUpperCase()} (${leaderConstructor.points} PTS)`
      : (rawStandings.leaderTitle || `${strings.title} ${season}`);

  return (
    <div className="space-y-6">
      {/* ── Status Banner (Ongoing vs Completed) ── */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          isOngoing
            ? 'bg-gradient-to-r from-emerald-950/20 via-studio-900 to-studio-950 text-white border-emerald-500/30'
            : 'bg-white border-studio-200 text-studio-900 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              {isOngoing ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{lang === 'vi' ? 'Mùa giải đang diễn ra' : 'Ongoing Season'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-studio-100 text-studio-700 text-xs font-black uppercase tracking-wider border border-studio-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === 'vi' ? 'Kết quả chung cuộc chính thức' : 'Official Final Standings'}</span>
                </span>
              )}

              {isCalculated && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  ⚡ {lang === 'vi' ? 'Động: Tính từ Race Results' : 'Dynamic: Calculated from Race Results'}
                </span>
              )}

              {rawStandings.lastUpdated && (
                <span className={`inline-flex items-center gap-1 text-[11px] ${isOngoing ? 'text-studio-300' : 'text-studio-500'}`}>
                  <Clock className="w-3 h-3" />
                  <span>{lang === 'vi' ? 'Cập nhật:' : 'Last updated:'} {rawStandings.lastUpdated}</span>
                </span>
              )}
            </div>

            <h3 className={`font-display text-lg sm:text-xl font-black uppercase tracking-tight ${isOngoing ? 'text-white' : 'text-studio-950'}`}>
              {dynamicLeaderTitle}
            </h3>

            <p className={`text-xs max-w-2xl leading-relaxed ${isOngoing ? 'text-studio-300' : 'text-studio-600'}`}>
              {isOngoing
                ? (lang === 'vi'
                    ? 'Bảng điểm chính thức hiện tại sau 14 sự kiện theo Formula 1®. Đây là điểm số tích lũy tại thời điểm thi đấu hiện tại (Grand Prix, Sprint, Fastest Lap), không phải kết quả chung cuộc.'
                    : 'Official live standings after 14 events per Formula 1®. Reflects cumulative current points (Grand Prix, Sprint, Fastest Lap), not final season totals.')
                : (lang === 'vi'
                    ? `Dữ liệu chung cuộc mùa giải ${season} đã kết thúc, được đối soát 100% chuẩn xác với cơ sở dữ liệu FIA Formula 1.`
                    : `Official final classification for the completed ${season} FIA Formula 1 World Championship season.`)}
            </p>
          </div>

          <a
            href={f1SourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all self-start sm:self-center shrink-0 ${
              isOngoing
                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40'
                : 'bg-studio-100 hover:bg-studio-200 text-studio-800 border border-studio-200'
            }`}
          >
            <span>F1.com Official Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Category Toggle (Drivers vs Constructors) */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-white border border-studio-200 max-w-md shadow-xs">
        <button
          onClick={() => setStandingsCategory('drivers')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            standingsCategory === 'drivers'
              ? 'bg-f1red text-white shadow-sm'
              : 'text-studio-600 hover:text-studio-950'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{strings.driversTab}</span>
        </button>
        <button
          onClick={() => setStandingsCategory('constructors')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            standingsCategory === 'constructors'
              ? 'bg-f1red text-white shadow-sm'
              : 'text-studio-600 hover:text-studio-950'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>{strings.constructorsTab}</span>
        </button>
      </div>

      {/* Drivers Classification Table */}
      {standingsCategory === 'drivers' && (
        <div className="bg-white rounded-xl border border-studio-200 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-studio-100/80 border-b border-studio-200 text-studio-600 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-16 text-center">{strings.pos}</th>
                  <th className="py-3.5 px-4">{strings.driver}</th>
                  <th className="py-3.5 px-4">{strings.team}</th>
                  <th className="py-3.5 px-4 text-center">{strings.wins}</th>
                  <th className="py-3.5 px-4 text-center">{strings.podiums}</th>
                  <th className="py-3.5 px-6 text-right font-black text-studio-950">{strings.points}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-studio-100">
                {activeDrivers.map((driver) => {
                  const team = TEAMS_DATA[driver.teamId];
                  return (
                    <tr
                      key={`${driver.driverId}-${driver.teamId}`}
                      className="hover:bg-studio-50 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-center font-display font-black text-sm">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${
                            driver.rank === 1
                              ? 'bg-amber-400 text-black shadow-xs'
                              : driver.rank === 2
                              ? 'bg-studio-300 text-studio-900'
                              : driver.rank === 3
                              ? 'bg-amber-700 text-white'
                              : 'text-studio-700'
                          }`}
                        >
                          {driver.rank}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="text-base" title={driver.countryFlag}>
                            {driver.countryFlag}
                          </span>
                          <div>
                            <span className="font-bold text-studio-900 block text-sm">
                              {driver.driverName}
                            </span>
                            <span className="text-[10px] text-studio-400 font-mono">
                              {driver.driverCode}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: team?.primaryColor || '#999' }}
                          />
                          <span className="font-semibold text-studio-700">{driver.teamName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-studio-700">
                        {driver.wins}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-studio-700">
                        {driver.podiums}
                      </td>
                      <td className="py-3.5 px-6 text-right font-display font-black text-base text-f1red">
                        {driver.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Constructors Classification Table */}
      {standingsCategory === 'constructors' && (
        <div className="bg-white rounded-xl border border-studio-200 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-studio-100/80 border-b border-studio-200 text-studio-600 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-16 text-center">{strings.pos}</th>
                  <th className="py-3.5 px-4">{strings.team}</th>
                  <th className="py-3.5 px-4">{strings.engine}</th>
                  <th className="py-3.5 px-4 text-center">{strings.wins}</th>
                  <th className="py-3.5 px-4 text-center">{strings.podiums}</th>
                  <th className="py-3.5 px-6 text-right font-black text-studio-950">{strings.points}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-studio-100">
                {activeConstructors.map((c) => {
                  const team = TEAMS_DATA[c.teamId];
                  return (
                    <tr key={`${c.teamId}-${c.rank}`} className="hover:bg-studio-50 transition-colors">
                      <td className="py-3.5 px-4 text-center font-display font-black text-sm">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${
                            c.rank === 1
                              ? 'bg-amber-400 text-black shadow-xs'
                              : c.rank === 2
                              ? 'bg-studio-300 text-studio-900'
                              : c.rank === 3
                              ? 'bg-amber-700 text-white'
                              : 'text-studio-700'
                          }`}
                        >
                          {c.rank}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: team?.primaryColor || '#999' }}
                          />
                          <span className="font-bold text-studio-900 text-sm">{c.teamName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-studio-600">{c.engine}</td>
                      <td className="py-3.5 px-4 text-center font-semibold text-studio-700">
                        {c.wins}
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-studio-700">
                        {c.podiums}
                      </td>
                      <td className="py-3.5 px-6 text-right font-display font-black text-base text-f1red">
                        {c.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
