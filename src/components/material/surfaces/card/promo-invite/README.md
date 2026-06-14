# PromoInviteCard

## Why it exists

Marketing and referral surfaces in web apps frequently need a compact card with a headline, a short pitch, an email input, and a submit button. Without this component, developers wire a Paper, manage the input state locally, handle the submit callback, style the input and button together, and repeat the same controlled-input boilerplate across every invite, waitlist, or referral widget in the product.

## Why it belongs in giselle-mui

The email-capture card pattern — headline, optional description, email input, submit CTA — is a generic marketing widget that appears in referral programs, waitlist signups, newsletter prompts, and partner invite flows. The component exposes only its `onSubmit` callback with the collected email address; no network logic or product-specific behaviour is baked in, making it reusable in any project.

## Design decisions

TBD — filled in during implementation.

## Related

- [HeroBannerCard](../hero-banner/README.md) — broader promotional banner that focuses on messaging rather than email capture
- [FeaturedItemCard](../featured-item/README.md) — promotional surface focused on highlighting an item rather than collecting contact info

## Build spec
> Remove this section once the component ships.

**Props / types:**
- `title: string` — card headline
- `description?: string` — supporting body text beneath the title
- `inputPlaceholder?: string` — placeholder text for the email input; defaults to `'Enter your email'`
- `submitLabel?: string` — submit button label; defaults to `'Invite Now'`
- `onSubmit?: (email: string) => void` — called with the email string when the user submits; the component owns no network logic
- Extends `PaperProps` (minus `children` and `onSubmit` to avoid DOM conflict)

**Visual description:** A Paper card with a title at the top, an optional description paragraph below it, then an inline row containing a text input and a submit button. The email input occupies the majority of the row width; the submit button is right-aligned. On submission the component calls `onSubmit` with the current input value; clearing the input after submission is an implementation detail to decide during build.

**Reference component substituted:** Replaces ad-hoc inline invite or newsletter signup widgets commonly built one-off in marketing and referral sections of MUI-based apps.

**Acceptance criteria:**
- [ ] Renders correctly with the required `title` prop
- [ ] `description` is rendered beneath the title when provided; omitted when absent
- [ ] Input placeholder defaults to `'Enter your email'` when `inputPlaceholder` is not set
- [ ] Submit button label defaults to `'Invite Now'` when `submitLabel` is not set
- [ ] `onSubmit` is called with the current email input value when the form is submitted
- [ ] Component forwards `sx` and all remaining `PaperProps` to the root element

## Phase

Phase: `H-G5` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
