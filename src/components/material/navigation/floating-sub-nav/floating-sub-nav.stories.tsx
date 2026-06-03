import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import type { SystemStyleObject } from '@mui/system';
import type { Theme } from '@mui/material/styles';

import {
  breakpointLabelSx,
  buildBreakpointMaxWidthSx,
  responsiveWrapperSx,
} from '../../../../stories-defaults';
import { GiselleIcon } from '../../data-display/icon/giselle';
import { FloatingSubNav } from './floating-sub-nav';

// ----------------------------------------------------------------------

const meta: Meta<typeof FloatingSubNav> = {
  title: 'Material/Navigation/Floating Sub Nav',
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

const demoContainerSx: SystemStyleObject<Theme> = {
  height: 400,
  position: 'relative',
  width: 600,
  maxWidth: '100%',
};

const stickyDemoContainerSx: SystemStyleObject<Theme> = {
  height: 400,
  overflow: 'auto',
  position: 'relative',
  width: 600,
  maxWidth: '100%',
  border: '1px dashed',
  borderColor: 'divider',
  p: 2,
};

const scrollSpacerSx: SystemStyleObject<Theme> = {
  height: 300,
};

const navPreviewSx: SystemStyleObject<Theme> = {
  position: 'relative',
  height: 100,
};

const ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <GiselleIcon icon="solar:home-2-bold-duotone" width={22} />,
  },
  {
    id: 'features',
    label: 'Features',
    icon: <GiselleIcon icon="solar:list-bold-duotone" width={22} />,
  },
  {
    id: 'pricing',
    label: 'Pricing',
    icon: <GiselleIcon icon="solar:tag-price-bold-duotone" width={22} />,
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: <GiselleIcon icon="solar:letter-bold-duotone" width={22} />,
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
    <Box sx={demoContainerSx}>
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
    <Box sx={stickyDemoContainerSx}>
      <Box sx={scrollSpacerSx} />
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

/**
 * Responsive — verify `FloatingSubNav` renders correctly at each standard MUI breakpoint.
 * Uses `sticky` mode so the pill sits at the bottom of its container, making it
 * measurable at a fixed width without requiring a full viewport simulation.
 */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Box sx={responsiveWrapperSx}>
      {([360, 600, 900, 1200] as const).map((width) => (
        <div key={width}>
          <Typography variant="caption" sx={breakpointLabelSx}>
            {width}px
          </Typography>
          <Box sx={[buildBreakpointMaxWidthSx(width), navPreviewSx]}>
            <FloatingSubNav items={ITEMS} activeId="overview" onSelect={() => {}} sticky />
          </Box>
        </div>
      ))}
    </Box>
  ),
};
