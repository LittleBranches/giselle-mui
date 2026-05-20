---
sidebar_position: 10
sidebar_label: 'MUI 9 migration checklist'
---

# MUI 9 migration — tracked execution checklist

This is the task-level execution board for the [MUI 9 migration plan](./mui-9-migration-and-support-plan.md).
Each task is a discrete action that can be picked up, worked, and closed independently.

**Status key:** ⬜ not started · 🔄 in progress · ✅ done · ⚠️ blocked

---

## Immediate prerequisite — first-branch version mismatch

Fix this independently of all MUI 9 work. It is a bug that exists right now.

| #   | Task                                                       | Repo           | Status | Notes                                          |
| --- | ---------------------------------------------------------- | -------------- | ------ | ---------------------------------------------- |
| P-1 | Downgrade `@mui/material-nextjs` from `^9.0.0` to `^7.0.0` | `first-branch` | ⬜     | One-line `package.json` change + `npm install` |
| P-2 | Run `npm run check:verify`                                 | `first-branch` | ⬜     | Gate must be green before continuing           |
| P-3 | Smoke-test the app: login, admin page, viewer page         | `first-branch` | ⬜     | Verify SSR/hydration, no console errors        |
| P-4 | Open PR and merge                                          | `first-branch` | ⬜     | Branch: `fix/align-mui-adapter-version`        |

---

## Phase 0 — Planning

| #    | Task                                                                                                            | Repo          | Status | Notes                                             |
| ---- | --------------------------------------------------------------------------------------------------------------- | ------------- | ------ | ------------------------------------------------- |
| PL-1 | Pin exact target versions for every `@mui/*` package per repo                                                   | all           | ⬜     | Record in decision log of the plan doc            |
| PL-2 | Confirm MUI X v9 compatibility for `alexrebula` (`@mui/x-data-grid`, `@mui/x-date-pickers`, `@mui/x-tree-view`) | `alexrebula`  | ⬜     | MUI X must align with chosen core major           |
| PL-3 | Confirm Storybook builder handles MUI 9 without extra config                                                    | `giselle-mui` | ✅     | Storybook build green on PR #62 — no extra config needed |
| PL-4 | Confirm `@iconify/react` and `framer-motion` peer compat with MUI 9                                             | `giselle-mui` | ✅     | No issues found during PR #62 migration           |

---

## Phase 1 — `giselle-mui` (upgrade first)

**Completed in PR #62 (`feature/mui-9-migration`) — 19 May 2026.**

### 1a. Peer dependency and build

| #   | Task                                                            | Repo          | Status | Notes                                                        |
| --- | --------------------------------------------------------------- | ------------- | ------ | ------------------------------------------------------------ |
| 1-1 | Create branch `feature/mui-9-migration`                         | `giselle-mui` | ✅     | Branch created, PR #62 open                                  |
| 1-2 | Expand `peerDependencies` ranges to accept both MUI 7 and MUI 9 | `giselle-mui` | ✅     | `@mui/material`: `">=7.0.0 <10.0.0"` · `@mui/lab`: `"^7.0.0 \|\| ^9.0.0-beta.3"` |
| 1-3 | Upgrade dev dependencies: `@mui/material`, `@mui/lab` to v9     | `giselle-mui` | ✅     | `@mui/material@^9.0.0`, `@mui/lab@^9.0.0-beta.3`            |
| 1-4 | Apply MUI official codemods                                     | `giselle-mui` | ✅     | `@mui/codemod v6.0.0/sx-prop` — 44 files modified (removed empty `{}` from sx arrays) |
| 1-5 | Resolve TypeScript compile errors after codemod                 | `giselle-mui` | ✅     | 10 files fixed: Typography shorthand props, Stack alignItems, Grid direction, NavPill component prop, TransitionComponent removal, theme.vars story reference |
| 1-6 | Resolve ESLint errors                                           | `giselle-mui` | ✅     | 0 warnings/errors on `npm run lint`                          |
| 1-7 | Verify `tsup.config.ts` externals still list all peer deps      | `giselle-mui` | ✅     | All 5 entries verified: index, utils, charts, motion, lab    |
| 1-8 | Run `npm run build`                                             | `giselle-mui` | ✅     | All 5 subpath entries generated: `index`, `utils`, `charts`, `motion`, `lab` |

