// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import { TOGGLE_ICON_SIZE, TOGGLE_MIN_TOUCH_TARGET } from './icon.const';
import { rootSx, defaultIconSvgSx } from './icon.styles';

// ----------------------------------------------------------------------

describe('rootSx', () => {
  const styles = rootSx as Record<string, unknown>;

  it('prevents the icon button from shrinking on small viewports', () => {
    expect(styles['flexShrink']).toBe(0);
  });

  it('vertically centres the icon button in its flex container', () => {
    expect(styles['alignSelf']).toBe('center');
  });

  it('shows .ti-idle by default (not pressed, not hovered)', () => {
    const idle = styles['& .ti-idle'] as Record<string, unknown>;
    expect(idle['display']).toBe('flex');
  });

  it('hides .ti-pressed and .ti-hover by default', () => {
    const pressed = styles['& .ti-pressed'] as Record<string, unknown>;
    const hover = styles['& .ti-hover'] as Record<string, unknown>;
    expect(pressed['display']).toBe('none');
    expect(hover['display']).toBe('none');
  });

  it('shows .ti-pressed when aria-pressed="true"', () => {
    const pressedState = styles['&[aria-pressed="true"] .ti-pressed'] as Record<string, unknown>;
    expect(pressedState['display']).toBe('flex');
  });

  it('hides .ti-idle when aria-pressed="true"', () => {
    const idleWhenPressed = styles['&[aria-pressed="true"] .ti-idle'] as Record<string, unknown>;
    expect(idleWhenPressed['display']).toBe('none');
  });

  it('shows .ti-hover on :hover', () => {
    const hoverState = styles['&:hover .ti-hover'] as Record<string, unknown>;
    expect(hoverState['display']).toBe('flex');
  });

  it('hides .ti-idle and .ti-pressed on :hover', () => {
    const idleOnHover = styles['&:hover .ti-idle'] as Record<string, unknown>;
    const pressedOnHover = styles['&:hover .ti-pressed'] as Record<string, unknown>;
    expect(idleOnHover['display']).toBe('none');
    expect(pressedOnHover['display']).toBe('none');
  });

  it('shows .ti-hover on :focus-visible', () => {
    const focusHover = styles['&:focus-visible .ti-hover'] as Record<string, unknown>;
    expect(focusHover['display']).toBe('flex');
  });
});

// ----------------------------------------------------------------------

describe('defaultIconSvgSx', () => {
  const styles = defaultIconSvgSx as Record<string, unknown>;

  it('applies success.main colour to the default icons', () => {
    expect(styles['color']).toBe('success.main');
  });

  it('sets fontSize to TOGGLE_ICON_SIZE for consistent sizing', () => {
    expect(styles['fontSize']).toBe(TOGGLE_ICON_SIZE);
  });
});

// ----------------------------------------------------------------------

describe('readability — minimum size constants', () => {
  it('[regression] TOGGLE_ICON_SIZE >= 20px (WCAG 1.4.11 interactive icons)', () => {
    expect(TOGGLE_ICON_SIZE).toBeGreaterThanOrEqual(20);
  });

  it('[regression] TOGGLE_MIN_TOUCH_TARGET >= 24px (WCAG 2.5.8 touch target)', () => {
    expect(TOGGLE_MIN_TOUCH_TARGET).toBeGreaterThanOrEqual(24);
  });

  it('[regression] defaultIconSvgSx.fontSize matches TOGGLE_ICON_SIZE', () => {
    const styles = defaultIconSvgSx as Record<string, unknown>;
    expect(styles['fontSize']).toBe(TOGGLE_ICON_SIZE);
  });
});
