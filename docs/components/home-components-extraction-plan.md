# Home Components — giselle-mui Extraction Plan

Seven animation-dependent components are prime candidates
for extraction into giselle-mui. Once extracted, they will be:

- **Framework-agnostic by contract** — no alexrebula data deps
- **Tested and documented in Storybook** — each one independently exercisable
- **Available to any consumer** via the correct subpath entry
- **Premium showcase candidates** — `InteractiveHeroLogo` in particular

This doc tracks the phased extraction. Phases must be done in order because each
builds on the previous phase's foundations.

---

## Why this matters

The giselle-mui playground/docs site (`giselle-docs`) will need a homepage. All seven
of these components are exactly what a polished homepage requires — hero background, floating
nav, animated section titles, icon cloud, interactive logo. Building them _in_ giselle-mui
and documenting them in Storybook serves two goals simultaneously:

1. **The portfolio gets better-tested, more maintainable components** — extracted from alexrebula,
   with proprietary identifier dependencies removed, independently regression-tested.
2. **giselle-docs gets a real homepage** using the components it ships — eating its own dog food.

---

## Dependency tree

```
Phase 1: Motion variant utilities (fadeVariants, slideVariants, scaleVariants)
   └─ Phase 2: SectionTitle + SectionCaption     [/motion]
   └─ Phase 3: FloatingSideNav                   [/motion]
   └─ Phase 4: SVG animation primitives          [/motion]
        └─ Phase 5: HeroBackground               [/motion]
        └─ Phase 6: FloatingIconCloud            [/motion]

Independent:
   Phase 7: InteractiveHeroLogo                  [/motion]  (largest, most valuable)
```

All extracted components go in the **`/motion` subpath** (`dist/motion.js`).
They all require `framer-motion` as a peer dep — already wired in `tsup.config.ts`
and `package.json`.

---

## Phase 1 — Motion variant utilities

**File:** `src/utils/motion-variants.ts`
**Exported from:** `src/motion-index.ts`

Defines clean, standalone framer-motion `Variants` factories. These are the giselle-mui
counterpart to the `fadeVariants`, `slideVariants`, `scaleVariants`, `rotateVariants` pattern.

```ts
// motion-variants.ts

export type MotionVariantOptions = {
  /** Distance in px for translate transitions. @default 24 */
  distance?: number;
  /** Duration in seconds. @default 0.48 */
  duration?: number;
};

/** Fade in/out with optional vertical slide. */
export function fadeVariants(
  direction: 'in' | 'inUp' | 'inDown' | 'inLeft' | 'inRight' | 'out' | 'outUp' | 'outDown',
  options?: MotionVariantOptions
): Variants { ... }

/** Scale in/out from a neutral starting size. */
export function scaleVariants(options?: MotionVariantOptions): Variants { ... }

/** Zoom in/out with opacity. */
export function zoomVariants(options?: MotionVariantOptions): Variants { ... }
```

**Blocker removed:** All components that currently import `fadeVariants` from
`../../../components/animate` switch to this.

**Storybook:** Not a visual component — no story needed. Unit tests assert variant shape
(hidden/visible keys, expected property names).

---

## Phase 2 — `SectionTitle` + `SectionCaption`

**alexrebula source:** `src/sections/home/components/section-title.tsx`
**giselle-mui target:** `src/components/layout/section-title/`
**Subpath:** `/motion`

Already listed in the Storybook title group map as `Layout/Section Title`.

### Blockers to fix (all mechanical)

| Blocker                                          | Fix                                            |
| ------------------------------------------------ | ---------------------------------------------- |
| proprietary alpha helper (removed) | `channelAlpha` from `src/utils/theme-utils.ts` |
| `fadeVariants` from the portfolio's animate utilities | Phase 1 `fadeVariants` utility                      |
| `m.h2`, `m.span`, `m.div`                        | `motion.h2`, `motion.span`, `motion.div`       |

### API (unchanged from alexrebula version)

```tsx
<SectionTitle
  caption="What I build"
  title="Open-source component"
  txtGradient="libraries"
  description="..."
/>
```

### Storybook stories

- `Default` — with caption, title, txtGradient, description
- `NoCaption` — title + txtGradient only (most common in practice)
- `SlotPropsOverride` — custom `variants` on caption/title/description slots
- `Responsive` — all breakpoints

---

## Phase 3 — `FloatingSideNav`

**alexrebula source:** `src/sections/home/components/floating-home-nav.tsx`
**giselle-mui target:** `src/components/nav/floating-side-nav/`
**Subpath:** `/motion`

**Note on naming:** `FloatingSubNav` (already in giselle-mui) is a bottom-anchored pill.
`FloatingSideNav` is a vertically stacked left-side pill. Different component, different
placement. They share `NavPill`-style item rendering but that's all.

