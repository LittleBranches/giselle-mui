import type { Meta, StoryObj } from '@storybook/react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { GiselleIcon } from '../icon/giselle';
import { TechIconStrip } from './tech-icon-strip';
import type { TechIconItem } from './types';

// ----------------------------------------------------------------------

const DEMO_ITEMS: TechIconItem[] = [
  { icon: <GiselleIcon icon="solar:code-bold" width={32} />, label: 'Frontend' },
  { icon: <GiselleIcon icon="solar:server-bold" width={32} />, label: 'Backend' },
  { icon: <GiselleIcon icon="solar:database-bold" width={32} />, label: 'Database' },
  { icon: <GiselleIcon icon="solar:monitor-bold" width={32} />, label: 'Desktop' },
  { icon: <GiselleIcon icon="solar:layers-minimalistic-bold" width={32} />, label: 'Layers' },
  { icon: <GiselleIcon icon="solar:shield-check-bold" width={32} />, label: 'Security' },
  { icon: <GiselleIcon icon="solar:code-square-bold" width={32} />, label: 'API' },
  { icon: <GiselleIcon icon="solar:box-bold" width={32} />, label: 'Build' },
];

// ----------------------------------------------------------------------

const meta: Meta<typeof TechIconStrip> = {
  title: 'Data Display/Tech Icon Strip',
  component: TechIconStrip,
  argTypes: {
    items: { control: false },
    sx: { control: false },
  },
  args: {
    items: DEMO_ITEMS.slice(0, 5),
    centeredWrap: false,
  },
};

export default meta;

type Story = StoryObj<typeof TechIconStrip>;

// ----------------------------------------------------------------------

export const Default: Story = {};

// ----------------------------------------------------------------------

/** With an overline section title above the strip. */
export const WithTitle: Story = {
  args: {
    title: 'Technologies',
    items: DEMO_ITEMS,
  },
};

// ----------------------------------------------------------------------

/**
 * Items are centred in the available width rather than left-aligned.
 * Use for hero sections or single-column layouts where a left-aligned
 * strip would look unbalanced.
 */
export const CenteredWrap: Story = {
  args: {
    title: 'Built with',
    items: DEMO_ITEMS,
    centeredWrap: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `centeredWrap` is `true`, the flex wrapper uses `justifyContent: center`. Resize the viewport to see items wrap centred.',
      },
    },
  },
};

// ----------------------------------------------------------------------

function ResponsiveDemo() {
  return (
    <Stack spacing={2}>
      {([360, 600, 900, 1200] as const).map((width) => (
        <div key={width}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'text.secondary' }}>
            {width}px
          </Typography>
          <Box sx={{ width, border: '1px dashed', borderColor: 'divider', p: 2 }}>
            <TechIconStrip title="Stack" items={DEMO_ITEMS} />
          </Box>
        </div>
      ))}
    </Stack>
  );
}

/**
 * Shows the strip at the four MUI standard breakpoint widths.
 * Items wrap automatically when the container is narrower than the total strip width.
 */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => <ResponsiveDemo />,
};
