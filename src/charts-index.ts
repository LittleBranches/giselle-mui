// @alexrebula/giselle-mui — /charts subpath entry point
//
// ApexCharts chart card components (optional peer deps: apexcharts + react-apexcharts).
// Import from '@alexrebula/giselle-mui/charts' — NOT from the root import.
//
// Why a separate entry?
// Importing apexcharts in src/index.ts would impose a ~1 MB optional dependency on every
// consumer, even those that never use a chart. The subpath isolates it so only projects
// that explicitly import from '/charts' need apexcharts installed.
//
// Consumer contract:
//   import { DonutChartCard } from '@alexrebula/giselle-mui/charts';
//   // requires: apexcharts + react-apexcharts in the consumer's own deps
//
// Phase H components will be exported from here.
export { RadialProgressCard } from './components/bonus/chart/radial-progress';
export type {
  RadialProgressCardProps,
  RadialProgressItem,
} from './components/bonus/chart/radial-progress';
