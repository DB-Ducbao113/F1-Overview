import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, StaticRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { DriversDirectoryPage } from './DriversDirectoryPage';
import { DriverDetailPage } from './DriverDetailPage';
import { useNavigationStore } from '../../store/useNavigationStore';
import { act, create } from 'react-test-renderer';

afterEach(() => useNavigationStore.setState({ lang: 'vi' }));

describe('driver identity across pages', () => {
  it('shows 2026 numbers in the directory and driver cards', () => {
    const html = renderToStaticMarkup(
      <StaticRouter location="/">
        <DriversDirectoryPage />
      </StaticRouter>,
    );
    expect(html).toMatch(/NOR[\s\S]*?#1</);
    expect(html).toMatch(/VER[\s\S]*?#3</);
    expect(html).toMatch(/LAW[\s\S]*?#30</);
    expect(html).not.toContain('RB F1 Team');
  });

  it('retains Alpine and uses the Sauber name in past seasons', () => {
    const html2025 = renderToStaticMarkup(
      <StaticRouter location="/">
        <DriversDirectoryPage initialSeason={2025} />
      </StaticRouter>,
    );
    expect(html2025).toContain('Pierre Gasly');
    expect(html2025).toContain('Franco Colapinto');
    expect(html2025).toContain('Jack Doohan');
    expect(html2025).toContain('21 tay đua');
    const html2024 = renderToStaticMarkup(
      <StaticRouter location="/">
        <DriversDirectoryPage initialSeason={2024} />
      </StaticRouter>,
    );
    expect(html2024).toContain('Zhou Guanyu');
    expect(html2024).toContain('Kick Sauber');
    expect(html2024).not.toMatch(/>audi</i);
  });

  it('uses the proper plural for Norris career podiums in English', () => {
    useNavigationStore.setState({ lang: 'en' });
    let view: ReturnType<typeof create>;
    act(() => {
      view = create(
        <MemoryRouter initialEntries={['/drivers/norris?season=2026']}>
          <Routes>
            <Route path="/drivers/:driverId" element={<DriverDetailPage />} />
          </Routes>
        </MemoryRouter>,
      );
    });
    try {
      const podiumCount = view!.root
        .findAllByType('strong')
        .find((node) => node.children.join('') === '49');
      expect(podiumCount?.parent?.children).toContain('podiums');
    } finally {
      act(() => view.unmount());
    }
  });
});
