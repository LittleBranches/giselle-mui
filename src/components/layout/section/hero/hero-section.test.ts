// @vitest-environment jsdom
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { HeroSection } from './hero-section';

// Mock MUI components that have theme.vars in sx callbacks
vi.mock('@mui/material/Box', () => ({
  default: ({
    children,
    sx: _sx,
    ...props
  }: React.PropsWithChildren<{ sx?: unknown; [key: string]: unknown }>) =>
    React.createElement('div', props, children),
}));

vi.mock('@mui/material/Container', () => ({
  default: ({
    children,
    sx: _sx,
    maxWidth: _maxWidth,
    ...props
  }: React.PropsWithChildren<{ sx?: unknown; maxWidth?: unknown; [key: string]: unknown }>) =>
    React.createElement('div', props, children),
}));

vi.mock('@mui/material/Typography', () => ({
  default: ({
    children,
    variant: _variant,
    color: _color,
    sx: _sx,
    ...props
  }: React.PropsWithChildren<{
    variant?: string;
    color?: string;
    sx?: unknown;
    [key: string]: unknown;
  }>) => React.createElement('span', props, children),
}));

// ----------------------------------------------------------------------

describe('HeroSection — rendering', () => {
  it('renders the heading', () => {
    const html = renderToStaticMarkup(
      React.createElement(HeroSection, { heading: 'Build something great' })
    );
    expect(html).toContain('Build something great');
  });

  it('renders the text slot when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(HeroSection, {
        heading: 'Hero',
        text: 'A subtitle for the hero',
      })
    );
    expect(html).toContain('A subtitle for the hero');
  });

  it('omits the text slot when not provided', () => {
    const html = renderToStaticMarkup(React.createElement(HeroSection, { heading: 'Hero' }));
    // No extra Typography element — only the heading
    expect(html.match(/A subtitle/)).toBeNull();
  });

  it('renders actions when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(HeroSection, {
        heading: 'Hero',
        actions: React.createElement('button', null, 'Get started'),
      })
    );
    expect(html).toContain('Get started');
  });

  it('omits the actions slot when not provided', () => {
    const html = renderToStaticMarkup(React.createElement(HeroSection, { heading: 'Hero' }));
    expect(html).not.toContain('Get started');
  });

  it('renders icons when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(HeroSection, {
        heading: 'Hero',
        icons: React.createElement('span', null, 'Tech strip'),
      })
    );
    expect(html).toContain('Tech strip');
  });

  it('omits the icons slot when not provided', () => {
    const html = renderToStaticMarkup(React.createElement(HeroSection, { heading: 'Hero' }));
    expect(html).not.toContain('Tech strip');
  });

  it('spreads ...other onto the root element (data-testid)', () => {
    const html = renderToStaticMarkup(
      React.createElement(HeroSection, {
        heading: 'Hero',
        'data-testid': 'hero-root',
      } as Parameters<typeof HeroSection>[0])
    );
    expect(html).toContain('data-testid="hero-root"');
  });

  it('accepts sx as a single object without throwing', () => {
    expect(() =>
      renderToStaticMarkup(
        React.createElement(HeroSection, {
          heading: 'Hero',
          sx: { mt: 2 },
        })
      )
    ).not.toThrow();
  });

  it('accepts sx as an array without throwing', () => {
    expect(() =>
      renderToStaticMarkup(
        React.createElement(HeroSection, {
          heading: 'Hero',
          sx: [{ mt: 2 }, { mb: 2 }],
        })
      )
    ).not.toThrow();
  });
});
