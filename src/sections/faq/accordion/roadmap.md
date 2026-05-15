# FaqSection — Roadmap

> Last updated: 14 May 2026

## Status

`stable`

Fully audited. FAQ accordion section with animated expand/collapse; exported from `/motion` subpath.

## Open improvements

| Task                                                                                      | Priority | Status |
| ----------------------------------------------------------------------------------------- | -------- | ------ |
| Remove deprecated `FaqAccordion` re-export alias in a future minor version bump           | Low      | ⬜     |

## Known gaps

- The `FaqAccordion` export alias is still present to avoid breaking consumers. It should be removed once a semver bump is appropriate.

## Completed

| Task                       | Completed   |
| -------------------------- | ----------- |
| Initial component shipped  | 13 May 2026 |
| Renamed `FaqAccordion` → `FaqSection` (alias kept for backward compat) | 13 May 2026 |
| Full cleanup audit (21/21) | 13 May 2026 |
