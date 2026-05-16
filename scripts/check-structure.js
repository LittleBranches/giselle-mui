#!/usr/bin/env node
/**
 * check-structure.js
 *
 * Enforces the component folder structure convention: every component must live
 * in its own named subfolder inside its layer group. No .ts/.tsx files are
 * permitted directly under a layer or category folder.
 *
 * Layer groups under src/components/:
 *   material/surfaces  material/data-display  material/layout
 *   material/navigation  material/input
 *   chart  motion  section  theming
 *
 *   ✅  src/components/material/surfaces/card/metric/metric-card.tsx
 *   ❌  src/components/material/surfaces/card/metric-card.tsx
 *   ❌  src/components/material/surfaces/metric-card.tsx
 *
 * Exit codes: 0 = all OK, 1 = violations found.
 */

import { readdirSync, statSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, '../src');

// Layer and category folders where component files must NOT sit flat.
// Every .ts/.tsx file found directly in one of these folders is a violation.
// The rule: every component lives in its own named subfolder at least one level deeper.
const PARENT_DIRS_TO_CHECK = [
  'components/chart',
  'components/material',
  'components/material/surfaces',
  'components/material/surfaces/card',
  'components/material/data-display',
  'components/material/data-display/icon',
  'components/material/layout',
  'components/material/navigation',
  'components/material/input',
  'components/motion',
  'components/motion/variants',
  'components/section',
  'components/section/faq',
  'components/section/hero',
  'components/section/timeline',
  'components/theming',
];

const violations = [];

// Files that are legitimate at any layer level (not component files).
const ALLOWED_FLAT_FILES = new Set(['index.ts', 'index.tsx', 'types.ts']);
const isAllowedFlat = (filename) =>
  ALLOWED_FLAT_FILES.has(filename) ||
  filename.startsWith('use-') || // shared hooks
  filename.endsWith('.stories.tsx'); // group-level cross-component stories

for (const domain of PARENT_DIRS_TO_CHECK) {
  const domainDir = path.join(srcDir, domain);
  if (!existsSync(domainDir)) continue;

  for (const entry of readdirSync(domainDir)) {
    if (!entry.endsWith('.tsx') && !entry.endsWith('.ts')) continue;
    if (isAllowedFlat(entry)) continue;

    const fullPath = path.join(domainDir, entry);
    if (statSync(fullPath).isFile()) {
      violations.push(`src/${domain}/${entry}`);
    }
  }
}

if (violations.length > 0) {
  console.error('\n❌  Structure check failed — flat component files found:\n');
  for (const v of violations) {
    console.error(`   ${v}`);
  }
  console.error(
    '\nEach component must live in its own named subfolder:\n' +
      '   ✅  src/components/material/surfaces/card/<name>/<name>.tsx\n' +
      '   ❌  src/components/material/surfaces/card/<name>.tsx\n' +
      '\nSee File structure per component in .github/copilot-instructions.md'
  );
  process.exit(1);
} else {
  console.log('✓ Structure check passed — no flat component files');
  process.exit(0);
}
