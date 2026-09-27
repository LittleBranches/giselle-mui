import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { contentPlaceholderSx } from '../../../../stories-defaults';
import { BasicSection } from './basic-section';
import type { DecorationElement } from './types';

// ----------------------------------------------------------------------

const meta: Meta<typeof BasicSection> = {
  title: 'Material/Layout/Basic Section',
  component: BasicSection,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof BasicSection>;

const NOTE_SX = { mt: 1 } as const;

function Content({ note }: { note: string }) {
  return (
    <Box sx={contentPlaceholderSx}>
      <Typography variant="h4">Section content</Typography>
      <Typography variant="body2" color="text.secondary" sx={NOTE_SX}>
        {note}
      </Typography>
    </Box>
  );
}

const WIDEN_NOTE =
  'Decorations only show above 1440px viewport width — widen the preview to see them.';

// ----------------------------------------------------------------------
// Canonical presets
// ----------------------------------------------------------------------

/** `decoration` (the default, `true`) renders the canonical frame: 2 corner plus-marks, 3 border lines. */
export const Default: Story = {
  render: () => (
    <BasicSection>
      <Content note={WIDEN_NOTE} />
    </BasicSection>
  ),
};

/** `decoration={false}` — a plain section with no decorative elements at all. */
export const NotDecorated: Story = {
  render: () => (
    <BasicSection decoration={false}>
      <Content note="No decorative frame — decoration={false}." />
    </BasicSection>
  ),
};

// ----------------------------------------------------------------------
// Atomic — one decoration kind at a time
// ----------------------------------------------------------------------

export const CornerPlusOnly: Story = {
  render: () => (
    <BasicSection decoration={[{ kind: 'corner-plus', sx: { top: 72, left: 72 } }]}>
      <Content note={`kind: 'corner-plus'. ${WIDEN_NOTE}`} />
    </BasicSection>
  ),
};

export const CornerXOnly: Story = {
  render: () => (
    <BasicSection
      decoration={[
        { kind: 'corner-x', sx: { top: -8, left: -8 } },
        { kind: 'corner-x', sx: { top: -8, right: -8 } },
        { kind: 'corner-x', sx: { bottom: -8, left: -8 } },
        { kind: 'corner-x', sx: { bottom: -8, right: -8 } },
      ]}
    >
      <Content note={`kind: 'corner-x', all 4 corners. ${WIDEN_NOTE}`} />
    </BasicSection>
  ),
};

export const BorderLineOnly: Story = {
  render: () => (
    <BasicSection
      decoration={[
        { kind: 'border-line', sx: { top: 80, left: 0 } },
        { kind: 'border-line', vertical: true, sx: { top: 0, left: 80 } },
      ]}
    >
      <Content note={`kind: 'border-line', horizontal + vertical. ${WIDEN_NOTE}`} />
    </BasicSection>
  ),
};

export const TriangleLeftOnly: Story = {
  render: () => (
    <BasicSection decoration={[{ kind: 'triangle-left', sx: { top: '50%', left: 24 } }]}>
      <Content note={`kind: 'triangle-left'. ${WIDEN_NOTE}`} />
    </BasicSection>
  ),
};

export const TriangleDownOnly: Story = {
  render: () => (
    <BasicSection decoration={[{ kind: 'triangle-down', sx: { top: 24, left: '50%' } }]}>
      <Content note={`kind: 'triangle-down'. ${WIDEN_NOTE}`} />
    </BasicSection>
  ),
};

export const DotOnly: Story = {
  render: () => (
    <BasicSection
      decoration={[
        { kind: 'dot', sx: { top: 24, left: 24 } },
        { kind: 'dot', sx: { top: 24, left: 48, opacity: 0.24, width: 14, height: 14 } },
      ]}
    >
      <Content note={`kind: 'dot'. ${WIDEN_NOTE}`} />
    </BasicSection>
  ),
};

// ----------------------------------------------------------------------
// Composed — reproductions of real, shipped decoration patterns
// ----------------------------------------------------------------------

/** Reproduces the FAQ section's variant: flush-to-edge lines and outset corner marks (not the canonical frame's insets). */
export const FaqVariant: Story = {
  render: () => (
    <BasicSection
      decoration={[
        { kind: 'border-line', sx: { top: 0, left: 0 } },
        { kind: 'border-line', sx: { bottom: 0, left: 0 } },
        { kind: 'corner-plus', sx: { top: -8, left: 72 } },
        { kind: 'corner-plus', sx: { bottom: -8, left: 72 } },
      ]}
    >
      <Content
        note={`Reproduces ar-home-faqs.tsx's pattern — flush lines, outset marks. ${WIDEN_NOTE}`}
      />
    </BasicSection>
  ),
};

/** Reproduces the pricing section's variant: an X-mark at all 4 corners, outset. */
export const PricingVariant: Story = {
  render: () => (
    <BasicSection
      decoration={[
        { kind: 'corner-x', sx: { top: -8, left: -8 } },
        { kind: 'corner-x', sx: { top: -8, right: -8 } },
        { kind: 'corner-x', sx: { bottom: -8, left: -8 } },
        { kind: 'corner-x', sx: { bottom: -8, right: -8 } },
      ]}
    >
      <Content note={`Reproduces pricing.tsx's pattern. ${WIDEN_NOTE}`} />
    </BasicSection>
  ),
};

/**
 * Reproduces a real showcase section's pattern: an arbitrary, data-driven array
 * of line/triangle accents — the exact shape `decoration` was designed to
 * cover, since this one never fit a fixed preset in the first place.
 */
export const DataDrivenLines: Story = {
  render: () => {
    const lines: DecorationElement[] = [
      { kind: 'triangle-left', sx: { top: 120, left: 0 } },
      { kind: 'border-line', vertical: true, sx: { top: 0, left: 24 } },
      { kind: 'border-line', vertical: true, sx: { top: 0, right: 24 } },
    ];
    return (
      <BasicSection decoration={lines}>
        <Content
          note={`Reproduces a real showcase section's data-driven 'lines' prop pattern. ${WIDEN_NOTE}`}
        />
      </BasicSection>
    );
  },
};
