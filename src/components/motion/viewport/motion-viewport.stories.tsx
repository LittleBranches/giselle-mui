import type { Meta, StoryObj } from '@storybook/react';

import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { fade } from '../variants/fade';
import { slide } from '../variants/slide';
import { MotionViewport } from './motion-viewport';

// ----------------------------------------------------------------------

const meta: Meta<typeof MotionViewport> = {
  title: 'Motion/Viewport',
  component: MotionViewport,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Scroll-triggered stagger container. Fires once when the element enters the viewport.\n\n' +
          'Unlike `MotionContainer` (which fires on mount), `MotionViewport` fires on scroll — ' +
          'ideal for below-the-fold content sections. On `sm` and below, animation is ' +
          'skipped by default (`disableAnimateOnMobile={true}`) to prevent content from ' +
          'appearing invisible when the section is already in view on short mobile viewports.',
      },
    },
  },
  argTypes: {
    sx: { control: false },
    children: { control: false },
    viewport: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof MotionViewport>;

// ----------------------------------------------------------------------

const ITEMS = ['Design', 'Engineering', 'Deployment', 'Monitoring'];

/**
 * Default — children stagger in with `fade('inUp')` when the container enters the viewport.
 *
 * `disableAnimateOnMobile={false}` ensures the animation always plays in the
 * Storybook canvas. In production the default is `true` — animation is skipped
 * on `sm` and below.
 */
export const Default: Story = {
  render: () => (
    <MotionViewport disableAnimateOnMobile={false}>
      {ITEMS.map((label) => (
        <Box
          key={label}
          component={motion.div}
          variants={fade('inUp', { distance: 24 })}
          sx={{ py: 1 }}
        >
          <Typography>{label}</Typography>
        </Box>
      ))}
    </MotionViewport>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Children stagger in from below when the container enters the viewport. ' +
          'Each child needs `variants` from any variant factory — the container ' +
          'drives the stagger timing.',
      },
    },
  },
};

/**
 * SlideInLeft — demonstrates that any variant factory works with `MotionViewport`.
 */
export const SlideInLeft: Story = {
  render: () => (
    <MotionViewport disableAnimateOnMobile={false}>
      {ITEMS.map((label) => (
        <Box
          key={label}
          component={motion.div}
          variants={slide('inLeft', { distance: 60 })}
          sx={{ py: 1 }}
        >
          <Typography>{label}</Typography>
        </Box>
      ))}
    </MotionViewport>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Any variant factory works — swap `fade` for `slide`, `bounce`, `zoom`, or any other.',
      },
    },
  },
};

/**
 * CustomViewport — fine-tunes when the animation triggers using the `viewport` prop.
 *
 * A negative `margin` shifts the trigger point inward so the animation fires
 * when the element is meaningfully visible — not just entering at the edge.
 */
export const CustomViewport: Story = {
  render: () => (
    <MotionViewport disableAnimateOnMobile={false} viewport={{ once: true, margin: '-100px' }}>
      {ITEMS.map((label) => (
        <Box key={label} component={motion.div} variants={fade('inUp')} sx={{ py: 1 }}>
          <Typography>{label}</Typography>
        </Box>
      ))}
    </MotionViewport>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`viewport={{ once: true, margin: "-100px" }}` fires the animation when the element ' +
          'is 100 px inside the viewport — not at the edge. Useful for sections that should ' +
          'only animate when meaningfully visible.',
      },
    },
  },
};

/**
 * Responsive — `MotionViewport` at xs (360 px), sm (600 px), md (900 px), and lg (1200 px).
 */
export const Responsive: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {[360, 600, 900, 1200].map((width) => (
        <Box key={width}>
          <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
            {width}px
          </Typography>
          <Box sx={{ width, border: '1px dashed', borderColor: 'divider', p: 1 }}>
            <MotionViewport disableAnimateOnMobile={false}>
              {ITEMS.map((label) => (
                <Box
                  key={label}
                  component={motion.div}
                  variants={fade('inUp', { distance: 16 })}
                  sx={{ py: 0.5 }}
                >
                  <Typography variant="body2">{label}</Typography>
                </Box>
              ))}
            </MotionViewport>
          </Box>
        </Box>
      ))}
    </Box>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'At all breakpoints `MotionViewport` behaves identically — it is a transparent ' +
          'wrapper with no layout opinions of its own.',
      },
    },
  },
};
