import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';

import React from 'react';
import { motion } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import type { SystemStyleObject } from '@mui/system';
import type { Theme } from '@mui/material/styles';

import { MANGO_DARK_GROVE, MANGO_GOLD } from '../../../stories-defaults';
import { useScrollParallax } from './use-scroll-parallax';

// ----------------------------------------------------------------------

const LAYER_SIZES = [220, 170, 120, 76, 36];
const LAYER_OPACITIES = [0.07, 0.13, 0.22, 0.38, 0.72];

/** Demo container — deep-grove dark background with rounded corners. */
const parallaxContainerStyle: CSSProperties = {
  position: 'relative',
  height: 400,
  overflow: 'hidden',
  background: MANGO_DARK_GROVE,
  borderRadius: 12,
};

/** Overlay Box centred over the parallax layers — pointer-events disabled. */
const parallaxContentBoxSx: SystemStyleObject<Theme> = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 1,
  pointerEvents: 'none',
};

/** White title text on the dark demo background. */
const parallaxTitleSx: SystemStyleObject<Theme> = {
  color: 'common.white',
  fontWeight: 700,
};

/** Subdued white caption text — 60 % opacity — for dark demo backgrounds. */
const parallaxCaptionSx: SystemStyleObject<Theme> = {
  color: 'rgba(255, 255, 255, 0.6)',
};

/** Factory for a single floating parallax circle. */
function buildLayerStyle(
  y: MotionValue<number>,
  size: number,
  opacity: number
): Record<string, unknown> {
  return {
    y,
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: MANGO_GOLD,
    opacity,
    top: `calc(50% - ${size / 2}px)`,
    left: `calc(50% - ${size / 2}px)`,
  };
}

/**
 * Parallax demo rendered as a named component so the hook can be called
 * inside a stable React function (required by `react-hooks/rules-of-hooks`).
 */
function ScrollParallaxDemo() {
  const { ref, layers } = useScrollParallax();

  return (
    <div ref={ref} style={parallaxContainerStyle}>
      {layers.map((y, i) => (
        <motion.div
          key={i}
          style={buildLayerStyle(y, LAYER_SIZES[i] ?? 0, LAYER_OPACITIES[i] ?? 0)}
        />
      ))}

      <Box sx={parallaxContentBoxSx}>
        <Typography variant="h6" sx={parallaxTitleSx}>
          Scroll to see layers shift
        </Typography>
        <Typography variant="caption" sx={parallaxCaptionSx}>
          layers[0] ±40 px · · · layers[4] ±200 px
        </Typography>
      </Box>
    </div>
  );
}

// ----------------------------------------------------------------------

/**
 * Minimal host component so stories have a concrete TypeScript anchor.
 */
function ParallaxShowcase({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

const meta: Meta<typeof ParallaxShowcase> = {
  title: 'Motion/Use Scroll Parallax',
  component: ParallaxShowcase,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Spring-smoothed scroll parallax hook.\n\n' +
          'Returns a `ref` to attach to the tracked element and `layers` — ' +
          'five `MotionValue<number>` y-offsets that travel at increasing speeds ' +
          'as the element scrolls through the viewport:\n\n' +
          '- `layers[0]` — slowest (±40 px)\n' +
          '- `layers[2]` — mid (±120 px)\n' +
          '- `layers[4]` — fastest (±200 px)\n\n' +
          'Pass each layer to a `motion.*` element via `style={{ y: layers[n] }}`.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ParallaxShowcase>;

// ----------------------------------------------------------------------

/**
 * Default — attach `ref` to a container, apply `layers[n]` to nested elements.
 *
 * Scroll the page to see the concentric rings shift at different speeds.
 * `layers[4]` (smallest ring, highest opacity) travels the most — creating
 * a sense of depth as the element moves through the viewport.
 */
export const Default: Story = {
  render: () => <ScrollParallaxDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Five concentric rings driven by five parallax layers. ' +
          'Scroll the Storybook page to see the rings shift relative to each other. ' +
          'The outer ring (`layers[0]`) barely moves; the inner ring (`layers[4]`) travels the most.',
      },
    },
  },
};
