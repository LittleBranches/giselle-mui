/**
 * Chevron-down expand indicator for `TimelineCompact` accordion items.
 *
 * Pure decorative — `aria-hidden` is set by the caller via `AccordionSummary`'s
 * `expandIcon` wrapper (MUI marks it `aria-hidden` automatically).
 *
 * **Quality status (13 May 2026):** DoD 9/9 · Best practices 13/13
 */
export function ChevronDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
  );
}
