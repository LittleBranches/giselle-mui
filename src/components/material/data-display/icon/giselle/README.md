# GiselleIcon

`@iconify/react`'s `Icon` component with full MUI `sx` support — and none of the
TypeScript pitfalls that come with combining Iconify and MUI Box.

---

## Why this component exists

Adding MUI `sx` support to `@iconify/react`'s `Icon` has several non-obvious pitfalls.
Each of the six problems below is either a TypeScript failure, a silent visual bug, or
a design coupling that naive implementations fall into — and that `GiselleIcon` avoids.

### Problem 1 — `Box component={Icon}` fails TypeScript

The obvious way to add MUI `sx` to an Iconify icon is:

```tsx
// ❌ TypeScript rejects this
<Box component={Icon} icon="solar:rocket-bold-duotone" sx={{ color: 'primary.main' }} />
```

`@iconify/react` types its `display` prop as `string | number`. MUI Box types `display`
as `ResponsiveStyleValue<Display | ...>`. TypeScript cannot reconcile these, and rejects
the call with a "no overload matches" error — across both Box overloads.

The fix: a `Box component="span"` owns the `sx` layer. The inner `Icon` renders the SVG.
The span uses `display: inline-flex; line-height: 0` to suppress the default baseline gap
that otherwise misaligns icons inside flex/grid containers.

```tsx
// ✅ GiselleIcon — what this component does internally:
<Box component="span" sx={{ display: 'inline-flex', lineHeight: 0, width, height }}>
  <Icon icon={icon} width="100%" height="100%" />
</Box>
```

### Problem 2 — baseline gap in flex containers

Inline elements sit on the text baseline by default. Without `line-height: 0`, an Iconify
icon inside a `Stack direction="row"` has a few pixels of invisible space below it, pushing
sibling elements up or down. The span wrapper eliminates this completely.

### Problem 3 — zero non-MIT dependencies

Some Icon+MUI wrapper implementations pull in app-specific or framework-internal helpers
(`registerIcons`, `allIconNames`, `iconifyClasses`, `mergeClasses`) that are not
MIT-licensed and not reusable across projects. `GiselleIcon` depends only on
`@iconify/react` (Apache 2.0) and `@mui/material` (Apache 2.0). Fully open-source.
Safe to publish.

### Problem 4 — `styled(Icon)` breaks responsive `sx` sizing

The first instinct when adding MUI styling to `Icon` is `styled(Icon)`. But this puts
`sx` on the SVG element directly — and SVG attributes are not CSS properties. This means:

```tsx
// ❌ styled(Icon) approach — sx={{ width }} sets an SVG *attribute*, not a CSS property.
// Responsive objects are silently ignored by the browser:
<IconWrapper icon="solar:rocket-bold-duotone" sx={{ width: { xs: 20, md: 28 } }} />
// → renders at the SVG's default width regardless of breakpoint
```

`GiselleIcon` puts `sx` on a `Box component="span"` — a plain HTML element where CSS
custom properties and media queries work correctly. The inner `Icon` renders at
`width="100%" height="100%"`, so the span's CSS dimensions control everything:

```tsx
// ✅ GiselleIcon — sx is CSS on a span. Responsive breakpoint objects work:
<GiselleIcon
  icon="solar:rocket-bold-duotone"
  sx={{ width: { xs: 20, sm: 24, md: 28 }, height: { xs: 20, sm: 24, md: 28 } }}
/>
```

### Problem 5 — registration side-effect inside render

A common pattern is to call `registerIcons()` inside the component body on every render:

```tsx
export function IconWrapper({ ... }) {
  registerIcons(); // ← side-effect in render
  return <IconRoot ... />;
}
```

While `registerIcons()` is idempotent (it no-ops after the first call), calling it inside
React's render cycle is technically a side-effect in a pure render function. React Strict
Mode double-invokes render functions to surface this kind of issue. The idiomatic pattern
is to call registration at module level — once, before any component renders.

