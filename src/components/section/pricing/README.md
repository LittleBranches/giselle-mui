# PricingSection

## Why it exists

Marketing and SaaS sites need a pricing page that presents multiple plans side by side, highlights a recommended plan, lists feature availability per plan, and provides a CTA per plan. Building this from scratch requires managing a variable-length list of plan cards, feature rows with check/cross icons, highlighted card styling, an optional billing-period toggle, and gradient text on the heading. Without a shared component developers rebuild this structure for every project, resulting in inconsistent visual treatment and duplicated layout logic.

## Why it belongs in giselle-mui

Pricing sections are a standard page pattern common to any product or SaaS application. The component is driven entirely by a `plans` data array and a small set of presentation props — it contains no business logic, billing calculations, or application-specific routing. Any project that needs to display tiered pricing can use this component by supplying the plan data and a CTA handler.

## Design decisions

TBD — filled in during implementation.

## Related

- [section/faq](../faq/README.md) — complementary marketing section component
- [section/hero](../hero/README.md) — typically used above a pricing section on landing pages

## Build spec

> Remove this section once the component ships.

**Props / types:**

`PricingFeature`:

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `label` | `string` | — | Feature name displayed in the plan card's feature list |
| `included` | `boolean` | `true` | When `false`, renders a cross icon instead of a check icon |

`PricingPlan`:

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `id` | `string` | — | Stable key used by React for list rendering |
| `name` | `string` | — | Plan display name (e.g. "Free", "Pro") |
| `price` | `string` | — | Pre-formatted price string (e.g. `'$0'`, `'$29'`) |
| `period` | `string` | — | Billing period label (e.g. `'per month'`) rendered beneath the price |
| `description` | `string` | — | Short plan description displayed under the name |
| `features` | `PricingFeature[]` | — | Ordered list of features with inclusion status |
| `cta` | `string` | — | CTA button label |
| `ctaHref` | `string` | — | Optional href for the CTA button; omit for onClick-only usage |
| `highlighted` | `boolean` | `false` | Visually accents this plan card as the recommended option |

`PricingSectionProps`:

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `caption` | `string` | — | Small label rendered above the title (e.g. "Plans") |
| `title` | `string` | — | Section headline |
| `txtGradient` | `string` | — | Word appended after `title` with a CSS gradient applied to the span |
| `plans` | `PricingPlan[]` | — | Array of plan objects to render as cards |
| `billingToggle` | `ReactNode` | — | Slot for a billing period toggle (e.g. monthly/annual switch) |
| `...BoxProps` | — | — | All MUI `BoxProps` (except `children`) forwarded to the root element |

**Visual description:** A full-width section with an optional caption, title, and gradient-accented word at the top. Below the heading, an optional `billingToggle` slot is centred. Plan cards are displayed in a responsive grid row — equal-width cards on desktop, stacking on mobile. Each card shows the plan name, price, period, description, a feature list with check/cross icons per feature, and a CTA button. The `highlighted` card renders with a visual accent (elevated shadow, border, or background tint) to draw attention to the recommended plan. All spacing and typography follow the MUI theme.

**Reference component substituted:** App-specific pricing page sections that manually map over a plans array to render `Card` components with hardcoded feature lists, duplicated check/cross icon logic, and one-off highlighted card styles — rebuilt per project.

**Acceptance criteria:**
- [ ] Renders all plans from the `plans` array as cards in a responsive grid
- [ ] Each plan card displays `name`, `price`, `period`, `description`, `features`, and `cta`
- [ ] `PricingFeature` with `included: false` renders a cross icon; `included: true` (or omitted) renders a check icon
- [ ] The `highlighted` plan card receives a distinct visual accent treatment
- [ ] Only one plan can be `highlighted`; multiple highlighted plans are visually consistent (not a crash)
- [ ] `billingToggle` slot renders when provided and is omitted when not
- [ ] `txtGradient` appends a gradient-styled word after `title` when provided
- [ ] `caption` renders above the title when provided
- [ ] Root element forwards all `BoxProps` (excluding `children`) via spread
- [ ] Layout is responsive: single-column on mobile, multi-column grid on desktop
- [ ] `ctaHref` renders the CTA as an anchor when provided; falls back to a button otherwise
- [ ] Passes TypeScript strict-mode checks with no `any` casts
- [ ] Exported from the section barrel `index.ts`
- [ ] `pricing-section.test.ts` passes

## Phase

Phase: `J` | Priority tier: `T3`

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
