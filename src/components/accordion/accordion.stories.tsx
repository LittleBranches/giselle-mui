import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import type { SxProps } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

import { breakpointContainerSx, breakpointLabelSx, BREAKPOINTS } from '../../stories-defaults';

import { Accordion } from './accordion';
import type { AccordionProps } from './types';

// ----------------------------------------------------------------------

const demoGroupLabelMbSx: SxProps<Theme> = { mb: 1 };
const buildBreakpointMaxWidthSx = (width: number): SxProps<Theme> => [
  breakpointContainerSx,
  { maxWidth: '100%', width },
];

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
    leadingAction: { control: false },
    trailingContent: { control: false },
    checkIcon: { control: false },
    checkDoneIcon: { control: false },
    checkHoverIcon: { control: false },
    children: { control: false },
    onDoneButtonClick: { control: false },
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

function ChecklistDoneDemo(args: Story['args']) {
  const [done, setDone] = useState(true);
  const accordionArgs = args as AccordionProps;

  return (
    <Accordion {...accordionArgs} done={done} onDoneButtonClick={setDone}>
      <Typography>Component published via yalc and consumed in the portfolio app.</Typography>
    </Accordion>
  );
}

export const ChecklistDone: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Checklist mode starting with `done=true`. This demo is controlled, so clicking the checkbox toggles it back to unchecked and updates the `aria-label` accordingly.',
      },
    },
  },
  args: {
    title: 'Ship initial component build',
    checklist: true,
    expandIcon: EXPAND_ICON,
  },
  render: (args) => <ChecklistDoneDemo {...args} />,
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
      <Typography variant="overline" color="text.secondary" sx={demoGroupLabelMbSx}>
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
// Icon-button mode — custom checkIcon activates the 3-state icon toggle.
// The consumer supplies an idle icon; hover/focus and done icons are built-in
// defaults (outlined green check / filled green check) unless overridden.
// ----------------------------------------------------------------------

/**
 * A simple circle SVG used as the "not done yet" idle icon.
 * Consumers would typically use a GiselleIcon here (e.g. solar:circle-bold).
 */
function CircleIdleIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

const CIRCLE_IDLE_ICON = <CircleIdleIcon />;

function CheckIconInteractiveDemo() {
  const [done, setDone] = useState(false);
  return (
    <Stack spacing={1}>
      <Typography variant="caption" color="text.secondary">
        Status: {done ? '✓ Done' : 'Pending'} — hover or Tab-focus the icon to preview the toggle
        action
      </Typography>
      <Accordion
        title="Review pull request comments"
        checklist
        checkIcon={CIRCLE_IDLE_ICON}
        done={done}
        onDoneButtonClick={setDone}
        expandIcon={EXPAND_ICON}
      >
        <Typography>
          Address all reviewer feedback before merging. Hover the circle icon to see the green check
          preview; click or press Space / Enter to toggle done.
        </Typography>
      </Accordion>
    </Stack>
  );
}

export const CheckIconInteractive: Story = {
  parameters: {
    docs: {
      description: {
        story: `
Icon-button checklist mode. The \`checkIcon\` prop replaces the native MUI
Checkbox with an \`IconButton\` that shows three different icons:

- **Idle / not done** — the consumer's \`checkIcon\` (circle here)
- **Hover or keyboard focus** — built-in outlined green check (preview the toggle action)
- **Done** — built-in filled green check

Hover the circle, Tab-focus it, or press Space / Enter to toggle.
Both \`checkDoneIcon\` and \`checkHoverIcon\` can be overridden if a different
icon set is preferred.
        `.trim(),
      },
    },
  },
  render: () => <CheckIconInteractiveDemo />,
};

// ----------------------------------------------------------------------

const ICON_TASKS = [
  {
    id: 'it-1',
    title: 'Scaffold the project',
    description: 'Initialise the repo, install deps, configure ESLint and Prettier.',
    done: true,
  },
  {
    id: 'it-2',
    title: 'Design the data model',
    description: 'Define TypeScript interfaces for all domain entities.',
    done: true,
  },
  {
    id: 'it-3',
    title: 'Build core components',
    description: 'Implement Accordion, StatCard, and Timeline components.',
    done: false,
  },
  {
    id: 'it-4',
    title: 'Write integration tests',
    description: 'Cover critical user flows end-to-end with Playwright.',
    done: false,
  },
];

function CheckIconTaskListDemo() {
  const [tasks, setTasks] = useState(ICON_TASKS);

  const toggle = (id: string, isDone: boolean) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: isDone } : t)));
  };

  return (
    <Stack spacing={0.5}>
      <Typography variant="overline" color="text.secondary" sx={demoGroupLabelMbSx}>
        Project tasks — {tasks.filter((t) => t.done).length}/{tasks.length} done
      </Typography>
      {tasks.map((task) => (
        <Accordion
          key={task.id}
          title={task.title}
          checklist
          checkIcon={CIRCLE_IDLE_ICON}
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

export const CheckIconTaskList: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Task list using icon-button mode (`checkIcon` provided). Hover any circle to preview the green check; click to mark done. Compare with `TaskList` which uses the native MUI Checkbox.',
      },
    },
  },
  render: () => <CheckIconTaskListDemo />,
};

