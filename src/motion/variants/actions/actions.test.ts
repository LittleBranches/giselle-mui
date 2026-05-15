// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import {
  DEFAULT_HOVER_SCALE,
  DEFAULT_TAP_SCALE,
  TRANSITION_HOVER_DURATION,
  TRANSITION_TAP_STIFFNESS,
  TRANSITION_TAP_DAMPING,
  TRANSITION_TAP_TYPE,
} from './actions.const';
import { hover, tap, transitionTap, transitionHover } from './actions';

// ----------------------------------------------------------------------

describe('actions constants', () => {
  it('DEFAULT_HOVER_SCALE is 1.09', () => {
    expect(DEFAULT_HOVER_SCALE).toBe(1.09);
  });

  it('DEFAULT_TAP_SCALE is 0.9', () => {
    expect(DEFAULT_TAP_SCALE).toBe(0.9);
  });

  it('DEFAULT_HOVER_SCALE > 1 (element grows on hover)', () => {
    expect(DEFAULT_HOVER_SCALE).toBeGreaterThan(1);
  });

  it('DEFAULT_TAP_SCALE < 1 (element shrinks on tap)', () => {
    expect(DEFAULT_TAP_SCALE).toBeLessThan(1);
  });

  it('TRANSITION_TAP_TYPE is spring', () => {
    expect(TRANSITION_TAP_TYPE).toBe('spring');
  });
});

describe('hover', () => {
  it('returns default scale', () => {
    expect(hover().scale).toBe(DEFAULT_HOVER_SCALE);
  });

  it('returns custom scale', () => {
    expect(hover(1.05).scale).toBe(1.05);
  });
});

describe('tap', () => {
  it('returns default scale', () => {
    expect(tap().scale).toBe(DEFAULT_TAP_SCALE);
  });

  it('returns custom scale', () => {
    expect(tap(0.95).scale).toBe(0.95);
  });
});

describe('transitionTap', () => {
  it('type is spring', () => {
    expect(transitionTap().type).toBe(TRANSITION_TAP_TYPE);
  });

  it('stiffness equals constant', () => {
    expect(transitionTap().stiffness).toBe(TRANSITION_TAP_STIFFNESS);
  });

  it('damping equals constant', () => {
    expect(transitionTap().damping).toBe(TRANSITION_TAP_DAMPING);
  });

  it('merges custom overrides', () => {
    expect(transitionTap({ stiffness: 200 }).stiffness).toBe(200);
  });
});

describe('transitionHover', () => {
  it('duration equals constant', () => {
    expect(transitionHover().duration).toBe(TRANSITION_HOVER_DURATION);
  });

  it('merges custom overrides', () => {
    expect(transitionHover({ duration: 0.5 }).duration).toBe(0.5);
  });
});
