import type { ReactNode } from 'react';
import type { CssVarsTheme, CssVarsThemeOptions } from '@mui/material/styles';

export interface GiselleThemeProviderProps {
  /** Child components that will receive the Giselle theme. */
  children: ReactNode;

  /**
   * Partial theme options deep-merged on top of the Giselle brand defaults.
   *
   * Use for targeted adjustments — swapping the primary colour, adjusting typography
   * scale — while keeping the rest of the Giselle palette intact.
   *
   * Ignored when `theme` is provided.
   *
   * **Example — override primary to blue:**
   * ```tsx
   * <GiselleThemeProvider
   *   themeOverrides={{ colorSchemes: { light: { palette: { primary: { main: '#1976d2' } } } } }}
   * >
   *   <App />
   * </GiselleThemeProvider>
   * ```
   */
  themeOverrides?: CssVarsThemeOptions;

  /**
   * A fully custom theme created with `extendTheme()`. When provided,
   * `themeOverrides` is ignored and this theme is used as-is.
   *
   * **Example:**
   * ```tsx
   * import { extendTheme } from '@mui/material/styles';
   *
   * const myTheme = extendTheme({ colorSchemes: { light: { palette: { primary: { main: '#e91e63' } } } } });
   *
   * <GiselleThemeProvider theme={myTheme}>
   *   <App />
   * </GiselleThemeProvider>
   * ```
   */
  theme?: CssVarsTheme;

  /**
   * Initial color scheme applied before the user or system preference is read.
   *
   * @default 'system'
   */
  defaultMode?: 'light' | 'dark' | 'system';
}
