import type { IconifyJSON } from '@iconify/react';

import { addCollection } from '@iconify/react';

// ----------------------------------------------------------------------
//
// WHY THIS EXISTS
//
// WHAT IS THE @iconify/react STORE?
// The "store" is a plain JavaScript object that @iconify/react holds in memory.
// It maps icon names (like "solar:rocket-bold-duotone") to their SVG body strings.
// When GiselleIcon renders, it looks up its icon in this store. If the icon is
// found, it renders immediately from the bundled data. If it is NOT found,
// @iconify/react falls back to fetching the icon from a CDN.
//
// WHAT IS A CDN FETCH?
// CDN = Content Delivery Network. It is a network of servers around the world
// that serves static files. The Iconify CDN (https://api.iconify.design/) hosts
// SVG data for all 200,000+ Iconify icons. A "CDN fetch" means the browser makes
// a network request to download that icon's data at runtime — after the page has
// already loaded. This causes three problems in production:
//
//   1. Visible flicker — the icon slot is blank until the network round-trip
//      completes (typically 100–500 ms). For animated sections (scroll-reveal,
//      page transitions), the animation plays while the icon is still blank.
//   2. Network dependency — if the CDN is down, or the user is on a slow/offline
//      connection, the icons simply do not appear. No error, no fallback image.
//   3. Nothing in the bundle — the icon SVG data is not included in your JS
//      output, so the browser must re-download it on every visit.
//
// The solution is "offline registration": you copy the SVG body strings you need
// directly into your consuming/client app's source code. `createIconRegistrar`
// bundles them into your JS output and loads them synchronously before any
// component renders — eliminating all three problems.
//
// HOW TO USE
//
//   // src/icon-sets.ts  (in your consuming/client app — NOT inside the library)
//   import { createIconRegistrar } from '@alexrebula/giselle-mui';
//
//   export const registerIcons = createIconRegistrar({
//     'solar:rocket-bold-duotone': {
//       body: '<path fill="currentColor" d="..." />',
//     },
//     'logos:react': {
//       // React logo is 24×24 — no width/height override needed
//       body: '<g fill="#61DAFB"><circle cx="12" cy="12" r="2.05" />...</g>',
//     },
//     'logos:angular-icon': {
//       // Angular paths are drawn on a 256×271 coordinate system (see VIEWBOX RULE below)
//       width: 256,
//       height: 271,
//       body: '<path fill="#E23237" d="M0 134.5..." />',
//     },
//   });
//
//   // src/app/icon-registrar.tsx  (next to layout.tsx in your consuming/client app)
//   //
//   // WHY 'use client'?
//   // In Next.js App Router, components run on the server by default. Server-side
//   // module evaluation writes to the server's memory — which is discarded before
//   // the response reaches the browser. The browser's @iconify/react store remains
//   // empty. 'use client' ensures this module runs in the browser's JS environment,
//   // where GiselleIcon will actually read the store.
//   //
//   // WHY module-level, not useEffect?
//   // useEffect runs after the component mounts. By that point GiselleIcon may
//   // have already attempted to render, found the store empty, and triggered a CDN
//   // request. Module-level code runs before React renders anything at all.
//   'use client';
//   import { registerIcons } from '../icon-sets'; // adjust path as needed
//
//   registerIcons();  // ← module-level side-effect — runs once at bundle evaluation
//
//   export function IconRegistrar() { return null; }
//
//   // Mount <IconRegistrar /> at the top of your root layout.tsx so it fires on
//   // every route. For Vite/CRA, call registerIcons() in main.tsx before createRoot.
//   // Full setup guide: docs/iconify-registration.md
//
// WHICH ICON SETS CAN YOU USE?
//
// GiselleIcon works with any icon set hosted on the Iconify platform
// (https://icon-sets.iconify.design/). You are not limited to Solar icons.
// Common sets used in practice:
//
//   solar:*         24×24   UI icons — bold, duotone, outline, linear styles
//   simple-icons:*  24×24   Brand icons — GitHub, Vercel, Figma, etc. (monochrome)
//   logos:*         varies  Technology and product logos — React, TypeScript, etc.
//   mdi:*           24×24   Material Design Icons — large general-purpose set
//   ph:*            24×24   Phosphor icons — clean, minimal style
//   lucide:*        24×24   Lucide icons — consistent, open-source
//
// The prefix ("solar", "logos", "mdi", etc.) is the collection name. Anything
// from Iconify's catalog works — just copy the body string from the icons.json
// source and register it. See GiselleIconData below for how to get body strings.
//
// VIEWBOX RULE — why `width` and `height` matter for some icons
//
// A "collection" in Iconify terms is a named group of icons sharing a common
// prefix — all "solar:*" icons are one collection, all "logos:*" are another.
// The collection-level `width`/`height` is a fallback that applies to every
// icon in that collection which does not declare its own dimensions.
//
// `createIconRegistrar` sets the collection-level default to 24×24, which is
// correct for Solar, simple-icons, mdi, ph, lucide, and most other sets.
//
// The `logos:` collection is different — it contains technology and brand logos
// (React, TypeScript, Next.js, Figma, etc.) whose paths are drawn on much
// larger coordinate systems, typically 256×256 but sometimes 512×134 or other
// non-standard sizes.
//
// WHY USE logos: AT ALL?
// If your consuming/client app displays expertise in specific technologies, it
// is architecturally consistent to render all icons through a single component
// (GiselleIcon) rather than mixing approaches — some icons from GiselleIcon,
// others from <img> tags or other sources. This keeps sizing, color, and
// responsive behaviour uniform across every icon in the app.
//
// For logos: icons, you MUST declare `width` and `height` on the icon entry.
// If you omit them, the 24×24 fallback applies to paths drawn for 256×256 —
// the icon appears heavily zoomed-in and clipped. No error is thrown; it
// simply looks wrong and is hard to diagnose without knowing this rule.
//
// ----------------------------------------------------------------------

