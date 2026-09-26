export type TeamId =
  | 'ferrari'
  | 'mclaren'
  | 'redbull'
  | 'mercedes'
  | 'astonmartin'
  | 'alpine'
  | 'racingbulls'
  | 'haas'
  | 'williams'
  | 'audi'
  | 'cadillac';

export interface F1Team {
  id: TeamId;
  name: string;
  fullName: string;
  base: string;
  teamPrincipal: string;
  powerUnit: string;
  primaryColor: string;
  accentColor: string;
  highlightColor: string;
  logoUrl?: string;
  drivers: string[]; // driver ids
}
