# BasicSection: Component Roadmap

## Status

`beta`

Implemented: renders children inside a `position: relative; overflowX: clip` section,
with a `decoration` prop (`boolean | DecorationElement[]`, default `true`) that either
renders the canonical frame (two corner plus-marks, three border lines), nothing, or a
fully custom array of decorative elements (`corner-plus`, `corner-x`, `border-line`,
`triangle-left`, `triangle-down`, `dot`) — each positioned via its own `sx`. All
decoration is visible only at >=1440px viewport width. `children` is always wrapped in
`SectionContainer` (`containerMaxWidth`/`containerPy`/`containerSx` forward to it);
`unconstrainedChildren` renders as a sibling of that container for content that must not
be nested inside another `Container`. `FeatureFlowSection` composes this as its own root
section.

## Open improvements

| Task                                                                                          | Priority | Status |
| ----------------------------------------------------------------------------------------------- | -------- | ------ |
| Migrate the consuming app's `home-view.tsx` from its local `FloatPlusIcon`/`FloatLine` wrapper — now unnecessary since `FeatureFlowSection` renders `BasicSection` itself | Medium   | ✅     |
| Migrate other giselle-mui section components (`hero`, `faq`, `pricing`, `error`) to compose `BasicSection` | Low      | ⬜     |
| Port the remaining bespoke decoration patterns (the consuming app's home-page integrations section's inline dots, its FAQ section's inline triangle cluster) once those sections migrate to giselle-mui components | Low | ⬜ |

## Known gaps

- No entrance animation on any decoration kind (the original consumer-local
  implementation animated each one in via framer-motion `variants`, tied to
  `whileInView`). Kept out of this pass too — wiring `MotionViewport` context through
  six decoration kinds is a second real feature, not a rename. Add once a concrete need
  shows up, rather than porting the original's animation values speculatively.

## Completed tasks

| Task                                                                                                                    | Completed   |
| -------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Scaffold folder structure and `it.todo` stubs (Phase 1)                                                                     | 31 Aug 2026 |
| `BasicSectionProps`: `children`, `decorated` (boolean-only v1), `sx`, root passthrough                                      | 31 Aug 2026 |
| Corner plus-mark and border-line decoration (original design, not carried over from any prior implementation)              | 31 Aug 2026 |
| Full test suite (component + styles) and Storybook stories                                                                  | 31 Aug 2026 |
| Redesigned `decorated: boolean` → `decoration: boolean \| DecorationElement[]`, after auditing every real consumer of the prior decoration primitives and finding 6 genuinely different patterns sharing no fixed offsets | 31 Aug 2026 |
| Ported `corner-x`, `triangle-left`, `triangle-down`, `dot` kinds (in addition to the original `corner-plus`/`border-line`)   | 31 Aug 2026 |
| Atomic stories (one per `DecorationElement` kind) and composed stories reproducing the FAQ, pricing, and showcase real-world patterns | 31 Aug 2026 |
| `FeatureFlowSection` composes `BasicSection` as its own root, replacing its local `<Box component="section">`               | 31 Aug 2026 |
| Enforced `SectionContainer` internally (`containerMaxWidth`/`containerPy`/`containerSx` pass-through) — the component `SectionContainer` was built to solve had zero real consumers before this | 31 Aug 2026 |
| Added `unconstrainedChildren`, after discovering `FeatureFlowItemDetail`'s own internal `Container` would otherwise double-nest inside the newly-enforced `SectionContainer` | 31 Aug 2026 |
