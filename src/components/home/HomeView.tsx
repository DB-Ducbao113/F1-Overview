import React, { useState } from 'react';
import { useNavigationStore } from '../../store/useNavigationStore';
import { t } from '../../i18n/translations';
import { STANDINGS_DATA, CALENDAR_2026 } from '../../data/championship';
import { TEAMS_DATA } from '../../data/teams';
import { FullscreenCarStage } from './FullscreenCarStage';
import { MostLovedShowcase } from './MostLovedShowcase';
import { SeasonYear } from '../../types';
import {
  ArrowRight,
  Trophy,
  Calendar,
  Image,
  Car,
  Flag,
  MapPin,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { setActiveTab, viewCarDetail, lang } = useNavigationStore();
  const strings = t[lang].home;
  const navStrings = t[lang].nav;

  // Standings Season selector on Homepage (defaults to 2024 - Official Completed Season)
  const [standingsSeason, setStandingsSeason] = useState<SeasonYear>(2024);

  // Next Race: Round 15 Azerbaijan GP
  const nextRace = CALENDAR_2026.find((gp) => gp.status === 'current') || CALENDAR_2026[14];

  // Standings for current selected season
  const currentStandings = STANDINGS_DATA[standingsSeason] || STANDINGS_DATA[2024];
  const topDrivers = currentStandings.drivers.slice(0, 3);
  const topConstructors = currentStandings.constructors.slice(0, 3);


  return (
    <div className="bg-studio-100 min-h-screen pb-20 animate-fade-in space-y-16">
      {/* ── 1. Hero: Fullscreen Aerodynamic Car Stage (11 Teams) ── */}
      <FullscreenCarStage />

      {/* ── 2. Next Race Weekend Widget ── */}
      <section className="page-container">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-studio-200 shadow-subtle flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-f1red" />

          {/* Left Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-f1red/10 text-f1red text-[11px] font-bold uppercase tracking-wider animate-pulse">
                {lang === 'vi' ? `Chặng ${nextRace.round} · Tuần Lễ Thi Đấu` : `Round ${nextRace.round} · Active Race Weekend`}
              </span>
              <span className="text-xs text-studio-500 font-semibold">{nextRace.country}</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-studio-950">
              {nextRace.name}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-studio-600 font-medium">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-f1red" /> {nextRace.circuit}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-f1red" /> {nextRace.dates}
              </span>
              <span className="text-studio-400">|</span>
              <span>{nextRace.laps} {lang === 'vi' ? 'Vòng' : 'Laps'} ({nextRace.raceDistanceKm} km)</span>
            </div>
          </div>

          {/* Sessions Preview */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="p-3 rounded-xl bg-studio-50 border border-studio-200 text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-studio-400 block">FP3</span>
              <span className="text-xs font-bold text-studio-900 block">Fri 25 Sep</span>
              <span className="text-[10px] text-studio-500">12:30 AZT</span>
            </div>
            <div className="p-3 rounded-xl bg-studio-50 border border-studio-200 text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-studio-400 block">{lang === 'vi' ? 'Phân hạng' : 'Qualifying'}</span>
              <span className="text-xs font-bold text-studio-900 block">Fri 25 Sep</span>
              <span className="text-[10px] font-bold text-f1red">16:00 AZT</span>
            </div>
            <div className="p-3 rounded-xl bg-studio-900 text-white text-center min-w-[90px] shadow-sm">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">Grand Prix</span>
              <span className="text-xs font-bold text-white block">Sat 26 Sep</span>
              <span className="text-[10px] text-studio-300">15:00 AZT</span>
            </div>

            <button
              onClick={() => { setActiveTab('championship'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="p-3 rounded-xl border border-studio-300 hover:border-f1red text-studio-700 hover:text-f1red transition-colors text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ml-2 cursor-pointer"
            >
              <span>{lang === 'vi' ? 'Lịch Chi Tiết' : 'Full Schedule'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── 3. Championship Standings (Official Verified Data) ── */}
      <section className="page-container space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-f1red">
                FIA Formula 1 World Championship
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> {lang === 'vi' ? 'Nguồn chính thức FIA' : 'Official FIA Data'}
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-wide text-studio-950">
              {lang === 'vi' ? `Bảng Xếp Hạng Điểm Số (${standingsSeason})` : `Championship Standings (${standingsSeason})`}
            </h2>
            <p className="text-xs text-studio-500 font-medium">
              {currentStandings.status === 'ongoing'
                ? (lang === 'vi'
                    ? `● Mùa giải đang diễn ra · Điểm số chính thức F1 hiện tại (cập nhật ${currentStandings.lastUpdated})`
                    : `● Season in progress · Official F1 standings (updated ${currentStandings.lastUpdated})`)
                : (lang === 'vi'
                    ? `✓ Kết quả chung cuộc mùa giải chính thức từ FIA / Formula 1`
                    : `✓ Official FIA / Formula 1 season final classification`)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Season Switcher on Home */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-studio-200 shadow-xs">
              {([2026, 2025, 2024] as SeasonYear[]).map((season) => (
                <button
                  key={season}
                  onClick={() => setStandingsSeason(season)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    standingsSeason === season
                      ? 'bg-f1red text-white shadow-xs'
                      : 'text-studio-600 hover:text-studio-950'
                  }`}
                >
                  {season} {season === 2026 ? (lang === 'vi' ? '(Đang đấu)' : '(Live)') : (lang === 'vi' ? '(Chung cuộc)' : '(Final)')}
                </button>
              ))}
            </div>

            <button
              onClick={() => { setActiveTab('championship'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-xs font-bold uppercase tracking-wider text-f1red hover:underline flex items-center gap-1 shrink-0"
            >
              <span>{strings.viewStandings}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top 3 Drivers */}
          <div className="bg-white rounded-xl border border-studio-200 shadow-subtle p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-studio-100">
              <h3 className="font-display text-base font-bold uppercase tracking-wider text-studio-900 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" /> {lang === 'vi' ? 'Bảng Điểm Tay Đua (Top 3)' : 'Drivers Championship (Top 3)'}
              </h3>
              <span className="text-xs font-semibold text-studio-500">{lang === 'vi' ? `Mùa giải ${standingsSeason}` : `${standingsSeason} Season`}</span>
            </div>

            <div className="space-y-3">
              {topDrivers.map((driver) => (
                <div
                  key={driver.driverId}
                  className="flex items-center justify-between p-3 rounded-lg bg-studio-50 border border-studio-200 hover:bg-studio-100/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-display font-black text-xs ${
                        driver.rank === 1
                          ? 'bg-amber-400 text-black shadow-xs'
                          : driver.rank === 2
                          ? 'bg-studio-300 text-studio-900'
                          : 'bg-amber-700 text-white'
                      }`}
                    >
                      {driver.rank}
                    </span>
                    <div>
                      <span className="font-bold text-sm text-studio-900 block">
                        {driver.driverName} {driver.countryFlag}
                      </span>
                      <span className="text-xs text-studio-500">{driver.teamName}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-display font-black text-base text-f1red block">
                      {driver.points} PTS
                    </span>
                    <span className="text-[10px] text-studio-400">{driver.wins} wins · {driver.podiums} podiums</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 3 Constructors */}
          <div className="bg-white rounded-xl border border-studio-200 shadow-subtle p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-studio-100">
              <h3 className="font-display text-base font-bold uppercase tracking-wider text-studio-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-f1red" /> {lang === 'vi' ? 'Bảng Điểm Đội Đua (Top 3)' : 'Constructors Championship (Top 3)'}
              </h3>
              <span className="text-xs font-semibold text-studio-500">{lang === 'vi' ? `Mùa giải ${standingsSeason}` : `${standingsSeason} Season`}</span>
            </div>

            <div className="space-y-3">
              {topConstructors.map((c) => {
                const team = TEAMS_DATA[c.teamId];
                return (
                  <div
                    key={c.teamId}
                    className="flex items-center justify-between p-3 rounded-lg bg-studio-50 border border-studio-200 hover:bg-studio-100/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-display font-black text-xs ${
                          c.rank === 1
                            ? 'bg-amber-400 text-black shadow-xs'
                            : c.rank === 2
                            ? 'bg-studio-300 text-studio-900'
                            : 'bg-amber-700 text-white'
                        }`}
                      >
                        {c.rank}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: team?.primaryColor || '#999' }}
                          />
                          <span className="font-bold text-sm text-studio-900 block">
                            {c.teamName}
                          </span>
                        </div>
                        <span className="text-xs text-studio-500">{c.engine} Power Unit</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-display font-black text-base text-f1red block">
                        {c.points} PTS
                      </span>
                      <span className="text-[10px] text-studio-400">{c.wins} wins · {c.podiums} podiums</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Community Most Loved Showcase (Auto-sliding Carousel) ── */}
      <MostLovedShowcase />
    </div>
  );
};
