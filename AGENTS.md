# Agent Brief — giselle-mui

Read this file first. It tells you what to read next and in what order before touching anything.

---

## 1. Required reading before building any component

Work through these in order — each document gates the next:

1. **`docs/components/cleanup-workflow.md`** — step-by-step build and cleanup playbook. Phase 0 decides whether a component is a sub-component or standalone; that decision shapes everything else.
2. **`docs/components/api-design-rules.md`** — governs every component API, prop interface, and JSDoc. Defines the tier system (Tier 1 / 2 / 3) and what each tier requires.
3. **`docs/naming-conventions.md`** — PascalCase component names, kebab-case folder names, one component per folder. Non-negotiable.

---

## 2. Current build state

`docs/component-compliance.md` — tracks README, JSDoc, Story JSDoc, and Roadmap compliance per component. Check it before starting work so you know what is already done and what is still outstanding.

---

## 3. Docs entry point

`docs/README.md` — full documentation navigation. Go here to find any doc not linked directly above.

---

## 4. Per-component files

Every component ships two files alongside its source:

- `README.md` — Build Spec (props, variants, usage, constraints)
- `roadmap.md` — open items, planned variants, known gaps

Read both before building or modifying a component.

---

## 5. Quality gate

Run `npm run check:verify` before opening any PR. The pre-push hook enforces this automatically — a push will fail if the gate does not pass.
