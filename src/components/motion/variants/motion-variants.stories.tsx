import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { MotionContainer } from '../container';
import { fade } from './fade';
import { slide } from './slide';
import { bounce } from './bounce';
import { scale } from './scale';
import { rotate } from './rotate';
import { flip } from './flip';
import { zoom } from './zoom';

// ----------------------------------------------------------------------

/**
 * Minimal host component used as the `meta.component` anchor so TypeScript
 * can infer `StoryObj` without referencing the variant factories directly.
 */
function VariantShowcase({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

const meta: Meta<typeof VariantShowcase> = {
  title: 'Giselle MUI/Motion/Variants',
  component: VariantShowcase,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Animation variant factories for framer-motion.\n\n' +
          'Each factory returns a `Variants` object with `initial`, `animate`, and `exit` keys. ' +
          'Use them inside a `MotionContainer` or `MotionViewport` (which drives the ' +
          '`initial`/`animate` state), or set `initial="initial" animate="animate"` directly ' +
          'on a `motion.div`.\n\n' +
          '- **`fade`** — opacity + optional translate (10 directions)\n' +
          '- **`slide`** — pure translate, no opacity (8 directions)\n' +
          '- **`bounce`** — spring-style multi-keyframe (10 directions)\n' +
          '- **`scale`** — scale + opacity (6 directions)\n' +
          '- **`rotate`** — rotate + opacity (2 directions)\n' +
          '- **`flip`** — 3D rotation on X or Y axis (4 directions)\n' +
          '- **`zoom`** — scale + translate (10 directions)',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof VariantShowcase>;

// ----------------------------------------------------------------------

const DEMO_BOX_SX = {
  width: 72,
  height: 72,
  borderRadius: 1,
  bgcolor: 'primary.main',
};

/**
 * Fade — opacity + optional directional translate.
 *
 * 10 directions: `in`, `inUp`, `inDown`, `inLeft`, `inRight`,
 * `out`, `outUp`, `outDown`, `outLeft`, `outRight`.
 * Only enter directions shown below.
 */
export const Fade: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {(['in', 'inUp', 'inDown', 'inLeft', 'inRight'] as const).map((dir) => (
        <Box
          key={dir}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
        >
          <MotionContainer>
            <Box component={motion.div} variants={fade(dir)} sx={DEMO_BOX_SX} />
          </MotionContainer>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {dir}
          </Typography>
        </Box>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Fades from transparent to opaque, with an optional directional translate. ' +
          'Accepts an `options.distance` override (default: 24 px).',
      },
    },
  },
};

/**
 * Slide — pure positional translate with no opacity change.
 *
 * 8 directions: `inUp`, `inDown`, `inLeft`, `inRight`, `outUp`, `outDown`, `outLeft`, `outRight`.
 */
export const Slide: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {(['inUp', 'inDown', 'inLeft', 'inRight'] as const).map((dir) => (
        <Box
          key={dir}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
        >
          <MotionContainer>
            <Box component={motion.div} variants={slide(dir)} sx={DEMO_BOX_SX} />
          </MotionContainer>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {dir}
          </Typography>
        </Box>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Pure position — no fade. The box is always fully opaque; ' +
          'only its position animates. Use when you want visible motion without opacity.',
      },
    },
  },
};

/**
 * Bounce — spring-style multi-keyframe animation with overshoot.
 *
 * 10 directions: `in`, `inUp`, `inDown`, `inLeft`, `inRight`, and their `out` counterparts.
 */
export const Bounce: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {(['in', 'inUp', 'inDown', 'inLeft', 'inRight'] as const).map((dir) => (
        <Box
          key={dir}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
        >
          <MotionContainer>
            <Box component={motion.div} variants={bounce(dir)} sx={DEMO_BOX_SX} />
          </MotionContainer>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {dir}
          </Typography>
        </Box>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Multi-keyframe animation with an overshoot feel. ' +
          'Use for playful or attention-drawing interactions — ' +
          'cards, badges, CTAs that need to stand out.',
      },
    },
  },
};

/**
 * Scale — scales from 0 (or axis-specific) to full size.
 *
 * 6 directions: `in`, `inX`, `inY`, `out`, `outX`, `outY`.
 */
export const Scale: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {(['in', 'inX', 'inY'] as const).map((dir) => (
        <Box
          key={dir}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
        >
          <MotionContainer>
            <Box component={motion.div} variants={scale(dir)} sx={DEMO_BOX_SX} />
          </MotionContainer>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {dir}
          </Typography>
        </Box>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`in` — scales from 0 on both axes. ' +
          '`inX` — only the horizontal axis animates. ' +
          '`inY` — only the vertical axis animates.',
      },
    },
  },
};

/**
 * Rotate — rotates in from a negative angle, fading in simultaneously.
 *
 * 2 directions: `in` (rotate in) and `out` (rotate out).
 */
export const Rotate: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {(['in'] as const).map((dir) => (
        <Box
          key={dir}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
        >
          <MotionContainer>
            <Box component={motion.div} variants={rotate(dir)} sx={DEMO_BOX_SX} />
          </MotionContainer>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {dir}
          </Typography>
        </Box>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Rotates from a small negative angle to 0° while fading in. ' +
          'The default angle is configurable via `options.deg`. ' +
          'Use for icon reveals, badge entrances, or decorative elements.',
      },
    },
  },
};

/**
 * Flip — 3D rotation on the X or Y axis (perspective flip).
 *
 * 4 directions: `inX`, `inY`, `outX`, `outY`.
 */
export const Flip: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {(['inX', 'inY'] as const).map((dir) => (
        <Box
          key={dir}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
        >
          <MotionContainer>
            <Box component={motion.div} variants={flip(dir)} sx={DEMO_BOX_SX} />
          </MotionContainer>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {dir}
          </Typography>
        </Box>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Perspective flip on the X axis (`inX` — top/bottom spin) or Y axis ' +
          '(`inY` — left/right spin). Requires `perspective` on the parent to ' +
          'look convincingly 3D.',
      },
    },
  },
};

/**
 * Zoom — scale + directional translate combined.
 *
 * 10 directions: `in`, `inUp`, `inDown`, `inLeft`, `inRight`, and their `out` counterparts.
 */
export const Zoom: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {(['in', 'inUp', 'inDown', 'inLeft', 'inRight'] as const).map((dir) => (
        <Box
          key={dir}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
        >
          <MotionContainer>
            <Box component={motion.div} variants={zoom(dir)} sx={DEMO_BOX_SX} />
          </MotionContainer>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {dir}
          </Typography>
        </Box>
      ))}
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Scale + translate combined. Feels more energetic than `fade` alone. ' +
          'The `in` direction scales from 0; directional variants also travel ' +
          'from their respective edges.',
      },
    },
  },
};
