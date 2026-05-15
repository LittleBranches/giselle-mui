import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import type { SystemStyleObject } from '@mui/system';
import type { Theme } from '@mui/material/styles';

import { dotColumnSx } from '../../../../stories-defaults';
import { GiselleIcon } from '../../../icon/giselle/giselle-icon';
import { TimelineDot } from './timeline-dot';
import type { HighlightedPaletteKey } from '../types';

// ----------------------------------------------------------------------

const meta: Meta<typeof TimelineDot> = {
  component: TimelineDot,
  title: 'Giselle MUI/Timeline/Dot',
};

export default meta;
type Story = StoryObj<typeof TimelineDot>;

// ----------------------------------------------------------------------

const ALL_COLORS: HighlightedPaletteKey[] = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
];

const PHASE_ICON = <GiselleIcon icon="solar:code-bold-duotone" width={18} />;
const MILESTONE_ICON = <GiselleIcon icon="solar:flag-bold" width={14} />;

const colorRowSx: SystemStyleObject<Theme> = {
  display: 'flex',
  gap: 3,
  flexWrap: 'wrap',
  alignItems: 'center',
};

const colorRowActiveSx: SystemStyleObject<Theme> = {
  display: 'flex',
  gap: 4,
  flexWrap: 'wrap',
  alignItems: 'center',
  p: 3,
};

// ----------------------------------------------------------------------

/** Named helper so useState inside the render function is a valid hook call. */
function ChecklistPhaseDemo() {
  const [done, setDone] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  return (
    <Box sx={dotColumnSx}>
      <TimelineDot
        icon={PHASE_ICON}
        color="primary"
        done={done}
        animationKey={animKey}
        onClick={() => {
          setDone((v) => !v);
          setAnimKey((k) => k + 1);
        }}
        role="checkbox"
        aria-checked={done}
        aria-label="Mark phase as done"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setDone((v) => !v);
            setAnimKey((k) => k + 1);
          }
        }}
      />
      <Typography variant="caption" color="text.secondary">
        {done ? 'Done ✓ (click to undo)' : 'Click to mark done'}
      </Typography>
    </Box>
  );
}

/** Named helper for checklist milestone demo. */
function ChecklistMilestoneDemo() {
  const [done, setDone] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  return (
    <Box sx={dotColumnSx}>
      <TimelineDot
        icon={MILESTONE_ICON}
        color="success"
        size="milestone"
        done={done}
        animationKey={animKey}
        onClick={() => {
          setDone((v) => !v);
          setAnimKey((k) => k + 1);
        }}
        role="checkbox"
        aria-checked={done}
        aria-label="Mark milestone as done"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setDone((v) => !v);
            setAnimKey((k) => k + 1);
          }
        }}
      />
      <Typography variant="caption" color="text.secondary">
        {done ? 'Done ✓' : 'Click'}
      </Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

/**
 * Default (read-only) phase dot — filled circle with icon, no interaction.
 */
export const Default: Story = {
  args: {
    icon: PHASE_ICON,
    color: 'primary',
  },
  argTypes: {
    icon: { control: false },
    sx: { control: false },
  },
};

/**
 * Active phase dot — enlarged to 40 px with a pulsing ring halo.
 * The ring requires `overflow: visible` on the outer Box to be visible;
 * it extends 5 px outside the dot boundary via `inset: -5` on `::after`.
 */
export const Active: Story = {
  render: () => (
    // Extra padding so the pulsing ring (which extends 5px outside) is not cropped.
    <Box sx={{ p: 3, display: 'inline-flex' }}>
      <TimelineDot icon={PHASE_ICON} color="primary" active />
    </Box>
  ),
};

/**
 * Done phase dot — transparent circle with coloured border and animated checkmark.
 */
export const DonePhase: Story = {
  args: {
    icon: PHASE_ICON,
    color: 'primary',
    done: true,
  },
  argTypes: {
    icon: { control: false },
    sx: { control: false },
  },
};

/**
 * Milestone size — smaller filled dot (30 px) placed on the spine between phases.
 */
export const MilestoneDefault: Story = {
  args: {
    icon: MILESTONE_ICON,
    color: 'success',
    size: 'milestone',
  },
  argTypes: {
    icon: { control: false },
    sx: { control: false },
  },
};

/**
 * Milestone done — filled circle with checkmark (milestone dots stay filled when done).
 */
export const MilestoneDone: Story = {
  args: {
    icon: MILESTONE_ICON,
    color: 'success',
    size: 'milestone',
    done: true,
  },
  argTypes: {
    icon: { control: false },
    sx: { control: false },
  },
};

/**
 * Checklist interaction for a phase dot — click to toggle done / undone.
 * Inspect the aria-checked attribute in the DOM panel.
 */
export const ChecklistPhase: Story = {
  render: () => <ChecklistPhaseDemo />,
};

/**
 * Checklist interaction for a milestone dot — click to toggle done / undone.
 */
export const ChecklistMilestone: Story = {
  render: () => <ChecklistMilestoneDemo />,
};

/**
 * All six MUI palette colours — phase size, default state.
 * Every colour must be represented to verify the palette-key abstraction.
 */
export const AllColors: Story = {
  render: () => (
    <Box sx={colorRowSx}>
      {ALL_COLORS.map((color) => (
        <Box key={color} sx={dotColumnSx}>
          <TimelineDot icon={PHASE_ICON} color={color} />
          <Typography variant="caption" color="text.secondary">
            {color}
          </Typography>
        </Box>
      ))}
    </Box>
  ),
};

/**
 * All six MUI palette colours — active state with pulsing ring.
 */
export const AllColorsActive: Story = {
  render: () => (
    <Box sx={colorRowActiveSx}>
      {ALL_COLORS.map((color) => (
        <Box key={color} sx={dotColumnSx}>
          <TimelineDot icon={PHASE_ICON} color={color} active />
          <Typography variant="caption" color="text.secondary">
            {color}
          </Typography>
        </Box>
      ))}
    </Box>
  ),
};
