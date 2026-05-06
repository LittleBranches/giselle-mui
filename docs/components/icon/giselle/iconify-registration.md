---
sidebar_position: 1
sidebar_label: 'Iconify Registration'
---

# Iconify Offline Registration

`GiselleIcon` renders icons from the `@iconify/react` in-memory store.

**What is the store?** It is a plain JavaScript object that `@iconify/react` holds in memory,
mapping icon names to their SVG body strings. When `GiselleIcon` renders, it looks up the icon
in this store. If the icon is there, it renders immediately. If it is **not**, `@iconify/react`
falls back to fetching the icon from the Iconify CDN.

**What is a CDN fetch?** CDN stands for Content Delivery Network — a global network of
servers that deliver static files quickly. The Iconify CDN (https://api.iconify.design/)
hosts SVG data for all 200,000+ icons. A "CDN fetch" means the browser makes a network
request at runtime (after the page has loaded) to download the icon data.

That store is **empty by default**. If you don't pre-load it, `@iconify/react`
falls back to a CDN fetch for every missing icon, causing three real problems in
production:

- **Visible flicker** — the icon slot is blank until the network round-trip completes
  (typically 100–500 ms). In animated sections (scroll-reveal, page transitions), the
  animation plays while the icon is still blank.
- **Network dependency** — if the CDN is down, or the user is offline, icons silently
  disappear. No error message, no fallback image.
- **Nothing bundled** — icon data is not in your JS output, so the browser re-downloads
  it on every visit.

The solution is **offline registration**: you copy the SVG body strings you need directly
into your consuming/client app's source code. `@alexrebula/giselle-mui` exports
`createIconRegistrar` to make this easy.

---

## How it works

`createIconRegistrar` takes a flat `"prefix:name"` → icon data map, groups the
entries into per-prefix Iconify collections, and returns an **idempotent**
`registerIcons()` function.

**What does idempotent mean?** It means the function is safe to call multiple times
but only does work on the first call. Every subsequent call returns immediately
without re-registering anything. This means you can import and call `registerIcons()`
from multiple files without worrying about duplicates or performance penalties.

**Why is this possible?** Because `registerIcons` is a **singleton** — or more
precisely, it behaves like one through a closure. `createIconRegistrar` captures a
private `let registered = false` flag inside the function it returns. That flag lives
for the entire lifetime of the returned `registerIcons` function, private to that
specific instance. When the function is called a second (or hundredth) time, it checks
the flag and returns immediately. No module-level global, no external store — the
single source of truth for "has this already run?" is that one closed-over variable.

```
Your icon-sets.ts
  ↓ createIconRegistrar({ 'solar:rocket': { body: '...' }, ... })
  → registerIcons()   ← idempotent, call at module level

Root layout mounts <IconRegistrar /> as a client component
  → registerIcons() runs synchronously when the JS bundle evaluates
  → @iconify/react store is populated before any GiselleIcon renders
  → No CDN fetch, no flicker
```

---

## Which icon sets can I use?

`GiselleIcon` works with **any** icon set from the Iconify platform
(https://icon-sets.iconify.design/) — you are not limited to Solar icons. Some commonly
used sets:

| Prefix | viewBox | Style | Good for |
|---|---|---|---|
| `solar:` | 24×24 | Bold, duotone, outline, linear | General UI icons |
| `simple-icons:` | 24×24 | Brand icons, monochrome | GitHub, Vercel, Figma logos |
| `logos:` | varies | Full-colour technology logos | React, TypeScript, Next.js |
| `mdi:` | 24×24 | Material Design Icons | Large general-purpose set |
| `ph:` | 24×24 | Phosphor icons | Clean, minimal style |
| `lucide:` | 24×24 | Lucide icons | Consistent, open-source |
| `tabler:` | 24×24 | Tabler icons | Stroke-based, clean |

The prefix (`solar`, `logos`, `mdi`, etc.) is the **collection name**. All 200,000+
icons from the Iconify catalog work — just copy the body string from the icon's
source `icons.json` and register it (see [How to get icon body strings](#how-to-get-icon-body-strings-for-any-icon) below).

---

## How to get icon body strings for any icon

The `body` field in your icon entry must contain exactly the SVG path content that
goes _inside_ an `<svg>` tag. Here is how to find it reliably:

**Method 1 — Iconify website (easiest)**
1. Go to https://icon-sets.iconify.design/
2. Find your icon — search by name or browse by collection
3. Click the icon → open the JSON tab → copy the `body` value

**Method 2 — Local package (most reliable)**
1. Install the icon set: `npm install --save-dev @iconify-json/solar`
2. Open `node_modules/@iconify-json/solar/icons.json`
3. Find your icon by name (e.g. `"rocket-bold-duotone"`)
4. Copy the `body` string and, if present, the `width`/`height` values

**Common mistakes that break icons:**

```ts
// ❌ WRONG: includes the <svg> wrapper
body: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="..." /></svg>'
// The <svg> tag is added by @iconify/react. If you include it yourself, you get a
// nested <svg> which browsers may render blank or incorrectly.

// ❌ WRONG: fill="black" on a monochrome icon
body: '<path fill="black" d="..." />'
// This hardcodes the colour. Use fill="currentColor" so the icon inherits the CSS
// `color` property, which makes sx={{ color: 'primary.main' }} work.

// ❌ WRONG: fill="#000000" — same issue as above
body: '<path fill="#000000" d="..." />'

// ✅ CORRECT: Solar icon (24×24 viewBox, currentColor fill)
body: '<path fill="currentColor" d="M12 2c..." />'

// ✅ CORRECT: Multi-path icon with fixed colours (brand logo)
body: '<path fill="#3178c6" d="..." /><path fill="#fff" d="..." />'

// ✅ CORRECT: Duotone icon (two paths, second at reduced opacity)
body: '<path fill="currentColor" d="..." opacity=".5"/><path fill="currentColor" d="..." />'
```

---

## Step-by-step setup

### 1. Install dependencies

```bash
npm install @iconify/react
```

`@iconify/react` is listed as `peerDependencies` in `@alexrebula/giselle-mui` —
you need to install it explicitly in your app.

> **Important for monorepos / local links (webpack):** If you link `giselle-mui`
> locally (e.g. via a symlink, junction, or `npm link`), webpack may resolve
> `@iconify/react` as two separate instances — one for the app, one for the linked
> package. Each instance has its own empty store, so `registerIcons()` populates
> one store while `GiselleIcon` reads from the other. The fix is to alias
> `@iconify/react` to your app's copy in `webpack.config.js` / `next.config.ts`:
>
> ```ts
> // next.config.ts
> config.resolve.alias = {
>   ...config.resolve.alias,
>   '@iconify/react': path.resolve(__dirname, 'node_modules/@iconify/react'),
> };
> ```

---

### 2. Create your icon-sets file in your consuming/client app

Create one file that holds all your icon body strings and exports a ready-to-call
`registerIcons` function. This file lives in your consuming/client app — not in any
library — because only your app knows which icons it needs.

Where to get icon body strings:
- Install the relevant `@iconify-json/*` package (e.g. `@iconify-json/solar`)
- Open `node_modules/@iconify-json/solar/icons.json`
- Find your icon by name and copy the `body` string (and `width`/`height` if non-24)

```ts
// src/icon-sets.ts
import { createIconRegistrar } from '@alexrebula/giselle-mui';

export const registerIcons = createIconRegistrar({
  // ─── Solar icons (24×24 viewBox — no width/height override needed) ───────
  'solar:rocket-bold-duotone': {
    body: '<path fill="currentColor" d="M12 2c..." /><path fill="currentColor" d="..." opacity=".5"/>',
  },
  'solar:clock-circle-bold-duotone': {
    body: '<path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2..." opacity=".5"/><path fill="currentColor" fill-rule="evenodd" d="M12 7.25a.75.75 0 0 1 .75.75v3.69l2.28 2.28..." clip-rule="evenodd"/>',
  },

  // ─── Logos collection (non-24 viewBox — explicit width/height required) ──
  //
  // The `logos:` collection draws paths on coordinate systems ranging from
  // 256×256 to 512×134. Without explicit dimensions, the collection default
  // (24×24) is applied, which clips the paths. Always declare width + height
  // for any logos: icon. See: docs/iconify-registration.md#viewbox-rule
  //
  'logos:react': {
    // React logo is 24×24 — no override needed
    body: '<g fill="#61DAFB"><circle cx="12" cy="12" r="2.05" /><g fill="none" stroke="#61DAFB" stroke-width="1.05">...</g></g>',
  },
  'logos:typescript-icon': {
    // TypeScript logo is 256×256
    width: 256,
    height: 256,
    body: '<path fill="#3178c6" d="M20 0h216c11.046 0 20 8.954 20 20v216c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20V20C0 8.954 8.954 0 20 0"/>...',
  },
  'logos:angular-icon': {
    // Angular logo is 250×266 — paths overflow a 24×24 viewBox if omitted
    width: 250,
    height: 266,
    body: '<path fill="#E23237" d="M125 2.819L4.355 46.918L22.608 202.43L125 257.17l102.393-54.742L245.644 46.918z"/>...',
  },
});
```

---

### 3. Create the registrar initializer — and place it correctly in your consuming/client app

`registerIcons()` must be called at **module level** — not inside a hook, not inside
a render body. Module-level code runs synchronously when the JS bundle evaluates,
before any component mounts.

**Where you put this call depends on your framework:**

| Framework | Where to call `registerIcons()` | Why |
|---|---|---|
| Vite / CRA | `src/main.tsx`, before `createRoot` | Always browser-only — no special wrapper needed |
| Next.js App Router | `src/app/icon-registrar.tsx` (`'use client'`) mounted in root layout | Server components run on the server; `'use client'` ensures store is populated in the browser |
| Next.js Pages Router | `pages/_app.tsx`, module level | `_app.tsx` always runs on the client |
| Remix | `app/root.tsx`, module level | Always browser-bundled |

---

#### For Next.js App Router — `src/app/icon-registrar.tsx`

Place the registrar file **next to your root `layout.tsx`**, not inside `src/components/`.
`icon-registrar.tsx` is an app-level singleton initializer: it has no UI, no props, and
is never reused. Placing it in `src/components/` implies it is a reusable component — which
it is not.

```
src/
└── app/
    ├── icon-registrar.tsx   ← lives here (app-level singleton)
    ├── layout.tsx           ← mounts <IconRegistrar />
    └── page.tsx
```

```tsx
// src/app/icon-registrar.tsx
'use client';

// WHY 'use client':
// addCollection writes to a module-level variable inside @iconify/react.
// App Router server components run on the server; their module-level side-effects
// write to the server's memory, which is discarded before the response reaches the
// browser. The browser's store remains empty.
// 'use client' ensures this module evaluates in the browser's JS runtime, where
// the @iconify/react store that GiselleIcon reads from actually lives.
//
// WHY module-level (not useEffect):
// Module-level code runs synchronously when the JS bundle evaluates — before any
// component mounts. useEffect runs after mount. By that time, GiselleIcon may have
// already tried to render, found the store empty, and triggered a CDN request.

import { registerIcons } from '../components/icon-sets';

registerIcons(); // ← module-level side-effect

export function IconRegistrar() {
  return null; // No UI — this component exists only for the side-effect above.
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
          <CssVarsProvider theme={theme}>
            {/* Must render before any route content so icons are ready
                on the first render of every page. */}
            <IconRegistrar />
            {children}
          </CssVarsProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
```

---

#### For Vite / CRA — `src/main.tsx`

No `'use client'` boundary needed. No separate wrapper file needed. Call directly in
the entry point before `createRoot`:

```
src/
├── icon-sets.ts    ← your icon data
├── App.tsx
└── main.tsx        ← registerIcons() call goes here, before createRoot
```

```tsx
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssVarsProvider } from '@mui/material/styles';
import { App } from './App';
import { registerIcons } from './icon-sets';

registerIcons(); // ← module-level, before createRoot

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssVarsProvider theme={theme}>
      <App />
    </CssVarsProvider>
  </StrictMode>
);
```

---

#### For Next.js Pages Router — `pages/_app.tsx`

`_app.tsx` always evaluates on the client. Module-level call, no wrapper needed:

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { CssVarsProvider } from '@mui/material/styles';
import { registerIcons } from '../src/icon-sets';

registerIcons(); // ← module-level — safe, _app.tsx is always client-side

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CssVarsProvider theme={theme}>
      <Component {...pageProps} />
    </CssVarsProvider>
  );
}
```

---

### 4. Using offline-registered icons in your components

Once `registerIcons()` has run, every `GiselleIcon` in your app resolves from the
in-memory store — no network request, no flicker, regardless of render depth or timing.

#### Basic usage

```tsx
import { GiselleIcon } from '@alexrebula/giselle-mui';

// All of these resolve offline — zero CDN traffic
<GiselleIcon icon="solar:rocket-bold-duotone" />
<GiselleIcon icon="solar:rocket-bold-duotone" width={36} />
<GiselleIcon icon="logos:typescript-icon" width={32} sx={{ color: 'primary.main' }} />
<GiselleIcon icon="simple-icons:github" width={20} sx={{ opacity: 0.8 }} />
```

#### Icon identity driven by data

A common pattern in portfolio and product sites: icon names come from a data layer (factory
functions or API), not hardcoded in JSX. Offline registration makes this safe at any scale.

```ts
// src/data/expertise.ts
export const expertiseItems = [
  {
    id: 'performance',
    icon: 'solar:rocket-bold-duotone',
    title: 'High-Performance UIs',
    metrics: [
      { value: '20+', label: 'Years', icon: 'solar:clock-circle-bold-duotone' },
      { value: '<600ms', label: 'Load target', icon: 'solar:rocket-bold-duotone' },
    ],
  },
  {
    id: 'typescript',
    icon: 'logos:typescript-icon',
    title: 'TypeScript & Code Quality',
    metrics: [
      { value: '100%', label: 'Strict mode', icon: 'logos:typescript-icon' },
    ],
  },
];
```

```tsx
// src/components/expertise-section.tsx
import { GiselleIcon, MetricCard, MetricCardDecoration } from '@alexrebula/giselle-mui';
import { expertiseItems } from '../data/expertise';

export function ExpertiseSection() {
  return (
    <ul>
      {expertiseItems.map((item) => (
        <li key={item.id}>
          {/* icon name comes from data — resolved offline, no CDN fallback */}
          <GiselleIcon icon={item.icon} width={44} sx={{ color: 'primary.main' }} />
          <h3>{item.title}</h3>

          {item.metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              value={metric.value}
              label={metric.label}
              color="primary"
              icon={<GiselleIcon icon={metric.icon} width={32} />}
              decoration={<MetricCardDecoration color="primary" />}
            />
          ))}
        </li>
      ))}
    </ul>
  );
}
```

#### Technology logo strip

A common tech-stack display pattern with logo icons:

```tsx
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { GiselleIcon } from '@alexrebula/giselle-mui';

