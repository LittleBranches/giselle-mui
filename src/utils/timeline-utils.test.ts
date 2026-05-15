// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import type { TimelinePhase, Milestone } from '../sections/timeline/two-column/types';
import { assignMilestoneSidesByDone } from './timeline-utils';

// ----------------------------------------------------------------------

const makeMs = (partial: Partial<Milestone>): Milestone =>
  ({ title: 'Test ms', done: false, date: '', ...partial }) as unknown as Milestone;

const makePhase = (milestones: Milestone[]): TimelinePhase =>
  ({
    key: 1,
    title: 'Test phase',
    date: 'May 2026',
    color: 'primary',
    side: 'right',
    milestones,
  }) as unknown as TimelinePhase;

// ----------------------------------------------------------------------

describe('assignMilestoneSidesByDone', () => {
  it('assigns side left to done milestones', () => {
    const result = assignMilestoneSidesByDone([makePhase([makeMs({ done: true })])])[0]!;
    expect(result.milestones![0]!.side).toBe('left');
  });

  it('assigns side right to not-done milestones', () => {
    const result = assignMilestoneSidesByDone([makePhase([makeMs({ done: false })])])[0]!;
    expect(result.milestones![0]!.side).toBe('right');
  });

  it('preserves explicit side override — does not overwrite when ms.side is set', () => {
    // done=true but explicit side:'right' must survive
    const result = assignMilestoneSidesByDone([
      makePhase([makeMs({ done: true, side: 'right' })]),
    ])[0]!;
    expect(result.milestones![0]!.side).toBe('right');
  });

  it('preserves all other milestone fields unchanged', () => {
    const result = assignMilestoneSidesByDone([
      makePhase([makeMs({ title: 'My ms', done: true, date: '1 Jan 2026', description: 'desc' })]),
    ])[0]!;
    const ms = result.milestones![0]!;
    expect(ms.title).toBe('My ms');
    expect(ms.date).toBe('1 Jan 2026');
    expect(ms.description).toBe('desc');
  });

  it('preserves the phase-level fields unchanged', () => {
    const result = assignMilestoneSidesByDone([makePhase([])])[0]!;
    expect(result.key).toBe(1);
    expect(result.color).toBe('primary');
    expect(result.side).toBe('right');
  });

  it('handles phases with no milestones array', () => {
    const phase = {
      key: 1,
      title: 'Empty',
      date: '',
      color: 'info',
      side: 'left',
    } as unknown as TimelinePhase;
    const result = assignMilestoneSidesByDone([phase])[0]!;
    expect(result.milestones).toBeUndefined();
  });

  it('processes multiple phases independently', () => {
    const results = assignMilestoneSidesByDone([
      makePhase([makeMs({ done: true })]),
      makePhase([makeMs({ done: false })]),
    ]);
    expect(results[0]!.milestones![0]!.side).toBe('left');
    expect(results[1]!.milestones![0]!.side).toBe('right');
  });
});
