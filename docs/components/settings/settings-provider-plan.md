# GiselleSettingsProvider — Implementation Plan

> A fully MIT-safe, framework-agnostic settings context for MUI projects, exported from `@alexrebula/giselle-mui`.

---

## Why it belongs here

`GiselleSettingsProvider` manages UI settings that directly drive MUI theme tokens:
color mode (`light`/`dark`), direction (`ltr`/`rtl`), font size, and color presets.
These settings are tightly coupled to `GiselleThemeProvider` — changing a setting
re-applies the theme.

It belongs in `giselle-mui` because:

- It must integrate with `GiselleThemeProvider` (Phase C prerequisite)
- Consumers get one coherent import: `@alexrebula/giselle-mui`
- Consumers can adopt it as a drop-in replacement for any existing settings context — one import change, no consumer component changes

## Why it belongs here rather than `giselle-ui`

`giselle-ui` is framework-agnostic and MUI-free. `GiselleSettingsProvider` is
MUI-specific: it drives `ThemeProvider` theme state. It does not belong in a
package that must remain free of MUI.

---

## Copyright boundary (non-negotiable)

This package must not import:

- any proprietary or third-party hook/util package — **must not import**
- `es-toolkit`
- Any other proprietary or non-MIT dependency

All storage and equality utilities must be written independently:

- `useLocalStorage` → `src/utils/use-local-storage.ts`
- `getCookieValue` / `setCookieValue` → `src/utils/cookie.ts`
- `isDeepEqual` → `src/utils/is-deep-equal.ts`

---

## Architecture decisions

### 1. Generic over state shape

`GiselleSettingsProvider<TState extends BaseSettingsState>` — the consumer defines
their own state shape. This library ships default exports for the most common
settings (see `defaultGiselleSettings`), but any consumer can extend or replace them.

```ts
// BaseSettingsState — minimum contract
type BaseSettingsState = { version: string };

// Consumer defines their settings:
type MyAppSettings = BaseSettingsState & {
  mode: 'light' | 'dark';
  fontSize: number;
  direction: 'ltr' | 'rtl';
};
```

### 2. Storage adapter pattern

The default storage backend is `localStorage`. Consumers who need cookie-based
persistence (e.g. for Next.js SSR hydration) can pass `storage: 'cookie'` or
supply a fully custom adapter:

```ts
type StorageAdapter<T> = {
  get: () => T | null;
  set: (value: T) => void;
};

// Usage:
<GiselleSettingsProvider<MySettings>
  defaultSettings={myDefaults}
  storage="cookie"    // or storage={{ get, set }}
/>
```

**Why not `useCookies` as a hook?**
Cookie hooks blur the boundary between storage and
React state. The adapter pattern keeps the two concerns separate — the hook manages
React state, the adapter handles serialisation and transport. This also makes the
component fully testable with a mock adapter.

### 3. SSR-safe initial state

In Next.js App Router, cookie values are read server-side (via `next/headers`).
The resolved state is passed as `initialState?` from the RSC layer:

```tsx
// app/layout.tsx (RSC)
const initialSettings = await detectGiselleSettings(); // reads cookies
return <GiselleSettingsProvider initialState={initialSettings} ...>
```

The component accepts `initialState` for the first render and falls back to
`defaultSettings` when omitted (non-Next.js consumers, Storybook, etc.).
The `detectGiselleSettings()` helper is a convenience export from
`@alexrebula/giselle-mui/server` (a separate entrypoint that uses `next/headers`
— only importable in RSC, never bundled by default).

### 4. Drawer state is built in

For a smooth drop-in experience, the drawer
open/close state is included in the context. This avoids forcing consumers to
add their own drawer state management just to get a settings panel.

### 5. Version check on mount

On every mount, the provider reads the stored state and compares `state.version`
against `defaultSettings.version`. If they differ, it resets to `defaultSettings`.
This prevents stale settings from breaking the UI after a schema change.

### 6. `setField` for single-field updates

`setField<K extends keyof TState>(key: K, value: TState[K])` updates one field
at a time — typed end-to-end, no stringly-typed keys. Single-field typed updates keep
consumer code simple and require no changes when adopting this provider.

### 7. `canReset` uses own `isDeepEqual`

`canReset = !isDeepEqual(state, defaultSettings)`. Own implementation — no
`es-toolkit` or `lodash` runtime dependency. Covers:

- Primitives (string, number, boolean)
- Arrays (shallow element comparison)
- Plain objects (recursive key comparison)
- Ignores prototype chains

---

## Own utilities to write

All live in `src/utils/`:

| File                   | Purpose                                                           | Dependencies |
| ---------------------- | ----------------------------------------------------------------- | ------------ |
| `use-local-storage.ts` | SSR-safe React hook (already exists in alexrebula — port it)      | None         |
| `is-deep-equal.ts`     | `isDeepEqual(a, b): boolean` — covers primitives, arrays, objects | None         |
| `cookie.ts`            | `getCookieValue(name)`, `setCookieValue(name, value, options)`    | None         |

All three files must be written independently — do not copy from any third-party or proprietary package.

### `isDeepEqual` contract

```ts
// Covers all cases needed by GiselleSettingsProvider:
isDeepEqual({ mode: 'light', version: '1' }, { mode: 'light', version: '1' }); // true
isDeepEqual({ mode: 'light' }, { mode: 'dark' }); // false
isDeepEqual([1, 2], [1, 2]); // true
isDeepEqual([1, 2], [1, 3]); // false
// Out of scope (not needed for settings):
// - Date objects, Maps, Sets, RegExp, Symbols, class instances
```

### `cookie.ts` contract

