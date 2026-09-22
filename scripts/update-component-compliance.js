#!/usr/bin/env node
/**
 * update-component-compliance.js
 *
 * Regenerates docs/component-compliance.md's own table by re-scanning every
 * tracked folder under src/components/ with `scanComponentPresence()` (see
 * ./presence-fact-scanner.js) and rewriting the table's Built / README /
 * JSDoc / Story JSDoc / Roadmap / Roadmap done / Timeline columns from that
 * fresh scan. This is the automation Step 14b of
 * docs/components/cleanup-workflow.md now points at, replacing what used to
 * be a manual, easy-to-forget checklist item (see that step for context on
 * why it went unmaintained before).
 *
 * This is the giselle-mui-specific counterpart to an internal sibling
 * tool's own merge/wiring script — NOT a port of that script. That tool's
 * script is tightly coupled to a different, more elaborate compliance-table
 * shape (dozens of hand-audited per-criterion columns, a provisional-score
 * relabeling step, and a check that decides whether an entire row's
 * hand-audited fields must be left untouched). docs/component-compliance.md
 * has none of that — it has no scored or per-criterion columns at all, so
 * there is nothing for that kind of check to gate. (This repo does have its
 * own, separate `docs/component-inventory.md` with DoD/best-practices
 * scores — see that file's own intro for how it divides responsibility from
 * component-compliance.md. This script never reads or writes it.) The one
 * column here that IS hand-maintained free text is **Notes** (e.g. "unbuilt
 * scaffold", "no stories", "shipped, no README; no stories") — this
 * script's own equivalent of preserving hand-audited fields is simpler:
 * every existing row's Notes cell is always carried forward verbatim, keyed
 * by folder path, and never regenerated from a formula. Component and Layer
 * are also derived fresh from the folder path every run (Layer is just the
 * folder's first path segment) since they're always mechanically
 * recomputable and never hand-edited independently of the folder itself.
 *
 * Folder tracking mirrors this doc's own stated rule (see its intro banner):
 * "Every folder that owns a README.md, types.ts, roadmap.md, or a component
 * .tsx gets a row." This does NOT exclude `motion/variants/*` — giselle-mui's
 * own table already tracks `motion/variants` rows, so excluding that subtree
 * would silently drop real rows. It DOES exclude `__fixtures__/` folders
 * (Storybook/demo fixture assets — e.g.
 * `src/components/section/feature-flow/__fixtures__/`, which holds only
 * decorator components and images used by that section's own stories, not a
 * shipped or planned library component) — confirmed against this repo's
 * real tree.
 *
 * A folder tracked in the existing table but no longer found on disk is
 * dropped (it no longer exists to have a row). A folder found on disk with
 * no existing row (new since the last run) gets a blank Notes cell — never
 * inferred prose.
 *
 * This script deliberately does NOT touch the "## Totals" table or the
 * "_Last full regen_" banner line above the table — Step 14b's own
 * checklist never asked a human to update those either, only the table
 * itself; keeping that scope identical avoids this automation silently
 * doing more than the manual step it replaces.
 *
 * Usage: node scripts/update-component-compliance.js [--help]
 *   (no flags needed for a normal run — re-running it re-scans presence
 *   facts for every tracked folder against the real disk tree; existing
 *   Notes text is always kept)
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseArgs } from 'node:util';
import { scanComponentPresence, isBuiltComponentFile } from './presence-fact-scanner.js';

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(import.meta.dirname, '..');
const COMPLIANCE_PATH = path.join(REPO_ROOT, 'docs/component-compliance.md');
const COMPONENTS_ROOT = path.join(REPO_ROOT, 'src/components');

const USAGE = `Usage: node scripts/update-component-compliance.js [--help]

Re-scans every tracked folder under src/components/ and rewrites
docs/component-compliance.md's Built / README / JSDoc / Story JSDoc /
Roadmap / Roadmap done / Timeline columns from the real, current disk
state. Each row's own hand-written Notes cell is preserved verbatim. Does
not touch the "## Totals" counts or the "Last full regen" banner — update
those by hand if this run changed the tracked folder count.

  --help   Print this usage and exit 0.
`;
const ROADMAP_DOC_PATH = path.join(REPO_ROOT, 'docs/roadmap.md');

const TABLE_HEADER_LABELS = [
  'Component',
  'Layer',
  'Built',
  'README',
  'JSDoc',
  'Story JSDoc',
  'Roadmap',
  'Roadmap done',
  'Timeline',
  'Notes',
];

// ----------------------------------------------------------------------
// Parsing

/** Strips backticks and a trailing slash from a folder-path cell — the
 * table's Component cells are plain (no backticks) today, but this stays
 * defensive against either style. @param {string} raw */
