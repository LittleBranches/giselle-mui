import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export interface NewsFeedItem {
  id: string;
  title: string;
  snippet?: string;
  timestamp: string;
  /** Thumbnail image URL. */
  imageSrc?: string;
}

export interface NewsFeedListProps {
  items: NewsFeedItem[];
  sx?: SxProps<Theme>;
}