### Key abstraction change

`FloatingHomeNav` reads from `useHomeScroll` context (alexrebula-specific). For giselle-mui:

- **Props-only API** — `isVisible`, `activeId`, `onSelect`
- **No internal scroll tracking** — the consumer provides state (just like `FloatingSubNav`)
- In alexrebula, `useHomeScroll` feeds these props

### Blockers to fix

| Blocker                                | Fix                                                                                                |
| -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| proprietary alpha helper (removed) | `channelAlpha`                                                                                     |
| `m.*` from framer-motion               | `motion.*`                                                                                         |
| `useHomeScroll` context                | Remove — accept `isVisible: boolean`, `activeId: string \| null`, `onSelect: (id: string) => void` |
| `IconifyName` type                     | Use `ReactNode` for icon slot (per rule 5)                                                         |

### API

```tsx
<FloatingSideNav
  items={[
    { id: 'hero', label: 'Hero', icon: <GiselleIcon icon="solar:home-bold" /> },
    { id: 'about', label: 'About', icon: <GiselleIcon icon="solar:user-bold" /> },
  ]}
  isVisible={scrollY > 200}
  activeId={activeId}
  onSelect={handleSelect}
/>
```

### Storybook stories

- `Default` — 4 items, static `isVisible={true}`, controlled active item
- `Hidden` — `isVisible={false}` — demonstrates AnimatePresence exit
- `ScrollDemo` — live scroll tracking via a `useScrollSpy` demo hook

---

## Phase 4 — SVG animation primitives

**alexrebula source:** `src/sections/home/components/svg-elements.tsx` + `hero-svg.tsx`
**giselle-mui target:** `src/components/layout/hero-background/` (internal sub-components)
**Subpath:** `/motion`

The animated SVG primitives (`FloatLine`, `FloatTriangle`, `FloatDot`, `CircleDot`, `PlusSign`)
are internal building blocks for `HeroBackground`. They should not be independently exported —
they only make sense in the context of the hero.

### Blocker to fix

`m.*` → `motion.*` across all primitives.

`styled(m.svg)` → `styled(motion.svg)` (pattern already used — confirm `shouldForwardProp`
is present per MUI Store quality bar rule).

---

## Phase 5 — `HeroBackground`

**alexrebula source:** `src/sections/home/components/hero-background.tsx`
**giselle-mui target:** `src/components/layout/hero-background/`
**Subpath:** `/motion`

A full-width animated hero background: radial gradient backdrop + SVG grid layer
(concentric circles, plus icons, animated draw lines).

### Blockers to fix

| Blocker                                                  | Fix                                                                                       |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `theme.mixins.bgGradient(...)` (legacy MUI mixin)        | CSS gradient directly: `background: \`radial-gradient(...)\``using`theme.vars.palette.\*` |
| `CONFIG.assetsDir` import                                | `backgroundImageSrc?: string` prop                                                        |
| `m.*`                                                    | `motion.*`                                                                                |
| `MotionContainer` from the portfolio's animate utilities | Replace with `motion.div` or Phase 1 variant                                              |

### API

```tsx
<HeroBackground
  backgroundImageSrc="/assets/background/overlay.webp"
  sx={{ position: 'absolute', inset: 0 }}
/>
```

### Storybook stories

- `Default` — full-page canvas, dark + light mode toggle
- `NoBackgroundImage` — gradient + SVG only (useful when no overlay image exists)
- `CustomColor` — shows how `sx` overrides the gradient tint

---

## Phase 6 — `FloatingIconCloud`

**alexrebula source:** `src/sections/home/components/floating-platform-icons.tsx`
**giselle-mui target:** `src/components/layout/floating-icon-cloud/`
**Subpath:** `/motion`

A floating cloud of icon images with seeded pseudo-random positioning. Used to show
platform logos, technology icons, or tool badges around a central focal point.

### Blockers to fix

| Blocker                                       | Fix                                |
| --------------------------------------------- | ---------------------------------- |
| `createPlatformIconItems` (alexrebula preset) | Remove — accept `items[]` directly |
| `m.*`                                         | `motion.*`                         |

### API

```tsx
<FloatingIconCloud
  items={[
    { label: 'React', src: '/icons/react.svg' },
    { label: 'TypeScript', src: '/icons/ts.svg' },
    { label: 'Next.js', src: '/icons/nextjs.svg' },
  ]}
/>
```

The `seededRandom` positioning logic is already self-contained and clean — copy it
directly into a co-located `floating-icon-cloud.utils.ts`.

### Storybook stories

- `Default` — 6–8 items, representative cloud
- `Dense` — 12+ items, shows how the cloud spreads
- `Responsive` — all breakpoints (cloud collapses at xs/sm)

