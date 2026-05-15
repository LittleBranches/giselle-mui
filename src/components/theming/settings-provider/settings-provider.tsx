'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getCookieValue, setCookieValue } from '../../../utils/cookie/cookie';
import { isDeepEqual } from '../../../utils/is-deep-equal/is-deep-equal';
import { GiselleSettingsContext } from './settings-context';
import type {
  BaseSettingsState,
  GiselleSettingsContextValue,
  GiselleSettingsProviderProps,
  StorageAdapter,
} from './settings-types';

// ----------------------------------------------------------------------

const DEFAULT_STORAGE_KEY = 'giselle-settings';

// ----------------------------------------------------------------------

function buildLocalStorageAdapter<TState>(storageKey: string): StorageAdapter<TState> {
  return {
    get: () => {
      if (typeof window === 'undefined') return null;
      try {
        const raw = window.localStorage.getItem(storageKey);
        return raw !== null ? (JSON.parse(raw) as TState) : null;
      } catch {
        return null;
      }
    },
    set: (value) => {
      if (typeof window === 'undefined') return;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(value));
      } catch {
        // Storage may be unavailable (private mode, quota exceeded)
      }
    },
    clear: () => {
      if (typeof window === 'undefined') return;
      try {
        window.localStorage.removeItem(storageKey);
      } catch {
        // Storage may be unavailable
      }
    },
  };
}

function buildCookieAdapter<TState>(storageKey: string): StorageAdapter<TState> {
  return {
    get: () => {
      const raw = getCookieValue(storageKey);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as TState;
      } catch {
        return null;
      }
    },
    set: (value) => {
      setCookieValue(storageKey, JSON.stringify(value), { path: '/', sameSite: 'Lax' });
    },
    clear: () => {
      setCookieValue(storageKey, '', { maxAge: 0, path: '/' });
    },
  };
}

function resolveAdapter<TState>(
  storage: 'localStorage' | 'cookie' | StorageAdapter<TState>,
  storageKey: string
): StorageAdapter<TState> {
  if (storage === 'localStorage') return buildLocalStorageAdapter<TState>(storageKey);
  if (storage === 'cookie') return buildCookieAdapter<TState>(storageKey);
  return storage;
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
 * ## Storage backends
 * ```tsx
 * // Default — localStorage
 * <GiselleSettingsProvider defaultSettings={defaults}><App /></GiselleSettingsProvider>
 *
 * // Cookie-based (pair with initialState from RSC for SSR hydration)
 * <GiselleSettingsProvider storage="cookie" defaultSettings={defaults}><App /></GiselleSettingsProvider>
 *
 * // Custom adapter
 * <GiselleSettingsProvider storage={myAdapter} defaultSettings={defaults}><App /></GiselleSettingsProvider>
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
  storage = 'localStorage',
}: GiselleSettingsProviderProps<TState>) {
  // Adapter ref — always reflects the current storage/storageKey without
  // forcing callbacks to re-create when those props change.
  const adapterRef = useRef<StorageAdapter<TState>>(resolveAdapter(storage, storageKey));
  adapterRef.current = resolveAdapter(storage, storageKey);

  const [state, setStateRaw] = useState<TState>(initialState ?? defaultSettings);

  // Hydrate from storage after mount when no server-provided initialState.
  // Initialising from defaults prevents SSR hydration mismatches: the server always
  // renders with defaults, and this effect picks up the stored value on the client
  // after the first render. adapterRef is a ref (stable); defaultSettings is treated
  // as stable at mount (same semantics as the existing onReset callback).
  useEffect(() => {
    if (initialState !== undefined) return;
    const stored = adapterRef.current.get();
    if (stored === null) return;
    if (stored.version !== defaultSettings.version) {
      adapterRef.current.clear();
      return;
    }
    setStateRaw(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount-only

  const [openDrawer, setOpenDrawer] = useState(false);

  const setState = useCallback((partial: Partial<TState>) => {
    setStateRaw((prev) => {
      const next = { ...prev, ...partial };
      adapterRef.current.set(next);
      return next;
    });
  }, []);

  const setField = useCallback(<K extends keyof TState>(key: K, value: TState[K]) => {
    setStateRaw((prev) => {
      const next = { ...prev, [key]: value };
      adapterRef.current.set(next);
      return next;
    });
  }, []);

  const onReset = useCallback(() => {
    adapterRef.current.clear();
    setStateRaw(defaultSettings);
  }, [defaultSettings]);

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
