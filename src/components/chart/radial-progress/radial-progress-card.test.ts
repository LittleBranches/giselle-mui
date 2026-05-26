// @vitest-environment jsdom
/**
 * Unit tests for RadialProgressCard.
 *
 * The chart area (React.lazy + Suspense) renders its fallback during
 * renderToStaticMarkup — we test title, legend labels, and value display
 * which are rendered synchronously. MUI components run with GiselleThemeProvider.
 */

import React from 'react';
import { describe, it, expect } from 'vitest';

import { renderWithTheme } from '../../../test-utils';
import { RadialProgressCard } from './radial-progress-card';

// ---------------------------------------------------------------------------

const defaultSeries = [
  { label: 'Quality', value: 90, color: 'success' as const },
  { label: 'Components', value: 50, color: 'primary' as const },
  { label: 'Theme', value: 40, color: 'warning' as const },
];

// ---------------------------------------------------------------------------

describe('RadialProgressCard', () => {
  it('renders without crashing', () => {
    expect(() =>
      renderWithTheme(React.createElement(RadialProgressCard, { total: 35, series: defaultSeries }))
    ).not.toThrow();
  });

  it('renders CardHeader when title is provided', () => {
    const html = renderWithTheme(
      React.createElement(RadialProgressCard, {
        title: 'Store Readiness',
        total: 35,
        series: defaultSeries,
      })
    );
    expect(html).toContain('Store Readiness');
  });

  it('renders subheader when title and subheader are provided', () => {
    const html = renderWithTheme(
      React.createElement(RadialProgressCard, {
        title: 'Title',
        subheader: 'Sub text',
        total: 35,
        series: defaultSeries,
      })
    );
    expect(html).toContain('Sub text');
  });

  it('does not render header content when neither title nor subheader is provided', () => {
    const html = renderWithTheme(
      React.createElement(RadialProgressCard, { total: 35, series: defaultSeries })
    );
    expect(html).not.toContain('Store Readiness');
  });

  it('renders all legend labels', () => {
    const html = renderWithTheme(
      React.createElement(RadialProgressCard, { total: 35, series: defaultSeries })
    );
    expect(html).toContain('Quality');
    expect(html).toContain('Components');
    expect(html).toContain('Theme');
  });

  it('renders percentage values in the legend', () => {
    const html = renderWithTheme(
      React.createElement(RadialProgressCard, { total: 35, series: defaultSeries })
    );
    expect(html).toContain('90%');
    expect(html).toContain('50%');
    expect(html).toContain('40%');
  });
});
