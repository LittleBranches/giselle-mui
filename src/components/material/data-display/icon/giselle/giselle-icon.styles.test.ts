// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import { giselleIconRootSx } from './giselle-icon.styles';

// ----------------------------------------------------------------------

describe('giselleIconRootSx', () => {
  it('applies the given width and height', () => {
    const sx = giselleIconRootSx(24, 24) as Record<string, unknown>;
    expect(sx.width).toBe(24);
    expect(sx.height).toBe(24);
  });

  it('applies string-based dimensions (e.g. "1rem")', () => {
    const sx = giselleIconRootSx('1rem', '1rem') as Record<string, unknown>;
    expect(sx.width).toBe('1rem');
    expect(sx.height).toBe('1rem');
  });

  it('sets lineHeight to 0 to eliminate inline-block descender gap', () => {
    const sx = giselleIconRootSx(20, 20) as Record<string, unknown>;
    expect(sx.lineHeight).toBe(0);
  });

  it('sets display to inline-flex so icon sits in text flow', () => {
    const sx = giselleIconRootSx(20, 20) as Record<string, unknown>;
    expect(sx.display).toBe('inline-flex');
  });

  it('sets flexShrink to 0 — icon must not compress in a flex container', () => {
    const sx = giselleIconRootSx(20, 20) as Record<string, unknown>;
    expect(sx.flexShrink).toBe(0);
  });

  it('[regression] width and height can differ — supports non-square icons', () => {
    const sx = giselleIconRootSx(24, 36) as Record<string, unknown>;
    expect(sx.width).toBe(24);
    expect(sx.height).toBe(36);
  });
});
