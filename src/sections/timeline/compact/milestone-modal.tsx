'use client';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import type { TaskDetailsModalProps } from './types';
import { dialogDateSx, dialogTitleSx } from './milestone-modal.styles';
import { TaskDetailsRenderer } from './task-details-renderer';

// ----------------------------------------------------------------------

/**
 * Full-screen (mobile) or fixed-width (desktop) dialog that shows the
 * detailed content for a single timeline task.
 *
 * Controlled externally: the parent supplies `open` and `onClose` —
 * this component owns no visibility state of its own.
 *
 * `fullScreen` is derived from a plain `useMediaQuery` string rather than
 * a theme callback so the component stays testable without a full theme context.
 *
 * **Quality status (13 May 2026):** DoD 9/9 · Best practices 13/13
 * @internal — used by `TimelineCompact` via `PhaseAccordionRow`.
 */
export function TaskDetailsModal({
  task,
  open,
  onClose,
  checklist = false,
  taskDoneState,
  onTaskToggle,
}: TaskDetailsModalProps) {
  // Use a plain media query string — no ThemeProvider required.
  // sm breakpoint = 600 px (MUI default); mirrored here to avoid the
  // `useMediaQuery(theme => ...)` form that requires a Theme context in tests.
  const fullScreen = useMediaQuery('(max-width:599.95px)');

  if (!task) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      scroll="paper"
    >
      <DialogTitle sx={dialogTitleSx}>
        <div>
          <Typography variant="h6" component="span">
            {task.title}
          </Typography>
          {task.date && (
            <Typography variant="caption" display="block" sx={dialogDateSx}>
              {task.date}
            </Typography>
          )}
        </div>

        <IconButton aria-label="Close details" onClick={onClose} sx={{ mt: 0.5, flexShrink: 0 }}>
          {/* × close icon — inline SVG, zero external dep */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2 }}>
        <TaskDetailsRenderer
          task={task}
          checklist={checklist}
          taskDoneState={taskDoneState}
          onTaskToggle={onTaskToggle}
        />
      </DialogContent>
    </Dialog>
  );
}
