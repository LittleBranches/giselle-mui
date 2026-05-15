// @vitest-environment jsdom
/**
 * Unit tests for StatCardRow.
 *
 * StatCard and GiselleIcon are mocked so tests stay focused on what
 * StatCardRow is responsible for: iterating items, wiring props, and
 * calling renderChart for each item.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('@mui/material/Grid', () => ({
  default: ({
    children,
    container: _container,
    spacing: _spacing,
    size: _size,
    sx: _sx,
    ...props
  }: {
    children?: React.ReactNode;
    container?: boolean;
    spacing?: unknown;
    size?: unknown;
    sx?: unknown;
    [key: string]: unknown;
  }) => React.createElement('div', props, children ?? null),
}));

vi.mock('../stat/stat-card', () => ({
  StatCard: ({
    label,
    value,
    color,
    icon,
    chart,
  }: {
    label: string;
    value: string | number;
    color?: string;
    icon?: React.ReactNode;
    chart?: React.ReactNode;
  }) =>
    React.createElement(
      'div',
      {
        'data-testid': 'stat-card',
        'data-label': label,
        'data-value': String(value),
        'data-color': color,
      },
      icon ?? null,
      chart ?? null
    ),
}));

vi.mock('../../../data-display/icon/giselle', () => ({
  GiselleIcon: ({ icon }: { icon: string }) => React.createElement('span', { 'data-icon': icon }),
}));

import { StatCardRow } from './stat-card-row';
import type { StatCardItem } from '../stat/types';

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const ITEMS: StatCardItem[] = [
  { label: 'Tasks done', value: '12', color: 'success', iconId: 'solar:check-circle-bold' },
  { label: 'In progress', value: '4', color: 'warning', iconId: 'solar:clock-circle-bold' },
  { label: 'Earnings', value: '$240', color: 'primary', iconId: 'solar:dollar-minimalistic-bold' },
  { label: 'Paid out', value: '$180', color: 'info', iconId: 'solar:wallet-bold' },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('StatCardRow — rendering', () => {
  it('renders one StatCard per item', () => {
    const html = renderToStaticMarkup(React.createElement(StatCardRow, { items: ITEMS }));
    const matches = html.match(/data-testid="stat-card"/g);
    expect(matches?.length).toBe(ITEMS.length);
  });

  it('passes label and value to each StatCard', () => {
    const html = renderToStaticMarkup(React.createElement(StatCardRow, { items: ITEMS }));
    expect(html).toContain('data-label="Tasks done"');
    expect(html).toContain('data-value="12"');
    expect(html).toContain('data-label="Earnings"');
    expect(html).toContain('data-value="$240"');
  });

  it('passes the correct color to each StatCard', () => {
    const html = renderToStaticMarkup(React.createElement(StatCardRow, { items: ITEMS }));
    expect(html).toContain('data-color="success"');
    expect(html).toContain('data-color="warning"');
    expect(html).toContain('data-color="primary"');
    expect(html).toContain('data-color="info"');
  });

  it('renders a GiselleIcon for each item', () => {
    const html = renderToStaticMarkup(React.createElement(StatCardRow, { items: ITEMS }));
    expect(html).toContain('data-icon="solar:check-circle-bold"');
    expect(html).toContain('data-icon="solar:dollar-minimalistic-bold"');
  });

  it('renders without chart slot when renderChart is not provided', () => {
    const html = renderToStaticMarkup(React.createElement(StatCardRow, { items: ITEMS }));
    // No chart wrapper — cards render their chart slots as null
    expect(html).not.toContain('data-testid="chart"');
  });
});

describe('StatCardRow — renderChart', () => {
  it('calls renderChart for each item and renders the result', () => {
    const renderChart = (item: StatCardItem) =>
      React.createElement('span', { 'data-testid': 'chart', 'data-label': item.label });

    const html = renderToStaticMarkup(
      React.createElement(StatCardRow, { items: ITEMS, renderChart })
    );

    const matches = html.match(/data-testid="chart"/g);
    expect(matches?.length).toBe(ITEMS.length);
  });

  it('passes the correct item to renderChart', () => {
    const renderChart = (item: StatCardItem) =>
      React.createElement('span', { 'data-chart-label': item.label });

    const html = renderToStaticMarkup(
      React.createElement(StatCardRow, { items: ITEMS, renderChart })
    );

    expect(html).toContain('data-chart-label="Tasks done"');
    expect(html).toContain('data-chart-label="Paid out"');
  });
});

describe('StatCardRow — empty state', () => {
  it('renders nothing when items is empty', () => {
    const html = renderToStaticMarkup(React.createElement(StatCardRow, { items: [] }));
    expect(html).not.toContain('data-testid="stat-card"');
  });
});
