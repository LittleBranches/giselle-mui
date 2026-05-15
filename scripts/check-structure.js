#!/usr/bin/env node
/**
 * check-structure.js
 *
 * Enforces the component folder structure convention for domain parent folders.
 *
 * Multi-component domain folders (src/cards/, src/icons/, etc.) must not contain
 * .tsx or .ts files directly — every component must live in its own named subfolder:
 *
 *   ✅  src/cards/metric/metric-card.tsx
 *   ❌  src/cards/metric-card.tsx
 *
 * Single-component folders (src/accordion/) and utility folders (src/utils/) are
 * excluded from this check.
 *
 * Exit codes: 0 = all OK, 1 = violations found.
 */

import { readdirSync, statSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, '../src');

// Domain parent folders where components must be in named subfolders.
// Each entry is checked for flat .ts/.tsx files (violations).
const PARENT_DIRS_TO_CHECK = [
  'cards',
  'icons',
  'inputs',
  'layout',
  'navigation',
  'text',
  'theming',
];

const violations = [];

for (const domain of PARENT_DIRS_TO_CHECK) {
  const domainDir = path.join(srcDir, domain);
  if (!existsSync(domainDir)) continue;

  for (const entry of readdirSync(domainDir)) {
    if (!entry.endsWith('.tsx') && !entry.endsWith('.ts')) continue;

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
      '   ✅  src/cards/<name>/<name>.tsx\n' +
      '   ❌  src/cards/<name>.tsx\n' +
      '\nSee File structure per component in .github/copilot-instructions.md'
  );
  process.exit(1);
} else {
  console.log('✓ Structure check passed — no flat component files');
  process.exit(0);
}
