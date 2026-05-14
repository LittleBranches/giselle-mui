// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import {
  CONTAINER_STAGGER_CHILDREN,
  CONTAINER_DELAY_CHILDREN,
  CONTAINER_EXIT_STAGGER_DIRECTION,
} from './container.const';
import { container } from './container';

// ----------------------------------------------------------------------

describe('container constants', () => {
  it('CONTAINER_STAGGER_CHILDREN is 0.05', () => {
    expect(CONTAINER_STAGGER_CHILDREN).toBe(0.05);
  });

  it('CONTAINER_DELAY_CHILDREN is 0.05', () => {
    expect(CONTAINER_DELAY_CHILDREN).toBe(0.05);
  });

  it('CONTAINER_EXIT_STAGGER_DIRECTION is -1', () => {
    expect(CONTAINER_EXIT_STAGGER_DIRECTION).toBe(-1);
  });
});

describe('container factory', () => {
  it('animate.transition.staggerChildren equals constant', () => {
    const result = container();
    expect(
      (result.animate as { transition: Record<string, unknown> }).transition.staggerChildren
    ).toBe(CONTAINER_STAGGER_CHILDREN);
  });

  it('animate.transition.delayChildren equals constant', () => {
    const result = container();
    expect(
      (result.animate as { transition: Record<string, unknown> }).transition.delayChildren
    ).toBe(CONTAINER_DELAY_CHILDREN);
  });

  it('exit.transition.staggerDirection equals constant', () => {
    const result = container();
    expect(
      (result.exit as { transition: Record<string, unknown> }).transition.staggerDirection
    ).toBe(CONTAINER_EXIT_STAGGER_DIRECTION);
  });

  it('custom transitionIn overrides staggerChildren', () => {
    const result = container({ transitionIn: { staggerChildren: 0.1 } });
    expect(
      (result.animate as { transition: Record<string, unknown> }).transition.staggerChildren
    ).toBe(0.1);
  });
});
