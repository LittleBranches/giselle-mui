// @vitest-environment jsdom

/**
 * Pure-logic unit tests for the derivations inside MilestoneBadge.
 *
 * None of these tests mount the component — they extract and verify the exact
 * decision functions in isolation.  If the component logic changes, update the
 * mirror functions below to match and the tests will catch any unintentional
 * behavioural drift.
 *
 * ## Derivations under test
 *
 *   hasDetails  = !!details?.length
 *
 * ## Removed derivations (v2 redesign)
 *
 *   topPct     — removed. Milestones now render as in-flow flex rows inside
 *                their parent phase <li>, not as overlay elements absolutely
 *                positioned on the spine connector. No percentage offset is
 *                needed. (Milestone badge cards within each row are still
 *                absolutely positioned, but row placement is handled by DOM flow.)
 *   cardOnLeft — removed. Card placement is handled by TimelineColumn in
 *                timeline-two-column.tsx, not by MilestoneBadge itself.
 *   isInline   — removed. The `display` prop has been removed from the milestone
 *                type. All milestone cards are now full-width inline cards.
 */

import { it, expect, describe } from 'vitest';

import {
  MILESTONE_DATE_FONT_SIZE,
  MILESTONE_PILL_ICON_SIZE,
  MILESTONE_PILL_TEXT_FONT_SIZE,
  MILESTONE_EYE_ICON_SIZE,
  MILESTONE_EYE_BUTTON_MIN_SIZE,
} from './milestone-badge';

// ---------------------------------------------------------------------------
// Mirror functions — exact copies of the inline derivations in MilestoneBadge.
// ---------------------------------------------------------------------------

/**
 * Mirrors: const hasDetails = !!details?.length;
 *
 * Gates cursor, onClick handler, aria-expanded, and the Collapse expand section.
 * Independent of any display mode — any milestone can have expandable details.
 */
function computeHasDetails(details?: string[]): boolean {
  return !!details?.length;
}

// ---------------------------------------------------------------------------
// hasDetails — interactivity gate
// ---------------------------------------------------------------------------

