---
sidebar_label: "PR11 - ESLint and a11y"
---

**[Merged](https://github.com/AlexRebula/giselle-mui/pull/11)** — [`bugfix/docs-and-icons`](https://github.com/AlexRebula/giselle-mui/tree/bugfix/docs-and-icons) — 30 Apr – 30 Apr 2026


# Add ESLint rules and improve accessibility tests

This pull request introduces several improvements to code quality, accessibility, and regression test coverage. The most significant changes include new ESLint rules to enforce code standards, the addition of comprehensive regression tests for the `buildPlatformStripItems` logic, and improvements to accessibility for phase dot controls.

**Code quality and linting:**

- Added new ESLint rules in `eslint.config.mjs` to disallow nested ternary expressions and to ban the use of `React.FC` / `React.FunctionComponent`, enforcing the use of plain function declarations for React components.

**Regression test coverage:**

- Added detailed regression tests to `phase-card.test.ts` for `buildPlatformStripItems`, ensuring that platform items passed as strings (including Iconify icon IDs like `'logos:php'`) are rendered as plain text and not as icons, and that `{ icon, label }` objects render the icon without displaying the label as visible text.

**Accessibility improvements:**

- Refactored the computation of the `aria-label` for phase dot controls in `timeline-two-column.tsx` for clarity and maintainability, ensuring correct labeling depending on context.
- Improved the logic for assigning the `role` attribute to phase dot controls, explicitly setting it to `'checkbox'` or `'button'` as appropriate, enhancing accessibility semantics.

**Test reliability:**

- Updated a test mock in `quote-card.test.ts` to pass the correct type for the `component` prop, improving test reliability.
