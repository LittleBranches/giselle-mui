/**
 * @littlebranches/giselle-mui/lab — requires @mui/lab peer dependency
 */

export {
  MilestoneBadge,
  PhaseCard,
  TimelineDot,
  TimelineTwoColumn,
} from './components/section/timeline/two-column';
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
} from './components/section/timeline/two-column';

export {
  TimelineCompact,
  TaskDetailsRenderer,
  resolveCompactColor,
  COMPACT_PHASE_DOT_SIZE,
  COMPACT_MILESTONE_DOT_SIZE,
  COMPACT_PHASE_ICON_SIZE,
  COMPACT_MIN_PHASE_DOT_SIZE,
  COMPACT_MIN_MILESTONE_DOT_SIZE,
} from './components/section/timeline/compact';
export type { TimelineCompactProps } from './components/section/timeline/compact';

export { TaskList } from './components/section/timeline/task-list';
export type { TaskListProps } from './components/section/timeline/task-list';

export { assignMilestoneSidesByDone } from './utils/timeline/timeline-utils';
