---
sidebar_label: "PR23 - GiselleIcon theme extractions"
---

**[Merged](https://github.com/AlexRebula/giselle-mui/pull/23)** — [`feature/giselle-theme-preset`](https://github.com/AlexRebula/giselle-mui/tree/feature/giselle-theme-preset) — 5 May – 5 May 2026


# Implement GiselleIcon and theme updates with component extractions

This pull request updates documentation and conventions for component structure, file naming, and the project roadmap to improve clarity, consistency, and maintainability. The changes clarify naming requirements for Storybook and test files, reorganize component directory structures, and enhance roadmap tables with labels and status indicators.

**Component and file structure improvements:**

- Updated required file naming conventions for Storybook and Vitest test files in `.github/copilot-instructions.md`, emphasizing that Storybook files must match `*.stories.tsx` and test files must end with `.test.ts` to be recognized by tooling.
- Reorganized component directories for clarity: moved `GiselleIcon`, `SelectableCard`, and `IconActionBar` to new locations under `icon/giselle/`, `card/selectable/`, and `action-bar/icon/` respectively, and updated all references.

**Roadmap and documentation enhancements:**

- Improved roadmap tables in `docs/roadmap.md` by adding a "Label" column, grouping tasks by theme (e.g., Theming, Components), and updating statuses for completed and planned work.
- Updated descriptions and goals for each roadmap phase to reflect recent progress and clarify next steps, including marking the Giselle theme preset as complete and updating planned documentation tasks.

These changes standardize file organization and naming, making it easier for the team to maintain and extend the codebase, and provide clearer tracking of project progress.
