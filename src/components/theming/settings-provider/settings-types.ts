import type { CssVarsTheme, CssVarsThemeOptions } from '@mui/material/styles';
import type { ReactNode } from 'react';

// ----------------------------------------------------------------------

/**
 * Minimum contract for all settings state shapes managed by `GiselleSettingsProvider`.
 * Every consumer's settings type must include `version` for storage migration support.
 */
export type BaseSettingsState = { version: string };

// ----------------------------------------------------------------------

/**
 * Context value exposed by `GiselleSettingsProvider`.
 * Access via `useGiselleSettings<TState>()`.
 */
export type GiselleSettingsContextValue<TState> = {
  /** Current persisted settings state. */
  state: TState;

  /**
   * Partially update the settings state.
   * The supplied object is shallow-merged with the current state.
   *
   * **Example:**
   * ```ts
   * setState({ mode: 'dark' }); // only overrides `mode`
   * ```
   */
  setState: (partial: Partial<TState>) => void;

  /**
   * Update a single typed field.
   * Key and value are correlated at the type level — no stringly-typed APIs.
   *
   * **Example:**
   * ```ts
   * setField('mode', 'dark');
   * setField('fontSize', 16);
   * ```
   */
  setField: <K extends keyof TState>(key: K, value: TState[K]) => void;

  /** `true` when the current state differs from `defaultSettings` (deep comparison). */
  canReset: boolean;

  /** Reset state to `defaultSettings` and clear persisted storage. */
  onReset: () => void;

  /** Whether the settings panel drawer is open. */
  openDrawer: boolean;

  /** Close the settings panel drawer. */
  onCloseDrawer: () => void;

  /** Toggle the settings panel drawer open/closed. */
  onToggleDrawer: () => void;
};

// ----------------------------------------------------------------------

/**
 * Custom storage adapter for `GiselleSettingsProvider`.
 *
 * Implement this interface to use a custom storage backend (e.g. IndexedDB,
 * server-synced state, or a cookie library with custom serialisation options).
 *
 * **Example (IndexedDB via a simple wrapper):**
 * ```ts
 * const myAdapter: StorageAdapter<MySettings> = {
 *   get: () => indexedDBStore.get('settings'),
 *   set: (value) => indexedDBStore.set('settings', value),
 *   clear: () => indexedDBStore.delete('settings'),
 * };
 *
 * <GiselleSettingsProvider storage={myAdapter} defaultSettings={defaults}>
 *   <App />
 * </GiselleSettingsProvider>
 * ```
 */
export type StorageAdapter<TState> = {
  /** Read the stored settings. Returns `null` when nothing is stored. */
  get: () => TState | null;
  /** Write the full settings object to storage. */
  set: (value: TState) => void;
  /** Remove the stored settings (called on `onReset`). */
  clear: () => void;
};

// ----------------------------------------------------------------------

/**
 * Props for `GiselleSettingsProvider<TState>`.
 */
export type GiselleSettingsProviderProps<TState extends BaseSettingsState> = {
  /** Child components that receive settings via context. */
  children?: ReactNode;

  /**
   * Default settings — used when nothing is persisted, and as the reset target.
   *
   * Must include a `version` field. Increment the version whenever the settings
   * schema changes to trigger an automatic reset on clients that have stale storage.
   *
   * **Example:**
   * ```ts
   * const defaultSettings = { version: '2', mode: 'light', fontSize: 14 };
   * ```
   */
  defaultSettings: TState;

  /**
   * Pre-resolved initial state from a server layer (e.g. Next.js RSC reading cookies).
   *
   * Pass this to avoid a hydration mismatch when the stored value differs from the
   * server-rendered default. When omitted, the provider reads from storage in a
   * mount-only `useEffect` (after the first render).
   */
  initialState?: TState;

  /**
   * Storage key used when `storage` is `'localStorage'` or `'cookie'`.
   *
   * @default 'giselle-settings'
   */
  storageKey?: string;

  /**
   * Storage backend.
   *
   * - `'localStorage'` — default; SSR-safe, reads/writes `window.localStorage`
   * - `'cookie'` — reads/writes `document.cookie`; pair with `initialState` from an
   *   RSC layer for SSR hydration without a flash
   * - `StorageAdapter<TState>` — fully custom adapter for any storage backend
   *
   * @default 'localStorage'
   */
  storage?: 'localStorage' | 'cookie' | StorageAdapter<TState>;
};

// ----------------------------------------------------------------------

/**
 * Props for `GiselleThemeAndSettingsProvider` — a convenience wrapper that
 * composes `GiselleThemeProvider` and `GiselleSettingsProvider` in one component
 * and optionally bridges settings state to the MUI color scheme.
 */
export type GiselleThemeAndSettingsProviderProps<TState extends BaseSettingsState> =
  GiselleSettingsProviderProps<TState> & {
    /**
     * Partial theme options deep-merged on top of the Giselle brand defaults.
     * Ignored when `theme` is provided. Same as `GiselleThemeProviderProps.themeOverrides`.
     */
    themeOverrides?: CssVarsThemeOptions;

    /**
     * A fully custom theme created with `extendTheme()`. When provided, `themeOverrides`
     * is ignored. Same as `GiselleThemeProviderProps.theme`.
     */
    theme?: CssVarsTheme;

    /**
     * Initial color scheme applied before settings are read.
     * Same as `GiselleThemeProviderProps.defaultMode`.
     *
     * @default 'system'
     */
    defaultMode?: 'light' | 'dark' | 'system';

    /**
     * Map settings state to an MUI color scheme mode.
     *
     * When provided, the MUI color scheme is synced to the returned value
     * whenever settings change. Use this to drive `light`/`dark`/`system` mode
     * from your settings state.
     *
     * **Example:**
     * ```ts
     * getMode={(s) => s.mode}
     * ```
     */
    getMode?: (state: TState) => 'light' | 'dark' | 'system' | undefined;
  };

// ----------------------------------------------------------------------

/**
 * Props for the internal `SettingsThemeBridge` component.
 *
 * @internal Not exported from the package barrel — used only by `GiselleThemeAndSettingsProvider`.
 */
export interface SettingsThemeBridgeProps<TState extends BaseSettingsState> {
  /**
   * Extract a color scheme mode from the current settings state.
   * When the returned value changes, `useColorScheme().setMode` is called automatically.
   * Return `undefined` to leave the MUI color scheme unchanged.
   */
  getMode?: (state: TState) => 'light' | 'dark' | 'system' | undefined;
}
