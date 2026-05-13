import SvgIcon from '@mui/material/SvgIcon';

import { defaultIconSvgSx } from './toggle-icon-button.styles';

// ----------------------------------------------------------------------
// Built-in default icons — created once at module load, never recreated.
// Consumers override via `pressedIcon` / `hoverIcon` props when a different
// icon set is preferred.
// ----------------------------------------------------------------------

/**
 * Default pressed-state icon: filled green check circle.
 * SVG path: Material Design `check_circle` (24 × 24 viewBox).
 *
 * @internal — used by {@link ToggleIconButton} default prop only.
 */
export const DEFAULT_PRESSED_ICON = (
  <SvgIcon sx={defaultIconSvgSx} viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </SvgIcon>
);

/**
 * Default hover/focus-state icon: outlined green check circle.
 * SVG path: Material Design `check_circle_outline` (24 × 24 viewBox).
 * Signals "click/press to toggle" regardless of the current pressed state.
 *
 * @internal — used by {@link ToggleIconButton} default prop only.
 */
export const DEFAULT_HOVER_ICON = (
  <SvgIcon sx={defaultIconSvgSx} viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8-1.41-1.42z" />
  </SvgIcon>
);
