// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { doneCheckmarkSx } from './styles';

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