export function normalizeFolder(raw) {
  return raw
    .trim()
    .replace(/^`|`$/g, '')
    .replace(/\/$/, '')
    .trim();
}

/** Splits one markdown table row (`| a | b | c |`) into trimmed cells.
 * @param {string} line */
export function splitRow(line) {
  const inner = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return inner.split('|').map((cell) => cell.trim());
}

/** @param {string} cell */
function isCheckMark(cell) {
  return cell === '✅';
}

/**
 * Finds the markdown table whose header row's leading cells exactly match
 * `expectedHeaderCells` (in order) and returns `{ headerIdx, endIdx }` — the
 * line index of the header row and the (exclusive) end of its data rows.
 * docs/component-compliance.md has two tables ("## Totals" and the main
 * component table); matching on the full leading-cell sequence (not a
 * substring) is what tells them apart.
 * @param {string[]} lines @param {string[]} expectedHeaderCells
 */
function findTableBounds(lines, expectedHeaderCells) {
  const headerIdx = lines.findIndex((line) => {
    if (!line.trim().startsWith('|')) return false;
    const cells = splitRow(line);
    return expectedHeaderCells.every((expected, i) => cells[i] === expected);
  });
  if (headerIdx === -1) {
    throw new Error(`Could not find a table header matching ${JSON.stringify(expectedHeaderCells)}`);
  }
  let endIdx = headerIdx + 2; // skip header + separator row
  while (endIdx < lines.length && lines[endIdx]?.trim().startsWith('|')) {
    endIdx++;
  }
  return { headerIdx, endIdx };
}

/**
 * Parses docs/component-compliance.md's existing table into rows, keyed by
 * folder path. @param {string} markdown
 */
export function parseComplianceTable(markdown) {
  const lines = markdown.split('\n');
  const { headerIdx, endIdx } = findTableBounds(lines, ['Component', 'Layer', 'Built']);
  const rows = [];
  for (let i = headerIdx + 2; i < endIdx; i++) {
    const cells = splitRow(lines[i]);
    rows.push({
      folder: normalizeFolder(cells[0] ?? ''),
      layer: cells[1] ?? '',
      built: isCheckMark(cells[2] ?? ''),
      readme: isCheckMark(cells[3] ?? ''),
      jsdoc: isCheckMark(cells[4] ?? ''),
      storyJsdoc: isCheckMark(cells[5] ?? ''),
      roadmap: isCheckMark(cells[6] ?? ''),
      roadmapDone: isCheckMark(cells[7] ?? ''),
      timeline: isCheckMark(cells[8] ?? ''),
      notes: cells[9] ?? '',
    });
  }
  return rows;
}

// ----------------------------------------------------------------------
// Folder discovery — the only part of this module (besides main()) that
// touches disk.

/**
 * Mirrors docs/component-compliance.md's own stated tracking rule verbatim:
 * a folder gets a row if it owns a README.md, types.ts, roadmap.md, or a
 * component .tsx of its own. Reuses `isBuiltComponentFile` from
 * ./presence-fact-scanner.js — the same "built" definition, one source of
 * truth. @param {{ name: string; isDirectory: boolean }[]} entries
 */
export function isTrackedComponentFolder(entries) {
  const files = entries.filter((e) => !e.isDirectory).map((e) => e.name);
  return (
    files.includes('README.md') ||
    files.includes('types.ts') ||
    files.includes('roadmap.md') ||
    files.some(isBuiltComponentFile)
  );
}

/** True for a `__fixtures__` folder itself, or anything nested under one.
 * @param {string} relDir */
function isFixturesFolder(relDir) {
  return relDir === '__fixtures__' || relDir.includes('/__fixtures__');
}

/** @param {string} dirPath */
function listEntries(dirPath) {
  return readdirSync(dirPath, { withFileTypes: true }).map((entry) => ({
    name: entry.name,
    isDirectory: entry.isDirectory(),
  }));
}

/**
 * Walks `componentsRoot` recursively and returns the sorted relative paths
 * (posix-style) of every folder that passes `isTrackedComponentFolder()`.
 * Recurses into every folder regardless of whether that folder itself is
 * tracked, since an untracked grouping folder can still contain tracked
 * children. @param {string} componentsRoot
 */
