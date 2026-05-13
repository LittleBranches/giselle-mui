'use client';

import { useCallback, useMemo, useState } from 'react';

import { isDeepEqual } from '../../utils/is-deep-equal';
import { GiselleSettingsContext } from './settings-context';
import type {
  BaseSettingsState,
  GiselleSettingsContextValue,
  GiselleSettingsProviderProps,
} from './settings-types';

// ----------------------------------------------------------------------

const DEFAULT_STORAGE_KEY = 'giselle-settings';

// ----------------------------------------------------------------------

function readSettings<TState>(storageKey: string, fallback: TState): TState {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw !== null ? (JSON.parse(raw) as TState) : fallback;
  } catch {
    return fallback;
  }
}

function writeSettings<TState>(storageKey: string, value: TState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Storage may be unavailable (private mode, quota exceeded)
  }
}

function clearSettings(storageKey: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // Storage may be unavailable
  }
}

/**
 * Resolves the initial settings state on first render.
 *
 * Priority order:
 * 1. `initialState` — pre-resolved server value (RSC / SSR layer)
 * 2. Stored value — read from `localStorage` when the version matches
 * 3. `defaultSettings` — fallback when nothing is stored or the version differs
 *
 * When the stored version differs from `defaultSettings.version`, storage is cleared
 * immediately so the next write starts fresh.
 */
function resolveInitialState<TState extends BaseSettingsState>(
  storageKey: string,
  initialState: TState | undefined,
  defaultSettings: TState
): TState {
  if (initialState !== undefined) return initialState;
  const stored = readSettings(storageKey, defaultSettings);
  if (stored.version !== defaultSettings.version) {
    clearSettings(storageKey);
    return defaultSettings;
  }
  return stored;
}

// ----------------------------------------------------------------------

/**
 * Generic settings state provider for MUI applications.
 *
 * Persists UI settings (color mode, font size, direction, etc.) to `localStorage`
 * and exposes them via `useGiselleSettings<TState>()`. Includes built-in drawer
 * open/close state for a settings panel.
 *
 * ## Zero-config usage
 * ```tsx
 * type MySettings = { version: string; mode: 'light' | 'dark' };
 * const defaultSettings: MySettings = { version: '1', mode: 'light' };
 *
 * <GiselleSettingsProvider defaultSettings={defaultSettings}>
 *   <App />
 * </GiselleSettingsProvider>
 * ```
 *
 * ## Reading settings
 * ```ts
 * const { state, setField, canReset, onReset } = useGiselleSettings<MySettings>();
 * ```
 *
 * ## Schema migration
 * Increment `version` in `defaultSettings` whenever the settings shape changes.
 * The provider resets all stored state automatically when a version mismatch is detected.
 */
export function GiselleSettingsProvider<TState extends BaseSettingsState>({
  children,
  defaultSettings,
  initialState,
  storageKey = DEFAULT_STORAGE_KEY,
}: GiselleSettingsProviderProps<TState>) {
  const [state, setStateRaw] = useState<TState>(() =>
    resolveInitialState(storageKey, initialState, defaultSettings)
  );

  const [openDrawer, setOpenDrawer] = useState(false);

  const setState = useCallback(
    (partial: Partial<TState>) => {
      setStateRaw((prev) => {
        const next = { ...prev, ...partial };
        writeSettings(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  const setField = useCallback(
    <K extends keyof TState>(key: K, value: TState[K]) => {
      setStateRaw((prev) => {
        const next = { ...prev, [key]: value };
        writeSettings(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  const onReset = useCallback(() => {
    clearSettings(storageKey);
    setStateRaw(defaultSettings);
  }, [storageKey, defaultSettings]);

  const onCloseDrawer = useCallback(() => setOpenDrawer(false), []);
  const onToggleDrawer = useCallback(() => setOpenDrawer((prev) => !prev), []);

  const canReset = useMemo(() => !isDeepEqual(state, defaultSettings), [state, defaultSettings]);

  const value = useMemo<GiselleSettingsContextValue<TState>>(
    () => ({
      state,
      setState,
      setField,
      canReset,
      onReset,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
    }),
    [state, setState, setField, canReset, onReset, openDrawer, onCloseDrawer, onToggleDrawer]
  );

  return (
    <GiselleSettingsContext.Provider
      value={value as unknown as GiselleSettingsContextValue<BaseSettingsState>}
    >
      {children}
    </GiselleSettingsContext.Provider>
  );
}
