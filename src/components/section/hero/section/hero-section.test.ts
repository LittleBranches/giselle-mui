// @vitest-environment jsdom
import React from 'react';
import { describe, expect, it } from 'vitest';

import { renderWithTheme } from '../../../../test-utils';
import { HeroSection } from './hero-section';

// ----------------------------------------------------------------------

describe('HeroSection — rendering', () => {
  it('renders the heading', () => {
    const html = renderWithTheme(
      React.createElement(HeroSection, { heading: 'Build something great' })
    );
    expect(html).toContain('Build something great');
  });

  it('renders the text slot when provided', () => {
    const html = renderWithTheme(
      React.createElement(HeroSection, {
        heading: 'Hero',
        text: 'A subtitle for the hero',
      })
    );
    expect(html).toContain('A subtitle for the hero');
  });

  it('omits the text slot when not provided', () => {
    const html = renderWithTheme(React.createElement(HeroSection, { heading: 'Hero' }));
    expect(html.match(/A subtitle/)).toBeNull();
  });

  it('renders actions when provided', () => {
    const html = renderWithTheme(
      React.createElement(HeroSection, {
        heading: 'Hero',
        actions: React.createElement('button', null, 'Get started'),
      })
    );
    expect(html).toContain('Get started');
  });

  it('omits the actions slot when not provided', () => {
    const html = renderWithTheme(React.createElement(HeroSection, { heading: 'Hero' }));
    expect(html).not.toContain('Get started');
  });

  it('renders icons when provided', () => {
    const html = renderWithTheme(
      React.createElement(HeroSection, {
        heading: 'Hero',
        icons: React.createElement('span', null, 'Tech strip'),
      })
    );
    expect(html).toContain('Tech strip');
  });

  it('omits the icons slot when not provided', () => {
    const html = renderWithTheme(React.createElement(HeroSection, { heading: 'Hero' }));
    expect(html).not.toContain('Tech strip');
  });

  it('spreads ...other onto the root element (data-testid)', () => {
    const html = renderWithTheme(
      React.createElement(HeroSection, {
        heading: 'Hero',
        'data-testid': 'hero-root',
      } as Parameters<typeof HeroSection>[0])
    );
    expect(html).toContain('data-testid="hero-root"');
  });

  it('accepts sx as a single object without throwing', () => {
    expect(() =>
      renderWithTheme(
        React.createElement(HeroSection, {
          heading: 'Hero',
          sx: { mt: 2 },
        })
      )
    ).not.toThrow();
  });

  it('accepts sx as an array without throwing', () => {
    expect(() =>
      renderWithTheme(
        React.createElement(HeroSection, {
          heading: 'Hero',
          sx: [{ mt: 2 }, { mb: 2 }],
        })
      )
    ).not.toThrow();
  });
});
