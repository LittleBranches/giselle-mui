// @vitest-environment jsdom
/**
 * Unit tests for StatCard.
 *
 * GiselleIcon is mocked for icon isolation (no network, deterministic output).
 * MUI components render with GiselleThemeProvider — no MUI mocks needed.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';

// GiselleIcon: mocked for test isolation (Iconify CDN not needed in tests).
vi.mock('../../data-display/icon/giselle', () => ({
  GiselleIcon: ({ icon, width }: { icon: string; width?: number }) =>
    React.createElement('span', { 'data-icon': icon, 'data-width': width }),
}));

import { renderWithTheme } from '../../../../../test-utils';
import { StatCard } from './stat-card';

// ----------------------------------------------------------------------

describe('StatCard — rendering', () => {
  it('renders the label', () => {
    const html = renderWithTheme(
      React.createElement(StatCard, { label: 'Components', value: '9' })
    );
    expect(html).toContain('Components');
  });

  it('renders the value', () => {
    const html = renderWithTheme(
      React.createElement(StatCard, { label: 'Components', value: '9' })
    );
    expect(html).toContain('9');
  });

  it('renders the icon slot when provided', () => {
    const icon = React.createElement('span', { 'data-testid': 'icon-slot' });
    const html = renderWithTheme(
      React.createElement(StatCard, { label: 'Test', value: '1', icon })
    );
    expect(html).toContain('data-testid="icon-slot"');
  });

  it('omits the trend indicator when trend prop is not provided', () => {
    const html = renderWithTheme(React.createElement(StatCard, { label: 'Test', value: '1' }));
    expect(html).not.toContain('eva:trending');
  });
});

describe('StatCard — trend indicator', () => {
  it('renders the trend value with + prefix for positive trends', () => {
    const html = renderWithTheme(
      React.createElement(StatCard, { label: 'Test', value: '1', trend: 2.6 })
    );
    expect(html).toContain('+');
    expect(html).toContain('2.6%');
  });

  it('renders the trend value without + prefix for negative trends', () => {
    const html = renderWithTheme(
      React.createElement(StatCard, { label: 'Test', value: '1', trend: -1.2 })
    );
    expect(html).not.toMatch(/\+.*-1\.2/);
    expect(html).toContain('-1.2%');
  });

  it('renders the trendLabel when provided', () => {
    const html = renderWithTheme(
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

describe('StatCard — chart slot', () => {
  it('renders the chart slot when provided', () => {
    const chart = React.createElement('div', { 'data-testid': 'chart-slot' });
    const html = renderWithTheme(
      React.createElement(StatCard, { label: 'Test', value: '1', chart })
    );
    expect(html).toContain('data-testid="chart-slot"');
  });

  it('renders without error when chart prop is absent', () => {
    expect(() =>
      renderWithTheme(React.createElement(StatCard, { label: 'Test', value: '1' }))
    ).not.toThrow();
  });
});

describe('StatCard — color default', () => {
  it('renders without error when no color prop is supplied (defaults to primary)', () => {
    expect(() =>
      renderWithTheme(React.createElement(StatCard, { label: 'Test', value: '0' }))
    ).not.toThrow();
  });
});
