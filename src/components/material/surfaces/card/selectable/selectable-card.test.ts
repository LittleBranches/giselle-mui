// @vitest-environment jsdom
/**
 * Unit tests for SelectableCard.
 *
 * MUI ButtonBase renders as a <button> element and correctly forwards
 * aria-pressed, disabled, and onClick — no mock needed.
 *
 * ## What is tested
 * - Root element is a <button>
 * - aria-pressed="false" when selected=false (default)
 * - aria-pressed="true" when selected=true
 * - Children are rendered inside the button
 * - onClick fires when the card is clicked and not disabled
 * - onClick does NOT fire when the card is disabled
 * - disabled attribute is present on the DOM element when disabled=true
 * - Extra props (aria-label, data-*) are forwarded to the root element
 */

import React, { act } from 'react';
import ReactDOM from 'react-dom/client';
import { it, vi, expect, describe, afterEach } from 'vitest';

import { renderWithTheme } from '../../../../../test-utils';
import { GiselleThemeProvider } from '../../../../../components/theming/theme-provider/giselle/giselle';
import { SelectableCard } from './selectable-card';

(globalThis as unknown as Record<string, unknown>)['IS_REACT_ACT_ENVIRONMENT'] = true;

// ---------------------------------------------------------------------------

describe('SelectableCard — structure', () => {
  it('renders a button element', () => {
    const html = renderWithTheme(React.createElement(SelectableCard, { selected: false }));
    expect(html).toContain('<button');
  });

  it('has aria-pressed="false" when selected is false', () => {
    const html = renderWithTheme(React.createElement(SelectableCard, { selected: false }));
    expect(html).toContain('aria-pressed="false"');
  });

  it('has aria-pressed="true" when selected is true', () => {
    const html = renderWithTheme(React.createElement(SelectableCard, { selected: true }));
    expect(html).toContain('aria-pressed="true"');
  });

  it('defaults aria-pressed to false when selected is omitted', () => {
    const html = renderWithTheme(React.createElement(SelectableCard, {}));
    expect(html).toContain('aria-pressed="false"');
  });

  it('renders children inside the button', () => {
    const html = renderWithTheme(
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
    const html = renderWithTheme(
      React.createElement(SelectableCard, {
        selected: false,
        'aria-label': 'Select Starter plan',
      } as React.ComponentProps<typeof SelectableCard> & { 'aria-label': string })
    );
    expect(html).toContain('aria-label="Select Starter plan"');
  });

  it('renders the disabled attribute when disabled=true', () => {
    const html = renderWithTheme(
      React.createElement(SelectableCard, { selected: false, disabled: true })
    );
    expect(html).toContain('disabled');
  });
});

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
      root!.render(
        React.createElement(GiselleThemeProvider, null, React.createElement(SelectableCard, props))
      );
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