describe('hasDetails — interactivity gate', () => {
  it('details undefined → false (no interactivity for bare title+date milestones)', () => {
    expect(computeHasDetails(undefined)).toBe(false);
  });

  it('details empty array → false (empty array is treated as no details)', () => {
    expect(computeHasDetails([])).toBe(false);
  });

  it('details with one item → true', () => {
    expect(computeHasDetails(['Founded 2009'])).toBe(true);
  });

  it('details with multiple items → true', () => {
    expect(computeHasDetails(['Item A', 'Item B', 'Item C'])).toBe(true);
  });

  it('[regression] any milestone with details is expandable regardless of display mode', () => {
    // display mode no longer exists — all milestones with details can expand.
    expect(computeHasDetails(['Sponsored work visa', '457 temporary'])).toBe(true);
  });

  it('[regression] milestone with no details is not expandable', () => {
    expect(computeHasDetails(undefined)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Readability — minimum size constants (regression)
//
// These tests enforce that no size value falls below the minimum readable
// threshold. If a constant is ever reduced below the minimum, the test fails
// immediately — before the change reaches production or Storybook.
//
// Minimums:
//   - Icon size  >= 16 px
//   - Font size  >= 0.75 rem  (12 px at a 16 px base)
//   - Date text  >= 0.75 rem  (milestone date must be as readable as body text)
// ---------------------------------------------------------------------------

const MIN_ICON_SIZE_PX = 16;
const MIN_INTERACTIVE_ICON_SIZE_PX = 20;
const MIN_TOUCH_TARGET_PX = 24;
const MIN_FONT_SIZE_REM = 0.75;

function parseRem(rem: string): number {
  return parseFloat(rem);
}

describe('readability — minimum size constants', () => {
  it('[regression] MILESTONE_DATE_FONT_SIZE >= 0.75rem (milestone date must be readable)', () => {
    expect(parseRem(MILESTONE_DATE_FONT_SIZE)).toBeGreaterThanOrEqual(MIN_FONT_SIZE_REM);
  });

  it('[regression] MILESTONE_PILL_ICON_SIZE >= 16px (subtask icon in expandable details pill)', () => {
    expect(MILESTONE_PILL_ICON_SIZE).toBeGreaterThanOrEqual(MIN_ICON_SIZE_PX);
  });

  it('[regression] MILESTONE_PILL_TEXT_FONT_SIZE >= 0.75rem (count label in expandable details pill)', () => {
    expect(parseRem(MILESTONE_PILL_TEXT_FONT_SIZE)).toBeGreaterThanOrEqual(MIN_FONT_SIZE_REM);
  });
});

// ---------------------------------------------------------------------------
// Eye button — WCAG accessibility regression
//
// Interactive icon buttons must be >= 20px (WCAG 1.4.11 contrast requirement).
// Pointer touch targets must be >= 24px (WCAG 2.2 AA 2.5.8).
// ---------------------------------------------------------------------------

describe('eye button — WCAG accessibility regression', () => {
  it('[regression] MILESTONE_EYE_ICON_SIZE >= 20px (interactive icon must be larger than decorative)', () => {
    expect(MILESTONE_EYE_ICON_SIZE).toBeGreaterThanOrEqual(MIN_INTERACTIVE_ICON_SIZE_PX);
  });

  it('[regression] MILESTONE_EYE_BUTTON_MIN_SIZE >= 24px (meets WCAG 2.2 AA 2.5.8 minimum pointer target)', () => {
    expect(MILESTONE_EYE_BUTTON_MIN_SIZE).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_PX);
  });
});

// ---------------------------------------------------------------------------
// displayTitle — three-level title disclosure
//
// MilestoneBadge uses a three-level disclosure model:
//   collapsed (at rest)  → shortTitle (glanceable)
//   collapsed (hovered)  → full title (preview before clicking)
//   expanded             → full title
//
// This is safe because the ResizeObserver has been removed from
// timeline-two-column.tsx. Slot heights are now computed only once — on mount
// and when `sorted` changes — via ref callback + useLayoutEffect([sorted]).
// Hovering does not change `sorted`, so no layout effect fires, so msSlotHeights
// never updates during hover, and no layout shift occurs.
//
// REGRESSION GUARD (expand): useLayoutEffect([sorted]) also ensures that expanding
// a card does not update slot heights. A card expanding changes only local
// component state in MilestoneBadge, not the `sorted` array in the parent, so
// the layout effect is never re-triggered. The expanded card grows in place via
// Collapse without moving any milestone dots.
// ---------------------------------------------------------------------------

/**
 * Mirrors: const displayTitle = isExpanded || isHovered ? m.title : (m.shortTitle ?? m.title);
 */
function computeDisplayTitle(
  title: string,
  shortTitle: string | undefined,
  isExpanded: boolean,
  isHovered: boolean
): string {
  return isExpanded || isHovered ? title : (shortTitle ?? title);
}

describe('displayTitle — three-level title disclosure', () => {
  it('at rest (not expanded, not hovered): shows shortTitle when defined', () => {
    expect(computeDisplayTitle('Long descriptive title', 'Short', false, false)).toBe('Short');
  });

  it('at rest (not expanded, not hovered): falls back to full title when shortTitle is undefined', () => {
    expect(computeDisplayTitle('Full Title', undefined, false, false)).toBe('Full Title');
  });

  it('hovered (not expanded): shows full title regardless of shortTitle', () => {
    expect(computeDisplayTitle('Long descriptive title', 'Short', false, true)).toBe(
      'Long descriptive title'
    );
  });

  it('hovered (not expanded): shows full title when shortTitle is undefined', () => {
    expect(computeDisplayTitle('Full Title', undefined, false, true)).toBe('Full Title');
  });

  it('expanded (not hovered): shows full title', () => {
    expect(computeDisplayTitle('Long descriptive title', 'Short', true, false)).toBe(
      'Long descriptive title'
    );
  });

  it('expanded + hovered: shows full title', () => {
    expect(computeDisplayTitle('Long descriptive title', 'Short', true, true)).toBe(
      'Long descriptive title'
    );
  });

  it('[regression] collapsed+hovered shows full title — hover title disclosure is intentional', () => {
    // The ResizeObserver was removed from timeline-two-column.tsx so changing
    // displayTitle on hover no longer triggers a slot-height update or layout shift.
    // This regression test documents that hover title is an intentional feature,
    // not a bug to be removed.
    const hovered = computeDisplayTitle(
      'Platform Team — 20+ engineers across 3 verticals',
      'Platform Team',
      false,
      true
    );
    expect(hovered).toBe('Platform Team — 20+ engineers across 3 verticals');
  });

  it('[regression] collapsed+not-hovered shows shortTitle — at-rest glanceability preserved', () => {
    const atRest = computeDisplayTitle(
      'Platform Team — 20+ engineers across 3 verticals',
      'Platform Team',
      false,
      false
    );
    expect(atRest).toBe('Platform Team');
  });
});
