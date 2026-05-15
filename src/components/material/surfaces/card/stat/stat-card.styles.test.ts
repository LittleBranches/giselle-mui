// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import type { Theme } from '@mui/material/styles';

import {
  statCardRootSx,
  trendBoxSx,
  iconBoxSx,
  contentRowSx,
  labelsBoxSx,
  decorationSx,
  STAT_CARD_SPARKLINE_OPTIONS,
} from './stat-card.styles';
import { STAT_CARD_ICON_BOX_SIZE, STAT_CARD_LABELS_MIN_WIDTH } from './stat-card.const';

// ----------------------------------------------------------------------

const mockTheme = {
  vars: {
    palette: {
      primary: { lightChannel: '144 202 249' },
      success: { lightChannel: '102 187 106' },
      warning: { lightChannel: '255 167 38' },
      error: { lightChannel: '244 67 54' },
    },
  },
} as unknown as Theme;

// ----------------------------------------------------------------------

type ThemeFn = (theme: Theme) => Record<string, unknown>;

describe('statCardRootSx', () => {
  it('returns a backgroundImage using channelAlpha on lightChannel', () => {
    const styles = (statCardRootSx('primary') as unknown as ThemeFn)(mockTheme);
    expect(styles.backgroundImage).toContain('144 202 249');
    expect(styles.backgroundImage).toContain('linear-gradient(135deg');
  });

  it('sets color to palette-key.dark', () => {
    const styles = (statCardRootSx('success') as unknown as ThemeFn)(mockTheme);
    expect(styles.color).toBe('success.dark');
  });

  it('sets position relative and overflow hidden for the decoration layer', () => {
    const styles = (statCardRootSx('primary') as unknown as ThemeFn)(mockTheme);
    expect(styles.position).toBe('relative');
    expect(styles.overflow).toBe('hidden');
  });

  it('[regression] gradient uses lightChannel at low opacity — not a hardcoded channel value', () => {
    const styles = (statCardRootSx('warning') as unknown as ThemeFn)(mockTheme);
    // Both gradient stops must reference the lightChannel value, not a hardcoded hex
    expect(styles.backgroundImage).toContain('255 167 38');
  });
});

describe('trendBoxSx', () => {
  it('positions the trend indicator absolutely in the top-right', () => {
    expect(trendBoxSx).toMatchObject({ top: 16, right: 16, position: 'absolute' });
  });
});

describe('iconBoxSx', () => {
  it('[regression] icon container is 48×48 — never smaller', () => {
    expect((iconBoxSx as Record<string, unknown>).width).toBe(48);
    expect((iconBoxSx as Record<string, unknown>).height).toBe(48);
  });
});

describe('contentRowSx', () => {
  it('aligns label+value left, sparkline right via flex', () => {
    expect(contentRowSx).toMatchObject({ display: 'flex', justifyContent: 'flex-end' });
  });
});

describe('labelsBoxSx', () => {
  it('[regression] labels block has a minimum width to prevent layout collapse', () => {
    expect((labelsBoxSx as Record<string, unknown>).minWidth).toBe(112);
  });
});

describe('STAT_CARD_SPARKLINE_OPTIONS', () => {
  it('enables sparkline mode', () => {
    expect(STAT_CARD_SPARKLINE_OPTIONS.chart?.sparkline?.enabled).toBe(true);
  });

  it('disables animations for a static snapshot appearance', () => {
    expect(STAT_CARD_SPARKLINE_OPTIONS.chart?.animations?.enabled).toBe(false);
  });

  it('disables tooltip — sparkline is decorative, not interactive', () => {
    expect(STAT_CARD_SPARKLINE_OPTIONS.tooltip?.enabled).toBe(false);
  });

  it('does NOT include a colors key — consumer provides the palette dark token', () => {
    expect(STAT_CARD_SPARKLINE_OPTIONS).not.toHaveProperty('colors');
  });

  it('sets stroke width to 2 with smooth curve', () => {
    expect(STAT_CARD_SPARKLINE_OPTIONS.stroke?.width).toBe(2);
    expect(STAT_CARD_SPARKLINE_OPTIONS.stroke?.curve).toBe('smooth');
  });
});

describe('decorationSx', () => {
  it('is absolutely positioned', () => {
    expect((decorationSx as Record<string, unknown>).position).toBe('absolute');
  });

  it('[regression] anchored to bottom-right corner — never top-left', () => {
    const sx = decorationSx as Record<string, unknown>;
    expect(typeof sx.bottom).toBe('number');
    expect(typeof sx.right).toBe('number');
    expect(sx).not.toHaveProperty('top');
    expect(sx).not.toHaveProperty('left');
  });

  it('[regression] pointer events disabled — decoration must not intercept clicks', () => {
    expect((decorationSx as Record<string, unknown>).pointerEvents).toBe('none');
  });
});

describe('readability — minimum size constants (regression)', () => {
  it('[regression] STAT_CARD_ICON_BOX_SIZE >= 32px for icon readability', () => {
    expect(STAT_CARD_ICON_BOX_SIZE).toBeGreaterThanOrEqual(32);
  });

  it('[regression] STAT_CARD_LABELS_MIN_WIDTH >= 80px to prevent label collapse', () => {
    expect(STAT_CARD_LABELS_MIN_WIDTH).toBeGreaterThanOrEqual(80);
  });
});
