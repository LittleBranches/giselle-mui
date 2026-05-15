/**
 * Shared design-token constants and sx presets for Storybook story scaffold chrome.
 *
 * **Rules (non-negotiable):**
 * - Every story file must import from this file for scaffold patterns.
 * - Never use hardcoded hex, rgb, or rgba values in any `*.stories.tsx` file.
 *   Always derive color values from MUI theme tokens (`text.secondary`, `divider`)
 *   or the Giselle / Mango brand constants exported from this file.
 * - Story scaffold chrome (responsive wrappers, breakpoint labels, dashed borders)
 *   must use the sx constants below — never inline objects.
 *
 * This file is **not** exported from `src/index.ts`. It is story infrastructure only.
 */

import type { SystemStyleObject } from '@mui/system';
import type { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// Giselle / Mango brand palette
// Re-export resolved constants from theme-preset + raw brand-identity colours
// from the Giselle brand spec (copilot-instructions.md).
// ----------------------------------------------------------------------

import {
  GISELLE_PRIMARY_MAIN,
  GISELLE_PRIMARY_DARK_MAIN,
  GISELLE_SECONDARY_MAIN,
} from './utils/theme-preset';

export { GISELLE_PRIMARY_MAIN, GISELLE_PRIMARY_DARK_MAIN, GISELLE_SECONDARY_MAIN };

/** Deep grove green — primary in light mode. Alias of `GISELLE_PRIMARY_MAIN`. */
export const MANGO_DEEP_GROVE = GISELLE_PRIMARY_MAIN;

/** Lime green — primary in dark mode. Alias of `GISELLE_PRIMARY_DARK_MAIN`. */
export const MANGO_LIME = GISELLE_PRIMARY_DARK_MAIN;

/** Mango gold — secondary / brand accent. Alias of `GISELLE_SECONDARY_MAIN`. */
export const MANGO_GOLD = GISELLE_SECONDARY_MAIN;

/** Ripe flesh — warm cream tint used for light backgrounds (`#FFF3CD`). */
export const MANGO_RIPE_FLESH = '#FFF3CD';

/** Dark grove — near-black for dark-mode backgrounds (`#1A2B1A`). */
export const MANGO_DARK_GROVE = '#1A2B1A';

/** Warm tan — light neutral for warm canvas contexts (`#F5EDDC`). */
export const MANGO_WARM_TAN = '#F5EDDC';

// ----------------------------------------------------------------------
// Story scaffold sx constants
// Used by Responsive stories and variant-grid scaffold chrome.
// These constants replace inline sx objects with more than ~3 properties.
// ----------------------------------------------------------------------

/**
 * Outer wrapper for all Responsive stories.
 * Stacks the per-breakpoint containers in a column with consistent gap.
 */
export const responsiveWrapperSx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

/**
 * Caption label above each responsive container (e.g. "360px — xs").
 * Uses `text.secondary` so the label is readable in both light and dark mode.
 */
export const breakpointLabelSx: SystemStyleObject<Theme> = {
  display: 'block',
  mb: 1,
  color: 'text.secondary',
};

/**
 * Dashed border container that constrains a component to a specific breakpoint width.
 *
 * Merge with `{ width }` for the specific pixel value:
 * ```tsx
 * <Box sx={[breakpointContainerSx, { width }]}>
 * ```
 *
 * Uses `borderColor: 'divider'` (MUI theme token) — never a hardcoded colour.
 */
export const breakpointContainerSx: SystemStyleObject<Theme> = {
  border: '1px dashed',
  borderColor: 'divider',
  overflow: 'hidden',
};

/**
 * Flex row that wraps variant tiles (colour-variant grids, state-comparison grids).
 */
export const variantGridSx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 2,
};

/**
 * Content placeholder block for section / layout stories.
 * Renders a lightly tinted `action.hover` fill to represent body content.
 */
export const contentPlaceholderSx: SystemStyleObject<Theme> = {
  bgcolor: 'action.hover',
  p: 3,
  borderRadius: 1,
};

/**
 * Vertical centre-aligned column for stacking dots, icons, or small badges
 * with labels below them (used in timeline-dot stories and similar).
 */
export const dotColumnSx: SystemStyleObject<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 1,
};

/**
 * Wrapper for full-width timeline story demos.
 * Constrains to 960 px and centres with auto margins.
 */
export const timelineStoryWrapperSx: SystemStyleObject<Theme> = {
  maxWidth: 960,
  mx: 'auto',
  p: 3,
};
