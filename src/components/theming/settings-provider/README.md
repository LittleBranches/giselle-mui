# GiselleSettingsProvider

## Why it exists

MUI applications typically need to persist a small bundle of UI preferences — colour mode, font size, direction, layout density — across page loads and, in SSR setups, across server and client renders. Without a shared provider, each project builds its own context + localStorage wrapper, duplicating SSR hydration guards, version migration logic, and drawer open/close state. `GiselleSettingsProvider` encapsulates all of that: a generic, fully typed React context provider that persists settings to `localStorage` or `cookie`, resets automatically on schema version mismatch, and exposes a stable context API (`state`, `setField`, `canReset`, `onReset`, `openDrawer`, `onToggleDrawer`).

## Why it belongs in giselle-mui

Persisted UI settings are a universal requirement in any MUI application. The version-migration pattern, the pluggable `StorageAdapter` interface, the SSR-safe hydration guard, and the drawer state are all generic infrastructure with no project-specific logic. `GiselleThemeAndSettingsProvider` — which composes this provider with the theme provider and the settings-to-colour-scheme bridge — further demonstrates how broadly applicable the pattern is.

## Design decisions

- **`adapterRef` pattern.** The storage adapter is held in a `useRef` that is updated synchronously on every render. This means `setState`, `setField`, and `onReset` callbacks never become stale when `storage` or `storageKey` props change, without needing to be recreated via `useCallback` dependencies.
- **SSR hydration via `initialState`.** The provider always initialises from `defaultSettings` (the server-consistent value). A mount-only `useEffect` reads from storage and updates state on the client. Pass `initialState` (pre-resolved from cookies in an RSC layer) to skip the post-mount update and avoid a flash-of-default-content.
- **Version-gated migration.** If the stored object's `version` field does not match `defaultSettings.version`, the adapter clears storage and the provider stays on defaults. Incrementing `version` is the sole migration mechanism — no migration functions needed for breaking shape changes.
- **Pluggable `StorageAdapter<TState>` interface.** Consumers who need a custom backend (IndexedDB, server-synced state, a cookie library with custom options) implement `{ get, set, clear }` and pass it as `storage`. The built-in `'localStorage'` and `'cookie'` adapters are both SSR-safe.
- **Drawer state is built in.** `openDrawer`, `onCloseDrawer`, and `onToggleDrawer` are included in the context value so the settings panel drawer does not need its own context or prop drilling.
- **`'use client'` directive.** The file is marked as a Client Component for Next.js App Router compatibility. It accesses `window.localStorage` / `document.cookie` only after mount.

## Related

- [GiselleThemeAndSettingsProvider](./theme-and-settings-provider.tsx) — convenience wrapper that composes `GiselleSettingsProvider` with the theme provider and an optional colour-scheme bridge
- [SettingsThemeBridge](./settings-theme-bridge.tsx) — internal component that syncs settings state to the MUI colour scheme via `useColorScheme`
- [MUI CssVarsProvider](https://mui.com/material-ui/customization/css-theme-variables/usage/) — underlying theming primitive

---

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
