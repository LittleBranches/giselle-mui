# FloatingSubNav — Roadmap

> Last updated: 14 May 2026

## Status

`beta`

Fully audited. Horizontally scrollable pill-tab navigation bar. Currently in the main bundle — migration to `/motion` subpath is planned (Phase H Group 6) but is a breaking change for current consumers.

## Open improvements

| Task                                                                                       | Priority | Status |
| ------------------------------------------------------------------------------------------ | -------- | ------ |
| Move from main bundle to `/motion` subpath (requires re-export shim or minor version bump) | Medium   | ⬜     |

## Known gaps

- Lives in the wrong subpath. Should be in `/motion` since it uses `framer-motion` internally, but moving it is a breaking change until a re-export shim is added or a minor version bump is issued.

## Completed

| Task                       | Completed   |
| -------------------------- | ----------- |
| Initial component shipped  | 13 May 2026 |
| Full cleanup audit (21/21) | 13 May 2026 |
