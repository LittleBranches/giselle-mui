# GiselleSettingsProvider

## Why it exists

MUI applications that expose a settings panel (colour mode toggle, font-size picker, RTL switch,
density control) repeatedly wire the same boilerplate: read from localStorage on mount, write back
on change, reset to defaults, expose a "can reset" flag, and manage a drawer open/close toggle.
Without a shared provider, every project reimplements this — often with SSR hydration mismatches
when the stored value differs from the server-rendered default, and with no standard path for
schema migration when the settings shape changes between releases.

## Why it belongs in giselle-mui

The provider is parameterised by a generic `TState` that extends `BaseSettingsState`. It has no
opinion about what settings fields exist — the caller defines the shape. The only contract is a
`version` field, which powers automatic storage reset when the schema changes. Storage is
swappable (`localStorage`, `cookie`, or a custom `StorageAdapter<TState>`), making the provider
usable in SSR, edge, and client-only environments. Nothing about it is application-specific.

## Design decisions

**Mount-only hydration, not double render.** The provider initialises from `defaultSettings` on
the server (and on the first client render) to avoid React hydration mismatches. A mount-only
`useEffect` then reads from storage and patches state. When a server layer (e.g. a Next.js RSC
reading cookies) provides `initialState`, the effect is skipped entirely — no flash.

**Version-based migration.** Incrementing `version` in `defaultSettings` causes the provider to
detect a mismatch on next mount, clear storage, and start from defaults. This is intentionally
blunt — partial migrations are the caller's responsibility via a custom `StorageAdapter`.

**`adapterRef` pattern.** The storage adapter is stored in a ref rather than state or a memoised
value. This means `setState` and `setField` callbacks never need to be recreated when `storage` or
`storageKey` props change, keeping downstream memoisation stable.

**`setField` for typed single-key updates.** In addition to `setState(partial)` (shallow merge),
the context exposes `setField<K>(key, value)` where the key and value types are correlated at the
type level. This prevents the common mistake of passing a value of the wrong type for a key.

**`canReset` via deep equality.** Computed with `isDeepEqual(state, defaultSettings)` on every
render. Cheap for typical settings objects (< 20 keys, flat values). Callers use this to disable
or hide the reset button when no changes are pending.

**Drawer state is built in.** `openDrawer`, `onCloseDrawer`, and `onToggleDrawer` are part of the
context value. This prevents a separate `useState` at the layout level for the common settings-
panel-drawer pattern.

**`GiselleThemeAndSettingsProvider` convenience wrapper.** A sibling component
(`theme-and-settings-provider.tsx`) composes `GiselleThemeProvider` and
`GiselleSettingsProvider` in one element and bridges settings state to the MUI color scheme via
an optional `getMode` prop. Not documented here — see its own file.

## Related

- [MUI CssVarsProvider](https://mui.com/material-ui/customization/css-theme-variables/overview/) —
  the theme layer that `GiselleThemeAndSettingsProvider` wraps
- [settings-context.ts](./settings-context.ts) — the `GiselleSettingsContext` and
  `useGiselleSettings` hook
- [settings-types.ts](./settings-types.ts) — `BaseSettingsState`, `StorageAdapter`,
  `GiselleSettingsProviderProps`, and `GiselleSettingsContextValue`

---

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
