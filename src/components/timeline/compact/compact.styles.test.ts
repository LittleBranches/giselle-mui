// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import type { Theme } from '@mui/material/styles';

import { COMPACT_MILESTONE_DOT_SIZE, COMPACT_PHASE_DOT_SIZE } from './compact.const';
import { accordionRootSx, milestoneDotSx, phaseDotSx } from './compact.styles';

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
      grey: { '500Channel': '145 158 171' },
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
  transitions: {
    create: () => 'opacity 200ms, background-color 200ms',
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
    const styles = accordionRootSx(true) as Record<string, unknown>;
    expect(styles['opacity']).toBe(0.65);
  });

  it('returns opacity 1 when done=false', () => {
    const styles = accordionRootSx(false) as Record<string, unknown>;
    expect(styles['opacity']).toBe(1);
  });

  it('has no border (FAQ-style)', () => {
    const styles = accordionRootSx(false) as Record<string, unknown>;
    expect(styles['border']).toBe('none');
  });

  it('sets boxShadow to none', () => {
    const styles = accordionRootSx(false) as Record<string, unknown>;
    expect(styles['boxShadow']).toBe('none');
  });
});

// ----------------------------------------------------------------------

describe('readability — minimum dot size constants (regression)', () => {
  it('[regression] COMPACT_PHASE_DOT_SIZE >= 12px', () => {
    expect(COMPACT_PHASE_DOT_SIZE).toBeGreaterThanOrEqual(12);
  });

  it('[regression] COMPACT_MILESTONE_DOT_SIZE >= 18px', () => {
    expect(COMPACT_MILESTONE_DOT_SIZE).toBeGreaterThanOrEqual(18);
  });
});
