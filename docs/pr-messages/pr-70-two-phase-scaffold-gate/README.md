---
sidebar_label: 'PR70 - Two-phase scaffold gate + roadmap audit scripts'
---

**[Closed](https://github.com/AlexRebula/giselle-mui/pull/70)** — [`chore/two-phase-scaffold-gate`](https://github.com/AlexRebula/giselle-mui/tree/chore/two-phase-scaffold-gate) — 24 May 2026

# PR: `chore/two-phase-scaffold-gate`

> **Branch:** `chore/two-phase-scaffold-gate` → `main`
> **PR:** [#70](https://github.com/AlexRebula/giselle-mui/pull/70)
> **Type:** `chore` — quality gate, quality infrastructure
> **Opened:** 24 May 2026

---

## Summary

Adds automated enforcement of the two-phase TDD scaffold pattern — the practice where every
new component must have `it.todo` stubs (scaffold phase) before implementation begins
(implementation phase). Previously this was a documented convention; after this PR it is a
Vitest gate that blocks violations in CI.

Also ships `scripts/audit-roadmaps.cjs`, a standalone audit script that checks roadmap
alignment and exits 1 on ERROR-severity findings. This replaces the previous pattern of
running roadmap audits ad-hoc and silently discarding results.

---

## What Changed

### `src/quality-gate/two-phase-scaffold.test.ts` (new)

Vitest gate that enforces the two-phase scaffold rule across the entire `src/` tree:

- Walks all `.test.ts` files in `src/`
- For each file, checks whether it contains `it.todo` stubs alongside non-todo tests
- Files in `two-phase-scaffold-exempt.json` are skipped (pre-existing files that predate the gate)
- Any non-exempt file that has only implementation-style tests without scaffold stubs fails

### `src/quality-gate/two-phase-scaffold-exempt.json` (new)

Baseline of 144 pre-existing test files that are grandfathered in. These files were written
before the two-phase scaffold gate existed and would all fail if checked without exemption.
The exempt list only grows when pre-existing files are intentionally brought into compliance
and their entry is removed from the list.

### `scripts/audit-roadmaps.cjs` (new)

CLI script that:

- Reads all `roadmap.md` files in the `src/` tree
- Validates structure, required sections, and internal consistency
- Prints a formatted audit report to stdout
- Exits 1 when any ERROR-severity finding is present (enabling CI enforcement)
- Exits 0 when the audit is clean

### `docs/components/dashboard-components-plan.md` — deduplication

Removed a duplicate `Status` legend section that had been present twice in the file.
No content changed — the duplicate was an exact copy.

### `.gitignore`

Added `.pr67_threads*.json` to prevent Copilot PR review thread cache files from being
committed accidentally.

### `eslint.config.mjs`

Various ESLint rule adjustments made during the quality gate pass.

### Story `argTypes` fixes — 4 components

Fixed `argTypes` declarations in stories across four components where the `control: false`
pattern was missing or incorrect. These caused Storybook's controls panel to render
unusable inputs for non-controllable props.

---

## Quality Gate

- [x] Prettier — clean
- [x] ESLint — clean
- [x] TypeScript — clean
- [x] Vitest — all tests pass (including the new scaffold gate)
- [x] tsup build — clean
- [x] Storybook build — clean
