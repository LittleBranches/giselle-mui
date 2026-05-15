/**
 * Standard MUI breakpoint reference data for stories and components.
 *
 * These values mirror MUI's default breakpoint widths (xs=360, sm=600, md=900, lg=1200)
 * and are the single source of truth for any code that needs to render or test at
 * those widths — Storybook responsive stories, unit tests, and component utilities.
 *
 * **Why not `theme.breakpoints.values`?**
 * `theme.breakpoints.values` starts xs at 0. These arrays start xs at 360px — the
 * smallest practical device width — which is the right lower bound for visual demos.
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
 * Standard MUI breakpoints for single-column responsive demos.
 *
 * Use in Storybook `Responsive` stories:
 * ```tsx
 * {BREAKPOINTS.map(({ label, width }) => (
 *   <Box key={label} sx={[breakpointContainerSx, { width }]}>
 *     <Typography sx={breakpointLabelSx}>{label}</Typography>
 *     <MyComponent />
 *   </Box>
 * ))}
 * ```
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
 */
export const BREAKPOINTS_GRID: BreakpointGridEntry[] = [
  { label: 'xs — 360px', width: 360, cols: 1 },
  { label: 'sm — 600px', width: 600, cols: 2 },
  { label: 'md — 900px', width: 900, cols: 3 },
  { label: 'lg — 1200px', width: 1200, cols: 4 },
];
