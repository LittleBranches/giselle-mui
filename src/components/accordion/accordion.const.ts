/**
 * Minimum touch target size (px) for the done-toggle checkbox.
 *
 * WCAG 2.5.8 (Level AA) requires interactive targets to be at least 24 × 24 px.
 * MUI Checkbox in `size="small"` mode renders a 38 × 38 px touch target by
 * default, which exceeds this minimum. This constant documents the floor so
 * regression tests can enforce it even if the checkbox padding is ever changed.
 */
export const ACCORDION_DONE_MIN_TOUCH_TARGET = 24;
