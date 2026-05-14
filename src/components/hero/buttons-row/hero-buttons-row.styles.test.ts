// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import type { Theme } from '@mui/material/styles';

import { rowSx, buttonSx } from './hero-buttons-row.styles';

// ----------------------------------------------------------------------

const mockTheme = {} as unknown as Theme;

function callSx(sx: unknown): Record<string, unknown> {
  return typeof sx === 'function'
    ? (sx as (t: Theme) => Record<string, unknown>)(mockTheme)
    : (sx as Record<string, unknown>);
}

// ----------------------------------------------------------------------

describe('rowSx', () => {
  it('uses flex display', () => {
    expect(callSx(rowSx).display).toBe('flex');
  });

  it('wraps overflowing items', () => {
    expect(callSx(rowSx).flexWrap).toBe('wrap');
  });

  it('centres items horizontally', () => {
    expect(callSx(rowSx).justifyContent).toBe('center');
  });
});

describe('buttonSx', () => {
  it('has a minimum width of 156px', () => {
    expect(callSx(buttonSx).minWidth).toBe(156);
  });

  it('has a height of 48px', () => {
    expect(callSx(buttonSx).height).toBe(48);
  });
});
