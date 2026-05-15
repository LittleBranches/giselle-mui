import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/**
 * Root sx applied to the MuiAccordion element. Stable empty object so that
 * consumer `sx` merging via `sx={[accordionRootSx, ...consumerSx]}` never
 * creates a new object reference on every render.
 */
export const accordionRootSx: SxProps<Theme> = {};

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