`GiselleIcon` has **zero knowledge of registration**. It renders whatever icon name it
receives. Registration is entirely the consuming app's responsibility, invoked at module
level in a framework-appropriate location. This is a cleaner separation of concerns.

### Problem 6 — `icon` prop type is coupled to the consuming app's icon set

Typing the `icon` prop as `IconifyName = keyof typeof allIcons` ties it directly to the
specific icon strings registered in one project's `icon-sets.ts`.
A component library cannot use this type — the library cannot know which icons each
consuming app will register.

`GiselleIcon` types `icon` as `string`. The library stays decoupled from any specific
icon set. Individual consuming apps can re-narrow the type to their own `IconifyName` at
the usage site if they want strict icon-name checking.

---

## Basic usage

```tsx
import { GiselleIcon } from '@alexrebula/giselle-mui';

// Default size (20px square)
<GiselleIcon icon="solar:rocket-bold-duotone" />

// Custom size
<GiselleIcon icon="solar:rocket-bold-duotone" width={36} />

// MUI sx theming — color, spacing, responsive
<GiselleIcon icon="logos:typescript-icon" width={32} sx={{ color: 'primary.main', mr: 1 }} />

// Responsive size — inner SVG fills the wrapper, so breakpoint values work correctly
<GiselleIcon
  icon="solar:rocket-bold-duotone"
  sx={{ width: { xs: 20, sm: 24, md: 28 }, height: { xs: 20, sm: 24, md: 28 } }}
/>

// Flip / rotate
<GiselleIcon icon="solar:arrow-right-bold" flip="horizontal" />
<GiselleIcon icon="solar:arrow-right-bold" rotate={1} />
```

### As a ReactNode slot in other components

`MetricCard`, `SelectableCard`, and other `@alexrebula/giselle-mui` components accept
icons as `ReactNode` slots — they have zero icon-library dependency themselves.
`GiselleIcon` is the intended slot filler:

```tsx
import { MetricCard, MetricCardDecoration, GiselleIcon } from '@alexrebula/giselle-mui';

<MetricCard
  value="20+"
  label="Years"
  sublabel="of experience"
  icon={<GiselleIcon icon="solar:clock-circle-bold-duotone" />}
  decoration={<MetricCardDecoration />}
/>;
```

---

## Icon sources — where to find icons

