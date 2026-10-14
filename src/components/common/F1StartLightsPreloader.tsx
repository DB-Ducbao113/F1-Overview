import React, { useCallback, useEffect, useState } from 'react';
import { getStartLightsFrame, START_LIGHT_TIMING } from './startLightsTiming';
import './F1StartLightsPreloader.css';

const INTRO_SESSION_KEY = 'podium:start-lights-seen';

export const F1StartLightsPreloader: React.FC = () => {
  const [shouldPlay] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      window.sessionStorage.getItem(INTRO_SESSION_KEY) !== 'true';
  });
  const [frame, setFrame] = useState(() => getStartLightsFrame(0));
  const [dismissed, setDismissed] = useState(!shouldPlay);
  const [startedAt] = useState(() => performance.now());
  const dismiss = useCallback(() => {
    window.sessionStorage.setItem(INTRO_SESSION_KEY, 'true');
    setDismissed(true);
  }, []);
  const visible = shouldPlay && !dismissed && frame.phase !== 'complete';

  useEffect(() => {
    if (!visible) return;
    const update = () => setFrame(getStartLightsFrame(performance.now() - startedAt));
    const deadlines = [
      ...Array.from({ length: 5 }, (_, index) => START_LIGHT_TIMING.firstLightMs + index * START_LIGHT_TIMING.lightIntervalMs),
      START_LIGHT_TIMING.lightsOutMs,
      START_LIGHT_TIMING.totalMs,
    ];
    const timers = deadlines.map((deadline) => window.setTimeout(update, Math.max(0, deadline - (performance.now() - startedAt)) + 1));
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === ' ') {
        event.preventDefault();
        dismiss();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [dismiss, startedAt, visible]);

  if (!visible) return null;

  return (
    <div role="status" aria-label="F1 start lights" className="podium-intro">
      <div className="podium-intro__stage">
        <div className="podium-intro__rack" aria-label={`${frame.litColumns} of 5 red lights on`}>
          {[1, 2, 3, 4, 5].map((column) => (
            <div className="podium-intro__column" key={column}>
              {[0, 1].map((lamp) => (
                <span key={lamp} data-testid="start-light" className={`podium-intro__lamp${column <= frame.litColumns ? ' is-on' : ''}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <button type="button" onClick={dismiss} className="podium-intro__skip">
        Bỏ qua / Skip <span>ESC</span>
      </button>
    </div>
  );
};
