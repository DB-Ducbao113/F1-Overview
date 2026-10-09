import React, { useCallback, useEffect, useRef, useState } from 'react';
import { START_LIGHT_TIMING } from './startLightsTiming';

export const F1StartLightsPreloader: React.FC = () => {
  const [stage, setStage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const dismissTimerRef = useRef<number | null>(null);

  const dismiss = useCallback(() => {
    setStage(7);
    if (dismissTimerRef.current !== null) window.clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = window.setTimeout(
      () => setIsVisible(false),
      START_LIGHT_TIMING.fadeDurationMs,
    );
  }, []);

  useEffect(() => {
    const timeouts: number[] = [];
    [1, 2, 3, 4, 5].forEach((light, index) => {
      timeouts.push(
        window.setTimeout(() => setStage(light), START_LIGHT_TIMING.lightIntervalMs * (index + 1)),
      );
    });
    timeouts.push(window.setTimeout(() => setStage(6), START_LIGHT_TIMING.lightsOutMs));
    timeouts.push(window.setTimeout(dismiss, START_LIGHT_TIMING.fadeStartMs));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === ' ') dismiss();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
      if (dismissTimerRef.current !== null) window.clearTimeout(dismissTimerRef.current);
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
      data-stage={stage}
      className={`fixed inset-0 z-[100] flex select-none flex-col items-center justify-center bg-[#050508] transition-[opacity,transform] duration-[400ms] motion-reduce:transition-none ${
        isFading ? 'pointer-events-none scale-105 opacity-0' : 'scale-100 opacity-100'
      }`}
    >
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-6 top-6 flex cursor-pointer items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/60 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white motion-reduce:transition-none"
      >
        <span>Bỏ qua / Skip</span>
        <span className="text-[10px] text-white/40">(Esc)</span>
      </button>

      <div className="flex w-full max-w-md flex-col items-center space-y-8 px-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-f1red motion-reduce:animate-none" />
          <span className="font-display text-xs font-black uppercase tracking-widest text-studio-400 sm:text-sm">
            FIA Formula 1 World Championship
          </span>
        </div>

        <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#0d0e14] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] sm:gap-5 sm:p-6">
          {[1, 2, 3, 4, 5].map((lightIndex) => {
            const isLightOn = stage >= lightIndex && stage < 6;
            return (
              <div
                key={lightIndex}
                className="flex flex-col items-center space-y-2 rounded-xl border border-white/5 bg-[#08090d] p-2 shadow-inner"
              >
                {[0, 1].map((lamp) => (
                  <span
                    key={lamp}
                    data-testid="start-light"
                    className={`h-8 w-8 rounded-full transition-[background-color,box-shadow,transform] duration-100 motion-reduce:transition-none sm:h-11 sm:w-11 ${
                      isLightOn
                        ? 'scale-105 bg-[#ff1801] shadow-[0_0_20px_#ff1801,0_0_45px_rgba(255,24,1,0.8)] ring-2 ring-white/50'
                        : 'border border-red-950/40 bg-[#150606] shadow-inner'
                    }`}
                  />
                ))}
              </div>
            );
          })}
        </div>

        <div className="flex h-10 items-center justify-center text-center" aria-live="polite">
          {isLightsOut ? (
            <span className="animate-lights-out-jolt font-display text-lg font-black uppercase italic tracking-wider text-white sm:text-xl">
              IT&apos;S LIGHTS OUT AND AWAY WE GO! 🏁
            </span>
          ) : stage > 0 && stage <= 5 ? (
            <span className="font-display text-xs font-bold uppercase tracking-widest text-studio-400">
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
