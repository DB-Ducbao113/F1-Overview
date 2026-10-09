import { TeamId } from '../../types';

const marks: Record<TeamId, { code: string; color: string }> = {
  ferrari: { code: 'FER', color: '#dc2626' },
  mclaren: { code: 'MCL', color: '#ff8000' },
  redbull: { code: 'RBR', color: '#2563eb' },
  mercedes: { code: 'MER', color: '#00a19c' },
  astonmartin: { code: 'AMR', color: '#008c76' },
  alpine: { code: 'ALP', color: '#2293d1' },
  racingbulls: { code: 'RB', color: '#4f46e5' },
  haas: { code: 'HAS', color: '#e5e7eb' },
  williams: { code: 'WIL', color: '#0891b2' },
  audi: { code: 'AUD', color: '#ef4444' },
  cadillac: { code: 'CAD', color: '#d4af37' },
};

const makePodiumBadge = ({ code, color }: { code: string; color: string }) => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 240" width="480" height="240">
    <rect x="8" y="8" width="464" height="224" rx="38" fill="#101116" stroke="#ffffff" stroke-opacity=".2" stroke-width="8"/>
    <path d="M36 178 C120 98 180 206 258 116 S390 82 444 54" fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round" opacity=".7"/>
    <text x="240" y="137" text-anchor="middle" font-family="Arial Black, sans-serif" font-style="italic" font-size="82" font-weight="900" letter-spacing="4" fill="#ffffff">${code}</text>
    <rect x="38" y="194" width="404" height="9" rx="4.5" fill="${color}"/>
    <text x="240" y="222" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="6" fill="#ffffff" opacity=".55">PODIUM DATA BADGE</text>
  </svg>`;

/** Original PODIUM text badges. No constructor logo geometry is embedded. */
export const TEAM_LOGO_SVG_STRINGS: Record<TeamId, string> = Object.fromEntries(
  Object.entries(marks).map(([teamId, mark]) => [teamId, makePodiumBadge(mark)]),
) as Record<TeamId, string>;

export const TEAM_BACKDROP_LABEL: Record<TeamId, { headline: string; subtitle: string }> = {
  cadillac: { headline: 'CADILLAC', subtitle: 'PODIUM DATA PROFILE' },
  mclaren: { headline: 'McLAREN', subtitle: 'PODIUM DATA PROFILE' },
  ferrari: { headline: 'FERRARI', subtitle: 'PODIUM DATA PROFILE' },
  mercedes: { headline: 'MERCEDES', subtitle: 'PODIUM DATA PROFILE' },
  redbull: { headline: 'RED BULL RACING', subtitle: 'PODIUM DATA PROFILE' },
  astonmartin: { headline: 'ASTON MARTIN', subtitle: 'PODIUM DATA PROFILE' },
  alpine: { headline: 'ALPINE', subtitle: 'PODIUM DATA PROFILE' },
  racingbulls: { headline: 'RACING BULLS', subtitle: 'PODIUM DATA PROFILE' },
  haas: { headline: 'HAAS', subtitle: 'PODIUM DATA PROFILE' },
  williams: { headline: 'WILLIAMS', subtitle: 'PODIUM DATA PROFILE' },
  audi: { headline: 'AUDI', subtitle: 'PODIUM DATA PROFILE' },
};
