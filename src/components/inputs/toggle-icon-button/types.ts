import type { ReactNode } from 'react';
import type { IconButtonProps } from '@mui/material/IconButton';

// ----------------------------------------------------------------------

/**
 * Props for the {@link ToggleIconButton} component.
 *
 * Extends MUI `IconButtonProps` — `size`, `disabled`, `color`, `sx`, `aria-label`,
 * and all other MUI `IconButton` props are forwarded to the root element unchanged.
 * `children` and `onClick` are omitted because `ToggleIconButton` owns them internally.
 * `aria-pressed` is omitted because it is always set from the `pressed` prop.
 *
 * **WCAG note:** Always provide a descriptive `aria-label` that communicates the
 * current state and what will happen on activation, e.g.:
 * - `aria-label={pressed ? 'Remove from favourites' : 'Add to favourites'}`
 * - `aria-label={pressed ? 'Mark as not done' : 'Mark as done'}`
 */
export type ToggleIconButtonProps = Omit<
  IconButtonProps,
  'children' | 'onClick' | 'aria-pressed'
> & {
  /**
   * Whether the button is currently in the pressed (active) state.
   * Controls which icon is displayed at idle and sets `aria-pressed`.
   */
  pressed: boolean;

  /**
   * Icon displayed when the button is idle and not pressed.
   * Required — this is the primary visual indicator of the button's purpose.
   */
  idleIcon: ReactNode;

  /**
   * Icon displayed when `pressed` is `true` and the button is not hovered or focused.
   * Default: built-in filled green check circle SVG.
   */
  pressedIcon?: ReactNode;

  /**
   * Icon displayed on hover or keyboard focus, regardless of `pressed` state.
   * Signals "this button is interactive — click/press to toggle."
   * Default: built-in outlined green check circle SVG.
   */
  hoverIcon?: ReactNode;

  /**
   * Called when the button is activated (click, Space, Enter).
   * Receives the **next** pressed state — the value the button will transition to.
   *
   * Named `onPressedChange` to avoid conflict with React's native HTML `onToggle`
   * event (`ToggleEventHandler`) which has an incompatible signature.
   */
  onPressedChange?: (nextPressed: boolean) => void;
};
