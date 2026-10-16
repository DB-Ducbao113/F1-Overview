import { TEAMS_DATA } from '../data/teams';
import { SeasonYear, TeamId } from '../types';
import { resolveTeamId } from './teamColors';

export function getTeamDisplayName(identifier?: string | TeamId, season?: SeasonYear): string {
  if (!identifier) return '';
  const teamId = resolveTeamId(identifier);
  if (teamId === 'audi' && season && season < 2026) return 'Kick Sauber';
  if (teamId === 'racingbulls' && season === 2024) return 'RB';
  return teamId ? TEAMS_DATA[teamId].name : identifier;
}
