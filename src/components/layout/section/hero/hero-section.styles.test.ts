// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import type { Theme } from '@mui/material/styles';

import { heroActionsRowSx, heroIconsSlotSx, heroInnerSx, heroRootSx } from './hero-section.styles';

// ----------------------------------------------------------------------

type ThemeFn = (theme: Theme) => Record<string, unknown>;

const mockTheme = {
  vars: {
    palette: {
      primary: { mainChannel: '46 125 50' },
      secondary: { mainChannel: '245 166 35' },
      info: { mainChannel: '3 169 244' },
      success: { mainChannel: '76 175 80' },
      warning: { mainChannel: '255 152 0' },
      error: { mainChannel: '211 47 47' },
    },
  },
} as unknown as Theme;

// ----------------------------------------------------------------------

describe('heroRootSx', () => {
  it('returns background-color using primary channel at 0.08 alpha', () => {
    const styles = (heroRootSx('primary') as unknown as ThemeFn)(mockTheme);
    expect(styles['backgroundColor']).toBe('rgba(46 125 50 / 0.08)');
  });

  it('returns background-color using secondary channel', () => {
    const styles = (heroRootSx('secondary') as unknown as ThemeFn)(mockTheme);
    expect(styles['backgroundColor']).toBe('rgba(245 166 35 / 0.08)');
  });

  it('returns background-color for all six palette keys', () => {
    const keys = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;
    for (const color of keys) {
      const styles = (heroRootSx(color) as unknown as ThemeFn)(mockTheme);
      expect(typeof styles['backgroundColor']).toBe('string');
      expect(styles['backgroundColor'] as string).toMatch(/^rgba\(/);
    }
  });

  it('sets width to 100%', () => {
    const styles = (heroRootSx('primary') as unknown as ThemeFn)(mockTheme);
    expect(styles['width']).toBe('100%');
  });
});

describe('heroInnerSx', () => {
  it('is a static object', () => {
    expect(typeof heroInnerSx).toBe('object');
  });

  it('centers content', () => {
    const sx = heroInnerSx as Record<string, unknown>;
    expect(sx['alignItems']).toBe('center');
    expect(sx['textAlign']).toBe('center');
  });

  it('uses flex column layout', () => {
    const sx = heroInnerSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['flexDirection']).toBe('column');
  });
});

describe('heroActionsRowSx', () => {
  it('is a static object', () => {
    expect(typeof heroActionsRowSx).toBe('object');
  });

  it('uses row flex layout', () => {
    const sx = heroActionsRowSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['flexDirection']).toBe('row');
    expect(sx['flexWrap']).toBe('wrap');
    expect(sx['justifyContent']).toBe('center');
  });
});
describe('heroIconsSlotSx', () => {
  it('is a static object', () => {
    expect(typeof heroIconsSlotSx).toBe('object');
  });

  it('spans the full container width', () => {
    const sx = heroIconsSlotSx as Record<string, unknown>;
    expect(sx['width']).toBe('100%');
  });
});
