import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { hover, tap } from './actions';

// ----------------------------------------------------------------------

/**
 * Minimal host component so stories have a concrete TypeScript anchor.
 */
function ActionsShowcase({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

const meta: Meta<typeof ActionsShowcase> = {
  title: 'Motion/Variants/Actions',
  component: ActionsShowcase,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Interaction animation helpers for `whileHover` and `whileTap` motion states.\n\n' +
          '- `hover(scale?)` — returns `{ scale }` for `whileHover`. Default scale: **1.09**.\n' +
          '- `tap(scale?)` — returns `{ scale }` for `whileTap`. Default scale: **0.9**.\n\n' +
          'Combine with `transitionHover()` or `transitionTap()` for fine-grained easing.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ActionsShowcase>;

// ----------------------------------------------------------------------

const demoBoxStyle: React.CSSProperties = {
  width: 96,
  height: 96,
  borderRadius: 8,
  background: 'var(--mui-palette-primary-main)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  userSelect: 'none',
};

const labelStyle: React.CSSProperties = {
  color: 'var(--mui-palette-primary-contrastText)',
  fontSize: '0.7rem',
  fontWeight: 600,
  textAlign: 'center',
  padding: '0 4px',
};

/**
 * HoverAndTap — interact with each box in the canvas.
 *
 * - Hover to see the scale-up effect.
 * - Click / press to see the scale-down (tap) effect.
 * - The third box uses only `whileTap` — no hover scale.
 */
export const HoverAndTap: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
        <motion.div whileHover={hover()} whileTap={tap()} style={demoBoxStyle}>
          <span style={labelStyle}>hover + tap</span>
        </motion.div>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {'hover() tap()'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
        <motion.div whileHover={hover(1.15)} whileTap={tap(0.85)} style={demoBoxStyle}>
          <span style={labelStyle}>1.15 / 0.85</span>
        </motion.div>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {'hover(1.15) tap(0.85)'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
        <motion.div
          whileHover={hover(1.04)}
          style={{ ...demoBoxStyle, background: 'var(--mui-palette-secondary-main)' }}
        >
          <span style={labelStyle}>subtle hover</span>
        </motion.div>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {'hover(1.04)'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
        <motion.div
          whileTap={tap(0.9)}
          style={{ ...demoBoxStyle, background: 'var(--mui-palette-success-main)' }}
        >
          <span style={labelStyle}>tap only</span>
        </motion.div>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {'tap(0.9)'}
        </Typography>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Hover over or click (tap) each box to see the scale animation. ' +
          '`hover()` and `tap()` are passed directly to `whileHover` and `whileTap` on any ' +
          '`motion.*` element — no wrapper component required.',
      },
    },
  },
};
