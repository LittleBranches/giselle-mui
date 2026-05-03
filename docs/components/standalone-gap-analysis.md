---
sidebar_position: 6
sidebar_label: 'Standalone Project Gap Analysis'
---

# Standalone Project Gap Analysis

> _Last updated: May 2026_

This document answers a specific question: **what does `giselle-mui` need to export so
that a brand-new Next.js project can use it as a complete design system foundation —
with zero dependency on the Minimals MUI kit or any other proprietary theme?**

The analysis is driven by a real audit of `alexrebula`, which uses both giselle-mui and
Minimals. Every component and utility that alexrebula's own sections depend on has been
categorised here by its current status.

---

## Already shipped — usable today

These components are exported from `giselle-mui` and work in any MUI v7 project with zero
additional setup.

| Export                                | What it does                                       | Used in alexrebula                 |
| ------------------------------------- | -------------------------------------------------- | ---------------------------------- |
| `GiselleIcon`                         | Offline-safe Iconify icon wrapper                  | 5+ files                           |
| `TimelineTwoColumn`                   | Alternating two-column expandable timeline         | career-timeline, roadmap, case-001 |
| `MetricCard` + `MetricCardDecoration` | Metric card with stat, label, and decoration slot  | expertise-areas                    |
| `QuoteCard`                           | Pull-quote card with author, source, and icon slot | testimonials                       |
| `SelectableCard`                      | Keyboard-accessible selectable/toggle card         | billing/plan pages                 |
| `IconActionBar`                       | Row of icon buttons with tooltips                  | (ready, not yet wired)             |
| `createIconRegistrar`                 | Utility: registers Iconify icon sets offline       | icon-sets files                    |

---

## The structural blocker: `GiselleThemeProvider`

Without this, a blank Next.js project still has to wire up a MUI `CssVarsProvider` manually
to get CSS variables mode working. `GiselleThemeProvider` is the one export that makes
"zero Minimals" actually achievable — it replaces the entire Minimals `ThemeProvider` chain.

See [`theming/roadmap.md`](../theming/roadmap.md) Phases A → B → C for the full spec.

**Dependency chain (must go in order):**

```
Phase A: varAlpha, createPaletteChannel, pxToRem  ←  replaces minimal-shared/utils
    ↓
Phase B: giselleTheme (Giselle brand palette)
    ↓
Phase C: GiselleThemeProvider  ←  the structural enabler
    ↓
Phase D: UI primitives (see below)
```

---

## Phase D — UI primitives for standalone projects

These components do not exist in giselle-mui yet. They are the recurring layout patterns
in alexrebula's own sections — patterns that any new project would also need, and that
are currently only available by depending on Minimals (or reimplementing them from scratch).

### Ready to extract (minimal changes needed)

| Component              | Source in alexrebula                      | What's needed before extraction           |
| ---------------------- | ----------------------------------------- | ----------------------------------------- |
| `TwoColumnShowcaseRow` | `src/components/two-column-showcase-row/` | Nothing — clean, zero Minimals, ready now |
| `OptionWithBlurb`      | `src/components/option-with-blurb/`       | Nothing — tiny, clean, zero Minimals      |
| `SectionPendingLoader` | `src/components/section-pending-loader/`  | Switch internal `Iconify` → `GiselleIcon` |

### Need cleanup before extraction

| Component                               | Source                             | What needs to change                                           |
| --------------------------------------- | ---------------------------------- | -------------------------------------------------------------- |
| `FloatingSubNav` / `FloatingControlBar` | `src/components/floating-sub-nav/` | Replace `varAlpha` (Phase A first) + `Iconify` → `GiselleIcon` |

### Need to be written from scratch

These patterns appear repeatedly in alexrebula's own sections but are not currently
extracted into reusable components. They cannot be copied from alexrebula because that
repo uses the Minimals theme — any code that uses `varAlpha` from `minimal-shared/utils`
must be rewritten independently.

| Component                 | Pattern it encodes                                                                                            | Priority                                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `SectionContainer`        | `Container` + consistent vertical padding + optional title/subtitle header. Used on every section.            | High — needed by almost every page                                                                                                           |
| `HeroSection`             | Full-width hero with headline, subtitle, and CTA buttons. Appears in home, about, services, contact.          | High — every portfolio page has one                                                                                                          |
| `FAQAccordion`            | MUI `Accordion` with consistent styling and optional icon. Used in home and services.                         | Medium                                                                                                                                       |
| `GiselleSettingsProvider` | Clean-room equivalent of Minimals `SettingsProvider` — localStorage + cookie adapters, generic state, drawer. | High — prerequisite for migrating off `minimal-shared` hooks entirely. Full plan: [`settings-provider-plan.md`](./settings-provider-plan.md) |

---

## What a blank Next.js project actually needs

The minimum `layout.tsx` for a project built entirely on giselle-mui with no Minimals:

```tsx
// app/layout.tsx — zero Minimals
import { GiselleThemeProvider } from '@alexrebula/giselle-mui'; // Phase C
import { IconRegistrar } from '@alexrebula/giselle-mui';
import { createIconRegistrar } from '@alexrebula/giselle-mui';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GiselleThemeProvider>
          <IconRegistrar>{children}</IconRegistrar>
        </GiselleThemeProvider>
      </body>
    </html>
  );
}
```

Compare to alexrebula's current `layout.tsx` which wraps 8 providers — four of which
(`I18nProvider`, `AuthProvider`, `SettingsProvider`, Minimals `ThemeProvider`) are
Minimals-dependent and would be replaced by `GiselleThemeProvider` + `GiselleSettingsProvider`.

---

## Complete export checklist for "Minimals-free" standalone projects

```
# Already shipped
✅ GiselleIcon
✅ createIconRegistrar
✅ TimelineTwoColumn
✅ MetricCard + MetricCardDecoration
✅ QuoteCard
✅ SelectableCard
✅ IconActionBar

# Theming — Phase A → B → C
⬜ varAlpha                     (Phase A)
⬜ createPaletteChannel          (Phase A)
⬜ pxToRem / remToPx             (Phase A)
⬜ giselleTheme                  (Phase B)
⬜ GiselleThemeProvider          (Phase C)  ← structural blocker

# UI primitives — Phase D
⬜ TwoColumnShowcaseRow          (ready to extract)
⬜ OptionWithBlurb               (ready to extract)
⬜ SectionPendingLoader          (needs Iconify → GiselleIcon)
⬜ FloatingControlBar            (needs Phase A + Iconify → GiselleIcon)
⬜ SectionContainer              (write from scratch)
⬜ HeroSection                   (write from scratch)
⬜ FAQAccordion                  (write from scratch)
⬜ GiselleSettingsProvider       (write from scratch — Phase D prerequisite)
```

---

## Related

- [`theming/roadmap.md`](../theming/roadmap.md) — Phase A, B, C spec
- [`settings-provider-plan.md`](./settings-provider-plan.md) — GiselleSettingsProvider spec
- [`timeline-plan.md`](./timeline-plan.md) — TimelineTwoColumn full plan
