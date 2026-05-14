---
sidebar_label: 'PR43 - Per-component roadmap standard + PR review workflow'
---

**[Open](https://github.com/AlexRebula/giselle-mui/pull/43)** — [`chore/component-roadmap-standard`](https://github.com/AlexRebula/giselle-mui/tree/chore/component-roadmap-standard) — 14 May 2026

# PR: `chore/component-roadmap-standard`

> **Branch:** `chore/component-roadmap-standard` → `main`
> **PR:** [#43](https://github.com/AlexRebula/giselle-mui/pull/43)
> **Type:** `chore` — documentation infrastructure, workflow formalisation
> **Opened:** 14 May 2026

---

## Summary

Two complementary quality-infrastructure deliverables that formalise how this library manages
improvement backlogs and pull request lifecycle — from branch hygiene through to branch owner
sign-off.

**Per-component `roadmap.md` standard** — every standalone component exported from `src/index.ts`
now has a standard improvement-tracking file in its own folder. Step 10b in
`docs/components/cleanup-workflow.md` defines the template (status, open improvements, known
gaps, completed work with dates) and the rules (move completed tasks, never delete history,
always named `roadmap.md`). This replaces the previous approach of tracking per-component
improvements in session notes or the global `docs/todo/` tree.

**PR review workflow** — `docs/pr-review-workflow.md` ships the full lifecycle as an executable
document: branch hygiene (commit relatedness rule, quality gate), PR creation (via `gh pr create`
only — both GitHub UI hazards explicitly named and prohibited), Copilot review response
(gather all threads before replying, valid/not-valid/needs-owner format), fix batch commit,
and branch owner sign-off. Session shorthands `review pr <N>` and `create pr <branch>` in
`copilot-instructions.md` make the workflow invocable in any future Copilot session.

**This is the milestone where ad-hoc process became repeatable, self-documenting infrastructure.**
The workflow document now describes how to use the workflow document.

---

## What Changed

### `docs/components/cleanup-workflow.md` — Step 10b (new step)

Added between Step 10 (README) and Step 11 (quality gate). Defines:

- **When:** mandatory for every standalone component exported from `src/index.ts`. Sub-components
  (flat in parent folder, not independently exported) are optional but encouraged.
- **Template:** Status (ripeness label + date), Open Improvements (priority table with Priority /
  Task / Notes columns), Known Gaps (bullet list), Completed (two-column date + task table).
- **Rules:** move completed tasks from Open to Completed — never delete; update `Last updated`
  on every edit; no personal content; file is always named `roadmap.md`.
- **Quick Reference:** `roadmap.md` added to the companion-files checklist.

### `docs/pr-review-workflow.md` (new file)

End-to-end PR workflow covering:

- **Phase 0 — Branch hygiene:** commit relatedness rule (type does not need to match prefix —
  relatedness to stated branch purpose is what matters), with three concrete examples; moving
  unrelated commits via cherry-pick + rebase; quality gate pre-flight.
- **Phase 1 — PR creation:** green light rule (never create without explicit approval); both
  GitHub UI hazards explicitly prohibited (§ 1.1): "Compare & pull request" button (empty
  template) and GitHub Copilot "generate description" button (overwrites template entirely —
  no repo config prevents it); PR description conventions; Copilot review trigger via
  `gh pr view --json reviewRequests` check-first (skip if already auto-requested).
- **Phase 2 — Copilot review response:** gather all threads before replying; respond to every
  thread in document order using the reply API; four response categories: ✅ valid,
  ❌ not valid, ⚠️ tbd-needs-research, ⏸️ needs-owner-input; § 2.3 security/WCAG findings
  always valid regardless of context; § 2.4 owner-input flag pauses automation; § 2.5 inline
  suggestion blocks must be accepted/rejected individually.
- **Phase 3 — Fix batch commit:** one commit, quality gate before push, commit message lists
  every fix, follow-up replies with SHA per thread.
- **Phase 4 — Thread state:** threads stay UNRESOLVED (only branch owner resolves); PR
  description updated if scope changed.
- **Phase 5 — Sign-off:** branch owner reads every thread, verifies the fix, resolves threads,
  approves, merges.
- **Quick reference** at end for mid-session orientation.

### `.github/copilot-instructions.md` — session shorthand commands

Added two entries to the Session shorthand commands table:

| Shorthand            | Behaviour                                                                        |
| -------------------- | -------------------------------------------------------------------------------- |
| `review pr <N>`      | Execute Phases 2–5 of `docs/pr-review-workflow.md` for PR `<N>`                  |
| `create pr <branch>` | Execute Phase 0 + Phase 1 only; stop after Copilot review is confirmed triggered |

### `docs/roadmap.md` — Phase L

Two new rows:

1. Per-component `roadmap.md` files — standard defined, actual files across all components remain open work
2. PR review workflow formalised — ✅ Done 14 May 2026

---

## Quality Gate

- [x] `npm run check:verify` — 6/6 green (Prettier · ESLint · tsc · Vitest · tsup · Storybook)
- [x] Docs-only branch — no component code changed, component rules N/A
- [x] All 9 commits are `chore(docs):` — all directly related to this branch's stated purpose
- [x] No personal content, no Minimals identifiers, no `any`, no `React.FC`

---

## Notes for reviewer

The most consequential decision in this PR is § 1.1 of `pr-review-workflow.md`: the explicit
prohibition of both GitHub UI paths for PR creation. The Copilot "generate description" button
hazard was discovered during this session — it replaces the PR template entirely with a
free-form diff summary, and no repo-level setting prevents it. Naming both hazards explicitly
is what makes the rule unambiguous rather than relying on "use the CLI" as an implied preference.

The per-component `roadmap.md` standard (Step 10b) creates a backlog obligation: every existing
component needs its `roadmap.md` created. This is tracked as open in Phase L of `docs/roadmap.md`.
The standard is ready; the actual files are the next cleanup run's work.