export function discoverComponentFolders(componentsRoot) {
  const found = [];

  function walk(absDir, relDir) {
    if (isFixturesFolder(relDir)) return;

    const entries = listEntries(absDir);
    if (relDir !== '' && isTrackedComponentFolder(entries)) {
      found.push(relDir);
    }
    for (const entry of entries) {
      if (!entry.isDirectory) continue;
      const childRel = relDir === '' ? entry.name : `${relDir}/${entry.name}`;
      walk(path.join(absDir, entry.name), childRel);
    }
  }

  walk(componentsRoot, '');
  return found.sort();
}

// ----------------------------------------------------------------------
// Row building — pure given its inputs, except for the disk scan each row
// itself performs via scanComponentPresence().

/** @param {string} folder */
export function deriveLayerFromFolder(folder) {
  return folder.split('/')[0] ?? '';
}

/**
 * Builds every tracked folder's final row: fresh presence facts always, the
 * folder's own existing Notes cell carried forward verbatim when a row for
 * it already exists (blank otherwise — never inferred prose), and
 * Component/Layer always freshly derived from the folder path.
 *
 * @param {ReturnType<typeof parseComplianceTable>} existingRows
 * @param {string[]} trackedFolders
 * @param {string} roadmapDocText
 * @param {string} [componentsRoot]
 */
export function buildFinalRows(
  existingRows,
  trackedFolders,
  roadmapDocText,
  componentsRoot = COMPONENTS_ROOT
) {
  const existingByFolder = new Map(existingRows.map((row) => [row.folder, row]));

  return trackedFolders.map((folder) => {
    const absFolder = path.join(componentsRoot, folder);
    const presence = scanComponentPresence(absFolder, { roadmapDocText });
    const existing = existingByFolder.get(folder);

    return {
      folder,
      layer: deriveLayerFromFolder(folder),
      notes: existing?.notes ?? '',
      ...presence,
    };
  });
}

// ----------------------------------------------------------------------
// Rendering

/** @param {{ built: boolean; readme: boolean; jsdoc: boolean; storyJsdoc: boolean; roadmap: boolean; roadmapDone: boolean; timeline: boolean; folder: string; layer: string; notes: string }[]} rows */
export function renderComplianceTable(rows) {
  const mark = (v) => (v ? '✅' : '❌');
  const bodyRows = rows.map((row) => [
    row.folder,
    row.layer,
    mark(row.built),
    mark(row.readme),
    mark(row.jsdoc),
    mark(row.storyJsdoc),
    mark(row.roadmap),
    mark(row.roadmapDone),
    mark(row.timeline),
    row.notes,
  ]);

  const header = `| ${TABLE_HEADER_LABELS.join(' | ')} |`;
  const separator = `| ${TABLE_HEADER_LABELS.map(() => '---').join(' | ')} |`;
  const body = bodyRows.map((cells) => `| ${cells.join(' | ')} |`).join('\n');
  return `${header}\n${separator}\n${body}`;
}

function replaceComplianceTable(complianceMarkdown, tableMarkdown) {
  const lines = complianceMarkdown.split('\n');
  const { headerIdx, endIdx } = findTableBounds(lines, ['Component', 'Layer', 'Built']);
  const before = lines.slice(0, headerIdx);
  const after = lines.slice(endIdx);
  return [...before, tableMarkdown, ...after].join('\n');
}

// ----------------------------------------------------------------------
// Production run

function loadFile(filePath) {
  return readFileSync(filePath, 'utf-8');
}

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: { help: { type: 'boolean', default: false } },
  });

  if (values.help) {
    process.stdout.write(USAGE);
    return 0;
  }

  const complianceMarkdown = loadFile(COMPLIANCE_PATH);
  const roadmapDocText = loadFile(ROADMAP_DOC_PATH);

  const existingRows = parseComplianceTable(complianceMarkdown);
  const trackedFolders = discoverComponentFolders(COMPONENTS_ROOT);

  const finalRows = buildFinalRows(existingRows, trackedFolders, roadmapDocText);
  const tableMarkdown = renderComplianceTable(finalRows);
  const updatedCompliance = replaceComplianceTable(complianceMarkdown, tableMarkdown);

  writeFileSync(COMPLIANCE_PATH, updatedCompliance, 'utf-8');
  process.stdout.write(
    `✓ wrote ${path.relative(REPO_ROOT, COMPLIANCE_PATH)} (${finalRows.length} rows)\n`
  );
  process.stdout.write(
    '  note: the "## Totals" counts and "Last full regen" banner above the table are not auto-updated — update them by hand if this run changed the folder count.\n'
  );
  return 0;
}

if (path.resolve(process.argv[1] ?? '') === __filename) {
  main().then((code) => {
    process.exitCode = code;
  });
}
