// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import { FADE_DEFAULT_DISTANCE } from './fade.const';
import { fade } from './fade';

// ----------------------------------------------------------------------

describe('fade constant', () => {
  it('FADE_DEFAULT_DISTANCE is 120', () => {
    expect(FADE_DEFAULT_DISTANCE).toBe(120);
  });
});

describe('fade factory', () => {
  it("'in' sets opacity 0 on initial", () => {
    expect(fade('in').initial).toEqual({ opacity: 0 });
  });

  it("'in' sets opacity 1 on animate", () => {
    const animate = fade('in').animate as Record<string, unknown>;
    expect(animate.opacity).toBe(1);
  });

  it("'inUp' uses FADE_DEFAULT_DISTANCE as y offset", () => {
    const initial = fade('inUp').initial as Record<string, unknown>;
    expect(initial.y).toBe(FADE_DEFAULT_DISTANCE);
  });

  it("'inUp' with custom distance overrides default", () => {
    const initial = fade('inUp', { distance: 50 }).initial as Record<string, unknown>;
    expect(initial.y).toBe(50);
  });

  it("'inDown' negates the distance", () => {
    const initial = fade('inDown').initial as Record<string, unknown>;
    expect(initial.y).toBe(-FADE_DEFAULT_DISTANCE);
  });

  it("'inLeft' negates the x distance", () => {
    const initial = fade('inLeft').initial as Record<string, unknown>;
    expect(initial.x).toBe(-FADE_DEFAULT_DISTANCE);
  });

  it("'inRight' uses positive x distance", () => {
    const initial = fade('inRight').initial as Record<string, unknown>;
    expect(initial.x).toBe(FADE_DEFAULT_DISTANCE);
  });

  it("'out' starts at opacity 1", () => {
    expect(fade('out').initial).toEqual({ opacity: 1 });
  });

  it("'outUp' animates to negative y", () => {
    const animate = fade('outUp').animate as Record<string, unknown>;
    expect(animate.y).toBe(-FADE_DEFAULT_DISTANCE);
  });

  it("'outLeft' animates to negative x", () => {
    const animate = fade('outLeft').animate as Record<string, unknown>;
    expect(animate.x).toBe(-FADE_DEFAULT_DISTANCE);
  });
});
