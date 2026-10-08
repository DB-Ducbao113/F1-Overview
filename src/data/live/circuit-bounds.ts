import { CircuitBounds } from '../../lib/live/openf1-types';

/**
 * Pre-calibrated bounding boxes and orientation flags for official F1 circuits.
 * Keyed by OpenF1 circuit_key.
 *
 * Coordinates are based on real-world meter bounding boxes extracted from
 * OpenF1 historical sessions (2023-2025).
 */
export const CIRCUIT_BOUNDS: Record<number, CircuitBounds> = {
  // Albert Park Circuit, Melbourne (Australia) - Key 10
  // Verified from Australia 2024 (session_key 9488) & Australia 2025 (session_key 9693)
  10: {
    minX: -2600,
    maxX: 2450,
    minY: -1900,
    maxY: 1850,
  },

  // Marina Bay Street Circuit, Singapore - Key 61
  61: {
    minX: -1650,
    maxX: 2100,
    minY: -1400,
    maxY: 1950,
  },

  // Suzuka International Racing Course, Japan - Key 46
  46: {
    minX: -2100,
    maxX: 2300,
    minY: -2200,
    maxY: 1900,
  },

  // Circuit de Monaco, Monte Carlo - Key 22
  22: {
    minX: -1150,
    maxX: 1350,
    minY: -950,
    maxY: 1100,
  },

  // Bahrain International Circuit, Sakhir - Key 63
  63: {
    minX: -2200,
    maxX: 2150,
    minY: -1800,
    maxY: 1950,
  },

  // Circuit de Spa-Francorchamps, Belgium - Key 7
  7: {
    minX: -3200,
    maxX: 3100,
    minY: -2600,
    maxY: 2800,
  },

  // Autodromo Nazionale Monza, Italy - Key 39
  39: {
    minX: -2500,
    maxX: 2700,
    minY: -2900,
    maxY: 2600,
  },
};

/**
 * Get calibrated bounds for a circuit or return null if calibration needed
 */
export function getCalibratedBounds(circuitKey?: number): CircuitBounds | null {
  if (!circuitKey || !CIRCUIT_BOUNDS[circuitKey]) {
    return null;
  }
  return CIRCUIT_BOUNDS[circuitKey];
}
