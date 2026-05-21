import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { GiselleThemeProvider } from './components/theming/theme-provider/giselle/giselle';

/**
 * Wraps the element in GiselleThemeProvider and renders to a static HTML string.
 * Use for structural and content assertions that do not require interaction.
 */
export function renderWithTheme(element: React.ReactElement): string {
  return renderToStaticMarkup(
    React.createElement(GiselleThemeProvider, { defaultMode: 'light', children: element })
  );
}
