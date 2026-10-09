import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SessionBanner } from './SessionBanner';
import { TimingTower } from './TimingTower';
import { LiveMap } from './LiveMap';

describe('Live Center Components - Mode System & Map/Tower states', () => {
  describe('SessionBanner Component', () => {
    it('renders Live mode strictly without replay scrubber or replay dropdown', () => {
      const html = renderToStaticMarkup(
        <SessionBanner
          mode="live"
          onModeChange={vi.fn()}
          liveState="upcoming"
          liveSession={{
            session_key: 11378,
            session_name: 'Practice 1',
            meeting_key: 1245,
            circuit_key: 61,
            circuit_short_name: 'Marina Bay',
            country_name: 'Singapore',
            country_code: 'SGP',
            location: 'Marina Bay',
            date_start: '2026-10-09T08:30:00.000Z',
            date_end: '2026-10-09T09:30:00.000Z',
            gmt_offset: '+08:00',
            year: 2026,
          }}
          onRefreshLive={vi.fn()}
          selectedReplayRaceId="melbourne-2024"
          onSelectReplayRace={vi.fn()}
          replayOffsetSec={0}
          onReplayOffsetChange={vi.fn()}
          isReplayPlaying={true}
          onToggleReplayPlay={vi.fn()}
          replaySpeed={1}
          onReplaySpeedChange={vi.fn()}
        />,
      );

      // Verify Live mode elements
      expect(html).toContain('Singapore');
      expect(html).toContain('Marina Bay');
      expect(html).toContain('Trực tiếp');
      // Verify Replay elements are NOT shown in Live mode
      expect(html).not.toContain('MÔ PHỎNG · DỮ LIỆU LỊCH SỬ');
      expect(html).not.toContain('Phút 0–30 của chặng đua');
    });

    it('renders Replay mode with amber badge, race selector, and timeline scrubber', () => {
      const html = renderToStaticMarkup(
        <SessionBanner
          mode="replay"
          onModeChange={vi.fn()}
          liveState="upcoming"
          liveSession={null}
          onRefreshLive={vi.fn()}
          selectedReplayRaceId="melbourne-2024"
          onSelectReplayRace={vi.fn()}
          replayOffsetSec={120}
          onReplayOffsetChange={vi.fn()}
          isReplayPlaying={true}
          onToggleReplayPlay={vi.fn()}
          replaySpeed={2}
          onReplaySpeedChange={vi.fn()}
        />,
      );

      expect(html).toContain('MÔ PHỎNG · DỮ LIỆU LỊCH SỬ');
      expect(html).toContain('Australian GP 2024');
      expect(html).toContain('Phút 0–30 của chặng đua');
      expect(html).toContain('2:00'); // 120s offset formatted as 2:00
      expect(html).toContain('30:00');
    });
  });

  describe('TimingTower Component', () => {
    it('renders 10 skeleton shimmer rows when loading', () => {
      const html = renderToStaticMarkup(<TimingTower tower={[]} loading={true} />);

      expect(html).toContain('BẢNG XẾP HẠNG THỜI GIAN');
      expect(html).toContain('animate-pulse');
    });

    it('renders ready rows with driver acronyms, team colors, tyres, and speed', () => {
      const mockRows: any[] = [
        {
          driver_number: 1,
          name_acronym: 'VER',
          broadcast_name: 'M. VERSTAPPEN',
          team_name: 'Red Bull Racing',
          team_colour: '#3671C6',
          position: 1,
          gap_to_leader: 'Leader',
          gainLoss: 0,
          tyre: { compound: 'SOFT', laps_used: 12 },
          telemetry: { speed: 320, gear: 8, drs: false },
        },
        {
          driver_number: 4,
          name_acronym: 'NOR',
          broadcast_name: 'L. NORRIS',
          team_name: 'McLaren',
          team_colour: '#FF8000',
          position: 2,
          gap_to_leader: '+1.450',
          gainLoss: 1,
          tyre: { compound: 'MEDIUM', laps_used: 15 },
          telemetry: { speed: 324, gear: 8, drs: true },
        },
      ];

      const html = renderToStaticMarkup(
        <TimingTower tower={mockRows} loading={false} selectedDriverNumber={4} />,
      );

      expect(html).toContain('VER');
      expect(html).toContain('NOR');
      expect(html).toContain('Leader');
      expect(html).toContain('+1.450');
      expect(html).toContain('320');
      expect(html).toContain('324');
    });
  });

  describe('LiveMap Component', () => {
    it('always renders circuit static track geometry even without cars', () => {
      const html = renderToStaticMarkup(
        <LiveMap
          circuitKey={10}
          circuitName="Albert Park, Melbourne"
          mode="replay"
          timingRows={[]}
        />,
      );

      // Albert Park Circuit Name and SVG track elements
      expect(html).toContain('Albert Park');
      expect(html).toContain('circuit-track-line');
      expect(html).toContain('TRACK READY');
    });

    it('renders upcoming session overlay when session is not started in Live mode', () => {
      const html = renderToStaticMarkup(
        <LiveMap
          circuitKey={61}
          circuitName="Marina Bay Street Circuit"
          mode="live"
          liveState="upcoming"
          onSwitchToReplay={vi.fn()}
        />,
      );

      expect(html).toContain('Chặng Đua Chưa Bắt Đầu');
      expect(html).toContain('Xem Mô Phỏng Ngay');
    });
  });
});
