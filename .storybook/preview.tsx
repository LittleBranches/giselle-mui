import type { Preview } from '@storybook/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { addCollection } from '@iconify/react';
import { giselleTheme } from '../src/utils/theme-preset';
import { solarStorybookIcons } from './solar-storybook-icons';

// Register the Solar icon set offline so icons don't flicker due to CDN fetches.
addCollection(solarStorybookIcons as Parameters<typeof addCollection>[0]);

const muiDefaultTheme = createTheme({
  cssVariables: true,
  colorSchemes: { light: true, dark: true },
});

// Registry of themes available in the Storybook toolbar.
const themes: Record<string, typeof muiDefaultTheme> = {
  'mui-default': muiDefaultTheme,
  giselle: giselleTheme as unknown as typeof muiDefaultTheme,
};

// Hide low-signal inherited args globally so controls focus on design decisions.
// Stories can still override this with local `parameters.controls.exclude`.
const STORYBOOK_GLOBAL_CONTROLS_EXCLUDE = [
  /^classes$/,
  /^slotProps$/,
  /^slots$/,
  /^ownerState$/,
  /^theme$/,
  /^as$/,
  /^ref$/,
];

/**
 * Toolbar dropdown — switch between registered themes in the Storybook canvas.
 * Each `value` must match a key in the `themes` registry above.
 */
export const globalTypes = {
  theme: {
    name: 'Theme',
    defaultValue: 'giselle',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: 'mui-default', title: 'MUI Default' },
        { value: 'giselle', title: '🥭 Giselle' },
      ],
      dynamicTitle: true,
    },
  },
};

// Wraps every story in MUI ThemeProvider so that --mui-palette-* CSS custom
// properties are injected into the DOM — required by giselle-mui components that
// reference theme.vars.palette.* or var(--mui-palette-...) directly.
const preview: Preview = {
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const key = context.globals['theme'] as string | undefined;
      const selectedTheme = (key && themes[key]) || muiDefaultTheme;
      return (
        <ThemeProvider theme={selectedTheme}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    layout: 'centered',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
      exclude: STORYBOOK_GLOBAL_CONTROLS_EXCLUDE,
    },
    docs: {
      controls: {
        sort: 'requiredFirst',
        exclude: STORYBOOK_GLOBAL_CONTROLS_EXCLUDE,
      },
    },
  },
};

export default preview;
