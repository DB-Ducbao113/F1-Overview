/**
 * THIN COMPATIBILITY LAYER — STANDINGS ENGINE
 *
 * All pure championship domain logic has been extracted to `src/features/championship/domain/`.
 * This module preserves the public API for existing callers without duplicating business rules.
 */

export { LOCKED_DRIVERS, recalculateStandingsFromRaces } from '../features/championship/domain';
