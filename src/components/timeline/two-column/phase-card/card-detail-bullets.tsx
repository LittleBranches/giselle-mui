import type { BoxProps } from '@mui/material/Box';
import type { CardDetailBulletsProps } from './types';
import type { MouseEvent } from 'react';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';

import { GiselleIcon } from '../../../icon/giselle/giselle-icon';
import {
  detailBulletsContainerSx,
  taskRowSx,
  taskToggleButtonSx,
  taskIconStaticSx,
  taskToggleColorSx,
  taskIconColorSx,
  taskTitleSx,
} from './phase-card.styles';
import { PHASE_TASK_ICON_SIZE } from './phase-card.const';

/**
 * Expandable bullet list for phase detail items.
 * Collapses by default; expands when the parent card is toggled.
 *
 * Supports both interactive (task-toggle) and read-only (decorative) modes.
 * Pass `onToggleTask` to enable interactive icons; omit for read-only display.
 */
export function CardDetailBullets({
  id,
  details,
  in: expanded,
  taskDoneStates,
  onToggleTask,
}: CardDetailBulletsProps) {
  return (
    <Collapse in={expanded} timeout={50}>
      <Box id={id} sx={detailBulletsContainerSx}>
        {details.map((task, i) => {
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
                    : [taskIconStaticSx, taskIconColorSx(isDoneTask)]) as BoxProps['sx']
                }
              >
                <GiselleIcon
                  icon={
                    isDoneTask ? 'solar:check-circle-bold' : 'solar:record-minimalistic-outline'
                  }
                  width={PHASE_TASK_ICON_SIZE}
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
  );
}
