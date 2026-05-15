// @vitest-environment jsdom
/**
 * Unit tests for SelectableCard.
 *
 * Two test groups:
 *
 * **Structure tests** (`renderToStaticMarkup`) — verify ARIA attributes and
 * element type in the server-rendered HTML. No DOM mount needed.
 *
 * **Interaction tests** (live DOM via `ReactDOM.createRoot`) — verify that
 * click handlers fire or are blocked as expected for enabled/disabled states.
 *
 * `ButtonBase` is mocked as a plain `<button>` element so the tests do not
 * require a full MUI theme or ripple setup.
 *
 * ## What is tested
 * - Root element is a `<button>`
 * - aria-pressed="false" when selected=false (default)
 * - aria-pressed="true" when selected=true
 * - Children are rendered inside the button
 * - onClick fires when the card is clicked and not disabled
 * - onClick does NOT fire when the card is disabled
 * - disabled attribute is present on the DOM element when disabled=true
 * - Extra props (aria-label, data-*) are forwarded to the root element
 *
 * ## What is NOT tested here
 * - Focus ring appearance (.Mui-focusVisible) — visual, requires browser
 * - Selected ring box-shadow — CSS, requires theme
 * - Ripple animation — MUI ButtonBase internals
 */

import React, { act } from 'react';
import ReactDOM from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { it, vi, expect, describe, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// ButtonBase mock — strips focusRipple and sx, otherwise forwards all props
// so aria-pressed, disabled, onClick reach the real <button> element.
// ---------------------------------------------------------------------------

vi.mock('@mui/material/ButtonBase', () => ({
  default: ({
    children,
    focusRipple: _focusRipple,
    disableRipple: _disableRipple,
    sx: _sx,
    ...props
  }: React.ComponentProps<'button'> & {
    focusRipple?: boolean;
    disableRipple?: boolean;
    sx?: unknown;
  }) => React.createElement('button', props, children ?? null),
}));

// Tell React 18's act() that this file runs in a test environment.
(globalThis as unknown as Record<string, unknown>)['IS_REACT_ACT_ENVIRONMENT'] = true;

import { SelectableCard } from './selectable-card';

// ---------------------------------------------------------------------------
// Structure tests
// ---------------------------------------------------------------------------

describe('SelectableCard — structure', () => {
  it('renders a button element', () => {
    const html = renderToStaticMarkup(React.createElement(SelectableCard, { selected: false }));

    expect(html).toMatch(/^<button/);
  });

  it('has aria-pressed="false" when selected is false', () => {
    const html = renderToStaticMarkup(React.createElement(SelectableCard, { selected: false }));

    expect(html).toContain('aria-pressed="false"');
  });

  it('has aria-pressed="true" when selected is true', () => {
    const html = renderToStaticMarkup(React.createElement(SelectableCard, { selected: true }));

    expect(html).toContain('aria-pressed="true"');
  });

  it('defaults aria-pressed to false when selected is omitted', () => {
    const html = renderToStaticMarkup(React.createElement(SelectableCard, {}));

    expect(html).toContain('aria-pressed="false"');
  });

  it('renders children inside the button', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        SelectableCard,
        { selected: false },
        React.createElement('span', { 'data-testid': 'card-child' }, 'Starter plan')
      )
    );

    expect(html).toContain('data-testid="card-child"');
    expect(html).toContain('Starter plan');
  });

  it('forwards aria-label to the root element', () => {
    const html = renderToStaticMarkup(
      React.createElement(SelectableCard, {
        selected: false,
        'aria-label': 'Select Starter plan',
      } as React.ComponentProps<typeof SelectableCard> & { 'aria-label': string })
    );

    expect(html).toContain('aria-label="Select Starter plan"');
  });

  it('renders the disabled attribute when disabled=true', () => {
    const html = renderToStaticMarkup(
      React.createElement(SelectableCard, { selected: false, disabled: true })
    );

    // ButtonBase sets disabled on the underlying button element
    expect(html).toContain('disabled');
  });
});

// ---------------------------------------------------------------------------
// Interaction tests — live DOM
// ---------------------------------------------------------------------------

describe('SelectableCard — interactions', () => {
  let root: ReturnType<typeof ReactDOM.createRoot> | null = null;
  let container: HTMLDivElement | null = null;

  afterEach(() => {
    if (root && container) {
      act(() => {
        root!.unmount();
      });
      container.remove();
      root = null;
      container = null;
    }
  });

  const mount = (props: React.ComponentProps<typeof SelectableCard>) => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = ReactDOM.createRoot(container);
    act(() => {
      root!.render(React.createElement(SelectableCard, props));
    });
    return container;
  };

  it('calls onClick when the card is clicked', () => {
    const spy = vi.fn();
    const div = mount({ selected: false, onClick: spy });

    div.querySelector('button')?.click();

    expect(spy).toHaveBeenCalledOnce();
  });

  it('does NOT call onClick when the card is disabled', () => {
    const spy = vi.fn();
    const div = mount({ selected: false, disabled: true, onClick: spy });

    div.querySelector('button')?.click();

    expect(spy).not.toHaveBeenCalled();
  });

  it('calls onClick with the click event as the argument', () => {
    const spy = vi.fn();
    const div = mount({ selected: false, onClick: spy });

    div.querySelector('button')?.click();

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }));
  });

  it('can be toggled: onClick fires on each click when not disabled', () => {
    const spy = vi.fn();
    const div = mount({ selected: false, onClick: spy });
    const btn = div.querySelector('button')!;

    btn.click();
    btn.click();
    btn.click();

    expect(spy).toHaveBeenCalledTimes(3);
  });
});
