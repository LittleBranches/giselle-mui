/**
 * Minimum touch target size (px) for the done-toggle checkbox.
 *
 * WCAG 2.5.8 (Level AA) requires interactive targets to be at least 24 × 24 px.
 * MUI Checkbox in `size="small"` mode renders a 38 × 38 px touch target by
 * default, which exceeds this minimum. This constant documents the floor so
 * regression tests can enforce it even if the checkbox padding is ever changed.
 */
export const ACCORDION_DONE_MIN_TOUCH_TARGET = 24;

/**
 * Width and height (px) of the default check SVG icons in icon-button mode
 * (`checkIcon`, `checkDoneIcon`, `checkHoverIcon`).
 *
 * Set to 20 px — the minimum for interactive icons per WCAG 1.4.11.
 * Never reduce below 20.
 */
export const ACCORDION_CHECK_ICON_SIZE = 20;

/**
 * Minimum touch target size (px) for the icon-button done toggle.
 *
 * WCAG 2.5.8 requires interactive targets to be ≥ 24 × 24 px.
 * MUI `IconButton` in `size="small"` mode renders a ≥ 30 px touch target
 * by default, which exceeds this minimum. This constant documents the floor
 * for regression tests.
 */
export const ACCORDION_ICON_BUTTON_MIN_SIZE = 28;
