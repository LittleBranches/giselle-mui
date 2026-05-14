// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import { FLIP_IN_ROTATION, FLIP_OUT_ROTATION } from './flip.const';
import { flip } from './flip';

// ----------------------------------------------------------------------

describe('flip constants', () => {
  it('FLIP_IN_ROTATION is -180', () => {
    expect(FLIP_IN_ROTATION).toBe(-180);
  });

  it('FLIP_OUT_ROTATION is 70', () => {
    expect(FLIP_OUT_ROTATION).toBe(70);
  });

  it('FLIP_IN_ROTATION is negative (starts behind the element)', () => {
    expect(FLIP_IN_ROTATION).toBeLessThan(0);
  });
});

describe('flip factory', () => {
  it("'inX' initial.rotateX equals FLIP_IN_ROTATION", () => {
    expect((flip('inX').initial as Record<string, unknown>).rotateX).toBe(FLIP_IN_ROTATION);
  });

  it("'inX' animate.rotateX is 0", () => {
    expect((flip('inX').animate as Record<string, unknown>).rotateX).toBe(0);
  });

  it("'inY' initial.rotateY equals FLIP_IN_ROTATION", () => {
    expect((flip('inY').initial as Record<string, unknown>).rotateY).toBe(FLIP_IN_ROTATION);
  });

  it("'outX' animate.rotateX equals FLIP_OUT_ROTATION", () => {
    expect((flip('outX').animate as Record<string, unknown>).rotateX).toBe(FLIP_OUT_ROTATION);
  });

  it("'outY' animate.rotateY equals FLIP_OUT_ROTATION", () => {
    expect((flip('outY').animate as Record<string, unknown>).rotateY).toBe(FLIP_OUT_ROTATION);
  });
});
