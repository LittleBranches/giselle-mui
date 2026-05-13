'use client';

import { Fragment } from 'react';

import { GiselleThemeProvider } from '../theme-provider/giselle/giselle';
import { GiselleSettingsProvider } from './settings-provider';
import { SettingsThemeBridge } from './settings-theme-bridge';
import type { BaseSettingsState, GiselleThemeAndSettingsProviderProps } from './settings-types';

// ----------------------------------------------------------------------

/**
 * Convenience wrapper that composes `GiselleThemeProvider` and
 * `GiselleSettingsProvider` in a single component, with an optional bridge
 * that syncs settings state to the MUI color scheme.
 *
 * ## Zero-config usage
 * ```tsx
 * const defaultSettings = { version: '1', mode: 'light' as const };
 *
 * <GiselleThemeAndSettingsProvider defaultSettings={defaultSettings}>
 *   <App />
 * </GiselleThemeAndSettingsProvider>
 * ```
 *
 * ## With color scheme sync
 * ```tsx
 * <GiselleThemeAndSettingsProvider
 *   defaultSettings={defaultSettings}
 *   getMode={(s) => s.mode}
 * >
 *   <App />
 * </GiselleThemeAndSettingsProvider>
 * ```
 *
 * ## With cookie storage + SSR hydration
 *
 * Pass `initialState` with the cookie value read server-side (e.g. from
 * Next.js `cookies()`) to avoid a flash of default settings on first render.
 * ```tsx
 * <GiselleThemeAndSettingsProvider
 *   defaultSettings={defaultSettings}
 *   initialState={serverParsedCookieState}
 *   storage="cookie"
 *   getMode={(s) => s.mode}
 * >
 *   <App />
 * </GiselleThemeAndSettingsProvider>
 * ```
 */
export function GiselleThemeAndSettingsProvider<TState extends BaseSettingsState>({
  children,
  defaultSettings,
  initialState,
  storageKey,
  storage,
  themeOverrides,
  theme,
  defaultMode,
  getMode,
}: GiselleThemeAndSettingsProviderProps<TState>) {
  return (
    <GiselleThemeProvider themeOverrides={themeOverrides} theme={theme} defaultMode={defaultMode}>
      <GiselleSettingsProvider
        defaultSettings={defaultSettings}
        initialState={initialState}
        storageKey={storageKey}
        storage={storage}
      >
        <Fragment>
          <SettingsThemeBridge<TState> getMode={getMode} />
          {children}
        </Fragment>
      </GiselleSettingsProvider>
    </GiselleThemeProvider>
  );
}
