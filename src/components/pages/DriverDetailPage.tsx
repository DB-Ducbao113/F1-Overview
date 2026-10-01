import React from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Flag, Trophy, Box } from 'lucide-react';
import { DRIVERS_DATA } from '../../data/drivers';
import { TEAMS_DATA } from '../../data/teams';
import { STANDINGS_DATA } from '../../data/championship';
import { useNavigationStore } from '../../store/useNavigationStore';
import { SeasonYear } from '../../types';
import { ConstructorLogo } from '../common/ConstructorLogo';

const SEASONS: SeasonYear[] = [2026, 2025, 2024];

export const DriverDetailPage: React.FC = () => {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const lang = useNavigationStore((state) => state.lang);
  const driver = driverId ? DRIVERS_DATA[driverId] : undefined;
  const seasonEntries = driverId
    ? SEASONS.flatMap((season) =>
        STANDINGS_DATA[season].drivers
          .filter((entry) => entry.driverId === driverId)
          .map((entry) => ({ ...entry, season })),
      )
    : [];
  const requestedSeason = Number(searchParams.get('season')) as SeasonYear;
  const entry = seasonEntries.find((item) => item.season === requestedSeason) ?? seasonEntries[0];

  if (!driver && !entry) {
    return (
      <div className="page-container py-24 min-h-[60vh] text-center">
        <p className="text-f1red font-black text-5xl">404</p>
        <h1 className="mt-4 text-xl font-bold">
          {lang === 'vi' ? 'Không tìm thấy tay đua' : 'Driver not found'}
        </h1>
        <Link className="inline-block mt-6 text-f1red font-bold" to="/drivers">
          {lang === 'vi' ? 'Về danh sách tay đua' : 'Back to driver directory'}
        </Link>
      </div>
    );
  }

  const season = entry?.season ?? 2026;
  const teamId = entry?.teamId ?? driver!.teamId;
  const team = TEAMS_DATA[teamId];
  const name = driver?.name ?? entry!.driverName;
  const code = driver?.code ?? entry!.driverCode;
  const flag = driver?.flagEmoji ?? entry?.countryFlag ?? '';
  const country = driver?.country;

  return (
    <div className="min-h-[70vh] bg-studio-100 py-10 sm:py-16">
      <div className="page-container space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.history.length > 2) {
                  navigate(-1);
                } else {
                  navigate(`/season/${season}?tab=drivers`);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-studio-200 text-xs font-bold uppercase tracking-wider text-studio-700 hover:text-f1red hover:border-f1red transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{lang === 'vi' ? 'Quay lại' : 'Back'}</span>
            </button>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-studio-400">
              <Link
                to={`/season/${season}?tab=drivers`}
                className="hover:text-f1red transition-colors text-studio-500"
              >
                {lang === 'vi' ? `Tay đua (${season})` : `Drivers (${season})`}
              </Link>
              <span>/</span>
              <span className="text-studio-900">{name}</span>
            </div>
          </div>
          {seasonEntries.length > 0 && (
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-studio-500">
              {lang === 'vi' ? 'Mùa giải' : 'Season'}
              <select
                value={season}
                onChange={(event) => setSearchParams({ season: event.target.value })}
                className="rounded-lg border border-studio-200 bg-white px-3 py-2 text-sm font-bold text-studio-900"
              >
                {seasonEntries.map((item) => (
                  <option key={item.season} value={item.season}>
                    {item.season}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>

        <header className="relative overflow-hidden rounded-3xl bg-studio-950 p-7 text-white sm:p-12">
          <div
            className="absolute inset-y-0 left-0 w-2"
            style={{ backgroundColor: team.primaryColor }}
          />
          <div
            className="absolute -right-20 -top-24 h-80 w-80 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: team.primaryColor }}
          />
          {driver?.imageUrl && (
            <div className="absolute right-0 top-0 bottom-0 w-64 sm:w-80 md:w-96 pointer-events-none flex items-end justify-end overflow-hidden">
              <img
                src={driver.imageUrl}
                alt={name}
                className="h-full w-auto max-w-full object-contain object-bottom-right opacity-40 sm:opacity-55 filter grayscale(20%) contrast-110 mix-blend-screen"
              />
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-studio-950 to-transparent pointer-events-none" />
            </div>
          )}
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-4">
              <span
                className="text-xs font-black uppercase tracking-[0.25em]"
                style={{ color: team.primaryColor }}
              >
                {season} · {code} · {flag}
                {country ? ` ${country}` : ''}
              </span>
              <h1 className="font-display text-4xl font-black uppercase tracking-tight sm:text-6xl">
                {name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to={`/teams/${teamId}?season=${season}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-studio-300 hover:text-white"
                >
                  <ConstructorLogo teamId={teamId} size="sm" />
                  <span>{team.fullName}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={`/showroom?team=${teamId}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-f1red text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all border border-white/10"
                  title={lang === 'vi' ? 'Xem cỗ máy trong Showroom 3D' : 'View car in 3D Showroom'}
                >
                  <Box className="w-3.5 h-3.5 text-f1red group-hover:text-white" />
                  <span>{lang === 'vi' ? 'Xem Xe 3D' : '3D Showroom'}</span>
                </Link>
              </div>
            </div>
            {driver && (
              <span className="font-display text-8xl font-black leading-none text-white/10 sm:text-9xl">
                {driver.number}
              </span>
            )}
          </div>
        </header>

        {entry ? (
          <section className="grid gap-4 sm:grid-cols-3">
            <Stat
              icon={<Trophy className="h-4 w-4" />}
              label={lang === 'vi' ? 'Thứ hạng mùa giải' : 'Season rank'}
              value={`P${entry.rank} · ${season}`}
            />
            <Stat
              icon={<Trophy className="h-4 w-4" />}
              label={lang === 'vi' ? 'Chiến thắng / podium' : 'Wins / podiums'}
              value={`${entry.wins} / ${entry.podiums}`}
            />
            <Stat
              icon={<Flag className="h-4 w-4" />}
              label={lang === 'vi' ? 'Điểm mùa giải' : 'Season points'}
              value={`${entry.points} PTS`}
            />
          </section>
        ) : (
          <Stat
            icon={<Trophy className="h-4 w-4" />}
            label={
              lang === 'vi'
                ? 'Thành tích sự nghiệp theo dữ liệu mẫu'
                : 'Career stats in bundled data'
            }
            value={`${driver?.careerWins ?? 0} wins · ${driver?.podiums ?? 0} podiums`}
          />
        )}
        <p className="text-[11px] text-studio-500">
          {lang === 'vi'
            ? 'Thứ hạng, điểm và kết quả được lấy từ mùa giải đang chọn. Số xe và quốc tịch là thông tin hồ sơ hiện có trong bộ dữ liệu dự án.'
            : 'Rank, points, and results use the selected season. Car number and nationality come from the available driver profile dataset.'}
        </p>
        <Link
          to={`/showroom?team=${teamId}`}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-black uppercase tracking-wider text-studio-800 shadow-subtle hover:text-f1red"
        >
          <Box className="h-4 w-4 text-f1red" />
          <span>
            {lang === 'vi'
              ? `Khám phá Showroom 3D xe ${team.name}`
              : `Explore ${team.name} in 3D Showroom`}
          </span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <div className="rounded-2xl border border-studio-200 bg-white p-5 shadow-subtle">
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-f1red/10 text-f1red">
      {icon}
    </span>
    <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-studio-400">{label}</p>
    <p className="mt-1 text-sm font-bold leading-relaxed text-studio-900">{value}</p>
  </div>
);
