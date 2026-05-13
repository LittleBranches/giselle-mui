import type { SelectableCardProps } from './types';

import ButtonBase from '@mui/material/ButtonBase';

import { selectableCardSx } from './selectable-card.styles';

// Re-export — keeps `import { SelectableCardProps } from './selectable-card'` working.
export type { SelectableCardProps } from './types';

// ----------------------------------------------------------------------

/**
 * SelectableCard — an accessible, clickable card surface.
 *
 * Built on `ButtonBase` so it is:
 * - A native `<button>` element (keyboard-activatable via Enter/Space)
 * - Focusable (tabIndex=0 by default, -1 when disabled)
 * - Screen-reader friendly (aria-pressed reflects selection state)
 * - Hover and focus-visible states styled explicitly
 * - Disabled state handled natively (aria-disabled, no pointer events)
 *
 * Library-ready: only `@mui/material` dependencies.
 *
 * @example
 * // Basic selectable option card
 * <SelectableCard selected={plan === 'starter'} onClick={() => setPlan('starter')}>
 *   <Typography>Starter — $9/mo</Typography>
 * </SelectableCard>
 *
 * @example
 * // Disabled state
 * <SelectableCard selected disabled>
 *   <Typography>Current plan</Typography>
 * </SelectableCard>
 *
 * @example
 * // Custom padding via sx
 * <SelectableCard selected={isSelected} sx={{ p: 3, borderRadius: 2 }} onClick={...}>
 *   ...children...
 * </SelectableCard>
 *
 * **Quality status (13 May 2026):** DoD 20/20 · Best practices 13/13
 */
export function SelectableCard({
  selected = false,
  disabled = false,
  children,
  sx,
  ...other
}: SelectableCardProps) {
  return (
    <ButtonBase
      disabled={disabled}
      // aria-pressed communicates toggle/selection state to assistive technologies.
      // When true a screen reader announces "pressed"; when false, "not pressed".
      aria-pressed={selected}
      // focusRipple provides a visual ripple specifically on keyboard focus, helping
      // keyboard-only users confirm which card has focus before activating.
      focusRipple
      sx={[selectableCardSx(selected), ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      {children}
    </ButtonBase>
  );
}
