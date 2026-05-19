/**
 * @littlebranches/giselle-mui/lab — requires @mui/lab peer dependency
 */

export {
  MilestoneBadge,
  PhaseCard,
  TimelineDot,
  TimelineTwoColumn,
} from './components/lab/timeline/two-column';
export type {
  MilestoneBadgeProps,
  PhaseCardProps,
  TaskDetails,
  TimelineDotComponentProps,
  TimelineTwoColumnProps,
  Task,
  TimelinePhase,
  TimelineMilestone,
  TimelinePlatformItem,
  HighlightedPaletteKey,
  TimelineSidebar,
  TimelineColumnLabels,
  TimelineSectionData,
} from './components/lab/timeline/two-column';

export {
  TimelineCompact,
  TaskDetailsRenderer,
  resolveCompactColor,
  COMPACT_PHASE_DOT_SIZE,
  COMPACT_MILESTONE_DOT_SIZE,
  COMPACT_PHASE_ICON_SIZE,
  COMPACT_MIN_PHASE_DOT_SIZE,
  COMPACT_MIN_MILESTONE_DOT_SIZE,
} from './components/lab/timeline/compact';
export type { TimelineCompactProps } from './components/lab/timeline/compact';

export { TaskList } from './components/lab/timeline/task-list';
export type { TaskListProps } from './components/lab/timeline/task-list';

export { assignMilestoneSidesByDone } from './utils/timeline/timeline-utils';
