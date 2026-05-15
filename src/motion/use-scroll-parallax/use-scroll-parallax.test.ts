// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import {
  LAYER_MULTIPLIERS,
  USE_SCROLL_PARALLAX_SPRING_MASS,
  USE_SCROLL_PARALLAX_SPRING_DAMPING,
  USE_SCROLL_PARALLAX_SPRING_STIFFNESS,
} from './use-scroll-parallax.const';

// ----------------------------------------------------------------------

describe('use-scroll-parallax constants', () => {
  it('LAYER_MULTIPLIERS has 5 elements', () => {
    expect(LAYER_MULTIPLIERS).toHaveLength(5);
  });

  it('LAYER_MULTIPLIERS[0] < LAYER_MULTIPLIERS[4] (slowest → fastest)', () => {
    expect(LAYER_MULTIPLIERS[0]).toBeLessThan(LAYER_MULTIPLIERS[4]);
  });

  it('LAYER_MULTIPLIERS values are 40, 80, 120, 160, 200', () => {
    expect([...LAYER_MULTIPLIERS]).toEqual([40, 80, 120, 160, 200]);
  });

  it('spring mass is a positive number', () => {
    expect(USE_SCROLL_PARALLAX_SPRING_MASS).toBeGreaterThan(0);
  });

  it('spring damping is a positive number', () => {
    expect(USE_SCROLL_PARALLAX_SPRING_DAMPING).toBeGreaterThan(0);
  });

  it('spring stiffness is a positive number', () => {
    expect(USE_SCROLL_PARALLAX_SPRING_STIFFNESS).toBeGreaterThan(0);
  });
});
