'use client';

import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {
  taskCheckboxSx,
  taskItemSx,
  taskListBaseSx,
  taskListMilestoneSx,
  taskCaptionSx,
} from './task-list.styles';
import type { TaskListProps } from './types';

// ----------------------------------------------------------------------

/**
 * Renders a flat list of `Task` items for use inside timeline cards,
 * detail drawers, and modals.
 *
 * In **checklist mode** (`checklist={true}`) each row shows a `Checkbox`
 * that the consumer controls via `taskDoneState` + `onToggle`. In read-only
 * mode the list is purely presentational and tasks marked `done` in the
 * data receive a line-through style.
 *
 * Use `indent="milestone"` when the list sits inside a milestone card to
 * add an extra level of left padding relative to the phase-level baseline.
 */
export function TaskList({
  tasks,
  checklist = false,
  taskDoneState,
  onTaskToggle,
  indent = 'phase',
  sx,
  ...other
}: TaskListProps) {
  const listSx = indent === 'milestone' ? taskListMilestoneSx : taskListBaseSx;

  return (
    <Box component="ul" sx={[listSx, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      {tasks.map((task, i) => {
        const isDone = taskDoneState?.[i] ?? task.done ?? false;
        return (
          <Box key={i} component="li" sx={taskItemSx}>
            {checklist && (
              <Checkbox
                size="small"
                checked={isDone}
                onChange={() => onTaskToggle?.(i)}
                sx={taskCheckboxSx}
                inputProps={{ 'aria-label': task.title }}
              />
            )}
            {!checklist && (
              <Typography
                component="span"
                variant="body2"
                sx={{ color: 'text.disabled', mr: 0.75, flexShrink: 0 }}
              >
                ›
              </Typography>
            )}
            <Typography variant="body2" sx={taskCaptionSx(isDone)}>
              {task.title}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
