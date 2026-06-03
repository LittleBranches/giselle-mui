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
  MANGO_RIPE_FLESH,
  MANGO_DARK_GROVE,
  MANGO_WARM_TAN,
} from './utils/theme/preset/theme-preset';
import { BREAKPOINTS, BREAKPOINTS_GRID } from './utils/breakpoints/breakpoints';
export type { BreakpointEntry, BreakpointGridEntry } from './utils/breakpoints/breakpoints';

export { GISELLE_PRIMARY_MAIN, GISELLE_PRIMARY_DARK_MAIN, GISELLE_SECONDARY_MAIN };
export { MANGO_RIPE_FLESH, MANGO_DARK_GROVE, MANGO_WARM_TAN };
export { BREAKPOINTS, BREAKPOINTS_GRID };

/** Deep grove green — primary in light mode. Alias of `GISELLE_PRIMARY_MAIN`. */
export const MANGO_DEEP_GROVE = GISELLE_PRIMARY_MAIN;

/** Lime green — primary in dark mode. Alias of `GISELLE_PRIMARY_DARK_MAIN`. */
export const MANGO_LIME = GISELLE_PRIMARY_DARK_MAIN;

/** Mango gold — secondary / brand accent. Alias of `GISELLE_SECONDARY_MAIN`. */
export const MANGO_GOLD = GISELLE_SECONDARY_MAIN;

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
 * Use with a factory for the pixel value — never inline `sx={[breakpointContainerSx, { width }]}`:
 * ```tsx
 * <Box sx={buildBreakpointWidthSx(width)}>
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
 * Factory for a breakpoint container at a specific pixel width.
 * Use instead of `sx={[breakpointContainerSx, { width }]}` in Responsive stories.
 *
 * @example
 * ```tsx
 * {BREAKPOINTS.map(({ label, width }) => (
 *   <Box key={width} sx={buildBreakpointWidthSx(width)}>
 * ```
 */
export const buildBreakpointWidthSx = (width: number): SystemStyleObject<Theme> => ({
  ...breakpointContainerSx,
  width,
});

/**
 * Like `buildBreakpointWidthSx` but adds `p: 1` padding inside the container —
 * for stories whose component needs inner breathing room.
 */
export const buildBreakpointPaddedWidthSx = (width: number): SystemStyleObject<Theme> => ({
  ...breakpointContainerSx,
  p: 1,
  width,
});

/**
 * Like `buildBreakpointWidthSx` but adds `maxWidth: '100%'` —
 * for components that must not exceed the viewport width on small screens.
 */
export const buildBreakpointMaxWidthSx = (width: number): SystemStyleObject<Theme> => ({
  ...breakpointContainerSx,
  maxWidth: '100%',
  width,
});

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
// ----------------------------------------------------------------------
// Shared placeholder assets for Storybook stories.
//
// Use these instead of external URLs (via.placeholder.com, picsum, etc.) so stories
// are self-contained and work offline / in CI without network access.
// ----------------------------------------------------------------------

function svgDataUri(width: number, height: number, fill: string, label: string): string {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`,
    `<rect width="${width}" height="${height}" fill="${fill}"/>`,
    `<text x="${width / 2}" y="${Math.round(height * 0.55)}" `,
    `font-family="sans-serif" font-size="${Math.round(width / 10)}" `,
    `fill="#fff" text-anchor="middle">${label}</text>`,
    `</svg>`,
  ].join('');
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Placeholder for the artistic logo overlay slot (240×240, mango gold).
 *
 * Use wherever a story needs an `artisticLogoSrc` but no real asset is available.
 */
export const PLACEHOLDER_ART_SRC = svgDataUri(240, 240, '#F5A623', 'art');

/**
 * Placeholder for the portrait slot (480×480, deep grove green).
 *
 * Use wherever a story needs a `portraitSrc` but no real asset is available.
 */
export const PLACEHOLDER_PORTRAIT_SRC = svgDataUri(480, 480, '#2E7D32', 'portrait');
