#!/usr/bin/env node
/**
 * scaffold-components.js
 *
 * Generates placeholder folders for every planned but unimplemented component.
 * Safe to re-run — skips any folder that already contains a .tsx file.
 *
 * Each placeholder folder gets:
 *   index.ts         — empty barrel (ready to fill in)
 *   types.ts         — Props stub with JSDoc skeleton
 *   <name>.test.ts   — Vitest it.todo stubs
 *   README.md        — why it exists, planned API, phase/tier
 *
 * Usage: node scripts/scaffold-components.js
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, '..', 'src', 'components');

// ── Component list ─────────────────────────────────────────────────────────
// path: relative to src/components/
// name: PascalCase component name
// phase: roadmap phase label
// tier: T1 / T2 / T3

const COMPONENTS = [
  // ── Phase E remaining ──────────────────────────────────────────────────
  // section/hero is already implemented — HeroSection lives at section/hero/section/
  { path: 'material/input/option-with-blurb', name: 'OptionWithBlurb', phase: 'E', tier: 'T2' },
  {
    path: 'material/feedback/section-pending-loader',
    name: 'SectionPendingLoader',
    phase: 'E',
    tier: 'T2',
  },
  {
    path: 'material/navigation/floating-control-bar',
    name: 'FloatingControlBar',
    phase: 'E',
    tier: 'T2',
  },

  // ── Phase F ────────────────────────────────────────────────────────────
  { path: 'material/surfaces/details-drawer', name: 'DetailsDrawer', phase: 'F', tier: 'T2' },

  // ── Phase G ────────────────────────────────────────────────────────────
  { path: 'section/timeline/item-details', name: 'TimelineItemDetails', phase: 'G', tier: 'T2' },

  // ── Phase H G1 — financial cards ──────────────────────────────────────
  {
    path: 'material/surfaces/card/balance-summary',
    name: 'BalanceSummaryCard',
    phase: 'H-G1',
    tier: 'T2',
  },
  {
    path: 'material/surfaces/card/credit-card-display',
    name: 'CreditCardDisplay',
    phase: 'H-G1',
    tier: 'T3',
  },

  // ── Phase H G2 — chart cards (/charts subpath) ────────────────────────
  { path: 'chart/chart-card-base', name: 'ChartCardBase', phase: 'H-G2', tier: 'T1' },
  { path: 'chart/sparkline-bar', name: 'SparklineBarChart', phase: 'H-G2', tier: 'T1' },
  { path: 'chart/donut-chart-card', name: 'DonutChartCard', phase: 'H-G2', tier: 'T1' },
  { path: 'chart/area-line-chart-card', name: 'AreaLineChartCard', phase: 'H-G2', tier: 'T1' },
  { path: 'chart/grouped-bar-chart-card', name: 'GroupedBarChartCard', phase: 'H-G2', tier: 'T1' },
  { path: 'chart/budget-vs-actual-card', name: 'BudgetVsActualCard', phase: 'H-G2', tier: 'T2' },
  {
    path: 'chart/horizontal-bar-chart-card',
    name: 'HorizontalBarChartCard',
    phase: 'H-G2',
    tier: 'T2',
  },
  { path: 'chart/radar-chart-card', name: 'RadarChartCard', phase: 'H-G2', tier: 'T3' },
  { path: 'chart/projection-card', name: 'ProjectionCard', phase: 'H-G2', tier: 'T3' },

  // ── Phase H G3 — data lists and tables ────────────────────────────────
  { path: 'material/data-display/data-table', name: 'DataTable', phase: 'H-G3', tier: 'T1' },
  {
    path: 'material/data-display/activity-feed-list',
    name: 'ActivityFeedList',
    phase: 'H-G3',
    tier: 'T2',
  },
  { path: 'material/data-display/news-feed-list', name: 'NewsFeedList', phase: 'H-G3', tier: 'T2' },
  {
    path: 'material/data-display/related-items-list',
    name: 'RelatedItemsList',
    phase: 'H-G3',
    tier: 'T2',
  },

  // ── Phase H G4 — financial / action widgets ───────────────────────────
  {
    path: 'material/data-display/progress-stats-list',
    name: 'ProgressStatsList',
    phase: 'H-G4',
    tier: 'T2',
  },
  { path: 'material/data-display/contacts-list', name: 'ContactsList', phase: 'H-G4', tier: 'T2' },
  {
    path: 'material/surfaces/card/quick-transfer',
    name: 'QuickTransferCard',
    phase: 'H-G4',
    tier: 'T2',
  },
  {
    path: 'material/surfaces/card/budget-breakdown',
    name: 'BudgetBreakdownCard',
    phase: 'H-G4',
    tier: 'T2',
  },

  // ── Phase H G5 — hero / marketing cards ──────────────────────────────
  { path: 'material/surfaces/card/hero-banner', name: 'HeroBannerCard', phase: 'H-G5', tier: 'T2' },
  {
    path: 'material/surfaces/card/featured-item',
    name: 'FeaturedItemCard',
    phase: 'H-G5',
    tier: 'T2',
  },
  {
    path: 'material/surfaces/card/promo-invite',
    name: 'PromoInviteCard',
    phase: 'H-G5',
    tier: 'T2',
  },

  // ── Phase H G6 — motion components (/motion subpath) ─────────────────
  { path: 'motion/animated-tab-panel', name: 'AnimatedTabPanel', phase: 'H-G6', tier: 'T2' },

  // ── Phase H G7 — advanced dashboard widgets ───────────────────────────
  {
    path: 'material/surfaces/card/cost-classification',
    name: 'CostClassificationCard',
    phase: 'H-G7',
    tier: 'T3',
  },
  {
    path: 'material/surfaces/card/roi-comparison',
    name: 'RoiComparisonCard',
    phase: 'H-G7',
    tier: 'T3',
  },
  {
    path: 'material/surfaces/scenario-comparison',
    name: 'ScenarioComparison',
    phase: 'H-G7',
    tier: 'T3',
  },
  {
    path: 'material/data-display/amortization-table',
    name: 'AmortizationTable',
    phase: 'H-G7',
    tier: 'T3',
  },

  // ── Phase I — Motion & Animation (/motion subpath) ────────────────────
  { path: 'motion/section-title-animated', name: 'SectionTitleAnimated', phase: 'I-2', tier: 'T2' },
  { path: 'motion/floating-side-nav', name: 'FloatingSideNav', phase: 'I-3', tier: 'T2' },
  { path: 'motion/hero-background', name: 'HeroBackground', phase: 'I-5', tier: 'T2' },
  { path: 'motion/floating-icon-cloud', name: 'FloatingIconCloud', phase: 'I-6', tier: 'T3' },
  { path: 'motion/interactive-hero-logo', name: 'InteractiveHeroLogo', phase: 'I-7', tier: 'T3' },
  {
    path: 'material/data-display/expense-line-item',
    name: 'ExpenseLineItem',
    phase: 'I-A',
    tier: 'T2',
  },
  {
    path: 'material/data-display/expense-category-group',
    name: 'ExpenseCategoryGroup',
    phase: 'I-A',
    tier: 'T2',
  },
  { path: 'motion/period-detail-sheet', name: 'PeriodDetailSheet', phase: 'I-C', tier: 'T2' },
  { path: 'motion/horizontal-scroll-rail', name: 'HorizontalScrollRail', phase: 'I-C', tier: 'T3' },
  { path: 'motion/expanding-period-strip', name: 'ExpandingPeriodStrip', phase: 'I-C', tier: 'T3' },
  { path: 'motion/budget-summary-drawer', name: 'BudgetSummaryDrawer', phase: 'I-C', tier: 'T3' },
  {
    path: 'motion/breakdown-carousel-view',
    name: 'BreakdownCarouselView',
    phase: 'I-D',
    tier: 'T3',
  },
  {
    path: 'motion/breakdown-expanding-view',
    name: 'BreakdownExpandingView',
    phase: 'I-D',
    tier: 'T3',
  },
  { path: 'motion/breakdown-stacked-view', name: 'BreakdownStackedView', phase: 'I-D', tier: 'T3' },
  { path: 'motion/weekly-breakdown-page', name: 'WeeklyBreakdownPage', phase: 'I-D', tier: 'T3' },
  {
    path: 'material/surfaces/card/period-summary',
    name: 'PeriodSummaryCard',
    phase: 'I-B',
    tier: 'T2',
  },

  // ── Phase J — Dashboard shell ─────────────────────────────────────────
  { path: 'material/layout/app-shell', name: 'AppShell', phase: 'J', tier: 'T1' },
  { path: 'material/layout/auth-page-layout', name: 'AuthPageLayout', phase: 'J', tier: 'T1' },
  { path: 'material/layout/page-header', name: 'PageHeader', phase: 'J', tier: 'T2' },
  { path: 'material/navigation/app-sidebar', name: 'AppSidebar', phase: 'J', tier: 'T1' },
  { path: 'material/navigation/app-top-bar', name: 'AppTopBar', phase: 'J', tier: 'T1' },
  { path: 'material/navigation/breadcrumbs', name: 'Breadcrumbs', phase: 'J', tier: 'T2' },
  { path: 'material/data-display/status-label', name: 'StatusLabel', phase: 'J', tier: 'T1' },
  { path: 'material/data-display/avatar-row', name: 'AvatarRow', phase: 'J', tier: 'T2' },
  {
    path: 'material/surfaces/card/profile-summary',
    name: 'ProfileSummaryCard',
    phase: 'J',
    tier: 'T2',
  },
  { path: 'section/error', name: 'ErrorSection', phase: 'J', tier: 'T1' },
  { path: 'section/pricing', name: 'PricingSection', phase: 'J', tier: 'T3' },
];

// ── File templates ─────────────────────────────────────────────────────────

function indexTs(name) {
  return `// Placeholder — not yet implemented.
// When ${name} is built, add:
// export { ${name} } from './${toKebab(name)}';
// export type { ${name}Props } from './types';
`;
}

function typesTs(name) {
  return `import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Props for \`${name}\`.
 *
 * @todo Fill in props when implementation begins.
 * See README.md for the planned API.
 */
