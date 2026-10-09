import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigationStore } from '../../store/useNavigationStore';
import { Radio, Play, Pause } from 'lucide-react';

export const F1NewsTicker: React.FC = () => {
  const { lang } = useNavigationStore();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const TICKER_ITEMS = [
    {
      badge: lang === 'vi' ? 'SẮP DIỄN RA' : 'NEXT UP',
      text:
        lang === 'vi'
          ? 'CHẶNG 17 SINGAPORE GP · FP1 THỨ SÁU 15:30 GIỜ VIỆT NAM'
          : 'ROUND 17 SINGAPORE GP · FP1 FRIDAY 15:30 VIETNAM TIME',
      link: '/season/2026?tab=calendar',
    },
    {
      badge: lang === 'vi' ? 'KẾT QUẢ' : 'LATEST',
      text:
        lang === 'vi'
          ? 'CHẶNG 16 SEPANG: VERSTAPPEN P1 · RED BULL RACING CHIẾN THẮNG'
          : 'ROUND 16 SEPANG: VERSTAPPEN P1 · RED BULL RACING TRIUMPH',
      link: '/season/2026?tab=results',
    },
    {
      badge: lang === 'vi' ? 'TIẾN TRÌNH' : 'PROGRESS',
      text:
        lang === 'vi'
          ? 'MÙA GIẢI F1 2026: 17 TRÊN TỔNG SỐ 23 CHẶNG ĐUA'
          : '2026 FIA F1 SEASON: ROUND 17 OF 23 UPCOMING',
      link: '/season/2026?tab=calendar',
    },
    {
      badge: lang === 'vi' ? 'DẪN ĐẦU' : 'LEADER',
      text:
        lang === 'vi'
          ? 'BẢNG XẾP HẠNG TAY ĐUA: ANTONELLI (MERCEDES) 320 ĐIỂM'
          : 'DRIVERS CLASSIFICATION: ANTONELLI (MERCEDES) 320 PTS',
      link: '/season/2026?tab=drivers',
    },
    {
      badge: 'LIVE CENTER',
      text:
        lang === 'vi'
          ? 'THEO DÕI TỌA ĐỘ XE 60FPS VÀ DỮ LIỆU VIỄN TRẮC OPENF1 TẠI /LIVE'
          : 'TRACK MAP 60FPS & REAL OPENF1 TELEMETRY READY AT /LIVE',
      link: '/live',
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
