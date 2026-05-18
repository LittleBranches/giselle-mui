import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface ExpenseCategoryGroupProps {
  /** Category heading, e.g. 'Flights' or 'CAPEX'. */
  label: string;
  total: number | string;
  currency?: string;
  /** MUI palette key for the category accent colour. @default 'primary' */
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  /** `ExpenseLineItem` children. */
  children?: ReactNode;
  sx?: SxProps<Theme>;
}
