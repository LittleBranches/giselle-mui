import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface BalanceStat {
  label: string;
  value: string | number;
  trend?: number;
}

export interface BalanceAction {
  label: string;
  /** Icon slot — pass any ReactNode icon. */
  icon: ReactNode;
  onClick?: () => void;
}

export interface BalanceSummaryCardProps {
  /** Primary headline value, e.g. '$49,990'. */
  balance: string;
  /** Label above the balance value, e.g. 'Total Balance'. */
  balanceLabel?: string;
  /** Secondary stats — typically income and expense figures with optional trends. */
  stats: BalanceStat[];
  /** Quick-action buttons row (e.g. Send, Add card, Request). */
  actions?: BalanceAction[];
  /** Chart slot rendered below the stats row. Pass a sparkline or line chart ReactNode. */
  chart?: ReactNode;
  sx?: SxProps<Theme>;
}
