// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import { BREAKPOINTS, BREAKPOINTS_GRID } from './breakpoints';

// ----------------------------------------------------------------------

describe('BREAKPOINTS', () => {
  it('has exactly 4 entries (xs, sm, md, lg)', () => {
    expect(BREAKPOINTS).toHaveLength(4);
  });

  it('contains the four expected widths', () => {
    const widths = BREAKPOINTS.map((bp) => bp.width);
    expect(widths).toEqual([360, 600, 900, 1200]);
  });

  it('is in ascending width order', () => {
    for (let i = 1; i < BREAKPOINTS.length; i++) {
      expect(BREAKPOINTS[i]!.width).toBeGreaterThan(BREAKPOINTS[i - 1]!.width);
    }
  });

  it('labels embed the breakpoint name and px width', () => {
    expect(BREAKPOINTS[0]!.label).toContain('xs');
    expect(BREAKPOINTS[0]!.label).toContain('360');
    expect(BREAKPOINTS[3]!.label).toContain('lg');
    expect(BREAKPOINTS[3]!.label).toContain('1200');
  });

  it('xs starts at 360px — not 0 (not a MUI default clone)', () => {
    expect(BREAKPOINTS[0]!.width).toBe(360);
    expect(BREAKPOINTS[0]!.width).not.toBe(0);
  });
});

// ----------------------------------------------------------------------

describe('BREAKPOINTS_GRID', () => {
  it('has exactly 4 entries (xs, sm, md, lg)', () => {
    expect(BREAKPOINTS_GRID).toHaveLength(4);
  });

  it('mirrors BREAKPOINTS widths and labels', () => {
    BREAKPOINTS.forEach((bp, i) => {
      expect(BREAKPOINTS_GRID[i]!.width).toBe(bp.width);
      expect(BREAKPOINTS_GRID[i]!.label).toBe(bp.label);
    });
  });

  it('cols increase from 1 at xs to 4 at lg', () => {
    expect(BREAKPOINTS_GRID[0]!.cols).toBe(1);
    expect(BREAKPOINTS_GRID[1]!.cols).toBe(2);
    expect(BREAKPOINTS_GRID[2]!.cols).toBe(3);
    expect(BREAKPOINTS_GRID[3]!.cols).toBe(4);
  });

  it('cols are in ascending order', () => {
    for (let i = 1; i < BREAKPOINTS_GRID.length; i++) {
      expect(BREAKPOINTS_GRID[i]!.cols).toBeGreaterThan(BREAKPOINTS_GRID[i - 1]!.cols);
    }
  });
});
