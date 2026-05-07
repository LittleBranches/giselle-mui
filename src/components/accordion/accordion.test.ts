// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactDOM from 'react-dom/client';
import { act } from 'react';

import { ACCORDION_DONE_MIN_TOUCH_TARGET } from './accordion.const';
import { Accordion } from './accordion';

// ----------------------------------------------------------------------

const EXPAND_ICON = React.createElement('span', { 'data-testid': 'expand-icon' }, '▾');
const LEADING_ICON = React.createElement('span', { 'data-testid': 'leading-icon' });
const DETAILS = React.createElement('span', { 'data-testid': 'details' }, 'Content');

// ----------------------------------------------------------------------

describe('Accordion — rendering', () => {
  it('renders a string title', () => {
    const html = renderToStaticMarkup(
      React.createElement(Accordion, { title: 'My Title' }, DETAILS)
    );
    expect(html).toContain('My Title');
  });

  it('renders a ReactNode title', () => {
    const nodeTitle = React.createElement('strong', null, 'Bold Title');
    const html = renderToStaticMarkup(
      React.createElement(Accordion, { title: nodeTitle }, DETAILS)
    );
    expect(html).toContain('<strong>Bold Title</strong>');
  });

  it('renders children inside the accordion details', () => {
    const html = renderToStaticMarkup(
      React.createElement(Accordion, { title: 'Test', defaultExpanded: true }, DETAILS)
    );
    expect(html).toContain('data-testid="details"');
    expect(html).toContain('Content');
  });

  it('renders the expandIcon when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(Accordion, { title: 'Test', expandIcon: EXPAND_ICON }, DETAILS)
    );
    expect(html).toContain('data-testid="expand-icon"');
  });

  it('does not render a checkbox when checklist is false', () => {
    const html = renderToStaticMarkup(
      React.createElement(Accordion, { title: 'Test', checklist: false }, DETAILS)
    );
    expect(html).not.toContain('<input');
  });
});

// ----------------------------------------------------------------------

describe('Accordion — ARIA attributes', () => {
  it('summary has id and aria-controls that match the details id', () => {
    const html = renderToStaticMarkup(
      React.createElement(Accordion, { title: 'ARIA test' }, DETAILS)
    );
    // Extract the accordion-summary id
    const summaryIdMatch = html.match(/id="(accordion-summary-[^"]+)"/);
    expect(summaryIdMatch).not.toBeNull();
    const summaryId = summaryIdMatch?.[1] ?? '';
    expect(summaryId).not.toBe('');

    // aria-controls on the summary button should point to the details panel
    const ariaControlsMatch = html.match(/aria-controls="(accordion-details-[^"]+)"/);
    expect(ariaControlsMatch).not.toBeNull();
    const detailsId = ariaControlsMatch?.[1] ?? '';
    expect(detailsId).not.toBe('');

    // Both should share the same unique suffix (the useId value)
    const summarySuffix = summaryId.replace('accordion-summary-', '');
    const detailsSuffix = detailsId.replace('accordion-details-', '');
    expect(summarySuffix).toBe(detailsSuffix);
  });
});

// ----------------------------------------------------------------------

describe('Accordion — leadingIcon mode', () => {
  it('renders the leading icon when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(Accordion, { title: 'Test', leadingIcon: LEADING_ICON }, DETAILS)
    );
    expect(html).toContain('data-testid="leading-icon"');
  });

  it('wraps the leading icon in an aria-hidden container', () => {
    const html = renderToStaticMarkup(
      React.createElement(Accordion, { title: 'Test', leadingIcon: LEADING_ICON }, DETAILS)
    );
    expect(html).toContain('aria-hidden="true"');
  });

  it('does not render a checkbox when leadingIcon is given but checklist is false', () => {
    const html = renderToStaticMarkup(
      React.createElement(Accordion, { title: 'Test', leadingIcon: LEADING_ICON }, DETAILS)
    );
    expect(html).not.toContain('<input');
  });
});

