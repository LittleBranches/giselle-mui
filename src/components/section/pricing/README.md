# PricingSection

## Why it exists

Pricing pages require a consistent plan-comparison layout: a header with optional gradient title, a billing period toggle, and a grid of plan cards each showing price, features (with check/cross icons), and a CTA. Building this from scratch per project means re-implementing the same card grid, feature list, and highlight-accent pattern repeatedly.

## Why it belongs in giselle-mui

The pricing section layout is a standard marketing page pattern reusable across any SaaS or subscription product. The plan data shape (`PricingPlan[]`) is generic — no app-specific fields.

## Design decisions

TBD — filled in during implementation.

## Related

- [SectionTitle](../../layout/section-title/README.md) — used for the caption/title/gradient header slot

## Build spec

> Remove this section once the component ships.

**Props / types:**
- `caption` — small label above the title
- `title` — section heading
- `txtGradient` — gradient-accent word appended after `title`, rendered with a CSS gradient span
- `plans: PricingPlan[]` — array of plan objects; each has `id`, `name`, `price`, `period`, `description`, `features: PricingFeature[]`, `cta`, `ctaHref`, `highlighted`
- `billingToggle` — slot for a monthly/annual toggle control (any ReactNode)
- `PricingFeature.included` — when false, renders a cross icon instead of a check; defaults to true

**Visual description:** Centred section header (caption + title + gradient word), optional billing toggle below, then a responsive grid of plan cards. The `highlighted` plan has a visual accent (border or background). Each card shows name, price+period, description, feature checklist, and CTA button.

**Reference component substituted:** Proprietary `PricingView` / `PlanCard` patterns from closed-source dashboard templates.

**Acceptance criteria:**
- [ ] Renders all plans passed via `plans` prop
- [ ] `highlighted: true` plan renders with a visible visual accent distinct from non-highlighted plans
- [ ] `PricingFeature` with `included: false` renders a cross icon
- [ ] `billingToggle` slot renders any ReactNode without layout interference
- [ ] `txtGradient` word renders with a CSS gradient on its span element
- [ ] All optional props can be omitted without errors
- [ ] `sx` prop forwarded to root `Box`

## Phase

Phase: `J` | Priority tier: `T3`

_Compliance standard: [documentation-strategy.md](../../../docs/documentation-strategy.md)_
