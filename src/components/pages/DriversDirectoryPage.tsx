import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Trophy } from 'lucide-react';
import { STANDINGS_DATA } from '../../data/championship';
import { TEAMS_DATA } from '../../data/teams';
import { SeasonYear, TeamId } from '../../types';
import { useNavigationStore } from '../../store/useNavigationStore';
import { ConstructorLogo } from '../common/ConstructorLogo';

const SEASONS: SeasonYear[] = [2026, 2025, 2024];

export const DriversDirectoryPage: React.FC = () => {
  const lang = useNavigationStore((state) => state.lang);
  const [season, setSeason] = useState<SeasonYear>(2026);
  const [teamId, setTeamId] = useState<'all' | TeamId>('all');
  const [query, setQuery] = useState('');
  const drivers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return STANDINGS_DATA[season].drivers.filter((driver) => {
      if (teamId !== 'all' && driver.teamId !== teamId) return false;
      return (
        !normalized ||
        [driver.driverName, driver.driverCode, driver.teamName].some((value) =>
          value.toLowerCase().includes(normalized),
        )
      );
    });
  }, [query, season, teamId]);

  return (
    <main className="min-h-[70vh] bg-studio-100 py-10 sm:py-16">
      <div className="page-container space-y-8">
        <header className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-f1red">
            F1 Driver Directory
          </span>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-studio-950 sm:text-5xl">
            {lang === 'vi' ? 'Các tay đua' : 'The drivers'}
          </h1>
          <p className="text-sm leading-relaxed text-studio-600">
            {lang === 'vi'
              ? 'Duyệt bảng xếp hạng tay đua theo mùa giải hoặc lọc theo đội.'
              : 'Browse the driver standings by season or filter the grid by constructor.'}
          </p>
        </header>

        <div className="grid gap-3 rounded-2xl border border-studio-200 bg-white p-4 shadow-subtle sm:grid-cols-[1fr_auto_auto]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-studio-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={lang === 'vi' ? 'Tìm tay đua hoặc đội…' : 'Search driver or team…'}
              className="w-full rounded-xl border border-studio-200 bg-studio-50 py-3 pl-10 pr-3 text-sm outline-none focus:border-f1red"
            />
          </label>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-studio-500">
            {lang === 'vi' ? 'Mùa giải' : 'Season'}
            <select
              value={season}
              onChange={(event) => setSeason(Number(event.target.value) as SeasonYear)}
              className="rounded-xl border border-studio-200 bg-studio-50 px-3 py-3 text-sm font-bold text-studio-900 outline-none focus:border-f1red"
            >
              {SEASONS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-studio-500">
            {lang === 'vi' ? 'Đội' : 'Team'}
            <select
              value={teamId}
              onChange={(event) => setTeamId(event.target.value as 'all' | TeamId)}
              className="max-w-48 rounded-xl border border-studio-200 bg-studio-50 px-3 py-3 text-sm font-bold text-studio-900 outline-none focus:border-f1red"
            >
              <option value="all">{lang === 'vi' ? 'Tất cả đội' : 'All teams'}</option>
              {Object.values(TEAMS_DATA).map((team) => (
                <option value={team.id} key={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center justify-between text-xs text-studio-500">
          <span>
            {lang === 'vi'
              ? `Tìm thấy ${drivers.length} tay đua`
              : `${drivers.length} drivers found`}
          </span>
          <Link
            to="/teams"
            className="inline-flex items-center gap-1 font-bold text-f1red hover:underline"
          >
            {lang === 'vi' ? 'Danh sách đội đua' : 'Team directory'}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {drivers.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {drivers.map((driver) => {
              const team = TEAMS_DATA[driver.teamId];
              return (
                <Link
                  key={driver.driverId}
                  to={`/drivers/${driver.driverId}?season=${season}`}
                  className="group relative overflow-hidden rounded-2xl border border-studio-200 bg-white p-5 shadow-subtle transition hover:-translate-y-1 hover:border-studio-400 hover:shadow-lg sm:p-6"
                >
                  <span
                    className="absolute inset-y-0 left-0 w-1"
                    style={{ backgroundColor: team?.primaryColor || '#e80020' }}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-studio-400">
                        {driver.countryFlag} · {driver.driverCode}
                      </span>
                      <h2 className="mt-2 font-display text-xl font-black text-studio-950 group-hover:text-f1red">
                        {driver.driverName}
                      </h2>
                      <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-studio-500">
                        <ConstructorLogo teamId={driver.teamId} size="sm" />
                        <span>{driver.teamName} · {season}</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-studio-100 px-2.5 py-1 text-[11px] font-black text-studio-700">
                      <Trophy className="h-3 w-3 text-amber-500" />P{driver.rank}
                    </span>
                  </div>
                  <div className="mt-5 flex items-end justify-between border-t border-studio-100 pt-4">
                    <div className="flex gap-4 text-xs text-studio-500">
                      <span>
                        <strong className="block text-lg text-studio-900">{driver.wins}</strong>
                        {lang === 'vi' ? 'Thắng' : 'Wins'}
                      </span>
                      <span>
                        <strong className="block text-lg text-studio-900">{driver.podiums}</strong>
                        Podiums
                      </span>
                    </div>
                    <span className="text-right">
                      <strong className="block text-xl font-black text-f1red">
                        {driver.points}
                      </strong>
                      <span className="text-[10px] font-bold uppercase text-studio-400">
                        PTS <ArrowRight className="inline h-3 w-3" />
                      </span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-studio-300 bg-white p-12 text-center text-sm text-studio-500">
            {lang === 'vi' ? 'Không tìm thấy tay đua phù hợp.' : 'No matching drivers found.'}
          </div>
        )}
      </div>
    </main>
  );
};
