# IconActionBar

A horizontal row of `Tooltip` + `IconButton` pairs. Configurable via an `actions` array — each entry controls the tooltip label, icon slot, click handler, link target, disabled state, and tooltip placement.

---

## Why it exists

Toolbar rows of icon buttons appear throughout dashboard-style UIs: invoice detail pages, file managers, data tables, document viewers. The recurring implementation pattern is:

```tsx
<Box sx={{ gap: 1, display: 'flex' }}>
  <Tooltip title="Edit">
    <IconButton component={RouterLink} href={editHref}>
      <Icon icon="solar:pen-bold" />
    </IconButton>
  </Tooltip>
  <Tooltip title="Delete">
    <IconButton onClick={onDelete}>
      <Icon icon="solar:trash-bin-trash-bold" />
    </IconButton>
  </Tooltip>
</Box>
```

Getting this right involves a non-obvious detail: MUI's `Tooltip` requires its child to be able to hold a `ref`. When `disabled={true}` is set on `IconButton`, MUI does not forward the ref, so the tooltip silently stops working. The fix is to wrap the `IconButton` in a `<span>` — this component does that automatically for every action item.

---

## Why it belongs here

- Solves a silent ref-forwarding bug (`Tooltip` + disabled `IconButton`) that every consumer must otherwise rediscover.
- Encodes the `<span>` wrapper rule, the `aria-label` fallback, and the `href` + `component` forwarding pattern in one place.
- The `actions` array API is the natural shape for this pattern and is non-trivial to design correctly (key strategy, disabled handling, polymorphic component prop).

---

## Design decisions

### `<span>` wrapper inside `Tooltip`

MUI `Tooltip` requires a child that can hold a forwarded `ref`. `IconButton` with `disabled={true}` does not satisfy this. Wrapping in `<span>` is the [official MUI recommendation](https://mui.com/material-ui/react-tooltip/#disabled-elements) and this component applies it unconditionally so consumers never hit the silent failure.

### `aria-label` defaults to `tooltip`

The tooltip label is the natural accessible name for an icon-only button. Providing a separate `aria-label` is optional — when omitted the `tooltip` value is used. When an explicit label is provided (e.g. `'Download invoice PDF'`), it takes precedence over the tooltip text.

### `component` + `href` forwarding

For link-buttons (e.g. edit navigates to an edit page), pass `component={RouterLink}` (or any link element) alongside `href`. Both props are forwarded to `IconButton`. The component itself has no router dependency.

### Default actions

When `actions` is not provided the bar renders five standard document toolbar actions: **Edit, View, Print, Send, Share** — the same set used in the invoice toolbar reference. Icons use `GiselleIcon` with Solar icon identifiers. Consumers replace these by passing their own `actions` array.

### Key strategy

Items are keyed by `"${tooltip}-${index}"`. Tooltip values should be unique within a bar; the index suffix prevents duplicate-key warnings if two items share a tooltip.

---

## Library safety

- No router dependency — `component` is a generic `React.ElementType`.
- No icon library imported at the call site — the `icon` prop is `ReactNode`.
- Only `@mui/material` peer dependencies (`Box`, `Tooltip`, `IconButton`).
- Internal default actions use `GiselleIcon` (same package — not an external icon library import).

---

## File structure

```
src/components/icon-action-bar/
  icon-action-bar.tsx   — component, Props interface, DEFAULT_ICON_ACTIONS
  index.ts              — barrel
  README.md             — this file
  icon-action-bar.test.ts
```

---

## Related

- `GiselleIcon` — fills the `icon` slot
- `SelectableCard` — another interaction-first component that wraps an MUI primitive
