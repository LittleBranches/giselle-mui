---
sidebar_label: "PR15 - Fix PR14 review"
---

**[Merged](https://github.com/AlexRebula/giselle-mui/pull/15)** — [`fix/pr14-review-amendments`](https://github.com/AlexRebula/giselle-mui/tree/fix/pr14-review-amendments) — 3 May – 3 May 2026


# fix(timeline): address PR #14 review comments

## What

This commit contains the PR #14 review amendments that were completed *after* the feature branch was merged. The commit was cherry-picked cleanly onto `main` locally; this PR is the required vehicle to get it into `origin/main` due to branch protection rules.

## Changes

- **`dotTooltip` nullish check** — `resolvePhaseTooltip` and `resolveMilestoneTooltip` now use `!= null` instead of truthy, so `dotTooltip: ''` correctly suppresses the tooltip
- **`useIsomorphicLayoutEffect`** — defined inline; prevents SSR hydration warning in Next.js consumers when `useLayoutEffect` is called on the server
- **`useMemo sorted` deps** — `sortMilestones` added to deps array; `eslint-disable-next-line react-hooks/exhaustive-deps` comment removed (no longer needed)
- **`minHeight` no-year-label branch** — `Math.max(milestoneSlotHeight, msSlotHeights[...] ?? 0)` clamp added; previously the measured slot height was ignored when there was no year label
- **`msSlotHeights` two-directional stale-key detection** — also catches removed phases (previously only caught added/changed keys)
- **`types.ts` footer JSDoc** — `ModemSoundButton` → generic `PlayButton` placeholder (zero-personal-data rule)
- **Stories** — replace `alert()` with `console.warn`; replace personal/biographical dates and first-person descriptions with neutral generic equivalents

## Quality gate

All 6 checks pass on this branch: Prettier ✓ ESLint ✓ tsc ✓ Vitest (312 tests) ✓ tsup ✓ Storybook ✓
