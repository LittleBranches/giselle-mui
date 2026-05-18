import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface AmortizationTableProps {
  title: string;
  totalCost: number;
  /** Column header for the period axis, e.g. 'Month' or 'Quarter'. */
  periodLabel: string;
  /** Total number of amortization periods. */
  periods: number;
  currency?: string;
  /** Optional bar chart slot showing the amortization curve. */
  chart?: ReactNode;
  sx?: SxProps<Theme>;
}
