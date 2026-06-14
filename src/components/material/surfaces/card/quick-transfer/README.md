# QuickTransferCard

## Why it exists

Banking and wallet dashboards often include a card where a user can pick a contact, enter an amount, and trigger a transfer in a single interaction. Without this component, developers manually assemble a Paper with a horizontally scrollable avatar list, selection state management, an amount input, and a submit button wired to a callback — repeating that interaction pattern every time a peer-to-peer payment or quick send feature appears in the UI.

## Why it belongs in giselle-mui

The quick-transfer widget — scrollable contact selector, optional balance display, amount input, submit CTA — is a generic payment interaction pattern that recurs in fintech apps, expense-sharing tools, wallet UIs, and internal transfer screens. The component owns no payment logic; it surfaces a selected contact ID and entered amount to the consumer via `onTransfer`, keeping it domain-neutral.

## Design decisions

TBD — filled in during implementation.

## Related

- [BalanceSummaryCard](../balance-summary/README.md) — typically shown above a quick transfer card to give the user balance context before initiating a transfer
- [CreditCardDisplay](../credit-card-display/README.md) — companion payment-context surface often co-located with transfer widgets

## Build spec
> Remove this section once the component ships.

**Props / types:**
- `contacts: QuickTransferContact[]` — selectable contacts; each has `id`, `name`, and optional `avatarSrc`
- `balance?: string` — formatted balance string to display before transfer (e.g. `'$5,000'`)
- `submitLabel?: string` — transfer button label; defaults to `'Transfer now'`
- `onTransfer?: (contactId: string, amount: string) => void` — called with the selected contact ID and the entered amount string when the user submits
- Extends `PaperProps` (minus `children`)

**Visual description:** A Paper card displaying an optional balance figure at the top. Below it is a horizontally scrollable row of avatar chips representing selectable contacts — tapping/clicking one highlights it as selected. Beneath the contact row is an amount input field and a full-width submit button labelled with `submitLabel`. The selected contact avatar is visually distinguished (e.g. ring or scale) from unselected ones.

**Reference component substituted:** Replaces bespoke `BankingQuickTransfer` or `SendMoneyWidget` components found in MUI banking dashboard templates.

**Acceptance criteria:**
- [ ] Renders correctly with the required `contacts` prop
- [ ] Contacts are displayed in a horizontally scrollable row
- [ ] Selecting a contact highlights it visually; only one contact is selected at a time
- [ ] `balance` is displayed when provided; omitted when absent
- [ ] Submit button label defaults to `'Transfer now'` when `submitLabel` is not set
- [ ] `onTransfer` is called with the selected `contactId` and the current amount input value on submit
- [ ] Component forwards `sx` and all remaining `PaperProps` to the root element

## Phase

Phase: `H-G4` | Priority tier: `T2`

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
