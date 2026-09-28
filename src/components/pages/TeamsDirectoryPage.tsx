import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Search, Trophy, Users } from 'lucide-react';
import { TEAMS_DATA } from '../../data/teams';
import { STANDINGS_DATA } from '../../data/championship';
import { getTeamSeasonProfile } from '../../data/teamSeasons';
import { SeasonYear, TeamId } from '../../types';
import { useNavigationStore } from '../../store/useNavigationStore';

const SEASONS: SeasonYear[] = [2026, 2025, 2024];

export const TeamsDirectoryPage: React.FC = () => {
  const lang = useNavigationStore((state) => state.lang);
  const [season, setSeason] = useState<SeasonYear>(2026);
  const [query, setQuery] = useState('');
  const standings = STANDINGS_DATA[season].constructors;
  const teams = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (Object.values(TEAMS_DATA) as (typeof TEAMS_DATA)[TeamId][])
      .filter((team) => Boolean(getTeamSeasonProfile(team.id, season)))
      .filter((team) => {
        if (!normalized) return true;
        const profile = getTeamSeasonProfile(team.id, season)!;
        return [
          team.name,
          profile.fullName,
          profile.base,
          profile.teamLead,
          profile.powerUnit,
        ].some((value) => value.toLowerCase().includes(normalized));
      })
      .sort((a, b) => {
        const rankA = standings.find((row) => row.teamId === a.id)?.rank ?? 99;
        const rankB = standings.find((row) => row.teamId === b.id)?.rank ?? 99;
        return rankA - rankB || a.name.localeCompare(b.name);
      });
  }, [query, standings, season]);

  return (
    <main className="min-h-[70vh] bg-studio-100 py-10 sm:py-16">
      <div className="page-container space-y-8">
        <header className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-f1red">
            F1 Grid Directory
          </span>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight text-studio-950 sm:text-5xl">
            {lang === 'vi' ? 'Các đội đua' : 'The teams'}
          </h1>
          <p className="text-sm leading-relaxed text-studio-600">
            {lang === 'vi'
              ? 'Tìm kiếm đội đua theo tên, trụ sở, team principal hoặc đơn vị động lực; xem thứ hạng theo mùa giải.'
              : 'Search constructors by name, base, team principal, or power unit, then compare their season standings.'}
          </p>
          <p className="text-[11px] leading-relaxed text-studio-500">
            {lang === 'vi'
              ? 'Tên đăng ký, cơ sở, người phụ trách, đơn vị động lực, roster và thứ hạng đều theo mùa đã chọn.'
              : 'Entry name, base, leadership, power unit, line-up, and standings follow the selected season.'}
          </p>
        </header>

        <div className="flex flex-col gap-3 rounded-2xl border border-studio-200 bg-white p-4 shadow-subtle sm:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-studio-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={
                lang === 'vi' ? 'Tìm đội đua, trụ sở, động cơ…' : 'Search team, base, power unit…'
              }
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
        </div>

        <div className="flex items-center justify-between text-xs text-studio-500">
          <span>
            {lang === 'vi' ? `Tìm thấy ${teams.length} đội` : `${teams.length} teams found`}
          </span>
          <Link
            to="/drivers"
            className="inline-flex items-center gap-1 font-bold text-f1red hover:underline"
          >
            {lang === 'vi' ? 'Danh sách tay đua' : 'Driver directory'}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {teams.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {teams.map((team) => {
              const profile = getTeamSeasonProfile(team.id, season)!;
              const result = standings.find((row) => row.teamId === team.id);
              const roster = STANDINGS_DATA[season].drivers.filter(
                (driver) => driver.teamId === team.id,
              );
              return (
                <article
                  key={team.id}
                  className="overflow-hidden rounded-2xl border border-studio-200 bg-white shadow-subtle transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="h-2" style={{ backgroundColor: team.primaryColor }} />
                  <div className="space-y-5 p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-studio-400">
                          {team.name}
                        </p>
                        <h2 className="mt-1 font-display text-xl font-black uppercase text-studio-950">
                          {profile.fullName}
                        </h2>
                      </div>
                      {result && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-studio-100 px-2.5 py-1 text-[11px] font-black text-studio-700">
                          <Trophy className="h-3 w-3 text-amber-500" />P{result.rank}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 text-xs text-studio-600">
                      <p className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-f1red" />
                        {profile.base}
                      </p>
                      <p className="pl-5 text-[11px] text-studio-500">
                        {profile.teamLeadTitle}: {profile.teamLead} · {profile.powerUnit}
                      </p>
                      <p className="flex items-start gap-2">
                        <Users className="mt-0.5 h-3.5 w-3.5 shrink-0 text-f1red" />
                        {roster.length
                          ? roster.map((driver) => driver.driverName).join(' · ')
                          : lang === 'vi'
                            ? 'Chưa có roster trong dữ liệu mùa này'
                            : 'No season roster in the available data'}
                      </p>
                    </div>
                    {result && (
                      <p className="border-t border-studio-100 pt-3 text-xs font-bold text-studio-500">
                        {result.points} PTS <span className="mx-1 text-studio-300">·</span>{' '}
                        {result.wins} {lang === 'vi' ? 'chiến thắng' : 'wins'}{' '}
                        <span className="mx-1 text-studio-300">·</span> {season}
                      </p>
                    )}
                    <Link
                      to={`/teams/${team.id}?season=${season}`}
                      className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-f1red hover:underline"
                    >
                      {lang === 'vi' ? 'Xem hồ sơ đội' : 'Team profile'}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState lang={lang} />
        )}
      </div>
    </main>
  );
};

const EmptyState: React.FC<{ lang: 'vi' | 'en' }> = ({ lang }) => (
  <div className="rounded-2xl border border-dashed border-studio-300 bg-white p-12 text-center text-sm text-studio-500">
    {lang === 'vi' ? 'Không tìm thấy đội đua phù hợp.' : 'No matching teams found.'}
  </div>
);
