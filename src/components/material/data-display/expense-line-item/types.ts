import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface ExpenseLineItemProps {
  label: string;
  amount: number | string;
  description?: string;
  currency?: string;
  /** When true renders the amount in error (red) colour — e.g. a budget overrun. */
  overrun?: boolean;
  sx?: SxProps<Theme>;
}
