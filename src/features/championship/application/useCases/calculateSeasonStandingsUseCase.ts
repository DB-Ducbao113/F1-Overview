import {
  ConstructorStanding,
  DetailedRaceResult,
  DriverStanding,
  SeasonYear,
} from '../../../../types';
import {
  CONSTRUCTOR_STANDINGS_2024,
  CONSTRUCTOR_STANDINGS_2025,
  CONSTRUCTOR_STANDINGS_2026,
  DRIVER_STANDINGS_2024,
  DRIVER_STANDINGS_2025,
  DRIVER_STANDINGS_2026,
} from '../../../../data/championship/standings';
import { BASELINE_CUTOFF_BY_SEASON } from '../../../../data/championship/baselineCutoff';
import { recalculateStandingsFromRaces } from '../../domain';
import {
  ICalculateSeasonStandingsUseCase,
  StandingsCalculationResult,
} from '../contracts/applicationContracts';

export const BASE_DRIVER_STANDINGS: Record<SeasonYear, DriverStanding[]> = {
  2024: DRIVER_STANDINGS_2024,
  2025: DRIVER_STANDINGS_2025,
  2026: DRIVER_STANDINGS_2026,
};

export const BASE_CONSTRUCTOR_STANDINGS: Record<SeasonYear, ConstructorStanding[]> = {
  2024: CONSTRUCTOR_STANDINGS_2024,
  2025: CONSTRUCTOR_STANDINGS_2025,
  2026: CONSTRUCTOR_STANDINGS_2026,
};

export class CalculateSeasonStandingsUseCase implements ICalculateSeasonStandingsUseCase {
  execute(
    season: SeasonYear,
    races: DetailedRaceResult[],
    baseDrivers?: DriverStanding[],
    baseConstructors?: ConstructorStanding[],
  ): StandingsCalculationResult {
    const drivers = baseDrivers ?? BASE_DRIVER_STANDINGS[season] ?? [];
    const constructors = baseConstructors ?? BASE_CONSTRUCTOR_STANDINGS[season] ?? [];

    return recalculateStandingsFromRaces(season, races, drivers, constructors);
  }

  computeAllInitialStandings(
    resultsMap: Record<SeasonYear, DetailedRaceResult[]>,
  ): Record<SeasonYear, StandingsCalculationResult> {
    const out: Record<SeasonYear, StandingsCalculationResult> = {
      2024: { drivers: DRIVER_STANDINGS_2024, constructors: CONSTRUCTOR_STANDINGS_2024 },
      2025: { drivers: DRIVER_STANDINGS_2025, constructors: CONSTRUCTOR_STANDINGS_2025 },
      2026: { drivers: DRIVER_STANDINGS_2026, constructors: CONSTRUCTOR_STANDINGS_2026 },
    };

    try {
      const races2026 = resultsMap?.[2026];
      const cutoff2026 = BASELINE_CUTOFF_BY_SEASON[2026].completedRounds;
      if (
        Array.isArray(races2026) &&
        races2026.some(
          (r) =>
            r &&
            !r.isSynthesized &&
            r.round > cutoff2026 &&
            (r.status === 'completed' || (r.sprintEntries?.length || 0) > 0),
        )
      ) {
        out[2026] = this.execute(
          2026,
          races2026,
          BASE_DRIVER_STANDINGS[2026],
          BASE_CONSTRUCTOR_STANDINGS[2026],
        );
      }
    } catch (err) {
      console.warn('Initial standings compute error, using base standings:', err);
    }

    return out;
  }
}

export const calculateSeasonStandingsUseCase = new CalculateSeasonStandingsUseCase();
