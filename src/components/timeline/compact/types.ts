import type { BoxProps } from '@mui/material/Box';

import type { TimelinePhase } from '../two-column/types';

// ----------------------------------------------------------------------

/**
 * Props for `TimelineCompact`.
 *
 * Accepts the same `phases` array as `TimelineTwoColumn` — no separate data model.
 * Swap at a breakpoint without changing the data layer:
 *
 * ```tsx
 * {isMobile
 *   ? <TimelineCompact phases={phases} />
 *   : <TimelineTwoColumn phases={phases} columnLabels={...} sidebar={...} />
 * }
 * ```
 */
export interface TimelineCompactProps extends BoxProps {
  /**
   * Timeline phases to render as accordion rows.
   *
   * Each phase maps to one accordion item:
   * - Summary: coloured dot + title + date
   * - Details: description text + milestone list
   */
  phases: TimelinePhase[];
}
