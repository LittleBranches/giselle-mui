// @vitest-environment jsdom
/**
 * Unit tests for GiselleIcon.
 *
 * @iconify/react is mocked so tests have no network dependency and icon
 * output is deterministic via data attributes. MUI Box renders with
 * GiselleThemeProvider — no mock needed.
 */

import React from 'react';
import { it, vi, expect, describe } from 'vitest';

// @iconify/react mock: renders icon metadata as data attributes for assertions.
vi.mock('@iconify/react', () => ({
  Icon: ({
    icon,
    width,
    height,
    flip,
    rotate,
    className,
    style,
  }: {
    icon: string;
    width?: number | string;
    height?: number | string;
    flip?: string;
    rotate?: number | string;
    className?: string;
    style?: React.CSSProperties;
  }) =>
    React.createElement('svg', {
      'data-icon': icon,
      'data-width': width,
      'data-height': height,
      ...(flip !== undefined && { 'data-flip': flip }),
      ...(rotate !== undefined && { 'data-rotate': rotate }),
      ...(className !== undefined && { className }),
      ...(style !== undefined && { style }),
    }),
}));

import { renderWithTheme } from '../../../../../test-utils';
import { GiselleIcon } from './giselle-icon';

// ---------------------------------------------------------------------------

function render(props: React.ComponentProps<typeof GiselleIcon>) {
  return renderWithTheme(React.createElement(GiselleIcon, props));
}

// ---------------------------------------------------------------------------

describe('GiselleIcon', () => {
  it('forwards the icon string to the inner Icon element', () => {
    const html = render({ icon: 'solar:rocket-bold-duotone' });
    expect(html).toContain('data-icon="solar:rocket-bold-duotone"');
  });

  it('inner SVG fills the wrapper — data-width and data-height are always "100%"', () => {
    const html = render({ icon: 'logos:react', width: 36, height: 40 });
    expect(html).toContain('data-width="100%"');
    expect(html).toContain('data-height="100%"');
    expect(html).not.toMatch(/data-width="\d+"/);
    expect(html).not.toMatch(/data-height="\d+"/);
  });

  it('forwards className to the inner Icon element', () => {
    const html = render({ icon: 'solar:star-bold-duotone', className: 'my-icon' });
    expect(html).toContain('class="my-icon"');
  });

  it('forwards flip to the inner Icon element', () => {
    const html = render({ icon: 'solar:arrow-right-bold', flip: 'horizontal' });
    expect(html).toContain('data-flip="horizontal"');
  });

  it('forwards rotate to the inner Icon element', () => {
    const html = render({ icon: 'solar:arrow-right-bold', rotate: 1 });
    expect(html).toContain('data-rotate="1"');
  });

  it('renders a span as the wrapper element (component="span")', () => {
    const html = render({ icon: 'solar:rocket-bold-duotone' });
    expect(html).toMatch(/^<span/);
  });

  it('inner SVG fills the wrapper when no width prop is passed (sx-only sizing)', () => {
    const html = render({ icon: 'solar:home-bold-duotone' });
    expect(html).toContain('data-width="100%"');
    expect(html).toContain('data-height="100%"');
    expect(html).not.toMatch(/data-width="\d+"/);
    expect(html).not.toMatch(/data-height="\d+"/);
  });

  it('renders without throwing for any icon string', () => {
    expect(() => render({ icon: 'any:unknown-icon-string' })).not.toThrow();
  });
});
