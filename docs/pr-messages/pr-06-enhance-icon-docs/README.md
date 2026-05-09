---
sidebar_label: "PR06 - Enhance icon docs"
---

**[Merged](https://github.com/AlexRebula/giselle-mui/pull/6)** — [`feature/update-giselle-icon`](https://github.com/AlexRebula/giselle-mui/tree/feature/update-giselle-icon) — 23 Apr – 24 Apr 2026


# Enhance documentation and fix Icon sizing for better clarity

This pull request significantly improves documentation and test clarity for the `GiselleIcon` component and its integration with Iconify and MUI. The changes focus on clarifying usage patterns, edge cases, and best practices for both developers and contributors. The updates also enhance the test suite's discipline and expand coverage for key rendering behaviors.

**Documentation improvements:**

- Expanded the `docs/iconify-registration.md` guide with detailed explanations of the Iconify store, CDN fallback issues, the concept of idempotent registration, and the importance of registering icons at the module level. Added sections on using any Iconify icon set, obtaining correct SVG body strings, handling viewBox dimensions (especially for the `logos:` set), and clarified that icon registration and sets should live in the consuming app, not in libraries.
- Improved the `src/components/giselle-icon/README.md` to enumerate six common pitfalls when combining Iconify and MUI, including TypeScript typing, dependency licensing, responsive sizing, registration side-effects, and icon prop typing. Provided clear rationale for `GiselleIcon`'s design choices and decoupling from consuming app internals.
- Updated the main `README.md` to clarify the current state and future plans for test coverage, including a commitment to a thorough test suite review before the first npm release.

**Test suite enhancements:**

- Added and documented the use of regex-based negative assertions in `giselle-icon.test.ts` to ensure no numeric width/height values leak to the inner Icon, enforcing that all sizing is controlled by the MUI `Box` wrapper.
- Added a regression test to verify that the inner SVG always fills the wrapper (`100%` width/height) when only `sx` is used for sizing, preventing fallback to unwanted default sizes.

**Component doc and prop comment refinements:**

- Clarified comments in `giselle-icon.tsx` and its props, focusing on the role of the wrapper and removal of misleading details about responsive sizing (which is now covered in the README).
