import type { PaperProps } from '@mui/material/Paper';

// ----------------------------------------------------------------------

export type QuoteColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

export interface QuoteCardProps extends PaperProps {
  /** The full text of the quote. Rendered in italics inside the card body. */
  quote: string;
  /**
   * Attribution name displayed below the quote, e.g. `"Jane Smith"`.
   * Omit to hide the attribution row entirely.
   */
  author?: string;
  /**
   * Source or context label displayed next to the author, e.g. `"Platform Team"`.
   * A separator dot is only rendered when both `author` and `source` are present.
   */
  source?: string;
  /**
   * Accent color key applied to the background tint, border, and decorative quote mark.
   * Accepts any MUI palette color key.
   * @default 'primary'
   */
  color?: QuoteColor;
}
