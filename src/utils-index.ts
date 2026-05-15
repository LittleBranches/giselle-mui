/**
 * @alexrebula/giselle-mui/utils — server-safe utility exports.
 *
 * This sub-path contains only pure TypeScript functions and types.
 * No React components, no `'use client'` directive.
 * Safe to import from Next.js Server Components and data files.
 */

export { channelAlpha, hexToChannel, pxToRem, remToPx } from './utils/theme-utils';
export { isDeepEqual } from './utils/is-deep-equal';
export { getCookieValue, setCookieValue } from './utils/cookie';
export type { SetCookieOptions } from './utils/cookie';
export { resolveMaturityColor, resolveMaturityLabel } from './utils/maturity-utils';
export { assignMilestoneSidesByDone } from './utils/timeline-utils';
export {
  giselleTheme,
  giselleThemeOptions,
  GISELLE_PRIMARY_MAIN,
  GISELLE_PRIMARY_DARK_MAIN,
  GISELLE_SECONDARY_MAIN,
} from './utils/theme-preset';
export { BREAKPOINTS, BREAKPOINTS_GRID } from './utils/breakpoints';
export type { BreakpointEntry, BreakpointGridEntry } from './utils/breakpoints';
export { preloadImages } from './utils/use-image-preloader';
