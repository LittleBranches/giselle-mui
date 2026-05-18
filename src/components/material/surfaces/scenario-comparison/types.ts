import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type ScenarioVariableType = 'toggle' | 'range' | 'select';
export type ScenarioOutcomeFormat = 'currency' | 'days' | 'percent' | 'text';

export interface ScenarioVariableOption {
  label: string;
  value: unknown;
}

export interface ScenarioVariable {
  key: string;
  label: string;
  type: ScenarioVariableType;
  defaultValue: unknown;
  /** For 'select': option objects. For 'range': `[min, max]` tuple. Unused for 'toggle'. */
  options?: ScenarioVariableOption[] | [number, number];
  /** Step size for range inputs. @default 1 */
  step?: number;
}

export interface ScenarioOutcome {
  key: string;
  value: unknown;
}

export interface ScenarioOutcomeDefinition {
  key: string;
  label: string;
  format: ScenarioOutcomeFormat;
  currency?: string;
}

export interface ScenarioComparisonProps {
  title?: string;
  variables: ScenarioVariable[];
  /** Pure function — no side effects. Receives current values, returns computed outcomes. */
  compute: (values: Record<string, unknown>) => ScenarioOutcome[];
  outcomes: ScenarioOutcomeDefinition[];
  sx?: SxProps<Theme>;
}
