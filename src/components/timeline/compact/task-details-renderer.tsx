'use client';

import type { ReactNode } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { TaskList } from '../task-list';
import type { TaskDetailsRendererProps } from './types';
import {
  taskDetailsContentSx,
  taskDetailsEmptyStateSx,
  taskDetailsSummarySx,
} from './task-details-renderer.styles';
import { resolveTaskChildren } from './utils';

function renderDetailsNode(node: ReactNode | undefined) {
  if (!node) return null;
  if (typeof node === 'string') {
    return (
      <Typography variant="body2" sx={taskDetailsSummarySx}>
        {node}
      </Typography>
    );
  }
  return node;
}

export function TaskDetailsRenderer({
  task,
  checklist = false,
  taskDoneState,
  onTaskToggle,
  emptyState = 'No additional details.',
  sx,
  ...other
}: TaskDetailsRendererProps) {
  const nestedTasks = resolveTaskChildren(task);
  const hasInlineDescription = Boolean(task.description);
  const hasSummary = Boolean(task.details?.summary);
  const hasContent = Boolean(task.details?.content);
  const hasTasks = nestedTasks.length > 0;

  return (
    <Box sx={[taskDetailsContentSx, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      {hasInlineDescription && (
        <Typography variant="body2" sx={taskDetailsSummarySx}>
          {task.description}
        </Typography>
      )}

      {!hasInlineDescription && renderDetailsNode(task.details?.summary)}
      {hasContent && renderDetailsNode(task.details?.content)}

      {hasTasks && (
        <TaskList
          tasks={nestedTasks}
          checklist={checklist}
          taskDoneState={taskDoneState}
          onTaskToggle={onTaskToggle}
          indent="milestone"
        />
      )}

      {!hasInlineDescription && !hasSummary && !hasContent && !hasTasks && (
        <Typography variant="body2" sx={taskDetailsEmptyStateSx}>
          {emptyState}
        </Typography>
      )}
    </Box>
  );
}