// ----------------------------------------------------------------------

/**
 * ## Decision doc — `leadingAction` vs `leadingIcon`
 *
 * The `leadingAction` prop accepts an interactive `ReactNode` (a button, a
 * clickable phase dot, etc.) and renders it **as-is** before the title.
 *
 * The key difference from `leadingIcon`:
 *
 * - `leadingIcon` wraps its content in an `aria-hidden="true"` Box because it
 *   is always decorative — the title text is the accessible label.
 * - `leadingAction` is rendered directly because the consumer's element is
 *   interactive. The consumer is responsible for `role`, `aria-label`, and
 *   event handling on their element.
 *
 * **Rule:** If the leading slot must be clickable, use `leadingAction`.
 * If it is purely decorative, use `leadingIcon`.
 */
export const WithLeadingAction: Story = {
  parameters: {
    docs: {
      description: {
        story: `
The \`leadingAction\` slot renders an **interactive** element before the title.
Unlike \`leadingIcon\` (which is \`aria-hidden\`), \`leadingAction\` is rendered
as-is — the consumer is responsible for accessibility on their element.

**Use this when** the leading slot must be clickable (e.g. a phase-status dot,
a priority flag button). **Use \`leadingIcon\`** when it is purely decorative.

Both the leading action and the accordion expand/collapse are independently
keyboard-accessible.
        `.trim(),
      },
    },
  },
  render: () => (
    <Accordion
      title="Phase 1 — API design"
      expandIcon={EXPAND_ICON}
      leadingAction={
        <button
          type="button"
          aria-label="Mark phase as done"
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            border: '2px solid currentColor',
            background: 'transparent',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        />
      }
    >
      <Typography>
        Accordion with an interactive leading action — a phase status dot that the consumer can
        click independently from the expand/collapse trigger.
      </Typography>
    </Accordion>
  ),
};

// ----------------------------------------------------------------------

/**
 * ## Decision doc — WCAG 2.2 AA: checkbox outside `AccordionSummary`
 *
 * MUI `AccordionSummary` renders as a `<button>`. Placing a `<input
 * type="checkbox">` inside a `<button>` violates the ARIA spec (interactive
 * element nested inside another interactive element) and breaks keyboard
 * behaviour in most browsers.
 *
 * **The fix:** render the `Checkbox` and `AccordionSummary` as **siblings**
 * inside a flex `Box`. The Box sits between `<Accordion>` and
 * `<AccordionSummary>` in the DOM. MUI v7 communicates between those two via
 * React context — not via direct-child CSS selectors — so the wrapper is
 * transparent to MUI's internal expand/collapse logic.
 *
 * **What to verify in the canvas:**
 *
 * 1. Click the **checkbox** only → done state toggles, accordion stays closed.
 * 2. Click the **title area** only → accordion opens/closes, done state stays.
 * 3. Tab to the **checkbox** → focus ring appears on the checkbox, not the title.
 * 4. Tab again → focus moves to the **title button** as a separate tab stop.
 *
 * This four-point check confirms that both elements are independently
 * keyboard-accessible and neither is nested inside the other.
 */
function CheckboxOutsideSummaryDemo() {
  const [done, setDone] = useState(false);
  return (
    <Stack spacing={1}>
      <Typography variant="caption" color="text.secondary">
        Checkbox done: {done ? 'true' : 'false'} — toggle it without opening the accordion
      </Typography>
      <Accordion
        title="Verify WCAG checkbox independence"
        checklist
        done={done}
        onDoneButtonClick={setDone}
        expandIcon={EXPAND_ICON}
      >
        <Typography>
          This content is only visible when you click the title area (not the checkbox).
        </Typography>
      </Accordion>
    </Stack>
  );
}

export const CheckboxOutsideSummary: Story = {
  parameters: {
    docs: {
      description: {
        story: `
**WCAG 2.2 AA compliance: checkbox and summary are siblings, never nested.**

MUI \`AccordionSummary\` is a \`<button>\`. Nesting a \`<input type="checkbox">\`
inside it violates the ARIA spec and breaks keyboard navigation.

This component renders the \`Checkbox\` and \`AccordionSummary\` as siblings in a
flex row. MUI communicates expand state via React context, not DOM structure, so
the wrapper Box is invisible to MUI's internal logic.

**Verify in the canvas:**
1. Click the checkbox → done toggles, accordion stays closed.
2. Click the title area → accordion opens, done stays unchanged.
3. Tab from outside → checkbox gets focus first (its own tab stop).
4. Tab again → title button gets focus (second independent tab stop).
        `.trim(),
      },
    },
  },
  render: () => <CheckboxOutsideSummaryDemo />,
};

// ----------------------------------------------------------------------

function ResponsiveDemo() {
  return (
    <Stack spacing={3}>
      {BREAKPOINTS.map(({ label, width }) => (
        <div key={width}>
          <Typography variant="caption" sx={breakpointLabelSx}>
            {label}
          </Typography>
          <Box sx={buildBreakpointMaxWidthSx(width)}>
            <Accordion
              title="Task with a reasonably long title that may wrap on small screens"
              checklist
              done={false}
              expandIcon={EXPAND_ICON}
            >
              <Typography variant="body2">Details content.</Typography>
            </Accordion>
          </Box>
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
