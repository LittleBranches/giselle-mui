# Hero (shared slot types)

## Why it exists

Every hero-level component in giselle-mui — `HeroSection`, `ScrollParallaxHero`, and any future hero variant — exposes the same content slots: `heading`, `text`, `actions`, and `icons`. Without a shared type definition each hero component independently redeclares these slot names, causing drift when a consumer switches between hero variants and discovers that slot names differ.

## Why it belongs in giselle-mui

The `HeroSlotProps` type is a cross-project API contract for hero-level layout primitives. Any library that ships multiple hero variants benefits from the shared vocabulary so consumers can swap variants without renaming props.

## Design decisions

TBD — filled in during implementation.

## Related

- [section/hero/section](../section/hero/section/README.md) — `HeroSection` component that extends these slots
- [section/hero/scroll-parallax](../section/hero/scroll-parallax/README.md) — `ScrollParallaxHero` component that extends these slots

## Build spec

This module exports only type definitions — there is no runtime component to render.

### Exported types

```ts
type HeroSlotProps = {
  /** Primary headline slot. Render a Typography h1 or SectionTitle here. */
  heading?: ReactNode;
  /** Supporting text slot. Render a Typography body1 here. Omit for heading-only hero. */
  text?: ReactNode;
  /** CTA buttons slot. Render Button elements or a HeroButtonsRow here. */
  actions?: ReactNode;
  /** Icon strip slot. Render a TechIconStrip with centeredWrap or any icon row here. */
  icons?: ReactNode;
};
```

### Acceptance criteria

- `HeroSlotProps` is exported from the hero barrel `index.ts`.
- Both `HeroSection` and `ScrollParallaxHero` extend `HeroSlotProps` without redeclaring slot names.
- Passes TypeScript strict-mode checks.

## Phase

Phase: `H-G1` | Priority tier: `T1`

---

_Compliance standard: [documentation-strategy.md](../../docs/documentation-strategy.md)_
