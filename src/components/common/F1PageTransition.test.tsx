import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { F1PageTransition } from './F1PageTransition';
import { act, create } from 'react-test-renderer';

describe('F1PageTransition', () => {
  it('clears the wipe even if children re-render during navigation', () => {
    vi.useFakeTimers();
    const render = (pathname: string, content: string) => (
      <F1PageTransition pathname={pathname}>
        <p>{content}</p>
      </F1PageTransition>
    );
    let view: ReturnType<typeof create>;
    try {
      act(() => {
        view = create(render('/', 'Home'));
      });
      act(() => {
        view.update(render('/showroom', 'Loading'));
      });
      expect(view!.root.findAllByProps({ 'aria-hidden': 'true' })).toHaveLength(1);
      act(() => {
        vi.advanceTimersByTime(100);
      });
      act(() => {
        view.update(render('/showroom', 'Showroom ready'));
      });
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(view!.root.findAllByProps({ 'aria-hidden': 'true' })).toHaveLength(0);
      expect(view!.root.findByType('p').children).toEqual(['Showroom ready']);
    } finally {
      act(() => {
        view?.unmount();
      });
      vi.useRealTimers();
    }
  });

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
