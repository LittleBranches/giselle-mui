// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import { ROTATE_DEFAULT_DEGREES } from './rotate.const';
import { rotate } from './rotate';

// ----------------------------------------------------------------------

describe('rotate constant', () => {
  it('ROTATE_DEFAULT_DEGREES is 360', () => {
    expect(ROTATE_DEFAULT_DEGREES).toBe(360);
  });
});

describe('rotate factory', () => {
  it("'in' initial.rotate is negative ROTATE_DEFAULT_DEGREES", () => {
    expect((rotate('in').initial as Record<string, unknown>).rotate).toBe(-ROTATE_DEFAULT_DEGREES);
  });

  it("'in' initial.opacity is 0", () => {
    expect((rotate('in').initial as Record<string, unknown>).opacity).toBe(0);
  });

  it("'in' animate.rotate is 0", () => {
    expect((rotate('in').animate as Record<string, unknown>).rotate).toBe(0);
  });

  it("'out' initial.rotate is 0", () => {
    expect((rotate('out').initial as Record<string, unknown>).rotate).toBe(0);
  });

  it('custom degrees override default', () => {
    expect((rotate('in', { deg: 180 }).initial as Record<string, unknown>).rotate).toBe(-180);
  });
});
