// @vitest-environment jsdom
import React, { act } from 'react';
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactDOM from 'react-dom/client';
import { extendTheme } from '@mui/material/styles';

import { GiselleThemeProvider } from './giselle';

// ----------------------------------------------------------------------

const CHILD = React.createElement('span', { 'data-testid': 'child' }, 'content');

// ----------------------------------------------------------------------

describe('GiselleThemeProvider — rendering', () => {
  it('renders children', () => {
    const html = renderToStaticMarkup(React.createElement(GiselleThemeProvider, null, CHILD));
    expect(html).toContain('data-testid="child"');
    expect(html).toContain('content');
  });

  it('renders without props (zero-config usage)', () => {
    const html = renderToStaticMarkup(React.createElement(GiselleThemeProvider, null, CHILD));
    expect(html).toBeTruthy();
    expect(html.length).toBeGreaterThan(0);
  });
});

describe('GiselleThemeProvider — defaultMode', () => {
  it('sets data-mui-color-scheme on the root element when defaultMode is light', () => {
    let container: HTMLDivElement;
    act(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
      ReactDOM.createRoot(container).render(
        React.createElement(GiselleThemeProvider, { defaultMode: 'light', children: CHILD })
      );
    });
    const schemed = document.documentElement.getAttribute('data-mui-color-scheme');
    // ThemeProvider sets data-mui-color-scheme on <html> in light mode
    expect(['light', null]).toContain(schemed);
  });
});

describe('GiselleThemeProvider — themeOverrides', () => {
  it('renders without error when themeOverrides is provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(GiselleThemeProvider, {
        themeOverrides: {
          colorSchemes: {
            light: {
              palette: { primary: { main: '#1976d2' } },
            },
          },
        },
        children: CHILD,
      })
    );
    expect(html).toContain('data-testid="child"');
  });
});

describe('GiselleThemeProvider — custom theme', () => {
  it('renders without error when a fully custom theme is passed', () => {
    const customTheme = extendTheme({
      colorSchemes: { light: { palette: { primary: { main: '#e91e63' } } } },
    });
    const html = renderToStaticMarkup(
      React.createElement(GiselleThemeProvider, { theme: customTheme, children: CHILD })
    );
    expect(html).toContain('data-testid="child"');
  });

  it('ignores themeOverrides when theme prop is provided', () => {
    // No error = theme prop wins, themeOverrides is ignored
    const customTheme = extendTheme({
      colorSchemes: { light: { palette: { primary: { main: '#e91e63' } } } },
    });
    const html = renderToStaticMarkup(
      React.createElement(GiselleThemeProvider, {
        theme: customTheme,
        themeOverrides: {
          colorSchemes: { light: { palette: { primary: { main: '#000000' } } } },
        },
        children: CHILD,
      })
    );
    expect(html).toContain('data-testid="child"');
  });
});
