# GiselleSettingsProvider — Roadmap

> Last updated: 14 May 2026

## Status

`alpha`

Shipped. Generic settings context with localStorage, cookie, and custom storage adapters. Cleanup audit pending. One planned feature (`detectGiselleSettings`) not yet implemented.

## Open improvements

| Task                                                                                           | Priority | Status |
| ---------------------------------------------------------------------------------------------- | -------- | ------ |
| Implement `detectGiselleSettings()` — SSR-safe cookie read helper for Next.js App Router       | High     | ⬜     |
| Run full cleanup audit (DoD 21, Best practices 13)                                             | High     | ⬜     |

## Known gaps

- `detectGiselleSettings()` is the SSR-safe counterpart to the client-side cookie adapter. Without it, server components cannot read initial settings from cookies before hydration. This was tracked as a Phase D follow-up item and is still open.
- Cleanup audit not yet run.

## Completed

| Task                                                        | Completed   |
| ----------------------------------------------------------- | ----------- |
| Initial component shipped (`GiselleSettingsProvider`)       | 14 May 2026 |
| `GiselleThemeAndSettingsProvider` convenience wrapper added | 14 May 2026 |
| `useLocalStorage` utility shipped                           | 14 May 2026 |
