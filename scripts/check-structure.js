#!/usr/bin/env node
/**
 * check-structure.js
 *
 * Enforces the component folder structure convention:
 *
 *   - No .tsx or .ts component files directly under src/components/
 *     Every component must live in its own named subfolder:
 *       ✅  src/components/giselle-icon/giselle-icon.tsx
 *       ✅  src/components/card/metric/metric-card.tsx
 *       ❌  src/components/giselle-icon.tsx
 *
 * This catches the pattern that existed before the refactor/structure-and-extract
 * branch, where components lived flat in src/components/<name>.tsx.
 *
 * The check is intentionally narrow — it only validates depth, not naming.
 * Naming conventions (e.g. <name>/<name>.tsx) are documented in copilot-instructions.md
 * and enforced by code review.
 *
 * Exit codes: 0 = all OK, 1 = violations found.
 */

import { readdirSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.resolve(__dirname, '../src/components');

// Files allowed directly under src/components/ (none at the moment, but an
// explicit allowlist makes the intent clear and prevents false positives).
const ALLOWED_FLAT = new Set([
  // e.g. 'index.ts' if a barrel ever lives here — currently src/index.ts is used
]);

const violations = [];

for (const entry of readdirSync(componentsDir)) {
  // Only flag .tsx and .ts files — ignore directories and other file types.
  if (!entry.endsWith('.tsx') && !entry.endsWith('.ts')) continue;
  if (ALLOWED_FLAT.has(entry)) continue;

  const fullPath = path.join(componentsDir, entry);
  if (statSync(fullPath).isFile()) {
    violations.push(`src/components/${entry}`);
  }
}

if (violations.length > 0) {
  console.error('\n❌  Structure check failed — flat component files found:\n');
  for (const v of violations) {
    console.error(`   ${v}`);
  }
  console.error(
    '\nEach component must live in its own named subfolder:\n' +
      '   ✅  src/components/<name>/<name>.tsx\n' +
      '   ❌  src/components/<name>.tsx\n' +
      '\nSee File structure per component in .github/copilot-instructions.md'
  );
  process.exit(1);
} else {
  console.log('✓ Structure check passed — no flat component files');
  process.exit(0);
}