`GiselleIcon` accepts any icon identifier from the
[Iconify icon library](https://icon-sets.iconify.design/) in the format `"prefix:name"`:

```
"solar:rocket-bold-duotone"  → Solar collection, "rocket-bold-duotone" icon
"logos:typescript-icon"      → Logos collection, "typescript-icon" icon
"simple-icons:github"        → Simple Icons collection, "github" icon
```

Browse the full catalogue (200,000+ icons) at **https://icon-sets.iconify.design/**.

All icon sets used in this library are open source:

| Collection prefix | License        | Typical use                              |
| ----------------- | -------------- | ---------------------------------------- |
| `solar:`          | Apache 2.0     | UI icons — bold, duotone, outline styles |
| `logos:`          | CC0 1.0 (most) | Brand / technology logos                 |
| `simple-icons:`   | Apache 2.0     | Brand icons, monochrome                  |

---

## Icon registration — understanding the two modes

`@iconify/react` has two ways to resolve icons at render time. Understanding the
difference matters for performance and reliability.

### Mode 1 — Online (CDN) loading _(zero setup, but not production-ready)_

If an icon is not pre-registered, `@iconify/react` automatically fetches it from the
Iconify CDN (`https://api.iconify.design/`). This works in **any framework** — no
configuration required.

```tsx
// This just works — no setup, icons load from CDN automatically
<GiselleIcon icon="solar:rocket-bold-duotone" />
```

**Trade-offs:**

|                                 |                                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------ |
| ✅ Zero setup                   | ❌ Visible flicker — the icon is blank until the network round-trip completes (100–500 ms) |
| ✅ Access to all 200,000+ icons | ❌ Network dependency — any CDN outage silently breaks icons                               |
| ✅ Works in any framework       | ❌ Not bundled — icon data is absent from your JS output                                   |
|                                 | ❌ Not suitable for production                                                             |

**Use online mode for:** prototyping, quick demos, or Storybook development where you
want to try different icons without a build step.

---

### Mode 2 — Offline registration _(recommended for production)_

Pre-register icon SVG bodies into the `@iconify/react` store before any component
renders. Icons are bundled directly in your JS output — no network requests, no flicker.

**Trade-offs:**

|                                            |                                       |
| ------------------------------------------ | ------------------------------------- |
| ✅ No flicker — icons are in the JS bundle | ❌ One-time setup (~30 min)           |
| ✅ No network dependency                   | ❌ You curate which icons are bundled |
| ✅ Fully bundled — icons in your JS output |                                       |
| ✅ Works in any framework                  |                                       |

The setup has three files, regardless of framework:

1. **`icon-sets.ts`** — your icon data (SVG bodies + dimensions). Lives in your app, never in the library.
2. **Registrar call** — `registerIcons()` called at module level before React renders. Where this goes depends on the framework (see below).
3. **Usage** — `<GiselleIcon icon="prefix:name" />` — same API whether online or offline.

---

## Offline registration — step-by-step setup

`createIconRegistrar` is **not tied to Next.js**. It uses `addCollection` from
`@iconify/react`, which is a framework-agnostic store. The only requirement is that
`registerIcons()` is called synchronously at module level before any `GiselleIcon` renders.

### Step 1 — Create your icon data file

Create a single `icon-sets.ts` file in your `src/` folder. This file holds all
inline SVG body strings for every icon your app uses.

```
src/
├── icon-sets.ts        ← create this
├── App.tsx
└── main.tsx
```

```ts
// src/icon-sets.ts
import { createIconRegistrar } from '@alexrebula/giselle-mui';

export const registerIcons = createIconRegistrar({
  // ─── Solar icons (24×24 viewBox — no explicit dims needed) ───────────────
  'solar:rocket-bold-duotone': {
    body: '<path fill="currentColor" d="M12 2c0 0-7 4.463-7 10.664..." /><path fill="currentColor" d="..." opacity=".5"/>',
  },
  'solar:clock-circle-bold-duotone': {
    body: '<path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10..." opacity=".5"/><path fill="currentColor" fill-rule="evenodd" d="M12 7.25a.75.75..." clip-rule="evenodd"/>',
  },
  'solar:star-shine-bold-duotone': {
    body: '<path fill="currentColor" d="M10.08 7.897C11.157 5.966 11.695 5 12.5 5s1.343.966..." />',
  },

  // ─── Logos collection (non-24 viewBox — always declare width + height) ───
  //
  // logos: icons draw paths on 256×256 or larger coordinate systems.
  // Omitting width/height causes the 24×24 collection default to apply,
  // silently clipping or zooming the icon. No error is shown.
  //
  'logos:typescript-icon': {
    width: 256,
    height: 256,
    body: '<path fill="#3178c6" d="M20 0h216c11.046 0 20 8.954 20 20v216..." /><path fill="#fff" d="M150.518 200.475v27.62..." />',
  },
  'logos:react': {
    width: 256,
    height: 228,
    body: '<path fill="#00d8ff" d="M210.483 73.824a172 172 0 0 0-8.24-2.597..." />',
  },
  'logos:nextjs-icon': {
    width: 180,
    height: 180,
    body: '<defs><linearGradient id="a" ...>...</linearGradient>...</defs><circle cx="90" cy="90" r="90"/>...',
  },

  // ─── simple-icons (24×24 — no explicit dims needed) ──────────────────────
  'simple-icons:github': {
    body: '<path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12..." />',
  },
});
```

> **Where do the body strings come from?** See [How to get icon SVG body strings](#how-to-get-icon-svg-body-strings) below.
>
> **Logos viewBox dimensions?** See [ViewBox rule for logos: icons](#viewbox-rule-for-logos-icons) below.

---

### Step 2 — Call registerIcons() before React renders

`registerIcons()` must be called **at module level** (not inside a React component,
not in `useEffect`). Module-level code runs synchronously when the JS bundle evaluates —
before any component mounts — so the store is populated before the first render.

Where to put this call depends on your framework.

---

#### React — Vite / CRA

**Project layout:**

```
src/
├── icon-sets.ts          ← Step 1 (your icon data)
├── App.tsx
└── main.tsx              ← Step 2 (registerIcons() call goes here)
```

```tsx
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { App } from './App';
import { registerIcons } from './icon-sets';

// ← Module-level call. Runs synchronously before createRoot.
// No client boundary needed — Vite/CRA never runs code on a server.
registerIcons();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>
);
```

**Using icons in any component:**

```tsx
// src/components/my-feature.tsx
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { GiselleIcon } from '@alexrebula/giselle-mui';

// ✅ Icons are already in the store — no CDN fetch, no flicker.
// Works in any component, any route, any render depth.
export function FeatureCard() {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <GiselleIcon icon="solar:rocket-bold-duotone" width={24} sx={{ color: 'primary.main' }} />
      <Typography variant="body1">High-Performance UIs</Typography>
    </Stack>
  );
}
```

---

#### Next.js — App Router

App Router runs components on the server by default. `addCollection` writes to
the `@iconify/react` module-level store in memory — if called from a server component,
it writes to the **server's** memory, which is discarded before the response is sent
to the browser. The browser's store remains empty.

The fix: a small `'use client'` wrapper component that calls `registerIcons()` at
module level. This guarantees the call runs in the **browser's** JS runtime.

**Recommended project layout:**

```
src/
├── components/
│   └── icon-sets.ts         ← Step 1 (your icon data, lives with components)
│
└── app/
    ├── icon-registrar.tsx   ← Step 2 (the 'use client' wrapper — lives next to layout)
    └── layout.tsx           ← Step 3 (mounts <IconRegistrar />)
```

> **Why `src/app/icon-registrar.tsx` and not `src/components/`?**
> `icon-registrar.tsx` is an app-level singleton initializer — it has no UI, no props, and
> is never reused. Placing it next to `layout.tsx` (its only consumer) makes the
> dependency obvious. Components in `src/components/` are reusable; this is not.

```ts
// src/components/icon-sets.ts  (or src/icon-sets.ts — your choice)
import { createIconRegistrar } from '@alexrebula/giselle-mui';

export const registerIcons = createIconRegistrar({
  'solar:rocket-bold-duotone': {
    body: '<path fill="currentColor" d="..." />',
  },
  'logos:typescript-icon': {
    width: 256,
    height: 256,
    body: '<path fill="#3178c6" d="..." />',
  },
  // ... all icons your app uses
});
```

```tsx
// src/app/icon-registrar.tsx
'use client';

// WHY 'use client' — addCollection modifies the @iconify/react module-level
// store. Server components run on the server; their module-level side-effects
// write to server memory, which is discarded before the page reaches the browser.
// 'use client' ensures this module evaluates in the browser's JS runtime.
//
// WHY module-level call — calling registerIcons() at module level (not inside
// a hook or the render body) guarantees it runs synchronously when the JS bundle
// is evaluated — before any component mounts. This is the earliest possible
// moment, on every route, without polling or waiting.

import { registerIcons } from '../components/icon-sets';

registerIcons(); // ← module-level

export function IconRegistrar() {
  return null; // This component has no UI — it exists only for the side-effect above.
}
```

```tsx
// src/app/layout.tsx
import { IconRegistrar } from './icon-registrar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            {/* Mount before any route content to guarantee icons are registered
                on the very first render of every page. */}
            <IconRegistrar />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
```

**Using icons in Server Components:**

```tsx
// src/app/page.tsx  (Server Component — no 'use client' needed)
import { GiselleIcon } from '@alexrebula/giselle-mui';

// GiselleIcon is a client component internally (it uses MUI sx which needs
// a theme context). Next.js will automatically include it in the client bundle.
// Because IconRegistrar runs before this renders, icons are in the store.
export default function HomePage() {
  return (
    <section>
      <GiselleIcon icon="solar:rocket-bold-duotone" width={32} />
      <h1>My App</h1>
    </section>
  );
}
```

**Using icons in Client Components:**

```tsx
// src/components/expertise-card.tsx
'use client';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { GiselleIcon } from '@alexrebula/giselle-mui';

interface Props {
  icon: string; // e.g. "solar:rocket-bold-duotone"
  title: string;
}

// ✅ Offline-registered — no flicker even on animated reveal
export function ExpertiseCard({ icon, title }: Props) {
  return (
    <Stack spacing={2}>
      <GiselleIcon icon={icon} width={44} sx={{ color: 'primary.main' }} />
      <Typography variant="h6">{title}</Typography>
    </Stack>
  );
}
```

**Using icons as ReactNode slots:**

```tsx
// src/app/page.tsx
import { MetricCard, MetricCardDecoration, GiselleIcon } from '@alexrebula/giselle-mui';

// Pass GiselleIcon as a ReactNode slot — the icon is resolved offline,
// so there is no CDN fetch even when the card animates in on scroll.
export default function StatsSection() {
  return (
    <MetricCard
      value="20+"
      label="Years experience"
      sublabel="of experience"
      color="primary"
      icon={<GiselleIcon icon="solar:clock-circle-bold-duotone" width={36} />}
      decoration={<MetricCardDecoration color="primary" />}
    />
  );
}
```

---

#### Next.js — Pages Router

In Pages Router, `_app.tsx` always runs on the client. No `'use client'` wrapper needed.

**Project layout:**

```
src/
├── icon-sets.ts          ← Step 1 (your icon data)
└── pages/
    └── _app.tsx          ← Step 2 (registerIcons() call goes here)
```

```tsx
// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import { registerIcons } from '../icon-sets';

// ← Module-level call. Pages Router always runs _app.tsx on the client,
// so no 'use client' boundary is needed.
registerIcons();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

**Using icons in any page or component:**

```tsx
// src/pages/index.tsx
import { GiselleIcon } from '@alexrebula/giselle-mui';

export default function HomePage() {
  return (
    <main>
      {/* ✅ Store is populated — renders inline, no CDN fetch */}
      <GiselleIcon icon="logos:react" width={40} />
      <GiselleIcon icon="logos:typescript-icon" width={40} />
      <GiselleIcon icon="logos:nextjs-icon" width={40} />
    </main>
  );
}
```

---

#### Remix

```
app/
├── icon-sets.ts     ← Step 1 (your icon data)
└── root.tsx         ← Step 2 (registerIcons() call goes here)
```

```tsx
// app/root.tsx
import { registerIcons } from './icon-sets';

// ← Module-level — runs before any route renders.
// Remix bundles this for the browser, no server-only concern here.
registerIcons();

export default function Root() {
  return (
    <html>
      <body>
        <Outlet />
      </body>
    </html>
  );
}
```

---

## ViewBox rule for logos: icons

`createIconRegistrar` defaults all collections to a **24×24 viewBox**, which is correct
for Solar and simple-icons. The `logos:` collection draws icons on much larger coordinate
systems — typically 256px or larger.

**Without explicit `width`/`height`, a logos: icon will render clipped or zoomed in.**
No error is shown — it is a silent visual artifact.

| Icon                    | Correct viewBox | Required in icon data     |
| ----------------------- | --------------- | ------------------------- |
| `logos:typescript-icon` | 256×256         | `width: 256, height: 256` |
| `logos:material-ui`     | 256×222         | `width: 256, height: 222` |
| `logos:angular-icon`    | 250×266         | `width: 250, height: 266` |
| `logos:framer`          | 256×384         | `width: 256, height: 384` |
| `logos:figma`           | 256×384         | `width: 256, height: 384` |
| `logos:adobe`           | 512×134         | `width: 512, height: 134` |
| `logos:nextjs-icon`     | 180×180         | `width: 180, height: 180` |

**How to find the correct dimensions:** open
`node_modules/@iconify-json/logos/icons.json`, find your icon by name, and copy
the `width` and `height` fields. If the icon entry has no `width`/`height`, the
collection-level default applies — check the top-level `width`/`height` in the same file.

```ts
// ❌ Wrong — inherits 24×24 default, Angular paths are clipped
'logos:angular-icon': {
  body: '<path fill="#E23237" d="M0 134.5 ..." />'
}

// ✅ Correct — explicit dims match the coordinate space
'logos:angular-icon': {
  width: 250,
  height: 266,
  body: '<path fill="#E23237" d="M0 134.5 ..." />'
}
```

---

## Monorepo / local link caveat (webpack)

If `@alexrebula/giselle-mui` is linked locally (via `npm link`, a workspace junction,
or `file:` in package.json), **webpack may bundle two separate copies of `@iconify/react`**
— one for the app, one for the linked package. Each copy has its own empty icon store.
`registerIcons()` populates the app's store; `GiselleIcon` reads from the package's store
(still empty) → flicker.

Fix: alias `@iconify/react` to your app's copy in webpack config:

```ts
// next.config.ts
import path from 'path';

const r = (pkg: string) => path.resolve(__dirname, 'node_modules', pkg);

webpack(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@iconify/react': r('@iconify/react'),
  };
  return config;
}
```

This is the same deduplication pattern used for `@mui/material` in multi-package setups.

---

## How to get icon SVG body strings

The `body` string is the SVG content between `<svg>` and `</svg>` — all the `<path>`,
`<circle>`, `<g>` elements, but not the outer `<svg>` tag itself.

**Option A — from installed packages (recommended):**

```bash
npm install --save-dev @iconify-json/solar @iconify-json/logos
```

Then open `node_modules/@iconify-json/solar/icons.json` and find your icon:

```json
{
  "icons": {
    "rocket-bold-duotone": {
      "body": "<path fill=\"currentColor\" d=\"...\" />"
    }
  }
}
```

Copy the `body` value into your `icon-sets.ts` entry.

**Option B — from the Iconify website:**

1. Go to https://icon-sets.iconify.design/
2. Find and open your icon
3. Click "SVG" to download or copy the raw SVG
4. Extract everything between `<svg ...>` and `</svg>`

> **Do not import `@iconify-json/*` packages at runtime.** Each collection JSON file is
> 3–8 MB (thousands of icons). Static JSON does not tree-shake — if you import it, you
> ship it all. Use the `body` string approach: one entry per icon you actually use,
> bundling only exactly the bytes needed.

---

## Props

| Prop        | Type                                                  | Default | Description                                          |
| ----------- | ----------------------------------------------------- | ------- | ---------------------------------------------------- |
| `icon`      | `string`                                              | —       | Iconify identifier: `"prefix:name"`                  |
| `width`     | `number \| string`                                    | `20`    | Icon width in px (or any CSS length)                 |
| `height`    | `number \| string`                                    | `width` | Icon height. Defaults to `width` (square)            |
| `sx`        | `SxProps<Theme>`                                      | —       | MUI sx — applied to the outer `Box component="span"` |
| `className` | `string`                                              | —       | CSS class forwarded to the inner `<svg>`             |
| `style`     | `CSSProperties`                                       | —       | Inline style forwarded to the inner `<svg>`          |
| `flip`      | `"horizontal" \| "vertical" \| "horizontal,vertical"` | —       | Mirror the icon                                      |
| `rotate`    | `0 \| 1 \| 2 \| 3 \| string`                          | —       | Rotate (quarter turns or CSS angle)                  |

---

## Quality status — 13 May 2026

| Dimension        | Score | Open items |
| ---------------- | ----- | ---------- |
| DoD (Scenario B) | 20/20 | —          |
| Best practices   | 13/13 | —          |

## Related

- [`createIconRegistrar`](../../utils/create-icon-registrar.ts) — the registration utility
- [`docs/iconify-registration.md`](../../../docs/iconify-registration.md) — full setup guide
- [Iconify icon browser](https://icon-sets.iconify.design/) — browse 200,000+ icons
- [`MetricCard`](../metric-card/README.md) — uses `GiselleIcon` as the `icon` slot
