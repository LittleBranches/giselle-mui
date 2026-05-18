import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {
  breakpointContainerSx,
  breakpointLabelSx,
  responsiveWrapperSx,
} from '../../../../stories-defaults';
import { GiselleIcon } from '../../../material/data-display/icon/giselle';
import type { TimelinePhase } from '../two-column/types';
import { TimelineCompact } from './compact';

// ----------------------------------------------------------------------

const meta: Meta<typeof TimelineCompact> = {
  title: 'Section/Timeline/Compact',
  component: TimelineCompact,
  parameters: { layout: 'padded' },
  argTypes: {
    phases: { control: false },
    sx: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof TimelineCompact>;

// ----------------------------------------------------------------------

const ICON_BOX = <GiselleIcon icon="solar:box-bold" width={12} />;
const ICON_ROCKET = <GiselleIcon icon="solar:rocket-bold" width={12} />;
const ICON_CODE = <GiselleIcon icon="solar:code-bold" width={12} />;
const ICON_CHECK = <GiselleIcon icon="solar:check-circle-bold" width={12} />;
const ICON_STAR = <GiselleIcon icon="solar:star-bold" width={12} />;
const ICON_MS = <GiselleIcon icon="solar:flag-bold" width={10} />;

const SAMPLE_PHASES: TimelinePhase[] = [
  {
    key: 1,
    title: 'Platform Foundation',
    shortTitle: 'Foundation',
    description:
      'Core infrastructure: CI/CD pipeline, quality gates, offline icon registration, and deployment to production.',
    date: 'Jan 2025',
    icon: ICON_BOX,
    color: 'success',
    side: 'left',
    done: true,
    milestones: [
      {
        key: 'deploy-live',
        date: 'Jan 2025',
        title: 'Deployment live',
        shortTitle: 'Deploy',
        icon: ICON_MS,
        color: 'success',
        done: true,
      },
      {
        key: 'ci-gate',
        date: 'Feb 2025',
        title: 'CI pipeline with quality gate',
        shortTitle: 'CI',
        icon: ICON_MS,
        color: 'success',
        done: true,
      },
    ],
  },
  {
    key: 2,
    title: 'Component Library — Alpha',
    shortTitle: 'Library α',
    description:
      'Ship the first set of reusable MUI wrapper components with full Storybook coverage and Vitest tests.',
    date: 'Feb – Mar 2025',
    icon: ICON_CODE,
    color: 'primary',
    side: 'right',
    active: true,
    activeLabel: 'Now',
    milestones: [
      {
        key: 'theme-utils',
        date: 'Feb 2025',
        title: 'Theme token utilities',
        shortTitle: 'Theme utils',
        icon: ICON_MS,
        color: 'success',
        done: true,
      },
      {
        key: 'theme-preset',
        date: 'Mar 2025',
        title: 'Brand theme preset',
        shortTitle: 'Preset',
        icon: ICON_MS,
        color: 'primary',
      },
      {
        key: 'theme-provider',
        date: 'Apr 2025',
        title: 'GiselleThemeProvider',
        shortTitle: 'Provider',
        icon: ICON_MS,
        color: 'primary',
      },
    ],
  },
  {
    key: 3,
    title: 'API Integration Layer',
    shortTitle: 'API Layer',
    description:
      'Framework-agnostic data SDK: typed factories, builder utilities, and generic sample data.',
    date: 'May 2025',
    icon: ICON_ROCKET,
    color: 'secondary',
    side: 'left',
  },
  {
    key: 4,
    title: 'Documentation Site',
    shortTitle: 'Docs',
    description:
      'Docusaurus site with multi-instance plugin — one URL for all package documentation.',
    date: 'Jun 2025',
    icon: ICON_STAR,
    color: 'info',
    side: 'right',
    overdue: true,
  },
  {
    key: 5,
    title: 'Dashboard Component Suite',
    shortTitle: 'Dashboard',
    description:
      'Data widgets: chart cards, data tables, activity feeds, financial widgets, and hero banners.',
    date: 'Aug 2025',
    icon: ICON_CHECK,
    color: 'warning',
    side: 'left',
  },
];

// ----------------------------------------------------------------------

/**
 * Default rendering of all sample phases in a single-column accordion list.
 * Phase 1 (done) shows reduced opacity and a green dot.
 * Phase 2 (active) shows the full color dot.
 * Phase 4 (overdue) uses error color from the data.
 */
export const Default: Story = {
  args: { phases: SAMPLE_PHASES },
};

// ----------------------------------------------------------------------

/**
 * A phase with no description and no milestones renders as a non-expandable row —
 * no expand icon, no accordion details section. Tap target is inert.
 */
export const NoDetails: Story = {
  args: {
    phases: [
      {
        key: 1,
        title: 'Shipped — no details',
        date: 'Jan 2025',
        icon: ICON_CHECK,
        color: 'success',
        side: 'left',
        done: true,
      },
      {
        key: 2,
        title: 'Pending — description only',
        description: 'This phase has a description but no milestones.',
        date: 'Mar 2025',
        icon: ICON_BOX,
        color: 'primary',
        side: 'right',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Phases without description or milestones render as a flat non-expandable row. ' +
          'The chevron expand icon is omitted automatically. Phases with only a description ' +
          'but no milestones are still expandable.',
      },
    },
  },
};

// ----------------------------------------------------------------------

/**
 * All six MUI palette keys represented — verify each dot color renders distinctly.
 * Use this story to confirm palette wiring works correctly after a theme change.
 */
export const AllColors: Story = {
  args: {
    phases: (['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const).map(
      (color, i) => ({
        key: i + 1,
        title: `${color.charAt(0).toUpperCase()}${color.slice(1)} phase`,
        date: 'May 2025',
        icon: ICON_BOX,
        color,
        side: 'left' as const,
      })
    ),
  },
};

// ----------------------------------------------------------------------

/**
 * Rich details content demonstrates the new `TaskDetails` Option B shape:
 * the collapsed row uses a short preview sentence, while the modal can render
 * structured `ReactNode` content and nested follow-up tasks from `details`.
 */
export const RichDetailsContent: Story = {
  args: {
    phases: [
      {
        key: 1,
        title: 'Compact timeline refactor',
        shortTitle: 'Compact refactor',
        description:
          'Unify compact rows around recursive Task children so phases and milestones stop diverging.',
        date: 'May 2026',
        icon: ICON_CODE,
        color: 'warning',
        side: 'left',
        active: true,
        activeLabel: 'Now',
        children: [
          {
            key: 'task-details-renderer',
            title: 'TaskDetailsRenderer',
            shortTitle: 'Renderer',
            description:
              'Shared renderer for modal and future drawer surfaces using the same TaskDetails payload.',
            date: 'May 2026',
            icon: ICON_MS,
            color: 'warning',
            details: {
              content: (
                <Box sx={{ display: 'grid', gap: 1.5 }}>
                  <Typography variant="body2">
                    The collapsed row stays concise, but the details payload can now render rich
                    content without changing the task data shape.
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 3 }}>
                    <li>
                      <Typography variant="body2">Modal path uses the shared renderer.</Typography>
                    </li>
                    <li>
                      <Typography variant="body2">
                        DetailsDrawer can reuse it later unchanged.
                      </Typography>
                    </li>
                  </Box>
                </Box>
              ),
              tasks: [
                { key: 'renderer-modal', title: 'Use inside TaskDetailsModal', done: true },
                { key: 'renderer-drawer', title: 'Reuse later inside DetailsDrawer' },
              ],
            },
          },
        ],
      },
    ],
  },
};

// ----------------------------------------------------------------------

/**
 * Responsive story — verify layout at each MUI standard breakpoint.
 * The component is single-column at all widths; container width is the only variable.
 * Accordion title truncates correctly on very narrow (xs) viewports.
 */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => {
    const breakpoints: Array<{ label: string; width: number }> = [
      { label: 'xs — 360px', width: 360 },
      { label: 'sm — 600px', width: 600 },
      { label: 'md — 900px', width: 900 },
      { label: 'lg — 1200px', width: 1200 },
    ];
    return (
      <Box sx={responsiveWrapperSx}>
        {breakpoints.map(({ label, width }) => (
          <div key={label}>
            <Typography variant="overline" sx={breakpointLabelSx}>
              {label}
            </Typography>
            <Box sx={[breakpointContainerSx, { width, p: 1 }]}>
              <TimelineCompact phases={SAMPLE_PHASES.slice(0, 3)} />
            </Box>
          </div>
        ))}
      </Box>
    );
  },
};
