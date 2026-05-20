---
sidebar_position: 1
sidebar_label: 'Overview'
---

# @littlebranches/giselle-mui

A set of focused MUI wrapper components that encode non-obvious design and accessibility decisions so consumers don't have to rediscover them.

Every component in this library exists because it solves a recurring problem that is either easy to get wrong with MUI alone, or non-trivial to implement correctly.

## What is in this documentation?

- **[Documentation strategy](./documentation-strategy.md)** — The three-tier docs model: when to use JSDoc vs story JSDoc vs Docusaurus.
- **[PR messages index](./pr-messages/README.md)** — Historical PR descriptions and review checklists, grouped by PR number.
- **[Local development](./local-development.md)** — Day-to-day workflow: Storybook for isolated development, yalc for testing in the consumer app, and how to publish a release to npm.
- **[Storybook deployment](./storybook-deploy.md)** — How the Vercel deploy pipeline works, what was set up, and how to re-create it.
- **[Component cleanup workflow](./components/cleanup-workflow.md)** — The definition of done checklist, API consistency contract, and Storybook prop-surface guidance.
- **[Defects and UX decisions](./defects.md)** — Active defects and unresolved design decisions tracked before release.
- **[MUI 9 migration plan](./migrations/mui-9-migration-and-support-plan.md)** — Workspace rollout plan, effort estimates, and temporary MUI v7 dual-support policy.
- **[MUI 9 migration checklist](./migrations/mui-9-migration-checklist.md)** — Tracked execution board: every discrete task, status, and owner field.
- **[Theming](./theming/)** — How to wire MUI v7 CSS variables mode in Next.js and React/Vite apps, plus the theming roadmap.
- **[Components](./components/)** — Per-component guides and planning notes.

## Install

```bash
npm install @littlebranches/giselle-mui
```

## Peer dependencies

```bash
npm install @mui/material @emotion/react @emotion/styled @iconify/react
```
