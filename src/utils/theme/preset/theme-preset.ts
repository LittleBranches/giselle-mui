/**
 * Giselle brand theme preset for MUI v7 CSS Variables mode.
 *
 * Defines the Giselle ecosystem's default palette as a ready-to-use
 * `extendTheme()` result. Pass directly to `ThemeProvider` or use the
 * zero-config `GiselleThemeProvider` wrapper (Phase C).
 *
 * **Brand palette — the Carabao mango tree:**
 * - Primary   — Deep grove green `#2E7D32` (Lime `#76C442` in dark mode)
 * - Secondary — Mango gold `#F5A623`
 */

import { extendTheme } from '@mui/material/styles';
import type { CssVarsThemeOptions } from '@mui/material/styles';

// ----------------------------------------------------------------------
// Brand palette constants
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// Mango brand-identity palette (not mapped to MUI palette roles)
// Used in story scaffold chrome and brand-specific UI elements.
// ----------------------------------------------------------------------

/** Ripe mango flesh — warm cream for light backgrounds (`#FFF3CD`). */
export const MANGO_RIPE_FLESH = '#FFF3CD';

/** Dark grove — near-black for dark-mode canvas backgrounds (`#1A2B1A`). */
export const MANGO_DARK_GROVE = '#1A2B1A';

/** Warm tan — light neutral for warm canvas contexts (`#F5EDDC`). */
export const MANGO_WARM_TAN = '#F5EDDC';

// ----------------------------------------------------------------------
// MUI palette role constants
// ----------------------------------------------------------------------

/**
 * Giselle brand primary colour — Deep grove green `#2E7D32`.
 *
 * Used as the light-mode primary. Achieves 4.76:1 contrast against white —
 * passes WCAG 2.1 AA for normal text.
 */
export const GISELLE_PRIMARY_MAIN = '#2E7D32';

/**
 * Giselle brand primary colour in dark mode — Lime green `#76C442`.
 *
 * Lighter variant applied as `primary.main` in the dark colour scheme so
 * primary-tinted surfaces and text remain readable on dark backgrounds.
 */
export const GISELLE_PRIMARY_DARK_MAIN = '#76C442';

/**
 * Giselle brand secondary colour — Mango gold `#F5A623`.
 *
 * The Carabao mango accent. Identical in both light and dark colour schemes.
 */
export const GISELLE_SECONDARY_MAIN = '#F5A623';

// ----------------------------------------------------------------------
// Theme preset
// ----------------------------------------------------------------------

/**
 * The Giselle brand theme options — the raw input to `extendTheme()`.
 *
 * Use this constant when you need to deep-merge Giselle palette defaults
 * with consumer overrides before resolving the final theme. Prefer
 * `giselleTheme` when you only need the already-resolved theme object.
 */
export const giselleThemeOptions: CssVarsThemeOptions = {
  colorSchemes: {
    light: {
      palette: {
        primary: { main: GISELLE_PRIMARY_MAIN },
        secondary: { main: GISELLE_SECONDARY_MAIN },
        info: { main: '#0288D1' },
        success: { main: '#388E3C' },
        warning: { main: '#ED6C02' },
        error: { main: '#D32F2F' },
      },
    },
    dark: {
      palette: {
        primary: { main: GISELLE_PRIMARY_DARK_MAIN },
        secondary: { main: GISELLE_SECONDARY_MAIN },
        info: { main: '#29B6F6' },
        success: { main: '#66BB6A' },
        warning: { main: '#FFA726' },
        error: { main: '#F44336' },
      },
    },
  },
};

/**
 * The Giselle brand theme preset.
 *
 * A ready-to-use result of `extendTheme()` carrying the full Giselle palette
 * for both light and dark colour schemes.
 *
 * **Usage — with `ThemeProvider` directly:**
 * ```tsx
 * import { ThemeProvider } from '@mui/material/styles';
 * import { giselleTheme } from '@littlebranches/giselle-mui';
 *
 * <ThemeProvider theme={giselleTheme}>
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * **Usage — via `GiselleThemeProvider` (zero-config):**
 * ```tsx
 * import { GiselleThemeProvider } from '@littlebranches/giselle-mui';
 *
 * <GiselleThemeProvider>
 *   <App />
 * </GiselleThemeProvider>
 * ```
 *
 * **Palette decisions:**
 * - `primary`   — Deep grove green / Lime (dark mode): the tree foundation
 * - `secondary` — Mango gold: the fruit accent, unchanged between modes
 * - `info`      — Accessible blue (standard MUI default family)
 * - `success`   — Leaf green `#388E3C` — distinct from primary to avoid ambiguity
 * - `warning`   — Amber orange `#ED6C02` — warm, complements the mango gold family
 * - `error`     — Standard red `#D32F2F`
 */
export const giselleTheme = extendTheme(giselleThemeOptions);
