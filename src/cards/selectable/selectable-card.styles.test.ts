// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import type { Theme } from '@mui/material/styles';

import { selectableCardSx } from './selectable-card.styles';

// ----------------------------------------------------------------------

type StyleFn = (theme: Theme) => Record<string, unknown>;

const mockTheme = {
  vars: {
    palette: {
      divider: 'rgba(145 158 171 / 0.2)',
      background: { paper: '#fff' },
      action: { hover: 'rgba(145 158 171 / 0.08)' },
      primary: { main: '#1976d2' },
      text: { primary: '#212b36' },
    },
  },
  transitions: {
    create: () => 'background-color 200ms',
    duration: { shorter: 200 },
  },
} as unknown as Theme;

describe('selectableCardSx', () => {
  it('displays as block with full width', () => {
    const styles = (selectableCardSx(false) as unknown as StyleFn)(mockTheme);
    expect(styles.display).toBe('block');
    expect(styles.width).toBe('100%');
  });

  it('uses Paper background color', () => {
    const styles = (selectableCardSx(false) as unknown as StyleFn)(mockTheme);
    expect(styles.bgcolor).toBe(mockTheme.vars!.palette.background.paper);
  });

  it('has no boxShadow when not selected', () => {
    const styles = (selectableCardSx(false) as unknown as StyleFn)(mockTheme);
    expect(styles.boxShadow).toBeUndefined();
  });

  it('applies selection ring via boxShadow when selected', () => {
    const styles = (selectableCardSx(true) as unknown as StyleFn)(mockTheme);
    expect(String(styles.boxShadow)).toContain('0 0 0 2px');
    expect(String(styles.boxShadow)).toContain(mockTheme.vars!.palette.text.primary);
  });
});
