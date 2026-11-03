import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ChampionshipView } from '../../ui/ChampionshipView';
import { StandingsTable } from '../../ui/components/StandingsTable';
import { useChampionshipStore } from '../../../../store/useChampionshipStore';

describe('Championship Interface — Browser & Component Smoke Tests', () => {
  beforeEach(() => {
    useChampionshipStore.setState({
      selectedSeason: 2026,
      activeSubTab: 'standings',
      standingsCategory: 'drivers',
      selectedRaceRound: null,
    });
  });

  it('renders ChampionshipView for 2026 season with standings, season tabs and sync status', () => {
    const html = renderToStaticMarkup(
      <StaticRouter location="/championship">
        <ChampionshipView season={2026} onSeasonChange={() => {}} />
      </StaticRouter>,
    );

    expect(html).toContain('2026');
    expect(html).toMatch(/Bảng Xếp Hạng|Standings/);
    expect(html).toMatch(/Lịch Thi Đấu|Calendar/);
    expect(html).toMatch(/Kết Quả Chặng|Results/);
  });

  it('renders ChampionshipView for historical 2024 and 2025 seasons', () => {
    const html2024 = renderToStaticMarkup(
      <StaticRouter location="/championship">
        <ChampionshipView season={2024} onSeasonChange={() => {}} />
      </StaticRouter>,
    );
    expect(html2024).toContain('2024');

    const html2025 = renderToStaticMarkup(
      <StaticRouter location="/championship">
        <ChampionshipView season={2025} onSeasonChange={() => {}} />
      </StaticRouter>,
    );
    expect(html2025).toContain('2025');
  });

  it('renders StandingsTable in driver category with driver rankings', () => {
    useChampionshipStore.setState({ standingsCategory: 'drivers' });
    const html = renderToStaticMarkup(
      <StaticRouter location="/championship">
        <StandingsTable season={2026} />
      </StaticRouter>,
    );

    expect(html).toContain('Norris');
    expect(html).toContain('Verstappen');
    expect(html).toMatch(/PTS|ĐIỂM/);
  });

  it('renders StandingsTable in constructor category with constructor rankings', () => {
    useChampionshipStore.setState({ standingsCategory: 'constructors' });
    const html = renderToStaticMarkup(
      <StaticRouter location="/championship">
        <StandingsTable season={2026} />
      </StaticRouter>,
    );

    expect(html).toContain('McLaren');
    expect(html).toContain('Ferrari');
    expect(html).toContain('Red Bull');
  });
});
