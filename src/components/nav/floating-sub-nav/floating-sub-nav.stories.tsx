import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import { Icon } from '@iconify/react';

import { FloatingSubNav } from './floating-sub-nav';

// ----------------------------------------------------------------------

const meta: Meta<typeof FloatingSubNav> = {
  title: 'Nav/FloatingSubNav',
  component: FloatingSubNav,
  parameters: { layout: 'centered' },
  argTypes: {
    items: { control: false },
    onSelect: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof FloatingSubNav>;

// ----------------------------------------------------------------------

const ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <Icon icon="solar:home-2-bold-duotone" width={22} />,
  },
  {
    id: 'features',
    label: 'Features',
    icon: <Icon icon="solar:list-bold-duotone" width={22} />,
  },
  {
    id: 'pricing',
    label: 'Pricing',
    icon: <Icon icon="solar:tag-price-bold-duotone" width={22} />,
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: <Icon icon="solar:letter-bold-duotone" width={22} />,
  },
];

/** Fixed variant (default) — renders at the bottom of the viewport. In Storybook canvas the pill floats at the bottom of the preview area. */
export const Fixed: Story = {
  args: {
    items: ITEMS,
    activeId: 'overview',
    onSelect: () => {},
    sticky: false,
  },
  render: (args) => (
    <Box sx={{ height: 400, position: 'relative', width: 600, maxWidth: '100%' }}>
      <FloatingSubNav {...args} />
    </Box>
  ),
};

/** Sticky variant — constrained to the parent container's bottom edge. */
export const Sticky: Story = {
  args: {
    items: ITEMS,
    activeId: 'features',
    onSelect: () => {},
    sticky: true,
  },
  render: (args) => (
    <Box
      sx={{
        height: 400,
        overflow: 'auto',
        position: 'relative',
        width: 600,
        maxWidth: '100%',
        border: '1px dashed',
        borderColor: 'divider',
        p: 2,
      }}
    >
      <Box sx={{ height: 300 }} />
      <FloatingSubNav {...args} />
    </Box>
  ),
};

/** Hidden — `activeId={null}` hides the pill. */
export const Hidden: Story = {
  args: {
    items: ITEMS,
    activeId: null,
    onSelect: () => {},
  },
};
