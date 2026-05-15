import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { contentPlaceholderSx } from '../../../../stories-defaults';
import { SectionContainer } from './section-container';

// ----------------------------------------------------------------------

const meta: Meta<typeof SectionContainer> = {
  title: 'Layout/Section Container',
  component: SectionContainer,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    sx: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof SectionContainer>;

// ----------------------------------------------------------------------

/** Default: `maxWidth="lg"`, `py={{ xs: 8, md: 12 }}`. Background shows the container boundary. */
export const Default: Story = {
  render: () => (
    <SectionContainer>
      <Box sx={contentPlaceholderSx}>
        <Typography variant="h4">Section content</Typography>
        <Typography variant="body2" color="text.secondary">
          This box is constrained to `maxWidth="lg"` with default vertical padding.
        </Typography>
      </Box>
    </SectionContainer>
  ),
};

/** Custom `maxWidth="md"` — useful for content-heavy text sections. */
export const MediumWidth: Story = {
  render: () => (
    <SectionContainer maxWidth="md">
      <Box sx={contentPlaceholderSx}>
        <Typography variant="h4">Narrower section</Typography>
        <Typography variant="body2" color="text.secondary">
          Constrained to `maxWidth="md"`.
        </Typography>
      </Box>
    </SectionContainer>
  ),
};

/** Custom `py` — tighter spacing for denser layouts. */
export const TightSpacing: Story = {
  render: () => (
    <SectionContainer py={{ xs: 4, md: 6 }}>
      <Box sx={contentPlaceholderSx}>
        <Typography variant="h4">Tight spacing</Typography>
        <Typography variant="body2" color="text.secondary">
          {'`py={{ xs: 4, md: 6 }}`'} — half the default vertical padding.
        </Typography>
      </Box>
    </SectionContainer>
  ),
};

/** Responsive: verify container constraint at each standard breakpoint. */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack spacing={4}>
      {([360, 600, 900, 1200] as const).map((width) => (
        <div key={width}>
          <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 1 }}>
            {width}px
          </Typography>
          <Box sx={{ width, maxWidth: '100%' }}>
            <SectionContainer py={{ xs: 4 }}>
              <Box sx={[contentPlaceholderSx, { p: 2 }]}>
                <Typography variant="body2">
                  maxWidth=&quot;lg&quot; at {width}px viewport
                </Typography>
              </Box>
            </SectionContainer>
          </Box>
        </div>
      ))}
    </Stack>
  ),
};
