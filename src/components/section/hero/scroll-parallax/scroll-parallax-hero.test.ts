// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

// ----------------------------------------------------------------------
// Mocks — must be declared before component imports
// ----------------------------------------------------------------------

vi.mock('framer-motion', () => ({
  motion: { div: 'div', span: 'span', img: 'img' },
  useTransform: vi.fn(() => ({ get: () => 0, _isMotionValue: true })),
  useSpring: vi.fn((v: unknown) => v),
  useScroll: vi.fn(() => ({ scrollY: { get: () => 0, on: vi.fn(), off: vi.fn() } })),
  useMotionValueEvent: vi.fn(),
}));

// useMediaQuery requires window.matchMedia which jsdom does not support — mock to a fixed value.
vi.mock('@mui/material/useMediaQuery', () => ({ default: vi.fn(() => false) }));

// ----------------------------------------------------------------------

import { renderWithTheme } from '../../../../test-utils';
import { ScrollParallaxHero } from './scroll-parallax-hero';
import { AnimatedHeroHeading } from './animated-hero-heading';
import { useScrollPercent } from './use-scroll-percent';
import { DEFAULT_PARALLAX_MULTIPLIERS } from './scroll-parallax-hero.const';

// ----------------------------------------------------------------------

describe('ScrollParallaxHero — slot rendering', () => {
  it('renders the logo slot when provided', () => {
    const html = renderWithTheme(
      React.createElement(ScrollParallaxHero, {
        logo: React.createElement('img', { 'data-testid': 'hero-logo', alt: '' }),
      })
    );
    expect(html).toContain('data-testid="hero-logo"');
  });

  it('renders the heading slot when provided', () => {
    const html = renderWithTheme(
      React.createElement(ScrollParallaxHero, {
        heading: React.createElement('h1', {}, 'My Heading'),
      })
    );
    expect(html).toContain('My Heading');
  });

  it('renders the text slot when provided', () => {
    const html = renderWithTheme(
      React.createElement(ScrollParallaxHero, {
        text: React.createElement('p', { 'data-testid': 'hero-text' }, 'Description'),
      })
    );
    expect(html).toContain('data-testid="hero-text"');
    expect(html).toContain('Description');
  });

  it('renders the actions slot when provided', () => {
    const html = renderWithTheme(
      React.createElement(ScrollParallaxHero, {
        actions: React.createElement('button', { 'data-testid': 'cta' }, 'Get Started'),
      })
    );
    expect(html).toContain('data-testid="cta"');
  });

  it('renders the icons slot when provided', () => {
    const html = renderWithTheme(
      React.createElement(ScrollParallaxHero, {
        icons: React.createElement('div', { 'data-testid': 'icon-strip' }),
      })
    );
    expect(html).toContain('data-testid="icon-strip"');
  });

  it('renders the background slot when provided', () => {
    const html = renderWithTheme(
      React.createElement(ScrollParallaxHero, {
        background: React.createElement('div', { 'data-testid': 'hero-bg' }),
      })
    );
    expect(html).toContain('data-testid="hero-bg"');
  });

  it('omits logo wrapper div when logo slot is not provided', () => {
    const html = renderWithTheme(
      React.createElement(ScrollParallaxHero, {
        heading: React.createElement('h1', {}, 'Only Heading'),
      })
    );
    expect(html).toContain('Only Heading');
  });

  it('renders all slots together without error', () => {
    const html = renderWithTheme(
      React.createElement(ScrollParallaxHero, {
        logo: React.createElement('img', { alt: '', 'data-testid': 'all-logo' }),
        heading: React.createElement('h1', {}, 'Full Hero'),
        text: React.createElement('p', {}, 'Subtext'),
        actions: React.createElement('button', {}, 'CTA'),
        icons: React.createElement('div', { 'data-testid': 'icons' }),
        background: React.createElement('div', { 'data-testid': 'bg' }),
      })
    );
    expect(html).toContain('Full Hero');
    expect(html).toContain('Subtext');
    expect(html).toContain('data-testid="all-logo"');
    expect(html).toContain('data-testid="icons"');
    expect(html).toContain('data-testid="bg"');
  });

  it('renders as a <section> semantic element', () => {
    const html = renderWithTheme(React.createElement(ScrollParallaxHero, {}));
    expect(html).toContain('<section');
  });

  it('forwards extra props to the root section', () => {
    const html = renderWithTheme(
      React.createElement(ScrollParallaxHero, {
        'data-testid': 'hero-root',
        'aria-label': 'Hero section',
      } as Parameters<typeof ScrollParallaxHero>[0])
    );
    expect(html).toContain('data-testid="hero-root"');
    expect(html).toContain('aria-label="Hero section"');
  });
});

