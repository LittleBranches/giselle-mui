// @vitest-environment jsdom
/**
 * Unit tests for RadialProgressCard.
 *
 * All MUI components are mocked to avoid CssVarsProvider requirements.
 * The chart area (React.lazy + Suspense) renders its fallback during
 * renderToStaticMarkup — we test title, legend labels, and value display
 * which are rendered synchronously.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

// ---------------------------------------------------------------------------
// MUI mocks — strip sx to avoid theme.vars access in server context
// ---------------------------------------------------------------------------

vi.mock('@mui/material/Card', () => ({
  default: ({
    children,
    sx: _sx,
    ...props
  }: {
    children?: React.ReactNode;
    sx?: unknown;
    [key: string]: unknown;
  }) => React.createElement('div', { 'data-testid': 'radial-card', ...props }, children),
}));

vi.mock('@mui/material/CardContent', () => ({
  default: ({ children }: { children?: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'card-content' }, children),
}));

vi.mock('@mui/material/CardHeader', () => ({
  default: ({ title, subheader }: { title?: React.ReactNode; subheader?: React.ReactNode }) =>
    React.createElement(
      'div',
      { 'data-testid': 'card-header' },
      React.createElement('span', { 'data-testid': 'card-title' }, title),
      subheader && React.createElement('span', { 'data-testid': 'card-subheader' }, subheader)
    ),
}));

vi.mock('@mui/material/Divider', () => ({
  default: ({ sx: _sx }: { sx?: unknown }) => React.createElement('hr', null),
}));

vi.mock('@mui/material/Box', () => ({
  default: ({
    children,
    sx: _sx,
    ...props
  }: {
    children?: React.ReactNode;
    sx?: unknown;
    [key: string]: unknown;
  }) => React.createElement('div', props, children),
}));

vi.mock('@mui/material/Typography', () => ({
  default: ({
    children,
    variant: _variant,
    sx: _sx,
    ...props
  }: {
    children?: React.ReactNode;
    variant?: string;
    sx?: unknown;
    [key: string]: unknown;
  }) => React.createElement('span', props, children),
}));

vi.mock('@mui/material/styles', () => ({
  useTheme: vi.fn(() => ({
    vars: {
      palette: {
        grey: { 200: 'var(--mui-palette-grey-200)' },
        text: {
          secondary: 'var(--mui-palette-text-secondary)',
          primary: 'var(--mui-palette-text-primary)',
        },
      },
    },
    palette: {
      primary: { main: '#1976d2' },
      secondary: { main: '#9c27b0' },
      success: { main: '#2e7d32' },
      warning: { main: '#ed6c02' },
      error: { main: '#d32f2f' },
      info: { main: '#0288d1' },
    },
  })),
}));

// ---------------------------------------------------------------------------
// Component under test
// ---------------------------------------------------------------------------

import { RadialProgressCard } from './radial-progress-card';

// ---------------------------------------------------------------------------

const defaultSeries = [
  { label: 'Quality', value: 90, color: 'success' as const },
  { label: 'Components', value: 50, color: 'primary' as const },
  { label: 'Theme', value: 40, color: 'warning' as const },
];

// ---------------------------------------------------------------------------

describe('RadialProgressCard', () => {
  it('renders the card container', () => {
    const html = renderToStaticMarkup(
      React.createElement(RadialProgressCard, { total: 35, series: defaultSeries })
    );
    expect(html).toContain('data-testid="radial-card"');
  });

  it('renders CardHeader when title is provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(RadialProgressCard, {
        title: 'Store Readiness',
        total: 35,
        series: defaultSeries,
      })
    );
    expect(html).toContain('Store Readiness');
  });

  it('renders subheader when title and subheader are provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(RadialProgressCard, {
        title: 'Title',
        subheader: 'Sub text',
        total: 35,
        series: defaultSeries,
      })
    );
    expect(html).toContain('Sub text');
  });

  it('does not render CardHeader when neither title nor subheader is provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(RadialProgressCard, { total: 35, series: defaultSeries })
    );
    expect(html).not.toContain('data-testid="card-header"');
  });

  it('renders all legend labels', () => {
    const html = renderToStaticMarkup(
      React.createElement(RadialProgressCard, { total: 35, series: defaultSeries })
    );
    expect(html).toContain('Quality');
    expect(html).toContain('Components');
    expect(html).toContain('Theme');
  });

  it('renders percentage values in the legend', () => {
    const html = renderToStaticMarkup(
      React.createElement(RadialProgressCard, { total: 35, series: defaultSeries })
    );
    expect(html).toContain('90%');
    expect(html).toContain('50%');
    expect(html).toContain('40%');
  });
});
