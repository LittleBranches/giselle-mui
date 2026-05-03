import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';
import type { TimelineDotProps } from '@mui/lab/TimelineDot';

// ----------------------------------------------------------------------

/** MUI palette keys that carry mainChannel — derived from TimelineDot's own color prop. */
export type HighlightedPaletteKey = Exclude<
  NonNullable<TimelineDotProps['color']>,
  'inherit' | 'grey'
>;

// ----------------------------------------------------------------------

/**
 * A single platform / tech-stack entry for `TimelinePhase.platforms`.
 *
 * - **Preferred form:** `{ icon: ReactNode; label: string }` — renders a tooltip-wrapped icon slot.
 *   Use `<GiselleIcon icon={...} width={24} />` or any icon element.
 * - **String form:** backward-compatibility shim only. The string is rendered as a plain text
 *   label chip with no icon slot. Strings are **not** interpreted as icon IDs.
 *   Prefer the object form for all new entries.
 */
export type TimelinePlatformItem = { icon: ReactNode; label: string } | string;

// ----------------------------------------------------------------------

export type TimelinePhase = {
  /** Numeric sort key. Fractional keys (e.g. 4.5) interleave life events between roles. */
  key: number;
  /** Display title of the phase — shown as the card heading. */
  title: string;
  /**
   * Glanceable 2–4 word label shown in the collapsed card at rest.
   * Falls back to `title` when omitted.
   *
   * **Three-level disclosure model:**
   * - REST (collapsed): `shortTitle` (or `title` if omitted)
   * - HOVER (before click): full `title` + `description`
   * - EXPANDED (after click): full `title` + `description` + `details[]`
   */
  shortTitle?: string;
  /** Short summary paragraph shown below the title on the default card view.
   * Optional for `variant: 'marker'` entries, which have no card. */
  description?: string;
  /** Human-readable date range (e.g. `'Jan 2020 – Mar 2022'`). Also used for automatic overdue detection in checklist mode. */
  date: string;
  /** Icon rendered inside the TimelineDot. Size is controlled via CSS (wrapping Box sets `& svg: { width, height }`) — pass any ReactNode icon slot. */
  icon: ReactNode;
  /** MUI TimelineDot color. */
  color?: TimelineDotProps['color'];
  /** Which column this item appears in. */
  side: 'left' | 'right';
  /** Dims the card and separator — used for completed/past steps. */
  done?: boolean;
  /** Optional expandable bullet-point details. */
  details?: string[];
  /**
   * Custom tooltip shown on the phase dot in the centre spine.
   *
   * When omitted the tooltip is computed automatically:
   * - **Read-only mode:** first sentence of `description` (capped at 72 characters) →
   *   falls back to `shortTitle ?? title` + `date` when `description` is absent.
   * - **Checklist mode:** status label (`Done`, `Blocking`, etc.) + `date`.
   *
   * Set this explicitly to override the computed value with a custom metric, status
   * note, or any text not derived from `description`.
   */
  dotTooltip?: string;
  /**
   * Tech stack icons for this entry. Each item provides a `ReactNode` icon and an accessible label.
   * Renders as a horizontal strip of icon slots with a tooltip per item.
   * Use `<GiselleIcon icon={...} width={24} />` or any icon element.
   *
   * Also accepts a plain `string[]` for backward compatibility — strings are rendered as labels
   * with no icon slot. Prefer the `{ icon, label }` form for full icon rendering.
   *
   * See {@link TimelinePlatformItem} for the full union type.
   */
  platforms?: TimelinePlatformItem[];
  /**
   * Label displayed above the tech stack strip.
   * @default 'Tech Stack'
   */
  platformsLabel?: string;
  /**
   * 'scenario' — coloured left border + badge label (used in case-001 for departure scenarios).
   * 'life-event' — coloured left border + tinted background (used in career timeline).
   * 'marker' — spine-only: dot + floating label, no card. For single point-in-time events
   *             that don't warrant a full phase card (e.g. a certification date, a visa grant).
   */
  variant?: 'scenario' | 'life-event' | 'marker';
  /** Label shown as a badge above the card when variant='scenario'. */
  scenarioLabel?: string;
  /** Marks this phase as past-due without being done.
   * Renders the dot and connector in error (red) colour as a visual warning.
   */
  overdue?: boolean;
  /** Marks this phase as currently in progress — renders a pulsing badge above the card. */
  active?: boolean;
  /**
   * Nested milestone keypoints on the connector spine between this phase and the next.
   * Each milestone renders as a coloured badge dot on the spine.
   */
  milestones?: Array<{
    date: string;
    title: string;
    /**
     * Glanceable 2–4 word label shown in the collapsed milestone card at rest.
     * Falls back to `title` when omitted.
     */
    shortTitle?: string;
    /**
     * Short description shown when the milestone card is hovered or expanded.
     * Provides context about what this milestone is and why it matters.
     */
    description?: string;
    icon: ReactNode;
    color?: TimelineDotProps['color'];
    /** Short bullet-point facts shown when the card is expanded. */
    details?: string[];
    /** Dims the milestone badge and card — mirrors the phase-level `done` flag. */
    done?: boolean;
    /** Renders the milestone badge in error (red) colour when not done. */
    overdue?: boolean;
    /** Marks this milestone as newly added — renders a "NEW" dot near the title. Clear once seen. */
    new?: boolean;
    /**
     * Overrides the spine dot circle background colour.
     * Accepts any CSS colour string (e.g. `'#111'`).
     * Useful when a brand icon has a specific colour that clashes with the palette-derived background.
     */
    dotBg?: string;
    /**
     * Custom tooltip shown on the milestone dot in the centre spine.
     *
     * When omitted the tooltip is computed automatically:
     * - **Read-only mode:** first sentence of `description` (capped at 72 characters) →
     *   falls back to `shortTitle ?? title` + `date` when `description` is absent.
     * - **Checklist mode:** status label (`Done`, `Blocking`, etc.) + `date`.
     *
     * Set this explicitly to override the computed value with a custom metric or note.
     */
    dotTooltip?: string;
  }>;
  /**
   * Client logos shown as a horizontal strip directly in the card (always visible).
   * Each entry is a public path (e.g. '/assets/icons/clients/nbn.svg') plus an accessible name.
   */
  clients?: Array<{ name: string; logo: string }>;
  /** Label displayed above the client logo strip. Set this to something meaningful, e.g. 'Delivered for' or 'Trusted by'. */
  clientsLabel?: string;
  /**
   * Project/product logos shown as a horizontal strip — for showcasing your own work, side-projects, or open-source.
   * Each entry is a public path plus an accessible name.
   */
  projects?: Array<{ name: string; logo: string }>;
  /** Label displayed above the projects logo strip. E.g. 'Building in public' or 'Current projects'. */
  projectsLabel?: string;
  /** Marks this phase as newly added — renders a pulsing "NEW" badge on the card. Clear this flag once the audience has seen the update. */
  new?: boolean;
  /**
   * Label for the pulsing active badge above the card.
   * @default 'Now'
   */
  activeLabel?: string;
  /** Suppress the date label inside the card. Useful when the date is obvious from context (e.g. active/"Now" entries). */
  hideDate?: boolean;
  /**
   * Suppress the `MetricCardDecoration` and corner icon for this specific step.
   * By default both are shown on all non-highlighted cards regardless of `side`.
   */
  hideDecoration?: boolean;
  /**
   * Optional personal photo rendered as a small rounded thumbnail below the description.
   * Use for historic snapshots, childhood photos, or other memorable moments on the timeline.
   */
  photo?: { src: string; alt: string };
  /**
   * Text alignment for card content. Defaults to `'left'` regardless of which column the card
   * sits in. Set to `'right'` from the data layer when right-aligned content is intentional.
   * @default 'left'
   */
  textAlign?: 'left' | 'right';
  /**
   * Optional footer slot rendered at the bottom of the card's always-visible content area,
   * below all icon strips and above the expandable detail bullets.
   *
   * Use for interactive elements (play buttons, links, counters) that belong contextually
   * to the card but aren't part of the expandable detail section.
   *
   * ```tsx
   * footer={<ModemSoundButton />}
   * ```
   */
  footer?: ReactNode;
};

