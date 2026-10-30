import { TeamId } from '../../../types';
import { DRIVER_STANDINGS_2026 } from '../../../data/championship/standings';
import { IDriverNormalizer } from './contracts/domainContracts';

/**
 * PURE DOMAIN: DRIVER NORMALIZATION & METADATA
 *
 * Provides authoritative mapping between external timing/Jolpica IDs,
 * canonical driver identifiers, and locked team representations.
 *
 * Pure TypeScript — zero dependencies on React, Zustand, DOM, fetch or localStorage.
 */

export const DRIVER_METADATA: Record<
  string,
  { code: string; flag: string; teamId: TeamId; teamName: string }
> = {
  verstappen: { code: 'VER', flag: '🇳🇱', teamId: 'redbull', teamName: 'Oracle Red Bull Racing' },
  perez: { code: 'PER', flag: '🇲🇽', teamId: 'redbull', teamName: 'Oracle Red Bull Racing' },
  leclerc: { code: 'LEC', flag: '🇲🇨', teamId: 'ferrari', teamName: 'Scuderia Ferrari HP' },
  sainz: { code: 'SAI', flag: '🇪🇸', teamId: 'williams', teamName: 'Williams Racing' },
  norris: { code: 'NOR', flag: '🇬🇧', teamId: 'mclaren', teamName: 'McLaren Formula 1 Team' },
  piastri: { code: 'PIA', flag: '🇦🇺', teamId: 'mclaren', teamName: 'McLaren Formula 1 Team' },
  hamilton: { code: 'HAM', flag: '🇬🇧', teamId: 'ferrari', teamName: 'Scuderia Ferrari HP' },
  russell: { code: 'RUS', flag: '🇬🇧', teamId: 'mercedes', teamName: 'Mercedes-AMG PETRONAS F1' },
  antonelli: { code: 'ANT', flag: '🇮🇹', teamId: 'mercedes', teamName: 'Mercedes-AMG PETRONAS F1' },
  alonso: { code: 'ALO', flag: '🇪🇸', teamId: 'astonmartin', teamName: 'Aston Martin Aramco F1' },
  stroll: { code: 'STR', flag: '🇨🇦', teamId: 'astonmartin', teamName: 'Aston Martin Aramco F1' },
  gasly: { code: 'GAS', flag: '🇫🇷', teamId: 'alpine', teamName: 'BWT Alpine F1 Team' },
  doohan: { code: 'DOO', flag: '🇦🇺', teamId: 'alpine', teamName: 'BWT Alpine F1 Team' },
  albon: { code: 'ALB', flag: '🇹🇭', teamId: 'williams', teamName: 'Williams Racing' },
  tsunoda: { code: 'TSU', flag: '🇯🇵', teamId: 'racingbulls', teamName: 'Visa Cash App RB F1' },
  hadjar: { code: 'HAD', flag: '🇫🇷', teamId: 'racingbulls', teamName: 'Visa Cash App RB F1' },
  hulkenberg: { code: 'HUL', flag: '🇩🇪', teamId: 'audi', teamName: 'Audi Formula 1 Team' },
  bortoleto: { code: 'BOR', flag: '🇧🇷', teamId: 'audi', teamName: 'Audi Formula 1 Team' },
  bearman: { code: 'BEA', flag: '🇬🇧', teamId: 'haas', teamName: 'MoneyGram Haas F1 Team' },
  ocon: { code: 'OCO', flag: '🇫🇷', teamId: 'haas', teamName: 'MoneyGram Haas F1 Team' },
  lawson: { code: 'LAW', flag: '🇳🇿', teamId: 'redbull', teamName: 'Oracle Red Bull Racing' },
  colapinto: { code: 'COL', flag: '🇦🇷', teamId: 'williams', teamName: 'Williams Racing' },
  ricciardo: { code: 'RIC', flag: '🇦🇺', teamId: 'racingbulls', teamName: 'Visa Cash App RB F1' },
  magnussen: { code: 'MAG', flag: '🇩🇰', teamId: 'haas', teamName: 'MoneyGram Haas F1 Team' },
  bottas: { code: 'BOT', flag: '🇫🇮', teamId: 'audi', teamName: 'Kick Sauber F1 Team' },
  zhou: { code: 'ZHO', flag: '🇨🇳', teamId: 'audi', teamName: 'Kick Sauber F1 Team' },
  sargeant: { code: 'SAR', flag: '🇺🇸', teamId: 'williams', teamName: 'Williams Racing' },
};

/**
 * Authoritative locked team mapping to guarantee accuracy against corrupt/external entries.
 */
export const LOCKED_DRIVERS: Record<string, { teamId: TeamId; teamName: string }> = {
  piastri: { teamId: 'mclaren', teamName: 'McLaren' },
  norris: { teamId: 'mclaren', teamName: 'McLaren' },
  russell: { teamId: 'mercedes', teamName: 'Mercedes' },
  antonelli: { teamId: 'mercedes', teamName: 'Mercedes' },
  hamilton: { teamId: 'ferrari', teamName: 'Ferrari' },
  leclerc: { teamId: 'ferrari', teamName: 'Ferrari' },
  verstappen: { teamId: 'redbull', teamName: 'Red Bull' },
  hadjar: { teamId: 'redbull', teamName: 'Red Bull' },
  lawson: { teamId: 'racingbulls', teamName: 'Racing Bulls' },
  lindblad: { teamId: 'racingbulls', teamName: 'Racing Bulls' },
  gasly: { teamId: 'alpine', teamName: 'Alpine F1 Team' },
  colapinto: { teamId: 'alpine', teamName: 'Alpine F1 Team' },
  bearman: { teamId: 'haas', teamName: 'Haas F1 Team' },
  ocon: { teamId: 'haas', teamName: 'Haas F1 Team' },
  hulkenberg: { teamId: 'audi', teamName: 'Audi' },
  bortoleto: { teamId: 'audi', teamName: 'Audi' },
  alonso: { teamId: 'astonmartin', teamName: 'Aston Martin' },
  stroll: { teamId: 'astonmartin', teamName: 'Aston Martin' },
  sainz: { teamId: 'williams', teamName: 'Williams' },
  albon: { teamId: 'williams', teamName: 'Williams' },
  bottas: { teamId: 'cadillac', teamName: 'Cadillac F1 Team' },
  perez: { teamId: 'cadillac', teamName: 'Cadillac F1 Team' },
};

export const DRIVER_MAP: Record<string, string> = {
  max_verstappen: 'verstappen',
  arvid_lindblad: 'lindblad',
};

export const CANONICAL_DRIVER_IDS = new Set(DRIVER_STANDINGS_2026.map((driver) => driver.driverId));

/**
 * Normalizes external Jolpica driver IDs (e.g. "max_verstappen" or "arvid_lindblad")
 * to canonical driver keys used in standings ("verstappen", "lindblad").
 */
export function normalizeDriverId(driverId: string | undefined): string {
  if (!driverId) return 'unknown';
  if (DRIVER_MAP[driverId]) return DRIVER_MAP[driverId];

  const surname = driverId.split('_').pop();
  return surname && CANONICAL_DRIVER_IDS.has(surname) ? surname : driverId;
}

/**
 * Pure Domain Normalizer implementing IDriverNormalizer contract.
 */
export const driverNormalizer: IDriverNormalizer = {
  normalize(rawDriverId: string | undefined): string {
    return normalizeDriverId(rawDriverId);
  },
};
