import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { QuoteCard } from './quote-card';

// ----------------------------------------------------------------------

type QuoteColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

const ALL_COLORS: QuoteColor[] = ['primary', 'secondary', 'info', 'success', 'warning', 'error'];

const SAMPLE_QUOTE =
  'Alex transformed our legacy system into a maintainable, modern React platform. The quality of the architecture and the attention to detail were exceptional.';

const SHORT_QUOTE = 'Excellent work, delivered on time.';

const meta: Meta<typeof QuoteCard> = {
  component: QuoteCard,
  title: 'Components/QuoteCard',
};

export default meta;
type Story = StoryObj<typeof QuoteCard>;

// ----------------------------------------------------------------------

/** Full card with author, source, and default primary color. */
export const Default: Story = {
  args: {
    quote: SAMPLE_QUOTE,
    author: 'Jane Smith',
    source: 'Platform Team',
    color: 'primary',
    sx: { maxWidth: 440 },
  },
  argTypes: {
    sx: { control: false },
  },
};

/** All six palette color variants — light/dark mode adaptive. */
export const AllColors: Story = {
  render: () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 380px)', gap: 2 }}>
      {ALL_COLORS.map((color) => (
        <QuoteCard
          key={color}
          quote={SAMPLE_QUOTE}
          author="Jane Smith"
          source="Platform Team"
          color={color}
        />
      ))}
    </Box>
  ),
};

/** Without attribution — quote-only form. */
export const NoAttribution: Story = {
  args: {
    quote: SHORT_QUOTE,
    color: 'info',
    sx: { maxWidth: 380 },
  },
  argTypes: {
    sx: { control: false },
  },
};

/** With author but without source — separator dot is hidden. */
export const AuthorOnly: Story = {
  args: {
    quote: SAMPLE_QUOTE,
    author: 'Jane Smith',
    color: 'success',
    sx: { maxWidth: 440 },
  },
  argTypes: {
    sx: { control: false },
  },
};

// ----------------------------------------------------------------------

const BREAKPOINTS = [
  { label: 'xs — 360px', width: 360 },
  { label: 'sm — 600px', width: 600 },
  { label: 'md — 900px', width: 900 },
  { label: 'lg — 1200px', width: 1200 },
];

/** Card rendered at each MUI standard breakpoint container width (xs → lg). */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {BREAKPOINTS.map(({ label, width }) => (
        <Box key={width}>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
            {label}
          </Typography>
          <Box sx={{ width, border: '1px dashed', borderColor: 'divider', p: 1 }}>
            <QuoteCard quote={SAMPLE_QUOTE} author="Jane Smith" source="Platform Team" />
          </Box>
        </Box>
      ))}
    </Box>
  ),
};
