import type { ReactNode } from 'react';
import type { PaperProps } from '@mui/material/Paper';

// ----------------------------------------------------------------------

export interface BudgetItem {
  label: string;
  amount: number;
  percentage?: number;
  /** MUI palette key for the category colour indicator. @default 'primary' */
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
}

export interface BudgetBreakdownCardProps extends Omit<PaperProps, 'children'> {
  title: string;
  total: number | string;
  currency?: string;
  items: BudgetItem[];
  /** Optional donut chart slot rendered alongside the breakdown rows. */
  chart?: ReactNode;
}
