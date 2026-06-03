// @vitest-environment jsdom
/**
 * Unit tests for QuoteCard.
 *
 * MUI components run with GiselleThemeProvider — no MUI mocks needed.
 *
 * ## What is tested
 * - Quote text is rendered in the output
 * - author is rendered when provided
 * - source is rendered when provided
 * - Both author and source are rendered when both are provided
 * - Attribution row is NOT rendered when neither author nor source is given
 * - Separator dot is rendered ONLY when both author and source are present
 * - Separator dot is absent when only one of author/source is provided
 * - Decorative opening quote mark (U+201C) is present in the output
 * - Decorative quote mark carries aria-hidden (skipped by screen readers)
 * - Extra props are forwarded to the root element
 *
 * ## What is NOT tested here
 * - Background tint / border color (sx callbacks — design-system level)
 * - Dark mode adaptation
 */

import React from 'react';
import { it, expect, describe } from 'vitest';

import { renderWithTheme } from '../../../../../test-utils';
import { QuoteCard } from './quote-card';

// ---------------------------------------------------------------------------

describe('QuoteCard — quote text', () => {
  it('renders the quote text in the output', () => {
    const html = renderWithTheme(
      React.createElement(QuoteCard, {
        quote: 'Leave every file a little better than you found it.',
      })
    );
    expect(html).toContain('Leave every file a little better than you found it.');
  });

  it('renders the decorative opening quote mark (U+201C)', () => {
    const html = renderWithTheme(React.createElement(QuoteCard, { quote: 'Any quote.' }));
    expect(html).toContain('“');
  });

  it('marks the decorative quote mark aria-hidden', () => {
    const html = renderWithTheme(React.createElement(QuoteCard, { quote: 'Any quote.' }));
    expect(html).toContain('aria-hidden');
  });
});

// ---------------------------------------------------------------------------

describe('QuoteCard — author', () => {
  it('renders author text when provided', () => {
    const html = renderWithTheme(
      React.createElement(QuoteCard, { quote: 'Great work.', author: 'Jane Smith' })
    );
    expect(html).toContain('Jane Smith');
  });

  it('does NOT render author text when omitted', () => {
    const html = renderWithTheme(React.createElement(QuoteCard, { quote: 'Great work.' }));
    expect(html).not.toContain('Jane Smith');
  });
});

// ---------------------------------------------------------------------------

describe('QuoteCard — source', () => {
  it('renders source text when provided', () => {
    const html = renderWithTheme(
      React.createElement(QuoteCard, { quote: 'Great work.', source: 'Platform Team' })
    );
    expect(html).toContain('Platform Team');
  });

  it('does NOT render source text when omitted', () => {
    const html = renderWithTheme(React.createElement(QuoteCard, { quote: 'Great work.' }));
    expect(html).not.toContain('Platform Team');
  });
});

// ---------------------------------------------------------------------------

describe('QuoteCard — attribution row', () => {
  it('renders author in the output when author is provided', () => {
    const html = renderWithTheme(
      React.createElement(QuoteCard, { quote: 'Great work.', author: 'Jane Smith' })
    );
    expect(html).toContain('Jane Smith');
  });

  it('renders source in the output when source is provided', () => {
    const html = renderWithTheme(
      React.createElement(QuoteCard, { quote: 'Great work.', source: 'Platform Team' })
    );
    expect(html).toContain('Platform Team');
  });

  it('does NOT render author or source when neither is given', () => {
    const html = renderWithTheme(React.createElement(QuoteCard, { quote: 'Great work.' }));
    expect(html).not.toContain('Jane Smith');
    expect(html).not.toContain('Platform Team');
  });

  it('renders the separator dot when both author and source are present', () => {
    const html = renderWithTheme(
      React.createElement(QuoteCard, {
        quote: 'Great work.',
        author: 'Jane Smith',
        source: 'Platform Team',
      })
    );
    expect(html).toContain('·');
  });

  it('does NOT render the separator dot when only author is provided', () => {
    const html = renderWithTheme(
      React.createElement(QuoteCard, { quote: 'Great work.', author: 'Jane Smith' })
    );
    expect(html).not.toContain('·');
  });

  it('does NOT render the separator dot when only source is provided', () => {
    const html = renderWithTheme(
      React.createElement(QuoteCard, { quote: 'Great work.', source: 'Platform Team' })
    );
    expect(html).not.toContain('·');
  });
});

// ---------------------------------------------------------------------------

describe('QuoteCard — props forwarding', () => {
  it('forwards extra props to the root Paper element', () => {
    const html = renderWithTheme(
      React.createElement(QuoteCard, {
        quote: 'Great work.',
        'data-testid': 'my-quote-card',
      } as React.ComponentProps<typeof QuoteCard> & { 'data-testid': string })
    );
    expect(html).toContain('data-testid="my-quote-card"');
  });
});

// ---------------------------------------------------------------------------

describe('QuoteCard — two-column layout', () => {
  it('renders both the quote mark and the quote text', () => {
    const html = renderWithTheme(
      React.createElement(QuoteCard, { quote: 'Leave every file better than you found it.' })
    );
    expect(html).toContain('“');
    expect(html).toContain('Leave every file better than you found it.');
  });
});
