import type { PaperProps } from '@mui/material/Paper';
import type { Task, HighlightedPaletteKey } from '../types';
import type { MilestoneBadgeProps } from './types';

import { useCallback, useState, type KeyboardEvent, type MouseEvent } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { DEFAULT_EXPANDABLE_ICON } from '../icons';
import { GiselleIcon } from '../../../../material/data-display/icon/giselle/giselle-icon';
import {
  milestonePaperSx,
  milestoneNewBadgeRowSx,
  milestoneNewDotSx,
  milestoneNewLabelSx,
  milestoneDateSx,
  milestoneTitleRowSx,
  milestoneEyeButtonSx,
  milestoneDetailPillSx,
  milestoneDetailListSx,
  taskRowSx,
  taskToggleButtonSx,
  taskIconStaticSx,
  taskToggleColorSx,
  taskIconColorSx,
  taskTitleSx,
  pillIconBoxSx,
} from './milestone-badge.styles';
import {
  MILESTONE_DATE_FONT_SIZE,
  MILESTONE_PILL_ICON_SIZE,
  MILESTONE_PILL_TEXT_FONT_SIZE,
  MILESTONE_EYE_ICON_SIZE,
  MILESTONE_EYE_BUTTON_MIN_SIZE,
  MILESTONE_TASK_ICON_SIZE,
} from './milestone-badge.const';

// ----------------------------------------------------------------------

// Re-export — keeps `import { MilestoneBadgeProps } from './milestone-badge'` working.
export type { MilestoneBadgeProps } from './types';
// Re-export constants — keeps `import { MILESTONE_DATE_FONT_SIZE, ... } from './milestone-badge'` working.
export * from './milestone-badge.const';

// ----------------------------------------------------------------------

/**
 * Milestone card — spine-adjacent badge that expands/collapses on click.
 * Expansion is controlled externally (accordion: at most one open per phase).
 * The parent wrapper in TimelineTwoColumn owns z-index and blur animations.
 */