/**
 * A single icon entry in the flat icon map.
 *
 * `body` — The raw SVG path content — everything that would go _inside_ the
 *   `<svg>` wrapper tag, not including the wrapper itself.
 *
 *   HOW TO GET THE BODY STRING FOR ANY ICON:
 *   1. Browse https://icon-sets.iconify.design/ and find your icon.
 *   2. Click the icon → "Download" → switch to "JSON" tab. You will see the
 *      raw `body` string. Alternatively:
 *   3. Install the icon set package: `npm install --save-dev @iconify-json/solar`
 *   4. Open `node_modules/@iconify-json/solar/icons.json`
 *   5. Find your icon by name (e.g. "rocket-bold-duotone") and copy the `body` value.
 *   6. Paste it as-is — do NOT wrap it in `<svg>...</svg>` tags.
 *
 *   COMMON MISTAKES WHEN COPYING SVG BODIES:
 *   ❌ Copying the full SVG file: `<svg viewBox="..." xmlns="..."><path .../></svg>`
 *      → The `<svg>` wrapper is added by @iconify/react. Including it yourself
 *        produces nested `<svg>` elements and breaks the icon.
 *   ❌ Keeping the `xmlns` attribute: `<path xmlns="http://www.w3.org/2000/svg" .../>`
 *      → The `xmlns` is already on the outer `<svg>`. Repeating it on inner
 *        elements is harmless in browsers but clutters the body string.
 *   ❌ Using `fill="black"` or `fill="#000000"` for monochrome icons
 *      → Use `fill="currentColor"` instead. This makes the icon inherit the CSS
 *        `color` property, so `sx={{ color: 'primary.main' }}` works.
 *   ✅ Correct body (Solar icon): `'<path fill="currentColor" d="M12 2c..." />'`
 *   ✅ Correct body (logo, multi-path): `'<path fill="#3178c6" d="..." /><path fill="#fff" d="..." />'`
 *
 * `width` — viewBox width. **Omit** for icons with a 24×24 viewBox (Solar,
 *   simple-icons, mdi, ph, lucide, etc.). **Required** for icons with a
 *   non-24 viewBox — the `logos:` collection commonly uses 256px or larger.
 *   To find the correct value: check the `width` field in the icon's source
 *   `icons.json`, or inspect the `viewBox` attribute of the raw SVG file.
 *
 * `height` — viewBox height. Same rule as `width`.
 */
export interface GiselleIconData {
  body: string;
  width?: number;
  height?: number;
}

/**
 * A flat map of icon entries keyed by `"prefix:name"` strings.
 *
 * @example
 * const icons: GiselleIconMap = {
 *   'solar:rocket-bold-duotone': { body: '...' },
 *   'logos:react': { body: '...' },
 *   'logos:angular-icon': { width: 256, height: 271, body: '...' },
 * };
 */
export type GiselleIconMap = Record<string, GiselleIconData>;

/**
 * Creates an idempotent icon registrar from a flat icon map.
 *
 * **Idempotent** means: safe to call multiple times, but only does work once.
 * The first call registers all icons with `@iconify/react`. Every subsequent
 * call is a no-op (it returns immediately without re-registering). This means
 * you can call `registerIcons()` at module level in multiple files without
 * worrying about duplicate registrations or performance penalties.
 *
 * Groups the flat `"prefix:name"` entries into per-prefix Iconify collections
 * and registers them with `@iconify/react`'s `addCollection` on the first call.
 *
 * Call the returned function at module level in your consuming/client app —
 * not inside a React component, not in a `useEffect` hook — so the store is
 * populated before any `GiselleIcon` attempts to render.
 *
 * @param icons - Flat map of `"prefix:name"` → icon data entries.
 * @returns An idempotent `registerIcons()` function.
 *
 * @example
 * // src/icon-sets.ts  (in your consuming/client app)
 * import { createIconRegistrar } from '@alexrebula/giselle-mui';
 *
 * export const registerIcons = createIconRegistrar({
 *   'solar:rocket-bold-duotone': { body: '...' },
 *   'logos:react': { body: '...' },
 *   'logos:typescript-icon': { width: 256, height: 256, body: '...' },
 * });
 */
export function createIconRegistrar(icons: GiselleIconMap): () => void {
  // Group the flat map into per-prefix IconifyJSON collections.
  // Collection-level width/height default to 24×24 (Solar / simple-icons standard).
  // Icons that carry their own width/height override the collection default.
  const collectionMap = new Map<string, IconifyJSON>();

  for (const [key, data] of Object.entries(icons)) {
    const colonAt = key.indexOf(':');
    if (colonAt === -1) continue; // silently skip malformed keys

    const prefix = key.slice(0, colonAt);
    const name = key.slice(colonAt + 1);

    if (!collectionMap.has(prefix)) {
      collectionMap.set(prefix, { prefix, width: 24, height: 24, icons: {} });
    }

    // Per-icon width/height (if present) will take precedence over the
    // collection default inside @iconify/react — no special handling needed.
    collectionMap.get(prefix)!.icons[name] = data;
  }

  const collections = Array.from(collectionMap.values());
  let registered = false;

  return function registerIcons(): void {
    if (registered) return;
    collections.forEach((collection) => addCollection(collection));
    registered = true;
  };
}
