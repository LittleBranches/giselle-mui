---
sidebar_label: "PR19 - ESLint styles extraction"
---

**[Merged](https://github.com/AlexRebula/giselle-mui/pull/19)** — [`chore/eslint-no-inline-sx`](https://github.com/AlexRebula/giselle-mui/tree/chore/eslint-no-inline-sx) — 4 May – 4 May 2026


# chore(eslint): enforce *.styles.ts extraction via no-restricted-syntax

## What

Adds an ESLint `no-restricted-syntax` rule that catches `sx={{...}}` objects with more than ~3 properties inline in component files, enforcing extraction to a co-located `*.styles.ts` file.

## Why

The `*.styles.ts` extraction convention was already documented in the copilot instructions but not machine-enforced. Without a lint rule, inline sx objects can silently creep back into component files during edits. This rule makes the convention part of the quality gate.

## Changes

- `eslint.config.mjs` — new `no-restricted-syntax` rule targeting large inline sx objects in `*.tsx` files

## Quality gate

All checks pass: Prettier ✓ · ESLint ✓ · tsc ✓ · Vitest (504/504) ✓ · tsup ✓ · Storybook ✓
