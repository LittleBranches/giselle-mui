import type { Meta, StoryObj } from '@storybook/react';
import { extendTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { GiselleThemeProvider } from './giselle';
import type { GiselleThemeProviderProps } from './types';

// ----------------------------------------------------------------------

const PALETTE_COLORS = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;

/** Renders a row of contained + outlined buttons for each MUI palette key. */
function PaletteDemo() {
  return (
    <Stack spacing={1}>
      {PALETTE_COLORS.map((color) => (
        <Stack key={color} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Button variant="contained" color={color} size="small">
            {color}
          </Button>
          <Button variant="outlined" color={color} size="small">
            {color}
          </Button>
          <Button variant="text" color={color} size="small">
            {color}
          </Button>
        </Stack>
      ))}
    </Stack>
  );
}

// ----------------------------------------------------------------------

const meta: Meta<GiselleThemeProviderProps> = {
  title: 'Theming/Giselle Theme Provider',
  component: GiselleThemeProvider,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Zero-config theme provider that ships with the Giselle brand palette — Deep grove green primary + Mango gold secondary. Wrap your application and every MUI component inherits the correct CSS variable theme.',
      },
    },
  },
  argTypes: {
    children: { control: false },
    theme: { control: false },
    themeOverrides: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ----------------------------------------------------------------------

/**
 * The default zero-config usage — no props required.
 *
 * Palette: Deep grove green `#2E7D32` as primary (light mode),
 * Mango gold `#F5A623` as secondary. Both colour schemes are active;
 * Storybook's mode toggle switches between them.
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Drop-in usage with no props. Primary is Deep grove green, secondary is Mango gold.',
      },
    },
  },
  render: () => (
    <GiselleThemeProvider defaultMode="light">
      <Stack spacing={2}>
        <Typography variant="h6">Giselle brand palette — default</Typography>
        <PaletteDemo />
      </Stack>
    </GiselleThemeProvider>
  ),
};

/**
 * Override only the primary colour — keep the rest of the Giselle palette intact.
 *
 * `themeOverrides` deep-merges on top of `giselleThemeOptions` before calling
 * `extendTheme()`. Only the keys you provide change; everything else stays as Giselle.
 */
export const WithThemeOverrides: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Primary overridden to MUI blue `#1976d2` via `themeOverrides`. Secondary and all other palette keys remain from the Giselle defaults.',
      },
    },
  },
  render: () => (
    <GiselleThemeProvider
      defaultMode="light"
      themeOverrides={{
        colorSchemes: {
          light: { palette: { primary: { main: '#1976d2' } } },
          dark: { palette: { primary: { main: '#90caf9' } } },
        },
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6">Primary overridden to MUI blue</Typography>
        <PaletteDemo />
      </Stack>
    </GiselleThemeProvider>
  ),
};

/**
 * Pass a fully custom `extendTheme()` result — `themeOverrides` is ignored.
 *
 * Use this when you want complete control over the theme and the Giselle defaults
 * should not apply at all.
 */
export const FullyCustomTheme: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Custom theme created with `extendTheme()` passed directly. Giselle defaults are bypassed entirely.',
      },
    },
  },
  render: () => {
    const customTheme = extendTheme({
      colorSchemes: {
        light: {
          palette: {
            primary: { main: '#e91e63' },
            secondary: { main: '#ff5722' },
          },
        },
      },
    });
    return (
      <GiselleThemeProvider defaultMode="light" theme={customTheme}>
        <Stack spacing={2}>
          <Typography variant="h6">Fully custom theme — pink + deep orange</Typography>
          <PaletteDemo />
        </Stack>
      </GiselleThemeProvider>
    );
  },
};

/**
 * Dark mode — same Giselle palette, dark colour scheme active.
 *
 * Primary switches to Lime `#76C442` (readable on dark backgrounds).
 * Secondary stays Mango gold.
 */
export const DarkMode: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Dark colour scheme forced via `defaultMode="dark"`. Primary is Lime `#76C442` — the Giselle dark-mode primary.',
      },
    },
  },
  render: () => (
    <GiselleThemeProvider defaultMode="dark">
      <Stack spacing={2} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography variant="h6" color="text.primary">
          Giselle palette — dark mode
        </Typography>
        <PaletteDemo />
      </Stack>
    </GiselleThemeProvider>
  ),
};
