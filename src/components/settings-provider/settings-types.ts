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
 * Props for `GiselleSettingsProvider<TState>`.
 */
export type GiselleSettingsProviderProps<TState extends BaseSettingsState> = {
  /** Child components that receive settings via context. */
  children: ReactNode;

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
   * server-rendered default. When omitted, the provider reads from `localStorage`
   * on the client.
   */
  initialState?: TState;

  /**
   * `localStorage` key used to persist settings.
   *
   * @default 'giselle-settings'
   */
  storageKey?: string;
};
