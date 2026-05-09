// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import type { Theme, SxProps } from '@mui/material/styles';
import type { CSSObject } from '@mui/system';
import {
  decorationOverlaySx,
  metricCardPaperSx,
  metricCardContentSx,
  metricCardIconBoxSx,
  metricCardDecorationSx,
} from './metric-card.styles';

// ----------------------------------------------------------------------

type SxFactory = (theme: Theme) => CSSObject;

const mockTheme = {
  vars: {
    palette: {
      primary: { main: 'var(--palette-primary-main)' },
      info: { main: 'var(--palette-info-main)' },
    },
  },
} as unknown as Theme;

function resolveFactory(sx: SxProps<Theme>, theme: Theme): CSSObject {
  return (sx as SxFactory)(theme);
}

// ----------------------------------------------------------------------

describe('metricCardPaperSx', () => {
  it('applies padding, relative positioning, and overflow hidden', () => {
    expect(metricCardPaperSx).toMatchObject({
      py: 3,
      pl: 3,
      pr: 2.5,
      position: 'relative',
      overflow: 'hidden',
    });
  });
});

describe('decorationOverlaySx', () => {
  it('fills parent absolutely with no pointer events', () => {
    expect(decorationOverlaySx).toMatchObject({
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
    });
  });
});

describe('metricCardContentSx', () => {
  it('positions content above decoration overlay with flex grow', () => {
    expect(metricCardContentSx).toMatchObject({
      position: 'relative',
      zIndex: 1,
      flexGrow: 1,
    });
  });
});

describe('metricCardIconBoxSx', () => {
  it('returns expected color for a known palette key', () => {
    const styles = resolveFactory(metricCardIconBoxSx('primary'), mockTheme);
    expect(styles.color).toBe('var(--palette-primary-main)');
  });

  it('positions icon box absolutely at top-right', () => {
    const styles = resolveFactory(metricCardIconBoxSx('primary'), mockTheme);
    expect(styles.position).toBe('absolute');
    expect(styles.top).toBe(24);
    expect(styles.right).toBe(20);
  });
});

describe('metricCardDecorationSx', () => {
  it('returns a gradient using the palette color main channel', () => {
    const styles = resolveFactory(metricCardDecorationSx('info'), mockTheme);
    expect(styles.background).toContain('var(--palette-info-main)');
  });

  it('positions decoration absolutely with opacity and rotation', () => {
    const styles = resolveFactory(metricCardDecorationSx('primary'), mockTheme);
    expect(styles.position).toBe('absolute');
    expect(styles.opacity).toBe(0.1);
    expect(styles.transform).toBe('rotate(40deg)');
  });
});
