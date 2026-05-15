'use client';

import { useMemo } from 'react';
import { ThemeProvider, extendTheme } from '@mui/material/styles';

import { deepMerge } from '../../../../utils/deep-merge/deep-merge';
import { giselleThemeOptions, giselleTheme } from '../../../../utils/theme/preset/theme-preset';
import type { GiselleThemeProviderProps } from './types';

// ----------------------------------------------------------------------

/**
 * Zero-config theme provider for `@alexrebula/giselle-mui`.
 *
 * Ships with the Giselle brand palette (Deep grove green + Mango gold) as
 * the default — wrap your application and every MUI component gets the
 * correct theme with no extra setup.
 *
 * ## Usage — zero config
 * ```tsx
 * import { GiselleThemeProvider } from '@alexrebula/giselle-mui';
 *
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <html lang="en" suppressHydrationWarning>
 *       <body>
 *         <GiselleThemeProvider>{children}</GiselleThemeProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * ## Usage — partial overrides
 * ```tsx
 * <GiselleThemeProvider
 *   themeOverrides={{ colorSchemes: { light: { palette: { primary: { main: '#1976d2' } } } } }}
 * >
 *   <App />
 * </GiselleThemeProvider>
 * ```
 *
 * ## Usage — fully custom theme
 * ```tsx
 * import { extendTheme } from '@mui/material/styles';
 *
 * const myTheme = extendTheme({ colorSchemes: { light: { palette: { primary: { main: '#e91e63' } } } } });
 *
 * <GiselleThemeProvider theme={myTheme}><App /></GiselleThemeProvider>
 * ```
 */
export function GiselleThemeProvider({
  children,
  themeOverrides,
  theme,
  defaultMode = 'system',
}: GiselleThemeProviderProps) {
  const resolvedTheme = useMemo(
    () =>
      theme ??
      (themeOverrides ? extendTheme(deepMerge(giselleThemeOptions, themeOverrides)) : giselleTheme),
    [theme, themeOverrides]
  );

  return (
    <ThemeProvider theme={resolvedTheme} defaultMode={defaultMode}>
      {children}
    </ThemeProvider>
  );
}
