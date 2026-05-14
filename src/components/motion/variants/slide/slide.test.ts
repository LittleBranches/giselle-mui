// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import { SLIDE_DEFAULT_DISTANCE } from './slide.const';
import { slide } from './slide';

// ----------------------------------------------------------------------

describe('slide constant', () => {
  it('SLIDE_DEFAULT_DISTANCE is 160', () => {
    expect(SLIDE_DEFAULT_DISTANCE).toBe(160);
  });
});

describe('slide factory', () => {
  it("'inUp' initial.y equals SLIDE_DEFAULT_DISTANCE", () => {
    expect((slide('inUp').initial as Record<string, unknown>).y).toBe(SLIDE_DEFAULT_DISTANCE);
  });

  it("'inDown' initial.y is negative SLIDE_DEFAULT_DISTANCE", () => {
    expect((slide('inDown').initial as Record<string, unknown>).y).toBe(-SLIDE_DEFAULT_DISTANCE);
  });

  it("'inLeft' initial.x is negative SLIDE_DEFAULT_DISTANCE", () => {
    expect((slide('inLeft').initial as Record<string, unknown>).x).toBe(-SLIDE_DEFAULT_DISTANCE);
  });

  it("'inRight' initial.x equals SLIDE_DEFAULT_DISTANCE", () => {
    expect((slide('inRight').initial as Record<string, unknown>).x).toBe(SLIDE_DEFAULT_DISTANCE);
  });

  it("'outUp' animate.y is negative distance", () => {
    expect((slide('outUp').animate as Record<string, unknown>).y).toBe(-SLIDE_DEFAULT_DISTANCE);
  });

  it('custom distance overrides default', () => {
    expect((slide('inUp', { distance: 80 }).initial as Record<string, unknown>).y).toBe(80);
  });

  it("'inUp' has no opacity (pure positional)", () => {
    expect((slide('inUp').initial as Record<string, unknown>).opacity).toBeUndefined();
  });
});
