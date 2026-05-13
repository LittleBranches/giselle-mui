/**
 * Width and height (px) of the default built-in SVG icons inside `ToggleIconButton`.
 *
 * Set to 20 px — the WCAG 1.4.11 minimum for interactive icons.
 * Never reduce below 20.
 */
export const TOGGLE_ICON_SIZE = 20;

/**
 * Minimum touch target size (px) for `ToggleIconButton`.
 *
 * WCAG 2.5.8 (Level AA) requires interactive targets to be at least 24 × 24 px.
 * MUI `IconButton` in `size="small"` mode renders a ≥ 30 px touch target by
 * default, which exceeds this minimum. This constant documents the floor so
 * regression tests can enforce it if the button padding is ever changed.
 */
export const TOGGLE_MIN_TOUCH_TARGET = 28;
