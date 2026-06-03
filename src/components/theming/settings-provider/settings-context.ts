import { createContext, useContext } from 'react';

import type { BaseSettingsState, GiselleSettingsContextValue } from './settings-types';

// ----------------------------------------------------------------------

/**
 * Internal React context for `GiselleSettingsProvider`.
 *
 * Typed against `BaseSettingsState` because React context cannot be generic.
 * Consumer code accesses the correctly-typed value via `useGiselleSettings<TState>()`,
 * which casts to the consumer's state shape.
 */
export const GiselleSettingsContext =
  createContext<GiselleSettingsContextValue<BaseSettingsState> | null>(null);

// ----------------------------------------------------------------------

/**
 * Access the Giselle settings context.
 *
 * Must be called within a `<GiselleSettingsProvider>` tree.
 * Pass the same `TState` type that was used on the provider for full type safety.
 *
 * **Example:**
 * ```ts
 * const { state, setField, canReset, onReset } = useGiselleSettings<MySettings>();
 * ```
 *
 * @throws {Error} When called outside a `GiselleSettingsProvider`.
 */
export function useGiselleSettings<
  TState extends BaseSettingsState,
>(): GiselleSettingsContextValue<TState> {
  const ctx = useContext(GiselleSettingsContext);

  if (ctx === null) {
    throw new Error('useGiselleSettings must be called within a <GiselleSettingsProvider>.');
  }

  // Safe: the provider is always parameterised with TState (a superset of BaseSettingsState).
  // The type system cannot infer this relationship without an explicit assertion.
  return ctx as unknown as GiselleSettingsContextValue<TState>;
}
