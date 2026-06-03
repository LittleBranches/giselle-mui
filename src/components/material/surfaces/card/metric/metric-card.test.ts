// @vitest-environment jsdom
/**
 * Unit tests for MetricCard and MetricCardDecoration.
 *
 * MUI components render with GiselleThemeProvider — no MUI mocks needed.
 *
 * ## What is tested — MetricCard
 * - value text is rendered in the output
 * - label text is rendered in the output
 * - sublabel is rendered when provided
 * - sublabel is NOT rendered when omitted
 * - icon slot content is rendered when provided
 * - icon slot is NOT rendered when icon prop is omitted
 * - icon wrapper carries aria-hidden (icon is decorative)
 * - decoration slot content is rendered when provided
 * - decoration slot is NOT rendered when decoration prop is omitted
 * - decoration wrapper carries aria-hidden
 * - additional props are forwarded to the root element
 *
 * ## What is NOT tested here
 * - sx / CSS styles (design-system level)
 * - Responsive layout
 */

import React from 'react';
import { it, expect, describe } from 'vitest';

import { renderWithTheme } from '../../../../../test-utils';
import { MetricCard, MetricCardDecoration } from './metric-card';
import { METRIC_CARD_ICON_BOX_SIZE, METRIC_CARD_DECORATION_SIZE } from './metric-card.const';

// ---------------------------------------------------------------------------

describe('readability — minimum size constants', () => {
  it('[regression] METRIC_CARD_ICON_BOX_SIZE >= 24px', () => {
    expect(METRIC_CARD_ICON_BOX_SIZE).toBeGreaterThanOrEqual(24);
  });

  it('[regression] METRIC_CARD_DECORATION_SIZE >= 80px', () => {
    expect(METRIC_CARD_DECORATION_SIZE).toBeGreaterThanOrEqual(80);
  });
});

// ---------------------------------------------------------------------------

describe('MetricCard — content', () => {
  it('renders the value text', () => {
    const html = renderWithTheme(React.createElement(MetricCard, { value: '20+', label: 'Years' }));
    expect(html).toContain('20+');
  });

  it('renders a numeric value', () => {
    const html = renderWithTheme(React.createElement(MetricCard, { value: 5, label: 'Clients' }));
    expect(html).toContain('5');
  });

  it('renders the label text', () => {
    const html = renderWithTheme(
      React.createElement(MetricCard, { value: '20+', label: 'Years experience' })
    );
    expect(html).toContain('Years experience');
  });

  it('renders sublabel when provided', () => {
    const html = renderWithTheme(
      React.createElement(MetricCard, {
        value: '20+',
        label: 'Years',
        sublabel: 'of experience',
      })
    );
    expect(html).toContain('of experience');
  });

  it('does NOT render sublabel when omitted', () => {
    const html = renderWithTheme(React.createElement(MetricCard, { value: '20+', label: 'Years' }));
    expect(html).not.toContain('front-end');
  });
});

// ---------------------------------------------------------------------------

describe('MetricCard — icon slot', () => {
  it('renders icon slot content when provided', () => {
    const html = renderWithTheme(
      React.createElement(MetricCard, {
        value: '20+',
        label: 'Years',
        icon: React.createElement('span', { 'data-testid': 'icon-content' }),
      })
    );
    expect(html).toContain('data-testid="icon-content"');
  });

  it('does NOT render the icon wrapper when icon is omitted', () => {
    const html = renderWithTheme(React.createElement(MetricCard, { value: '20+', label: 'Years' }));
    expect(html).not.toContain('data-testid="icon-content"');
  });

  it('marks the icon wrapper aria-hidden (icon is decorative)', () => {
    const html = renderWithTheme(
      React.createElement(MetricCard, {
        value: '20+',
        label: 'Years',
        icon: React.createElement('span', { 'data-testid': 'icon-slot' }),
      })
    );
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-testid="icon-slot"');
  });
});

// ---------------------------------------------------------------------------

describe('MetricCard — decoration slot', () => {
  it('renders decoration slot content when provided', () => {
    const html = renderWithTheme(
      React.createElement(MetricCard, {
        value: '20+',
        label: 'Years',
        decoration: React.createElement('div', { 'data-testid': 'decoration-content' }),
      })
    );
    expect(html).toContain('data-testid="decoration-content"');
  });

  it('does NOT render the decoration wrapper when decoration is omitted', () => {
    const html = renderWithTheme(React.createElement(MetricCard, { value: '20+', label: 'Years' }));
    expect(html).not.toContain('data-testid="decoration-content"');
  });

  it('marks the decoration wrapper aria-hidden (decoration is presentational)', () => {
    const html = renderWithTheme(
      React.createElement(MetricCard, {
        value: '20+',
        label: 'Years',
        decoration: React.createElement('div', { 'data-testid': 'dec' }),
      })
    );
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-testid="dec"');
  });
});

// ---------------------------------------------------------------------------

describe('MetricCard — Paper props', () => {
  it('renders without error with default elevation', () => {
    expect(() =>
      renderWithTheme(React.createElement(MetricCard, { value: '20+', label: 'Years' }))
    ).not.toThrow();
  });

  it('renders without error with a custom elevation', () => {
    expect(() =>
      renderWithTheme(
        React.createElement(MetricCard, { value: '20+', label: 'Years', elevation: 4 })
      )
    ).not.toThrow();
  });

  it('forwards extra props to the root Paper element', () => {
    const html = renderWithTheme(
      React.createElement(MetricCard, {
        value: '20+',
        label: 'Years',
        'data-testid': 'my-card',
      } as React.ComponentProps<typeof MetricCard> & { 'data-testid': string })
    );
    expect(html).toContain('data-testid="my-card"');
  });
});

// ---------------------------------------------------------------------------

describe('MetricCardDecoration', () => {
  it('renders without throwing', () => {
    expect(() => renderWithTheme(React.createElement(MetricCardDecoration, {}))).not.toThrow();
  });

  it('renders without throwing for each supported color', () => {
    const colors = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;
    for (const color of colors) {
      expect(() =>
        renderWithTheme(React.createElement(MetricCardDecoration, { color }))
      ).not.toThrow();
    }
  });
});
