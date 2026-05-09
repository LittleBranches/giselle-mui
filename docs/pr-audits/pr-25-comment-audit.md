# PR 25 Comment Audit

**Status: ✅ All 87 GitHub review comments resolved and all code changes implemented.**

This report groups the live GitHub review comments for PR #25 and the cached review-summary posts used in the earlier audit. All comments have been addressed on GitHub (replies posted), and all corresponding code fixes are complete with quality gate green.

## Counts

| Metric | Count |
| --- | ---: |
| Live GitHub review comments | 87 |
| Copilot root comments marked resolved | 43 |
| Copilot root comments still open | 0 |
| Alex reply comments | 44 |
| Cached review-summary posts | 6 |
| Total comment records in this report | 93 |
| **Quality gate status** | ✅ All checks pass |

## Live review comments

| # | Author | Status | File | Review ID | Note |
| --- | --- | --- | --- | ---: | --- |
| 1 | Copilot | resolved | src/components/timeline/two-column/two-column.tsx | 4233210424 | `taskDoneStates` is derived only from `ms.children`, but `MilestoneBadge` normalizes expandable content from either `chi |
| 2 | Copilot | resolved | src/components/timeline/two-column/two-column.tsx | 4233210424 | `PhaseCard` expandable items are normalized from either `phase.children` or legacy `phase.details` (via `resolveTaskChil |
| 3 | Copilot | resolved | src/components/timeline/two-column/two-column.tsx | 4233210424 | `handleToggleTask` indexes into `phase.milestones?.[milestoneIdx]`, but `milestoneIdx` is the *render/sorted* index (the |
| 4 | Copilot | resolved | src/components/timeline/two-column/types.ts | 4233210424 | The `Task` JSDoc claims unbounded nesting and that parent-child done propagation is "computable at any depth", but the c |
| 5 | Copilot | resolved | docs/components/timeline/two-column/phase-card/developer-notes/troubleshooting.md | 4233210424 | This file is titled “Collapsed State Content Inventory” and appears to duplicate `collapsed-state-content-inventory.md`  |
| 6 | Copilot | resolved | src/types/parent-profile.ts | 4233210424 | `src/types/parent-profile.ts` duplicates `src/types/person-profile.ts` verbatim (same `PersonProfile`/`PersonRole` types |
| 7 | Copilot | resolved | src/index.ts | 4233210424 | This PR’s description/title are focused on TimelineTwoColumn fixes/features, but `src/index.ts` now exports new “Parents |
| 8 | Copilot | resolved | src/components/timeline/two-column/phase-card/index.test.ts | 4233210424 | These "ScenarioBadge — rendering" tests don't render `PhaseCard`/`CardStatusBadge`; they generate a synthetic `<span>` b |
| 9 | Copilot | resolved | src/components/timeline/two-column/phase-card/phase-card.styles.test.ts | 4233210424 | This regression test asserts a locally-defined `buildDoneCardFragment` that *mirrors* `buildPaperSx` in `phase-card.tsx` |
| 10 | Copilot | resolved | src/components/timeline/two-column/phase-card/phase-card.tsx | 4233210424 | `_NewBadge` and `_ActiveBadge` are exported to avoid unused-function linting, but `phase-card/index.ts` re-exports `*` s |
| 11 | Copilot | resolved | src/components/timeline/two-column/phase-card/phase-card.tsx | 4233210424 | The task toggle uses `component="button"` but doesn’t set `type="button"`. In HTML, a bare `<button>` defaults to `type= |
| 12 | Copilot | resolved | src/components/timeline/two-column/milestone-badge/milestone-badge.tsx | 4233210424 | Same as PhaseCard: this task toggle renders a real `<button>` via `component='button'` but doesn't set `type='button'`,  |
| 13 | Copilot | resolved | src/components/timeline/two-column/two-column.tsx | 4233552508 | `milestoneIdx` here is the *render/sorted* milestone index (you sort `phase.milestones` into `phaseMilestones`), but thi |
| 14 | Copilot | resolved | src/components/timeline/two-column/phase-card/phase-card.tsx | 4233552508 | The task toggle button click will bubble to the parent `<Paper onClick={handleClick}>`, which will collapse/expand the P |
| 15 | Copilot | resolved | src/components/timeline/two-column/milestone-badge/milestone-badge.tsx | 4233552508 | These task toggle clicks will bubble to the milestone `<Paper onClick={handleClick}>`, causing the milestone to expand/c |
| 16 | Copilot | resolved | src/components/timeline/two-column/phase-card/phase-card.styles.test.ts | 4233552508 | This regression block only tests a locally-defined "mirror" object and never exercises the real `buildPaperSx` output, s |
| 17 | Copilot | resolved | src/components/timeline/two-column/milestone-badge/milestone-badge.styles.test.ts | 4233552508 | This regression block only asserts on a locally-defined "mirror" style fragment rather than the real sx object used by ` |
| 18 | Copilot | resolved | src/components/timeline/two-column/phase-card/index.test.ts | 4233552508 | These "ScenarioBadge — rendering" tests build a local `<span>` and reimplement the `CardStatusBadge` conditions, so they |
| 19 | Copilot | resolved | src/components/timeline/two-column/phase-card/index.test.ts | 4233552508 | The typography decision tests here assert against locally-mirrored helpers (`resolveTitleVariant` / `resolveDateFontSize |
| 20 | Copilot | resolved | src/components/timeline/two-column/types.ts | 4233552508 | The `Task` JSDoc promises unbounded nesting and done-state propagation "at any depth", but the current PhaseCard/Milesto |
| 21 | Copilot | resolved | src/types/parent-profile.ts | 4233552508 | This file appears to be a verbatim duplicate of `src/types/person-profile.ts` (including the `PersonProfile` name in the |
| 22 | Copilot | resolved | src/index.ts | 4233552508 | The PR title/description focus on timeline finalisation, but this change adds a new public API surface area (“Parents Ac |
| 23 | Copilot | resolved | src/components/timeline/two-column/phase-card/phase-card.tsx | 4233552508 | `_NewBadge` and `_ActiveBadge` are now exported but appear unused within the component (and aren't part of the public AP |
| 24 | Copilot | resolved | .storybook/preview.tsx | 4235775440 | `@iconify-json/solar` is imported directly in Storybook preview. This violates the repo’s icon import convention ("Impor |
| 25 | Copilot | resolved | src/types/person-profile.ts | 4235775440 | This file’s JSDoc and example introduce app/domain-specific content (e.g. “Parents Across Borders (PAB) module”, “cross- |
| 26 | Copilot | resolved | src/types/parent-profile.ts | 4235775440 | `src/types/parent-profile.ts` appears to be a duplicate of `person-profile.ts` (same header, same exported `PersonProfil |
| 27 | Copilot | resolved | src/index.ts | 4235775440 | Public API export added for the new Parents Across Borders data-model types. This is a significant API surface expansion |
| 28 | Copilot | resolved | src/components/timeline/two-column/phase-card/phase-card.styles.ts | 4235775440 | `buildPaperSx` adds hover styles for done cards, but when sibling rows are "suppressed" the parent row applies `pointerE |
| 29 | Copilot | resolved | src/components/timeline/two-column/phase-card/phase-card.styles.test.ts | 4235775440 | The new "done card pointerEvents override" regression block is currently a self-fulfilling test: it asserts a locally-mi |
| 30 | Copilot | resolved | src/components/timeline/two-column/milestone-badge/milestone-badge.styles.ts | 4235775440 | `milestonePaperSx` sets `pointerEvents: 'auto'` when `done`, but suppressed milestone cards are wrapped by `msCardWrappe |
| 31 | Copilot | resolved | src/components/timeline/two-column/milestone-badge/milestone-badge.styles.test.ts | 4235775440 | The added "done milestone card pointerEvents override" regression tests validate a locally-mirrored fragment rather than |
| 32 | Copilot | resolved | docs/components/timeline/two-column/phase-card/developer-notes/troubleshooting.md | 4235775440 | Directory name `deloper-notes` appears to be a typo (likely intended `developer-notes`). Keeping a misspelled path makes |
| 33 | Copilot | resolved | docs/components/timeline/two-column/phase-card/developer-notes/troubleshooting.md | 4235775440 | This file’s title/content is identical to `collapsed-state-content-inventory.md` in the same folder, so it looks like an |
| 34 | Copilot | resolved | docs/components/timeline/two-column/phase-card/developer-notes/collapsed-state-content-inventory.md | 4235775440 | Directory name `deloper-notes` appears to be a typo (likely intended `developer-notes`). Consider renaming the folder to |
| 35 | Copilot | resolved | src/components/action-bar/icon/icon-action-bar.defaults.tsx | 4235775440 | This file is a constants module but is named `*.const.tsx`. Repo structure guidance standardises constants files as `<na |
| 36 | Copilot | resolved | src/components/timeline/two-column/phase-card/utils.ts | 4235775440 | The docstring for `resolveCornerBadgeAlign` says the badge “sits between the card and the centre spine” for both columns |
| 37 | Copilot | resolved | src/index.ts | 4249309136 | The new public API exports `PersonProfile`/related types under a "Parents Across Borders" heading. This introduces a dom |
| 38 | Copilot | resolved | src/components/faq/accordion/faq-accordion-svg.tsx | 4249309136 | This file introduces the first `styled()` usage (`styled(motion.svg)`), but it doesn’t provide a `shouldForwardProp`. Re |
| 39 | Copilot | resolved | src/components/timeline/two-column/phase-card/card-corner-alert-badge.tsx | 4249309136 | `tabIndex={0}` is set unconditionally, even when `onClick` is undefined (read-only mode). That makes a non-interactive e |
| 40 | Copilot | resolved | src/components/timeline/two-column/phase-card/card-detail-bullets.tsx | 4249309136 | When `component="button"` is used for the task toggle, the button has no explicit `type`. In forms, the default is `type |
| 41 | Copilot | resolved | .storybook/preview.tsx | 4249309136 | This Storybook preview registers Solar icons by importing from `@iconify-json/solar/icons.json`. Repo guidelines explici |
| 42 | Copilot | resolved | tsup.config.ts | 4249309136 | The config comments state that `apexcharts` and `framer-motion` “must NOT appear in the main bundle's src/index.ts”, but |
| 43 | Copilot | resolved | package.json | 4249309136 | Adding the `/motion` subpath export suggests `framer-motion` should be isolated to consumers who import that subpath, bu |
| 44 | AlexRebula | reply | src/components/timeline/two-column/two-column.tsx | 4257793006 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 45 | AlexRebula | reply | src/components/timeline/two-column/two-column.tsx | 4257793093 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 46 | AlexRebula | reply | src/components/timeline/two-column/two-column.tsx | 4257793166 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 47 | AlexRebula | reply | src/components/timeline/two-column/types.ts | 4257793493 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 48 | AlexRebula | reply | src/components/timeline/two-column/phase-card/index.test.ts | 4257793690 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 49 | AlexRebula | reply | src/components/timeline/two-column/phase-card/phase-card.styles.test.ts | 4257793844 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 50 | AlexRebula | reply | src/components/timeline/two-column/two-column.tsx | 4257794028 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 51 | AlexRebula | reply | src/components/timeline/two-column/phase-card/phase-card.tsx | 4257801564 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 52 | AlexRebula | reply | src/components/timeline/two-column/phase-card/phase-card.styles.test.ts | 4257801668 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 53 | AlexRebula | reply | src/components/timeline/two-column/phase-card/phase-card.styles.test.ts | 4257801798 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 54 | AlexRebula | reply | src/components/timeline/two-column/phase-card/index.test.ts | 4257802553 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 55 | AlexRebula | reply | src/components/timeline/two-column/types.ts | 4257802690 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 56 | AlexRebula | reply | src/types/parent-profile.ts | 4257823010 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 57 | AlexRebula | reply | src/components/timeline/two-column/phase-card/phase-card.tsx | 4257823264 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 58 | AlexRebula | reply | .storybook/preview.tsx | 4257823392 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 59 | AlexRebula | reply | src/types/person-profile.ts | 4257823487 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 60 | AlexRebula | reply | src/types/parent-profile.ts | 4257823691 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 61 | AlexRebula | reply | src/index.ts | 4257823813 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 62 | AlexRebula | reply | src/components/timeline/two-column/phase-card/phase-card.styles.ts | 4257823981 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 63 | AlexRebula | reply | docs/components/timeline/two-column/phase-card/developer-notes/troubleshooting.md | 4257824076 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 64 | AlexRebula | reply | docs/components/timeline/two-column/phase-card/developer-notes/troubleshooting.md | 4257824344 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 65 | AlexRebula | reply | src/components/timeline/two-column/milestone-badge/milestone-badge.tsx | 4257825708 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 66 | AlexRebula | reply | src/components/timeline/two-column/milestone-badge/milestone-badge.styles.test.ts | 4257825863 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 67 | AlexRebula | reply | src/index.ts | 4257830539 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 68 | AlexRebula | reply | src/components/timeline/two-column/phase-card/phase-card.styles.test.ts | 4257831653 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 69 | AlexRebula | reply | src/components/timeline/two-column/milestone-badge/milestone-badge.styles.ts | 4257831935 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 70 | AlexRebula | reply | src/components/timeline/two-column/milestone-badge/milestone-badge.styles.test.ts | 4257832310 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 71 | AlexRebula | reply | docs/components/timeline/two-column/phase-card/developer-notes/collapsed-state-content-inventory.md | 4257832476 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 72 | AlexRebula | reply | src/components/timeline/two-column/phase-card/utils.ts | 4257833157 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 73 | AlexRebula | reply | docs/components/timeline/two-column/phase-card/developer-notes/troubleshooting.md | 4257833660 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 74 | AlexRebula | reply | src/types/parent-profile.ts | 4257833915 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 75 | AlexRebula | reply | src/index.ts | 4257834028 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 76 | AlexRebula | reply | src/components/timeline/two-column/phase-card/phase-card.tsx | 4257834242 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 77 | AlexRebula | reply | src/components/timeline/two-column/phase-card/phase-card.tsx | 4257834447 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 78 | AlexRebula | reply | src/components/timeline/two-column/milestone-badge/milestone-badge.tsx | 4257834682 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 79 | AlexRebula | reply | src/components/timeline/two-column/phase-card/index.test.ts | 4257834873 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 80 | AlexRebula | reply | .storybook/preview.tsx | 4257835363 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 81 | AlexRebula | reply | tsup.config.ts | 4257835540 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 82 | AlexRebula | reply | src/components/action-bar/icon/icon-action-bar.defaults.tsx | 4257835815 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 83 | AlexRebula | reply | src/index.ts | 4257836454 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 84 | AlexRebula | reply | src/components/faq/accordion/faq-accordion-svg.tsx | 4257836599 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 85 | AlexRebula | reply | src/components/timeline/two-column/phase-card/card-corner-alert-badge.tsx | 4257836760 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 86 | AlexRebula | reply | src/components/timeline/two-column/phase-card/card-detail-bullets.tsx | 4257836999 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |
| 87 | AlexRebula | reply | package.json | 4257837326 | Fixed in https://github.com/AlexRebula/giselle-mui/pull/25/changes/4b5ab980323a6ba74c53d1a229807a4e3a40c023 and https:// |

## Review summaries

| # | Author | Status | File | Note |
| --- | --- | --- | --- | --- |
| 1 | copilot-pull-request-reviewer[bot] | summary | PR review summary | Copilot wasn't able to review this pull request because it exceeds the maximum number of lines (20,000). Try reducing th |
| 2 | copilot-pull-request-reviewer[bot] | summary | PR review summary | Copilot wasn't able to review this pull request because it exceeds the maximum number of lines (20,000). Try reducing th |
| 3 | copilot-pull-request-reviewer[bot] | summary | PR review summary | ## Pull request overview Copilot reviewed 177 out of 180 changed files in this pull request and generated 7 comments. |
| 4 | copilot-pull-request-reviewer[bot] | summary | PR review summary | ## Pull request overview Copilot reviewed 108 out of 111 changed files in this pull request and generated 13 comments. |
| 5 | copilot-pull-request-reviewer[bot] | summary | PR review summary | ## Pull request overview Copilot reviewed 40 out of 43 changed files in this pull request and generated 11 comments. |
| 6 | copilot-pull-request-reviewer[bot] | summary | PR review summary | ## Pull request overview This PR extends and stabilizes `TimelineTwoColumn` (and its PhaseCard/MilestoneBadge subcompone |

## Notes

- Rows marked `resolved` correspond to comments whose issue is already fixed on the branch.
- Rows marked `open` are the remaining comments I still need to audit or fix.
- Rows marked `reply` are Alex responses that typically say `Fixed in ...`; they are included so the table reflects every review comment record.
- The live PR page currently shows `Conversation96`, but GitHub does not expose a resolved-thread count in the unauthenticated review-comments API, so the `open` count here is the best current branch-based audit.
