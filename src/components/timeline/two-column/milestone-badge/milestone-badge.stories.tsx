import { useState, useCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {
  breakpointContainerSx,
  breakpointLabelSx,
  responsiveWrapperSx,
  variantGridSx,
} from '../../../../stories-defaults';
import { GiselleIcon } from '../../../icon/giselle/giselle-icon';
import { MilestoneBadge } from './milestone-badge';
import type { TimelineMilestone } from '../types';

// ----------------------------------------------------------------------
// Shared generic sample data (rule 0 — no personal names or real projects)
// ----------------------------------------------------------------------

const icon = (name: string) => <GiselleIcon icon={name} width={16} />;

/** Default milestone with three expandable tasks. */
const BASE_MILESTONE: TimelineMilestone = {
  key: 'v2-published',
  date: 'Mar 2022',
  title: 'v2.0 Published to npm',
  shortTitle: 'v2.0 Published',
  description:
    'First stable release with zero breaking changes from rc.1. Includes migration guide.',
  icon: icon('solar:upload-bold'),
  color: 'success',
  children: [
    { key: 'migration-guide', title: 'Migration guide written and reviewed', done: true },
    { key: 'peer-review', title: 'Peer review sign-off from Platform Team' },
    { key: 'registry-health', title: 'npm registry health check passed', done: true },
  ],
};

/** Minimal milestone — no children, not expandable. Used for colour matrix. */
const SIMPLE_MILESTONE: TimelineMilestone = {
  key: 'mit-license',
  date: 'Jun 2020',
  title: 'Open Sourced under MIT',
  shortTitle: 'MIT Licensed',
  description:
    'Repository made public. MIT license applied. First external contributor within a week.',
  icon: icon('solar:lock-unlocked-bold'),
  color: 'info',
};

/**
 * Realistic card-column widths that simulate the space available to a MilestoneBadge
 * at common screen sizes. A milestone badge occupies roughly half the screen minus the spine (~30 px).
 */
const CARD_COLUMN_WIDTHS = [
  { label: '160px — xs screen (360px)', width: 160 },
  { label: '280px — mid column (sm)', width: 280 },
  { label: '440px — wide column (md)', width: 440 },
  { label: '560px — desktop column (lg)', width: 560 },
];

// ----------------------------------------------------------------------
// Meta
// ----------------------------------------------------------------------

const meta: Meta<typeof MilestoneBadge> = {
  component: MilestoneBadge,
  title: 'Giselle MUI/Timeline/Milestone Badge',
  argTypes: {
    milestone: { control: false },
    expandableIcon: { control: false },
    onRequestExpand: { control: false },
    onMarkViewed: { control: false },
    onToggleTask: { control: false },
    taskDoneStates: { control: false },
    sx: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: `
**MilestoneBadge** is the expandable card rendered alongside the centre spine for milestone events.

It is always **controlled** — the parent (\`TimelineTwoColumn\`) owns accordion state so that
at most one milestone per phase is expanded at any time. Therefore \`isExpanded\` and
\`onRequestExpand\` are required props.

### Column alignment invariant

Left-column milestones right-align their collapsed content so text sits flush against the spine.
The alignment resets to left when the card is expanded (normal reading flow).
**Hover does not change alignment** — only expansion does.

Set \`columnSide="left"\` to enable this. The prop defaults to \`'right'\`.

### Three-level disclosure model

| State | Content shown |
|---|---|
| Collapsed (rest) | \`shortTitle\` (or \`title\` when omitted) |
| Collapsed (hovered) | Full \`title\` |
| Expanded (clicked) | Full \`title\` + \`description\` + detail bullets |
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MilestoneBadge>;

// ----------------------------------------------------------------------
// Named demo helpers — required for every story because isExpanded + onRequestExpand
// are mandatory props, making useState unavoidable in all story render functions.
// ----------------------------------------------------------------------

function DefaultDemo() {
  const [expanded, setExpanded] = useState(false);
  const handleExpand = useCallback(() => setExpanded((v) => !v), []);
  return (
    <Box sx={{ width: 280 }}>
      <MilestoneBadge
        milestone={BASE_MILESTONE}
        isExpanded={expanded}
        onRequestExpand={handleExpand}
        stableId="default"
      />
    </Box>
  );
}

function ExpandedStateDemo() {
  const [expanded, setExpanded] = useState(true);
  const handleExpand = useCallback(() => setExpanded((v) => !v), []);
  return (
    <Box sx={{ width: 280 }}>
      <MilestoneBadge
        milestone={BASE_MILESTONE}
        isExpanded={expanded}
        onRequestExpand={handleExpand}
        stableId="expanded"
      />
    </Box>
  );
}

function LeftColumnDemo() {
  const [expanded, setExpanded] = useState(false);
  const handleExpand = useCallback(() => setExpanded((v) => !v), []);
  return (
    <Box sx={{ width: 280 }}>
      <MilestoneBadge
        milestone={BASE_MILESTONE}
        isExpanded={expanded}
        onRequestExpand={handleExpand}
        columnSide="left"
        stableId="left-col"
      />
    </Box>
  );
}

function LeftColumnExpandedDemo() {
  const [expanded, setExpanded] = useState(true);
  const handleExpand = useCallback(() => setExpanded((v) => !v), []);
  return (
    <Box sx={{ width: 280 }}>
      <MilestoneBadge
        milestone={BASE_MILESTONE}
        isExpanded={expanded}
        onRequestExpand={handleExpand}
        columnSide="left"
        stableId="left-col-expanded"
      />
    </Box>
  );
}

function DoneStateDemo() {
  const [expanded, setExpanded] = useState(false);
  const handleExpand = useCallback(() => setExpanded((v) => !v), []);
  return (
    <Box sx={{ width: 280 }}>
      <MilestoneBadge
        milestone={BASE_MILESTONE}
        isExpanded={expanded}
        onRequestExpand={handleExpand}
        done
        stableId="done"
      />
    </Box>
  );
}

function IsViewedDemo() {
  const [expanded, setExpanded] = useState(false);
  const [viewed, setViewed] = useState(false);
  const handleExpand = useCallback(() => setExpanded((v) => !v), []);
  const handleMarkViewed = useCallback(() => setViewed((v) => !v), []);
  return (
    <Box sx={{ width: 280 }}>
      <MilestoneBadge
        milestone={BASE_MILESTONE}
        isExpanded={expanded}
        onRequestExpand={handleExpand}
        isViewed={viewed}
        onMarkViewed={handleMarkViewed}
        stableId="viewed"
      />
    </Box>
  );
}

/**
 * One card per palette key — each item has its own isolated expansion state.
 * Extracted as a sub-component so each can hold its own useState without
 * violating rules-of-hooks.
 */
function ColorVariantItem({ color }: { color: string }) {
  const [expanded, setExpanded] = useState(false);
  const handleExpand = useCallback(() => setExpanded((v) => !v), []);
  return (
    <Box sx={{ width: 240 }}>
      <Typography variant="caption" sx={breakpointLabelSx}>
        {color}
      </Typography>
      <MilestoneBadge
        milestone={{
          ...SIMPLE_MILESTONE,
          color: color as TimelineMilestone['color'],
          title: `${color.charAt(0).toUpperCase() + color.slice(1)} milestone`,
          shortTitle: color,
          date: '2022',
        }}
        isExpanded={expanded}
        onRequestExpand={handleExpand}
        stableId={`color-${color}`}
      />
    </Box>
  );
}

function AllColorsDemo() {
  return (
    <Box sx={variantGridSx}>
      {(['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const).map((color) => (
        <ColorVariantItem key={color} color={color} />
      ))}
    </Box>
  );
}

function ResponsiveDemo() {
  const [expandedWidth, setExpandedWidth] = useState<number | null>(null);
  const handleExpand = useCallback(
    (width: number) => setExpandedWidth((w) => (w === width ? null : width)),
    []
  );
  return (
    <Box sx={responsiveWrapperSx}>
      {CARD_COLUMN_WIDTHS.map(({ label, width }) => (
        <div key={width}>
          <Typography variant="caption" sx={breakpointLabelSx}>
            {label}
          </Typography>
          <Box sx={[breakpointContainerSx, { width }]}>
            <MilestoneBadge
              milestone={BASE_MILESTONE}
              isExpanded={expandedWidth === width}
              onRequestExpand={() => handleExpand(width)}
              stableId={`responsive-${width}`}
            />
          </Box>
        </div>
      ))}
    </Box>
  );
}

// ----------------------------------------------------------------------
// Stories
// ----------------------------------------------------------------------

/**
 * **Default** — right-column, collapsed at rest.
 *
 * Hover to see the milestone title. Click (or press Enter/Space when focused) to expand.
 */
export const Default: Story = {
  render: () => <DefaultDemo />,
};

/**
 * **ExpandedState** — card opened to show detail bullets.
 *
 * The card starts expanded. Click to collapse, then again to re-expand.
 */
export const ExpandedState: Story = {
  render: () => <ExpandedStateDemo />,
};

/**
 * **LeftColumn** — `columnSide="left"` right-aligns the collapsed card.
 *
 * ### The column alignment invariant
 *
 * Left-column milestones right-align their collapsed title and inline elements so
 * text sits flush against the centre spine — no ragged gap between the text and
 * the spine connector. The alignment resets to left the moment the card expands.
 * **Hover must not change alignment.** Only expansion resets it.
 *
 * This is a hard invariant: a future refactor that shifts hover behaviour to toggle
 * alignment would break left-column readability and must be caught in a test.
 */
export const LeftColumn: Story = {
  render: () => <LeftColumnDemo />,
};

/**
 * **LeftColumnExpanded** — same `columnSide="left"` card in the expanded state.
 *
 * Verify that text alignment reverts to left (normal reading flow) once expanded.
 * Compare with `LeftColumn` at the same width to see the alignment transition.
 */
export const LeftColumnExpanded: Story = {
  render: () => <LeftColumnExpandedDemo />,
};

/**
 * **DoneState** — `done=true` dims and desaturates the card.
 *
 * The card remains interactive — hover restores full opacity. The milestone dot in
 * the centre spine always shows green + checkmark when done (enforced by
 * `resolveEffectiveColor` in `TimelineDot`).
 */
export const DoneState: Story = {
  render: () => <DoneStateDemo />,
};

/**
 * **IsViewed** — `onMarkViewed` makes the viewed eye button visible.
 *
 * ### Design decision: eye button placement in the title row
 *
 * The eye button is inline in the title row — after the title when `columnSide='right'`
 * (left-aligned text), before the title when `columnSide='left'` (right-aligned text),
 * so the button always sits closest to the spine regardless of column.
 *
 * The button uses `width={20}` (`MILESTONE_EYE_ICON_SIZE`) — the minimum for interactive
 * icons per the WCAG 2.2 AA 20 px interactive icon rule.
 */
export const IsViewed: Story = {
  render: () => <IsViewedDemo />,
};

/**
 * **AllColors** — all six MUI palette keys side-by-side.
 *
 * Each card has its own isolated expansion state — click any card independently.
 * Verify that each colour key produces a distinct dot tint and border colour
 * without clashing with the card background.
 */
export const AllColors: Story = {
  parameters: { layout: 'padded' },
  render: () => <AllColorsDemo />,
};

/**
 * **Responsive** — the card at realistic column widths across MUI standard breakpoints.
 *
 * Click any card to expand it and verify the expanded layout at that width.
 * The dashed border shows the container boundary — it is not part of the component.
 *
 * Verify at each width:
 * - Collapsed title does not overflow the container
 * - Expanded description + bullet list wraps naturally without horizontal scroll
 * - The expandable detail pill aligns correctly with the title row
 */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => <ResponsiveDemo />,
};
