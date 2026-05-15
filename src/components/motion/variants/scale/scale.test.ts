// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import { scale } from './scale';

// ----------------------------------------------------------------------

describe('scale factory', () => {
  it("'in' initial: scale=0, opacity=0", () => {
    expect(scale('in').initial).toEqual({ scale: 0, opacity: 0 });
  });

  it("'in' animate: scale=1, opacity=1", () => {
    const animate = scale('in').animate as Record<string, unknown>;
    expect(animate.scale).toBe(1);
    expect(animate.opacity).toBe(1);
  });

  it("'out' initial: scale=1, opacity=1", () => {
    expect(scale('out').initial).toEqual({ scale: 1, opacity: 1 });
  });

  it("'inX' initial: scaleX=0", () => {
    expect((scale('inX').initial as Record<string, unknown>).scaleX).toBe(0);
  });

  it("'inY' initial: scaleY=0", () => {
    expect((scale('inY').initial as Record<string, unknown>).scaleY).toBe(0);
  });

  it("'outX' animate: scaleX=0", () => {
    expect((scale('outX').animate as Record<string, unknown>).scaleX).toBe(0);
  });
});
