// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import type { Theme } from '@mui/material/styles';

import {
  statCardRootSx,
  trendBoxSx,
  iconBoxSx,
  contentRowSx,
  labelsBoxSx,
} from './stat-card.styles';

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

describe('statCardRootSx', () => {
  it('returns a backgroundImage using channelAlpha on lightChannel', () => {
    const styles = (statCardRootSx('primary') as Function)(mockTheme);
    expect(styles.backgroundImage).toContain('144 202 249');
    expect(styles.backgroundImage).toContain('linear-gradient(135deg');
  });

  it('sets color to palette-key.dark', () => {
    const styles = (statCardRootSx('success') as Function)(mockTheme);
    expect(styles.color).toBe('success.dark');
  });

  it('sets position relative and overflow hidden for the decoration layer', () => {
    const styles = (statCardRootSx('primary') as Function)(mockTheme);
    expect(styles.position).toBe('relative');
    expect(styles.overflow).toBe('hidden');
  });

  it('[regression] gradient uses lightChannel at low opacity — no Minimals lighterChannel', () => {
    const styles = (statCardRootSx('warning') as Function)(mockTheme);
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
