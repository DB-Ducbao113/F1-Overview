import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { F1PageTransition } from './F1PageTransition';

describe('F1PageTransition', () => {
  it('renders children and transition container without errors', () => {
    const html = renderToStaticMarkup(
      <F1PageTransition pathname="/championship">
        <div id="page-content">Championship Page</div>
      </F1PageTransition>,
    );

    expect(html).toContain('id="page-content"');
    expect(html).toContain('Championship Page');
  });

  it('renders correctly with root pathname', () => {
    const html = renderToStaticMarkup(
      <F1PageTransition pathname="/">
        <div>Home Page</div>
      </F1PageTransition>,
    );

    expect(html).toContain('Home Page');
  });
});
