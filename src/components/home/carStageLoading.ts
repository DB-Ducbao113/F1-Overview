export const INITIAL_CAR_INDEX = 0;

export function getNearbyCarIndexes(index: number, total: number): number[] {
  if (!Number.isInteger(index) || !Number.isInteger(total) || total <= 0) return [];

  const normalized = ((index % total) + total) % total;
  return [...new Set([(normalized - 1 + total) % total, normalized, (normalized + 1) % total])];
}
