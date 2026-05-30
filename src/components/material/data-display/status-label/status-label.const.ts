import type { StatusColorKey, StatusConfig, StatusLabelStatus } from './types';

export type { StatusColorKey, StatusConfig };

// ----------------------------------------------------------------------

/** Height (px) of the status chip — aligns with MUI Chip small variant. */
export const STATUS_LABEL_HEIGHT = 24;

/** Font size for the chip label text. */
export const STATUS_LABEL_FONT_SIZE = '0.75rem';

/**
 * Maps each status to its default display label and MUI palette key.
 * `'default'` is not a real MUI palette key — `statusChipSx` handles it
 * separately by falling back to the grey 500 channel.
 */
export const STATUS_CONFIG: Record<StatusLabelStatus, StatusConfig> = {
  active: { color: 'success', label: 'Active' },
  inactive: { color: 'default', label: 'Inactive' },
  pending: { color: 'warning', label: 'Pending' },
  review: { color: 'info', label: 'Review' },
  done: { color: 'success', label: 'Done' },
  cancelled: { color: 'error', label: 'Cancelled' },
  overdue: { color: 'error', label: 'Overdue' },
};
