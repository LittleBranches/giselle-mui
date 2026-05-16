// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import type { Theme } from '@mui/material/styles';

import {
  buildRadialProgressOptions,
  legendDotSx,
  LEGEND_DOT_SIZE,
} from './radial-progress-card.styles';

// ---------------------------------------------------------------------------
// Minimal mock theme
// ---------------------------------------------------------------------------

const mockTheme = {
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
    text: { secondary: 'rgba(0,0,0,0.6)', primary: 'rgba(0,0,0,0.87)' },
    grey: { 200: '#eeeeee' } as Record<string, string>,
  },
} as unknown as Theme;

// ---------------------------------------------------------------------------
// buildRadialProgressOptions
// ---------------------------------------------------------------------------

describe('buildRadialProgressOptions', () => {
  const labels = ['Quality', 'Components', 'Theme'];
  const colors = ['#2e7d32', '#1976d2', '#ed6c02'];

  it('passes labels through to chart options', () => {
    const opts = buildRadialProgressOptions(mockTheme, labels, colors, 35, '% Ready');
    expect(opts.labels).toEqual(labels);
  });

  it('passes colors through to chart options', () => {
    const opts = buildRadialProgressOptions(mockTheme, labels, colors, 35, '% Ready');
    expect(opts.colors).toEqual(colors);
  });

  it('sets chart type to radialBar', () => {
    const opts = buildRadialProgressOptions(mockTheme, labels, colors, 35, '% Ready');
    expect(opts.chart?.type).toBe('radialBar');
  });

  it('total formatter returns the aggregate total as a string', () => {
    const opts = buildRadialProgressOptions(mockTheme, labels, colors, 42, '% Ready');
    const dl = opts.plotOptions?.radialBar?.dataLabels;
    expect(typeof dl?.total?.formatter).toBe('function');
    // formatter ignores ApexCharts-provided args — always returns the bound total
    const formatter = dl?.total?.formatter as unknown as () => string;
    expect(formatter()).toBe('42');
  });

  it('total label is set to the provided totalLabel', () => {
    const opts = buildRadialProgressOptions(mockTheme, labels, colors, 35, '% Store Ready');
    const dl = opts.plotOptions?.radialBar?.dataLabels;
    expect(dl?.total?.label).toBe('% Store Ready');
  });

  it('value formatter appends a % sign', () => {
    const opts = buildRadialProgressOptions(mockTheme, labels, colors, 35, '%');
    const dl = opts.plotOptions?.radialBar?.dataLabels;
    const valueFmt = dl?.value?.formatter as (val: number) => string;
    expect(valueFmt(90)).toBe('90%');
    expect(valueFmt(33.7)).toBe('34%');
  });

  it('uses theme text.secondary from vars for label colours', () => {
    const opts = buildRadialProgressOptions(mockTheme, labels, colors, 35, '%');
    const dl = opts.plotOptions?.radialBar?.dataLabels;
    expect(dl?.total?.color).toBe('var(--mui-palette-text-secondary)');
    expect(dl?.name?.color).toBe('var(--mui-palette-text-secondary)');
  });

  it('uses theme text.primary from vars for value colour', () => {
    const opts = buildRadialProgressOptions(mockTheme, labels, colors, 35, '%');
    const dl = opts.plotOptions?.radialBar?.dataLabels;
    expect(dl?.value?.color).toBe('var(--mui-palette-text-primary)');
  });

  it('falls back to palette tokens when theme.vars is absent', () => {
    const bareTheme = {
      palette: {
        text: { secondary: 'rgba(0,0,0,0.6)', primary: 'rgba(0,0,0,0.87)' },
        grey: { 200: '#eeeeee' } as Record<string, string>,
      },
    } as unknown as Theme;
    const opts = buildRadialProgressOptions(bareTheme, labels, colors, 35, '%');
    const dl = opts.plotOptions?.radialBar?.dataLabels;
    expect(dl?.total?.color).toBe('rgba(0,0,0,0.6)');
    expect(dl?.value?.color).toBe('rgba(0,0,0,0.87)');
  });
});

// ---------------------------------------------------------------------------
// legendDotSx
// ---------------------------------------------------------------------------

describe('legendDotSx', () => {
  it('sets bgcolor to the provided colour string', () => {
    const sx = legendDotSx('#2e7d32') as Record<string, unknown>;
    expect(sx.bgcolor).toBe('#2e7d32');
  });

  it('renders as a 12 × 12 circle (minimum readable size for status indicators)', () => {
    const sx = legendDotSx('red') as Record<string, unknown>;
    expect(sx.width).toBe(12);
    expect(sx.height).toBe(12);
    expect(sx.borderRadius).toBe('50%');
  });

  it('minimum size regression — LEGEND_DOT_SIZE must be >= 12', () => {
    expect(LEGEND_DOT_SIZE).toBeGreaterThanOrEqual(12);
  });

  it('does not capture pointer events (flexShrink: 0 present)', () => {
    const sx = legendDotSx('blue') as Record<string, unknown>;
    expect(sx.flexShrink).toBe(0);
  });

  it('accepts CSS variable colour strings', () => {
    const cssVar = 'var(--mui-palette-success-main)';
    const sx = legendDotSx(cssVar) as Record<string, unknown>;
    expect(sx.bgcolor).toBe(cssVar);
  });
});
