---
sidebar_label: "PR13 - Fix postinstall"
---

**[Merged](https://github.com/AlexRebula/giselle-mui/pull/13)** — [`feature/timeline-enhancements`](https://github.com/AlexRebula/giselle-mui/tree/feature/timeline-enhancements) — 1 May – 1 May 2026


# Fix postinstall script to handle missing setup-hooks.js

This pull request enhances the timeline two-column UI components, focusing on improving milestone and phase badge interactivity, visual feedback, and information clarity. The most significant updates include making milestone badges reveal more details on hover, improving the display and styling of dates, adjusting client logo sizing, and refining the visual cues for active and completed items.

**Milestone Badge Interactivity and Visual Feedback:**

- Milestone badges now reveal the full title and description on hover, not just when expanded, providing better glanceability and context for users. Hovering also restores full opacity and color to completed milestones, making the preview more visually accessible.
- The milestone date is now always displayed (when present), regardless of expansion state, improving information visibility.

**Phase Card Improvements:**

- Phase cards now always show the date (if present and not hidden), not just when expanded, and the tech stack/platforms section has been repositioned for better layout consistency.
- Client logos are displayed larger and with increased maximum width for better visibility.

**Visual and Behavioral Refinements:**

- Completed (done) badges and cards now restore full color and opacity on hover, making them easier to read.
- The pulsing halo effect for active phase dots is now suppressed for completed items, reducing visual noise.
- Timeline date badges have updated styling for better contrast and are hidden by default, likely to be shown conditionally in the future.

**Build and Setup Script Update:**

- The `postinstall` script in `package.json` was updated to use dynamic ES module import, improving compatibility and error handling during setup.
