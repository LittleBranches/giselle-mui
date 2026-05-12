# PR Messages Index

I'm [Alex Rebula](https://github.com/AlexRebula), the author of this library.
This index records every pull request from inception to the current open branch, with branch-to-roadmap mapping, milestone linkage, and per-PR companion notes.

> **Why does this live here, not on GitHub?**
>
> During the discovery phase of an open-source project, GitHub PR descriptions disappear into history quickly and are hard to cross-reference by roadmap phase or execution context.
> Keeping this index in the docs tree makes it surfaceable via [Docusaurus](https://giselle-docs.vercel.app/giselle-mui/pr-messages), linkable from roadmap entries, and searchable alongside component docs.
> This is not intended as a permanent duplication of GitHub — once the library matures into stable release cadence, individual PR docs will shrink to brief GitHub-only entries and this index will narrow to roadmap-level summaries only.

The documentation here is intentionally discovery-stage oriented.
It captures cross-repo execution context, dependency-driven sequencing, and review checkpoints while the libraries are still maturing.

Target mature-state workflow:

- smaller, single-purpose PRs
- one branch per PR by default
- minimal companion documentation for routine changes
- detailed companion records only for high-risk, cross-cutting, or migration-heavy work

Last updated: 9 May 2026

## How To Read This Index

- Each branch name appears once as a group heading.
- PR numbers under a branch are the closed PRs that came from that source branch.
- A branch group can contain more than one PR when the work stayed on the same source branch across multiple pull requests.
- A PR group can contain more than one file when the work needed separate records for the original PR, follow-up fixes, review notes, or post-merge context.

## Discovery-Branch Workflow (Roadmap Stage)

In active discovery phases, one branch may produce multiple PRs before the workstream is stable.
This index keeps that history explicit instead of flattening it.

### Execution Context (Why This Index Is Detailed)

I ran this workflow solo, coordinating parallel changes across these active repositories:

1. `giselle-mui`
2. `alexrebula`
3. `first-branch`
4. `giselle-docs`
5. `giselle-sections-sdk`
6. `giselle-ui`

In this context, work was often split by dependency readiness and reviewable slices rather than strict linear phase order.
The goal of this file is to keep that execution history auditable.

### Flow-First Staged Policy

Strict branch hygiene can break flow too early for solo, AI-assisted discovery work.
Use flow first, then structure at deliberate checkpoints:

1. **Discovery branch is allowed**
   Use one active discovery branch while exploring and iterating quickly.
2. **Cut branches only at milestone moments**
   When a slice is reviewable, create a new branch at that commit and open a draft PR.
   No need to interrupt deep work earlier.
3. **Keep working on discovery after the cut**
   The PR branch is a frozen review snapshot; main discovery work can continue.
4. **If a PR needs fixes later**
   Move only targeted fixes into the PR branch; do not reorganize full branch history mid-flow.
5. **Tighten rules when repos stabilize**
   Discovery stage: flexible. Maintenance stage: one branch per PR.

> **Non-negotiable at maintenance stage — one branch per PR.**
> When a branch has an open PR, do not add new commits for unrelated work. If post-merge fixes are
> needed, open a new `fix/` branch from `main`. A branch that produces more than one PR is a
> discovery-stage exception, not the rule. During code review: if a branch appears to be adding
> commits after a PR is already open for it, flag this as a workflow violation and ask the author
> to split the work onto a separate branch.

Long-term best practice remains one branch per PR, but discovery-stage flexibility is valid.
This staged policy aims for clean history without constant cognitive interruption.

Roadmap source of truth:

- [../roadmap.mdx](../roadmap.mdx)

## Why Milestones Were Jumped (Documented Reasons)

These jumps were intentional, not erratic. They follow constraints documented in the roadmap and related docs.

1. **Prerequisite gating forced non-linear execution**
   - Phase D is explicitly blocked by Phase C (`GiselleThemeProvider`).
   - Phase H dashboard work was unblocked only after `/charts` and `/motion` subpath prerequisites were wired.
   - Some Phase E extractions depend on earlier utility/icon prerequisites (`channelAlpha`, `Iconify` -> `GiselleIcon`).

2. **Ship-ready milestones were delivered while blocked milestones stayed open**
   - Multiple Phase E components were already implementation-ready and shipped (`StatCard`, `RadialProgressCard`, `TimelineCompact`, `SectionContainer`, `SectionTitle`, `TwoColumnShowcaseRow`) while other theming milestones remained in progress.
   - This reduced delivery risk and avoided waiting on blocked tracks.

3. **Quality hardening interrupted feature order by design**
   - Phase L quality infrastructure work (cleanup workflow, structural refactors, lint/style enforcement) was inserted to stabilize the library before additional feature expansion.
   - Timeline defects and UX decisions were tracked as open in `defects.md`, which naturally redirected effort from roadmap sequencing to defect containment.

4. **Discovery-stage branch policy prioritized flow over strict phase order**
   - During active discovery, one branch could produce multiple PRs and adjacent milestone updates.
   - Milestone cut points were chosen by reviewability and risk control, not by strict phase adjacency.

5. **Cross-cutting documentation and migration work required side-steps**
   - API migration and documentation parity tasks (for example ThemeProvider migration notes and timeline incident records) touched multiple milestones and created intentional jumps between feature, docs, and quality tracks.

6. **Single-owner throughput required staged sequencing**
   - With one developer running parallel, cross-repo delivery, milestone transitions were scheduled to minimize context-switch cost and dependency stalls.
   - Branch cuts were made at reviewable checkpoints; phase progression reflects those checkpoints, not a strictly serial implementation order.

In short: the jumps reflect dependency management, stabilization work, and reviewable-slice delivery strategy.

## Phase Coverage Snapshot

- `Phase A` (4 May 2026): Shipped. Reflected in this index via [`feature/phase-warning-popover`](https://github.com/AlexRebula/giselle-mui/tree/feature/phase-warning-popover) (completion documentation linkage).
- `Phase B` (5 May 2026): Shipped. Reflected via [`feature/giselle-theme-preset`](https://github.com/AlexRebula/giselle-mui/tree/feature/giselle-theme-preset).
- `Phase C` (target: May 2026): Planned (`GiselleThemeProvider`). No dedicated implementation branch in this index yet.
- `Phase D` (target: Jun 2026): Planned after Phase C. No dedicated implementation branch in this index yet.
- `Phase E` (target: Jun 2026): Active/shipped milestones reflected across timeline and component branches. Shipped milestones already logged in roadmap on 5 May 2026 and 8 May 2026.
- `Phase H` (target: Aug 2026): Prerequisite milestone reflected via [`feature/giselle-theme-preset`](https://github.com/AlexRebula/giselle-mui/tree/feature/giselle-theme-preset) (subpath prerequisite shipped 7 May 2026).
- `Phase L` (8 May 2026): Quality infrastructure reflected via chore/refactor branches.

Actual PR timeline in this index (GitHub timestamps):

- First PR opened: 21 Apr 2026 (PR 1)
- Latest PR opened: 6 May 2026 (PR 25)
- Latest merged PR recorded: 5 May 2026 (PR 24)
- PRs without a merge timestamp in GitHub metadata: PR 2, PR 5, PR 25

## Branch To Roadmap Mapping

Tag legend for indirect mappings:

- **[PRE-ROADMAP]** foundational work completed before formal phase tracking.
- **[ENABLER]** supporting scaffolding work that enables roadmap delivery.
- **[QUALITY/REVIEW]** hardening and review-response work.

Commits column — total commits across all PRs in the branch group, with size tier:
XS ≤ 3 · S 4–10 · M 11–20 · L 21–40 · XL > 40

| Branch                                                                                                                                                | PRs     | Commits | Dates (opened – merged) | Roadmap phase                                                                                                                                                       | Milestone                                                                                                                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`copilot/update-component-library-description`](https://github.com/AlexRebula/giselle-mui/tree/copilot/update-component-library-description)         | 1       | 2 (XS)  | 21 Apr – 21 Apr 2026    | **[PRE-ROADMAP]**                                                                                                                                                   | **[PRE-ROADMAP]** metadata/bootstrap baseline                                                                                                                                                 |
| [`feature/initial-files`](https://github.com/AlexRebula/giselle-mui/tree/feature/initial-files)                                                       | 2, 3    | 7 (S)   | 21 Apr – 21 Apr 2026\*  | **[PRE-ROADMAP]**                                                                                                                                                   | **[PRE-ROADMAP]** initial scaffolding baseline                                                                                                                                                |
| [`feature/update-giselle-icon`](https://github.com/AlexRebula/giselle-mui/tree/feature/update-giselle-icon)                                           | 4, 5, 6 | 7 (S)   | 23 Apr – 24 Apr 2026\*  | **[PRE-ROADMAP]**                                                                                                                                                   | **[PRE-ROADMAP]** foundational icon baseline                                                                                                                                                  |
| [`feature/timeline-and-roadmap`](https://github.com/AlexRebula/giselle-mui/tree/feature/timeline-and-roadmap)                                         | 7, 8    | 2 (XS)  | 25 Apr – 25 Apr 2026    | **[ENABLER]**                                                                                                                                                       | **[ENABLER]** roadmap/timeline docs scaffolding                                                                                                                                               |
| [`feature/timeline-two-column`](https://github.com/AlexRebula/giselle-mui/tree/feature/timeline-two-column)                                           | 9       | 21 (L)  | 29 Apr – 29 Apr 2026    | `Phase E` — Standalone UI primitives                                                                                                                                | Timeline track baseline leading to milestones such as TimelineCompact                                                                                                                         |
| [`feature/docs-update`](https://github.com/AlexRebula/giselle-mui/tree/feature/docs-update)                                                           | 10      | 13 (M)  | 30 Apr – 30 Apr 2026    | **[ENABLER]**                                                                                                                                                       | **[ENABLER]** documentation maintenance                                                                                                                                                       |
| [`bugfix/docs-and-icons`](https://github.com/AlexRebula/giselle-mui/tree/bugfix/docs-and-icons)                                                       | 11      | 13 (M)  | 30 Apr – 30 Apr 2026    | **[QUALITY/REVIEW]**                                                                                                                                                | **[QUALITY/REVIEW]** docs and accessibility hardening                                                                                                                                         |
| [`feature/timeline-enhancements`](https://github.com/AlexRebula/giselle-mui/tree/feature/timeline-enhancements)                                       | 12, 13  | 30 (L)  | 1 May – 1 May 2026      | `Phase E` — Standalone UI primitives                                                                                                                                | TimelineCompact<br />Accordion                                                                                                                                                                |
| [`feature/timeline-improvements`](https://github.com/AlexRebula/giselle-mui/tree/feature/timeline-improvements)                                       | 14      | 17 (M)  | 2 May – 3 May 2026      | `Phase E` — Standalone UI primitives                                                                                                                                | TimelineCompact<br />TaskList                                                                                                                                                                 |
| [`fix/pr14-review-amendments`](https://github.com/AlexRebula/giselle-mui/tree/fix/pr14-review-amendments)                                             | 15      | 3 (XS)  | 3 May – 3 May 2026      | `Phase E` — Standalone UI primitives                                                                                                                                | Review-fix hardening for timeline work (no new timeline milestone)                                                                                                                            |
| [`feature/phase-warning-popover`](https://github.com/AlexRebula/giselle-mui/tree/feature/phase-warning-popover)                                       | 16      | 6 (S)   | 3 May – 3 May 2026      | `Phase E` — Standalone UI primitives<br />`Phase A` — Theme token utilities                                                                                         | Timeline warning/popover track<br />Phase A completion documentation                                                                                                                          |
| [`feature/photos-array-slot`](https://github.com/AlexRebula/giselle-mui/tree/feature/photos-array-slot)                                               | 17, 18  | 23 (L)  | 4 May – 4 May 2026      | `Phase E` — Standalone UI primitives                                                                                                                                | Timeline data-model evolution for photo-array slot behavior                                                                                                                                   |
| [`chore/eslint-no-inline-sx`](https://github.com/AlexRebula/giselle-mui/tree/chore/eslint-no-inline-sx)                                               | 19      | 3 (XS)  | 4 May – 4 May 2026      | `Phase L` — Quality infrastructure                                                                                                                                  | Style extraction enforcement                                                                                                                                                                  |
| [`refactor/timeline-subfolders`](https://github.com/AlexRebula/giselle-mui/tree/refactor/timeline-subfolders)                                         | 20      | 2 (XS)  | 4 May – 4 May 2026      | `Phase L` — Quality infrastructure                                                                                                                                  | Timeline structural refactor                                                                                                                                                                  |
| [`refactor/structure-and-extract`](https://github.com/AlexRebula/giselle-mui/tree/refactor/structure-and-extract)                                     | 21, 22  | 18 (M)  | 4 May – 4 May 2026      | `Phase L` — Quality infrastructure                                                                                                                                  | Component structure normalization and extraction standards                                                                                                                                    |
| [`feature/giselle-theme-preset`](https://github.com/AlexRebula/giselle-mui/tree/feature/giselle-theme-preset)                                         | 23, 24  | 30 (L)  | 5 May – 5 May 2026      | `Phase B` — Giselle brand theme preset<br />`Phase E` — Standalone UI primitives<br />`Phase H` — Dashboard component suite<br />`Phase L` — Quality infrastructure | StatCard<br />RadialProgressCard<br />SectionTitle + SectionCaption<br />TwoColumnShowcaseRow<br />SectionContainer<br />Configure /charts and /motion subpath exports in tsup + package.json |
| [`feature/giselle-mui-career-timeline-finalisation`](https://github.com/AlexRebula/giselle-mui/tree/feature/giselle-mui-career-timeline-finalisation) | 25      | 72 (XL) | 6 May 2026 (open)       | `Phase E` — Standalone UI primitives                                                                                                                                | Career timeline finalisation — expand fix, hover fix, icon registry, Scenario variant                                                                                                         |
| [`chore/pr-messages-index`](https://github.com/AlexRebula/giselle-mui/tree/chore/pr-messages-index)                                                   | 26      | —       | 9 May 2026 (open)       | **[ENABLER]**                                                                                                                                                       | **[ENABLER]** PR history index, branch-to-roadmap mapping, per-PR companion doc scaffolding                                                                                                   |

`*` one or more PRs in that branch group have no merge timestamp in GitHub metadata.

## Roadmap Milestone To Branch Mapping (Vice Versa)

| Roadmap phase / milestone                                                                                                                                             | Related branch(es)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Phase A` — Theme token utilities                                                                                                                                     | [`feature/phase-warning-popover`](https://github.com/AlexRebula/giselle-mui/tree/feature/phase-warning-popover), [`feature/photos-array-slot`](https://github.com/AlexRebula/giselle-mui/tree/feature/photos-array-slot)                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `Phase B` — Giselle brand theme preset                                                                                                                                | [`feature/giselle-theme-preset`](https://github.com/AlexRebula/giselle-mui/tree/feature/giselle-theme-preset)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `Phase C` — GiselleThemeProvider (planned)                                                                                                                            | No dedicated branch yet                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `Phase E` — Standalone UI primitives shipped milestones (`StatCard`, `RadialProgressCard`, `SectionTitle + SectionCaption`, `TwoColumnShowcaseRow`, `FloatingSubNav`) | [`feature/giselle-theme-preset`](https://github.com/AlexRebula/giselle-mui/tree/feature/giselle-theme-preset)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `Phase E` — Timeline milestone tracks (`TimelineTwoColumn` baseline and follow-up improvements)                                                                       | [`feature/timeline-two-column`](https://github.com/AlexRebula/giselle-mui/tree/feature/timeline-two-column), [`feature/timeline-enhancements`](https://github.com/AlexRebula/giselle-mui/tree/feature/timeline-enhancements), [`feature/timeline-improvements`](https://github.com/AlexRebula/giselle-mui/tree/feature/timeline-improvements), [`fix/pr14-review-amendments`](https://github.com/AlexRebula/giselle-mui/tree/fix/pr14-review-amendments), [`feature/phase-warning-popover`](https://github.com/AlexRebula/giselle-mui/tree/feature/phase-warning-popover), [`feature/photos-array-slot`](https://github.com/AlexRebula/giselle-mui/tree/feature/photos-array-slot) |
| `Phase H` — Dashboard suite prerequisite (subpath export architecture)                                                                                                | [`feature/giselle-theme-preset`](https://github.com/AlexRebula/giselle-mui/tree/feature/giselle-theme-preset)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `Phase L` — Quality infrastructure                                                                                                                                    | [`chore/eslint-no-inline-sx`](https://github.com/AlexRebula/giselle-mui/tree/chore/eslint-no-inline-sx), [`refactor/timeline-subfolders`](https://github.com/AlexRebula/giselle-mui/tree/refactor/timeline-subfolders), [`refactor/structure-and-extract`](https://github.com/AlexRebula/giselle-mui/tree/refactor/structure-and-extract), [`feature/giselle-theme-preset`](https://github.com/AlexRebula/giselle-mui/tree/feature/giselle-theme-preset), [`chore/pr-messages-index`](https://github.com/AlexRebula/giselle-mui/tree/chore/pr-messages-index)                                                                                                                      |

## Branches

### [`copilot/update-component-library-description`](https://github.com/AlexRebula/giselle-mui/tree/copilot/update-component-library-description)

Initial repository metadata and positioning cleanup to align package identity and licensing intent.
This branch established baseline project framing before implementation-heavy work began.

- PR 1 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/1)) - [pr-01-align-repo-metadata/README.md](./pr-01-align-repo-metadata/README.md)

### [`feature/initial-files`](https://github.com/AlexRebula/giselle-mui/tree/feature/initial-files)

Bootstrap branch for foundational scaffolding, project wiring, and initial component/docs setup.
It captures the earliest structure needed for later roadmap-phase execution.

- PR 2 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/2)) - [pr-02-initial-files/README.md](./pr-02-initial-files/README.md)
- PR 3 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/3)) - [pr-03-initialize-project/README.md](./pr-03-initialize-project/README.md)

### [`feature/update-giselle-icon`](https://github.com/AlexRebula/giselle-mui/tree/feature/update-giselle-icon)

Early icon-system hardening branch focused on `GiselleIcon` behavior, sizing correctness, and docs clarity.
This track stabilized one of the core primitives used across later components.

- PR 4 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/4)) - [pr-04-enhance-giselle-icon/README.md](./pr-04-enhance-giselle-icon/README.md)
- PR 5 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/5)) - [pr-05-update-giselle-icon/README.md](./pr-05-update-giselle-icon/README.md)
- PR 6 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/6)) - [pr-06-enhance-icon-docs/README.md](./pr-06-enhance-icon-docs/README.md)

### [`feature/timeline-and-roadmap`](https://github.com/AlexRebula/giselle-mui/tree/feature/timeline-and-roadmap)

Documentation-first branch that set up roadmap visibility and timeline planning artifacts.
Its output defined direction and sequence for subsequent timeline implementation branches.

- PR 7 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/7)) - [pr-07-theming-roadmap-docs/README.md](./pr-07-theming-roadmap-docs/README.md)
- PR 8 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/8)) - [pr-08-restructure-docs/README.md](./pr-08-restructure-docs/README.md)

### [`feature/timeline-two-column`](https://github.com/AlexRebula/giselle-mui/tree/feature/timeline-two-column)

Baseline implementation branch for `TimelineTwoColumn`.
It established the component core that later enhancement and review-fix branches iterated on.

- PR 9 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/9)) - [pr-09-timeline-two-column/README.md](./pr-09-timeline-two-column/README.md)

### [`feature/docs-update`](https://github.com/AlexRebula/giselle-mui/tree/feature/docs-update)

Focused documentation maintenance branch.
It improved docs coherence without introducing a distinct new roadmap milestone.

- PR 10 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/10)) - [pr-10-update-readme-docs/README.md](./pr-10-update-readme-docs/README.md)

### [`bugfix/docs-and-icons`](https://github.com/AlexRebula/giselle-mui/tree/bugfix/docs-and-icons)

Bugfix track combining docs corrections with icon/a11y-related hardening.
This branch reduced regressions and clarified usage contracts before deeper feature work.

- PR 11 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/11)) - [pr-11-eslint-a11y/README.md](./pr-11-eslint-a11y/README.md)

### [`feature/timeline-enhancements`](https://github.com/AlexRebula/giselle-mui/tree/feature/timeline-enhancements)

Incremental timeline improvement branch extending functionality and maintainability after the baseline landed.
It captures practical refinements discovered during real usage.

- PR 12 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/12)) - [pr-12-timeline-enhancements/README.md](./pr-12-timeline-enhancements/README.md)
- PR 13 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/13)) - [pr-13-fix-postinstall/README.md](./pr-13-fix-postinstall/README.md)

### [`feature/timeline-improvements`](https://github.com/AlexRebula/giselle-mui/tree/feature/timeline-improvements)

Targeted branch for timeline behavior and layout improvements.
It narrowed in on usability and rendering consistency gaps identified after earlier timeline releases.

- PR 14 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/14)) - [pr-14-timeline-improvements/README.md](./pr-14-timeline-improvements/README.md)

### [`fix/pr14-review-amendments`](https://github.com/AlexRebula/giselle-mui/tree/fix/pr14-review-amendments)

Review-response branch for PR 14 follow-up fixes.
The purpose was to close reviewer findings cleanly without broadening scope.

- PR 15 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/15)) - [pr-15-fix-pr14-review/README.md](./pr-15-fix-pr14-review/README.md)

### [`feature/phase-warning-popover`](https://github.com/AlexRebula/giselle-mui/tree/feature/phase-warning-popover)

Branch centered on timeline warning/popover behavior and related phase-level polish.
It also became the bucket for linked completion docs tied to that delivery window.

- PR 16 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/16)) - [pr-16-phase-warning-popover/README.md](./pr-16-phase-warning-popover/README.md)

### [`feature/photos-array-slot`](https://github.com/AlexRebula/giselle-mui/tree/feature/photos-array-slot)

Data-model evolution branch introducing/expanding photo-array slot behavior in timeline entities.
This track improved item flexibility and supported richer visual timeline states.

- PR 17 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/17)) - [pr-17-photos-array-slot/README.md](./pr-17-photos-array-slot/README.md)
- PR 18 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/18)) - [pr-18-refactor-phasecard/README.md](./pr-18-refactor-phasecard/README.md)

### [`chore/eslint-no-inline-sx`](https://github.com/AlexRebula/giselle-mui/tree/chore/eslint-no-inline-sx)

Quality-infrastructure branch introducing stricter style extraction enforcement.
It pushed consistency around `sx` usage and reduced inline-style drift.

- PR 19 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/19)) - [pr-19-eslint-styles-extraction/README.md](./pr-19-eslint-styles-extraction/README.md)

### [`refactor/timeline-subfolders`](https://github.com/AlexRebula/giselle-mui/tree/refactor/timeline-subfolders)

Structural refactor branch focused on timeline internal organization.
Its aim was maintainability and clearer component boundaries rather than feature expansion.

- PR 20 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/20)) - [pr-20-refactor-timeline-subfolders/README.md](./pr-20-refactor-timeline-subfolders/README.md)

### [`refactor/structure-and-extract`](https://github.com/AlexRebula/giselle-mui/tree/refactor/structure-and-extract)

Broader structure-normalization and extraction branch aligned with cleanup standards.
It strengthened component layout conventions and check-gate enforceability.

- PR 21 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/21)) - [pr-21-refactor-component-structure/README.md](./pr-21-refactor-component-structure/README.md)
- PR 22 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/22)) - [pr-22-refactor-component-structure-2/README.md](./pr-22-refactor-component-structure-2/README.md)

### [`feature/giselle-theme-preset`](https://github.com/AlexRebula/giselle-mui/tree/feature/giselle-theme-preset)

Major delivery branch covering theme-preset work, shipped primitives, and subpath architecture groundwork.
It also contains quality-hardening and migration-adjacent context due to cross-cutting scope.

- PR 23 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/23)) - [pr-23-giselle-icon-theme-extractions/README.md](./pr-23-giselle-icon-theme-extractions/README.md)
- PR 24 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/24)) - [pr-24-giselle-theme-preset/README.md](./pr-24-giselle-theme-preset/README.md)

### [`feature/giselle-mui-career-timeline-finalisation`](https://github.com/AlexRebula/giselle-mui/tree/feature/giselle-mui-career-timeline-finalisation)

Career timeline finalisation branch — fixes to expand/collapse behaviour, hover state, icon registry integration, and the Scenario variant.
Currently open (PR 25, not yet merged).

- PR 25 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/25)) - [pr-25-career-timeline-finalisation/README.md](./pr-25-career-timeline-finalisation/README.md)

### [`chore/pr-messages-index`](https://github.com/AlexRebula/giselle-mui/tree/chore/pr-messages-index)

Documentation-only branch that adds the PR history index you are reading now.
Covers all 25 PRs from inception, adds per-PR companion doc scaffolding, branch-to-roadmap mapping tables, and a `.gitignore` fix for Vitest coverage output.
Currently open (PR 26, not yet merged).

- PR 26 ([GitHub](https://github.com/AlexRebula/giselle-mui/pull/26)) - [pr-26-pr-messages-index/README.md](./pr-26-pr-messages-index/README.md)
