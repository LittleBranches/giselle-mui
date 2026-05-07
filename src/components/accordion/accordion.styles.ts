import type { SxProps, Theme } from '@mui/material/styles';

import { ACCORDION_CHECK_ICON_SIZE } from './accordion.const';

// ----------------------------------------------------------------------

/**
 * Flex row containing the optional leading element (checkbox or icon) and
 * the `AccordionSummary`. The checkbox and summary are siblings — never
 * nested — which is required for WCAG 2.2 AA compliance (no interactive
 * element may be a descendant of another interactive element).
 */
export const summaryRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
};

/**
 * Done-toggle checkbox sizing. Keeps the checkbox flush at its natural
 * size with `flexShrink: 0` so it is never squeezed by a long title.
 */
export const checkboxSx: SxProps<Theme> = {
  flexShrink: 0,
  alignSelf: 'center',
};

/**
 * Done-toggle icon button (used in icon-button mode when `checkIcon` is
 * provided).
 *
 * Uses CSS-only icon switching — no JS hover state — so icons never get
 * stuck in the wrong state on rapid pointer movement.
 *
 * Rules:
 * - idle (not done)  → `.ci-idle` visible
 * - done             → `.ci-done` visible  (`aria-pressed="true"` selector)
 * - hover or :focus-visible → `.ci-hover` visible (overrides both above)
 */
export const checkIconButtonSx: SxProps<Theme> = {
  padding: 0,
  flexShrink: 0,
  alignSelf: 'center',
  // idle — not done
  '& .ci-idle': { display: 'flex', alignItems: 'center' },
  '& .ci-done': { display: 'none' },
  '& .ci-hover': { display: 'none' },
  // done
  '&[aria-pressed="true"] .ci-idle': { display: 'none' },
  '&[aria-pressed="true"] .ci-done': { display: 'flex', alignItems: 'center' },
  // hover (any done state)
  '&:hover .ci-idle': { display: 'none' },
  '&:hover .ci-done': { display: 'none' },
  '&:hover .ci-hover': { display: 'flex', alignItems: 'center' },
  // keyboard focus-visible
  '&:focus-visible .ci-idle': { display: 'none' },
  '&:focus-visible .ci-done': { display: 'none' },
  '&:focus-visible .ci-hover': { display: 'flex', alignItems: 'center' },
};

/**
 * `SxProps` applied to the default built-in check SVG icons
 * (`FilledCheckCircleIcon` and `OutlinedCheckCircleIcon`).
 *
 * - `color: 'success.main'` — green colour via MUI CSS variables palette.
 * - `fontSize: ACCORDION_CHECK_ICON_SIZE` — controls `SvgIcon` width/height
 *   via its internal `width: 1em; height: 1em` sizing.
 */
export const defaultCheckIconSvgSx: SxProps<Theme> = {
  color: 'success.main',
  fontSize: ACCORDION_CHECK_ICON_SIZE,
};

/**
 * Non-checklist leading icon wrapper.
 * - `aria-hidden="true"` is set on the wrapping element in JSX (decorative).
 * - `display: 'flex'` + `alignItems: 'center'` centres the icon vertically.
 * - `px: 1` adds breathing room between the accordion edge and the icon.
 */
export const leadingIconSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  px: 1,
};

/**
 * `AccordionSummary` grows to fill remaining row width.
 * `minWidth: 0` ensures long titles can be truncated via text-overflow in
 * child `<Typography>` components rather than overflowing the container.
 */
export const summarySx: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
};
