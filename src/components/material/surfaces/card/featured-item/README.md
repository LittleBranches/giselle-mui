# FeaturedItemCard

## Why it exists

Product, content, and marketplace UIs regularly need a card that leads with a large image, overlays a badge (e.g. "NEW" or "FEATURED"), shows a title and description, and ends with a call-to-action button. Without this component, developers hand-wire a Paper with custom image positioning, absolute-positioned badge markup, text truncation styles, and a button slot — repeating the same structure across product listings, article highlights, course cards, and similar surfaces.

## Why it belongs in giselle-mui

The featured-item card pattern — top image with optional badge, title, description, CTA — is a staple of any app that surfaces highlighted content or products: e-commerce storefronts, learning management systems, content platforms, and marketing landing sections. All domain-specific content (image, badge text, title, CTA handler) is passed as props or slots, so the component carries no product-specific logic.

## Design decisions

TBD — filled in during implementation.

## Related

- [HeroBannerCard](../hero-banner/README.md) — a wider promotional banner variant that pairs text and illustration side by side rather than stacking image over content
- [PromoInviteCard](../promo-invite/README.md) — promotional surface focused on email capture rather than item showcase

## Build spec
> Remove this section once the component ships.

**Props / types:**
- `title: string` — item name or headline
- `description?: string` — supporting body text below the title
- `badge?: string` — label overlaid on the image (e.g. `'NEW'`, `'FEATURED'`); omitted when not provided
- `image: ReactNode` — image slot filling the top of the card (pass `<img src=... />` or any ReactNode)
- `action?: ReactNode` — CTA button slot at the bottom (pass a MUI `<Button>`)
- Extends `PaperProps` (minus `children`)

**Visual description:** A vertically stacked Paper card. The top portion is occupied by the `image` slot at full card width; when `badge` is provided it renders as a chip or label absolutely positioned over the image corner. Below the image are the title, optional description text, and the optional action button aligned to the bottom of the card.

**Reference component substituted:** Replaces bespoke `ProductCard`, `CourseCard`, or `FeaturedItemWidget` components common in MUI e-commerce and content dashboard templates.

**Acceptance criteria:**
- [ ] Renders correctly with all required props (`title`, `image`)
- [ ] `badge` is overlaid on the image when provided; no badge element is rendered when absent
- [ ] `description` text is rendered below the title when provided
- [ ] `action` slot renders any ReactNode in the card footer; omitted when absent
- [ ] `image` slot renders any ReactNode without overflowing the card bounds
- [ ] Component forwards `sx` and all remaining `PaperProps` to the root element

## Phase

Phase: `H-G5` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
