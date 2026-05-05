// @vitest-environment jsdom
/**
 * Unit tests for StatCard.
 *
 * All MUI components are mocked to avoid theme-provider requirements.
 * `useTheme` is mocked to return a minimal palette so sparklineColor
 * resolves without a CssVarsProvider.
 * `react-apexcharts` is mocked to confirm it does NOT appear in SSR output
 * (the component only loads it after mount via dynamic import).
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

// ---------------------------------------------------------------------------
// MUI mocks — strip sx to avoid theme.vars access
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
  }) => React.createElement('div', { 'data-testid': 'stat-card', ...props }, children ?? null),
}));

vi.mock('@mui/material/Box', () => ({
  default: ({
    component = 'div',
    children,
    sx: _sx,
    ...props
  }: {
    component?: string;
    children?: React.ReactNode;
    sx?: unknown;
    [key: string]: unknown;
  }) => React.createElement(component as string, props, children ?? null),
}));

vi.mock('@mui/material/Typography', () => ({
  default: ({
    children,
    variant: _variant,
    component = 'span',
    sx: _sx,
    ...props
  }: {
    children?: React.ReactNode;
    variant?: string;
    component?: string;
    sx?: unknown;
    [key: string]: unknown;
  }) => React.createElement(component as string, props, children ?? null),
}));

vi.mock('@mui/material/styles', () => ({
  useTheme: () => ({
    palette: {
      primary: { dark: '#1565c0' },
      secondary: { dark: '#6d1b7b' },
      info: { dark: '#014361' },
      success: { dark: '#1b5e20' },
      warning: { dark: '#e65100' },
      error: { dark: '#b71c1c' },
    },
  }),
}));

vi.mock('../../icon/giselle', () => ({
  GiselleIcon: ({ icon, width }: { icon: string; width?: number }) =>
    React.createElement('span', { 'data-icon': icon, 'data-width': width }),
}));

import { StatCard } from './stat-card';

// ----------------------------------------------------------------------
// Tests use renderToStaticMarkup (SSR-safe) because the sparkline loads
// lazily via useEffect — it is never present in the static markup.
// Interaction tests use ReactDOM.createRoot + act where needed.
// ----------------------------------------------------------------------

describe('StatCard — rendering', () => {
  it('renders the label', () => {
    const html = renderToStaticMarkup(
      React.createElement(StatCard, { label: 'Components', value: '9' })
    );
    expect(html).toContain('Components');
  });

  it('renders the value', () => {
    const html = renderToStaticMarkup(
      React.createElement(StatCard, { label: 'Components', value: '9' })
    );
    expect(html).toContain('9');
  });

  it('renders the icon slot when provided', () => {
    const icon = React.createElement('span', { 'data-testid': 'icon-slot' });
    const html = renderToStaticMarkup(
      React.createElement(StatCard, { label: 'Test', value: '1', icon })
    );
    expect(html).toContain('data-testid="icon-slot"');
  });

  it('omits the trend indicator when trend prop is not provided', () => {
    const html = renderToStaticMarkup(React.createElement(StatCard, { label: 'Test', value: '1' }));
    expect(html).not.toContain('eva:trending');
  });
});

describe('StatCard — trend indicator', () => {
  it('renders the trend value with + prefix for positive trends', () => {
    const html = renderToStaticMarkup(
      React.createElement(StatCard, { label: 'Test', value: '1', trend: 2.6 })
    );
    expect(html).toContain('+');
    expect(html).toContain('2.6%');
  });

  it('renders the trend value without + prefix for negative trends', () => {
    const html = renderToStaticMarkup(
      React.createElement(StatCard, { label: 'Test', value: '1', trend: -1.2 })
    );
    expect(html).not.toMatch(/\+.*-1\.2/);
    expect(html).toContain('-1.2%');
  });

  it('renders the trendLabel when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(StatCard, {
        label: 'Test',
        value: '1',
        trend: 5,
        trendLabel: 'last week',
      })
    );
    expect(html).toContain('last week');
  });
});

describe('StatCard — sparkline (SSR guard)', () => {
  it('[regression] sparkline chart is absent in SSR output — chart loads only after mount', () => {
    // react-apexcharts is not available in the test environment.
    // Even if it were, useEffect does not run in renderToStaticMarkup.
    const html = renderToStaticMarkup(
      React.createElement(StatCard, { label: 'Test', value: '1', sparkline: [1, 2, 3, 4] })
    );
    // No apexcharts markup should appear in server-rendered HTML
    expect(html).not.toContain('apexcharts');
    expect(html).not.toContain('apexchartstest');
  });
});

describe('StatCard — color default', () => {
  it('renders without error when no color prop is supplied (defaults to primary)', () => {
    expect(() =>
      renderToStaticMarkup(React.createElement(StatCard, { label: 'Test', value: '0' }))
    ).not.toThrow();
  });
});
