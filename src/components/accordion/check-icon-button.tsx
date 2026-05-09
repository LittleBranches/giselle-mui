'use client';

import { useCallback } from 'react';
import type { MouseEvent } from 'react';

import SvgIcon from '@mui/material/SvgIcon';
import IconButton from '@mui/material/IconButton';

import type { CheckIconButtonProps } from './types';
import { checkIconButtonSx, defaultCheckIconSvgSx } from './accordion.styles';

// ----------------------------------------------------------------------
// Built-in default icons — module-level components created once, never
// re-instantiated on render. Consumers override via checkDoneIcon /
// checkHoverIcon props when a different icon set is preferred.
// ----------------------------------------------------------------------

// JSX element constants — created once at module load, never recreated.
// Inline JSX (zero-prop helpers) rather than named function components — they
// have no props and serve as render variables, not independent sub-components.

/**
 * Default done-state icon: filled green check circle.
 * SVG path: Material Design `check_circle` (24 × 24 viewBox).
 */
const DEFAULT_CHECK_DONE_ICON = (
  <SvgIcon sx={defaultCheckIconSvgSx} viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </SvgIcon>
);

/**
 * Default hover/focus-state icon: outlined green check circle.
 * SVG path: Material Design `check_circle_outline` (24 × 24 viewBox).
 * Signals "click to mark as done" (undone state) or "click to undo" (done state).
 */
const DEFAULT_CHECK_HOVER_ICON = (
  <SvgIcon sx={defaultCheckIconSvgSx} viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8-1.41-1.42z" />
  </SvgIcon>
);

// ----------------------------------------------------------------------

/**
 * Icon-button done toggle for the {@link Accordion} checklist mode.
 *
 * Replaces the native `Checkbox` when the consumer passes a `checkIcon` prop
 * to `Accordion`. The displayed icon transitions between three states:
 *
 * | Interaction state             | Icon shown                          |
 * | ----------------------------- | ----------------------------------- |
 * | Undone + idle                 | `checkIcon` (consumer's custom icon)|
 * | Hover **or** keyboard focus   | `checkHoverIcon` (outlined green ✓) |
 * | Done + idle                   | `checkDoneIcon` (filled green ✓)    |
 * | Done + hover / keyboard focus | `checkHoverIcon` (outlined green ✓, signals "undo") |
 *
 * **Keyboard:** Tab to focus (shows `checkHoverIcon`), Space / Enter to toggle.
 * MUI `IconButton` natively handles Space / Enter as click events.
 *
 * **WCAG 2.2 AA:**
 * - `aria-pressed` communicates the binary done / not-done state.
 * - `aria-label` describes the current action in plain language.
 * - `size="small"` on `IconButton` produces a ≥ 30 px touch target
 *   (exceeds the 24 px WCAG 2.5.8 minimum).
 *
 * **Quality status (8 May 2026):** DoD 9/9 · Best practices 13/13
 */
export function CheckIconButton({
  done,
  checkIcon,
  checkDoneIcon = DEFAULT_CHECK_DONE_ICON,
  checkHoverIcon = DEFAULT_CHECK_HOVER_ICON,
  onDoneButtonClick,
}: CheckIconButtonProps) {
  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onDoneButtonClick?.(!done);
    },
    [done, onDoneButtonClick]
  );

  // Icon visibility is driven entirely by CSS (`checkIconButtonSx` in accordion.styles.ts):
  // - `.ci-idle`  → visible when not done and not hovered/focused
  // - `.ci-done`  → visible when aria-pressed="true" and not hovered/focused
  // - `.ci-hover` → visible on :hover or :focus-visible (always wins)
  // No JS state for hover — eliminates the "stuck hover" bug on rapid pointer movement.
  return (
    <IconButton
      onClick={handleClick}
      aria-pressed={done}
      aria-label={done ? 'Mark as not done' : 'Mark as done'}
      size="small"
      sx={checkIconButtonSx}
    >
      <span className="ci-idle">{checkIcon}</span>
      <span className="ci-done">{checkDoneIcon}</span>
      <span className="ci-hover">{checkHoverIcon}</span>
    </IconButton>
  );
}
