import React, { useState, useEffect, useCallback } from 'react';

export const F1StartLightsPreloader: React.FC = () => {
  const [stage, setStage] = useState<number>(0); // 0: init, 1..5: lights on, 6: lights out, 7: unmount
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const dismiss = useCallback(() => {
    setStage(7);
    setTimeout(() => setIsVisible(false), 400);
  }, []);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setIsVisible(true);

    if (prefersReducedMotion) {
      setStage(6);
      const reducedMotionTimeout = setTimeout(dismiss, 900);
      return () => clearTimeout(reducedMotionTimeout);
    }

    // Sequence of 5 start lights
    const timeouts: any[] = [];
    timeouts.push(setTimeout(() => setStage(1), 350));
    timeouts.push(setTimeout(() => setStage(2), 700));
    timeouts.push(setTimeout(() => setStage(3), 1050));
    timeouts.push(setTimeout(() => setStage(4), 1400));
    timeouts.push(setTimeout(() => setStage(5), 1750));
    // Hold all 5 lights on for ~700ms, then sudden LIGHTS OUT!
    timeouts.push(setTimeout(() => setStage(6), 2450));
    // Reveal main app
    timeouts.push(
      setTimeout(() => {
        dismiss();
      }, 3000),
    );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        dismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dismiss]);

  if (!isVisible) return null;

  const isFading = stage === 7;
  const isLightsOut = stage === 6;

  return (
    <div
      role="dialog"
      aria-label="F1 Start Lights Preloader"
      className={`fixed inset-0 z-[100] bg-[#050508] flex flex-col items-center justify-center select-none transition-all duration-500 ${
        isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Skip button top-right */}
      <button
        onClick={dismiss}
        className="absolute top-6 right-6 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5"
      >
        <span>Bỏ qua / Skip</span>
        <span className="text-[10px] text-white/40">(Esc)</span>
      </button>

      {/* Main Gantry Pod */}
      <div className="flex flex-col items-center space-y-8 max-w-md w-full px-4">
        {/* FIA Official Tag */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-f1red animate-pulse" />
          <span className="font-display font-black text-xs sm:text-sm tracking-widest text-studio-400 uppercase">
            FIA Formula 1 World Championship
          </span>
        </div>

        {/* 5 Lights FIA Gantry Pod */}
        <div className="p-4 sm:p-6 rounded-2xl bg-[#0d0e14] border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center justify-center gap-3 sm:gap-5">
          {[1, 2, 3, 4, 5].map((lightIndex) => {
            const isLightOn = stage >= lightIndex && stage < 6;

            return (
              <div
                key={lightIndex}
                className="flex flex-col items-center p-2 rounded-xl bg-[#08090d] border border-white/5 space-y-2 shadow-inner"
              >
                {/* Upper LED Lamp */}
                <div
                  className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full transition-all duration-100 ${
                    isLightOn
                      ? 'bg-[#ff1801] shadow-[0_0_20px_#ff1801,0_0_45px_rgba(255,24,1,0.8)] ring-2 ring-white/50 scale-105'
                      : 'bg-[#150606] border border-red-950/40 shadow-inner'
                  }`}
                />
                {/* Lower LED Lamp (Classic F1 dual-bulb stack) */}
                <div
                  className={`w-8 h-8 sm:w-11 sm:h-11 rounded-full transition-all duration-100 ${
                    isLightOn
                      ? 'bg-[#ff1801] shadow-[0_0_20px_#ff1801,0_0_45px_rgba(255,24,1,0.8)] ring-2 ring-white/50 scale-105'
                      : 'bg-[#150606] border border-red-950/40 shadow-inner'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Status Text under gantry */}
        <div className="h-10 flex items-center justify-center text-center">
          {isLightsOut ? (
            <span className="font-display font-black text-lg sm:text-xl uppercase italic tracking-wider text-white animate-champion-flash">
              IT&apos;S LIGHTS OUT AND AWAY WE GO! 🏁
            </span>
          ) : stage > 0 && stage <= 5 ? (
            <span className="font-display font-bold text-xs uppercase tracking-widest text-studio-400">
              STAND BY FOR START ({stage}/5)
            </span>
          ) : (
            <span className="font-display text-xs uppercase tracking-widest text-studio-500">
              PREPARING GRID...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