export type TimelineTwoColumnProps = Omit<BoxProps, 'children'> & {
  /** The ordered list of phases to render. Sorted internally by date (active first, then newest → oldest). */
  phases: TimelinePhase[];
  /**
   * Enables interactive checklist behaviour:
   * - Phase and milestone dots become clickable to toggle done state.
   * - Done items are dimmed with a grayscale filter and a checkmark icon.
   * - Past-due items (date in the past, not done, not active) are highlighted in red.
   * - Manual `overdue: true` on a phase forces the red state regardless of date.
   *
   * When omitted (default), the timeline is read-only: no click-to-done, no overdue
   * detection. Hover effects on cards are limited to items with expandable details.
   */
  checklist?: boolean;
  /**
   * Called when the user clicks a phase dot to toggle its done state.
   * Only fires when `checklist` is true.
   * Receives the phase `key` and the new `done` value.
   */
  onTogglePhaseDone?: (key: number, done: boolean) => void;
  /**
   * Called when the user clicks a milestone dot to toggle its done state.
   * Only fires when `checklist` is true.
   * Receives the parent phase `key`, the milestone `index`, and the new `done` value.
   */
  onToggleMilestoneDone?: (phaseKey: number, milestoneIndex: number, done: boolean) => void;
  /**
   * Controlled selection — the key of the currently selected phase.
   * When set, the matching phase dot is shown in its active (enlarged) state.
   * Intended for hero navigation use: the parent controls which phase is focused.
   */
  selectedPhaseKey?: number;
  /**
   * Called when the user clicks a phase dot while `checklist` is false.
   * Receives the phase `key`. Use together with `selectedPhaseKey` for
   * controlled hero navigation.
   */
  onPhaseSelect?: (key: number) => void;
  /**
   * Sort direction for non-active, non-done phases.
   * - `'desc'` (default) — newest end-date first. Use for career/past timelines.
   * - `'asc'` — oldest end-date first. Use for roadmap/future timelines so the
   *   soonest upcoming phase appears directly below the active phases.
   * - `'key'` — sort by `phase.key` ascending. Use when the key encodes the
   *   intended sequence (e.g. a roadmap where phase number is the ordering
   *   criterion, not the end date). Deterministic regardless of array insertion order.
   * @default 'desc'
   */
  sortOrder?: 'asc' | 'desc' | 'key';
  /**
   * Minimum vertical space (px) allocated per milestone slot on the spine.
   * Controls the breathing room between collapsed milestone cards.
   * Increase when cards are too close; decrease when the timeline feels too tall.
   * @default 60
   */
  milestoneSlotHeight?: number;
  /**
   * Gap (px) added below each phase card — appended as `paddingBottom` on the card column.
   * Because it is measured from the bottom edge of every card (not the top of the li),
   * the visual gap between consecutive phase cards is always exactly
   * `phaseCardGap + column top padding (~6px)`, regardless of individual card height.
   * @default 90
   */
  phaseCardGap?: number;
  /**
   * Bottom offset (px) of the year-boundary label chip from the end of the spine connector.
   * Controls the breathing room between the year label and the next phase dot below it.
   * @default 30
   */
  yearLabelMarginBottom?: number;
  /**
   * Set of item keys that the current viewer has already marked as seen.
   * Key format: `"phase-${phase.key}"` for phases, `"ms-${phaseKey}-${milestoneIndex}"` for milestones.
   * Controlled externally — pair with `onMarkViewed` and a persistence hook (e.g. localStorage).
   * When a key is present in this set, the corresponding card shows a filled "viewed" eye indicator.
   */
  viewedKeys?: Set<string>;
  /**
   * Called when the user clicks the "mark as viewed" eye button on a phase card or milestone badge.
   * Receives the item key in `"phase-${key}"` or `"ms-${phaseKey}-${mi}"` format.
   * The parent is responsible for persisting this (localStorage, server, etc.).
   */
  onMarkViewed?: (key: string) => void;
  /**
   * Icon rendered inside the expandable-details count badge on phase cards and milestone badges.
   * Accepts any `ReactNode` — typically a small icon at 14–16px.
   *
   * Defaults to an inline SVG subtask icon (parent rect → L-line → child rect) that is
   * bundled with the component, so it renders immediately with zero flicker.
   *
   * Pass `null` to suppress the icon and show only the count number.
   *
   * @example
   * ```tsx
   * import { Icon } from '@iconify/react';
   * <TimelineTwoColumn expandableIcon={<Icon icon="tabler:subtask" width={14} />} phases={phases} />
   * ```
   */
  expandableIcon?: ReactNode;
};
