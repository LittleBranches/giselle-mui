---
sidebar_label: "PR18 - Refactor PhaseCard"
---

**[Merged](https://github.com/AlexRebula/giselle-mui/pull/18)** — [`feature/photos-array-slot`](https://github.com/AlexRebula/giselle-mui/tree/feature/photos-array-slot) — 4 May – 4 May 2026


# Refactor PhaseCard component for streamlined photo source resolution

This pull request primarily refactors the handling of photo rendering in the `PhaseCard` component and its associated tests, simplifying the code and improving test clarity. The main changes remove now-unnecessary helper functions, inline their logic directly into the component, and update tests to match the new structure. Minor documentation and formatting tweaks are also included.

**PhaseCard photo rendering refactor:**

- Removed the `resolvePhotoSources` and `buildPhotoNodes` helper functions from `phase-card.tsx`, inlining their logic directly into the rendering of the `PhaseCard` component. This reduces indirection and simplifies the codebase.
- Updated the photo rendering logic in `PhaseCard` to use a direct inline expression for resolving and mapping photos, ensuring that photos are only rendered when the card is expanded.

**Test updates and simplification:**

- Removed imports and usages of the deleted helper functions (`resolvePhotoSources`, `buildPhotoNodes`) from `phase-card.test.ts`, and replaced them with equivalent inline logic using standard React APIs.
- Added a local `resolvePhotoSources` function within the test file to mirror the inline logic for clarity and to maintain regression coverage.
- Improved test descriptions and clarified the rendering contract around photo rendering, especially regarding expanded/collapsed card states.

**Documentation and formatting:**

- Minor formatting fix in the Markdown test coverage table for consistency.
- Minor import formatting adjustment in Next.js documentation for clarity.
