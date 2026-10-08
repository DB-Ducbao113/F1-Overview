import { LiveCarPosition } from './openf1-types';

/**
 * Linear interpolation (Lerp) between two numeric values
 */
export function lerp(start: number, end: number, t: number): number {
  const clampedT = Math.max(0, Math.min(1, t));
  return start + (end - start) * clampedT;
}

/**
 * Interpolate car position between previous poll and target poll
 */
export function interpolateCar(
  prev: LiveCarPosition | undefined,
  target: LiveCarPosition,
  t: number
): LiveCarPosition {
  if (!prev) {
    return target;
  }

  return {
    driver_number: target.driver_number,
    x: lerp(prev.x, target.x, t),
    y: lerp(prev.y, target.y, t),
    z: target.z !== undefined && prev.z !== undefined ? lerp(prev.z, target.z, t) : target.z,
    date: target.date,
  };
}

/**
 * Interpolate all cars in fleet
 */
export function interpolateFleet(
  prevMap: Record<number, LiveCarPosition>,
  targetMap: Record<number, LiveCarPosition>,
  t: number
): LiveCarPosition[] {
  return Object.values(targetMap).map((targetCar) => {
    const prevCar = prevMap[targetCar.driver_number];
    return interpolateCar(prevCar, targetCar, t);
  });
}
