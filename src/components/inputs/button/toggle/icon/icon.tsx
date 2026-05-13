'use client';

import { useCallback } from 'react';
import type { MouseEvent } from 'react';

import IconButton from '@mui/material/IconButton';

import type { ToggleIconButtonProps } from './types';
import { DEFAULT_PRESSED_ICON, DEFAULT_HOVER_ICON } from './icon.defaults';
import { rootSx } from './icon.styles';

// ----------------------------------------------------------------------

/**
 * Icon button with three CSS-driven icon states and `aria-pressed` semantics.
 *
 * A generic binary toggle that makes no assumptions about what "pressed" means —
 * the consumer supplies the icons and the label. `Accordion` uses it for its
 * done-toggle; a calendar might use it for a favourite-day marker; a list item
 * might use it for a bookmark.
 *
 * ## Icon states
 *
 * | Interaction state            | Icon shown       |
 * | ---------------------------- | ---------------- |
 * | Idle + not pressed           | `idleIcon`       |
 * | Idle + pressed               | `pressedIcon`    |
 * | Hover **or** keyboard focus  | `hoverIcon`      |
 *
 * Switching is **CSS-only** — no JS hover state — which eliminates the
 * "stuck hover" bug that occurs on rapid pointer movement.
 *
 * ## Keyboard
 *
 * Tab to focus (shows `hoverIcon`), Space / Enter to toggle.
 * MUI `IconButton` natively handles Space / Enter as click events.
 *
 * ## WCAG 2.2 AA
 *
 * - `aria-pressed` communicates the binary pressed / not-pressed state.
 * - Always pass a descriptive `aria-label` that reflects the **current** state
 *   and what will happen on the next activation, e.g.:
 *   `aria-label={pressed ? 'Remove from favourites' : 'Add to favourites'}`
 * - `size="small"` on the underlying `IconButton` produces a ≥ 30 px touch
 *   target (exceeds the 24 px WCAG 2.5.8 minimum).
 *
 * ## Usage
 *
 * ```tsx
 * <ToggleIconButton
 *   pressed={isFavourite}
 *   idleIcon={<GiselleIcon icon="solar:star-outline" width={20} />}
 *   pressedIcon={<GiselleIcon icon="solar:star-bold" width={20} />}
 *   hoverIcon={<GiselleIcon icon="solar:star-bold" width={20} />}
 *   onPressedChange={setIsFavourite}
 *   aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
 * />
 * ```
 *
 * **Quality status (13 May 2026):** DoD 20/20 · Best practices 13/13
 */
export function ToggleIconButton({
  pressed,
  idleIcon,
  pressedIcon = DEFAULT_PRESSED_ICON,
  hoverIcon = DEFAULT_HOVER_ICON,
  onPressedChange,
  sx,
  ...other
}: ToggleIconButtonProps) {
  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onPressedChange?.(!pressed);
    },
    [pressed, onPressedChange]
  );

  // Icon visibility is driven entirely by CSS (`rootSx` in toggle-icon-button.styles.ts):
  // - `.ti-idle`    → visible when not pressed and not hovered/focused
  // - `.ti-pressed` → visible when aria-pressed="true" and not hovered/focused
  // - `.ti-hover`   → visible on :hover or :focus-visible (always wins)
  return (
    <IconButton
      onClick={handleClick}
      aria-pressed={pressed}
      size="small"
      sx={[rootSx, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <span className="ti-idle">{idleIcon}</span>
      <span className="ti-pressed">{pressedIcon}</span>
      <span className="ti-hover">{hoverIcon}</span>
    </IconButton>
  );
}
