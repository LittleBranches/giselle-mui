// @vitest-environment jsdom
/**
 * Unit tests for QuoteCard.
 *
 * Uses `renderToStaticMarkup` (React SSR) for all assertions — purely
 * structural, no interactivity to test. MUI components are mocked to avoid
 * theme-provider requirements (`theme.vars` from MUI v7 CSS-vars mode is not
 * available with the default theme without a CssVarsProvider).
 *
 * ## What is tested
 * - Quote text is rendered in the output
 * - author is rendered when provided
 * - source is rendered when provided
 * - Both author and source are rendered when both are provided
 * - Attribution row is NOT rendered when neither author nor source is given
 * - Separator dot is rendered ONLY when both author and source are present
 * - Separator dot is absent when only one of author/source is provided
 * - Decorative opening quote mark (U+201C \u201c) is present in the output
 * - Decorative quote mark carries aria-hidden (skipped by screen readers)
 * - Extra Paper props are forwarded to the root element
 *
 * ## What is NOT tested here
 * - Background tint / border color (sx callbacks with theme.vars)
 * - Dark mode adaptation
 * - Elevation shadow (MUI Paper visual)
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { it, vi, expect, describe } from 'vitest';

// ---------------------------------------------------------------------------
// MUI mocks — all strip sx to avoid theme.vars access.
// ---------------------------------------------------------------------------

vi.mock('@mui/material/Paper', () => ({
  default: ({
    children,
    elevation: _elevation,
    sx: _sx,
    variant: _variant,
    ...props
  }: {
    children?: React.ReactNode;
    elevation?: number;
    sx?: unknown;
    variant?: string;
    [key: string]: unknown;
  }) => React.createElement('div', { 'data-testid': 'paper', ...props }, children ?? null),
}));

vi.mock('@mui/material/Box', () => ({
  default: ({
    children,
    sx: _sx,
    ...props
  }: {
    children?: React.ReactNode;
    sx?: unknown;
    [key: string]: unknown;
  }) => React.createElement('div', props, children ?? null),
}));

vi.mock('@mui/material/Stack', () => ({
  default: ({
    children,
    direction: _direction,
    spacing: _spacing,
    alignItems: _alignItems,
    sx: _sx,
    ...props
  }: {
    children?: React.ReactNode;
    direction?: string;
    spacing?: number;
    alignItems?: string;
    sx?: unknown;
    [key: string]: unknown;
  }) => React.createElement('div', { 'data-testid': 'stack', ...props }, children ?? null),
}));

vi.mock('@mui/material/Typography', () => ({
  default: ({
    children,
    variant: _variant,
    component = 'span',
    sx: _sx,
    'aria-hidden': ariaHidden,
    ...props
  }: {
    children?: React.ReactNode;
    variant?: string;
    component?: string;
    sx?: unknown;
    'aria-hidden'?: boolean | 'true' | 'false';
    [key: string]: unknown;
  }) =>
    React.createElement(
      component,
      { ...(ariaHidden !== undefined && { 'aria-hidden': ariaHidden }), ...props },
      children ?? null
    ),
}));

import { QuoteCard } from './quote-card';

// ---------------------------------------------------------------------------
// Quote text
// ---------------------------------------------------------------------------

describe('QuoteCard — quote text', () => {
  it('renders the quote text in the output', () => {
    const html = renderToStaticMarkup(
      React.createElement(QuoteCard, {
        quote: 'Leave every file a little better than you found it.',
      })
    );

    expect(html).toContain('Leave every file a little better than you found it.');
  });

  it('renders the decorative opening quote mark (U+201C)', () => {
    const html = renderToStaticMarkup(React.createElement(QuoteCard, { quote: 'Any quote.' }));

    expect(html).toContain('\u201C');
  });

  it('marks the decorative quote mark aria-hidden', () => {
    const html = renderToStaticMarkup(React.createElement(QuoteCard, { quote: 'Any quote.' }));

    expect(html).toContain('aria-hidden');
  });
});

// ---------------------------------------------------------------------------
// Attribution — author
// ---------------------------------------------------------------------------

describe('QuoteCard — author', () => {
  it('renders author text when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(QuoteCard, {
        quote: 'Great work.',
        author: 'Jane Smith',
      })
    );

    expect(html).toContain('Jane Smith');
  });

  it('does NOT render author text when omitted', () => {
    const html = renderToStaticMarkup(React.createElement(QuoteCard, { quote: 'Great work.' }));

    expect(html).not.toContain('Jane Smith');
  });
});

// ---------------------------------------------------------------------------
// Attribution — source
// ---------------------------------------------------------------------------

describe('QuoteCard — source', () => {
  it('renders source text when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(QuoteCard, {
        quote: 'Great work.',
        source: 'Platform Team',
      })
    );

    expect(html).toContain('Platform Team');
  });

  it('does NOT render source text when omitted', () => {
    const html = renderToStaticMarkup(React.createElement(QuoteCard, { quote: 'Great work.' }));

    expect(html).not.toContain('Platform Team');
  });
});

// ---------------------------------------------------------------------------
// Attribution row — visibility and separator
// ---------------------------------------------------------------------------

describe('QuoteCard — attribution row', () => {
  it('renders the attribution Stack when author is provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(QuoteCard, { quote: 'Great work.', author: 'Alex' })
    );

    expect(html).toContain('data-testid="stack"');
  });

  it('renders the attribution Stack when source is provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(QuoteCard, { quote: 'Great work.', source: 'Platform Team' })
    );

    expect(html).toContain('data-testid="stack"');
  });

  it('does NOT render the attribution Stack when neither author nor source is given', () => {
    const html = renderToStaticMarkup(React.createElement(QuoteCard, { quote: 'Great work.' }));

    expect(html).not.toContain('data-testid="stack"');
  });

  it('renders the separator dot when both author and source are present', () => {
    const html = renderToStaticMarkup(
      React.createElement(QuoteCard, {
        quote: 'Great work.',
        author: 'Jane Smith',
        source: 'Platform Team',
      })
    );

    // The separator is the middle dot character ·
    expect(html).toContain('\u00B7');
  });

  it('does NOT render the separator dot when only author is provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(QuoteCard, {
        quote: 'Great work.',
        author: 'Jane Smith',
      })
    );

    expect(html).not.toContain('\u00B7');
  });

  it('does NOT render the separator dot when only source is provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(QuoteCard, {
        quote: 'Great work.',
        source: 'Platform Team',
      })
    );

    expect(html).not.toContain('\u00B7');
  });
});

// ---------------------------------------------------------------------------
// Props forwarding
// ---------------------------------------------------------------------------

describe('QuoteCard — props forwarding', () => {
  it('forwards extra props to the root Paper element', () => {
    const html = renderToStaticMarkup(
      React.createElement(QuoteCard, {
        quote: 'Great work.',
        'data-testid': 'my-quote-card',
      } as React.ComponentProps<typeof QuoteCard> & { 'data-testid': string })
    );

    expect(html).toContain('data-testid="my-quote-card"');
  });
});

// ---------------------------------------------------------------------------
// Two-column layout structure
// ---------------------------------------------------------------------------

describe('QuoteCard — two-column layout', () => {
  it('renders the quote mark and quote text as siblings inside a shared flex container', () => {
    const html = renderToStaticMarkup(
      React.createElement(QuoteCard, { quote: 'Leave every file better than you found it.' })
    );

    // Paper mock renders as <div data-testid="paper">. The outer Box (flex container)
    // is its direct first child. Box mock renders as plain <div> with sx stripped.
    const parser = new globalThis.DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const paper = doc.querySelector('[data-testid="paper"]');
    expect(paper).not.toBeNull();

    // The flex container is the direct child of Paper
    const flexContainer = paper!.firstElementChild;
    expect(flexContainer).not.toBeNull();

    // Must have at least 2 direct children: left column (quote mark) + right column (text)
    const children = Array.from(flexContainer!.children);
    expect(children.length).toBeGreaterThanOrEqual(2);

    const hasQuoteMark = children.some((c) => c.textContent?.includes('\u201C'));
    const hasQuoteText = children.some((c) =>
      c.textContent?.includes('Leave every file better than you found it.')
    );

    expect(hasQuoteMark).toBe(true);
    expect(hasQuoteText).toBe(true);
  });
});
