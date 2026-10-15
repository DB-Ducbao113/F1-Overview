type YieldingScheduler = { yield?: () => Promise<void> };

/** Yield between expensive procedural texture generators. */
export const yieldToMain = async (): Promise<void> => {
  const taskScheduler = (globalThis as typeof globalThis & { scheduler?: YieldingScheduler })
    .scheduler;
  if (typeof taskScheduler?.yield === 'function') {
    await taskScheduler.yield();
    return;
  }

  await new Promise<void>((resolve) => setTimeout(resolve, 0));
};
