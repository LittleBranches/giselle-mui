/**
 * Shared breakpoint constants for Storybook Responsive stories.
 *
 * Provides the four MUI standard breakpoints (xs/sm/md/lg) in two shapes:
 * - `BREAKPOINTS` — for single-component responsive containers (no `cols`)
 * - `BREAKPOINTS_GRID` — for card/grid responsive containers (with `cols`)
 *
 * Import from `src/stories-defaults.ts` — not from here directly.
 */

/** One entry in a simple responsive breakpoint list (no grid columns). */
export interface BreakpointEntry {
  /** Human-readable label, e.g. `'xs — 360px'`. */
  label: string;
  /** Pixel width of the constrained container. */
  width: number;
}

/** One entry in a grid-based responsive breakpoint list (with column count). */
export interface BreakpointGridEntry extends BreakpointEntry {
  /** Number of grid columns at this breakpoint. */
  cols: number;
}

/**
 * MUI standard breakpoints for single-component Responsive stories.
 * xs (360px), sm (600px), md (900px), lg (1200px).
 */
export const BREAKPOINTS: BreakpointEntry[] = [
  { label: 'xs — 360px', width: 360 },
  { label: 'sm — 600px', width: 600 },
  { label: 'md — 900px', width: 900 },
  { label: 'lg — 1200px', width: 1200 },
];

/**
 * MUI standard breakpoints for grid-based Responsive stories.
 * Column count scales from 1 (xs) to 4 (lg).
 */
export const BREAKPOINTS_GRID: BreakpointGridEntry[] = [
  { label: 'xs — 360px', width: 360, cols: 1 },
  { label: 'sm — 600px', width: 600, cols: 2 },
  { label: 'md — 900px', width: 900, cols: 3 },
  { label: 'lg — 1200px', width: 1200, cols: 4 },
];
