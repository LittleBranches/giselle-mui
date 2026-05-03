import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { GiselleIcon } from '../giselle-icon/giselle-icon';
import { TimelineTwoColumn } from './timeline-two-column';
import type { TimelinePhase } from './types';

// ----------------------------------------------------------------------

const meta: Meta<typeof TimelineTwoColumn> = {
  component: TimelineTwoColumn,
  title: 'Components/TimelineTwoColumn',
  parameters: {
    docs: {
      description: {
        component: `
**TimelineTwoColumn** renders a two-column chronological timeline — most commonly used for
career history or project roadmaps where two parallel streams of information need to run
side-by-side (e.g. "Professional Experience" and "Education & Life").

The stories below are written as **design decision documents**. Each one explains *why* a
particular design choice was made, what the trade-offs were, and what invariant it protects.
This is intentional: these decision records are the highest-value content in the Storybook.
They tell the next developer (or you, six months later) not just what the component does
but why it works the way it does.

---

### Three item types

| Type | Prop | Card? | Column |
|---|---|---|---|
| **Phase** | (default) | Yes — expandable | Left or right per \`side\` |
| **Life-event phase** | \`variant: 'life-event'\` | Yes — expandable | Left or right per \`side\` |
| **Marker** | \`variant: 'marker'\` | No — dot + label only | Spine; label side = \`side\` |

Milestones are children of phases — they render in the **opposite** column from their
parent phase card. See the \`ColumnPlacementInvariant\` story.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimelineTwoColumn>;

// ----------------------------------------------------------------------
// Shared generic sample data
// ----------------------------------------------------------------------

const icon = (name: string) => <GiselleIcon icon={name} width={20} />;
// Minimum 16 px per the repo readable-size rule for inline (non-interactive) icons.
const msIcon = (name: string) => <GiselleIcon icon={name} width={16} />;

/**
 * Read-only phases — generic, non-personal.
 * Column-placement invariant: at least one left and one right phase,
 * each with at least one milestone, so opposite-column positioning is verifiable.
 */
const CAREER_PHASES: TimelinePhase[] = [
  {
    key: 0,
    title: 'Platform v1.0 Released',
    date: '1 Mar 2005',
    color: 'secondary',
    side: 'left',
    variant: 'marker',
    icon: icon('solar:star-bold'),
    description: 'First public release of the core platform library, published to npm.',
  },
  {
    key: 1,
    title: 'Junior Developer',
    shortTitle: 'Junior Dev',
    description:
      'First professional role — building and maintaining customer-facing e-commerce features. Learned the difference between code that works and code that ships.',
    date: 'Sep 2007 – May 2010',
    side: 'right',
    color: 'secondary',
    done: true,
    icon: icon('solar:code-square-bold'),
    details: ['PHP, jQuery, MySQL', 'First production incident — and first post-mortem'],
    platforms: [
      { icon: <GiselleIcon icon="logos:php" width={24} />, label: 'PHP' },
      { icon: <GiselleIcon icon="logos:jquery" width={24} />, label: 'jQuery' },
    ],
    milestones: [
      {
        date: 'Mar 2009',
        shortTitle: 'First solo deploy',
        title: 'First solo production deploy',
        description:
          'First time pushing to production without a senior watching. It worked. Refreshed the page six times to be sure.',
        icon: msIcon('solar:rocket-bold'),
        color: 'secondary',
        done: true,
      },
    ],
  },
  {
    key: 1.5,
    title: 'Open Source Conference',
    shortTitle: 'OSS Conf',
    date: 'Oct 2010',
    color: 'info',
    side: 'left',
    variant: 'life-event',
    icon: icon('solar:planet-bold'),
    description:
      'Three days of talks, hallway conversations, and the first time I understood that the community was the product too.',
    details: ['Met the people behind the tools I used daily', 'Submitted first open-source PR'],
  },
  {
    key: 2,
    title: 'Frontend Developer',
    shortTitle: 'Frontend Dev',
    description:
      'Delivered responsive dashboards and data-visualisation features for a fintech SaaS product. First TypeScript migration — 47 000 lines, six weeks.',
    date: 'Jun 2010 – Feb 2014',
    side: 'right',
    color: 'info',
    done: true,
    icon: icon('solar:chart-bold-duotone'),
    details: ['React 15, Redux', 'TypeScript migration — 47 000 lines, six weeks'],
    platforms: [
      { icon: <GiselleIcon icon="logos:react" width={24} />, label: 'React' },
      { icon: <GiselleIcon icon="logos:typescript-icon" width={24} />, label: 'TypeScript' },
    ],
    milestones: [
      {
        date: 'Jan 2013',
        shortTitle: 'Real-time dashboard',
        title: 'Real-time analytics dashboard shipped',
        description:
          'WebSocket-driven dashboard replacing a polling page that refreshed every 30 seconds. Reduced server load by 40 %.',
        icon: msIcon('solar:graph-bold'),
        color: 'info',
        done: true,
      },
      {
        date: 'Nov 2013',
        shortTitle: 'TypeScript migration',
        title: 'TypeScript migration complete',
        description:
          'Full codebase migrated to TypeScript strict mode. Zero runtime type errors in the six months after.',
        icon: msIcon('solar:shield-check-bold'),
        color: 'success',
        done: true,
      },
    ],
  },
  {
    key: 3,
    title: 'Lead Frontend Engineer',
    shortTitle: 'Lead Engineer',
    description:
      'Leading a cross-functional team building a patient-facing telehealth platform. First experience owning a shared component library across three product teams.',
    date: 'Mar 2014 – present',
    side: 'right',
    color: 'primary',
    active: true,
    activeLabel: 'Now',
    icon: icon('solar:user-bold-duotone'),
    details: [
      'React 18, TypeScript, micro-frontend architecture',
      'Design system open-sourced — 20+ contributors',
      'WCAG AA accessibility audit across all patient-facing flows',
    ],
    platforms: [
      { icon: <GiselleIcon icon="logos:react" width={24} />, label: 'React' },
      { icon: <GiselleIcon icon="logos:typescript-icon" width={24} />, label: 'TypeScript' },
    ],
    milestones: [
      {
        date: 'Jan 2015',
        shortTitle: 'Patient portal v2',
        title: 'Patient portal v2 launched',
        description:
          'Full redesign of the patient-facing portal. Reduced appointment booking from seven steps to three.',
        icon: msIcon('solar:rocket-bold'),
        color: 'success',
      },
      {
        date: 'Aug 2016',
        shortTitle: 'Design system open-sourced',
        title: 'Internal design system open-sourced',
        description:
          'After 18 months internal-only, the component library was open-sourced under MIT. First external contributor within two weeks.',
        icon: msIcon('solar:code-bold'),
        color: 'primary',
      },
    ],
  },
];

/** Phases for the checklist / roadmap demo. */
const CHECKLIST_PHASES: TimelinePhase[] = [
  {
    key: 1,
    title: 'Discovery & Research',
    shortTitle: 'Discovery',
    description: 'User interviews, competitor audit, and problem-space definition.',
    date: 'Jan 2024 – Feb 2024',
    side: 'left',
    color: 'secondary',
    done: true,
    icon: icon('solar:telescope-bold-duotone'),
    milestones: [
      {
        date: 'Jan 2024',
        shortTitle: '12 user interviews',
        title: '12 user interviews conducted',
        description:
          'Structured interviews with 12 active users across three segments. Three recurring themes identified.',
        icon: msIcon('solar:users-group-rounded-bold'),
        color: 'secondary',
        done: true,
      },
      {
        date: 'Feb 2024',
        shortTitle: 'Competitive audit',
        title: 'Competitive audit report',
        description:
          'Analysed 8 competitors across UX, pricing, and feature surface. Two clear differentiation opportunities found.',
        icon: msIcon('solar:document-bold'),
        color: 'info',
        done: true,
      },
    ],
  },
  {
    key: 2,
    title: 'Design & Prototype',
    shortTitle: 'Design',
    description: 'Information architecture, wireframes, and interactive prototype sign-off.',
    date: 'Mar 2024 – Apr 2024',
    side: 'right',
    color: 'info',
    done: true,
    icon: icon('solar:pen-new-round-bold-duotone'),
    milestones: [
      {
        date: 'Mar 2024',
        shortTitle: 'Wireframes approved',
        title: 'Wireframes approved by stakeholders',
        description:
          'Three rounds of iteration before sign-off. Final flow reduced decision points per screen from five to two.',
        icon: msIcon('solar:layers-minimalistic-bold'),
        color: 'info',
        done: true,
      },
    ],
  },
  {
    key: 3,
    title: 'Build & Ship',
    shortTitle: 'Build',
    description: 'Engineering sprint, QA, and production release.',
    date: 'May 2024',
    side: 'left',
    color: 'error',
    icon: icon('solar:rocket-bold-duotone'),
    milestones: [
      {
        date: 'Jun 2024',
        shortTitle: 'Beta launch',
        title: 'Beta launch to 500 users',
        description:
          'Closed beta with 500 opt-in users. 94 % task completion rate in first-week usability testing.',
        icon: msIcon('solar:flag-bold'),
        color: 'success',
      },
    ],
  },
];

// ----------------------------------------------------------------------
// Stories
// ----------------------------------------------------------------------

/**
 * **Read-only timeline** — the default use case: career history or project chronicle
 * where users browse and explore but do not interact with dots as checkboxes.
 *
 * **Design decision: why read-only is the default**
 *
 * The component defaults to `checklist={false}`. Checklist mode adds interaction
 * complexity (toggle state, overdue detection, accessibility roles) that is irrelevant
 * in a portfolio or read-only narrative context. Read-only removes all of that overhead
 * and lets the data tell the story uninterrupted.
 *
 * Note the **marker** at the top of this timeline (a single-date launch event) — a spine-only
 * item with no card, demonstrating that the three item types work together in a single data array.
 *
 * **What to verify:**
 * - Marker renders as dot + floating label, no card
 * - Left column = "Education & Life" (life-event phases, `side='left'`)
 * - Right column = "Professional" (job phases, `side='right'`)
 * - Milestones render in the *opposite* column from their parent phase card
 * - Hovering a dot shows a description preview (not just title + date)
 */
export const ReadOnly: Story = {
  render: () => (
    <Box sx={{ maxWidth: 960, mx: 'auto', p: 3 }}>
      <TimelineTwoColumn phases={CAREER_PHASES} />
    </Box>
  ),
  argTypes: { phases: { control: false }, sx: { control: false } },
};

// ----------------------------------------------------------------------

/**
 * **Column placement invariant** — the most important architectural decision in this component.
 *
 * ---
 *
 * ### The rule
 *
 * A phase's `side` prop controls which column the **phase card** renders in — but milestones
 * render in the **opposite** column:
 *
 * | `phase.side` | Phase card column | Milestones column |
 * |---|---|---|
 * | `'right'` | LEFT | RIGHT |
 * | `'left'` | RIGHT | LEFT |
 *
 * ### Why inverted?
 *
 * The canonical use case is a career timeline with two streams:
 * - LEFT = "Professional Experience" (job phases have `side: 'right'`)
 * - RIGHT = "Education & Life" (life phases have `side: 'left'`)
 *
 * Job milestones (technology releases, achievements, context events) logically belong in
 * the "Education & Life" column — they're contextual events that happened *during* a role.
 * If milestones rendered in the same column as their parent, both would pile up in one
 * column, leaving the other empty.
 *
 * ### The invariant
 *
 * This story **always** includes at least one `side: 'left'` and one `side: 'right'` phase,
 * each with at least one milestone. Column-opposite placement must be verifiable in the
 * canvas — not only in `timeline-two-column.column-placement.test.ts`.
 *
 * ### Common mistake
 *
 * Attaching context milestones to a `side: 'left'` life-event card. Those milestones will
 * appear in the LEFT (professional) column — the wrong side. Attach them to a `side: 'right'`
 * professional card so they appear in the RIGHT (life/education) column.
 */
export const ColumnPlacementInvariant: Story = {
  render: () => (
    <Box sx={{ maxWidth: 960, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
        <Box
          sx={{
            flex: 1,
            p: 1.5,
            border: '2px dashed',
            borderColor: 'info.main',
            borderRadius: 1,
          }}
        >
          <Typography variant="caption" color="info.main" fontWeight={700}>
            LEFT column — phase cards for side=&#x27;right&#x27; phases; milestones from
            side=&#x27;left&#x27; phases
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            p: 1.5,
            border: '2px dashed',
            borderColor: 'success.main',
            borderRadius: 1,
          }}
        >
          <Typography variant="caption" color="success.main" fontWeight={700}>
            RIGHT column — phase cards for side=&#x27;left&#x27; phases; milestones from
            side=&#x27;right&#x27; phases
          </Typography>
        </Box>
      </Box>
      <TimelineTwoColumn phases={CAREER_PHASES} />
    </Box>
  ),
  argTypes: { phases: { control: false }, sx: { control: false } },
};

// ----------------------------------------------------------------------

/**
 * **Marker variant** — a third item type: spine-only, no card.
 *
 * ---
 *
 * ### When to use a marker
 *
 * Use `variant: 'marker'` for single point-in-time events that:
 * - have a specific date (not a range),
 * - do not need an expandable card, and
 * - fall outside any existing phase's date range (so they can't be a milestone).
 *
 * Classic examples: a project launch date at the start of a timeline, a certification between
 * roles, a public release, a platform migration date.
 *
 * ### When NOT to use a marker
 *
 * - Event has context worth explaining → use `variant: 'life-event'` (has a card).
 * - Event happened *during* a phase → use a milestone on that phase.
 * - Five or more markers in a row → consider grouping them into a phase.
 *
 * ### `side` prop on markers — direct, not inverted
 *
 * Unlike phases (where milestones are in the opposite column), a marker's `side` directly
 * controls which side the label appears on:
 * - `side: 'left'` → label floats **left** of the spine
 * - `side: 'right'` → label floats **right** of the spine
 *
 * ### Tooltip on a marker
 *
 * Since there is no card, the dot tooltip is the primary information mechanism.
 * Set `description` for a meaningful tooltip, or `dotTooltip` to override it explicitly.
 */
export const MarkerVariant: Story = {
  render: () => (
    <Box sx={{ maxWidth: 960, mx: 'auto', p: 3 }}>
      <TimelineTwoColumn
        phases={[
          {
            key: 0,
            title: 'Platform v1.0 Released',
            date: '1 Mar 2005',
            color: 'secondary',
            side: 'left',
            variant: 'marker',
            icon: icon('solar:star-bold'),
            description:
              'First public release of the core platform library — published to npm after six months of internal use.',
          },
          {
            key: 1,
            title: 'Junior Developer',
            shortTitle: 'Junior Dev',
            description:
              'First professional role — PHP, jQuery, and the invaluable experience of a first production incident.',
            date: 'Sep 2007 – May 2010',
            side: 'right',
            color: 'secondary',
            done: true,
            icon: icon('solar:code-square-bold'),
            milestones: [
              {
                date: 'Mar 2009',
                shortTitle: 'First solo deploy',
                title: 'First solo production deploy',
                description: 'First push to production without supervision. It worked.',
                icon: msIcon('solar:rocket-bold'),
                color: 'secondary',
                done: true,
              },
            ],
          },
          {
            key: 1.8,
            title: 'AWS Certified',
            shortTitle: 'AWS Certified',
            date: 'Mar 2011',
            color: 'info',
            side: 'right',
            variant: 'marker',
            icon: icon('logos:aws'),
            description:
              'AWS Solutions Architect — Associate. Passed on first attempt after three weeks of study while working full-time.',
          },
          {
            key: 2,
            title: 'Frontend Developer',
            shortTitle: 'Frontend Dev',
            description:
              'Fintech SaaS — React, TypeScript, real-time dashboards. First experience owning a component library.',
            date: 'Jun 2011 – Feb 2014',
            side: 'right',
            color: 'info',
            done: true,
            icon: icon('solar:chart-bold-duotone'),
            milestones: [
              {
                date: 'Nov 2013',
                shortTitle: 'TypeScript migration',
                title: 'TypeScript migration complete',
                description:
                  'Full codebase to TypeScript strict mode. Zero runtime type errors in the six months after.',
                icon: msIcon('solar:shield-check-bold'),
                color: 'success',
                done: true,
              },
            ],
          },
        ]}
      />
    </Box>
  ),
  argTypes: { phases: { control: false }, sx: { control: false } },
};

// ----------------------------------------------------------------------

/**
 * **Life-event vs marker decision** — when to use each item type for one-off events.
 *
 * ---
 *
 * ### The question this story answers
 *
 * Both `variant: 'life-event'` and `variant: 'marker'` represent discrete events
 * that do not span a role or period. The decision rule is simple:
 *
 * | Question | If yes → use |
 * |---|---|
 * | Single specific date? | marker |
 * | Spans a period of time? | life-event phase |
 * | Needs an expandable card with context? | life-event phase |
 * | No card needed, just "this happened on this date"? | marker |
 *
 * ### When to choose `variant: 'marker'`
 *
 * Use a **marker** for any precise, single-date event that needs no expandable card:
 * - A product launch date that predates any listed role.
 * - A certification earned on a specific day.
 * - A public release tagged to a commit SHA.
 *
 * A marker is just a labelled dot on the spine — no card, no expansion, no date range.
 *
 * ### When to choose `variant: 'life-event'`
 *
 * Use a **life-event** when the event either spans time or carries context worth expanding:
 * - A major workflow change (e.g. transitioning to fully remote).
 * - An acquisition or strategic pivot with multiple sub-points.
 * - Any event where the `details` array adds value the title alone cannot convey.
 *
 * ### This story shows
 *
 * - A **marker** (product v1.0 launch) at the top — spine dot, no card, tooltip shows description
 * - A **life-event phase** (workflow transition) — full card, expandable, `variant: 'life-event'`
 */
export const LifeEventVsMarker: Story = {
  render: () => (
    <Box sx={{ maxWidth: 960, mx: 'auto', p: 3 }}>
      <TimelineTwoColumn
        phases={[
          {
            key: 0,
            title: 'Platform v1.0 Released',
            date: '1 Mar 2005',
            color: 'secondary',
            side: 'left',
            variant: 'marker',
            icon: icon('solar:star-bold'),
            description: 'First public release of the core platform library, published to npm.',
          },
          {
            key: 0.5,
            title: 'Junior Developer',
            shortTitle: 'Junior Dev',
            description:
              'First professional role building customer-facing features for a retail platform.',
            date: 'Sep 2007 – May 2010',
            side: 'right',
            color: 'secondary',
            done: true,
            icon: icon('solar:code-square-bold'),
            milestones: [
              {
                date: 'Dec 2009',
                shortTitle: 'First production deploy',
                title: 'First production deploy',
                description:
                  'First solo deploy to production without a rollback. Refreshed six times.',
                icon: msIcon('solar:rocket-bold'),
                color: 'secondary',
                done: true,
              },
            ],
          },
          {
            key: 0.8,
            title: 'Open-Source Foundation Joined',
            shortTitle: 'OSS Foundation',
            date: '2011',
            color: 'success',
            side: 'left',
            variant: 'life-event',
            icon: icon('solar:heart-bold'),
            description:
              'Joined the Platform Open-Source Foundation as a contributing member. Shifted focus toward community tooling.',
            details: [
              'Became a contributing member of the Platform OSS Foundation',
              'Redirected 20% of working time to open-source tooling',
              'First pull request accepted within two weeks',
            ],
          },
          {
            key: 1,
            title: 'Remote-First Transition',
            shortTitle: 'Remote-First',
            description:
              'Team adopted a fully distributed remote model. Overhauled async communication, tooling, and delivery cadence.',
            date: 'Mar 2012',
            color: 'info',
            side: 'left',
            variant: 'life-event',
            icon: icon('solar:airplane-bold'),
            details: [
              'Closed the main office; team moved fully distributed',
              'Introduced async-first RFC process for major decisions',
              'Delivery velocity increased 30% in the first two quarters',
            ],
          },
          {
            key: 2,
            title: 'Frontend Developer',
            shortTitle: 'Frontend Dev',
            description:
              'Fintech SaaS product — first TypeScript, first component library, first experience owning code across multiple product teams.',
            date: 'Jun 2012 – present',
            side: 'right',
            color: 'primary',
            active: true,
            activeLabel: 'Now',
            icon: icon('solar:chart-bold-duotone'),
            milestones: [
              {
                date: 'Nov 2013',
                shortTitle: 'TypeScript migration',
                title: 'TypeScript migration complete',
                description: 'Full codebase migrated to strict TypeScript in six weeks.',
                icon: msIcon('solar:shield-check-bold'),
                color: 'success',
              },
            ],
          },
        ]}
      />
    </Box>
  ),
  argTypes: { phases: { control: false }, sx: { control: false } },
};

// ----------------------------------------------------------------------

/**
 * **Dot tooltip added value** — why tooltips show description previews, not just the name.
 *
 * ---
 *
 * ### The original problem
 *
 * The first implementation showed `shortTitle · date` on every dot tooltip. The problem:
 * both fields are already visible on the collapsed card. Hovering the dot gave zero new
 * information — just a repetition of what you could already read.
 *
 * ### The fix: description preview
 *
 * Dot tooltips now show the **first sentence of `description`**, truncated at 72 characters.
 * This is the one piece of information *not* visible in any card state without opening it:
 *
 * | State | What is visible |
 * |---|---|
 * | Collapsed | `shortTitle`, `date`, `icon` |
 * | Hovered (on card) | `title`, `description` |
 * | Dot tooltip | First sentence of `description` — a genuine preview |
 *
 * ### Override with `dotTooltip`
 *
 * Set `dotTooltip` explicitly to show a completely custom tooltip — a metric, a status
 * note, or any text not in the description. It always wins over the computed value.
 *
 * ### Checklist mode exception
 *
 * In `checklist={true}` mode, dots are interactive task checkboxes. Their tooltips revert
 * to status labels (`Done · Jan 2024`, `Blocking · Mar 2024`) because task status is what
 * matters when managing a checklist — description previews are not useful there.
 *
 * **Hover the dots** in both sections to compare.
 */
export const DotTooltipAddedValue: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <Box>
        <Typography
          variant="overline"
          sx={{ display: 'block', mb: 1, px: 3, color: 'text.secondary' }}
        >
          Read-only — dot tooltip = description preview (not visible on collapsed card)
        </Typography>
        <Box sx={{ maxWidth: 960, mx: 'auto', px: 3 }}>
          <TimelineTwoColumn phases={CHECKLIST_PHASES} />
        </Box>
      </Box>
      <Box>
        <Typography
          variant="overline"
          sx={{ display: 'block', mb: 1, px: 3, color: 'text.secondary' }}
        >
          Checklist mode — dot tooltip = task status (description preview not useful here)
        </Typography>
        <Box sx={{ maxWidth: 960, mx: 'auto', px: 3 }}>
          <TimelineTwoColumn phases={CHECKLIST_PHASES} checklist />
        </Box>
      </Box>
    </Box>
  ),
  argTypes: { phases: { control: false }, sx: { control: false } },
};

// ----------------------------------------------------------------------

/**
 * **Checklist mode** — dots become interactive task checkboxes.
 *
 * Click phase or milestone dots to toggle done state. Past-due undone items
 * highlight in red automatically (`date` in the past + `checklist={true}`).
 *
 * **Design decision: why checklist mode is separate from read-only**
 *
 * The two modes share the same data type (`TimelinePhase[]`) but have fundamentally
 * different interaction models and accessibility requirements:
 *
 * - Read-only: dots are decorative. No keyboard interaction, no ARIA roles.
 * - Checklist: dots are buttons (`role="checkbox"`), keyboard-navigable, `aria-checked`,
 *   `aria-label`. Overdue detection is active. Toggle state is managed.
 *
 * Merging them into one mode with a boolean flag would mean always paying the
 * accessibility and interaction overhead even for purely narrative timelines.
 * Keeping them separate lets the read-only path stay clean and cost-free.
 */
export const ChecklistMode: Story = {
  render: () => (
    <Box sx={{ maxWidth: 960, mx: 'auto', p: 3 }}>
      <TimelineTwoColumn phases={CHECKLIST_PHASES} checklist />
    </Box>
  ),
  argTypes: { phases: { control: false }, sx: { control: false } },
};

// ----------------------------------------------------------------------

/**
 * **Viewed state** — click the eye icon to mark phases and milestones as read.
 *
 * **Design decision: why viewed state is externally controlled**
 *
 * `viewedKeys` and `onMarkViewed` are controlled props — the consumer owns the state.
 * The component never persists viewed state internally.
 *
 * This keeps the component testable in isolation and lets consumers choose their own
 * persistence strategy: localStorage, URL params, server-side per-user preferences.
 * No coupling to this component's internals.
 *
 * Uses a named component helper (`ViewedStateDemo`) because the render function uses
 * React hooks — anonymous arrow functions inside `render:` violate `react-hooks/rules-of-hooks`.
 */
function ViewedStateDemo() {
  const [viewedKeys, setViewedKeys] = useState<Set<string>>(new Set());

  function handleMarkViewed(key: string) {
    setViewedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', p: 3 }}>
      <TimelineTwoColumn
        phases={CAREER_PHASES}
        viewedKeys={viewedKeys}
        onMarkViewed={handleMarkViewed}
      />
    </Box>
  );
}

export const ViewedState: Story = {
  render: () => <ViewedStateDemo />,
  argTypes: {
    phases: { control: false },
    sx: { control: false },
    viewedKeys: { control: false },
    onMarkViewed: { control: false },
  },
};

// ----------------------------------------------------------------------

const BREAKPOINTS = [
  { label: 'xs — 360px', width: 360 },
  { label: 'sm — 600px', width: 600 },
  { label: 'md — 900px', width: 900 },
  { label: 'lg — 1200px', width: 1200 },
];

/**
 * **Responsive** — the layout at each MUI standard breakpoint.
 *
 * At narrow widths (xs, sm), verify:
 * - Spine connectors remain continuous
 * - Milestone labels do not overflow their column
 * - Phase cards reflow without breaking the two-column structure
 * - Marker labels do not overlap the spine dot
 */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {BREAKPOINTS.map(({ label, width }) => (
        <Box key={width}>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
            {label}
          </Typography>
          <Box sx={{ width, overflow: 'auto', border: '1px dashed', borderColor: 'divider' }}>
            <TimelineTwoColumn phases={CAREER_PHASES} />
          </Box>
        </Box>
      ))}
    </Box>
  ),
  argTypes: { phases: { control: false }, sx: { control: false } },
};

// ----------------------------------------------------------------------

/**
 * **FooterSlot** — a `ReactNode` rendered below icon strips in the always-visible
 * card area, before the expandable detail bullets.
 *
 * ### When to use `footer` vs `details`
 *
 * | | `footer` | `details` |
 * |---|---|---|
 * | Always visible? | **Yes** — shown collapsed and expanded | No — hidden until card is opened |
 * | Content type | Interactive elements (buttons, links, counters) | Plain text bullets |
 * | Click events | Wrapped in `stopPropagation` — will NOT toggle card | N/A |
 *
 * ### The `stopPropagation` invariant — non-negotiable
 *
 * The footer Box has `onClick: e.stopPropagation()`. This prevents any click on
 * a button, link, or other interactive element inside `footer` from bubbling up
 * to the card Paper's own `onClick`, which would toggle expansion.
 *
 * Without this, clicking "Play sound" would simultaneously:
 * 1. Trigger the button action
 * 2. Toggle the card open/closed
 *
 * **Never remove the `stopPropagation` wrapper** from the footer Box.
 *
 * ### What to observe in this story
 *
 * 1. The "Play" button renders inside the card, below the description, always visible.
 * 2. Clicking the button does NOT expand or collapse the card.
 * 3. Clicking anywhere else on the card (title, date area) toggles the card normally.
 */
export const FooterSlot: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The `footer` prop accepts a `ReactNode` rendered below icon strips in the always-visible area. ' +
          'The footer wrapper enforces `stopPropagation` — clicking a button inside `footer` does **not** ' +
          'toggle the card. Verify: click the play button → card stays unchanged. Click the card title → card expands.',
      },
    },
    layout: 'padded',
  },
  render: () => (
    <TimelineTwoColumn
      phases={[
        {
          key: 1,
          title: 'First Internet Connection',
          description: 'Dial-up over the phone line. That sound. The astronomical phone bills.',
          date: '~1994',
          color: 'info',
          side: 'left',
          variant: 'life-event',
          icon: icon('solar:monitor-bold'),
          details: [
            'First internet via dial-up modem',
            'That screeching handshake sound',
            'Phone bills were brutal',
          ],
          footer: (
            <Box
              component="button"
              type="button"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.25,
                py: 0.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'transparent',
                cursor: 'pointer',
                color: 'text.secondary',
                fontSize: '0.75rem',
                fontWeight: 600,
                '&:hover': { color: 'primary.main', borderColor: 'primary.main' },
              }}
              onClick={() => alert('Playing modem sound — button click did NOT toggle the card.')}
            >
              {/* Minimum 20 px: interactive icons (inside clickable button) must be >= 20 px. */}
              <GiselleIcon icon="solar:play-bold" width={20} />
              Play the sound
            </Box>
          ),
        },
        {
          key: 2,
          title: 'Platform Team',
          description: 'Leading a platform engineering team building internal developer tools.',
          date: '2022 – Now',
          color: 'primary',
          side: 'right',
          active: true,
          icon: icon('solar:servers-bold'),
          details: [
            'Internal developer platform for 200+ engineers',
            'TypeScript monorepo with shared tooling',
          ],
        },
      ]}
    />
  ),
  argTypes: { phases: { control: false }, sx: { control: false } },
};