```ts
// Client-safe: guards 'typeof document !== "undefined"' — never throws in SSR
getCookieValue(name: string): string | null;
setCookieValue(name: string, value: string, options?: { maxAge?: number; path?: string; sameSite?: string }): void;
```

---

## Context shape

The context shape follows established patterns for drop-in adoption:

```ts
type GiselleSettingsContextValue<TState> = {
  // Current persisted settings state
  state: TState;
  // Partial update — merges with current state
  setState: (partial: Partial<TState>) => void;
  // Single field update — typed key + value
  setField: <K extends keyof TState>(key: K, value: TState[K]) => void;
  // true when state !== defaultSettings (deep comparison)
  canReset: boolean;
  // Reset state to defaultSettings and clear storage
  onReset: () => void;
  // Settings panel drawer open/close
  openDrawer: boolean;
  onCloseDrawer: () => void;
  onToggleDrawer: () => void;
};
```

---

## Provider props

```ts
type GiselleSettingsProviderProps<TState extends BaseSettingsState> = {
  /** Default settings — used when nothing is stored, and as the reset target. */
  defaultSettings: TState;
  /**
   * Pre-resolved initial state — pass from an RSC/server layer to avoid hydration mismatch.
   * When omitted, the provider reads from storage on first render.
   */
  initialState?: TState;
  /**
   * Storage key.
   * @default 'giselle-settings'
   */
  storageKey?: string;
  /**
   * Storage backend.
   * - `'localStorage'` — default; SSR-safe (reads on client only)
   * - `'cookie'` — reads/writes `document.cookie`
   * - `StorageAdapter<TState>` — custom adapter
   * @default 'localStorage'
   */
  storage?: 'localStorage' | 'cookie' | StorageAdapter<TState>;
  children: ReactNode;
};
```

---

## File structure

```
src/
  components/
    settings-provider/
      settings-provider.tsx     — GiselleSettingsProvider<TState> component
      settings-context.ts       — createContext + GiselleSettingsContext export
      settings-types.ts         — BaseSettingsState, GiselleSettingsContextValue, etc.
      index.ts                  — barrel: re-exports component, hook, types
      README.md                 — why it exists, design decisions, usage examples
      settings-provider.test.ts — Vitest tests (render, setField, canReset, reset, version)
  utils/
    use-local-storage.ts        — (new) SSR-safe hook
    is-deep-equal.ts            — (new) recursive equality
    cookie.ts                   — (new) getCookieValue / setCookieValue
```

---

## Integration with GiselleThemeProvider

`GiselleSettingsProvider` is the settings _state_ layer.
`GiselleThemeProvider` is the MUI theme _application_ layer.

The two integrate via a `withSettings` adapter — the consumer (or a
built-in `GiselleThemeAndSettingsProvider` convenience wrapper) reads
`state.mode`, `state.direction`, etc. and passes them to `GiselleThemeProvider`:

```tsx
// Convenience wrapper (Phase D integration):
function GiselleThemeAndSettingsProvider({ children, defaultSettings }: Props) {
  return (
    <GiselleSettingsProvider defaultSettings={defaultSettings}>
      <SettingsThemeBridge>{children}</SettingsThemeBridge>
    </GiselleSettingsProvider>
  );
}

// SettingsThemeBridge reads settings, applies them to the theme:
function SettingsThemeBridge({ children }: { children: ReactNode }) {
  const { state } = useGiselleSettings();
  return (
    <GiselleThemeProvider
      themeOverrides={{ palette: { mode: state.mode } }}
      direction={state.direction}
    >
      {children}
    </GiselleThemeProvider>
  );
}
```

---

## Migration guide

This is a one-import swap. The context shape is identical.

| Before                                                         | giselle-mui                                                         |
| -------------------------------------------------------------- | ------------------------------------------------------------------- |
| `import { SettingsProvider } from 'src/components/settings'`   | `import { GiselleSettingsProvider } from '@alexrebula/giselle-mui'` |
| `import { useSettingsContext } from 'src/components/settings'` | `import { useGiselleSettings } from '@alexrebula/giselle-mui'`      |
| `state.mode`, `state.direction`, `setField`, `onReset`, etc.   | Identical — no changes in consumer components                       |
| `storageKey = 'app-settings'`                                  | `storageKey` prop (default: `'giselle-settings'`)                   |
| `cookieSettings` from RSC                                      | `initialState` prop from RSC                                        |

---

## Implementation phases

### Phase α — Own utilities (prerequisite)

- `src/utils/use-local-storage.ts`
- `src/utils/is-deep-equal.ts`
- `src/utils/cookie.ts`
- Tests for all three

### Phase 1 — MVP: localStorage only

- `GiselleSettingsProvider<TState>` with `storage: 'localStorage'` (default only)
- `useGiselleSettings<TState>()` hook
- Version check on mount
- Full Vitest test suite
- Storybook story: default, setField, reset, drawer toggle

### Phase 2 — Cookie support

- `storage: 'cookie'` option
- `storage: StorageAdapter<T>` custom adapter
- `detectGiselleSettings()` server helper (separate `/server` entrypoint)
- Test: hydration safety with `initialState` prop

### Phase 3 — GiselleThemeProvider integration

- `SettingsThemeBridge` internal bridge component
- `GiselleThemeAndSettingsProvider` convenience wrapper (Phase D milestone)
- `withSettings` theme transformer function
- Migration guide in README and theming-nextjs.md

---

## Related docs

- [`docs/roadmap.md`](../roadmap.md) — Phase D milestone table
- [`docs/theming/nextjs.md`](../theming/nextjs.md) — consumer wiring guide
- `alexrebula/docs/roadmap.md` — Phase 1.5 extraction milestone
