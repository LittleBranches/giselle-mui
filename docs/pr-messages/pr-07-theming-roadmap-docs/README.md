---
sidebar_label: "PR07 - Theming roadmap docs"
---

**[Merged](https://github.com/AlexRebula/giselle-mui/pull/7)** — [`feature/timeline-and-roadmap`](https://github.com/AlexRebula/giselle-mui/tree/feature/timeline-and-roadmap) — 25 Apr – 25 Apr 2026


# docs: add theming roadmap and timeline component planning notes

This pull request adds comprehensive documentation and contributor guidance for the theming roadmap and the upcoming `RoadmapTimeline` component in the `giselle-mui` library. It introduces new planning docs, clarifies tone and attribution rules for documentation, and outlines next steps for both component and theme utility development.

**Contributor guidance and process:**

- Added a "Tone rule for docs and comments" section to `.github/copilot-instructions.md`, instructing contributors not to over-mention Minimals and to focus documentation on the identity and purpose of `giselle-mui` itself.
- Documented the files Copilot and contributors should consult at the start of each session, including current and planned components, and established an explicit priority order for upcoming work.

**Theming roadmap and utilities:**

- Added `docs/theming-roadmap.md` detailing the current state, planned theme utility exports (such as `varAlpha`, `createPaletteChannel`, `pxToRem`, `remToPx`), and a phased plan for shipping these utilities and a base theme preset.
- Outlined the design and implementation plan for a `GiselleThemeProvider` component, emphasizing that all theme tokens come from the consumer, not from the library.

**RoadmapTimeline component planning:**

- Added `docs/timeline-component-plan.md` with a detailed plan for the `RoadmapTimeline` component, including rationale, required peer dependencies, API/type design, integration patterns, file structure, and Storybook story outline.
- Specified that the component will depend on the upcoming `varAlpha` utility and will use only standard MUI v7 and peer dependencies.

These changes provide a clear roadmap and strong contributor guidance for the next phases of `giselle-mui` development, with a focus on maintainability, clarity, and separation of concerns.