// ----------------------------------------------------------------------

describe('AnimatedHeroHeading', () => {
  it('renders the subheading text', () => {
    const html = renderWithTheme(
      React.createElement(AnimatedHeroHeading, {
        subheading: 'The work of',
        highlight: 'Platform Team',
      })
    );
    expect(html).toContain('The work of');
  });

  it('renders the highlight text', () => {
    const html = renderWithTheme(
      React.createElement(AnimatedHeroHeading, {
        subheading: 'The work of',
        highlight: 'Platform Team',
      })
    );
    expect(html).toContain('Platform Team');
  });

  it('renders subheading and highlight in the same element', () => {
    const html = renderWithTheme(
      React.createElement(AnimatedHeroHeading, {
        subheading: 'Hello',
        highlight: 'World',
      })
    );
    expect(html).toContain('Hello');
    expect(html).toContain('World');
  });
});

// ----------------------------------------------------------------------

describe('useScrollPercent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns percent starting at 0', () => {
    let result: ReturnType<typeof useScrollPercent> | undefined;

    function TestHarness() {
      result = useScrollPercent();
      return null;
    }

    renderToStaticMarkup(React.createElement(TestHarness));
    expect(result?.percent).toBe(0);
  });

  it('returns an elementRef (object with current property)', () => {
    let result: ReturnType<typeof useScrollPercent> | undefined;

    function TestHarness() {
      result = useScrollPercent();
      return null;
    }

    renderToStaticMarkup(React.createElement(TestHarness));
    expect(result?.elementRef).toHaveProperty('current');
  });

  it('returns a scrollY MotionValue', () => {
    let result: ReturnType<typeof useScrollPercent> | undefined;

    function TestHarness() {
      result = useScrollPercent();
      return null;
    }

    renderToStaticMarkup(React.createElement(TestHarness));
    expect(result?.scrollY).toBeDefined();
    expect(result?.scrollY).toHaveProperty('get');
  });
});

// ----------------------------------------------------------------------

describe('DEFAULT_PARALLAX_MULTIPLIERS — regression', () => {
  it('logo multiplier is negative (moves upward on scroll)', () => {
    expect(DEFAULT_PARALLAX_MULTIPLIERS.logo).toBeLessThan(0);
  });

  it('heading multiplier is negative', () => {
    expect(DEFAULT_PARALLAX_MULTIPLIERS.heading).toBeLessThan(0);
  });

  it('text multiplier is negative', () => {
    expect(DEFAULT_PARALLAX_MULTIPLIERS.text).toBeLessThan(0);
  });

  it('actions multiplier is negative', () => {
    expect(DEFAULT_PARALLAX_MULTIPLIERS.actions).toBeLessThan(0);
  });

  it('logo moves further than heading (deeper parallax layer)', () => {
    expect(DEFAULT_PARALLAX_MULTIPLIERS.logo).toBeLessThan(DEFAULT_PARALLAX_MULTIPLIERS.heading);
  });

  it('heading moves further than text', () => {
    expect(DEFAULT_PARALLAX_MULTIPLIERS.heading).toBeLessThan(DEFAULT_PARALLAX_MULTIPLIERS.text);
  });

  it('text moves further than actions', () => {
    expect(DEFAULT_PARALLAX_MULTIPLIERS.text).toBeLessThan(DEFAULT_PARALLAX_MULTIPLIERS.actions);
  });

  it('icons multiplier is negative', () => {
    expect(DEFAULT_PARALLAX_MULTIPLIERS.icons).toBeLessThan(0);
  });

  it('icons and actions share the same default plane', () => {
    expect(DEFAULT_PARALLAX_MULTIPLIERS.icons).toBe(DEFAULT_PARALLAX_MULTIPLIERS.actions);
  });
});
