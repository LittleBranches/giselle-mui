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
 * provided). Keeps the button at its natural MUI touch-target size and
 * prevents it from shrinking or stretching in the flex row.
 */
export const checkIconButtonSx: SxProps<Theme> = {
  flexShrink: 0,
  alignSelf: 'center',
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
