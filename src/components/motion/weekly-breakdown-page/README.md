# WeeklyBreakdownPage

## Why it exists

A weekly summary screen needs a consistent page-level structure: a header with the week
label, a slot for a period navigation strip, and a main content area that hosts one or
more breakdown views. Without a shared component, each screen that shows a weekly
breakdown reinvents this layout — inconsistent header treatment, different spacing, and
no shared slot contract for swapping between breakdown view types (carousel, expanding,
stacked).

## Why it belongs in giselle-mui

A time-period breakdown page is a recurring layout pattern in any app that works with
weekly or periodic data — trackers, planners, reporting tools, and dashboards all have
at least one screen shaped this way. The component owns the page scaffold only; the
breakdown view type, the period navigation, and all data rendering are supplied by the
caller via `children` and props.

## Design decisions

TBD — filled in during implementation.

## Related

- [BreakdownCarouselView](../breakdown-carousel-view/README.md) — carousel breakdown view composable inside this page
- [BreakdownExpandingView](../breakdown-expanding-view/README.md) — expanding breakdown view composable inside this page
- [BreakdownStackedView](../breakdown-stacked-view/README.md) — stacked breakdown view composable inside this page
- [ExpandingPeriodStrip](../expanding-period-strip/README.md) — period navigation strip for the page header
- [PeriodDetailSheet](../period-detail-sheet/README.md) — detail sheet triggered from within this page

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `weekLabel?: string` — week label rendered in the page header, e.g. `'Week of 12 May 2026'`
- `children?: ReactNode` — the main content area; intended to host a breakdown view component
- `sx?: SxProps<Theme>` — forwarded to the root element

**Visual description:** A full-page layout with a sticky or fixed header containing the
week label and (optionally) a period navigation strip. Below the header is a scrollable
content area where the caller renders one of the breakdown view components. The page
manages top padding so content is not obscured by the header. No data is fetched or
managed internally; this is a pure layout shell.

**Reference component substituted:** Closed-source weekly breakdown page shell used across
time-tracking and reporting screens.

**Acceptance criteria:**
- [ ] Renders correctly with no required props (all optional)
- [ ] `weekLabel` is displayed in the page header when provided
- [ ] `children` is rendered in the main content area
- [ ] Content area is not obscured by the header at any scroll position
- [ ] `sx` prop is forwarded to the root element
- [ ] Passes existing unit test in `weekly-breakdown-page.test.ts`

## Phase

Phase: `I-D` | Priority tier: `T3`

_Compliance standard: [documentation-strategy.md](../../docs/documentation-strategy.md)_
