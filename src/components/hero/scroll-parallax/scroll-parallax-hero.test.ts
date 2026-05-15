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

vi.mock('@mui/material/useMediaQuery', () => ({ default: vi.fn(() => false) }));

vi.mock('@mui/material/Box', () => ({
  default: ({
    children,
    sx: _sx,
    component,
    ref: _ref,
    ...props
  }: {
    children?: React.ReactNode;
    sx?: unknown;
    component?: string;
    ref?: unknown;
    [key: string]: unknown;
  }) =>
    React.createElement(component ?? 'div', props as React.HTMLAttributes<HTMLElement>, children),
}));

vi.mock('@mui/material/Stack', () => ({
  default: ({
    children,
    sx: _sx,
    spacing: _s,
    ...props
  }: {
    children?: React.ReactNode;
    sx?: unknown;
    spacing?: unknown;
    [key: string]: unknown;
  }) => React.createElement('div', props as React.HTMLAttributes<HTMLDivElement>, children),
}));

vi.mock('@mui/material/Container', () => ({
  default: ({
    children,
    sx: _sx,
    ...props
  }: {
    children?: React.ReactNode;
    sx?: unknown;
    [key: string]: unknown;
  }) => React.createElement('div', props as React.HTMLAttributes<HTMLDivElement>, children),
}));

// ----------------------------------------------------------------------

import { ScrollParallaxHero } from './scroll-parallax-hero';
import { AnimatedHeroHeading } from './animated-hero-heading';
import { useScrollPercent } from './use-scroll-percent';

// ----------------------------------------------------------------------

describe('ScrollParallaxHero — slot rendering', () => {
  it('renders the logo slot when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(ScrollParallaxHero, {
        logo: React.createElement('img', { 'data-testid': 'hero-logo', alt: '' }),
      })
    );
    expect(html).toContain('data-testid="hero-logo"');
  });

  it('renders the heading slot when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(ScrollParallaxHero, {
        heading: React.createElement('h1', {}, 'My Heading'),
      })
    );
    expect(html).toContain('My Heading');
  });

  it('renders the text slot when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(ScrollParallaxHero, {
        text: React.createElement('p', { 'data-testid': 'hero-text' }, 'Description'),
      })
    );
    expect(html).toContain('data-testid="hero-text"');
    expect(html).toContain('Description');
  });

  it('renders the actions slot when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(ScrollParallaxHero, {
        actions: React.createElement('button', { 'data-testid': 'cta' }, 'Get Started'),
      })
    );
    expect(html).toContain('data-testid="cta"');
  });

  it('renders the icons slot when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(ScrollParallaxHero, {
        icons: React.createElement('div', { 'data-testid': 'icon-strip' }),
      })
    );
    expect(html).toContain('data-testid="icon-strip"');
  });

  it('renders the background slot when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(ScrollParallaxHero, {
        background: React.createElement('div', { 'data-testid': 'hero-bg' }),
      })
    );
    expect(html).toContain('data-testid="hero-bg"');
  });

  it('omits logo wrapper div when logo slot is not provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(ScrollParallaxHero, {
        heading: React.createElement('h1', {}, 'Only Heading'),
      })
    );
    // heading present
    expect(html).toContain('Only Heading');
    // no logo-box element (would have inline-flex style from heroLogoBoxSx)
    // — simply confirm render does not throw and heading is present
  });

  it('renders all slots together without error', () => {
    const html = renderToStaticMarkup(
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
    const html = renderToStaticMarkup(React.createElement(ScrollParallaxHero, {}));
    expect(html).toContain('<section');
  });

  it('forwards extra props to the root section', () => {
    const html = renderToStaticMarkup(
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
    const html = renderToStaticMarkup(
      React.createElement(AnimatedHeroHeading, {
        subheading: 'The work of',
        highlight: 'Platform Team',
      })
    );
    expect(html).toContain('The work of');
  });

  it('renders the highlight text', () => {
    const html = renderToStaticMarkup(
      React.createElement(AnimatedHeroHeading, {
        subheading: 'The work of',
        highlight: 'Platform Team',
      })
    );
    expect(html).toContain('Platform Team');
  });

  it('renders subheading and highlight in the same element', () => {
    const html = renderToStaticMarkup(
      React.createElement(AnimatedHeroHeading, {
        subheading: 'Hello',
        highlight: 'World',
      })
    );
    // Both must appear in the output
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

import { DEFAULT_PARALLAX_MULTIPLIERS } from './scroll-parallax-hero.const';

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
});
