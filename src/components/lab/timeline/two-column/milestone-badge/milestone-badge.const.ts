/** Minimum readable font size for the milestone date label. Matches `body2`. */
export const MILESTONE_DATE_FONT_SIZE = '0.875rem';

/** Width/height (px) of the subtask icon in the expandable details pill. */
export const MILESTONE_PILL_ICON_SIZE = 16;

/** Font size for the count label in the expandable details pill. */
export const MILESTONE_PILL_TEXT_FONT_SIZE = '0.75rem';

/**
 * Size (px) of the viewed eye icon in the milestone title row.
 * Must meet WCAG 1.4.11 — interactive controls must have visible contrast >= 3:1.
 * Never set below 20px.
 */
export const MILESTONE_EYE_ICON_SIZE = 20;

/**
 * Minimum touch-target size (px) for the milestone eye viewed button.
 * Meets WCAG 2.2 AA 2.5.8 — minimum 24 × 24 CSS pixels for pointer targets.
 */
export const MILESTONE_EYE_BUTTON_MIN_SIZE = 28;

/** Icon size (px) for task done-toggle icons in the expanded detail list. Meets minimum inline icon rule (16px). */
export const MILESTONE_TASK_ICON_SIZE = 16;
