import { T as t } from './index-CS6oMniN.js';
import { r as e } from './teamColors-B_bsvcV9.js';
function n(a, m) {
  if (!a) return '';
  const r = e(a);
  return r === 'audi' && m && m < 2026
    ? 'Kick Sauber'
    : r === 'racingbulls' && m === 2024
      ? 'RB'
      : r
        ? t[r].name
        : a;
}
export { n as g };
