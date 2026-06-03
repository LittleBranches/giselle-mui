import type { PaperProps } from '@mui/material/Paper';

// ----------------------------------------------------------------------

export interface ProfileStat {
  label: string;
  value: string | number;
}

export interface ProfileSummaryCardProps extends Omit<PaperProps, 'children'> {
  name: string;
  role?: string;
  avatarSrc?: string;
  stats: ProfileStat[];
}