### 1b. Tests and Storybook

| #    | Task                                                                                | Repo          | Status | Notes                                           |
| ---- | ----------------------------------------------------------------------------------- | ------------- | ------ | ----------------------------------------------- |
| 1-9  | Run Vitest — all tests green                                                        | `giselle-mui` | ✅     | 1218 passed, 59 skipped                         |
| 1-10 | Audit tests that use `cssVariables: true` theme — verify they still pass with MUI 9 | `giselle-mui` | ✅     | All theme-related tests pass unchanged          |
| 1-11 | Build Storybook                                                                     | `giselle-mui` | ✅     | `npm run build-storybook` — zero broken stories |
| 1-12 | Visual QA: cards, timeline, icon, action bar in Storybook                           | `giselle-mui` | ⬜     | Manual — run after PR #62 merges to main        |

### 1c. Dual-major CI matrix

| #    | Task                                                                | Repo          | Status | Notes                     |
| ---- | ------------------------------------------------------------------- | ------------- | ------ | ------------------------- |
| 1-13 | Add CI matrix job that installs MUI 7 peers and runs `check:verify` | `giselle-mui` | ⬜     | PR #64 — Job A: MUI 7 compat check |
| 1-14 | Add CI matrix job that installs MUI 9 peers and runs `check:verify` | `giselle-mui` | ⬜     | PR #64 — Job B: MUI 9 compat check |
| 1-15 | Both CI matrix jobs green                                           | `giselle-mui` | ⬜     | Gate before merge — PR #64        |

### 1d. Gate and publish

| #    | Task                            | Repo          | Status | Notes                                       |
| ---- | ------------------------------- | ------------- | ------ | ------------------------------------------- |
| 1-16 | Run full `npm run check:verify` | `giselle-mui` | ✅     | All 6 checks passed on PR #62 push hook     |
| 1-17 | Open PR and merge to `main`     | `giselle-mui` | 🔄     | PR #62 open — pending PR #61 merge first    |
| 1-18 | `npm run build && yalc push`    | `giselle-mui` | ⬜     | After PR #62 merges to main                 |

---

## Phase 2a — `alexrebula` (largest surface area)

| #     | Task                                                                                         | Repo         | Status | Notes                                                     |
| ----- | -------------------------------------------------------------------------------------------- | ------------ | ------ | --------------------------------------------------------- |
| 2a-1  | Create branch `feature/mui-9-migration`                                                      | `alexrebula` | ⬜     |                                                           |
| 2a-2  | Pick up latest `giselle-mui` via `yalc pull`                                                 | `alexrebula` | ⬜     | Requires Phase 1 complete                                 |
| 2a-3  | Upgrade `@mui/material` and all `@mui/*` packages to v9 as a set                             | `alexrebula` | ⬜     | `@mui/material`, `@emotion/react`, `@emotion/styled`      |
| 2a-4  | Upgrade MUI X packages to v9 (`@mui/x-data-grid`, `@mui/x-date-pickers`, `@mui/x-tree-view`) | `alexrebula` | ⬜     | Must align with core major                                |
| 2a-5  | Apply MUI official codemods                                                                  | `alexrebula` | ⬜     |                                                           |
| 2a-6  | Resolve TypeScript errors                                                                    | `alexrebula` | ⬜     | `npm run typecheck`                                       |
| 2a-7  | Resolve ESLint errors                                                                        | `alexrebula` | ⬜     | `npm run lint`                                            |
| 2a-8  | Run `npm run check:verify`                                                                   | `alexrebula` | ⬜     |                                                           |
| 2a-9  | Visual QA: home, career timeline, icon rendering, chart cards                                | `alexrebula` | ⬜     | Run `npm run dev`, check each section                     |
| 2a-10 | Check MUI X pages: data grid, date picker usage                                              | `alexrebula` | ⬜     | MUI X v9 has its own breaking changes                     |
| 2a-11 | Verify icon offline registration test still passes                                           | `alexrebula` | ⬜     | `npx vitest run src/components/iconify/icon-sets.test.ts` |
| 2a-12 | `rm -rf .next && npm run build` (production build)                                           | `alexrebula` | ⬜     | Zero errors, zero type warnings                           |
| 2a-13 | Open PR and merge                                                                            | `alexrebula` | ⬜     | Branch: `feature/mui-9-migration`                         |

