'use client';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { TaskList } from '../task-list';
import type { TimelineMilestone } from '../two-column/types';
import { dialogTitleSx } from './milestone-modal.styles';
import { resolveTaskChildren } from './utils';

// ----------------------------------------------------------------------

interface MilestoneModalProps {
  milestone: TimelineMilestone | null;
  open: boolean;
  onClose: () => void;
}

export function MilestoneModal({ milestone, open, onClose }: MilestoneModalProps) {
  // Use a plain media query string — no ThemeProvider required.
  // sm breakpoint = 600 px (MUI default); mirrored here to avoid the
  // `useMediaQuery(theme => ...)` form that requires a Theme context in tests.
  const fullScreen = useMediaQuery('(max-width:599.95px)');

  if (!milestone) return null;

  const tasks = resolveTaskChildren(milestone);

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
            {milestone.title}
          </Typography>
          {milestone.date && (
            <Typography
              variant="caption"
              display="block"
              sx={{ color: 'text.secondary', mt: 0.25 }}
            >
              {milestone.date}
            </Typography>
          )}
        </div>
        <IconButton
          aria-label="close milestone details"
          onClick={onClose}
          edge="end"
          size="small"
          sx={{ mt: 0.5, flexShrink: 0 }}
        >
          {/* × close icon — inline SVG, zero external dep */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2 }}>
        {milestone.description && (
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', mb: tasks.length > 0 ? 2 : 0 }}
          >
            {milestone.description}
          </Typography>
        )}

        {tasks.length > 0 && (
          <Box>
            <Typography
              variant="overline"
              sx={{ color: 'text.disabled', display: 'block', mb: 0.5 }}
            >
              Tasks
            </Typography>
            <TaskList tasks={tasks} />
          </Box>
        )}

        {!milestone.description && tasks.length === 0 && (
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            No additional details.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