const TECH_STACK = [
  { icon: 'logos:react',           label: 'React',      dims: [256, 228] },
  { icon: 'logos:nextjs-icon',     label: 'Next.js',    dims: [180, 180] },
  { icon: 'logos:typescript-icon', label: 'TypeScript', dims: [256, 256] },
  { icon: 'logos:material-ui',     label: 'MUI',        dims: [256, 222] },
  { icon: 'simple-icons:vitest',   label: 'Vitest',     dims: [24,  24]  },
];

// All logos: icons are pre-registered offline — renders identically whether
// online or offline, with or without CDN access.
export function TechStrip() {
  return (
    <Stack direction="row" spacing={2} flexWrap="wrap">
      {TECH_STACK.map(({ icon, label }) => (
        <Tooltip key={icon} title={label} arrow>
          <span>
            <GiselleIcon icon={icon} width={32} />
          </span>
        </Tooltip>
      ))}
    </Stack>
  );
}
```

#### Animated reveal (the original motivation)

The most common cause of the CDN flicker is animated sections: if an icon is loaded
from CDN and the animation plays before the CDN response arrives, the icon renders
blank during the reveal. Offline registration eliminates this entirely.

```tsx
'use client';

import { m } from 'framer-motion';
import { GiselleIcon } from '@alexrebula/giselle-mui';

