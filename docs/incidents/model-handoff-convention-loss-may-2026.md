# Incident: Convention loss during model switch — May 2026

> Date: 17 May 2026
> Detected in: PR #53 `chore/scaffold-component-tree`
> Root cause: verbal convention not committed to `copilot-instructions.md`

---

## What happened

During PR #53 review, Storybook story titles were found to be inconsistent. Some stories
used the new full-path taxonomy (`Material/Surfaces/Cards/Stat`) while others retained
the old flat taxonomy (`Cards/Stat`).

The cause was a model switch. Copilot (the primary model) had agreed in conversation to
a new convention — Storybook `title` values must mirror the `src/components/` folder
path exactly, one-to-one. This decision was never written back into `copilot-instructions.md`.

When Claude was used as a replacement (Copilot weekly credit exhausted), it read
`copilot-instructions.md` and followed it faithfully. The file still described the old
flat taxonomy. Neither model made a mistake. The process had a gap.

**Root cause in one sentence:** the conversation was the source of truth, not the file.

---

## The convention that was missed

Storybook `title` must mirror the `src/components/` folder path exactly:

```
src/components/material/surfaces/card/stat/   → 'Material/Surfaces/Cards/Stat'
src/components/chart/radial-progress/         → 'Chart/Radial Progress'
src/components/motion/floating-side-nav/      → 'Motion/Floating Side Nav'
```

Rule: folder path = story title. If they ever disagree, fix the story title — never the folder.

This was agreed with Copilot during the folder restructure but not committed to
`copilot-instructions.md` at the time.

---

## How to prevent this permanently

### Rule 1 — commit every decision in the same session

Every convention agreed in conversation must be written into `copilot-instructions.md`
before the session closes. Not later. Not "I'll remember." In the same session.

Closing question for every productive session:
> "Before we close — did we decide anything today that isn't in `copilot-instructions.md` yet?"

Three types of decisions that must always be written down immediately:

| Type | Example from this incident |
|---|---|
| Convention changed | "Storybook titles now mirror folder paths" |
| Old rule abolished | "The flat `Cards/Stat` pattern is no longer used" |
| New rule adopted | "The canonical group map is now the folder tree" |

### Rule 2 — enforce conventions in CI, not just in documentation

Documentation can be missed. A failing CI check cannot.

Add `scripts/check-story-titles.js` to the quality gate:

1. Find every `*.stories.tsx` file under `src/`
2. Extract the `title:` value from the `meta` object
3. Derive the expected title from the file path using the taxonomy mapping
4. Fail with a clear error if they disagree

Example output on failure:
```
✗ src/components/material/surfaces/card/stat/stat-card.stories.tsx
  Expected: 'Material/Surfaces/Cards/Stat'
  Actual:   'Cards/Stat'
```

Once wired into `npm run check:verify`, no model, contributor, or rushed commit can
drift from the taxonomy without CI catching it first.

---

## Why the domain-first folder structure is correct

The folder structure follows the **domain-first (feature-first) pattern** — the same
taxonomy used by MUI Core itself (`inputs/`, `navigation/`, `surfaces/`, `data-display/`,
`feedback/`, `layout/`). This is industry standard for component libraries at scale:

| Library | Pattern |
|---|---|
| MUI Core | Domain-first — mirrors this library's structure |
| Shopify Polaris | Domain-first — `actions/`, `layout/`, `navigation/`, `feedback/` |
| Ant Design | Domain-first — `data-display/`, `data-entry/`, `navigation/` |
| Radix UI | Domain-first — each primitive in its own named folder |

The flat alternative (all components in one folder) breaks at 50+ components — discovery
becomes a search problem. Domain-first keeps it navigable at any size.

Mirroring the folder taxonomy in Storybook navigation is also standard practice. Shopify
Polaris, MUI's own Storybook, and IBM Carbon all use the same grouping in Storybook as
in their source tree. One taxonomy to learn, two places it appears.

---

## Action items (open)

- [ ] Update "Storybook title grouping convention" section of `copilot-instructions.md`
      Replace the old flat group map with the folder-mirrors-title rule
- [ ] Add `scripts/check-story-titles.js` and wire into `npm run check:verify`
- [ ] Fix remaining stories with old flat titles:
      MetricCard, TimelineTwoColumn, TimelineCompact, FloatingSubNav, TaskList, FaqSection

---

## Related

- PR #53 — `chore/scaffold-component-tree` (where this was detected)
- `.github/copilot-instructions.md` lines 626–652 — section to update
- `scripts/check-structure.js` — reference implementation for the new guard script
