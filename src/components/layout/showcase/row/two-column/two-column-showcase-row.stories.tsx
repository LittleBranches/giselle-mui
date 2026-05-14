import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { TwoColumnShowcaseRow } from './two-column-showcase-row';

// ----------------------------------------------------------------------

const meta: Meta<typeof TwoColumnShowcaseRow> = {
  title: 'Layout/TwoColumnShowcaseRow',
  component: TwoColumnShowcaseRow,
  parameters: { layout: 'padded' },
  argTypes: {
    controls: { control: false },
    textSx: { control: false },
    controlsSx: { control: false },
    sx: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof TwoColumnShowcaseRow>;

// ----------------------------------------------------------------------

const SampleControls = () => (
  <Stack spacing={2} sx={{ maxWidth: 360 }}>
    <FormControlLabel control={<Switch defaultChecked />} label="Dark mode" />
    <FormControlLabel control={<Switch />} label="Compact layout" />
    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
      Font size
    </Typography>
    <Slider defaultValue={14} min={12} max={20} step={1} marks valueLabelDisplay="auto" />
  </Stack>
);

// ----------------------------------------------------------------------

/**
 * Default: text left, controls right. The most common usage — describe a feature
 * category on the left and let the user interact with the controls on the right.
 */
export const Default: Story = {
  args: {
    text: {
      overline: 'Appearance',
      heading: 'Theme controls',
      description:
        'Adjust mode, font size, and layout density. Changes are reflected live in the preview panel.',
    },
    controls: <SampleControls />,
  },
};

/**
 * `orientation="row-reverse"`: controls left, text right.
 * Use when the controls are the primary focal point and text is supporting context.
 */
export const RowReverse: Story = {
  args: {
    ...Default.args,
    orientation: 'row-reverse',
  },
};

/**
 * `orientation="column"`: text top, controls bottom — full-width stacked layout.
 * Use for preview panels, live demos, or any controls that need the full container width.
 */
export const Column: Story = {
  args: {
    text: {
      overline: 'Preview',
      heading: 'Live dashboard',
    },
    controls: (
      <Box
        sx={{
          height: 200,
          borderRadius: 1,
          bgcolor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.disabled' }}>
          Dashboard preview placeholder
        </Typography>
      </Box>
    ),
    orientation: 'column',
  },
};

/**
 * No `text` prop: the controls slot takes full width.
 * Use when the parent context already provides heading/description context.
 */
export const ControlsOnly: Story = {
  args: {
    controls: <SampleControls />,
  },
};

/**
 * Responsive: at xs/sm the layout always stacks vertically regardless of `orientation`.
 * Verify at each breakpoint that text appears above controls.
 */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack spacing={4}>
      {([360, 600, 900, 1200] as const).map((width) => (
        <div key={width}>
          <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 1 }}>
            {width}px
          </Typography>
          <div style={{ width, maxWidth: '100%', border: '1px dashed rgba(128,128,128,0.3)' }}>
            <TwoColumnShowcaseRow
              text={{
                overline: 'Appearance',
                heading: 'Theme controls',
                description: 'Adjust mode and font size.',
              }}
              controls={<SampleControls />}
            />
          </div>
        </div>
      ))}
    </Stack>
  ),
};
