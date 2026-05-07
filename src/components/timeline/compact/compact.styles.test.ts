// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import type { Theme } from '@mui/material/styles';

import { COMPACT_MILESTONE_DOT_SIZE, COMPACT_PHASE_DOT_SIZE } from './compact.const';
import { accordionRootSx, doneFadeSx, milestoneDotSx, phaseDotSx } from './compact.styles';

// Narrow type used to call theme-function sx values in tests.
type SxFn = (theme: Theme) => Record<string, unknown>;

// ----------------------------------------------------------------------

const mockTheme = {
  vars: {
    palette: {
      primary: { main: 'var(--mui-palette-primary-main)' },
      success: { main: 'var(--mui-palette-success-main)' },
      warning: { main: 'var(--mui-palette-warning-main)' },
      error: { main: 'var(--mui-palette-error-main)' },
      secondary: { main: 'var(--mui-palette-secondary-main)' },
      info: { main: 'var(--mui-palette-info-main)' },
    },
  },
  palette: {
    primary: { main: '#2E7D32' },
    success: { main: '#2E7D32' },
    warning: { main: '#F5A623' },
    error: { main: '#d32f2f' },
    secondary: { main: '#F5A623' },
    info: { main: '#0288d1' },
  },
} as unknown as Theme;

// ----------------------------------------------------------------------

describe('phaseDotSx', () => {
  it('returns correct width and height from COMPACT_PHASE_DOT_SIZE', () => {
    const styles = (phaseDotSx('primary') as SxFn)(mockTheme);
    expect(styles.width).toBe(COMPACT_PHASE_DOT_SIZE);
    expect(styles.height).toBe(COMPACT_PHASE_DOT_SIZE);
  });

  it('uses theme.vars.palette when available', () => {
    const styles = (phaseDotSx('success') as SxFn)(mockTheme);
    expect(styles.bgcolor).toBe('var(--mui-palette-success-main)');
  });

  it('falls back to theme.palette when vars absent', () => {
    const themeNoVars = { palette: mockTheme.palette } as unknown as Theme;
    const styles = (phaseDotSx('warning') as SxFn)(themeNoVars);
    expect(styles.bgcolor).toBe('#F5A623');
  });

  it('returns borderRadius 50%', () => {
    const styles = (phaseDotSx('primary') as SxFn)(mockTheme);
    expect(styles.borderRadius).toBe('50%');
  });
});

// ----------------------------------------------------------------------

describe('milestoneDotSx', () => {
  it('returns correct width and height from COMPACT_MILESTONE_DOT_SIZE', () => {
    const styles = (milestoneDotSx('error') as SxFn)(mockTheme);
    expect(styles.width).toBe(COMPACT_MILESTONE_DOT_SIZE);
    expect(styles.height).toBe(COMPACT_MILESTONE_DOT_SIZE);
  });

  it('uses theme.vars.palette when available', () => {
    const styles = (milestoneDotSx('info') as SxFn)(mockTheme);
    expect(styles.bgcolor).toBe('var(--mui-palette-info-main)');
  });
});

// ----------------------------------------------------------------------

describe('accordionRootSx', () => {
  it('returns opacity 0.65 when done=true', () => {
    expect((accordionRootSx(true) as Record<string, unknown>).opacity).toBe(0.65);
  });

  it('returns opacity 1 when done=false', () => {
    expect((accordionRootSx(false) as Record<string, unknown>).opacity).toBe(1);
  });

  it('includes border: 1px solid', () => {
    expect((accordionRootSx(false) as Record<string, unknown>).border).toBe('1px solid');
  });

  it('sets boxShadow to none', () => {
    expect((accordionRootSx(false) as Record<string, unknown>).boxShadow).toBe('none');
  });
});

// ----------------------------------------------------------------------

describe('doneFadeSx', () => {
  it('returns opacity 0.65 when done=true', () => {
    expect((doneFadeSx(true) as { opacity: number }).opacity).toBe(0.65);
  });

  it('returns opacity 1 when done=false', () => {
    expect((doneFadeSx(false) as { opacity: number }).opacity).toBe(1);
  });
});

// ----------------------------------------------------------------------

describe('readability — minimum dot size constants (regression)', () => {
  it('[regression] COMPACT_PHASE_DOT_SIZE >= 12px', () => {
    expect(COMPACT_PHASE_DOT_SIZE).toBeGreaterThanOrEqual(12);
  });

  it('[regression] COMPACT_MILESTONE_DOT_SIZE >= 8px', () => {
    expect(COMPACT_MILESTONE_DOT_SIZE).toBeGreaterThanOrEqual(8);
  });
});
