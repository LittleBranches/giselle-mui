import type { ButtonBaseProps } from '@mui/material/ButtonBase';

// ----------------------------------------------------------------------

export interface SelectableCardProps extends ButtonBaseProps {
  /**
   * Whether this card is in the selected/pressed state.
   * Maps to `aria-pressed` and applies a 2px ring shadow using `text.primary`.
   * @default false
   */
  selected?: boolean;
  // children is inherited from ButtonBaseProps — no redeclaration needed.
}
