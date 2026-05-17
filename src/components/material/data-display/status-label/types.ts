import type { ChipProps } from '@mui/material/Chip';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type StatusLabelStatus =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'review'
  | 'done'
  | 'cancelled'
  | 'overdue';

export interface StatusLabelProps extends Omit<ChipProps, 'label' | 'color' | 'icon'> {
  status: StatusLabelStatus;
  /** Override the default label derived from status. */
  label?: string;
  sx?: SxProps<Theme>;
}