// ✅ Offline-registered — icon is in the bundle.
// When the animation plays (scroll reveal, page transition, etc.),
// the SVG is available immediately. No blank frame, no flicker.
export function AnimatedFeatureCard({ icon, title }: { icon: string; title: string }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <GiselleIcon icon={icon} width={44} sx={{ color: 'primary.main' }} />
      <p>{title}</p>
    </m.div>
  );
}
```

---

## ViewBox rule — what is "collection-level" and why logos: icons need explicit dimensions

### What is a collection?

In Iconify, a **collection** is a named group of icons sharing a common prefix — all
`solar:*` icons are one collection, all `logos:*` icons are another, all `mdi:*` are
another. Each collection has an optional `width` and `height` field that serves as a
_fallback_ for any icon in that collection that does not declare its own dimensions.
This is the "collection-level" width/height.

`createIconRegistrar` sets this collection-level fallback to **24×24** for all
collections, which is correct for Solar, simple-icons, mdi, ph, lucide, tabler, and
most other popular sets — their paths are drawn on a 24×24 coordinate space.

### Why logos: is different

The `logos:` collection contains technology and product logos: React, TypeScript,
Next.js, Figma, Angular, and hundreds more. Unlike UI icon sets, these logos were
originally created as brand assets, not as icon set contributions. Their SVG paths
are drawn on much larger coordinate systems — typically 256×256, sometimes 512×134
or other non-standard sizes.

**Why use `logos:` at all?** If your consuming/client app displays expertise in
specific technologies — for example, showing a TypeScript expertise card, a React
feature block, or a tech-stack strip — it is architecturally consistent to render
_all_ icons through a single component (`GiselleIcon`) rather than mixing approaches.
Without `logos:`, you would have `<GiselleIcon>` for some icons and `<img>` or
`<SvgIcon>` for others, with two different systems for sizing, colour, and responsive
behaviour. Using `logos:` keeps the entire icon layer uniform.

**What happens if you omit `width`/`height` for a logos: icon?** The 24×24
collection-level fallback is applied to paths drawn for a 256×256 space. The icon
renders as if you zoomed into a 24×24 crop of the full 256×256 drawing — you see a
heavily clipped fragment. No console error, no warning; the icon just looks wrong.

`@iconify/react` uses `width`, `height`, and `body` to reconstruct the full SVG:

```
<svg viewBox="0 0 {width} {height}">{body}</svg>
```

For a `logos:typescript-icon` with paths drawn on 256×256, the correct entry is:

```ts
'logos:typescript-icon': {
  width: 256,   // ← tells @iconify/react the viewBox is 0 0 256 256
  height: 256,
  body: '<path fill="#3178c6" d="..." /><path fill="#fff" d="..." />',
}
```

Some example viewBox dimensions from the `logos:` collection:

| Icon | viewBox |
|---|---|
| `logos:typescript-icon` | 256×256 |
| `logos:angular-icon` | 250×266 |
| `logos:material-ui` | 256×222 |
| `logos:adobe` | 512×134 |
| `logos:framer` | 256×384 |

To find the correct values for any icon: open `node_modules/@iconify-json/logos/icons.json`,
find your icon by name, and copy the `width` and `height` fields if present.

---

## Why not `pickIcons()`?

A common alternative pattern using `@iconify-json/*` packages:

```ts
// ❌ ANTIPATTERN — do not do this
import { icons as solarIcons } from '@iconify-json/solar';
import { pickIcons } from '@iconify/utils';

addCollection(pickIcons(solarIcons, ['rocket-bold-duotone', ...]));
```

This pattern:
- **Does not tree-shake.** `@iconify-json/solar` is a static JSON file (~6 MB, 9,495 icons).
  Importing it means your bundle contains all 9,495 icon bodies, even if you use 12.
- **Requires extra devDependencies** (`@iconify-json/solar`, `@iconify/utils`) in your app.
- **Ships ~100× more bytes** than the inline body approach for a typical icon set.

The inline body approach used by `createIconRegistrar` bundles exactly the bytes you need —
one `body` string per icon, nothing else.

---

## API reference

### `createIconRegistrar(icons)`

```ts
function createIconRegistrar(icons: GiselleIconMap): () => void
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `icons` | `GiselleIconMap` | Flat map of `"prefix:name"` → icon data |

Returns an idempotent `() => void` function. Safe to call multiple times — only
registers on the first call.

### `GiselleIconData`

```ts
interface GiselleIconData {
  body: string;      // raw SVG path content (no <svg> wrapper)
  width?: number;    // viewBox width — omit for 24×24 icons
  height?: number;   // viewBox height — omit for 24×24 icons
}
```

### `GiselleIconMap`

```ts
type GiselleIconMap = Record<string, GiselleIconData>;
// Keys are "prefix:name" strings, e.g. "solar:rocket-bold-duotone"
```