---

## Phase 2b — `first-branch`

Requires Phase 1 complete. Prerequisite P-1 through P-4 must already be done.

| #    | Task                                                       | Repo           | Status | Notes                                       |
| ---- | ---------------------------------------------------------- | -------------- | ------ | ------------------------------------------- |
| 2b-1 | Create branch `feature/mui-9-migration`                    | `first-branch` | ⬜     |                                             |
| 2b-2 | Pick up latest `giselle-mui` via `yalc pull`               | `first-branch` | ⬜     |                                             |
| 2b-3 | Upgrade `@mui/material` to v9                              | `first-branch` | ⬜     |                                             |
| 2b-4 | Upgrade `@mui/material-nextjs` to v9                       | `first-branch` | ⬜     | Intentional this time — after core v9 is in |
| 2b-5 | Apply MUI official codemods                                | `first-branch` | ⬜     |                                             |
| 2b-6 | Resolve TypeScript and ESLint errors                       | `first-branch` | ⬜     |                                             |
| 2b-7 | Run `npm run check:verify`                                 | `first-branch` | ⬜     |                                             |
| 2b-8 | Smoke-test: login, admin, viewer, task creation, mark done | `first-branch` | ⬜     |                                             |
| 2b-9 | Open PR and merge                                          | `first-branch` | ⬜     | Branch: `feature/mui-9-migration`           |

---

## Phase 2c — `giselle-docs`

| #    | Task                                                        | Repo           | Status | Notes                              |
| ---- | ----------------------------------------------------------- | -------------- | ------ | ---------------------------------- |
| 2c-1 | Create branch `feature/mui-9-migration`                     | `giselle-docs` | ⬜     |                                    |
| 2c-2 | Upgrade `@mui/material` to v9                               | `giselle-docs` | ⬜     | Only used for component demo pages |
| 2c-3 | Resolve any MDX/Docusaurus render issues from MUI 9 changes | `giselle-docs` | ⬜     |                                    |
| 2c-4 | Run `npm run build`                                         | `giselle-docs` | ⬜     | Docusaurus production build green  |
| 2c-5 | Open PR and merge                                           | `giselle-docs` | ⬜     | Branch: `feature/mui-9-migration`  |

---

## Phase 3 — Stabilization

| #   | Task                                                         | Repo          | Status | Notes                                 |
| --- | ------------------------------------------------------------ | ------------- | ------ | ------------------------------------- |
| 3-1 | Cross-repo regression sweep: run all quality gates together  | all           | ⬜     | Record any regressions here           |
| 3-2 | Fix any regressions found during sweep                       | all           | ⬜     | Add items to this table as discovered |
| 3-3 | Announce v7 deprecation date for `giselle-mui`               | `giselle-mui` | ⬜     | Log in decision log of plan doc       |
| 3-4 | Remove CI dual-major matrix once all consumers are on v9     | `giselle-mui` | ⬜     | T0 + 4 weeks target                   |
| 3-5 | Cut release notes / CHANGELOG entries for each migrated repo | all           | ⬜     |                                       |

---

## Decision log

| Date         | Decision                                                                                     | Rationale                                                                                                     |
| ------------ | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 19 May 2026  | `@mui/material` peer range: `">=7.0.0 <10.0.0"` (dual-major window)                        | Allows existing v7 consumers to keep working while new consumers can adopt v9. Window closes T0 + 10-12 weeks. |
| 19 May 2026  | `@mui/lab` peer range: `"^7.0.0 \|\| ^9.0.0-beta.3"`                                        | Lab has no stable v9 release yet. Beta accepted for dev builds; consumers on v7 continue to work.             |
| 19 May 2026  | Dev dependencies upgraded to MUI v9 (`@mui/material@^9.0.0`, `@mui/lab@^9.0.0-beta.3`)      | Library developed and tested against v9 while publishing types compatible with both majors.                   |
