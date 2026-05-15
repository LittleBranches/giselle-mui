// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import {
  TRANSITION_ENTER_DURATION,
  TRANSITION_EXIT_DURATION,
  TRANSITION_EASE,
} from './transition.const';
import { transitionEnter, transitionExit } from './transition';

// ----------------------------------------------------------------------

describe('transition constants', () => {
  it('TRANSITION_ENTER_DURATION is 0.64', () => {
    expect(TRANSITION_ENTER_DURATION).toBe(0.64);
  });

  it('TRANSITION_EXIT_DURATION is 0.48', () => {
    expect(TRANSITION_EXIT_DURATION).toBe(0.48);
  });

  it('TRANSITION_ENTER_DURATION > TRANSITION_EXIT_DURATION', () => {
    expect(TRANSITION_ENTER_DURATION).toBeGreaterThan(TRANSITION_EXIT_DURATION);
  });

  it('TRANSITION_EASE has 4 values', () => {
    expect(TRANSITION_EASE).toHaveLength(4);
  });
});

describe('transitionEnter', () => {
  it('returns TRANSITION_ENTER_DURATION by default', () => {
    expect(transitionEnter().duration).toBe(TRANSITION_ENTER_DURATION);
  });

  it('returns TRANSITION_EASE by default', () => {
    expect(transitionEnter().ease).toEqual(TRANSITION_EASE);
  });

  it('merges custom overrides', () => {
    expect(transitionEnter({ duration: 0.3 }).duration).toBe(0.3);
  });

  it('custom override does not affect ease', () => {
    expect(transitionEnter({ duration: 0.3 }).ease).toEqual(TRANSITION_EASE);
  });
});

describe('transitionExit', () => {
  it('returns TRANSITION_EXIT_DURATION by default', () => {
    expect(transitionExit().duration).toBe(TRANSITION_EXIT_DURATION);
  });

  it('merges custom overrides', () => {
    expect(transitionExit({ duration: 0.2 }).duration).toBe(0.2);
  });
});
