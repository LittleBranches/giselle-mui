---
sidebar_position: 9
sidebar_label: 'MUI 9 migration plan'
---

# MUI 9 migration and v7 support plan

This plan defines how the workspace migrates to MUI 9 without breaking current MUI 7 consumers.

## Why this is a large effort

`@alexrebula/giselle-mui` is a shared dependency used by multiple apps. A major MUI upgrade must be done in order and validated in each consumer.

## Current workspace snapshot (8 May 2026)

- `giselle-mui`: MUI 7 in peers and dev deps.
- `alexrebula`: MUI 7 + MUI X v8.
- `first-branch`: mixed majors now (`@mui/material` v7 with `@mui/material-nextjs` v9) and must be aligned immediately.
- `giselle-docs`: MUI 7.
- `giselle-ui` and `giselle-sections-sdk`: no MUI dependency (not part of this migration).

## Migration principles

1. Upgrade `giselle-mui` first, then consumers.
2. Keep all `@mui/*` packages in a given app on compatible majors.
3. Avoid alias/transpile workarounds for MUI package resolution.
4. Use branch + PR per repository, never direct pushes to main/master.

## Effort estimate

Estimates include coding, verification, and visual QA.

| Scope                                        | Effort       | Notes                                                            |
| -------------------------------------------- | ------------ | ---------------------------------------------------------------- |
| Planning + compatibility matrix              | 0.5-1 day    | Pin compatible `@mui/*` versions per repo                        |
| `giselle-mui` migration + dual-major support | 2-4 days     | Peer ranges, code fixes, tests, Storybook, dist verification     |
| `alexrebula` migration                       | 2-5 days     | Largest surface area (Next 16 + MUI X pages + icons + timelines) |
| `first-branch` migration                     | 0.5-1.5 days | Smaller app, but currently has a major-version mismatch          |
| `giselle-docs` migration                     | 0.5-1 day    | Docusaurus + MDX + component docs pages                          |
| Stabilization and bug-fix window             | 2-4 days     | Cross-repo fixes after integrated testing                        |

Total expected effort: **7.5-16.5 working days**.

## Immediate prerequisite (before MUI 9 work)

Fix version mismatch in `first-branch`:

- Align `@mui/material` and `@mui/material-nextjs` to the same major.
- Run `npm run check` and a full app smoke test.

This should be treated as a blocker cleanup item, independent from full MUI 9 migration.

## Execution plan

## Phase 1 - Foundation package (`giselle-mui`)

1. Create migration branch.
2. Expand peer dependency ranges to support both MUI 7 and MUI 9 during transition.
3. Upgrade local dev dependencies to MUI 9-compatible versions.
4. Apply official codemods where applicable.
5. Resolve compile/lint/test regressions.
6. Validate package exports and externals (`tsup`) remain correct.
7. Run full gate: `npm run check:verify`.

Exit criteria:

- Build, typecheck, tests, Storybook all green.
- Published dist works with both MUI 7 and MUI 9 in consumer test apps.

## Phase 2 - Consumer apps

Upgrade in this order:

1. `alexrebula`
2. `first-branch`
3. `giselle-docs`

For each app:

1. Upgrade all MUI family packages as one set.
2. Run quality gate and build.
3. Run focused visual QA on components using `@alexrebula/giselle-mui`.
4. Record any breakages back into this plan as checklist items.

## Phase 3 - Stabilization

1. Fix cross-repo regressions.
2. Re-run full verification in each repo.
3. Cut release notes for migration deltas.

## How to support v7 while migrating

Recommended model: **dual-major support window**.

### Package policy (`giselle-mui`)

- Keep `peerDependencies` compatible with both v7 and v9 for a limited period.
- Avoid new APIs that exist only in one major unless guarded/fallbacked.
- If a component cannot be implemented compatibly, document that constraint explicitly.

### CI policy

- Add a temporary compatibility matrix:
  - Job A installs MUI 7 and runs `check:verify`.
  - Job B installs MUI 9 and runs `check:verify`.
- Keep matrix until all consumer apps are migrated and stable.

### Support window

Proposed support timeline:

1. `T0`: Introduce dual-major support in `giselle-mui`.
2. `T0 + 4 weeks`: all internal consumers must be migrated.
3. `T0 + 6 weeks`: announce v7 deprecation date.
4. `T0 + 10-12 weeks`: remove v7 support in next major release.

This gives enough runway without maintaining dual-support forever.

## Risk hotspots

- MUI X compatibility in `alexrebula` (must align with chosen major strategy).
- Storybook docs/control behavior changes after major upgrade.
- Styling token semantics if any MUI 9 CSS vars behavior changed.
- Hidden dependency coupling via local yalc package updates.

## Verification checklist (workspace-wide)

- `giselle-mui`: `npm run check:verify`
- `alexrebula`: `npm run check:verify`
- `first-branch`: `npm run check:verify`
- `giselle-docs`: `npm run build`
- Manual visual smoke checks on timeline, cards, nav, icon rendering, and chart cards.

## Decision log

When decisions are made, append them here with date and rationale:

- Version targets selected for each repo
- v7 support end date
- Any API compromises made for dual-major compatibility
