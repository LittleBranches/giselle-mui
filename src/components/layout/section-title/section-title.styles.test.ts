// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import type { Theme } from '@mui/material/styles';

import { txtGradientSpanSx } from './section-title.styles';

// ----------------------------------------------------------------------

const mockTheme = {
  vars: {
    palette: {
      text: {
        primary: 'rgb(33 43 54)',
        primaryChannel: '33 43 54',
      },
    },
  },
} as unknown as Theme;

type StyleFn = (theme: Theme) => Record<string, unknown>;

describe('txtGradientSpanSx', () => {
  it('returns opacity 0.4', () => {
    const styles = (txtGradientSpanSx as unknown as StyleFn)(mockTheme);
    expect(styles.opacity).toBe(0.4);
  });

  it('uses background-clip text gradient', () => {
    const styles = (txtGradientSpanSx as unknown as StyleFn)(mockTheme);
    expect(styles.WebkitBackgroundClip).toBe('text');
    expect(styles.backgroundClip).toBe('text');
    expect(styles.WebkitTextFillColor).toBe('transparent');
    expect(styles.color).toBe('transparent');
  });

  it('builds linear-gradient from theme text.primary channel', () => {
    const styles = (txtGradientSpanSx as unknown as StyleFn)(mockTheme);
    expect(styles.background).toContain('linear-gradient(to right');
    expect(styles.background).toContain('rgb(33 43 54)');
  });
});
