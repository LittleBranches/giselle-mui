import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface BudgetItem {
  label: string;
  amount: number;
  percentage?: number;
  /** MUI palette key for the category colour indicator. @default 'primary' */
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
}

export interface BudgetBreakdownCardProps {
  title: string;
  total: number | string;
  currency?: string;
  items: BudgetItem[];
  /** Optional donut chart slot rendered alongside the breakdown rows. */
  chart?: ReactNode;
  sx?: SxProps<Theme>;
}
