/**
 * Size of each icon button in the floating nav pill (width and height), in pixels,
 * across breakpoints. All values must meet WCAG 2.2 AA minimum touch target (24 px).
 * The xs value (36px) is larger than the minimum to ensure comfortable tapping on mobile.
 */
export const SUB_NAV_BUTTON_SIZE: { xs: number; sm: number; md: number; lg: number } = {
  xs: 36,
  sm: 38,
  md: 42,
  lg: 44,
};

/** Minimum interactive touch-target size enforced by WCAG 2.2 AA (24 px). */
export const SUB_NAV_BUTTON_MIN_SIZE = 24;

/** Gap (MUI spacing units) between buttons in the pill button row. */
export const PILL_BUTTON_ROW_SPACING = 0.5;
