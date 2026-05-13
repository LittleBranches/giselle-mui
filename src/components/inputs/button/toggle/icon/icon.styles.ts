import type { SxProps, Theme } from '@mui/material/styles';

import { TOGGLE_ICON_SIZE } from './icon.const';

// ----------------------------------------------------------------------

/**
 * Root sx applied to the `ToggleIconButton` element.
 *
 * Implements CSS-only icon switching via three child spans:
 * - `.ti-idle`    — visible when `aria-pressed="false"` and not hovered/focused
 * - `.ti-pressed` — visible when `aria-pressed="true"` and not hovered/focused
 * - `.ti-hover`   — visible on `:hover` or `:focus-visible`, always wins
 *
 * No JS hover state — eliminates the "stuck hover" bug on rapid pointer movement.
 */
export const rootSx: SxProps<Theme> = {
  padding: 0,
  flexShrink: 0,
  alignSelf: 'center',
  // idle (not pressed)
  '& .ti-idle': { display: 'flex', alignItems: 'center' },
  '& .ti-pressed': { display: 'none' },
  '& .ti-hover': { display: 'none' },
  // pressed
  '&[aria-pressed="true"] .ti-idle': { display: 'none' },
  '&[aria-pressed="true"] .ti-pressed': { display: 'flex', alignItems: 'center' },
  // hover (any pressed state)
  '&:hover .ti-idle': { display: 'none' },
  '&:hover .ti-pressed': { display: 'none' },
  '&:hover .ti-hover': { display: 'flex', alignItems: 'center' },
  // keyboard focus-visible
  '&:focus-visible .ti-idle': { display: 'none' },
  '&:focus-visible .ti-pressed': { display: 'none' },
  '&:focus-visible .ti-hover': { display: 'flex', alignItems: 'center' },
};

/**
 * `SxProps` applied to the built-in default SVG icons (`DEFAULT_PRESSED_ICON`,
 * `DEFAULT_HOVER_ICON` in `toggle-icon-button.defaults.tsx`).
 *
 * - `color: 'success.main'` — green via MUI CSS variables palette.
 * - `fontSize: TOGGLE_ICON_SIZE` — controls `SvgIcon` width/height via its
 *   `width: 1em; height: 1em` internal sizing rule.
 */
export const defaultIconSvgSx: SxProps<Theme> = {
  color: 'success.main',
  fontSize: TOGGLE_ICON_SIZE,
};
