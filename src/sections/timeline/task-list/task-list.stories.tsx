import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { breakpointLabelSx, responsiveWrapperSx } from '../../../stories-defaults';
import { TaskList } from './task-list';

// ----------------------------------------------------------------------

const meta: Meta<typeof TaskList> = {
  title: 'Sections/Timeline/Task List',
  component: TaskList,
  parameters: { layout: 'padded' },
  argTypes: {
    sx: { control: false },
    taskDoneState: { control: false },
    onTaskToggle: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof TaskList>;

// ----------------------------------------------------------------------

const SAMPLE_TASKS = [
  { key: 1, title: 'Set up project scaffold', done: true },
  { key: 2, title: 'Configure ESLint and Prettier', done: true },
  { key: 3, title: 'Write unit tests for core utilities', done: false },
  { key: 4, title: 'Add Storybook stories', done: false },
  { key: 5, title: 'Ship first release', done: false },
];

// ----------------------------------------------------------------------

/**
 * Default — read-only list with some tasks marked done (line-through style).
 */
export const Default: Story = {
  args: {
    tasks: SAMPLE_TASKS,
  },
};

/**
 * Checklist — interactive. Named helper required because `useState` is used.
 */
function ChecklistDemo() {
  const [doneState, setDoneState] = useState(SAMPLE_TASKS.map((t) => t.done ?? false));
  return (
    <TaskList
      tasks={SAMPLE_TASKS}
      checklist
      taskDoneState={doneState}
      onTaskToggle={(i) => setDoneState((prev) => prev.map((d, idx) => (idx === i ? !d : d)))}
    />
  );
}

export const Checklist: Story = {
  render: () => <ChecklistDemo />,
};

/**
 * MilestoneIndent — extra left padding for task lists nested inside milestone cards.
 */
export const MilestoneIndent: Story = {
  args: {
    tasks: SAMPLE_TASKS.slice(0, 3),
    indent: 'milestone',
  },
};

/**
 * AllDone — all tasks completed; verifies the all-done line-through state.
 */
export const AllDone: Story = {
  args: {
    tasks: SAMPLE_TASKS.map((t) => ({ ...t, done: true })),
  },
};

/**
 * Responsive — task list inside labeled containers at standard MUI breakpoint widths.
 */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Box sx={responsiveWrapperSx}>
      {[360, 600, 900, 1200].map((width) => (
        <Box key={width}>
          <Typography variant="caption" sx={breakpointLabelSx}>
            {width}px
          </Typography>
          <Box sx={{ width, maxWidth: '100%' }}>
            <TaskList tasks={SAMPLE_TASKS} />
          </Box>
        </Box>
      ))}
    </Box>
  ),
};
