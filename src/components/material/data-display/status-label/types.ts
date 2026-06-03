import type { ChipProps } from '@mui/material/Chip';

// ----------------------------------------------------------------------

export type StatusLabelStatus =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'review'
  | 'done'
  | 'cancelled'
  | 'overdue';

export type StatusColorKey = 'success' | 'warning' | 'info' | 'error' | 'default';

export interface StatusConfig {
  color: StatusColorKey;
  label: string;
}

export interface StatusLabelProps extends Omit<ChipProps, 'label' | 'color' | 'icon'> {
  status: StatusLabelStatus;
  /** Override the default label derived from status. */
  label?: string;
}
