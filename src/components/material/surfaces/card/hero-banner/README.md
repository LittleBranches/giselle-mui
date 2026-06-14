# HeroBannerCard

## Why it exists

Dashboard home screens and onboarding flows frequently use a wide promotional banner to surface a key message, welcome a user, or highlight a primary action. Without this component, developers assemble a Paper with a two-column layout — text on the left with a title, subtitle, description, and CTA button; an illustration on the right — and repeat that structure across every dashboard home and marketing section they build. Maintaining consistent spacing, responsive collapse, and illustration sizing becomes bespoke work each time.

## Why it belongs in giselle-mui

The hero banner pattern — headline, supporting text, primary CTA, decorative illustration — is a layout primitive used in SaaS dashboards, onboarding wizards, feature announcement panels, and marketing surfaces. The illustration and CTA are consumer-supplied slots; the component owns only the layout and typography scale, making it reusable across any product category.

## Design decisions

TBD — filled in during implementation.

## Related

- [FeaturedItemCard](../featured-item/README.md) — a compact vertical card for individual items, as opposed to the full-width banner pattern
- [PromoInviteCard](../promo-invite/README.md) — promotional surface focused on email capture rather than headline messaging

## Build spec
> Remove this section once the component ships.

**Props / types:**
- `title: string` — primary headline text
- `subtitle?: string` — secondary line above or below the title
- `description?: string` — body copy rendered beneath the headline block
- `action?: ReactNode` — CTA button slot (pass a MUI `<Button>`)
- `illustration?: ReactNode` — decorative image or SVG rendered on the right side of the banner
- Extends `PaperProps` (minus `children`)

**Visual description:** A wide Paper card laid out in two columns. The left column contains the title, optional subtitle, optional description paragraph, and the optional action button. The right column contains the optional illustration element, positioned to the right and typically vertically centred or bottom-aligned. On narrow viewports the layout collapses to a single column with the illustration hidden or stacked below the text.

**Reference component substituted:** Replaces bespoke `AppWelcomeBanner`, `DashboardHeroBanner`, or `FeatureAnnouncementCard` patterns found in MUI admin dashboard templates.

**Acceptance criteria:**
- [ ] Renders correctly with only the required `title` prop
- [ ] `subtitle` renders in a visually distinct secondary style when provided
- [ ] `description` paragraph is rendered below the headline block when provided
- [ ] `action` slot renders any ReactNode; omitted when absent
- [ ] `illustration` slot renders any ReactNode in the right column; omitted when absent
- [ ] Component forwards `sx` and all remaining `PaperProps` to the root element

## Phase

Phase: `H-G5` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
