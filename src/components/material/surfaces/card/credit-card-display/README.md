# CreditCardDisplay

## Why it exists

Banking and wallet dashboards frequently render a visual representation of a payment card showing the masked card number, cardholder name, expiry date, and network logo. Without this component, developers wire up a styled `Box` or `Paper` with manual masking logic (`cardNumber.slice(-4)` with bullet characters for the hidden digits), a custom network logo slot, and custom typography layout — code that is easy to get wrong (accidentally exposing full card numbers) and must be reproduced on every screen that shows card details.

## Why it belongs in giselle-mui

The credit card display pattern appears in any product that involves payment methods: banking apps, wallet screens, subscription management, and checkout flows. The masking behaviour (exposing only the last 4 digits) is a security concern that belongs in a shared component rather than in ad-hoc consumer code. The network logo slot keeps the component generic — consumers supply their own Visa, Mastercard, or Amex logo without the component having any brand knowledge baked in.

## Design decisions

TBD — filled in during implementation.

## Related

- [BalanceSummaryCard](../balance-summary/README.md) — typically shown above or alongside card details in a banking dashboard
- [QuickTransferCard](../quick-transfer/README.md) — another payment-context surface often co-located with card display

## Build spec
> Remove this section once the component ships.

**Props / types:**
- `cardNumber: string` — full card number string; only the last 4 digits are displayed, the rest are masked
- `cardHolder: string` — name printed on the card
- `expiry: string` — expiry date string (e.g. `'08/26'`)
- `networkLogo?: ReactNode` — card network logo slot (pass an `<img>` or SVG); omitted when not provided
- `sx?: SxProps<Theme>` — MUI sx forwarded to the root element
- Does not extend `PaperProps` — uses a standalone styled root

**Visual description:** A card-shaped surface (rounded corners, gradient or solid background) that resembles a physical payment card. The masked card number is rendered in groups, with only the last 4 digits visible. The cardholder name and expiry date appear at the bottom. The network logo, if provided, is positioned in the top-right corner.

**Reference component substituted:** Replaces bespoke `BankingCreditCard` or `PaymentCardWidget` components found in MUI banking and fintech paid templates.

**Acceptance criteria:**
- [ ] Renders correctly with all required props (`cardNumber`, `cardHolder`, `expiry`)
- [ ] Only the last 4 digits of `cardNumber` are ever rendered to the DOM; all other digits are replaced with masked characters
- [ ] `networkLogo` slot renders any ReactNode in the designated position; omitted when prop is absent
- [ ] `expiry` is displayed verbatim without transformation
- [ ] Component accepts and applies `sx` to the root element

## Phase

Phase: `H-G1` | Priority tier: `T3`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
