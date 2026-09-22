// @vitest-environment node
import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';

import { scanComponentPresence } from './presence-fact-scanner.js';

// ----------------------------------------------------------------------
// docs/component-compliance.md's table tracks 7 file-presence facts per
// component folder (Built / README / JSDoc / Story JSDoc / Roadmap /
// Roadmap done / Timeline — see that file's "How each column is derived"
// table for the exact wording each check below mirrors). This test proves
// scanComponentPresence() computes those same 7 facts mechanically from
// disk, against a fabricated fixture tree — never the real src/components/
// tree, so the expected output here is never a moving target.
// ----------------------------------------------------------------------

const tempDirs: string[] = [];

function makeFixtureDir() {
  const dir = mkdtempSync(path.join(tmpdir(), 'presence-fact-scanner-fixture-'));
  tempDirs.push(dir);
  return dir;
}

function writeFile(rootDir: string, relPath: string, contents = '') {
  const fullPath = path.join(rootDir, relPath);
  mkdirSync(path.dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, contents);
  return relPath;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

const COMPONENT_TSX_WITH_JSDOC = `
/**
 * FakeWidget — a fixture component used only by presence-fact-scanner.test.ts.
 */
export function FakeWidget() {
  return null;
}
`;

const COMPONENT_TSX_NO_JSDOC = `
// Just a plain comment, not a JSDoc block.
export function FakeWidget() {
  return null;
}
`;

const STORY_WITH_JSDOC = `
/** Storybook stories for FakeWidget. */
export const Default = {};
`;

const STORY_NO_JSDOC = `
// No JSDoc here.
export const Default = {};
`;

const ROADMAP_WITH_NO_OPEN_ROWS = `# FakeWidget — Roadmap

## Open improvements

| Task | Priority | Status |
| ---- | -------- | ------ |

None.

## Completed

| Task | Completed |
| ---- | --------- |
| Shipped | today |
`;

const ROADMAP_WITH_OPEN_ROWS = `# FakeWidget — Roadmap

## Open improvements

| Task | Priority | Status |
| ---- | -------- | ------ |
| Add a demo story | Low | ⬜ |

## Completed

None.
`;

/** Writes a fully compliant component folder (every one of the 7 facts
 * true) at `<root>/src/components/<folder>`, then returns its absolute path. */
function writeCompliantFolder(root: string, folder: string) {
  const base = `src/components/${folder}`;
  writeFile(root, `${base}/fake-widget.tsx`, COMPONENT_TSX_WITH_JSDOC);
  writeFile(root, `${base}/fake-widget.stories.tsx`, STORY_WITH_JSDOC);
  writeFile(root, `${base}/README.md`, '# FakeWidget\n');
  writeFile(root, `${base}/types.ts`, 'export interface FakeWidgetProps {}\n');
  writeFile(root, `${base}/roadmap.md`, ROADMAP_WITH_NO_OPEN_ROWS);
  return path.join(root, base);
}

const ROADMAP_DOC_MENTIONING_FAKE_WIDGET = 'Phase Z — FakeWidget ships as part of the fixture.';
const ROADMAP_DOC_NOT_MENTIONING_ANYTHING = 'Phase Z — nothing relevant to this fixture at all.';

describe('scanComponentPresence — fully compliant folder', () => {
  it('reports every fact as true', () => {
    const root = makeFixtureDir();
    const folderPath = writeCompliantFolder(root, 'material/fake-widget');

    const result = scanComponentPresence(folderPath, {
      roadmapDocText: ROADMAP_DOC_MENTIONING_FAKE_WIDGET,
    });

    expect(result).toEqual({
      built: true,
      readme: true,
      jsdoc: true,
      storyJsdoc: true,
      roadmap: true,
      roadmapDone: true,
      timeline: true,
    });
  });
});

describe('scanComponentPresence — one fact missing at a time', () => {
  it('built: false when no component .tsx exists (stories/test/defaults do not count)', () => {
    const root = makeFixtureDir();
    const folderPath = writeCompliantFolder(root, 'material/fake-widget');
    rmSync(path.join(folderPath, 'fake-widget.tsx'));
    // Leave behind only files Built must explicitly exclude.
    writeFile(root, 'src/components/material/fake-widget/fake-widget.test.tsx', 'export {};');
    writeFile(root, 'src/components/material/fake-widget/fake-widget.defaults.tsx', 'export {};');

    const result = scanComponentPresence(folderPath, {
      roadmapDocText: ROADMAP_DOC_MENTIONING_FAKE_WIDGET,
    });

    expect(result.built).toBe(false);
    // roadmapDone requires built too, per its AND-condition.
    expect(result.roadmapDone).toBe(false);
  });

  it('readme: false when README.md is absent', () => {
    const root = makeFixtureDir();
    const folderPath = writeCompliantFolder(root, 'material/fake-widget');
    rmSync(path.join(folderPath, 'README.md'));

    const result = scanComponentPresence(folderPath, {
      roadmapDocText: ROADMAP_DOC_MENTIONING_FAKE_WIDGET,
    });

    expect(result.readme).toBe(false);
  });

  it('jsdoc: false when neither the component .tsx nor types.ts carries a /** */ block', () => {
    const root = makeFixtureDir();
    const folderPath = writeCompliantFolder(root, 'material/fake-widget');
    writeFile(root, 'src/components/material/fake-widget/fake-widget.tsx', COMPONENT_TSX_NO_JSDOC);
    writeFile(
      root,
      'src/components/material/fake-widget/types.ts',
      'export interface FakeWidgetProps {}\n'
    );

    const result = scanComponentPresence(folderPath, {
      roadmapDocText: ROADMAP_DOC_MENTIONING_FAKE_WIDGET,
    });

    expect(result.jsdoc).toBe(false);
  });

  it('storyJsdoc: false when there is no .stories.tsx at all', () => {
    const root = makeFixtureDir();
    const folderPath = writeCompliantFolder(root, 'material/fake-widget');
    rmSync(path.join(folderPath, 'fake-widget.stories.tsx'));

    const result = scanComponentPresence(folderPath, {
      roadmapDocText: ROADMAP_DOC_MENTIONING_FAKE_WIDGET,
    });

    expect(result.storyJsdoc).toBe(false);
  });

  it('storyJsdoc: false when a .stories.tsx exists but carries no JSDoc block', () => {
    const root = makeFixtureDir();
    const folderPath = writeCompliantFolder(root, 'material/fake-widget');
    writeFile(root, 'src/components/material/fake-widget/fake-widget.stories.tsx', STORY_NO_JSDOC);

    const result = scanComponentPresence(folderPath, {
      roadmapDocText: ROADMAP_DOC_MENTIONING_FAKE_WIDGET,
    });

    expect(result.storyJsdoc).toBe(false);
  });

  it('roadmap: false when roadmap.md is absent (and roadmapDone follows it to false)', () => {
    const root = makeFixtureDir();
    const folderPath = writeCompliantFolder(root, 'material/fake-widget');
    rmSync(path.join(folderPath, 'roadmap.md'));

    const result = scanComponentPresence(folderPath, {
      roadmapDocText: ROADMAP_DOC_MENTIONING_FAKE_WIDGET,
    });

    expect(result.roadmap).toBe(false);
    expect(result.roadmapDone).toBe(false);
  });

  it('roadmapDone: false when built and roadmap.md exists but "Open improvements" has a pending row', () => {
    const root = makeFixtureDir();
    const folderPath = writeCompliantFolder(root, 'material/fake-widget');
    writeFile(root, 'src/components/material/fake-widget/roadmap.md', ROADMAP_WITH_OPEN_ROWS);

    const result = scanComponentPresence(folderPath, {
      roadmapDocText: ROADMAP_DOC_MENTIONING_FAKE_WIDGET,
    });

    expect(result.roadmap).toBe(true);
    expect(result.built).toBe(true);
    expect(result.roadmapDone).toBe(false);
  });

  it("timeline: false when none of the folder's exported names appear in docs/roadmap.md", () => {
    const root = makeFixtureDir();
    const folderPath = writeCompliantFolder(root, 'material/fake-widget');

    const result = scanComponentPresence(folderPath, {
      roadmapDocText: ROADMAP_DOC_NOT_MENTIONING_ANYTHING,
    });

    expect(result.timeline).toBe(false);
  });
});

describe('scanComponentPresence — nested sub-component (one level deep)', () => {
  it('scans the parent folder without bleeding in facts from its nested child folder', () => {
    const root = makeFixtureDir();
    // Parent: an "index/types only" folder — no .tsx of its own, so Built
    // (and therefore Roadmap done) must be false, even though a nested
    // child folder one level down has its own fully-built component.
    const parentBase = 'src/components/material/fake-parent';
    writeFile(root, `${parentBase}/README.md`, '# FakeParent\n');
    writeFile(
      root,
      `${parentBase}/roadmap.md`,
      ROADMAP_WITH_OPEN_ROWS // deliberately has a pending row of its own
    );
    const parentPath = path.join(root, parentBase);

    // Child: nested one level inside the parent's own folder, fully compliant.
    const childPath = writeCompliantFolder(root, 'material/fake-parent/fake-child');

    const parentResult = scanComponentPresence(parentPath, {
      roadmapDocText: ROADMAP_DOC_MENTIONING_FAKE_WIDGET,
    });
    expect(parentResult).toEqual({
      built: false, // must NOT pick up the child's fake-widget.tsx
      readme: true,
      jsdoc: false, // must NOT be satisfied by the child's types.ts
      storyJsdoc: false, // must NOT pick up the child's .stories.tsx
      roadmap: true,
      roadmapDone: false, // built is false, so the AND-condition fails regardless
      timeline: false, // no exported name of its own to search for
    });

    const childResult = scanComponentPresence(childPath, {
      roadmapDocText: ROADMAP_DOC_MENTIONING_FAKE_WIDGET,
    });
    expect(childResult).toEqual({
      built: true,
      readme: true,
      jsdoc: true,
      storyJsdoc: true,
      roadmap: true,
      roadmapDone: true,
      timeline: true,
    });
  });
});
