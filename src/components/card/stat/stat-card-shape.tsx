// ----------------------------------------------------------------------

/**
 * Independent geometric decoration — two overlapping rotated rounded squares.
 * Uses `currentColor` so the shapes inherit the card's `color.dark` palette token
 * without any hardcoded hex values. Purely decorative: aria-hidden on the parent Box.
 *
 * Design note: colours follow MUI semantic conventions (not the mango visual palette).
 * The shapes are written from scratch — not derived from any third-party asset.
 */
export function StatCardShape() {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="14"
        y="14"
        width="80"
        height="80"
        rx="16"
        transform="rotate(15 54 54)"
        fill="currentColor"
        fillOpacity="0.16"
      />
      <rect
        x="32"
        y="32"
        width="56"
        height="56"
        rx="12"
        transform="rotate(-8 60 60)"
        fill="currentColor"
        fillOpacity="0.1"
      />
    </svg>
  );
}
