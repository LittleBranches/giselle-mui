/**
 * Named constants for `PhaseCard` and its internal sub-components.
 *
 * Every size, font-size, and minimum-touch-target value is exported as a named
 * constant so that:
 * - Components reference one authoritative value — no magic numbers.
 * - Regression tests can import the constant and assert it stays above the
 *   WCAG / readability minimum without rendering the full component.
 */

// ── Status badges ─────────────────────────────────────────────────────────────

/** Font size for all status badge labels (Overdue, Now, Date overlap, Scenario). */
export const STATUS_BADGE_FONT_SIZE = '0.75rem';

// ── Corner alert badge ────────────────────────────────────────────────────────

/** Size (px) of the corner alert badge circle container. */
export const CORNER_ALERT_BADGE_SIZE = 26;

/** Icon size (px) inside the corner alert badge circle. */
export const CORNER_ALERT_ICON_SIZE = 16;

/** Icon size (px) inside the corner alert Tooltip list. */
export const CORNER_ALERT_LIST_ICON_SIZE = 16;

// ── Viewed eye button ─────────────────────────────────────────────────────────

/**
 * Icon size (px) for the viewed eye button.
 * Must meet WCAG 1.4.11 — interactive icons must be >= 20px.
 * Never set below 20.
 */
export const PHASE_EYE_ICON_SIZE = 20;

/**
 * Minimum touch-target size (px) for the eye viewed button.
 * Meets WCAG 2.2 AA 2.5.8 — minimum 24 × 24 CSS pixels for pointer targets.
 */
export const EYE_BUTTON_MIN_SIZE = 28;

// ── Active pulsing dot ────────────────────────────────────────────────────────

/** Width and height (px) of the "Now" active pulsing dot. Never set below 12. */
export const ACTIVE_DOT_SIZE = 12;

// ── Expandable details pill ───────────────────────────────────────────────────

/** Width (px) of the subtask icon inside the expandable details count pill. */
export const PHASE_PILL_ICON_SIZE = 16;

/** Font size for the count label inside the expandable details count pill. */
export const PHASE_PILL_TEXT_FONT_SIZE = '0.75rem';

// ── Expanded task list ────────────────────────────────────────────────────────

/**
 * Icon size (px) for task done-toggle icons in the expanded detail list.
 * Meets minimum inline icon rule (16px). Never set below 16.
 */
export const PHASE_TASK_ICON_SIZE = 16;
