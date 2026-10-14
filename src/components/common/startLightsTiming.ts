export const START_LIGHT_TIMING = {
  firstLightMs: 120,
  lightIntervalMs: 180,
  holdMs: 1080,
  lightsOutMs: 1260,
  launchMs: 1360,
  totalMs: 1500,
} as const;

export function getStartLightsFrame(elapsedMs: number) {
  const time = Math.max(0, elapsedMs);
  const phase =
    time >= START_LIGHT_TIMING.totalMs
      ? 'complete'
      : time >= START_LIGHT_TIMING.launchMs
        ? 'launch'
        : time >= START_LIGHT_TIMING.lightsOutMs
          ? 'lights-out'
          : time >= START_LIGHT_TIMING.holdMs
            ? 'hold'
            : time >= START_LIGHT_TIMING.firstLightMs
              ? 'pressure'
              : 'awakening';
  const litColumns =
    time < START_LIGHT_TIMING.firstLightMs || time >= START_LIGHT_TIMING.lightsOutMs
      ? 0
      : Math.min(
          5,
          Math.floor(
            (time - START_LIGHT_TIMING.firstLightMs) / START_LIGHT_TIMING.lightIntervalMs,
          ) + 1,
        );

  return { phase, litColumns } as const;
}
