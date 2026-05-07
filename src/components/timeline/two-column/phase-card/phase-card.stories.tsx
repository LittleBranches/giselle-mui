import { useState, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { GiselleIcon } from '../../../icon/giselle/giselle-icon';
import { PhaseCard } from './phase-card';
import type { TimelinePhase } from '../types';

// ----------------------------------------------------------------------
// Shared generic sample data (rule 0 — no personal names or real projects)
// ----------------------------------------------------------------------

const icon = (name: string) => <GiselleIcon icon={name} width={20} />;

/** Default right-column phase with four expandable tasks. */
const BASE_PHASE: TimelinePhase = {
  key: 1,
  title: 'Platform Integration — Core API',
  shortTitle: 'Core API',
  description:
    'Delivered the REST adapter layer, rate-limit middleware, and automated retry logic that reduced p99 latency from 840 ms to 190 ms.',
  date: 'Jan 2021 – Sep 2022',
  side: 'right',
  color: 'primary',
  icon: icon('solar:code-bold'),
  children: [
    { title: 'REST adapter layer with typed response mappers', done: true },
    { title: 'Rate-limit middleware (token bucket, configurable)' },
    { title: 'Automated retry with exponential backoff' },
    { title: 'p99 latency regression tests wired to CI' },
  ],
};

/** Left-column variant — same phase, side inverted. */
const LEFT_PHASE: TimelinePhase = { ...BASE_PHASE, side: 'left' };

/** Minimal phase with no detail children — not expandable. */
const SIMPLE_PHASE: TimelinePhase = {
  key: 2,
  title: 'Graduated with First-Class Honours',
  shortTitle: 'First-Class Honours',
  description:
    'Bachelor of Computer Science — final year research project on distributed consensus algorithms.',
  date: 'Nov 2018',
  side: 'right',
  color: 'info',
  icon: icon('solar:diploma-bold'),
};

/** Scenario variant — planning/option card with `scenarioLabel`. */
const SCENARIO_PHASE: TimelinePhase = {
  key: 3,
  title: 'Deploy to EU-West Region',
  shortTitle: 'EU-West Deploy',
  description: 'Move primary compute to EU-West-2 to satisfy GDPR data-residency requirements.',
  date: 'Q3 2026',
  side: 'right',
  color: 'warning',
  icon: icon('solar:map-point-bold'),
  variant: 'scenario',
  scenarioLabel: 'Option B',
  children: [
    { title: 'Legal review of data residency requirements', done: true },
    { title: 'Infrastructure cost estimate approved' },
    { title: 'Migration runbook drafted' },
  ],
};

/** Life-event variant — personal milestone, left-border tint. */
const LIFE_EVENT_PHASE: TimelinePhase = {
  key: 4,
  title: 'Relocated to Melbourne, Australia',
  shortTitle: 'Moved to Melbourne',
  description:
    'Arrived with one suitcase and a 90-day visitor visa. Converted to permanent residency 18 months later.',
  date: 'Sep 2015',
  side: 'right',
  color: 'secondary',
  icon: icon('solar:airplane-bold'),
  variant: 'life-event',
};

/**
 * Realistic card-column widths that simulate the space available to a PhaseCard
 * at common screen sizes. A card occupies roughly half the screen minus the spine (~30 px).
 */
const CARD_COLUMN_WIDTHS = [
  { label: '160px — xs screen (360px)', width: 160 },
  { label: '280px — sm screen (600px)', width: 280 },
  { label: '440px — md screen (900px)', width: 440 },
  { label: '560px — lg screen (1200px)', width: 560 },
];

// ----------------------------------------------------------------------
// Meta
// ----------------------------------------------------------------------

const meta: Meta<typeof PhaseCard> = {
  component: PhaseCard,
  title: 'Giselle MUI/Timeline/Phase Card',
  argTypes: {
    phase: { control: false },
    expandableIcon: { control: false },
    onRequestExpand: { control: false },
    onMarkViewed: { control: false },
    onPhasesChange: { control: false },
    onToggleTask: { control: false },
    allPhases: { control: false },
    taskDoneStates: { control: false },
    sx: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: `
**PhaseCard** is the expandable card rendered in the left or right column of \`TimelineTwoColumn\`.

It operates in **uncontrolled mode** (manages its own expansion) when no \`isExpanded\` /
\`onRequestExpand\` props are provided, or in **controlled mode** when the parent owns the
accordion state.

### Three-level disclosure model

| State | Content shown |
|---|---|
| Collapsed (rest) | \`shortTitle\` (or \`title\` when omitted) |
| Collapsed (hovered) | Full \`title\` + \`description\` |
| Expanded (clicked) | Full \`title\` + \`description\` + platforms/clients + detail bullets |

### Variants

| \`variant\` | Visual treatment |
|---|---|
| *(default)* | Frosted glass card with decoration shape + corner icon |
| \`'life-event'\` | Coloured left border + tinted background |
| \`'scenario'\` | Coloured left border + scenario badge label |
| \`'marker'\` | Spine-only — dot + floating label, no card rendered |
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PhaseCard>;

// ----------------------------------------------------------------------
// Named demo helpers (required for any story that uses React hooks)
// ----------------------------------------------------------------------

/**
 * Controlled expansion demo — starts expanded so the detail bullets are visible on load.
 * Shows the full three-level disclosure at level 3: title + description + bullet list.
 */
function ExpandedStateDemo() {
  const [expanded, setExpanded] = useState(true);
  const handleExpand = useCallback(() => setExpanded((v) => !v), []);
  return (
    <Box sx={{ maxWidth: 440 }}>
      <PhaseCard phase={BASE_PHASE} isExpanded={expanded} onRequestExpand={handleExpand} />
    </Box>
  );
}

/**
 * Viewed eye button demo — `onMarkViewed` makes the eye button visible.
 *
 * Extra bottom padding prevents the absolute-positioned eye button from being clipped
 * by the story canvas boundary.
 */
function IsViewedDemo() {
  const [viewed, setViewed] = useState(false);
  const handleMarkViewed = useCallback(() => setViewed((v) => !v), []);
  return (
    <Box sx={{ maxWidth: 440, pb: 5 }}>
      <PhaseCard phase={BASE_PHASE} isViewed={viewed} onMarkViewed={handleMarkViewed} />
    </Box>
  );
}

// ----------------------------------------------------------------------
// Stories
// ----------------------------------------------------------------------

/**
 * **Default** — right-column card, collapsed at rest.
 *
 * Hover to see the three-level disclosure: `shortTitle` → full `title + description`.
 * Click (or press Enter/Space when focused) to expand the detail bullets.
 */
export const Default: Story = {
  render: () => (
    <Box sx={{ maxWidth: 440 }}>
      <PhaseCard phase={BASE_PHASE} />
    </Box>
  ),
};

/**
 * **ExpandedState** — card opened to reveal detail bullets.
 *
 * Demonstrates controlled mode: the story owns expansion state via `isExpanded` /
 * `onRequestExpand`. Click again to collapse.
 */
export const ExpandedState: Story = {
  render: () => <ExpandedStateDemo />,
};

/**
 * **LeftColumn** — `columnSide="left"` mirrors the corner alert badge to the outer edge.
 *
 * ### Design decision: `columnSide` vs `phase.side`
 *
 * `phase.side` controls which column the phase card renders in — `'left'` → left column,
 * `'right'` → right column. `columnSide` is a display-layer prop that tells `PhaseCard`
 * where to anchor its corner alert badge (always on the outer edge, away from the spine).
 * In `TimelineTwoColumn`, `columnSide={phase.side}` is passed directly — the badge
 * floats on the outer edge of whichever column the card is in.
 *
 * This story sets `columnSide="left"` to demonstrate badge mirroring in isolation.
 */
export const LeftColumn: Story = {
  render: () => (
    <Box sx={{ maxWidth: 440 }}>
      <PhaseCard phase={LEFT_PHASE} columnSide="left" />
    </Box>
  ),
};

/**
 * **DoneState** — `done=true` dims and desaturates the card.
 *
 * ### Design decision: hover restores opacity
 *
 * Done cards are de-emphasised, not disabled. Hover restores full opacity so the content
 * remains accessible. This is different from `suppressElevation`, which removes the box
 * shadow but does not affect opacity.
 */
export const DoneState: Story = {
  render: () => (
    <Box sx={{ maxWidth: 440 }}>
      <PhaseCard phase={BASE_PHASE} done />
    </Box>
  ),
};

/**
 * **OverdueState** — `overdue=true` attaches a red corner alert badge.
 *
 * The badge sits at the outer top corner (right edge for right-column cards). Hover the
 * badge to read the tooltip. When `onPhasesChange` is also provided, the badge opens a
 * rich `PhaseWarningPopover` with range sliders; without it the badge is read-only.
 */
export const OverdueState: Story = {
  render: () => (
    <Box sx={{ maxWidth: 440, pt: 1 }}>
      <PhaseCard phase={BASE_PHASE} overdue />
    </Box>
  ),
};

/**
 * **Scenario** — `variant='scenario'` renders a coloured left border and a badge label.
 *
 * Use scenario cards for option/contingency planning entries where multiple alternatives
 * need to be shown side-by-side. `scenarioLabel` controls the badge text (e.g. "Option A",
 * "Plan B"). The card colour drives the border and badge colour.
 */
export const Scenario: Story = {
  render: () => (
    <Box sx={{ maxWidth: 440 }}>
      <PhaseCard phase={SCENARIO_PHASE} />
    </Box>
  ),
};

/**
 * **LifeEvent** — `variant='life-event'` renders a coloured left border and tinted background.
 *
 * Use life-event cards for personal milestones in the Education & Life column. The frosted
 * glass decoration and corner icon are suppressed — these belong to professional role cards.
 */
export const LifeEvent: Story = {
  render: () => (
    <Box sx={{ maxWidth: 440 }}>
      <PhaseCard phase={LIFE_EVENT_PHASE} />
    </Box>
  ),
};

/**
 * **IsViewed** — `onMarkViewed` makes the viewed eye button visible.
 *
 * ### Design decision: eye button placement
 *
 * The eye button floats **outside** the card Paper at the bottom outer edge. It is
 * absolutely positioned so it never displaces card content. An `aria-pressed` attribute
 * reflects the viewed state; `aria-label` changes between "Mark as viewed" and
 * "Mark as not viewed" so screen reader users get a meaningful description of the action.
 *
 * The button uses `width={20}` (`PHASE_EYE_ICON_SIZE`) — the minimum for interactive icons
 * per the WCAG 2.2 AA 20 px interactive icon rule (enforced by regression tests).
 */
export const IsViewed: Story = {
  render: () => <IsViewedDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Extra `pb: 5` is applied to the wrapper so the absolutely-positioned eye button is not clipped by the canvas boundary.',
      },
    },
  },
};

/**
 * **AllColors** — all six MUI palette keys rendered side-by-side.
 *
 * Verify that each colour key produces a distinct border, icon tint, and decoration
 * without clashing with the card background or text colour.
 */
export const AllColors: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {(['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const).map((color) => (
        <Box key={color} sx={{ width: 240 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: 'text.secondary' }}>
            {color}
          </Typography>
          <PhaseCard
            phase={{
              ...SIMPLE_PHASE,
              key: color.charCodeAt(0),
              color,
              title: `${color.charAt(0).toUpperCase() + color.slice(1)} phase`,
              shortTitle: color,
            }}
          />
        </Box>
      ))}
    </Box>
  ),
};

/**
 * **Responsive** — the card at realistic column widths across MUI standard breakpoints.
 *
 * A `PhaseCard` occupies roughly half the screen minus the spine (~30 px). The widths
 * below simulate the column space available at xs (360 px screen), sm (600 px), md (900 px),
 * and lg (1200 px).
 *
 * Verify at each width:
 * - Title does not overflow its container
 * - Detail count pill wraps cleanly and does not overlap the decoration corner icon
 * - The dashed border shows the card boundary — it is not part of the component
 */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {CARD_COLUMN_WIDTHS.map(({ label, width }) => (
        <div key={width}>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
            {label}
          </Typography>
          <Box sx={{ width, border: '1px dashed', borderColor: 'divider' }}>
            <PhaseCard phase={BASE_PHASE} />
          </Box>
        </div>
      ))}
    </Box>
  ),
};

// ----------------------------------------------------------------------

/**
 * **StatusBadgeVariants** — all three status badges rendered side-by-side.
 *
 * ### The three mutually exclusive status badges
 *
 * | Badge | Trigger | Visual |
 * |---|---|---|
 * | **"Now"** | `active: true` on the phase | Pulsing yellow chip — "currently in progress" |
 * | **Overdue** | `overdue=true` on `PhaseCard` | Red corner badge + warning tooltip |
 * | **Scenario** | `variant: 'scenario'` + `scenarioLabel` | Outlined label badge — planning option |
 *
 * These are the only three cases where a badge renders on a `PhaseCard`.
 * They are mutually exclusive — active + overdue together is not a supported state.
 */
export const StatusBadgeVariants: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-start' }}>
      <Box sx={{ width: 280 }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
          Active — "Now" pulsing badge
        </Typography>
        <PhaseCard
          phase={{
            ...BASE_PHASE,
            active: true,
            title: 'In-Flight: Observability Layer',
            shortTitle: 'Observability',
          }}
        />
      </Box>
      <Box sx={{ width: 280, pt: 1 }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
          Overdue — red corner badge
        </Typography>
        <PhaseCard
          phase={{
            ...BASE_PHASE,
            title: 'Overdue: Legacy Migration',
            shortTitle: 'Legacy Migration',
            color: 'error',
          }}
          overdue
        />
      </Box>
      <Box sx={{ width: 280 }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
          Scenario — planning option badge
        </Typography>
        <PhaseCard phase={SCENARIO_PHASE} />
      </Box>
    </Box>
  ),
};

/**
 * **WithAndWithoutDetails** — same card data with and without the `children` array.
 *
 * Use this story to verify that:
 * - A card **with** `children` shows the expandable detail count pill; click expands bullets.
 * - A card **without** `children` shows no count pill and does not respond to click-to-expand.
 *
 * Both cards should have identical visual height at rest — the pill does not push content down.
 */
export const WithAndWithoutDetails: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <Box sx={{ width: 320 }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
          With details (4 tasks)
        </Typography>
        <PhaseCard phase={BASE_PHASE} />
      </Box>
      <Box sx={{ width: 320 }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
          Without details — no count pill
        </Typography>
        <PhaseCard phase={SIMPLE_PHASE} />
      </Box>
    </Box>
  ),
};
