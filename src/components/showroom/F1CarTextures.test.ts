import { describe, it, expect, vi } from 'vitest';
import { drawCoolingLouvres } from './F1CarTextures';
import { getTeam3DLivery } from '../../data/showroom/teamLiveries';
import { TeamId } from '../../types';

describe('F1CarTextures - drawCoolingLouvres', () => {
  const teams: TeamId[] = [
    'mercedes',
    'ferrari',
    'redbull',
    'mclaren',
    'astonmartin',
    'alpine',
    'williams',
    'racingbulls',
    'audi',
    'haas',
    'cadillac',
  ];

  function createMockContext() {
    const fillRectCalls: Array<{ x: number; y: number; w: number; h: number; fillStyle: unknown }> =
      [];
    const mockGradient = {
      addColorStop: vi.fn(),
    };

    const ctx = {
      fillStyle: '#000000',
      strokeStyle: '#000000',
      lineWidth: 1,
      save: vi.fn(),
      restore: vi.fn(),
      fillRect: vi.fn((x: number, y: number, w: number, h: number) => {
        fillRectCalls.push({ x, y, w, h, fillStyle: ctx.fillStyle });
      }),
      beginPath: vi.fn(),
      closePath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      createLinearGradient: vi.fn(() => mockGradient),
    } as unknown as CanvasRenderingContext2D;

    return { ctx, fillRectCalls, mockGradient };
  }

  teams.forEach((teamId) => {
    it(`renders sidepod cooling louvres and upper decks for ${teamId}`, () => {
      const { ctx, fillRectCalls } = createMockContext();
      const livery = getTeam3DLivery(teamId);

      expect(() => {
        drawCoolingLouvres(ctx, teamId, livery);
      }).not.toThrow();

      // Must draw both upper deck panels and multiple louvre extraction vent banks
      expect(fillRectCalls.length).toBeGreaterThan(50);
      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();

      // Check left deck panel (X: 80, Y: 280, W: 220, H: 720)
      const leftDeck = fillRectCalls.find(
        (call) => call.x === 80 && call.y === 280 && call.w === 220 && call.h === 720,
      );
      expect(leftDeck).toBeDefined();

      // Check right deck panel (X: 1620, Y: 1220, W: 180, H: 700)
      const rightDeck = fillRectCalls.find(
        (call) => call.x === 1620 && call.y === 1220 && call.w === 180 && call.h === 700,
      );
      expect(rightDeck).toBeDefined();
    });
  });

  it('handles unknown team fallback gracefully without throwing', () => {
    const { ctx, fillRectCalls } = createMockContext();
    const fallbackLivery = getTeam3DLivery('ferrari');

    expect(() => {
      drawCoolingLouvres(ctx, 'unknown_team' as TeamId, fallbackLivery);
    }).not.toThrow();

    expect(fillRectCalls.length).toBeGreaterThan(50);
  });
});
