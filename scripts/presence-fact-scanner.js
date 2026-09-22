#!/usr/bin/env node
/**
 * presence-fact-scanner.js
 *
 * Mechanically computes the 7 file-presence facts that
 * docs/component-compliance.md's table tracks per component folder — Built /
 * README / JSDoc / Story JSDoc / Roadmap / Roadmap done / Timeline (see that
 * file's "How each column is derived" section for the exact wording each
 * check below implements, and `PRESENCE_FACT_COLUMNS` below for the short
 * header code each fact renders under).
 *
 * Every fact here is a plain mechanical check with no judgment call: file
 * existence, a `/** *\/` block's presence, a roadmap's emoji markers, or a
 * name's appearance in another file's text. `update-component-compliance.js`
 * (in this same folder) is what wires this module's output into
 * docs/component-compliance.md's actual table.
 *
 * Ported from giselle-mui-poc's scripts/dod-docs/presence-fact-scanner/
 * presence-fact-scanner.ts — logic unchanged, adapted only to
 * this repo's plain-JS script convention (no separate .types.ts file). This
 * repo does have its own `docs/component-inventory.md` (DoD/best-practices
 * scores), but unlike poc's version it has no per-criterion checkmark
 * columns for this module to stay decoupled from — see
 * `update-component-compliance.js`'s own header comment for how the two
 * files divide responsibility in this repo.
 *
 * Usage (optional CLI, for manual spot-checking — the importable
 * `scanComponentPresence` function below is the actual deliverable):
 *   node scripts/presence-fact-scanner.js --folder <path> [--json] [--help]
 */

import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseArgs } from 'node:util';

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(import.meta.dirname, '..');
const ROADMAP_DOC_PATH = path.join(REPO_ROOT, 'docs/roadmap.md');

const USAGE = `Usage: node scripts/presence-fact-scanner.js --folder <path> [--json] [--help]

Mechanically scans one component folder and reports its 7 file-presence
facts (Built / README / JSDoc / Story JSDoc / Roadmap / Roadmap done /
Timeline) — the same facts docs/component-compliance.md's table tracks.
This is a spot-check CLI only; the importable scanComponentPresence()
function is the actual deliverable (see this file's header comment).

  --folder <path>   Component folder to scan (relative to the repo root,
                     or absolute).
  --json            Emit machine-readable JSON instead of a human summary.
  --help            Print this usage and exit 0.
`;

// ----------------------------------------------------------------------

/**
 * The one canonical mapping from each presence-fact key to the short header
 * code it renders under in docs/component-compliance.md's table
 * (`update-component-compliance.js` renders these). Order here is the
 * column order in the rendered table.
 */
export const PRESENCE_FACT_COLUMNS = [
  { key: 'built', code: 'B', label: 'Built' },
  { key: 'readme', code: 'R', label: 'README' },
  { key: 'jsdoc', code: 'J', label: 'JSDoc' },
  { key: 'storyJsdoc', code: 'SJ', label: 'Story JSDoc' },
  { key: 'roadmap', code: 'Rm', label: 'Roadmap' },
  { key: 'roadmapDone', code: 'RD', label: 'Roadmap done' },
  { key: 'timeline', code: 'T', label: 'Timeline' },
];

// ----------------------------------------------------------------------
// Internals — every helper below is a single mechanical check (file
// existence, regex presence, or substring search), never a heuristic.

const JSDOC_BLOCK_RE = /\/\*\*[\s\S]*?\*\//;

/** Matches a top-level `export function/const/class Name` declaration. This
 * repo's convention is PascalCase component names and camelCase helper
 * exports, so requiring a capitalised first letter mechanically isolates
 * component names from co-located utility exports in the same file. */
const EXPORTED_NAME_RE = /export\s+(?:default\s+)?(?:function|const|class)\s+([A-Z][A-Za-z0-9]*)\b/g;

const OPEN_IMPROVEMENTS_HEADING = '## Open improvements';

/** @param {string} folderPath */
function listDirectFiles(folderPath) {
  return readdirSync(folderPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);
}

