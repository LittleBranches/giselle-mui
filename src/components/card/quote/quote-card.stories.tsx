import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import type { SxProps } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

import {
  breakpointContainerSx,
  breakpointLabelSx,
  responsiveWrapperSx,
  BREAKPOINTS,
} from '../../../stories-defaults';
import { QuoteCard } from './quote-card';

// ----------------------------------------------------------------------

type QuoteColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

const ALL_COLORS: QuoteColor[] = ['primary', 'secondary', 'info', 'success', 'warning', 'error'];

const allColorsGridSx: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 380px)',
  gap: 2,
};

const breakpointPaddedSx = (width: number): SxProps<Theme> => [
  breakpointContainerSx,
  { p: 1, width },
];

const SAMPLE_QUOTE =
  'Alex transformed our legacy system into a maintainable, modern React platform. The quality of the architecture and the attention to detail were exceptional.';

const SHORT_QUOTE = 'Excellent work, delivered on time.';

const meta: Meta<typeof QuoteCard> = {
  component: QuoteCard,
  title: 'Cards/Quote',
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
    <Box sx={allColorsGridSx}>
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

/** Card rendered at each MUI standard breakpoint container width (xs → lg). */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Box sx={responsiveWrapperSx}>
      {BREAKPOINTS.map(({ label, width }) => (
        <div key={width}>
          <Typography variant="caption" sx={breakpointLabelSx}>
            {label}
          </Typography>
          <Box sx={breakpointPaddedSx(width)}>
            <QuoteCard quote={SAMPLE_QUOTE} author="Jane Smith" source="Platform Team" />
          </Box>
        </div>
      ))}
    </Box>
  ),
};
