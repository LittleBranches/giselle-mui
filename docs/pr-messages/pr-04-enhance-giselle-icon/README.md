---
sidebar_label: "PR04 - Enhance GiselleIcon"
---

**[Merged](https://github.com/AlexRebula/giselle-mui/pull/4)** — [`feature/update-giselle-icon`](https://github.com/AlexRebula/giselle-mui/tree/feature/update-giselle-icon) — 23 Apr – 24 Apr 2026


# Enhance GiselleIcon for MUI sx theming and responsive sizes

This pull request introduces significant improvements to the `GiselleIcon` component and its integration with the `@iconify/react` icon system. The main focus is on enabling offline icon registration to prevent icon flicker, updating documentation to clarify usage and requirements, and simplifying the sizing logic for icons. Additionally, the package now supports `@iconify/react` v6, and related tests and documentation have been updated accordingly.

**Key changes:**

**1. Icon registration and offline support**
- Introduced a new utility, `createIconRegistrar`, which allows apps to pre-register icons offline, preventing CDN flicker and ensuring icons are bundled with the JS output. This utility and its types are now exported from the public API (`src/utils/create-icon-registrar.ts`, `src/index.ts`).
- Updated documentation and guides to clearly explain the need for icon pre-registration, with detailed instructions and links to further resources (`README.md`, `docs/theming-nextjs.md`, `docs/theming-react.md`).

**2. GiselleIcon sizing logic and API**
- Simplified the sizing logic: the inner SVG now always fills the wrapper (`width="100%"`, `height="100%"`), and the wrapper span's CSS (via `sx`) controls the rendered size. This enables full responsive sizing and eliminates the need for default width/height props.
- Updated tests and documentation to reflect the new sizing model, removing tests for default width/height and adding tests for the new behavior.

**3. Documentation and dependency updates**
- Clarified the MIT license and the library's independence from any proprietary themes in the `README.md`.
- Updated the peer and dev dependencies to support both `@iconify/react` v5 and v6, with v6 as the dev dependency (`package.json`).
- Added `createIconRegistrar` to the component table in the `README.md` and linked to icon registration documentation.

These changes collectively improve the developer experience, ensure robust icon rendering without flicker, and make the icon system more flexible and production-ready.
