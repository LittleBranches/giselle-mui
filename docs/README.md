---
sidebar_position: 1
sidebar_label: 'Overview'
---

# @littlebranches/giselle-mui

A set of focused MUI wrapper components that encode non-obvious design and accessibility decisions so consumers don't have to rediscover them.

Every component in this library exists because it solves a recurring problem that is either easy to get wrong with MUI alone, or non-trivial to implement correctly.

## What is in this documentation?

### Planning and inventory

- **[Component inventory](./component-inventory.md)** — Master list of all components across every phase: build status, location, and subpath.
- **[Component compliance](./component-compliance.md)** — 3-tier README / JSDoc / Story JSDoc compliance report.
- **[Roadmap](./roadmap.mdx)** — Phase A → H milestone timeline with detail.
- **[Scaffold plan](./scaffold-plan.md)** — Library skeleton structure and strategy. *(see also [Archive](#archive))*
- **[Standalone gap analysis](./standalone-gap-analysis.md)** — What a blank Next.js project needs from this library. *(see also [Archive](#archive))*

### Standards and conventions

- **[Documentation strategy](./documentation-strategy.md)** — The three-tier docs model: when to use JSDoc vs story JSDoc vs Docusaurus.
- **[Naming conventions](./naming-conventions.md)** — Component naming rules; active standard applied to every component.
- **[PR review workflow](./pr-review-workflow.md)** — PR review process and checklist.
- **[Component cleanup workflow](./components/cleanup-workflow.md)** — The definition of done checklist, API consistency contract, and Storybook prop-surface guidance.

### Development

- **[Local development](./local-development.md)** — Day-to-day workflow: Storybook for isolated development, yalc for testing in the consumer app, and how to publish a release to npm.
- **[Storybook deployment](./storybook-deploy.md)** — How the Vercel deploy pipeline works, what was set up, and how to re-create it.
- **[Theming](./theming/)** — How to wire MUI v7 CSS variables mode in Next.js and React/Vite apps, plus the theming roadmap.
- **[Components](./components/)** — Per-component guides and planning notes.

### Tracking

- **[Defects and UX decisions](./defects.md)** — Active defects and unresolved design decisions tracked before release.
- **[MUI 9 migration plan](./migrations/mui-9-migration-and-support-plan.md)** — Workspace rollout plan, effort estimates, and temporary MUI v7 dual-support policy.
- **[MUI 9 migration checklist](./migrations/mui-9-migration-checklist.md)** — Tracked execution board: every discrete task, status, and owner field.
- **[Internal sync](./internal-sync.md)** — Versioned baseline digest recording the last clean compliance state.
- **[PR messages index](./pr-messages/README.md)** — Historical PR descriptions and review checklists, grouped by PR number.
- **[PR audits](./pr-audits/)** — Historical PR comment audits.
  - [pr-25-comment-audit.md](./pr-audits/pr-25-comment-audit.md)
- **[Incidents](./incidents/)** — Post-mortems: convention loss, regressions, and cleanup incidents.
  - [cleanup-day-8-may-2026.md](./incidents/cleanup-day-8-may-2026.md)
  - [model-handoff-convention-loss-may-2026.md](./incidents/model-handoff-convention-loss-may-2026.md)
  - [timeline-hover-regression-may-2026.md](./incidents/timeline-hover-regression-may-2026.md)

## Archive

These are historical planning documents — not current constraints.

- **[Scaffold plan](./scaffold-plan.md)** — Library skeleton structure and strategy.
- **[Standalone gap analysis](./standalone-gap-analysis.md)** — What a blank Next.js project needs from this library.
- **[PR messages](./pr-messages/README.md)** — Historical PR descriptions and review checklists, grouped by PR number.
- **[PR audits](./pr-audits/)** — Historical PR comment audits (also linked in Tracking for discoverability).
  - [pr-25-comment-audit.md](./pr-audits/pr-25-comment-audit.md)
- **[Phase card developer notes](./components/timeline/two-column/phase-card/developer-notes/)** — Collapsed-state content inventory and troubleshooting notes.

## Install

```bash
npm install @littlebranches/giselle-mui
```

## Peer dependencies

```bash
npm install @mui/material @emotion/react @emotion/styled @iconify/react
```
