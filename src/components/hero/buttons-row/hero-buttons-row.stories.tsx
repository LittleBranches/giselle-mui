import type { Meta, StoryObj } from '@storybook/react';

import { HeroButtonsRow } from './hero-buttons-row';

// ----------------------------------------------------------------------

const meta: Meta<typeof HeroButtonsRow> = {
  title: 'Giselle MUI/Hero/Buttons Row',
  component: HeroButtonsRow,
  parameters: { layout: 'centered' },
  argTypes: {
    items: { control: false },
    motionProps: { control: false },
    sx: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof HeroButtonsRow>;

// ----------------------------------------------------------------------

const SAMPLE_ITEMS = [
  { label: 'View work', href: '#work' },
  { label: 'Contact', href: '#contact', variant: 'outlined' as const },
];

/**
 * Default button row with two items — primary contained and secondary outlined.
 */
export const Default: Story = {
  args: { items: SAMPLE_ITEMS },
};

/**
 * Single button — confirms the row wrapping layout works with one item.
 */
export const SingleButton: Story = {
  args: {
    items: [{ label: 'Get started', href: '#start' }],
  },
};

/**
 * Three buttons — confirms the row wraps cleanly on narrow viewports.
 */
export const ThreeButtons: Story = {
  args: {
    items: [
      { label: 'Projects', href: '#projects' },
      { label: 'About', href: '#about', variant: 'outlined' as const },
      { label: 'Blog', href: '#blog', variant: 'text' as const },
    ],
  },
};

/**
 * **Responsive** — the row at MUI standard breakpoint widths.
 */
export const Responsive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {[360, 600, 900, 1200].map((width) => (
        <div key={width}>
          <div style={{ fontSize: 12, marginBottom: 8, color: '#666' }}>{width}px</div>
          <div style={{ width }}>
            <HeroButtonsRow items={SAMPLE_ITEMS} />
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: { layout: 'padded' },
};
