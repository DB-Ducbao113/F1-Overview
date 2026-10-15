import { afterEach, describe, expect, it, vi } from 'vitest';
import { yieldToMain } from './showroomTaskScheduler';

type GlobalWithScheduler = typeof globalThis & {
  scheduler?: { yield?: () => Promise<void> };
};

const runtime = globalThis as GlobalWithScheduler;
const originalScheduler = runtime.scheduler;

describe('showroomTaskScheduler', () => {
  afterEach(() => {
    vi.useRealTimers();
    if (originalScheduler) runtime.scheduler = originalScheduler;
    else delete runtime.scheduler;
  });

  it('uses scheduler.yield when the browser exposes it', async () => {
    const schedulerYield = vi.fn(async () => undefined);
    runtime.scheduler = { yield: schedulerYield };

    await yieldToMain();

    expect(schedulerYield).toHaveBeenCalledTimes(1);
  });

  it('falls back to a later task when scheduler.yield is unavailable', async () => {
    vi.useFakeTimers();
    delete runtime.scheduler;
    let settled = false;
    const pending = yieldToMain().then(() => {
      settled = true;
    });

    await Promise.resolve();
    expect(settled).toBe(false);
    await vi.runAllTimersAsync();
    await pending;
    expect(settled).toBe(true);
  });
});
