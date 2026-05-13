// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import { ACCORDION_DONE_MIN_TOUCH_TARGET } from './accordion.const';
import { summaryRowSx, checkboxSx, leadingIconSx, summarySx } from './accordion.styles';

// ----------------------------------------------------------------------

describe('summaryRowSx', () => {
  const styles = summaryRowSx as Record<string, unknown>;

  it('uses display flex for the side-by-side layout', () => {
    expect(styles['display']).toBe('flex');
  });

  it('vertically centres the checkbox and summary', () => {
    expect(styles['alignItems']).toBe('center');
  });
});

// ----------------------------------------------------------------------

describe('checkboxSx', () => {
  const styles = checkboxSx as Record<string, unknown>;

  it('prevents the checkbox from shrinking on small viewports', () => {
    expect(styles['flexShrink']).toBe(0);
  });
});

// ----------------------------------------------------------------------

describe('leadingIconSx', () => {
  const styles = leadingIconSx as Record<string, unknown>;

  it('uses display flex', () => {
    expect(styles['display']).toBe('flex');
  });

  it('vertically centres the icon', () => {
    expect(styles['alignItems']).toBe('center');
  });

  it('prevents the icon from shrinking', () => {
    expect(styles['flexShrink']).toBe(0);
  });
});

// ----------------------------------------------------------------------

describe('summarySx', () => {
  const styles = summarySx as Record<string, unknown>;

  it('grows to fill remaining row width', () => {
    expect(styles['flex']).toBe(1);
  });

  it('allows title text truncation via minWidth 0', () => {
    expect(styles['minWidth']).toBe(0);
  });
});

// ----------------------------------------------------------------------

describe('readability — minimum size constants', () => {
  it('[regression] ACCORDION_DONE_MIN_TOUCH_TARGET >= 24px (WCAG 2.5.8)', () => {
    expect(ACCORDION_DONE_MIN_TOUCH_TARGET).toBeGreaterThanOrEqual(24);
  });
});
