const flag = import.meta.env.VITE_USE_ORIGINAL_CHASSIS;

// Legacy geometry is a local-development comparison aid only. Production builds
// must stay on EDS-G01 even if a stale environment variable requests rollback.
export const USE_ORIGINAL_CHASSIS = !(import.meta.env.DEV && flag === 'false');
export const ACTIVE_SHOWROOM_MODEL = USE_ORIGINAL_CHASSIS
  ? '/models/eds-g01.glb'
  : '/models/c42.v2.glb';