// ----------------------------------------------------------------------

describe('Accordion — checklist mode', () => {
  it('renders a checkbox when checklist is true', () => {
    const html = renderToStaticMarkup(
      React.createElement(Accordion, { title: 'Task', checklist: true }, DETAILS)
    );
    expect(html).toContain('<input');
    expect(html).toContain('type="checkbox"');
  });

  it('checkbox is unchecked when done=false', () => {
    const html = renderToStaticMarkup(
      React.createElement(Accordion, { title: 'Task', checklist: true, done: false }, DETAILS)
    );
    expect(html).not.toContain('checked=""');
  });

  it('checkbox is checked when done=true', () => {
    const html = renderToStaticMarkup(
      React.createElement(Accordion, { title: 'Task', checklist: true, done: true }, DETAILS)
    );
    expect(html).toContain('checked=""');
  });

  it('checkbox aria-label reflects done=false state', () => {
    const html = renderToStaticMarkup(
      React.createElement(Accordion, { title: 'Task', checklist: true, done: false }, DETAILS)
    );
    expect(html).toContain('Mark as done');
  });

  it('checkbox aria-label reflects done=true state', () => {
    const html = renderToStaticMarkup(
      React.createElement(Accordion, { title: 'Task', checklist: true, done: true }, DETAILS)
    );
    expect(html).toContain('Mark as not done');
  });

  it('checklist mode renders the title text', () => {
    const html = renderToStaticMarkup(
      React.createElement(Accordion, { title: 'My task title', checklist: true }, DETAILS)
    );
    expect(html).toContain('My task title');
  });

  it('leading icon is NOT rendered when checklist mode is active', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        Accordion,
        { title: 'Task', checklist: true, leadingIcon: LEADING_ICON },
        DETAILS
      )
    );
    // Checkbox should appear, leading icon should not
    expect(html).toContain('<input');
    expect(html).not.toContain('data-testid="leading-icon"');
  });
});

// ----------------------------------------------------------------------

describe('Accordion — checklist interaction', () => {
  it('calls onDoneButtonClick(true) when unchecked checkbox is clicked', () => {
    const handler = vi.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);

    act(() => {
      ReactDOM.createRoot(container).render(
        React.createElement(
          Accordion,
          { title: 'Task', checklist: true, done: false, onDoneButtonClick: handler },
          DETAILS
        )
      );
    });

    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).not.toBeNull();

    act(() => {
      (checkbox as HTMLInputElement).click();
    });

    expect(handler).toHaveBeenCalledWith(true);
    document.body.removeChild(container);
  });

  it('calls onDoneButtonClick(false) when checked checkbox is clicked', () => {
    const handler = vi.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);

    act(() => {
      ReactDOM.createRoot(container).render(
        React.createElement(
          Accordion,
          { title: 'Task', checklist: true, done: true, onDoneButtonClick: handler },
          DETAILS
        )
      );
    });

    const checkbox = container.querySelector('input[type="checkbox"]');
    act(() => {
      (checkbox as HTMLInputElement).click();
    });

    expect(handler).toHaveBeenCalledWith(false);
    document.body.removeChild(container);
  });

  it('does not call onDoneButtonClick when checklist is false', () => {
    const handler = vi.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);

    act(() => {
      ReactDOM.createRoot(container).render(
        React.createElement(
          Accordion,
          { title: 'Task', checklist: false, onDoneButtonClick: handler },
          DETAILS
        )
      );
    });

    // No checkbox rendered, handler should never be called
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeNull();
    expect(handler).not.toHaveBeenCalled();
    document.body.removeChild(container);
  });
});

// ----------------------------------------------------------------------

describe('readability — minimum size constants', () => {
  it('[regression] ACCORDION_DONE_MIN_TOUCH_TARGET >= 24px (WCAG 2.5.8)', () => {
    expect(ACCORDION_DONE_MIN_TOUCH_TARGET).toBeGreaterThanOrEqual(24);
  });
});
