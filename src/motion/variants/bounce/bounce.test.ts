// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import { BOUNCE_DEFAULT_DISTANCE, BOUNCE_IN_SCALE_KEYFRAMES } from './bounce.const';
import { bounce } from './bounce';

// ----------------------------------------------------------------------

describe('bounce constants', () => {
  it('BOUNCE_DEFAULT_DISTANCE is 720', () => {
    expect(BOUNCE_DEFAULT_DISTANCE).toBe(720);
  });

  it('BOUNCE_IN_SCALE_KEYFRAMES has 6 values', () => {
    expect(BOUNCE_IN_SCALE_KEYFRAMES).toHaveLength(6);
  });

  it('BOUNCE_IN_SCALE_KEYFRAMES starts below 1 and ends at 1', () => {
    expect(BOUNCE_IN_SCALE_KEYFRAMES[0]).toBeLessThan(1);
    expect(BOUNCE_IN_SCALE_KEYFRAMES[BOUNCE_IN_SCALE_KEYFRAMES.length - 1]).toBe(1);
  });
});

describe('bounce factory', () => {
  it("'in' animate.scale uses BOUNCE_IN_SCALE_KEYFRAMES", () => {
    const animate = bounce('in').animate as Record<string, unknown>;
    expect(animate.scale).toEqual([...BOUNCE_IN_SCALE_KEYFRAMES]);
  });

  it("'in' animate.opacity starts at 0", () => {
    const animate = bounce('in').animate as Record<string, unknown>;
    expect((animate.opacity as number[])[0]).toBe(0);
  });

  it("'inUp' first y keyframe equals BOUNCE_DEFAULT_DISTANCE", () => {
    const animate = bounce('inUp').animate as Record<string, unknown>;
    expect((animate.y as number[])[0]).toBe(BOUNCE_DEFAULT_DISTANCE);
  });

  it("'inDown' first y keyframe equals -BOUNCE_DEFAULT_DISTANCE", () => {
    const animate = bounce('inDown').animate as Record<string, unknown>;
    expect((animate.y as number[])[0]).toBe(-BOUNCE_DEFAULT_DISTANCE);
  });

  it('custom distance overrides default', () => {
    const animate = bounce('inUp', { distance: 100 }).animate as Record<string, unknown>;
    expect((animate.y as number[])[0]).toBe(100);
  });

  it("'outUp' last y keyframe is negative (exits upward)", () => {
    const animate = bounce('outUp').animate as Record<string, unknown>;
    const y = animate.y as number[];
    expect(y[y.length - 1]).toBeLessThan(0);
  });
});
