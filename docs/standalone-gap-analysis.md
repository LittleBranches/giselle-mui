---
sidebar_position: 6
sidebar_label: 'Standalone Project Gap Analysis'
---

# Standalone Project Gap Analysis

> _Last updated: May 2026_

This document answers a specific question: **what does `giselle-mui` need to export so
that a brand-new Next.js project can use it as a complete design system foundation —
with zero proprietary theme dependency?**

The analysis is driven by a real audit of `alexrebula`. Every component and utility that
alexrebula's own sections depend on has been categorised here by its current status.

---

## Already shipped — usable today

These components are exported from `giselle-mui` and work in any MUI v7 project with zero
additional setup.

| Export                                | What it does                                       | Used in alexrebula                 |
| ------------------------------------- | -------------------------------------------------- | ---------------------------------- |
| `GiselleIcon`                         | Offline-safe Iconify icon wrapper                  | 5+ files                           |
| `TimelineTwoColumn`                   | Alternating two-column expandable timeline         | career-timeline, roadmap, scheduling |
| `MetricCard` + `MetricCardDecoration` | Metric card with stat, label, and decoration slot  | expertise-areas                    |
| `QuoteCard`                           | Pull-quote card with author, source, and icon slot | testimonials                       |
| `SelectableCard`                      | Keyboard-accessible selectable/toggle card         | billing/plan pages                 |
| `IconActionBar`                       | Row of icon buttons with tooltips                  | (ready, not yet wired)             |
| `createIconRegistrar`                 | Utility: registers Iconify icon sets offline       | icon-sets files                    |

---

## The structural blocker: `GiselleThemeProvider`

Without this, a blank Next.js project still has to wire up a MUI `ThemeProvider`
manually to get CSS variables mode working. `GiselleThemeProvider` is the one export
that makes this achievable — it replaces any manually wired MUI `ThemeProvider` chain.

See [`roadmap.md`](../roadmap.md) Phases A → B → C for the full spec.

**Dependency chain (must go in order):**

```
Phase A: channelAlpha, hexToChannel, pxToRem  ←  ✅ Done (4 May 2026)
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
are currently only available with a proprietary theme (or reimplementing them from scratch).

### Ready to extract (minimal changes needed)

| Component              | Source in alexrebula                      | What's needed before extraction           |
| ---------------------- | ----------------------------------------- | ----------------------------------------- |
| `TwoColumnShowcaseRow` | `src/components/two-column-showcase-row/` | Nothing — no changes needed, ready now    |
| `OptionWithBlurb`      | `src/components/option-with-blurb/`       | Nothing — tiny, no changes needed         |
| `SectionPendingLoader` | `src/components/section-pending-loader/`  | Switch internal `Iconify` → `GiselleIcon` |

### Need cleanup before extraction

| Component                               | Source                             | What needs to change                                           |
| --------------------------------------- | ---------------------------------- | -------------------------------------------------------------- |
| `FloatingSubNav` / `FloatingControlBar` | `src/components/floating-sub-nav/` | Replace `Iconify` → `GiselleIcon` |

### Need to be written from scratch

These patterns appear repeatedly in alexrebula's own sections but are not currently
extracted into reusable components. They cannot be copied from alexrebula because that repo uses a proprietary theme — any
code that uses proprietary utilities must be rewritten independently.

| Component                 | Pattern it encodes                                                                                            | Priority                                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `SectionContainer`        | `Container` + consistent vertical padding + optional title/subtitle header. Used on every section.            | High — needed by almost every page                                                                                                           |
| `HeroSection`             | Full-width hero with headline, subtitle, and CTA buttons. Appears in home, about, services, contact.          | High — every portfolio page has one                                                                                                          |
| `FAQAccordion`            | MUI `Accordion` with consistent styling and optional icon. Used in home and services.                         | Medium                                                                                                                                       |
| `GiselleSettingsProvider` | Framework-agnostic settings context — localStorage + cookie adapters, generic state, drawer. | High — blocks any project wanting a full drop-in settings system. Full plan: [`settings-provider-plan.md`](./settings-provider-plan.md) |

---

## What a blank Next.js project actually needs

The minimum `layout.tsx` for a project built entirely on giselle-mui:

```tsx
// app/layout.tsx
import { GiselleThemeProvider } from '@littlebranches/giselle-mui'; // Phase C
import { IconRegistrar } from '@littlebranches/giselle-mui';
import { createIconRegistrar } from '@littlebranches/giselle-mui';

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
(`I18nProvider`, `AuthProvider`, `SettingsProvider`, `ThemeProvider`) are
proprietary-theme-dependent and would be replaced by `GiselleThemeProvider` + `GiselleSettingsProvider`.

---

## Complete export checklist for standalone projects

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
✅ channelAlpha                     (Phase A — 4 May 2026)
✅ hexToChannel                     (Phase A — 4 May 2026)
✅ pxToRem / remToPx             (Phase A — 4 May 2026)
⬜ giselleTheme                  (Phase B)
⬜ GiselleThemeProvider          (Phase C)  ← structural blocker

# UI primitives — Phase D
⬜ TwoColumnShowcaseRow          (ready to extract)
⬜ OptionWithBlurb               (ready to extract)
⬜ SectionPendingLoader          (needs Iconify → GiselleIcon)
⬜ FloatingControlBar            (needs Iconify → GiselleIcon)
⬜ SectionContainer              (write from scratch)
⬜ HeroSection                   (write from scratch)
⬜ FAQAccordion                  (write from scratch)
⬜ GiselleSettingsProvider       (write from scratch — Phase D prerequisite)
```

---

## Related

- [`roadmap.md`](../roadmap.md) — Phase A, B, C spec
- [`settings-provider-plan.md`](./settings-provider-plan.md) — GiselleSettingsProvider spec
- [`timeline-plan.md`](./timeline-plan.md) — TimelineTwoColumn full plan
