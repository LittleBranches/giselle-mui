// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import { ZOOM_DEFAULT_DISTANCE } from './zoom.const';
import { zoom } from './zoom';

// ----------------------------------------------------------------------

describe('zoom constant', () => {
  it('ZOOM_DEFAULT_DISTANCE is 720', () => {
    expect(ZOOM_DEFAULT_DISTANCE).toBe(720);
  });
});

describe('zoom factory', () => {
  it("'in' initial: scale=0, opacity=0", () => {
    expect(zoom('in').initial).toEqual({ scale: 0, opacity: 0 });
  });

  it("'in' animate: scale=1, opacity=1", () => {
    const animate = zoom('in').animate as Record<string, unknown>;
    expect(animate.scale).toBe(1);
    expect(animate.opacity).toBe(1);
  });

  it("'inUp' initial.translateY equals ZOOM_DEFAULT_DISTANCE", () => {
    expect((zoom('inUp').initial as Record<string, unknown>).translateY).toBe(ZOOM_DEFAULT_DISTANCE);
  });

  it("'inDown' initial.translateY is negative ZOOM_DEFAULT_DISTANCE", () => {
    expect((zoom('inDown').initial as Record<string, unknown>).translateY).toBe(-ZOOM_DEFAULT_DISTANCE);
  });

  it("'inLeft' initial.translateX is negative ZOOM_DEFAULT_DISTANCE", () => {
    expect((zoom('inLeft').initial as Record<string, unknown>).translateX).toBe(-ZOOM_DEFAULT_DISTANCE);
  });

  it("custom distance overrides default", () => {
    expect((zoom('inUp', { distance: 200 }).initial as Record<string, unknown>).translateY).toBe(200);
  });

  it("'out' initial: scale=1, opacity=1", () => {
    expect(zoom('out').initial).toEqual({ scale: 1, opacity: 1 });
  });
});
