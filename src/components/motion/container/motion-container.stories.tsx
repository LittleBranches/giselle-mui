import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { fade } from '../variants/fade';
import { slide } from '../variants/slide';
import { MotionContainer } from './motion-container';

// ----------------------------------------------------------------------

const meta: Meta<typeof MotionContainer> = {
  title: 'Motion/Container',
  component: MotionContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Stagger wrapper that distributes framer-motion animation over its children. ' +
          'Uses `container()` variants so children only need `fade()`, `slide()`, or any other ' +
          'variant factory — no manual stagger math required.',
      },
    },
  },
  argTypes: {
    sx: { control: false },
    children: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof MotionContainer>;

// ----------------------------------------------------------------------

const ITEMS = ['Design', 'Engineering', 'Deployment', 'Monitoring'];

/**
 * Default — children stagger in using `fade('inUp')`.
 * Each item is delayed by 50 ms from the previous.
 */
export const FadeInUp: Story = {
  render: () => (
    <MotionContainer>
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
    </MotionContainer>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Children stagger in from below using `fade("inUp", { distance: 24 })`. ' +
          'Observe that items appear sequentially — not all at once.',
      },
    },
  },
};

/**
 * SlideInLeft — children enter from the left side.
 * Demonstrates that any variant factory works with `MotionContainer`.
 */
export const SlideInLeft: Story = {
  render: () => (
    <MotionContainer>
      {ITEMS.map((label) => (
        <Box
          key={label}
          component={motion.div}
          variants={slide('inLeft', { distance: 80 })}
          sx={{ py: 1 }}
        >
          <Typography>{label}</Typography>
        </Box>
      ))}
    </MotionContainer>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Children stagger in from the left using `slide("inLeft", { distance: 80 })`. ' +
          'The container does not care which variant factory is used.',
      },
    },
  },
};

/**
 * ActionMode — the `action` prop lets a parent toggle between animate and exit states.
 * The animate prop controls which state plays.
 */
function ActionModeDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Box>
      <button onClick={() => setIsOpen((v) => !v)} style={{ marginBottom: 16 }}>
        {isOpen ? 'Close' : 'Open'}
      </button>
      <MotionContainer action animate={isOpen}>
        {ITEMS.map((label) => (
          <Box
            key={label}
            component={motion.div}
            variants={fade('inUp', { distance: 16 })}
            sx={{ py: 1 }}
          >
            <Typography>{label}</Typography>
          </Box>
        ))}
      </MotionContainer>
    </Box>
  );
}

export const ActionMode: Story = {
  render: () => <ActionModeDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'With `action={true}`, the `animate` boolean prop toggles between the `"animate"` ' +
          'and `"exit"` variant states. Toggle the button to see items enter and leave.',
      },
    },
  },
};
