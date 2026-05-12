// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import type { Theme } from '@mui/material/styles';

import {
  pillSx,
  stickyWrapperSx,
  stickyInnerSx,
  fixedWrapperSx,
  subNavButtonSx,
} from './floating-sub-nav.styles';
import { SUB_NAV_BUTTON_SIZE, SUB_NAV_BUTTON_MIN_SIZE } from './floating-sub-nav.const';

// ----------------------------------------------------------------------

const mockTheme = {
  vars: {
    palette: {
      grey: { '500Channel': '145 158 171' },
      common: { blackChannel: '0 0 0' },
      primary: {
        main: 'rgb(25 118 210)',
        mainChannel: '25 118 210',
      },
    },
  },
  zIndex: { speedDial: 1050 },
  transitions: {
    create: () => 'all 200ms',
    duration: { shorter: 200 },
  },
  applyStyles: (_mode: string, styles: Record<string, unknown>) => styles,
} as unknown as Theme;

type StyleFn = (theme: Theme) => Record<string, unknown>;

describe('pillSx', () => {
  it('sets bgcolor background.paper', () => {
    const styles = (pillSx as unknown as StyleFn)(mockTheme);
    expect(styles.bgcolor).toBe('background.paper');
  });

  it('builds border from grey channel', () => {
    const styles = (pillSx as unknown as StyleFn)(mockTheme);
    expect(String(styles.border)).toContain('rgba(145 158 171');
  });
});

describe('stickyWrapperSx', () => {
  it('uses position sticky', () => {
    const styles = (stickyWrapperSx as unknown as StyleFn)(mockTheme);
    expect(styles.position).toBe('sticky');
  });

  it('sets height 0', () => {
    const styles = (stickyWrapperSx as unknown as StyleFn)(mockTheme);
    expect(styles.height).toBe(0);
  });
});

describe('stickyInnerSx', () => {
  it('floats the pill upward via translateY(-100%)', () => {
    const styles = stickyInnerSx as Record<string, unknown>;
    expect(styles.transform).toBe('translateY(-100%)');
  });

  it('restores pointer events on the inner box', () => {
    const styles = stickyInnerSx as Record<string, unknown>;
    expect(styles.pointerEvents).toBe('auto');
  });
});

describe('fixedWrapperSx', () => {
  it('uses position fixed', () => {
    const styles = (fixedWrapperSx as unknown as StyleFn)(mockTheme);
    expect(styles.position).toBe('fixed');
  });

  it('centres horizontally', () => {
    const styles = (fixedWrapperSx as unknown as StyleFn)(mockTheme);
    expect(styles.left).toBe('50%');
    expect(styles.transform).toBe('translateX(-50%)');
  });
});

describe('subNavButtonSx', () => {
  it('inactive button has text.disabled color', () => {
    const styles = (subNavButtonSx(false) as unknown as StyleFn)(mockTheme);
    expect(styles.color).toBe('text.disabled');
  });

  it('active button has primary.main color', () => {
    const styles = (subNavButtonSx(true) as unknown as StyleFn)(mockTheme);
    expect(styles.color).toBe('primary.main');
  });
});

describe('readability — minimum touch-target constants (regression)', () => {
  it('[regression] SUB_NAV_BUTTON_SIZE.xs >= SUB_NAV_BUTTON_MIN_SIZE', () => {
    expect(SUB_NAV_BUTTON_SIZE.xs).toBeGreaterThanOrEqual(SUB_NAV_BUTTON_MIN_SIZE);
  });

  it('[regression] SUB_NAV_BUTTON_SIZE.sm >= SUB_NAV_BUTTON_MIN_SIZE', () => {
    expect(SUB_NAV_BUTTON_SIZE.sm).toBeGreaterThanOrEqual(SUB_NAV_BUTTON_MIN_SIZE);
  });

  it('[regression] SUB_NAV_BUTTON_SIZE.md >= SUB_NAV_BUTTON_MIN_SIZE', () => {
    expect(SUB_NAV_BUTTON_SIZE.md).toBeGreaterThanOrEqual(SUB_NAV_BUTTON_MIN_SIZE);
  });

  it('[regression] SUB_NAV_BUTTON_SIZE.lg >= SUB_NAV_BUTTON_MIN_SIZE', () => {
    expect(SUB_NAV_BUTTON_SIZE.lg).toBeGreaterThanOrEqual(SUB_NAV_BUTTON_MIN_SIZE);
  });
});
