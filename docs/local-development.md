# Local development guide

> _Last updated: May 2026_

This guide is for developers who work on `@littlebranches/giselle-mui` alongside a
Next.js consumer app (e.g. the `alexrebula` portfolio) and want to see changes in
both places without a manual publish step every time.

---

## Overview

There are two development modes:

| Mode                     | Setup                                                       | HMR                         | Build needed?                      |
| ------------------------ | ----------------------------------------------------------- | --------------------------- | ---------------------------------- |
| **Storybook-only**       | `npm run storybook` inside this repo                        | ✅ Yes                      | No                                 |
| **Live consumer (yalc)** | Consumer installs the built dist from your local yalc store | ❌ No — push on each change | Yes — `npm run build && yalc push` |

**Storybook is the primary development environment.** Build a component there first,
fully, with tests passing. Then push to the consumer when it is ready.

---

## Prerequisites

- `yalc` installed globally: `npm install -g yalc`
- `giselle-mui` and `alexrebula` cloned to your machine (any layout — no relative path requirement)

---

## Mode 1 — Storybook-only (preferred)

The fastest loop for building or changing a component in isolation.

```bash
cd giselle-mui
npm install
npm run storybook      # opens http://localhost:6006
```

Edit any file in `src/`. Storybook's HMR picks it up immediately.  
No build. No consumer. No yalc. Just write the component and its story.

**Use this for:**

- Building a new component from scratch
- Tweaking styles, props, or ARIA behaviour
- Running visual regression checks across all variant combinations
- Writing and running unit tests (`npm test`)

---

## Mode 2 — Live consumer via yalc

When a component is ready and you want to test it inside the real app:

### One-time consumer setup

```bash
# in alexrebula (already done — no action needed if you cloned the repo)
# @littlebranches/giselle-mui is already installed via yalc
```

### Day-to-day update loop

```bash
# in giselle-mui — after any change you want to test in the consumer
npm run build && yalc push
```

`yalc push` copies the updated dist into the consumer's `node_modules` and notifies the
Turbopack dev server. You may need to do a hard refresh (Ctrl+Shift+R) or a single
restart if Turbopack does not pick up the module change automatically.

### Full consumer startup (first time or after a clean checkout)

```bash
# Terminal A — library (Storybook — optional)
cd giselle-mui
npm run storybook

# Terminal B — portfolio
cd alexrebula
npm run dev            # Turbopack on http://localhost:8082
```

---

## What triggers a yalc push vs. nothing

| Change                                                  | Action needed                                                  |
| ------------------------------------------------------- | -------------------------------------------------------------- |
| Edit existing component `.tsx`                          | `npm run build && yalc push`                                   |
| Edit existing utility in `src/utils/`                   | `npm run build && yalc push`                                   |
| Add a new component + export to `src/index.ts`          | `npm run build && yalc push`, then hard refresh                |
| Change `tsconfig.json` or `package.json` in giselle-mui | `npm run build && yalc push`, then restart consumer dev server |

**Rule of thumb:** any change to `src/` requires a build + push. The consumer does not watch giselle-mui source files — it installed the dist.

---

## When to build dist vs. when not to

| Scenario                             | Build needed?                        |
| ------------------------------------ | ------------------------------------ |
| Developing in Storybook only         | No                                   |
| Testing in the consumer app via yalc | Yes — `npm run build && yalc push`   |
| Publishing a release to npm          | Yes — `npm run build && npm publish` |
| Running unit tests locally           | No                                   |

---

## Adding a new component — checklist

1. Create files in `src/components/<name>/`
2. Add export to `src/components/<name>/index.ts`
3. Add re-export to `src/index.ts`
4. Write the story in `src/components/<name>/<name>.stories.tsx`
5. Run `npm test` — all tests must pass
6. Run `npm run check:verify` — quality gate must be green
7. Run `npm run build && yalc push` to push to the consumer
8. Navigate to the relevant page in the consumer and verify

---

## Publishing a release to npm

```bash
# in giselle-mui
npm run build                   # produce dist/
npm run check:verify            # quality gate must be green
npm version patch               # or minor / major — updates package.json version
npm publish                     # pushes to npmjs.com (public — publishConfig.access:public)
```

After publishing, switch the consumer from yalc to the real package:

```bash
# in alexrebula
yalc remove @littlebranches/giselle-mui
npm install @littlebranches/giselle-mui
```

To go back to yalc for development after a release:

```bash
# in alexrebula
npm uninstall @littlebranches/giselle-mui
yalc add @littlebranches/giselle-mui
```

---

## Why yalc instead of npm link or a junction?

`npm link` and Windows junctions both work by creating a symlink/junction in
`node_modules` pointing back to the source directory. This causes two problems:

1. **Duplicate module instances** — the linked package has its own `node_modules`, so
   webpack sees two copies of `@mui/material`, `@emotion/react`, etc. Two copies means
   two independent React contexts → `theme.vars` undefined → runtime crash.

2. **Turbopack refuses junctions** — Turbopack sandboxes compilation to the project root.
   Files outside the root (followed via junction) are rejected.

`yalc` copies the built dist into the consumer's `node_modules` as real files — no
symlink, no junction, one `node_modules` tree. Turbopack works, MUI contexts are shared,
no webpack config hacks needed.
