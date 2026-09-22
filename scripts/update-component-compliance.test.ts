// @vitest-environment node
import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

import {
  normalizeFolder,
  splitRow,
  parseComplianceTable,
  isTrackedComponentFolder,
  discoverComponentFolders,
  deriveLayerFromFolder,
  buildFinalRows,
  renderComplianceTable,
} from './update-component-compliance.js';

const tempDirs: string[] = [];

function makeFixtureDir() {
  const dir = mkdtempSync(path.join(tmpdir(), 'update-component-compliance-fixture-'));
  tempDirs.push(dir);
  return dir;
}

function writeFile(rootDir: string, relPath: string, contents = '') {
  const fullPath = path.join(rootDir, relPath);
  mkdirSync(path.dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, contents);
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

// ----------------------------------------------------------------------

describe('normalizeFolder', () => {
  it('strips backticks and a trailing slash', () => {
    expect(normalizeFolder('`material/metric/`')).toBe('material/metric');
  });

  it('leaves a plain, unadorned folder path untouched', () => {
    expect(normalizeFolder('material/metric')).toBe('material/metric');
  });
});

describe('splitRow', () => {
  it('splits a pipe-delimited markdown row into trimmed cells', () => {
    expect(splitRow('| a | b | c |')).toEqual(['a', 'b', 'c']);
  });
});

// ----------------------------------------------------------------------

const FIXTURE_COMPLIANCE_MD = `# Component Compliance Report

> Some intro prose.

_Last full regen: **2026-01-01** — regenerated from disk across all 2 component folders (giselle-mui#1)._

## Totals

| Category                         | Count |
| --------------------------------- | ----- |
| Component folders tracked        | 2     |
| Built (component \`.tsx\` present) | 1     |

| Component               | Layer    | Built | README | JSDoc | Story JSDoc | Roadmap | Roadmap done | Timeline | Notes             |
| ------------------------ | -------- | ----- | ------ | ----- | ----------- | ------- | ------------ | -------- | ------------------ |
| material/fake-widget     | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       | hand-written note |
| material/fake-scaffold   | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold  |
`;

describe('parseComplianceTable', () => {
  it('parses the real component-compliance.md table shape, keyed by folder, preserving Notes', () => {
    const rows = parseComplianceTable(FIXTURE_COMPLIANCE_MD);

    expect(rows).toEqual([
      {
        folder: 'material/fake-widget',
        layer: 'material',
        built: true,
        readme: true,
        jsdoc: true,
        storyJsdoc: true,
        roadmap: true,
        roadmapDone: true,
        timeline: true,
        notes: 'hand-written note',
      },
      {
        folder: 'material/fake-scaffold',
        layer: 'material',
        built: false,
        readme: true,
        jsdoc: true,
        storyJsdoc: false,
        roadmap: true,
        roadmapDone: false,
        timeline: false,
        notes: 'unbuilt scaffold',
      },
    ]);
  });

  it('never confuses the "## Totals" table for the main component table', () => {
    const rows = parseComplianceTable(FIXTURE_COMPLIANCE_MD);
    // The Totals table's own two rows must not leak into the parsed rows.
    expect(rows).toHaveLength(2);
    expect(rows.some((r) => r.folder === 'Component folders tracked')).toBe(false);
  });
});

// ----------------------------------------------------------------------

describe('isTrackedComponentFolder', () => {
  it('tracks a folder that owns a README.md', () => {
    expect(isTrackedComponentFolder([{ name: 'README.md', isDirectory: false }])).toBe(true);
  });

  it('tracks a folder that owns a types.ts', () => {
    expect(isTrackedComponentFolder([{ name: 'types.ts', isDirectory: false }])).toBe(true);
  });

  it('tracks a folder that owns a roadmap.md', () => {
    expect(isTrackedComponentFolder([{ name: 'roadmap.md', isDirectory: false }])).toBe(true);
  });

  it('tracks a folder that owns a built component .tsx', () => {
    expect(isTrackedComponentFolder([{ name: 'widget.tsx', isDirectory: false }])).toBe(true);
  });

  it('does not track a folder whose only .tsx is a story/test/defaults file', () => {
    expect(
      isTrackedComponentFolder([
        { name: 'widget.stories.tsx', isDirectory: false },
        { name: 'widget.test.tsx', isDirectory: false },
      ])
    ).toBe(false);
  });

  it('does not track a pure grouping folder with only a child subdirectory', () => {
    expect(isTrackedComponentFolder([{ name: 'child', isDirectory: true }])).toBe(false);
  });
});

describe('discoverComponentFolders', () => {
  it('finds tracked folders including motion/variants (unlike the poc scanner it is ported from)', () => {
    const root = makeFixtureDir();
    writeFile(root, 'motion/variants/fade/types.ts', 'export {};');
    writeFile(root, 'material/metric/metric.tsx', 'export function Metric() { return null; }');
    // A pure grouping folder (no README/types/roadmap/tsx of its own, has a child dir) is skipped.
    writeFile(root, 'material/metric/sub/sub.tsx', 'export function Sub() { return null; }');

    const found = discoverComponentFolders(root);

    expect(found).toContain('motion/variants/fade');
    expect(found).toContain('material/metric');
    expect(found).toContain('material/metric/sub');
  });

  it('excludes __fixtures__ folders (Storybook/demo fixture assets, not real components)', () => {
    const root = makeFixtureDir();
    writeFile(root, 'section/feature-flow/feature-flow.tsx', 'export function FeatureFlow() { return null; }');
    writeFile(root, 'section/feature-flow/__fixtures__/nav-adjacent-decorator.tsx', 'export function NavAdjacentDecorator() { return null; }');

    const found = discoverComponentFolders(root);

    expect(found).toContain('section/feature-flow');
    expect(found).not.toContain('section/feature-flow/__fixtures__');
  });

  it('returns folders in sorted order', () => {
    const root = makeFixtureDir();
    writeFile(root, 'section/hero/types.ts', 'export {};');
    writeFile(root, 'chart/widget/types.ts', 'export {};');

    const found = discoverComponentFolders(root);

    expect(found).toEqual(['chart/widget', 'section/hero']);
  });
});

// ----------------------------------------------------------------------

describe('deriveLayerFromFolder', () => {
  it('is the folder path\'s first segment', () => {
    expect(deriveLayerFromFolder('lab/timeline/two-column/phase-card')).toBe('lab');
    expect(deriveLayerFromFolder('material/fake-widget')).toBe('material');
  });
});

describe('buildFinalRows', () => {
  it('preserves an existing row\'s Notes text verbatim while refreshing its presence facts', () => {
    const root = makeFixtureDir();
    writeFile(root, 'material/fake-widget/fake-widget.tsx', 'export function FakeWidget() { return null; }');
    // No README this time, so README should now scan false even though the
    // existing row claims it's true — the presence facts are always fresh.
    const existingRows = [
      {
        folder: 'material/fake-widget',
        layer: 'material',
        built: true,
        readme: true,
        jsdoc: false,
        storyJsdoc: false,
        roadmap: false,
        roadmapDone: false,
        timeline: false,
        notes: 'hand-written note, must survive the regen',
      },
    ];

    const rows = buildFinalRows(existingRows, ['material/fake-widget'], '', root);

    expect(rows).toEqual([
      {
        folder: 'material/fake-widget',
        layer: 'material',
        notes: 'hand-written note, must survive the regen',
        built: true,
        readme: false,
        jsdoc: false,
        storyJsdoc: false,
        roadmap: false,
        roadmapDone: false,
        timeline: false,
      },
    ]);
  });

  it('gives a newly discovered folder (no existing row) a blank Notes cell, never inferred prose', () => {
    const root = makeFixtureDir();
    writeFile(root, 'material/brand-new/README.md', '# BrandNew\n');

    const rows = buildFinalRows([], ['material/brand-new'], '', root);

    expect(rows).toEqual([
      {
        folder: 'material/brand-new',
        layer: 'material',
        notes: '',
        built: false,
        readme: true,
        jsdoc: false,
        storyJsdoc: false,
        roadmap: false,
        roadmapDone: false,
        timeline: false,
      },
    ]);
  });

  it('drops a row whose folder no longer exists on disk (not in trackedFolders)', () => {
    const root = makeFixtureDir();
    writeFile(root, 'material/still-here/README.md', '# StillHere\n');
    const existingRows = [
      {
        folder: 'material/still-here',
        layer: 'material',
        built: false,
        readme: true,
        jsdoc: false,
        storyJsdoc: false,
        roadmap: false,
        roadmapDone: false,
        timeline: false,
        notes: '',
      },
      {
        folder: 'material/long-gone',
        layer: 'material',
        built: false,
        readme: true,
        jsdoc: false,
        storyJsdoc: false,
        roadmap: false,
        roadmapDone: false,
        timeline: false,
        notes: 'this folder was deleted',
      },
    ];

    const rows = buildFinalRows(existingRows, ['material/still-here'], '', root);

    expect(rows).toHaveLength(1);
    expect(rows[0]?.folder).toBe('material/still-here');
  });
});

// ----------------------------------------------------------------------

describe('renderComplianceTable', () => {
  it('renders a valid markdown table that round-trips through parseComplianceTable', () => {
    const rows = [
      {
        folder: 'material/fake-widget',
        layer: 'material',
        built: true,
        readme: true,
        jsdoc: true,
        storyJsdoc: true,
        roadmap: true,
        roadmapDone: true,
        timeline: true,
        notes: 'a note',
      },
      {
        folder: 'material/fake-scaffold',
        layer: 'material',
        built: false,
        readme: true,
        jsdoc: true,
        storyJsdoc: false,
        roadmap: true,
        roadmapDone: false,
        timeline: false,
        notes: '',
      },
    ];

    const rendered = renderComplianceTable(rows);
    const reparsed = parseComplianceTable(rendered);

    expect(reparsed).toEqual(rows);
  });
});
