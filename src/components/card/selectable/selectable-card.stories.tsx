import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { SelectableCard } from './selectable-card';

// ----------------------------------------------------------------------

const meta: Meta<typeof SelectableCard> = {
  component: SelectableCard,
  title: 'Components/SelectableCard',
};

export default meta;
type Story = StoryObj<typeof SelectableCard>;

// Named component so React hooks are valid inside it.
function ToggleDemo() {
  const [selected, setSelected] = useState(false);
  return (
    <SelectableCard
      selected={selected}
      onClick={() => setSelected((v) => !v)}
      sx={{ p: 3, width: 240 }}
    >
      <Typography fontWeight={600}>{selected ? 'Selected ✓' : 'Click to select'}</Typography>
      <Typography variant="body2" color="text.secondary">
        aria-pressed: {String(selected)}
      </Typography>
    </SelectableCard>
  );
}

function MultiSelectDemo() {
  const options = ['Starter', 'Pro', 'Enterprise'] as const;
  const [active, setActive] = useState<string>('Pro');
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {options.map((opt) => (
        <SelectableCard
          key={opt}
          selected={active === opt}
          onClick={() => setActive(opt)}
          sx={{ p: 2.5, width: 140 }}
        >
          <Typography fontWeight={600}>{opt}</Typography>
        </SelectableCard>
      ))}
    </Box>
  );
}

// ----------------------------------------------------------------------

/**
 * Click to toggle between selected and unselected.
 * Inspect the DOM panel to see `aria-pressed` toggle.
 */
export const Toggle: Story = {
  render: () => <ToggleDemo />,
};

/**
 * Multi-option single-select group — only one card selected at a time.
 */
export const MultiSelect: Story = {
  render: () => <MultiSelectDemo />,
};

/**
 * Disabled state — `ButtonBase` sets `aria-disabled`; pointer events suppressed.
 */
export const Disabled: Story = {
  render: () => (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <SelectableCard disabled sx={{ p: 3, width: 200 }}>
        <Typography>Disabled (unselected)</Typography>
      </SelectableCard>
      <SelectableCard selected disabled sx={{ p: 3, width: 200 }}>
        <Typography>Disabled (selected)</Typography>
      </SelectableCard>
    </Box>
  ),
};

// ----------------------------------------------------------------------

const OPTION_LABELS = ['Starter', 'Pro', 'Enterprise', 'Team', 'Custom', 'Business'] as const;

const BREAKPOINTS_GRID = [
  { label: 'xs — 360px', width: 360, cols: 1 },
  { label: 'sm — 600px', width: 600, cols: 2 },
  { label: 'md — 900px', width: 900, cols: 3 },
  { label: 'lg — 1200px', width: 1200, cols: 4 },
];

function ResponsiveDemo() {
  const [active, setActive] = useState<string>('Pro');
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {BREAKPOINTS_GRID.map(({ label, width, cols }) => (
        <Box key={width}>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
            {label}
          </Typography>
          <Box
            sx={{
              width,
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: 2,
              border: '1px dashed',
              borderColor: 'divider',
              p: 1,
            }}
          >
            {OPTION_LABELS.map((opt) => (
              <SelectableCard
                key={opt}
                selected={active === opt}
                onClick={() => setActive(opt)}
                sx={{ p: 2.5 }}
              >
                <Typography fontWeight={600}>{opt}</Typography>
              </SelectableCard>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

/**
 * Option cards in a responsive grid — column count grows with available width
 * at each MUI standard breakpoint. Click any card to select it.
 */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => <ResponsiveDemo />,
};
