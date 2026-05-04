// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { yearLabelSx } from './spine-connector.styles';

// ----------------------------------------------------------------------

describe('yearLabelSx', () => {
  it('positions the chip at the given margin from the bottom', () => {
    const sx = yearLabelSx(30);
    expect((sx as Record<string, unknown>).bottom).toBe('30px');
  });

  it('centres horizontally over the spine', () => {
    const sx = yearLabelSx(30) as Record<string, unknown>;
    expect(sx.left).toBe('50%');
    expect(sx.transform).toBe('translateX(-50%)');
  });

  it('meets minimum readable font size (0.75rem)', () => {
    const sx = yearLabelSx(30) as Record<string, unknown>;
    expect(sx.fontSize).toBe('0.75rem');
  });

  it('floats above the connector line', () => {
    const sx = yearLabelSx(30) as Record<string, unknown>;
    expect(sx.zIndex).toBe(1);
    expect(sx.position).toBe('absolute');
  });
});