export function MilestoneBadge({
  milestone: m,
  done = false,
  isExpanded,
  onRequestExpand,
  suppressElevation = false,
  expandableIcon,
  stableId,
  isViewed = false,
  onMarkViewed,
  columnSide = 'right',
  taskDoneStates,
  onToggleTask,
  sx,
  ...other
}: MilestoneBadgeProps) {
  // Right-align the collapsed view when in the left column so text sits flush
  // against the centre spine instead of leaving a gap at the right edge of the card.
  // Alignment resets to left only when expanded.
  const rightAlign = columnSide === 'left' && !isExpanded;

  /**
   * Normalises milestone expandable content to `Task[]`.
   *
   * Resolution order:
   *   1. `m.children` — new structured form.
   *   2. `m.details`  — legacy flat string array, mapped to `{ title }` shims.
   *   3. Empty array  — milestone has no expandable content.
   */
  const taskChildren: Task[] = m.children?.length
    ? m.children
    : (m.details?.map((title: string, index: number) => ({
        key: `detail-${index}`,
        title,
      })) ?? []);

  const hasDetails = taskChildren.length > 0;
  const colorKey = (m.color ?? 'primary') as HighlightedPaletteKey;
  const titleSlug = String(m.title)
    .replace(/[^a-z0-9]/gi, '-')
    .toLowerCase();
  const detailsId = stableId ? `ms-details-${stableId}` : `ms-details-${titleSlug}`;

  // Three-level title disclosure:
  //   collapsed (no hover)  → shortTitle (glanceable)
  //   collapsed (hovered)   → full title (preview before clicking)
  //   expanded              → full title
  //
  // The ResizeObserver was removed (see timeline-two-column.tsx) so hover no
  // longer triggers a slot-height update or a layout shift. It is now safe to
  // change displayTitle on hover.
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);
  const displayTitle = isExpanded || isHovered ? m.title : (m.shortTitle ?? m.title);

  const handleClick = useCallback(() => {
    if (hasDetails) onRequestExpand();
  }, [hasDetails, onRequestExpand]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (hasDetails && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onRequestExpand();
      }
    },
    [hasDetails, onRequestExpand]
  );

  return (
    <Paper
      {...other}
      role={hasDetails ? 'button' : undefined}
      tabIndex={hasDetails ? 0 : undefined}
      aria-expanded={hasDetails ? isExpanded : undefined}
      aria-controls={hasDetails ? detailsId : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={[
        milestonePaperSx({ isExpanded, colorKey, rightAlign, done, hasDetails, suppressElevation }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {m.new && (
        <Box sx={milestoneNewBadgeRowSx(rightAlign)}>
          <Box sx={milestoneNewDotSx} />
          <Typography variant="caption" sx={milestoneNewLabelSx}>
            New
          </Typography>
        </Box>
      )}
      {m.date && (
        <Typography variant="caption" sx={milestoneDateSx(MILESTONE_DATE_FONT_SIZE)}>
          {m.date}
        </Typography>
      )}
      <Box sx={milestoneTitleRowSx(rightAlign)}>
        {onMarkViewed && (
          <Tooltip
            title={isViewed ? 'Mark as not viewed' : 'Mark as viewed'}
            placement={rightAlign ? 'right' : 'left'}
            arrow
          >
            <Box
              component="button"
              type="button"
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                onMarkViewed();
              }}
              aria-label={isViewed ? 'Mark as not viewed' : 'Mark as viewed'}
              aria-pressed={isViewed}
              sx={milestoneEyeButtonSx({
                isViewed: !!isViewed,
                minSize: MILESTONE_EYE_BUTTON_MIN_SIZE,
              })}
            >
              <GiselleIcon
                icon={isViewed ? 'solar:eye-bold' : 'solar:eye-outline'}
                width={MILESTONE_EYE_ICON_SIZE}
                aria-hidden
              />
            </Box>
          </Tooltip>
        )}

        <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
          {displayTitle}
        </Typography>
      </Box>

      {(isExpanded || isHovered) && m.description && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {m.description}
        </Typography>
      )}

      {hasDetails && (
        <Box
          sx={milestoneDetailPillSx}
          aria-label={`${taskChildren.length} expandable detail${taskChildren.length === 1 ? '' : 's'}`}
        >
          <Box component="span" sx={pillIconBoxSx(MILESTONE_PILL_ICON_SIZE)}>
            {expandableIcon ?? DEFAULT_EXPANDABLE_ICON}
          </Box>
          <Typography
            component="span"
            variant="caption"
            sx={{ fontWeight: 600, lineHeight: 1, fontSize: MILESTONE_PILL_TEXT_FONT_SIZE }}
          >
            {taskChildren.length}
          </Typography>
        </Box>
      )}
      {hasDetails && (
        <Collapse in={isExpanded} timeout={50}>
          <Box id={detailsId} sx={milestoneDetailListSx}>
            {taskChildren.map((task, i) => {
              const taskKey = String(task.key);
              const isDoneTask = taskDoneStates
                ? (taskDoneStates[taskKey] ?? taskDoneStates[`idx-${i}`] ?? false)
                : (task.done ?? false);
              const toggleLabel = isDoneTask
                ? `Mark "${task.title}" as not done`
                : `Mark "${task.title}" as done`;
              return (
                <Box key={i} sx={taskRowSx}>
                  <Box
                    component={onToggleTask ? 'button' : 'span'}
                    type={onToggleTask ? 'button' : undefined}
                    aria-label={onToggleTask ? toggleLabel : undefined}
                    aria-pressed={onToggleTask ? isDoneTask : undefined}
                    onClick={
                      onToggleTask
                        ? (e: MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            onToggleTask(i, !isDoneTask);
                          }
                        : undefined
                    }
                    sx={
                      (onToggleTask
                        ? [taskToggleButtonSx, taskToggleColorSx(isDoneTask)]
                        : [taskIconStaticSx, taskIconColorSx(isDoneTask)]) as PaperProps['sx']
                    }
                  >
                    <GiselleIcon
                      icon={
                        isDoneTask ? 'solar:check-circle-bold' : 'solar:record-minimalistic-outline'
                      }
                      width={MILESTONE_TASK_ICON_SIZE}
                    />
                  </Box>
                  <Typography variant="body2" sx={taskTitleSx(isDoneTask)}>
                    {task.title}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Collapse>
      )}
    </Paper>
  );
}
