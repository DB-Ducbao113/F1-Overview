import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigationStore } from '../../store/useNavigationStore';
import { Radio, Play, Pause } from 'lucide-react';
import { CALENDAR_2026 } from '../../data/championship/calendar';
import { DRIVER_STANDINGS_2026 } from '../../data/championship/standings';
import {
  getCalendarRaceState,
  getSessionTimeRange,
  RaceSessionKey,
} from '../../utils/raceSchedule';

export const F1NewsTicker: React.FC = () => {
  const { lang } = useNavigationStore();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(interval);
  }, []);
  const nextSession = CALENDAR_2026.flatMap((race) =>
    (Object.keys(race.sessions) as RaceSessionKey[]).flatMap((sessionKey) => {
      const range = getSessionTimeRange(race, sessionKey);
      const session = race.sessions[sessionKey];
      return range && session && range.start.getTime() > now
        ? [{ race, session, sessionKey, start: range.start }]
        : [];
    }),
  ).sort((a, b) => a.start.getTime() - b.start.getTime())[0];
  const completedRounds = CALENDAR_2026.filter(
    (race) => getCalendarRaceState(race, now) === 'completed',
  ).length;
  const antonelliPoints = DRIVER_STANDINGS_2026.find(
    (driver) => driver.driverId === 'antonelli',
  )?.points;
  const nextSessionTime = nextSession
    ? new Intl.DateTimeFormat(lang === 'vi' ? 'vi-VN' : 'en-US', {
        timeZone: 'Asia/Ho_Chi_Minh',
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }).format(nextSession.start)
    : '';
  const sessionShortName: Record<RaceSessionKey, string> = {
    fp1: 'FP1',
    fp2: 'FP2',
    fp3: 'FP3',
    sprintQualifying: 'SPRINT QUALI',
    sprint: 'SPRINT',
    qualifying: 'QUALIFYING',
    race: 'RACE',
  };
  const nextRaceName = nextSession?.race.name.replace(' Grand Prix', ' GP');

  const TICKER_ITEMS = [
    {
      badge: nextSession
        ? lang === 'vi'
          ? 'SẮP DIỄN RA'
          : 'NEXT UP'
        : lang === 'vi'
          ? 'MÙA GIẢI'
          : 'SEASON',
      text:
        nextSession && nextRaceName
          ? lang === 'vi'
            ? `CHẶNG ${nextSession.race.round} ${nextRaceName.toUpperCase()} · ${sessionShortName[nextSession.sessionKey]} ${nextSessionTime} GIỜ VIỆT NAM`
            : `ROUND ${nextSession.race.round} ${nextRaceName.toUpperCase()} · ${sessionShortName[nextSession.sessionKey]} ${nextSessionTime} VIETNAM TIME`
          : lang === 'vi'
            ? 'MÙA GIẢI ĐÃ KẾT THÚC'
            : 'SEASON COMPLETE',
      link: '/season/2026?tab=calendar',
    },
    {
      badge: lang === 'vi' ? 'KẾT QUẢ' : 'LATEST',
      text:
        lang === 'vi'
          ? 'CHẶNG 17 SINGAPORE GP: VERSTAPPEN P1 · LECLERC P2 · ANTONELLI P3'
          : 'ROUND 17 SINGAPORE GP: VERSTAPPEN P1 · LECLERC P2 · ANTONELLI P3',
      link: '/season/2026?tab=results',
    },
    {
      badge: lang === 'vi' ? 'TIẾN TRÌNH' : 'PROGRESS',
      text:
        lang === 'vi'
          ? `MÙA GIẢI F1 2026: ${completedRounds} / ${CALENDAR_2026.length} CHẶNG ĐÃ HOÀN THÀNH`
          : `2026 FIA F1 SEASON: ${completedRounds} OF ${CALENDAR_2026.length} ROUNDS COMPLETED`,
      link: '/season/2026?tab=calendar',
    },
    {
      badge: lang === 'vi' ? 'DẪN ĐẦU' : 'LEADER',
      text:
        lang === 'vi'
          ? `BẢNG XẾP HẠNG TAY ĐUA: ANTONELLI (MERCEDES) ${antonelliPoints} ĐIỂM`
          : `DRIVERS CLASSIFICATION: ANTONELLI (MERCEDES) ${antonelliPoints} PTS`,
      link: '/season/2026?tab=drivers',
    },
  ];

  return (
    <div className="w-full h-9 bg-[#050508] border-b border-white/10 overflow-hidden flex items-center select-none text-white relative z-40">
      {/* Static Label on Left with interactive Play/Pause toggle */}
      <div className="h-full px-3 bg-f1red flex items-center gap-2 shrink-0 z-20 shadow-md">
        <Radio className="w-3.5 h-3.5 text-white animate-pulse" />
        <span className="font-display font-black text-[11px] tracking-widest uppercase text-white">
          F1 FEED
        </span>
        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          className="ml-0.5 p-1 rounded hover:bg-black/25 text-white/90 hover:text-white transition-colors cursor-pointer"
          title={
            isPlaying
              ? lang === 'vi'
                ? 'Tạm dừng chạy chữ'
                : 'Pause ticker'
              : lang === 'vi'
                ? 'Tiếp tục chạy chữ'
                : 'Resume ticker'
          }
          aria-label={isPlaying ? 'Pause feed' : 'Resume feed'}
        >
          {isPlaying ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
        </button>
      </div>

      {/* Marquee Content Track */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div
          style={{
            animationPlayState: isPlaying ? 'running' : 'paused',
          }}
          className="flex shrink-0 w-max items-center whitespace-nowrap animate-ticker-marquee will-change-transform hover:[animation-play-state:paused]"
        >
          {/* Quadrupled items for guaranteed seamless infinite loop across all viewport widths */}
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <div
              key={idx}
              onClick={() => item.link && navigate(item.link)}
              className="inline-flex shrink-0 items-center text-xs tracking-wider font-semibold cursor-pointer group px-2 py-1"
            >
              <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-bold text-amber-400 mr-2 group-hover:bg-amber-400 group-hover:text-black transition-colors">
                {item.badge}
              </span>
              <span className="text-studio-200 group-hover:text-white transition-colors">
                {item.text}
              </span>
              <span className="text-f1red font-black px-4 select-none tracking-widest">///</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
