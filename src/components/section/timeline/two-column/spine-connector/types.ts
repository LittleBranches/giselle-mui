import type { BoxProps } from '@mui/material/Box';

import type { HighlightedPaletteKey } from '../types';

// ----------------------------------------------------------------------

export type SpineConnectorProps = BoxProps & {
  /** MUI palette key of the parent phase dot — tints the connector line. */
  dotColor: HighlightedPaletteKey;
  /** When set, renders a year-boundary label chip at the bottom of the connector. */
  yearMilestone?: string | null;
  /** Bottom offset (px) of the year label chip from the end of the connector line. @default 30 */
  yearLabelMarginBottom?: number;
};
