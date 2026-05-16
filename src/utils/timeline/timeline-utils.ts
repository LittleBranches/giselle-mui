import type { TimelinePhase } from '../../components/section/timeline/two-column/types';

// ----------------------------------------------------------------------

/**
 * Transforms a `TimelinePhase[]` array so that each milestone's column placement
 * is derived automatically from its `done` state:
 *
 * - `done: true`  → `side: 'left'`  (Complete column)
 * - `done: false` → `side: 'right'` (Remaining column)
 *
 * **When to use:**
 * For checklist-style timelines where the two columns represent "Complete" and
 * "Remaining" — and the column a milestone belongs to is a function of its progress
 * state, not of a manual data entry.
 *
 * **Explicit overrides are preserved:**
 * If a milestone already has an explicit `side` property set in the data, that value
 * is kept unchanged. The auto-assignment only fills in milestones where `ms.side` is
 * `undefined`.
 *
 * **Where this logic lives (architectural rationale):**
 * The library's `TimelineTwoColumn` component does not automatically re-route milestones
 * based on `done` because it has no knowledge of the columns' semantic meaning — a
 * consumer could use "Past / Future", "Professional / Personal", or any other axis.
 * This transform lives in the consuming app's data layer (`sections-api/`), which is
 * where business semantics belong. The library exports the function so consumers don't
 * have to rediscover the correct `side` mapping pattern.
 *
 * @example
 * ```ts
 * // In sections-api/store-readiness/data.tsx
 * import { assignMilestoneSidesByDone } from '@alexrebula/giselle-mui';
 *
 * export const storeReadinessPhases = assignMilestoneSidesByDone(rawPhases);
 * ```
 */
export function assignMilestoneSidesByDone(phases: TimelinePhase[]): TimelinePhase[] {
  return phases.map((phase) => ({
    ...phase,
    milestones: phase.milestones?.map((ms) => ({
      ...ms,
      side: ms.side ?? (ms.done ? 'left' : 'right'),
    })),
  }));
}
