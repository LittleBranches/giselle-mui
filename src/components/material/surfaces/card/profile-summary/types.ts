import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface ProfileStat {
  label: string;
  value: string | number;
}

export interface ProfileSummaryCardProps {
  name: string;
  role?: string;
  avatarSrc?: string;
  stats: ProfileStat[];
  sx?: SxProps<Theme>;
}
