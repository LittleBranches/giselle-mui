import type { SxProps, Theme } from '@mui/material/styles';

import { checkPop } from '../animations';

// ----------------------------------------------------------------------

/**
 * Animated SVG checkmark shown inside a done dot.
 *
 * Dynamic — `iconSize` scales with the dot variant (phase = 23px, milestone = 17px).
 *
 * ⚠️ Performance note: returns a new object on every call.
 * The `DotInner` helper is unmounted/remounted on each `animationKey` change,
 * so the cost is negligible.
 */
export const doneCheckmarkSx = (iconSize: number): SxProps<Theme> => ({
  width: iconSize,
  height: iconSize,
  flexShrink: 0,
  animation: `${checkPop} 0.36s cubic-bezier(0.34, 1.56, 0.64, 1)`,
});

/**
 * Inner clip Box that rounds the dot content to a circle and applies the fill colour.
 *
 * Separate from the outer Box so the `::after` pulsing halo ring is not clipped.
 *
 * @param done - When true the dot is success-green regardless of `dotBg` / `effectiveColor`.
 * @param dotBg - Optional explicit background color string (overrides palette when not done).
 * @param effectiveColor - Resolved MUI palette key (already `'success'` when done).
 * @param isMilestone - Milestone dots get a border + drop shadow.
 * @param hasClickHandler - Adds hover shadow amplification when true.
 */
export const timelineDotInnerSx =
  (
    done: boolean,
    dotBg: string | undefined,
    effectiveColor: string,
    isMilestone: boolean,
    hasClickHandler: boolean
  ): SxProps<Theme> =>
  (theme) => ({
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
        : ((theme.vars!.palette as unknown as Record<string, { main: string }>)[effectiveColor]
            ?.main ?? theme.vars!.palette.primary.main),
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
        (theme.vars!.palette as unknown as Record<string, { mainChannel: string }>)[effectiveColor]
          ?.mainChannel ??
        (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
      } / 0.5)`,
    }),
    ...(hasClickHandler &&
      isMilestone && {
        '&:hover': {
          boxShadow: `0 6px 20px rgba(${
            (theme.vars!.palette as unknown as Record<string, { mainChannel: string }>)[
              effectiveColor
            ]?.mainChannel ??
            (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
          } / 0.6)`,
        },
      }),
  });