---

## Phase 7 — `InteractiveHeroLogo` (flagship)

**alexrebula source:** `src/sections/home/components/interactive-hero-logo*` (8 files)
**giselle-mui target:** `src/components/layout/interactive-hero-logo/`
**Subpath:** `/motion`

### Why this is special

This is the highest-value component in the portfolio. Three-phase hover state machine:
`idle → artistic → portrait`. Frame-scrub animation from a sprite-like array of image
sources. Directional portrait that tracks pointer position around the logo (9 directions).
Respects `prefers-reduced-motion`. Already has the full giselle-mui file structure.

Premium angle: the `frameSources` prop is what makes this truly special — a designer
drops in 30 numbered frames and gets a smooth animation. This is a "carousel smart component"
level of value. Future `/premium` subpath export.

### What already exists (in alexrebula)

The alexrebula version already follows the full giselle-mui conventions:

| File                                   | Status                                   |
| -------------------------------------- | ---------------------------------------- |
| `interactive-hero-logo.tsx`            | ✅ Pure JSX composition, no inline logic |
| `interactive-hero-logo.types.ts`       | ✅ Complete, portfolio-agnostic types    |
| `interactive-hero-logo.const.ts`       | ✅ Named constants                       |
| `interactive-hero-logo.styles.ts`      | ✅ Extracted sx factories                |
| `interactive-hero-logo.styles.test.ts` | ✅ Mock-theme assertions exist           |
| `interactive-hero-logo.utils.ts`       | ✅ Pure logic, no JSX                    |
| `use-hover-phase-transition.ts`        | ✅ Clean hook, no alexrebula deps        |
| `artistic-logo-layer.tsx`              | ✅ Uses `motion.*` (already correct)     |
| `portrait-layer.tsx`                   | ✅ Uses `motion.*` (already correct)     |
| `original-logo-layer.tsx`              | ✅ Uses `motion.*` (already correct)     |

### What needs to change (minimal)

| Blocker                                   | File                             | Fix                                                                                    |
| ----------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------- |
| `m.*` from framer-motion                  | `interactive-hero-logo.tsx` only | `motion.*`                                                                             |
| `useImagePreloader` from alexrebula utils | `interactive-hero-logo.tsx`      | Copy utility to `src/utils/use-image-preloader.ts` in giselle-mui (pure hook, no deps) |

**That's it.** Two changes. This is the best-prepared component for extraction.

### API

```tsx
<InteractiveHeroLogo
  frameSources={Array.from({ length: 30 }, (_, i) => `/frames/frame-${i}.webp`)}
  artisticLogoSrc="/logo-artistic.webp"
  logoAlt="Alex Rebula"
  portraitSources={[
    { direction: 'left', src: '/portrait-left.webp' },
    { direction: 'right', src: '/portrait-right.webp' },
    { direction: 'forward', src: '/portrait-forward.webp' },
  ]}
/>
```

### Storybook stories

- `WithFrameScrub` — supply 5–10 sample frames (small webp assets in Storybook static dir)
- `WithPortrait` — show the directional portrait phase
- `ArtisticOnly` — no frame sources, just idle ↔ artistic
- `ReducedMotion` — wrap in a mock that forces `useReducedMotion → true`; assert portrait appears immediately
- `CustomChildren` — shows `children` slot (fallback when no frame animation)

### Future: `/premium` potential

The frame-scrub behaviour (`frameSources`) is the differentiating feature. When the
giselle-mui premium tier ships:

- Base component (`InteractiveHeroLogo`) → stays in `/motion` (free, open-source)
- Frame-scrub addon or extended "smart" variant → `/premium` subpath with showcase-quality
  sample frames included

---

## Execution order summary

| #   | Component                                 | Subpath   | Effort | Blocker?              |
| --- | ----------------------------------------- | --------- | ------ | --------------------- |
| 1   | Motion variant utilities (`fadeVariants` etc.) | `/motion` | S      | None                  |
| 2   | `SectionTitle` + `SectionCaption`         | `/motion` | S      | Phase 1               |
| 3   | `FloatingSideNav`                         | `/motion` | M      | Phase 1               |
| 4   | SVG animation primitives                  | `/motion` | S      | None                  |
| 5   | `HeroBackground`                          | `/motion` | M      | Phase 1, 4            |
| 6   | `FloatingIconCloud`                       | `/motion` | S      | None                  |
| 7   | `InteractiveHeroLogo`                     | `/motion` | M      | None (self-contained) |

**S** = half day · **M** = full day · **L** = multiple days

Start Phase 7 in parallel with Phase 1 — it has no blockers and the file structure
is already done. The only mechanical work is two import replacements + copy.
