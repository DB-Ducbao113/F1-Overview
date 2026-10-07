import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SchematicComparisonModal } from './SchematicComparisonModal';
import { TeamId } from '../../types';

describe('SchematicComparisonModal Component', () => {
  const teams: TeamId[] = [
    'ferrari',
    'mercedes',
    'mclaren',
    'redbull',
    'astonmartin',
    'alpine',
    'racingbulls',
    'haas',
    'williams',
    'audi',
    'cadillac',
  ];

  it('renders nothing when isOpen is false', () => {
    const html = renderToStaticMarkup(
      <SchematicComparisonModal
        isOpen={false}
        onClose={vi.fn()}
        teamId="ferrari"
        lang="vi"
      />,
    );
    expect(html).toBe('');
  });

  it('renders modal with CAD schematic image and technical tabs when isOpen is true', () => {
    const html = renderToStaticMarkup(
      <SchematicComparisonModal
        isOpen={true}
        onClose={vi.fn()}
        teamId="mercedes"
        lang="vi"
      />,
    );
    expect(html).toContain('Bản Vẽ CAD 2D Gốc');
    expect(html).toContain('So Sánh 8 Bộ Phận Kỹ Thuật');
    expect(html).toContain('Bảng Mã Màu Thực Tế');
    expect(html).toContain('/images/showroom/schematics/mercedes.jpg');
    expect(html).toContain('MERC-W15-AERO-8K');
  });

  it('supports English localization properly', () => {
    const html = renderToStaticMarkup(
      <SchematicComparisonModal
        isOpen={true}
        onClose={vi.fn()}
        teamId="mclaren"
        lang="en"
      />,
    );
    expect(html).toContain('Original 2D CAD Blueprint');
    expect(html).toContain('8-Component Technical Audit');
    expect(html).toContain('Livery Color Matrix');
    expect(html).toContain('/images/showroom/schematics/mclaren.jpg');
    expect(html).toContain('MCL-38-CFD-8K');
  });

  teams.forEach((teamId) => {
    it(`renders schematic modal for ${teamId} without throwing`, () => {
      expect(() => {
        renderToStaticMarkup(
          <SchematicComparisonModal
            isOpen={true}
            onClose={vi.fn()}
            teamId={teamId}
            lang="vi"
          />,
        );
      }).not.toThrow();
    });
  });
});
