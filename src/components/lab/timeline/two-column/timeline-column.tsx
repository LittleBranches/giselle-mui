import Box from '@mui/material/Box';

import { timelineColumnSx } from './two-column.styles';
import type { TimelineColumnProps } from './types';

// ----------------------------------------------------------------------

/**
 * One flex column in the two-column phase row.
 *
 * @remarks
 * The Box is a flex layout child of the phase row — NOT part of PhaseCard.
 * It controls column width (`flex: 1`), text alignment, padding, and
 * responsive visibility. Keep it in the parent, not inside PhaseCard.
 *
 * On mobile (`xs`) the column is hidden when it carries no content for this
 * phase (empty padding would still consume space). On desktop (`md+`) both
 * columns always render.
 *
 * REGRESSION NOTE: This helper was extracted deliberately to prevent the
 * two near-identical column Boxes from drifting out of sync during refactors.
 * Do NOT inline these Boxes back into the render. If you need to change column
 * behaviour, change it here once.
 */
export function TimelineColumn({
  columnSide,
  hasContent,
  children,
  bottomPadding,
}: TimelineColumnProps) {
  return (
    <Box data-col={columnSide} sx={timelineColumnSx(columnSide, hasContent, bottomPadding)}>
      {children}
    </Box>
  );
}
