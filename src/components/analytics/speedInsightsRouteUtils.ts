export interface SpeedInsightEvent {
  type: 'vital';
  url: string;
  route?: string;
}

export function stripQueryAndHash(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return url.split(/[?#]/, 1)[0];
  }
}
