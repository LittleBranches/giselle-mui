import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import type { SystemStyleObject } from '@mui/system';
import type { Theme } from '@mui/material/styles';

import { BREAKPOINTS } from '../../stories-defaults';

import { ToggleIconButton } from './icon';

// ----------------------------------------------------------------------
// Inline SVG icons — no Iconify dependency, keeps stories self-contained.
// Paths: Material Design star-outline and star-filled (24 × 24 viewBox).
// ----------------------------------------------------------------------

const StarOutlineIcon = (
  <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 20 }}>
    <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73-1.64 7.03L12 17.27l6.18 3.73-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
  </SvgIcon>
);

const StarFilledIcon = (
  <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 20, color: 'warning.main' }}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </SvgIcon>
);

// ----------------------------------------------------------------------

const meta: Meta<typeof ToggleIconButton> = {
  title: 'Inputs/Toggle Icon Button',
  component: ToggleIconButton,
  argTypes: {
    idleIcon: { control: false },
    pressedIcon: { control: false },
    hoverIcon: { control: false },
    sx: { control: false },
    onPressedChange: { control: false },
  },
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof ToggleIconButton>;

// ---------------------------------------------------------------------------
// Default — custom idle icon, built-in pressed/hover defaults (green check)
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    pressed: false,
    idleIcon: StarOutlineIcon,
    'aria-label': 'Add to favourites',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Custom idle icon with the built-in green check circle defaults for pressed and hover states. Click to toggle — the idle icon is replaced by the built-in filled green check on press.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// AllCustomIcons — consumer provides all three icon states
// ---------------------------------------------------------------------------

export const AllCustomIcons: Story = {
  args: {
    pressed: false,
    idleIcon: StarOutlineIcon,
    pressedIcon: StarFilledIcon,
    hoverIcon: StarFilledIcon,
    'aria-label': 'Add to favourites',
  },
  parameters: {
    docs: {
      description: {
        story:
          'All three icon states supplied by the consumer. The star outline appears at idle, the filled gold star appears when pressed, and the filled star also appears on hover to signal interactivity.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// ControlledToggle — interactive demo with useState
// ---------------------------------------------------------------------------

function ControlledToggleDemo() {
  const [pressed, setPressed] = useState(false);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <ToggleIconButton
        pressed={pressed}
        idleIcon={StarOutlineIcon}
        pressedIcon={StarFilledIcon}
        hoverIcon={StarFilledIcon}
        onPressedChange={setPressed}
        aria-label={pressed ? 'Remove from favourites' : 'Add to favourites'}
      />
      <Typography variant="body2" color="text.secondary">
        {pressed ? 'Favourited' : 'Not favourited'}
      </Typography>
    </Box>
  );
}

export const ControlledToggle: Story = {
  render: () => <ControlledToggleDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Controlled toggle: click the star to toggle. The `aria-label` updates with the state to communicate the **next** action — "Add to favourites" when unpressed, "Remove from favourites" when pressed.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Responsive — component at each MUI breakpoint width
// ---------------------------------------------------------------------------

const responsiveRowSx = (width: number): SystemStyleObject<Theme> => ({
  width,
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  p: 1,
  border: '1px dashed',
  borderColor: 'divider',
});

function ResponsiveDemo() {
  const [pressed, setPressed] = useState(false);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {BREAKPOINTS.map(({ label, width }) => (
        <Box key={label} sx={responsiveRowSx(width)}>
          <Typography variant="caption" sx={{ width: 120, flexShrink: 0 }}>
            {label}
          </Typography>
          <ToggleIconButton
            pressed={pressed}
            idleIcon={StarOutlineIcon}
            pressedIcon={StarFilledIcon}
            hoverIcon={StarFilledIcon}
            onPressedChange={setPressed}
            aria-label={pressed ? 'Remove from favourites' : 'Add to favourites'}
          />
        </Box>
      ))}
    </Box>
  );
}

export const Responsive: Story = {
  render: () => <ResponsiveDemo />,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Component rendered inside labeled containers at each MUI standard breakpoint width. The button itself is a fixed-size element and renders identically at all widths.',
      },
    },
  },
};
