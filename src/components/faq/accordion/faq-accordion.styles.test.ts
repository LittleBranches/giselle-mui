// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import type { Theme } from '@mui/material/styles';

import { accordionItemSx, contactSectionSx, floatDecorationBase } from './faq-accordion.styles';

// ----------------------------------------------------------------------

const mockTheme = {
  vars: {
    palette: {
      grey: { '500Channel': '145 158 171' },
    },
  },
  transitions: {
    create: () => 'background-color 200ms',
    duration: { shorter: 200 },
  },
  breakpoints: {
    up: (bp: number) => `@media (min-width:${bp}px)`,
  },
} as unknown as Theme;

// ----------------------------------------------------------------------

describe('accordionItemSx', () => {
  it('returns hover bgcolor using channelAlpha at 0.08', () => {
    const styles = (accordionItemSx as (theme: Theme) => Record<string, unknown>)(mockTheme);
    // Uses SSR-safe CSS custom property string — not resolved at build time
    expect((styles['&:hover'] as Record<string, unknown>)['bgcolor']).toBe(
      'rgba(var(--mui-palette-grey-500Channel) / 0.08)'
    );
  });

  it('returns expanded bgcolor using the same channel value', () => {
    const styles = (accordionItemSx as (theme: Theme) => Record<string, unknown>)(mockTheme);
    const expanded = styles['&.MuiAccordion-expanded'] as Record<string, unknown>;
    expect(expanded['bgcolor']).toBe('rgba(var(--mui-palette-grey-500Channel) / 0.08)');
  });

  it('hover and expanded bgcolors are identical', () => {
    const styles = (accordionItemSx as (theme: Theme) => Record<string, unknown>)(mockTheme);
    const hoverBg = (styles['&:hover'] as Record<string, unknown>)['bgcolor'];
    const expandedBg = (styles['&.MuiAccordion-expanded'] as Record<string, unknown>)['bgcolor'];
    expect(hoverBg).toBe(expandedBg);
  });
});

// ----------------------------------------------------------------------

describe('contactSectionSx', () => {
  it('produces a linear-gradient background using the grey 500 channel', () => {
    const styles = contactSectionSx as Record<string, unknown>;
    expect(String(styles['background'])).toContain('linear-gradient');
    expect(String(styles['background'])).toContain('var(--mui-palette-grey-500Channel)');
    expect(String(styles['background'])).toContain('transparent');
  });

  it('uses left-to-right gradient direction', () => {
    const styles = contactSectionSx as Record<string, unknown>;
    expect(String(styles['background'])).toContain('to left');
  });
});

// ----------------------------------------------------------------------

describe('floatDecorationBase', () => {
  it('is hidden by default (display: none)', () => {
    const styles = floatDecorationBase(mockTheme);
    expect(styles['display']).toBe('none');
  });

  it('shows at ≥1440 px breakpoint', () => {
    const styles = floatDecorationBase(mockTheme);
    const mediaKey = '@media (min-width:1440px)';
    expect(styles[mediaKey]).toEqual({ display: 'block' });
  });

  it('is absolutely positioned with z-index 2', () => {
    const styles = floatDecorationBase(mockTheme);
    expect(styles['position']).toBe('absolute');
    expect(styles['zIndex']).toBe(2);
  });
});
