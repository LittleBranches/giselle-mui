import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import ButtonBase from '@mui/material/ButtonBase';

// ----------------------------------------------------------------------

export interface SelectableCardProps extends ButtonBaseProps {
  /**
   * Whether this card is in the selected/pressed state.
   * Maps to `aria-pressed` and applies a 2px ring shadow using `text.primary`.
   * @default false
   */
  selected?: boolean;
  // children is inherited from ButtonBaseProps — no redeclaration needed.
}

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
      sx={[
        (theme) => ({
          // --- Layout reset (ButtonBase is inline-flex by default) ---
          display: 'block',
          width: '100%',
          textAlign: 'left',
          // --- Paper-like surface ---
          p: 2.5,
          borderRadius: 1.5,
          position: 'relative',
          overflow: 'hidden', // Contains the MUI ripple within the border-radius
          border: `1px solid ${theme.vars!.palette.divider}`,
          bgcolor: theme.vars!.palette.background.paper,
          // --- Hover: subtle fill, cursor affordance ---
          cursor: 'pointer',
          transition: theme.transitions.create(['background-color', 'box-shadow'], {
            duration: theme.transitions.duration.shorter,
          }),
          '&:hover': {
            bgcolor: theme.vars!.palette.action.hover,
          },
          // --- Keyboard focus ring ---
          // .Mui-focusVisible is applied by ButtonBase on keyboard navigation only,
          // so mouse users never see this ring (good UX + meets WCAG 2.4.11).
          '&.Mui-focusVisible': {
            outline: `3px solid ${theme.vars!.palette.primary.main}`,
            outlineOffset: 2,
          },
          // --- Selected ring (2px outline using box-shadow, doesn't affect layout) ---
          ...(selected && {
            boxShadow: `0 0 0 2px ${theme.vars!.palette.text.primary}`,
          }),
          // --- Disabled: muted + no pointer (ButtonBase also sets aria-disabled) ---
          '&.Mui-disabled': {
            opacity: 0.48,
            cursor: 'default',
            pointerEvents: 'none',
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {children}
    </ButtonBase>
  );
}
