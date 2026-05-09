---
sidebar_label: "PR10 - Update README docs"
---

**[Merged](https://github.com/AlexRebula/giselle-mui/pull/10)** — [`feature/docs-update`](https://github.com/AlexRebula/giselle-mui/tree/feature/docs-update) — 30 Apr – 30 Apr 2026


# Update README and documentation for components and platforms

This pull request updates documentation and project guidelines for the Giselle MUI component library, focusing on improved privacy, alignment with MUI Store quality standards, clearer roadmap and usage documentation, and the removal of personal data from examples and stories. It also introduces stricter formatting and coding standards to ensure code quality and maintainability.

**Documentation and Privacy Improvements:**

- Added a strict rule prohibiting any personal data (real names, project names, or portfolio-derived content) in stories, tests, examples, and documentation; generic placeholders must be used instead.
- Updated all example usages in component READMEs and stories to replace real or portfolio-derived data with generic placeholders (e.g., `'Jane Smith'`, `'of experience'`).

**Project Roadmap and Documentation Structure:**

- Revised the roadmap and planning sections in `README.md` and `.github/copilot-instructions.md` to clarify the next phases of development, including the introduction of a Giselle brand theme preset and the `GiselleThemeProvider` for zero-config usage.
- Updated documentation file paths and integration guides to reflect new structure and naming conventions (e.g., `docs/theming/roadmap.md`, `docs/components/timeline-plan.md`).

**Coding and Quality Standards:**

- Introduced a new section outlining MUI Store quality bar requirements: no use of `React.FC`, `<Box>` only when props are used, mandatory `shouldForwardProp` on all styled components, proper icon import paths, and no source maps in production builds.
- Enforced Markdown formatting in JSDoc for Storybook autodoc compatibility.
- Added requirements for responsive Storybook stories and clarified Storybook usage and deployment plans.

**Minor Updates:**

- Added the `autodocs` tag to Storybook preview configuration.
- Improved README introduction and clarified test coverage and integration instructions.

These changes ensure the library maintains high standards of privacy, code quality, and documentation clarity as it moves toward public release.
