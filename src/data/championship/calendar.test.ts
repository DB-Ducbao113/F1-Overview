import { describe, it, expect } from 'vitest';
import { CALENDAR_2026 } from './calendar';

describe('2026 Race Calendar Weekend Sessions Completeness', () => {
  it('ensures every non-sprint round has full 5 sessions (FP1, FP2, FP3, Qualifying, Race)', () => {
    const nonSprintRounds = CALENDAR_2026.filter((gp) => !gp.hasSprint);
    expect(nonSprintRounds.length).toBeGreaterThan(0);

    nonSprintRounds.forEach((gp) => {
      expect(gp.sessions.fp1).toBeDefined();
      expect(gp.sessions.fp2).toBeDefined();
      expect(gp.sessions.fp3).toBeDefined();
      expect(gp.sessions.qualifying).toBeDefined();
      expect(gp.sessions.race).toBeDefined();

      expect(gp.sessions.fp1.name).toBe('Practice 1');
      expect(gp.sessions.fp2?.name).toBe('Practice 2');
      expect(gp.sessions.fp3?.name).toBe('Practice 3');
      expect(gp.sessions.qualifying.name).toBe('Qualifying');
      expect(gp.sessions.race.name).toMatch(/Race/);
    });
  });

  it('ensures every sprint round has full 5 sessions (FP1, Sprint Quali, Sprint, Qualifying, Race)', () => {
    const sprintRounds = CALENDAR_2026.filter((gp) => gp.hasSprint);
    expect(sprintRounds.length).toBe(8);

    sprintRounds.forEach((gp) => {
      expect(gp.sessions.fp1).toBeDefined();
      expect(gp.sessions.sprintQualifying).toBeDefined();
      expect(gp.sessions.sprint).toBeDefined();
      expect(gp.sessions.qualifying).toBeDefined();
      expect(gp.sessions.race).toBeDefined();
    });
  });

  it('verifies round 1 (Albert Park) has all 3 practice sessions properly configured', () => {
    const r1 = CALENDAR_2026.find((gp) => gp.round === 1)!;
    expect(r1).toBeDefined();
    expect(r1.sessions.fp1.dateStr).toBe('Fri 06 Mar');
    expect(r1.sessions.fp2?.dateStr).toBe('Fri 06 Mar');
    expect(r1.sessions.fp3?.dateStr).toBe('Sat 07 Mar');
    expect(r1.sessions.fp1.status).toBe('finished');
    expect(r1.sessions.fp2?.status).toBe('finished');
    expect(r1.sessions.fp3?.status).toBe('finished');
  });
});
