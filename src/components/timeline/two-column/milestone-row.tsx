import type * as React from 'react';
import type { MilestoneRowProps } from './types';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { MilestoneBadge } from './milestone-badge';
import { TimelineDot } from './timeline-dot';
import {
  resolveMilestoneState,
  resolveMilestoneDotHandlers,
  resolveMilestoneTooltip,
} from './utils';
import {
  msRowSx,
  msColumnBoxSx,
  msDotWrapperSx,
  floatingDatePillSx,
  msCardWrapperSx,
  centerColumnSx,
} from './two-column.styles';

// ----------------------------------------------------------------------

/**
 * Renders a single milestone row inside a phase `<li>`.
 *
 * Each row contains three columns:
 * - Left card column — `MilestoneBadge` when `effectiveMsSide === 'left'`
 * - Centre dot column — `TimelineDot` (always rendered)
 * - Right card column — `MilestoneBadge` when `effectiveMsSide === 'right'`
 *
 * Cards are absolutely positioned at `top: X%` within the parent phase `<li>`
 * so expanding one card never shifts the spine dots below it.
 */
export function MilestoneRow({ ms, mi, totalMilestones, ctx }: MilestoneRowProps) {
  const { msDone, msColor } = resolveMilestoneState(
    ms,
    mi,
    ctx.phaseKey,
    ctx.dotColor,
    ctx.checklist,
    ctx.localMilestoneDone
  );
  const { msDotClickAction, msDotKeyDown, msDotAriaLabel } = resolveMilestoneDotHandlers(
    ms,
    mi,
    ctx.phaseKey,
    msDone,
    ctx.checklist,
    ctx.handleToggleMilestone
  );

  // Milestone inherits the parent phase side when no explicit side is set.
  // Explicit ms.side overrides — used for context milestones that factually belong
  // in the opposite column from their parent phase (e.g. tech/world-event entries
  // on a professional phase that belong in the Education & Open Source column).
  const effectiveMsSide = ms.side ?? ctx.phaseSide;
  const isThisMsExpanded = ctx.expandedMiIdx === mi;
  // Reserve 2 slots at the top of the <li> for phase-card clearance.
  // Without the reserve, the first milestone card can overlap the phase card because
  // slotHeight (measuredCardH + 16) is often shorter than the phase card.
  // With PHASE_CARD_RESERVE_SLOTS=2, the first milestone starts at
  // (RESERVE+1)/(RESERVE+n+1) of liHeight = (3 × slotHeight) from the top,
  // safely below any phase card up to ~(3 × slotHeight - cardH/2 - 6 - 15) px tall.
  // phaseMinHeight in two-column.tsx uses the same constant — keep in sync.
  const PHASE_CARD_RESERVE_SLOTS = 2;
  const topPercent =
    ((PHASE_CARD_RESERVE_SLOTS + mi + 1) / (PHASE_CARD_RESERVE_SLOTS + totalMilestones + 1)) * 100;
  // Always stop propagation from milestone card wrappers — same reason as phase cards:
  // prevents the document "close all" handler from racing with this card's state update.
  const stopProp = (e: React.MouseEvent) => e.stopPropagation();
  const suppressElevation = ctx.anyExpanded && !isThisMsExpanded;
  const dotChecklistProps = ctx.checklist
    ? {
        role: 'checkbox' as const,
        'aria-checked': msDone,
        'aria-label': msDotAriaLabel,
        tabIndex: 0,
      }
    : {};

  return (
    <Box sx={msRowSx(topPercent)}>
      {/* Left column — milestone card for milestones with effective side='left' */}
      <Box data-col="left" sx={msColumnBoxSx(effectiveMsSide === 'left')}>
        {effectiveMsSide === 'left' && (
          <Box
            data-ms-card="true"
            ref={(el: HTMLDivElement | null) => ctx.onMeasure(mi, el)}
            onClick={stopProp}
            sx={msCardWrapperSx(isThisMsExpanded, suppressElevation, 'left')}
          >
            <MilestoneBadge
              milestone={ms}
              done={msDone}
              isExpanded={isThisMsExpanded}
              suppressElevation={suppressElevation}
              stableId={`${ctx.phaseKey}-${mi}`}
              expandableIcon={ctx.expandableIcon}
              columnSide="left"
              isViewed={ctx.viewedKeys.has(`ms-${ctx.phaseKey}-${mi}`)}
              onMarkViewed={
                ctx.onMarkViewed ? () => ctx.onMarkViewed!(`ms-${ctx.phaseKey}-${mi}`) : undefined
              }
              taskDoneStates={ms.children?.map(
                (task, ti) =>
                  ctx.localTaskDoneMap[`${ctx.phaseKey}-m${mi}-t${ti}`] ?? task.done ?? false
              )}
              onToggleTask={(taskIdx, _done) => ctx.handleToggleTask(ctx.phaseKey, mi, taskIdx)}
              onRequestExpand={() => ctx.handleExpandMilestone(ctx.phaseKey, mi)}
            />
          </Box>
        )}
      </Box>

      {/* Centre: milestone dot — blurs with siblings when another card is open */}
      <Box data-col="center" sx={centerColumnSx}>
        {/* Dot + floating date pill: relative wrapper so pill doesn't affect row height/centering */}
        <Box sx={msDotWrapperSx(suppressElevation)}>
          {ms.date && (
            <Typography variant="caption" aria-hidden sx={floatingDatePillSx}>
              {ms.date}
            </Typography>
          )}
          <Tooltip
            title={resolveMilestoneTooltip(ctx.checklist, msColor, msDone, ms)}
            placement="top"
            arrow
          >
            <span>
              <TimelineDot
                icon={ms.icon}
                color={msColor}
                dotBg={ms.dotBg}
                size="milestone"
                done={msDone}
                onClick={msDotClickAction}
                onKeyDown={msDotKeyDown}
                {...dotChecklistProps}
              />
            </span>
          </Tooltip>
        </Box>
        {/* No spine here — the phase row's SpineConnector runs behind all milestone dots */}
      </Box>

      {/* Right column — milestone card for milestones with effective side='right' */}
      <Box data-col="right" sx={msColumnBoxSx(effectiveMsSide === 'right')}>
        {effectiveMsSide === 'right' && (
          <Box
            data-ms-card="true"
            ref={(el: HTMLDivElement | null) => ctx.onMeasure(mi, el)}
            onClick={stopProp}
            sx={msCardWrapperSx(isThisMsExpanded, suppressElevation, 'right')}
          >
            <MilestoneBadge
              milestone={ms}
              done={msDone}
              isExpanded={isThisMsExpanded}
              suppressElevation={suppressElevation}
              stableId={`${ctx.phaseKey}-${mi}`}
              expandableIcon={ctx.expandableIcon}
              isViewed={ctx.viewedKeys.has(`ms-${ctx.phaseKey}-${mi}`)}
              onMarkViewed={
                ctx.onMarkViewed ? () => ctx.onMarkViewed!(`ms-${ctx.phaseKey}-${mi}`) : undefined
              }
              taskDoneStates={ms.children?.map(
                (task, ti) =>
                  ctx.localTaskDoneMap[`${ctx.phaseKey}-m${mi}-t${ti}`] ?? task.done ?? false
              )}
              onToggleTask={(taskIdx, _done) => ctx.handleToggleTask(ctx.phaseKey, mi, taskIdx)}
              onRequestExpand={() => ctx.handleExpandMilestone(ctx.phaseKey, mi)}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
