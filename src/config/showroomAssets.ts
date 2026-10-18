const flag = import.meta.env.VITE_USE_ORIGINAL_CHASSIS;

export const USE_ORIGINAL_CHASSIS = flag !== 'false';
export const ACTIVE_SHOWROOM_MODEL = USE_ORIGINAL_CHASSIS
  ? '/models/eds-g01.glb'
  : '/models/c42.v2.glb';
