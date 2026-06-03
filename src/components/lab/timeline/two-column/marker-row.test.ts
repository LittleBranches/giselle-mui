// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';

import type { TimelinePhase } from './types';
import type { MarkerRowProps } from './types';

// Child component mocks for unit isolation — these components have their own tests.
vi.mock('./timeline-dot', () => ({
  TimelineDot: () => React.createElement('span', { 'data-testid': 'timeline-dot' }),
}));

vi.mock('./spine-connector', () => ({
  SpineConnector: () => React.createElement('span', { 'data-testid': 'spine-connector' }),
}));

import { renderWithTheme } from '../../../../test-utils';
import { MarkerRow } from './marker-row';

// ---------------------------------------------------------------------------

const basePhase: TimelinePhase = {
  key: 1,
  title: 'Platform Released',
  shortTitle: 'Platform',
  date: 'Jan 2024',
  color: 'primary',
  side: 'right',
  variant: 'marker',
  description: 'First public release.',
  icon: null,
};

const baseProps: MarkerRowProps = {
  phase: basePhase,
  isLastPhase: false,
  dotColor: 'primary',
  isDone: false,
  checklist: false,
  yearLabelValue: null,
  isMobile: false,
};

// ---------------------------------------------------------------------------
// Label text
// ---------------------------------------------------------------------------

describe('MarkerRow — label text', () => {
  it('renders shortTitle when available', () => {
    const html = renderWithTheme(React.createElement(MarkerRow, baseProps));
    expect(html).toContain('Platform');
    expect(html).not.toContain('Platform Released');
  });

  it('falls back to title when shortTitle is not set', () => {
    const phase: TimelinePhase = { ...basePhase, shortTitle: undefined };
    const html = renderWithTheme(React.createElement(MarkerRow, { ...baseProps, phase }));
    expect(html).toContain('Platform Released');
  });

  it('renders date inline when phase.date is set', () => {
    const html = renderWithTheme(React.createElement(MarkerRow, baseProps));
    expect(html).toContain('Jan 2024');
  });

  it('omits date when phase.date is empty', () => {
    const phase: TimelinePhase = { ...basePhase, date: '' };
    const html = renderWithTheme(React.createElement(MarkerRow, { ...baseProps, phase }));
    expect(html).not.toContain('Jan 2024');
  });
});

// ---------------------------------------------------------------------------
// Label slot visibility
// ---------------------------------------------------------------------------

describe('MarkerRow — label slot visibility', () => {
  it('renders label once when side="right" on desktop (right slot only)', () => {
    const html = renderWithTheme(React.createElement(MarkerRow, baseProps));
    const count = (html.match(/Platform/g) ?? []).length;
    expect(count).toBe(1);
  });

  it('renders label once when side="left" on desktop (left slot only)', () => {
    const phase: TimelinePhase = { ...basePhase, side: 'left' };
    const html = renderWithTheme(
      React.createElement(MarkerRow, { ...baseProps, phase, isMobile: false })
    );
    const count = (html.match(/Platform/g) ?? []).length;
    expect(count).toBe(1);
  });

  it('[regression: mobile] renders label in both slots when isMobile=true and side="left"', () => {
    // Left slot always renders when side='left'. Right slot renders when (side !== 'left' || isMobile).
    // When isMobile=true: right slot also renders for side='left' phases so the label is
    // visible at xs — the left slot is hidden by CSS (markerLabelSlotSx('left') display.xs='none')
    // and the right slot provides the visible text on mobile.
    const phase: TimelinePhase = { ...basePhase, side: 'left' };
    const html = renderWithTheme(
      React.createElement(MarkerRow, { ...baseProps, phase, isMobile: true })
    );
    const count = (html.match(/Platform/g) ?? []).length;
    expect(count).toBeGreaterThanOrEqual(2);
  });

  it('[regression: mobile] side="right" still renders in right slot when isMobile=true', () => {
    const html = renderWithTheme(React.createElement(MarkerRow, { ...baseProps, isMobile: true }));
    expect(html).toContain('Platform');
  });
});

// ---------------------------------------------------------------------------
// Spine connector
// ---------------------------------------------------------------------------

describe('MarkerRow — spine connector', () => {
  it('renders spine connector when isLastPhase=false', () => {
    const html = renderWithTheme(React.createElement(MarkerRow, baseProps));
    expect(html).toContain('data-testid="spine-connector"');
  });

  it('suppresses spine connector when isLastPhase=true', () => {
    const html = renderWithTheme(
      React.createElement(MarkerRow, { ...baseProps, isLastPhase: true })
    );
    expect(html).not.toContain('data-testid="spine-connector"');
  });
});
