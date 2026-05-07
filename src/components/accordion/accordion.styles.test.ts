// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import {
  ACCORDION_DONE_MIN_TOUCH_TARGET,
  ACCORDION_CHECK_ICON_SIZE,
  ACCORDION_ICON_BUTTON_MIN_SIZE,
} from './accordion.const';
import {
  summaryRowSx,
  checkboxSx,
  checkIconButtonSx,
  defaultCheckIconSvgSx,
  leadingIconSx,
  summarySx,
} from './accordion.styles';

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

describe('checkIconButtonSx', () => {
  const styles = checkIconButtonSx as Record<string, unknown>;

  it('prevents the icon button from shrinking on small viewports', () => {
    expect(styles['flexShrink']).toBe(0);
  });

  it('vertically centres the icon button in the flex row', () => {
    expect(styles['alignSelf']).toBe('center');
  });
});

// ----------------------------------------------------------------------

describe('defaultCheckIconSvgSx', () => {
  const styles = defaultCheckIconSvgSx as Record<string, unknown>;

  it('applies success.main colour to the default check icons', () => {
    expect(styles['color']).toBe('success.main');
  });

  it('sets fontSize to ACCORDION_CHECK_ICON_SIZE for consistent sizing', () => {
    expect(styles['fontSize']).toBe(ACCORDION_CHECK_ICON_SIZE);
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

  it('[regression] ACCORDION_CHECK_ICON_SIZE >= 20px (WCAG 1.4.11 interactive icons)', () => {
    expect(ACCORDION_CHECK_ICON_SIZE).toBeGreaterThanOrEqual(20);
  });

  it('[regression] ACCORDION_ICON_BUTTON_MIN_SIZE >= 24px (WCAG 2.5.8 touch target)', () => {
    expect(ACCORDION_ICON_BUTTON_MIN_SIZE).toBeGreaterThanOrEqual(24);
  });

  it('[regression] defaultCheckIconSvgSx.fontSize matches ACCORDION_CHECK_ICON_SIZE', () => {
    const styles = defaultCheckIconSvgSx as Record<string, unknown>;
    expect(styles['fontSize']).toBe(ACCORDION_CHECK_ICON_SIZE);
  });
});
