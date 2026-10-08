import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveSession } from '../../hooks/live/useLiveSession';
import { useNavigationStore } from '../../store/useNavigationStore';
import { Radio, ArrowRight, Clock, RotateCcw } from 'lucide-react';

export const HomeLiveStrip: React.FC = () => {
  const { lang } = useNavigationStore();
  const navigate = useNavigate();
  const { data: sessionData } = useLiveSession();

  const state = sessionData?.state || 'replay';
  const session = sessionData?.session;

  return (
    <section className="page-container -mt-8 sm:-mt-10 relative z-30">
      <div className="bg-[#0b0b12]/95 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 sm:py-3.5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
        {/* Left Status & Session Info */}
        <div className="flex items-center gap-3">
          {state === 'live' ? (
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
          ) : state === 'upcoming' ? (
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
            </span>
          ) : (
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
            </span>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-display font-black uppercase tracking-wider text-white">
              {state === 'live'
                ? lang === 'vi'
                  ? 'PHIÊN ĐUA ĐANG DIỄN RA'
                  : 'LIVE SESSION IN PROGRESS'
                : state === 'upcoming'
                ? lang === 'vi'
                  ? 'CHẶNG ĐUA TIẾP THEO'
                  : 'UPCOMING SESSION'
                : lang === 'vi'
                ? 'F1 LIVE CENTER'
                : 'F1 LIVE CENTER'}
            </span>

            <span className="text-studio-500 hidden sm:inline">|</span>

            <span className="text-studio-300 font-medium">
              {session?.session_name || 'Grand Prix'}{' '}
              {session?.circuit_short_name ? `· ${session.circuit_short_name}` : ''}
            </span>
          </div>
        </div>

        {/* Right Action CTA */}
        <button
          onClick={() => navigate('/live')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-f1red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 shadow-md shadow-f1red/20 cursor-pointer shrink-0"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>
            {state === 'live'
              ? lang === 'vi'
                ? 'Xem Trực Tiếp Live'
                : 'Watch Live Now'
              : lang === 'vi'
              ? 'Mở Live Center'
              : 'Open Live Center'}
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
