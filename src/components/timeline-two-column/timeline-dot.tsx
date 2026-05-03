import type { ReactNode } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';
import type { BoxProps } from '@mui/material/Box';
import type { HighlightedPaletteKey } from './types';

import Box from '@mui/material/Box';

import { checkPop, pulseRing } from './animations';

// ----------------------------------------------------------------------

export type TimelineDotComponentProps = Omit<BoxProps, 'color' | 'onClick'> & {
  /** Icon to render inside the dot. Accepts a `width` prop for sizing. */
  icon?: ReactNode;
  /** MUI palette key — controls background colour and shadow tint. @default 'primary' */
  color?: HighlightedPaletteKey;
  /**
   * Size variant.
   * - `'phase'`: 42px (all states). Active state adds a pulsing ring halo — no size change.
   * - `'milestone'`: 34px fixed.
   * @default 'phase'
   */
  size?: 'phase' | 'milestone';
  /** Shows pulsing ring halo around the dot (phase size only). Does not change dot size. */
  active?: boolean;
  /**
   * Done state — replaces icon with animated checkmark and dims milestone badges.
   * In checklist mode this is driven by the toggle state; in read-only mode it
   * reflects `phase.milestones[].done` from the data model.
   */
  done?: boolean;
  /**
   * Increment on each done/undone toggle to remount the icon wrapper
   * and restart the spring-pop animation cleanly.
   */
  animationKey?: number;
  /**
   * Overrides the dot circle background colour. Accepts any CSS colour string (e.g. `'#111'`).
   * Useful when a brand icon has a specific colour that clashes with the palette-derived background.
   * Ignored when `done=true` — done dots always render success-green.
   */
  dotBg?: string;
  /** Makes the dot clickable. Omit for decorative (read-only) dots. */
  onClick?: () => void;
};

// ----------------------------------------------------------------------

function getDotSize(isMilestone: boolean): number {
  return isMilestone ? 34 : 42;
}

function getIconSize(isMilestone: boolean): number {
  return isMilestone ? 17 : 23;
}

function normaliseSx(sx: SxProps<Theme> | undefined): SxProps<Theme>[] {
  if (!sx) return [];
  return Array.isArray(sx) ? (sx as SxProps<Theme>[]) : [sx];
}

function DotInner({
  done,
  icon,
  animationKey,
  iconSize,
}: {
  done: boolean;
  icon: ReactNode;
  animationKey: number;
  iconSize: number;
}) {
  if (done) {
    return (
      <Box
        key={animationKey}
        component="svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        sx={{
          width: iconSize,
          height: iconSize,
          flexShrink: 0,
          animation: `${checkPop} 0.36s cubic-bezier(0.34, 1.56, 0.64, 1)`,
        }}
      >
        <polyline points="20 6 9 17 4 12" />
      </Box>
    );
  }

  return (
    <Box
      key={animationKey}
      sx={{
        display: 'flex',
        animation:
          animationKey > 0 ? `${checkPop} 0.36s cubic-bezier(0.34, 1.56, 0.64, 1)` : undefined,
      }}
    >
      {icon}
    </Box>
  );
}

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
          (theme) => ({
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
      <Box
        sx={(theme) => ({
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // All done dots: solid success-green fill with white icon (effectiveColor is already 'success').
          bgcolor:
            !done && dotBg
              ? dotBg
              : (theme.vars!.palette[effectiveColor]?.main ?? theme.vars!.palette.primary.main),
          color: theme.vars!.palette.common.white,
          // Milestone: white separator border + colored drop shadow.
          // boxSizing ensures padding + border are included in the 100%/100% dimensions
          // so the circle never exceeds the outer 34px container regardless of box model reset.
          ...(isMilestone && {
            boxSizing: 'border-box',
            padding: '2px',
            border: '2px solid',
            borderColor: 'background.paper',
            boxShadow: `0 2px 8px rgba(${
              theme.vars!.palette[effectiveColor]?.mainChannel ??
              (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
            } / 0.5)`,
          }),
          ...(onClick &&
            isMilestone && {
              '&:hover': {
                boxShadow: `0 6px 20px rgba(${
                  theme.vars!.palette[effectiveColor]?.mainChannel ??
                  (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
                } / 0.6)`,
              },
            }),
        })}
      >
        <DotInner done={done} icon={icon} animationKey={animationKey} iconSize={iconSize} />
      </Box>
    </Box>
  );
}
