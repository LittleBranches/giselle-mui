import type { BoxProps } from '@mui/material/Box';

import type { Task, TaskDetails } from '../two-column/types';

// ----------------------------------------------------------------------

export interface TimelineItemDetailsProps extends Omit<BoxProps, 'children'> {
  task: Task;
  details?: TaskDetails;
  checklist?: boolean;
  taskDoneState?: boolean[];
  onTaskToggle?: (taskIndex: number) => void;
}
