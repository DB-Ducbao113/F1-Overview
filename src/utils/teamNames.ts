import { TEAMS_DATA } from '../data/teams';
import { TeamId } from '../types';
import { resolveTeamId } from './teamColors';

export function getTeamDisplayName(identifier?: string | TeamId): string {
  if (!identifier) return '';
  const teamId = resolveTeamId(identifier);
  return teamId ? TEAMS_DATA[teamId].name : identifier;
}
