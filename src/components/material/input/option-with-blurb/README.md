# OptionWithBlurb

## Why it exists

Radio groups in forms often need to do more than present a bare label — each option requires
a short description that helps the user understand the difference before committing to a
choice (e.g. "Basic — public repositories only" vs "Pro — unlimited private repositories").
Without a shared component, developers assemble this by hand: a `FormControlLabel` wrapping
a `Radio`, a `Typography` blurb positioned next to it, optional icon placement, and custom
styling to make the whole card look like a selectable tile. The resulting markup is verbose,
inconsistent across forms, and hard to reuse. `OptionWithBlurb` collapses this into a single
radio card that accepts a label, a description, and an optional icon.

## Why it belongs in giselle-mui

Descriptive radio option cards appear in any multi-step form or plan-selection screen across
projects — onboarding flows, pricing pages, settings panels, wizard steps. The component
extends MUI's `Radio` directly, so it slots into any existing `RadioGroup` and
`FormControl` without extra wiring. It has no application-specific logic.

## Design decisions

TBD — filled in during implementation.

## Related

- [MUI Radio](https://mui.com/material-ui/react-radio-button/) — root element
- [MUI FormControlLabel](https://mui.com/material-ui/api/form-control-label/) — label/control pairing primitive

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `label: string` — primary option label displayed prominently
- `description?: string` — secondary descriptive text below the label
- `icon?: ReactNode` — optional icon slot shown beside the label
- All `RadioProps` (except `children`) — forwarded to the underlying MUI `Radio`

**Visual description:** A card-style radio option. The radio input appears on the leading
edge. The label is displayed in primary weight text; the description (when present) appears
below it in secondary/muted typography. The optional icon is displayed inline next to the
label. The entire card area should be clickable.

**Reference component substituted:** Custom radio card patterns used in form screens (no
single closed-source reference).

**Acceptance criteria:**
- [ ] Renders correctly with all required props
- [ ] `label` is always visible
- [ ] `description` renders below the label when provided, absent when not
- [ ] `icon` renders beside the label when provided
- [ ] Clicking the card toggles the radio selection state
- [ ] Works inside a MUI `RadioGroup` and participates in its value/onChange flow

## Phase

Phase: `E` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
