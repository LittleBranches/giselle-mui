# ProfileSummaryCard

## Why it exists

Admin panels, team directories, and social platforms routinely display a compact user card combining an avatar, name, role, and a small set of headline stats (post count, followers, projects completed, etc.). Without this component, developers hand-wire a Paper with an avatar, stack two typography elements for name and role, then manually lay out stat cells in a grid — repeating that identical structure for every profile surface in the app.

## Why it belongs in giselle-mui

The profile summary card pattern — avatar, name, role, stat row — is a horizontal layout primitive that recurs in team management tools, CRM dashboards, community platforms, HR systems, and any app that surfaces user entities. The stat array is fully consumer-defined; the component owns only the layout and avatar integration, making it applicable across any domain without modification.

## Design decisions

TBD — filled in during implementation.

## Related

- [BalanceSummaryCard](../balance-summary/README.md) — summary card for financial data rather than user identity
- [HeroBannerCard](../hero-banner/README.md) — wider surface used for user-facing welcome panels that may also surface profile context

## Build spec
> Remove this section once the component ships.

**Props / types:**
- `name: string` — user display name
- `role?: string` — role or title rendered beneath the name
- `avatarSrc?: string` — URL for the avatar image; MUI Avatar fallback initials are used when absent
- `stats: ProfileStat[]` — headline figures displayed in a row; each has `label` and `value`
- Extends `PaperProps` (minus `children`)

**Visual description:** A Paper card with a centred avatar at the top, the user's name in a prominent typography style below it, an optional role label in a secondary style, then a horizontal row of stat cells separated by dividers. Each stat cell shows a numeric or text value above a label. The layout is compact enough to be used in a sidebar or a grid of team member cards.

**Reference component substituted:** Replaces bespoke `UserProfileCard`, `TeamMemberCard`, or `ProfileWidget` patterns common in MUI admin and social dashboard templates.

**Acceptance criteria:**
- [ ] Renders correctly with all required props (`name`, `stats`)
- [ ] `avatarSrc` is passed to MUI Avatar when provided; Avatar falls back to initials when absent
- [ ] `role` is rendered beneath the name when provided; omitted when absent
- [ ] Each `ProfileStat` renders its `label` and `value` in a separate cell
- [ ] Multiple stats are displayed in a horizontal row with visual separation
- [ ] Component forwards `sx` and all remaining `PaperProps` to the root element

## Phase

Phase: `J` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
