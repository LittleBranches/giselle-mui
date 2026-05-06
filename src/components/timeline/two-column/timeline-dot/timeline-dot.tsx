import type { Theme, SxProps } from '@mui/material/styles';
import type { HighlightedPaletteKey } from '../types';
import type { TimelineDotComponentProps } from './types';

import Box from '@mui/material/Box';

import { pulseRing } from '../animations';
import { timelineDotInnerSx } from './timeline-dot.styles';
import { getDotSize, getIconSize, normaliseSx } from './utils';
import { DotInner } from './dot-inner';

// Re-exports — keeps existing `import { TimelineDotComponentProps } from './timeline-dot'` working.
export type { TimelineDotComponentProps } from './types';

// ----------------------------------------------------------------------

/**
 * Resolves the effective palette key for a dot.
 *
 * Done dots **always** render as `'success'` regardless of the `color` prop — this
 * is a hard visual contract: the green checkmark is the universal "done" signal on
 * the timeline. Passing any other color when `done=true` would produce a coloured
 * checkmark that conflicts with that signal.
 *
 * Exported so tests can assert the rule independently of theme rendering.
 */
export function resolveEffectiveColor(
  color: HighlightedPaletteKey,
  done: boolean
): HighlightedPaletteKey {
  return done ? 'success' : color;
}

// ----------------------------------------------------------------------

/**
 * Unified dot circle for the timeline component.
 *
 * Replaces both the inner content of MUI `<TimelineDot>` in `timeline-two-column.tsx`
 * and the badge circle in `MilestoneBadge`. The outer separator / positioning wrapper
 * remains in the parent.
 *
 * Two mutually exclusive inner states:
 * 1. `done` → animated checkmark SVG (always success/green — see `resolveEffectiveColor`)
 * 2. default → `icon` prop
 *
 * Active dots show a pulsing ring halo via `::after`.
 * In checklist mode pass `onClick`, `role`, `aria-checked`, `aria-label`, `tabIndex`.
 *
 * ## Overflow strategy
 *
 * The outer Box has `overflow: visible` so the `::after` ring (which extends 5 px
 * outside via `inset: -5`) is not clipped. An inner clip Box with `overflow: hidden`
 * and `border-radius: 50%` keeps the icon inside the circle shape.
 */
export function TimelineDot({
  icon,
  color = 'primary',
  size = 'phase',
  active = false,
  done = false,
  animationKey = 0,
  dotBg,
  onClick,
  onKeyDown,
  role,
  'aria-checked': ariaChecked,
  'aria-label': ariaLabel,
  tabIndex,
  className,
  sx,
  ...other
}: TimelineDotComponentProps) {
  const isMilestone = size === 'milestone';
  const dotSize = getDotSize(isMilestone);
  const iconSize = getIconSize(isMilestone);
  // Done dots always use 'success' — the green checkmark is the universal "done" signal.
  const effectiveColor = resolveEffectiveColor(color, done);

  return (
    // Outer Box: controls size, position context, pulsing ::after ring, interaction.
    // overflow: visible is mandatory — the ring extends 5 px outside via inset: -5
    // and would be clipped by overflow: hidden.
    <Box
      className={className}
      role={role}
      aria-checked={ariaChecked}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      data-active={active && !isMilestone ? 'true' : undefined}
      {...other}
      sx={
        [
          (theme: Theme) => ({
            position: 'relative',
            width: dotSize,
            height: dotSize,
            flexShrink: 0,
            overflow: 'visible',
            ...(onClick && {
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              '&:hover': { opacity: 0.75 },
            }),
            ...(tabIndex !== undefined && {
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor:
                  theme.vars!.palette[effectiveColor]?.main ?? theme.vars!.palette.primary.main,
                outlineOffset: 3,
              },
            }),
          }),
          // Pulsing halo — phase dots only, active state, not done.
          ...(active && !isMilestone && !done
            ? [
                {
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: -5,
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: `${effectiveColor}.main`,
                    animation: `${pulseRing} 1.5s ease-in-out infinite`,
                  },
                },
              ]
            : []),
          ...normaliseSx(sx),
        ] as SxProps<Theme>
      }
    >
      {/* Inner clip Box: clips icon to circle shape; separate from outer so ::after ring is visible. */}
      <Box sx={timelineDotInnerSx(done, dotBg, effectiveColor, isMilestone, !!onClick)}>
        <DotInner done={done} icon={icon} animationKey={animationKey} iconSize={iconSize} />
      </Box>
    </Box>
  );
}