export interface ${name}Props {
  /** MUI sx prop — forwarded to root element. */
  sx?: SxProps<Theme>;
}
`;
}

function testTs(name) {
  return `// @vitest-environment jsdom
import { describe, it } from 'vitest';

// Placeholder — stubs filled in before implementation begins.
// See README.md for planned behaviours.

describe.skip('${name}', () => {
  it('placeholder scaffold test (implementation pending)', () => {
    // Intentionally skipped until ${name}.tsx exists.
  });
});
`;
}

function readmeMd(name, phase, tier) {
  return `# ${name}

## Why it exists

_One paragraph explaining the recurring problem this component solves._
_What would a developer have to write by hand without it?_

## Why it belongs in giselle-mui

_One paragraph confirming this is reusable across projects (not alexrebula-specific)._

## Planned API

| Prop | Type             | Default | Description              |
| ---- | ---------------- | ------- | ------------------------ |
| \`sx\` | \`SxProps<Theme>\` | —       | MUI sx forwarded to root |

## Design decisions

_Key choices made during design — preserved here so they survive future refactors._

## Phase

Phase: \`${phase}\` | Priority tier: \`${tier}\`

## File structure

_Filled in when implementation begins._

## Related

_Links to similar components, docs, or stories once they exist._
`;
}

function roadmapMd(name, phase, tier) {
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return `# ${name} — Roadmap

> Last updated: ${today}

## Status

\`planned\`

Phase: \`${phase}\` | Priority tier: \`${tier}\`

Not yet implemented. See \`README.md\` for the planned API.

## Open improvements

| Task                   | Priority | Status |
| ---------------------- | -------- | ------ |
| Initial implementation | High     | ⬜     |

## Known gaps

Not started.

## Completed

| Task | Completed |
| ---- | --------- |
`;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function toKebab(name) {
  return name
    .replace(/([A-Z])/g, (m, l, i) => (i === 0 ? l.toLowerCase() : `-${l.toLowerCase()}`))
    .replace(/^-/, '');
}

function folderHasTsx(folderPath) {
  if (!existsSync(folderPath)) return false;
  return readdirSync(folderPath).some((f) => f.endsWith('.tsx'));
}

// ── Main ───────────────────────────────────────────────────────────────────

let created = 0;
let patched = 0;
let skipped = 0;

for (const { path: relPath, name, phase, tier } of COMPONENTS) {
  const folderPath = path.join(SRC, relPath);
  const kebab = toKebab(name);

  if (folderHasTsx(folderPath)) {
    console.log(`  skip  ${relPath}  (${name}.tsx exists)`);
    skipped++;
    continue;
  }

  const roadmapPath = path.join(folderPath, 'roadmap.md');
  const isNew = !existsSync(folderPath) || !readdirSync(folderPath).includes('index.ts');

  mkdirSync(folderPath, { recursive: true });

  if (isNew) {
    // Brand-new placeholder — write all files.
    writeFileSync(path.join(folderPath, 'index.ts'), indexTs(name));
    writeFileSync(path.join(folderPath, 'types.ts'), typesTs(name));
    writeFileSync(path.join(folderPath, `${kebab}.test.ts`), testTs(name));
    writeFileSync(path.join(folderPath, 'README.md'), readmeMd(name, phase, tier));
    writeFileSync(roadmapPath, roadmapMd(name, phase, tier));
    console.log(`  create  ${relPath}`);
    created++;
  } else if (existsSync(roadmapPath)) {
    console.log(`  skip  ${relPath}  (placeholder already complete)`);
    skipped++;
  } else {
    // Existing placeholder missing only roadmap.md — add it without touching other files.
    writeFileSync(roadmapPath, roadmapMd(name, phase, tier));
    console.log(`  patch   ${relPath}  (added roadmap.md)`);
    patched++;
  }
}

console.log(
  `\nDone — ${created} created, ${patched} patched (roadmap.md added), ${skipped} skipped.`
);