/** @param {string} filePath */
function readTextSafe(filePath) {
  try {
    return readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

/** Built excludes `.stories.tsx`, `.test.tsx`, and `.defaults.tsx` — matching
 * docs/component-compliance.md's own "Built" column definition verbatim.
 * @param {string} name */
function isBuiltComponentFile(name) {
  return (
    name.endsWith('.tsx') &&
    !name.endsWith('.stories.tsx') &&
    !name.endsWith('.test.tsx') &&
    !name.endsWith('.defaults.tsx')
  );
}

/** @param {string} text */
function hasJsDocBlock(text) {
  return JSDOC_BLOCK_RE.test(text);
}

/** @param {string} text */
function extractExportedComponentNames(text) {
  const names = new Set();
  for (const match of text.matchAll(EXPORTED_NAME_RE)) {
    const name = match[1];
    if (name) names.add(name);
  }
  return [...names];
}

/** Slices out the "## Open improvements" section (up to the next `## `
 * heading, or end of file) and reports whether it contains any ⬜ / 🔄
 * marker. A roadmap with no such section at all has, mechanically, no rows
 * to be pending — so it counts as "no open rows" rather than an error.
 * @param {string} roadmapText */
function openImprovementsSectionHasNoOpenRows(roadmapText) {
  const headingIdx = roadmapText.indexOf(OPEN_IMPROVEMENTS_HEADING);
  if (headingIdx === -1) return true;

  const afterHeading = roadmapText.slice(headingIdx + OPEN_IMPROVEMENTS_HEADING.length);
  const nextHeadingMatch = afterHeading.match(/\n##\s/);
  const section =
    nextHeadingMatch && nextHeadingMatch.index !== undefined
      ? afterHeading.slice(0, nextHeadingMatch.index)
      : afterHeading;

  return !section.includes('⬜') && !section.includes('🔄');
}

/** @param {{ roadmapDocText?: string }} options */
function readRoadmapDocText(options) {
  return options.roadmapDocText ?? readTextSafe(ROADMAP_DOC_PATH);
}

// ----------------------------------------------------------------------

/**
 * Mechanically computes the 7 file-presence facts for one component folder
 * — the same facts docs/component-compliance.md's table tracks. Only looks
 * at files directly inside `folderPath`; never recurses into nested
 * sub-component subfolders, so scanning a parent folder never picks up a
 * nested child's files (or vice versa).
 *
 * @param {string} folderPath
 * @param {{ roadmapDocText?: string }} [options]
 */
export function scanComponentPresence(folderPath, options = {}) {
  const files = listDirectFiles(folderPath);

  const componentFiles = files.filter(isBuiltComponentFile);
  const built = componentFiles.length > 0;

  const readme = files.includes('README.md');

  const componentText = componentFiles
    .map((name) => readTextSafe(path.join(folderPath, name)))
    .join('\n');
  const typesText = files.includes('types.ts') ? readTextSafe(path.join(folderPath, 'types.ts')) : '';
  const jsdoc = hasJsDocBlock(componentText) || hasJsDocBlock(typesText);

  const storyFiles = files.filter((name) => name.endsWith('.stories.tsx'));
  const storyJsdoc =
    storyFiles.length > 0 &&
    storyFiles.some((name) => hasJsDocBlock(readTextSafe(path.join(folderPath, name))));

  const roadmap = files.includes('roadmap.md');
  const roadmapText = roadmap ? readTextSafe(path.join(folderPath, 'roadmap.md')) : '';
  const roadmapDone = built && roadmap && openImprovementsSectionHasNoOpenRows(roadmapText);

  const exportedNames = extractExportedComponentNames(componentText);
  const roadmapDocText = readRoadmapDocText(options);
  const timeline =
    exportedNames.length > 0 &&
    roadmapDocText.length > 0 &&
    exportedNames.some((name) => roadmapDocText.includes(name));

  return { built, readme, jsdoc, storyJsdoc, roadmap, roadmapDone, timeline };
}

// ----------------------------------------------------------------------
// Optional CLI entrypoint — manual spot-checking only, never imported by
// presence-fact-scanner.test.ts. Guarded so `import { scanComponentPresence }`
// from another module (or a test) never triggers this.

/** @param {string} folderPath @param {ReturnType<typeof scanComponentPresence>} facts */
function printHumanSummary(folderPath, facts) {
  const mark = (v) => (v ? '✅' : '❌');
  console.log(`Presence facts for ${folderPath}`);
  console.log(`  Built:         ${mark(facts.built)}`);
  console.log(`  README:        ${mark(facts.readme)}`);
  console.log(`  JSDoc:         ${mark(facts.jsdoc)}`);
  console.log(`  Story JSDoc:   ${mark(facts.storyJsdoc)}`);
  console.log(`  Roadmap:       ${mark(facts.roadmap)}`);
  console.log(`  Roadmap done:  ${mark(facts.roadmapDone)}`);
  console.log(`  Timeline:      ${mark(facts.timeline)}`);
}

function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      folder: { type: 'string' },
      json: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false },
    },
  });

  if (values.help) {
    process.stdout.write(USAGE);
    return 0;
  }

  if (!values.folder) {
    process.stderr.write(USAGE);
    return 1;
  }

  const folderPath = path.resolve(REPO_ROOT, values.folder);
  const facts = scanComponentPresence(folderPath);

  if (values.json) {
    process.stdout.write(JSON.stringify({ folder: values.folder, ...facts }) + '\n');
  } else {
    printHumanSummary(values.folder, facts);
  }

  return 0;
}

if (path.resolve(process.argv[1] ?? '') === __filename) {
  process.exitCode = main();
}
