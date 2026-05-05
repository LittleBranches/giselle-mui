/**
 * Giselle brand theme preset for MUI v7 CSS Variables mode.
 *
 * Defines the Giselle ecosystem's default palette as a ready-to-use
 * `extendTheme()` result. Pass directly to `CssVarsProvider` or consume via
 * `GiselleThemeProvider` (Phase C).
 *
 * **Brand palette — the Carabao mango tree:**
 * - Primary   — Deep grove green `#2E7D32` (Lime `#76C442` in dark mode)
 * - Secondary — Mango gold `#F5A623`
 */

import { extendTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// Brand palette constants
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
 * The Giselle brand theme preset.
 *
 * A ready-to-use result of `extendTheme()` carrying the full Giselle palette
 * for both light and dark colour schemes.
 *
 * **Usage — with `CssVarsProvider` directly:**
 * ```tsx
 * import { CssVarsProvider } from '@mui/material/styles';
 * import { giselleTheme } from '@alexrebula/giselle-mui';
 *
 * <CssVarsProvider theme={giselleTheme}>
 *   <App />
 * </CssVarsProvider>
 * ```
 *
 * **Usage — via `GiselleThemeProvider` (Phase C, zero-config):**
 * ```tsx
 * import { GiselleThemeProvider } from '@alexrebula/giselle-mui';
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
export const giselleTheme = extendTheme({
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
});
