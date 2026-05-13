'use client';

import { useEffect } from 'react';
import { useColorScheme } from '@mui/material/styles';

import { useGiselleSettings } from './settings-context';
import type { BaseSettingsState, SettingsThemeBridgeProps } from './settings-types';

// ----------------------------------------------------------------------

/**
 * Internal bridge that subscribes to `useGiselleSettings` and forwards
 * the color scheme mode to MUI's `useColorScheme` whenever settings change.
 *
 * Must be rendered inside both `GiselleThemeProvider` (for `useColorScheme`)
 * and `GiselleSettingsProvider` (for `useGiselleSettings`).
 * Renders nothing — returns `null`.
 */
export function SettingsThemeBridge<TState extends BaseSettingsState>({
  getMode,
}: SettingsThemeBridgeProps<TState>) {
  const { state } = useGiselleSettings<TState>();
  const { setMode } = useColorScheme();

  const mode = getMode?.(state);

  useEffect(() => {
    if (mode !== undefined) {
      setMode(mode);
    }
  }, [mode, setMode]);

  return null;
}
