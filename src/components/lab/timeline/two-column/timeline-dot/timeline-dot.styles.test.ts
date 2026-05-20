// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { doneCheckmarkSx, pulseRingAfterSx } from './timeline-dot.styles';
import { getDotSize } from './utils';

// ----------------------------------------------------------------------

describe('doneCheckmarkSx', () => {
  it('applies the given icon size to both width and height', () => {
    const sx = doneCheckmarkSx(23) as Record<string, unknown>;
    expect(sx.width).toBe(23);
    expect(sx.height).toBe(23);
  });

  it('prevents the icon from shrinking in flex containers', () => {
    const sx = doneCheckmarkSx(17) as Record<string, unknown>;
    expect(sx.flexShrink).toBe(0);
  });

  it('includes the checkPop spring animation', () => {
    const sx = doneCheckmarkSx(23) as Record<string, unknown>;
    expect(String(sx.animation)).toContain('0.36s');
    expect(String(sx.animation)).toContain('cubic-bezier');
  });
});

// ----------------------------------------------------------------------

describe('pulseRingAfterSx — pulse ring regression', () => {
  it('[regression] ::after inset value is a string (has CSS unit — bare number produces invalid CSS)', () => {
    const sx = pulseRingAfterSx('primary') as Record<string, unknown>;
    const after = sx['&::after'] as Record<string, unknown>;
    expect(typeof after.inset).toBe('string');
    expect(String(after.inset)).toMatch(/px$/);
  });

  it('[regression] ::after inset extends 5px outside (ring does not clip the dot edge)', () => {
    const sx = pulseRingAfterSx('primary') as Record<string, unknown>;
    const after = sx['&::after'] as Record<string, unknown>;
    expect(String(after.inset)).toBe('-5px');
  });

  it('[regression] ::after uses border-radius 50% so ring is circular', () => {
    const sx = pulseRingAfterSx('warning') as Record<string, unknown>;
    const after = sx['&::after'] as Record<string, unknown>;
    expect(after.borderRadius).toBe('50%');
  });

  it('sets borderColor using the provided effectiveColor palette key', () => {
    const sx = pulseRingAfterSx('warning') as Record<string, unknown>;
    const after = sx['&::after'] as Record<string, unknown>;
    expect(String(after.borderColor)).toContain('warning');
  });
});

// ----------------------------------------------------------------------

describe('getDotSize — phase dot size hierarchy regression', () => {
  it('[regression] phase dot is visibly larger than milestone dot', () => {
    const phaseDotSize = getDotSize(false);
    const milestoneDotSize = getDotSize(true);
    expect(phaseDotSize).toBeGreaterThan(milestoneDotSize);
  });
});
