import type { SxProps, Theme } from '@mui/material/styles';

import type { StatusLabelStatus } from '../status-label/types';

// ----------------------------------------------------------------------

export interface ActivityFeedItem {
  /** Unique identifier — used as the React list key. */
  id: string;
  /** Avatar image URL. Falls back to initials when absent. */
  avatar?: string;
  primary: string;
  secondary?: string;
  /** Relative or absolute timestamp string — rendered as-is. */
  timestamp: string;
  status?: StatusLabelStatus;
}

export interface ActivityFeedListProps {
  items: ActivityFeedItem[];
  sx?: SxProps<Theme>;
}
