import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';

import { GiselleIcon } from './giselle-icon';

// ----------------------------------------------------------------------

const meta: Meta<typeof GiselleIcon> = {
  component: GiselleIcon,
  title: 'Components/GiselleIcon',
};

export default meta;
type Story = StoryObj<typeof GiselleIcon>;

// ----------------------------------------------------------------------

/** Default size (20px). */
export const Default: Story = {
  args: {
    icon: 'solar:rocket-bold-duotone',
  },
  argTypes: {
    sx: { control: false },
  },
};

/** Icon rendered at multiple sizes side by side. */
export const Sizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {([16, 20, 24, 32, 48] as const).map((size) => (
        <GiselleIcon key={size} icon="solar:rocket-bold-duotone" width={size} />
      ))}
    </Box>
  ),
};

/** Color override via `sx`. */
export const ColorOverride: Story = {
  render: () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {(
        [
          'primary.main',
          'secondary.main',
          'info.main',
          'success.main',
          'warning.main',
          'error.main',
        ] as const
      ).map((color) => (
        <GiselleIcon
          key={color}
          icon="solar:rocket-bold-duotone"
          width={32}
          sx={{ color: `var(--mui-palette-${color.replace('.', '-')})` }}
        />
      ))}
    </Box>
  ),
};

/** Flip and rotate variants. */
export const FlipAndRotate: Story = {
  render: () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <GiselleIcon icon="solar:arrow-right-bold-duotone" width={32} />
      <GiselleIcon icon="solar:arrow-right-bold-duotone" width={32} flip="horizontal" />
      <GiselleIcon icon="solar:arrow-right-bold-duotone" width={32} rotate={1} />
      <GiselleIcon icon="solar:arrow-right-bold-duotone" width={32} rotate={2} />
      <GiselleIcon icon="solar:arrow-right-bold-duotone" width={32} rotate={3} />
    </Box>
  ),
};
