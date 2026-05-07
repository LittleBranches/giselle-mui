import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Accordion } from './accordion';

// ----------------------------------------------------------------------

const meta: Meta<typeof Accordion> = {
  title: 'Data Display/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A generic, accessible accordion component suitable for FAQ entries, tasks,
settings sections, and any other collapsible content.

**Checklist mode:** when \`checklist\` is \`true\`, a \`Checkbox\` appears
before the title and operates **independently** from the expand/collapse
trigger — both are separately keyboard-accessible and WCAG 2.2 AA compliant.
        `.trim(),
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    sx: { control: false },
    expandIcon: { control: false },
    leadingIcon: { control: false },
    children: { control: false },
    TransitionComponent: { control: false },
    TransitionProps: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

// ----------------------------------------------------------------------

const EXPAND_ICON = '▾';

// ----------------------------------------------------------------------

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Basic accordion with a string title. The expand icon is consumer-provided via the `expandIcon` prop.',
      },
    },
  },
  render: () => (
    <Accordion title="What is this component?" expandIcon={EXPAND_ICON} defaultExpanded>
      <Typography>
        A generic accordion that can wrap any content. Use it for FAQ entries, task detail panels,
        settings groups, or any collapsible section.
      </Typography>
    </Accordion>
  ),
};

// ----------------------------------------------------------------------

export const WithLeadingIcon: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Non-checklist mode with a `leadingIcon` prop. The icon is `aria-hidden` because it is decorative — the title text carries the accessible label.',
      },
    },
  },
  render: () => (
    <Accordion
      title="Project requirements"
      expandIcon={EXPAND_ICON}
      leadingIcon={<span style={{ fontSize: 18 }}>📋</span>}
    >
      <Typography>Accordion with a decorative leading icon in non-checklist mode.</Typography>
    </Accordion>
  ),
};

// ----------------------------------------------------------------------

export const ChecklistPending: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Checklist mode with `done=false`. The checkbox is unchecked. Clicking the checkbox calls `onDoneButtonClick(true)` — it does **not** open or close the accordion.',
      },
    },
  },
  args: {
    title: 'Add unit tests for the new component',
    checklist: true,
    done: false,
    expandIcon: EXPAND_ICON,
  },
  render: (args) => (
    <Accordion {...args}>
      <Typography>
        Write Vitest tests covering render, ARIA attributes, and checkbox interaction.
      </Typography>
    </Accordion>
  ),
};

// ----------------------------------------------------------------------

export const ChecklistDone: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Checklist mode with `done=true`. The checkbox is checked. The `aria-label` on the checkbox reads "Mark as not done" in this state.',
      },
    },
  },
  args: {
    title: 'Ship initial component build',
    checklist: true,
    done: true,
    expandIcon: EXPAND_ICON,
  },
  render: (args) => (
    <Accordion {...args}>
      <Typography>Component published via yalc and consumed in the portfolio app.</Typography>
    </Accordion>
  ),
};

// ----------------------------------------------------------------------

function ChecklistInteractiveDemo() {
  const [done, setDone] = useState(false);
  return (
    <Stack spacing={1}>
      <Typography variant="caption" color="text.secondary">
        Status: {done ? '✓ Done' : 'Pending'}
      </Typography>
      <Accordion
        title="Write acceptance tests"
        checklist
        done={done}
        onDoneButtonClick={setDone}
        expandIcon={EXPAND_ICON}
      >
        <Typography>
          Cover the happy path and edge cases. Open the accordion for details; click the checkbox to
          toggle done independently.
        </Typography>
      </Accordion>
    </Stack>
  );
}

export const ChecklistInteractive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Fully controlled checklist accordion. Clicking the checkbox calls `onDoneButtonClick` and the parent updates `done`. Clicking the summary row expands/collapses independently.',
      },
    },
  },
  render: () => <ChecklistInteractiveDemo />,
};

// ----------------------------------------------------------------------

const SAMPLE_TASKS = [
  {
    id: 'task-1',
    title: 'Define component API',
    description: 'Agree on props, types, and export contract with the consumer team.',
    done: true,
  },
  {
    id: 'task-2',
    title: 'Build the component',
    description: 'Implement accordion.tsx following the library conventions.',
    done: true,
  },
  {
    id: 'task-3',
    title: 'Write unit tests',
    description: 'Cover rendering, ARIA structure, and all checkbox interaction cases with Vitest.',
    done: false,
  },
  {
    id: 'task-4',
    title: 'Add Storybook stories',
    description: 'Document every variant including the interactive checklist demo.',
    done: false,
  },
];

function TaskListDemo() {
  const [tasks, setTasks] = useState(SAMPLE_TASKS);

  const toggle = (id: string, isDone: boolean) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: isDone } : t)));
  };

  return (
    <Stack spacing={0.5}>
      <Typography variant="overline" color="text.secondary" sx={{ mb: 1 }}>
        Sprint tasks — {tasks.filter((t) => t.done).length}/{tasks.length} done
      </Typography>
      {tasks.map((task) => (
        <Accordion
          key={task.id}
          title={task.title}
          checklist
          done={task.done}
          onDoneButtonClick={(isDone) => toggle(task.id, isDone)}
          expandIcon={EXPAND_ICON}
        >
          <Typography variant="body2">{task.description}</Typography>
        </Accordion>
      ))}
    </Stack>
  );
}

export const TaskList: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Multiple `Accordion` components acting as a task list. Each task has its own done state managed by a shared parent. The progress counter updates as tasks are ticked off.',
      },
    },
  },
  render: () => <TaskListDemo />,
};

// ----------------------------------------------------------------------

function ResponsiveDemo() {
  return (
    <Stack spacing={3}>
      {[360, 600, 900, 1200].map((width) => (
        <div key={width}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            {width}px
          </Typography>
          <div style={{ width, maxWidth: '100%', border: '1px dashed #ccc' }}>
            <Accordion
              title="Task with a reasonably long title that may wrap on small screens"
              checklist
              done={false}
              expandIcon={EXPAND_ICON}
            >
              <Typography variant="body2">Details content.</Typography>
            </Accordion>
          </div>
        </div>
      ))}
    </Stack>
  );
}

export const Responsive: Story = {
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Accordion at xs (360 px), sm (600 px), md (900 px), and lg (1200 px) viewport widths. Verify that long titles truncate or wrap gracefully and the checkbox remains visually aligned.',
      },
    },
  },
  render: () => <ResponsiveDemo />,
};
