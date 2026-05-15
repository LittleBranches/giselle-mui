import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { buildBreakpointWidthSx, breakpointLabelSx, BREAKPOINTS } from '../../stories-defaults';
import { SectionTitle, SectionCaption } from './section-title';

// ----------------------------------------------------------------------

const meta: Meta<typeof SectionTitle> = {
  title: 'Layout/Section Title',
  component: SectionTitle,
  parameters: { layout: 'padded' },
  argTypes: {
    slotProps: { control: false },
    sx: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof SectionTitle>;

// ----------------------------------------------------------------------

/** Full composition: caption + title + gradient accent + description. */
export const Full: Story = {
  args: {
    caption: 'What we offer',
    title: 'Build better',
    txtGradient: 'faster',
    description:
      'A curated set of components that removes boilerplate and encodes non-obvious MUI patterns so you can focus on your product.',
  },
};

/** Title only — minimum required prop. */
export const TitleOnly: Story = {
  args: {
    title: 'Our components',
  },
};

/** With caption and gradient but no description. */
export const CaptionAndGradient: Story = {
  args: {
    caption: 'Giselle MUI',
    title: 'Components',
    txtGradient: 'that ship',
  },
};

/** Centred alignment — common for hero and marketing sections. */
export const Centred: Story = {
  args: {
    ...Full.args,
    sx: { textAlign: 'center', alignItems: 'center' },
  },
};

/** `SectionCaption` used standalone — for when you need just the overline label. */
export const CaptionStandalone: Story = {
  render: () => (
    <Stack spacing={2}>
      <SectionCaption title="Section label" />
      <Typography variant="h3">Heading rendered separately</Typography>
    </Stack>
  ),
};

/** Responsive: verify layout at each standard breakpoint. */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack spacing={4}>
      {BREAKPOINTS.map(({ label, width }) => (
        <div key={width}>
          <Typography variant="caption" sx={breakpointLabelSx}>
            {label}
          </Typography>
          <Box sx={buildBreakpointWidthSx(width)}>
            <SectionTitle
              caption="Giselle MUI"
              title="Build better"
              txtGradient="faster"
              description="Components that encode non-obvious MUI patterns."
            />
          </Box>
        </div>
      ))}
    </Stack>
  ),
};
