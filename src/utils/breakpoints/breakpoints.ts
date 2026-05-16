/**
 * Storybook/demo breakpoint widths for visual tests and responsive stories.
 *
 * **These are NOT MUI's default breakpoint values.** MUI's xs starts at 0px.
 * These arrays start xs at 360px — the smallest practical device width — which
 * is the correct lower bound for visual demos. xl is intentionally omitted
 * (no common device cap exists at a single fixed width above 1200px).
 *
 * **Why not `theme.breakpoints.values`?**
 * `theme.breakpoints.values` is not available at module scope without a theme
 * instance. These constants are resolvable at import time, making them safe to
 * use in test files, story scaffold, and any non-component context.
 */

// ----------------------------------------------------------------------

/** One entry in a breakpoint list — a human-readable label + pixel width. */
export interface BreakpointEntry {
  /** Display label, e.g. `'xs — 360px'`. */
  label: string;
  /** Container width in pixels. */
  width: number;
}

/** One entry in a breakpoint grid list — adds a column count for grid layouts. */
export interface BreakpointGridEntry extends BreakpointEntry {
  /**
   * Number of columns to show at this breakpoint in a grid layout.
   * Typical values: xs=1, sm=2, md=3, lg=4.
   */
  cols: number;
}

// ----------------------------------------------------------------------

/**
 * Storybook/demo breakpoints for single-column responsive stories.
 *
 * Provides the four Storybook breakpoints (xs/sm/md/lg) in two shapes:
 * - `BREAKPOINTS` — for single-component responsive containers (no `cols`)
 * - `BREAKPOINTS_GRID` — for card/grid responsive containers (with `cols`)
 *
 * Import from `src/stories-defaults.ts` — not from here directly.
 *
 * Usage in Storybook `Responsive` stories:
 * ```tsx
 * {BREAKPOINTS.map(({ label, width }) => (
 *   <Box key={label} sx={[breakpointContainerSx, { width }]}>
 *     <Typography sx={breakpointLabelSx}>{label}</Typography>
 *     <MyComponent />
 *   </Box>
 * ))}
 * ```
 */

/**
 * Storybook demo breakpoints for single-component Responsive stories.
 * xs (360px), sm (600px), md (900px), lg (1200px).
 */
export const BREAKPOINTS: BreakpointEntry[] = [
  { label: 'xs — 360px', width: 360 },
  { label: 'sm — 600px', width: 600 },
  { label: 'md — 900px', width: 900 },
  { label: 'lg — 1200px', width: 1200 },
];

/**
 * Standard MUI breakpoints with responsive column counts for grid layouts.
 *
 * Use in Storybook `Responsive` stories for card grids:
 * ```tsx
 * {BREAKPOINTS_GRID.map(({ label, width, cols }) => (
 *   <Box key={label} sx={[breakpointContainerSx, { width }]}>
 *     <Typography sx={breakpointLabelSx}>{label}</Typography>
 *     <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 2 }}>
 *       {items.map((item) => <MyCard key={item.id} {...item} />)}
 *     </Box>
 *   </Box>
 * ))}
 * ```
 * MUI standard breakpoints for grid-based Responsive stories.
 * Column count scales from 1 (xs) to 4 (lg).
 */
export const BREAKPOINTS_GRID: BreakpointGridEntry[] = [
  { label: 'xs — 360px', width: 360, cols: 1 },
  { label: 'sm — 600px', width: 600, cols: 2 },
  { label: 'md — 900px', width: 900, cols: 3 },
  { label: 'lg — 1200px', width: 1200, cols: 4 },
];
