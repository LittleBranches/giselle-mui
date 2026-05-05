// @vitest-environment jsdom
/**
 * Unit tests for GiselleIcon.
 *
 * Rendering uses `renderToStaticMarkup` (React SSR) — no full DOM mount needed
 * for structural assertions. MUI Box is mocked to avoid theme-provider
 * requirements; @iconify/react Icon is mocked so tests have no network
 * dependency and icon output is deterministic via data attributes.
 *
 * ## What is tested
 * - Icon identifier is forwarded to the inner Icon element
 * - Inner SVG always fills the wrapper (data-width/data-height are "100%")
 * - className and style are forwarded to the inner Icon
 * - flip and rotate are forwarded to the inner Icon
 * - Wrapper element is a `span` (component="span")
 *
 * ## Width / height sizing
 * `width` and `height` props control the wrapper span's CSS dimensions (via `sx`).
 * The inner SVG fills the wrapper at 100%, enabling responsive breakpoint values
 * in `sx` to control the rendered size. Wrapper size via `sx` is not testable
 * without a MUI theme provider — verified at design-system level.
 *
 * ## What is NOT tested here
 * - sx styles (require MUI theme — verified at design-system level)
 * - Actual SVG path rendering (icon library internals)
 * - Network fallback behaviour (Iconify CDN)
 *
 * ## Negative assertion discipline
 * Negative assertions here use regex (`not.toMatch(/data-width="\d+"/)`) rather than
 * specific string literals (`not.toContain('data-width="20"')`).
 * Reason: the constraint is categorical — "no pure numeric value at all must reach the inner
 * Icon" — not "this one specific number must not appear". A specific literal would only
 * catch one wrong value and pass silently if the implementation leaked a different number.
 * The pattern `/data-width="\d+"/` matches only bare integers (no unit suffix) — it does NOT
 * match `"100%"` (percent), `"1em"` (em), or `"auto"`. It catches `"20"`, `"36"`, `"0"`, etc.
 * Use `not.toContain(literal)` only when guarding against one known-bad specific value
 * (e.g. an old formula that was replaced). Use regex when the constraint is about a
 * category or type of value.
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { it, vi, expect, describe } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks — declared before the component import so Vitest hoisting works.
// ---------------------------------------------------------------------------

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

// Box mock: renders the element named by `component` (defaulting to "div")
// and strips `sx` so no MUI theme context is needed.
vi.mock('@mui/material/Box', () => ({
  default: ({
    component = 'div',
    children,
    sx: _sx,
    ...props
  }: {
    component?: string;
    children?: React.ReactNode;
    sx?: unknown;
    [key: string]: unknown;
  }) => React.createElement(component as string, props, children ?? null),
}));

import { GiselleIcon } from './giselle-icon';

// ---------------------------------------------------------------------------
// Structure tests
// ---------------------------------------------------------------------------

describe('GiselleIcon', () => {
  it('forwards the icon string to the inner Icon element', () => {
    const html = renderToStaticMarkup(
      React.createElement(GiselleIcon, { icon: 'solar:rocket-bold-duotone' })
    );

    expect(html).toContain('data-icon="solar:rocket-bold-duotone"');
  });

  it('inner SVG fills the wrapper — data-width and data-height are always "100%"', () => {
    // The wrapper Box span holds the CSS dimensions (via sx).
    // The inner SVG fills the wrapper at 100% regardless of the width/height props.
    const html = renderToStaticMarkup(
      React.createElement(GiselleIcon, { icon: 'logos:react', width: 36, height: 40 })
    );

    expect(html).toContain('data-width="100%"');
    expect(html).toContain('data-height="100%"');
    // No numeric value must reach the inner Icon — the wrapper Box owns dimensions via sx.
    expect(html).not.toMatch(/data-width="\d+"/);
    expect(html).not.toMatch(/data-height="\d+"/);
  });

  it('forwards className to the inner Icon element', () => {
    const html = renderToStaticMarkup(
      React.createElement(GiselleIcon, {
        icon: 'solar:star-bold-duotone',
        className: 'my-icon',
      })
    );

    expect(html).toContain('class="my-icon"');
  });

  it('forwards flip to the inner Icon element', () => {
    const html = renderToStaticMarkup(
      React.createElement(GiselleIcon, {
        icon: 'solar:arrow-right-bold',
        flip: 'horizontal',
      })
    );

    expect(html).toContain('data-flip="horizontal"');
  });

  it('forwards rotate to the inner Icon element', () => {
    const html = renderToStaticMarkup(
      React.createElement(GiselleIcon, {
        icon: 'solar:arrow-right-bold',
        rotate: 1,
      })
    );

    expect(html).toContain('data-rotate="1"');
  });

  it('renders a span as the wrapper element (component="span")', () => {
    const html = renderToStaticMarkup(
      React.createElement(GiselleIcon, { icon: 'solar:rocket-bold-duotone' })
    );

    expect(html).toMatch(/^<span/);
  });

  it('inner SVG fills the wrapper when no width prop is passed (sx-only sizing)', () => {
    // Regression: when GiselleIcon is used with only sx for sizing (no width/height prop),
    // the inner Icon must still fill the wrapper at 100% — not default to 20px.
    // This is the floating-nav pattern: <GiselleIcon icon="..." sx={{ width: { xs: 24, lg: 30 } }} />
    const html = renderToStaticMarkup(
      React.createElement(GiselleIcon, { icon: 'solar:home-bold-duotone' })
    );

    expect(html).toContain('data-width="100%"');
    expect(html).toContain('data-height="100%"');
    // No numeric value — regardless of the default — must reach the inner Icon.
    expect(html).not.toMatch(/data-width="\d+"/);
    expect(html).not.toMatch(/data-height="\d+"/);
  });

  it('renders without throwing for any icon string', () => {
    expect(() =>
      renderToStaticMarkup(React.createElement(GiselleIcon, { icon: 'any:unknown-icon-string' }))
    ).not.toThrow();
  });
});
