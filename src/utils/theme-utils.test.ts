// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { createPaletteChannel, pxToRem, remToPx, varAlpha } from './theme-utils';

// ----------------------------------------------------------------------

describe('varAlpha', () => {
  it('produces a valid rgba string from a space-separated channel', () => {
    expect(varAlpha('99 102 241', 0.08)).toBe('rgba(99, 102, 241, 0.08)');
  });

  it('handles alpha = 0 (fully transparent)', () => {
    expect(varAlpha('0 0 0', 0)).toBe('rgba(0, 0, 0, 0)');
  });

  it('handles alpha = 1 (fully opaque)', () => {
    expect(varAlpha('255 255 255', 1)).toBe('rgba(255, 255, 255, 1)');
  });

  it('handles fractional alpha values', () => {
    expect(varAlpha('10 20 30', 0.5)).toBe('rgba(10, 20, 30, 0.5)');
  });
});

// ----------------------------------------------------------------------

describe('createPaletteChannel', () => {
  it('converts a #-prefixed hex to a space-separated RGB channel', () => {
    expect(createPaletteChannel('#6366f1')).toBe('99 102 241');
  });

  it('converts a bare hex without # prefix', () => {
    expect(createPaletteChannel('6366f1')).toBe('99 102 241');
  });

  it('converts pure black (#000000)', () => {
    expect(createPaletteChannel('#000000')).toBe('0 0 0');
  });

  it('converts pure white (#ffffff)', () => {
    expect(createPaletteChannel('#ffffff')).toBe('255 255 255');
  });

  it('round-trips with varAlpha to produce a valid rgba string', () => {
    const channel = createPaletteChannel('#6366f1');
    expect(varAlpha(channel, 0.08)).toBe('rgba(99, 102, 241, 0.08)');
  });

  it('throws for a 3-digit shorthand hex', () => {
    expect(() => createPaletteChannel('#fff')).toThrow('6-digit');
  });

  it('throws for a completely invalid hex string', () => {
    expect(() => createPaletteChannel('zzzzzz')).toThrow('invalid hex value');
  });
});

// ----------------------------------------------------------------------

describe('pxToRem', () => {
  it('converts 16px → "1rem"', () => {
    expect(pxToRem(16)).toBe('1rem');
  });

  it('converts 14px → "0.875rem"', () => {
    expect(pxToRem(14)).toBe('0.875rem');
  });

  it('converts 24px → "1.5rem"', () => {
    expect(pxToRem(24)).toBe('1.5rem');
  });

  it('converts 0px → "0rem"', () => {
    expect(pxToRem(0)).toBe('0rem');
  });

  it('converts 12px → "0.75rem"', () => {
    expect(pxToRem(12)).toBe('0.75rem');
  });
});

// ----------------------------------------------------------------------

describe('remToPx', () => {
  it('converts 1rem → 16', () => {
    expect(remToPx(1)).toBe(16);
  });

  it('converts 0.875rem → 14', () => {
    expect(remToPx(0.875)).toBe(14);
  });

  it('converts 1.5rem → 24', () => {
    expect(remToPx(1.5)).toBe(24);
  });

  it('converts 0rem → 0', () => {
    expect(remToPx(0)).toBe(0);
  });

  it('round-trips with pxToRem', () => {
    expect(remToPx(Number.parseFloat(pxToRem(20).replace('rem', '')))).toBe(20);
  });
});
