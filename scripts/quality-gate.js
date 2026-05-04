#!/usr/bin/env node
/**
 * quality-gate.js
 *
 * Runs all quality checks for giselle-mui.
 * Developers can run this locally at any time without committing anything:
 *
 *   npm run check         — auto-fix trivial issues, then run all checks
 *   npm run check:verify  — read-only checks only (no auto-fix)
 *
 * This same script is called by:
 *   - .githooks/pre-push  (before every push)
 *   - .github/workflows/ci.yml  (CI)
 *
 * Checks performed (in order):
 *   0. Structure — no flat .tsx/.ts files directly under src/components/
 *   1. Prettier — format check / auto-fix
 *   2. ESLint   — covers: react-hooks, unused-imports, TypeScript rules
 *   3. TypeScript — tsc --noEmit
 *   4. Vitest   — unit tests
 *   5. tsup build — ensures the library itself compiles and tree-shakes cleanly
 *   6. Storybook build — catches broken stories before they reach main
 *
 * Exit codes: 0 = all passed, 1 = at least one check failed.
 *
 * Flags:
 *   --fix     Auto-fix Prettier + ESLint before read-only checks (default in `npm run check`)
 *   --verify  Read-only mode — no auto-fix (default in pre-push hook and CI)
 *   --storybook  Force-include the Storybook build (always on in CI; opt-in locally)
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Config ─────────────────────────────────────────────────────────────────
const FIX_MODE = process.argv.includes('--fix');
const INCLUDE_STORYBOOK = process.argv.includes('--storybook') || process.env['CI'] === 'true';

const appDir = path.resolve(__dirname, '..');

// ── Helpers ────────────────────────────────────────────────────────────────

function run(label, cmd, { fatal = true } = {}) {
  console.log(`\n→ ${label}…`);
  try {
    execSync(cmd, { cwd: appDir, stdio: 'inherit' });
    console.log(`✓ ${label} passed`);
    return true;
  } catch {
    console.error(`\n❌  ${label} failed`);
    if (fatal) {
      process.exit(1);
    }
    return false;
  }
}

// ── Main ───────────────────────────────────────────────────────────────────

console.log('');
console.log('══════════════════════════════════════════════════════════');
console.log(' Quality gate — giselle-mui');
if (FIX_MODE) console.log(' Mode: auto-fix + verify');
else console.log(' Mode: verify only (use --fix to auto-fix)');
if (INCLUDE_STORYBOOK) console.log(' Storybook build: enabled');
console.log('══════════════════════════════════════════════════════════');

const failures = [];

// 0. Structure check (component folder convention — no flat .tsx under src/components/)
if (!run('Structure check', 'node scripts/check-structure.js', { fatal: false })) {
  failures.push(
    'Structure — flat component file(s) found under src/components/; move each into its own named subfolder'
  );
}

// 1. Prettier (format)
if (FIX_MODE) {
  // Auto-fix formatting first so it never blocks; result doesn't count as failure.
  run('Prettier auto-fix', 'npm run fm:fix', { fatal: false });
} else {
  if (!run('Prettier format check', 'npm run fm:check', { fatal: false })) {
    failures.push('Prettier — run `npm run fm:fix` to auto-fix');
  }
}

// 2. ESLint (covers: react-hooks, unused-imports, TypeScript rules)
// --max-warnings 0: treat warnings as errors so they can't silently pass the gate.
if (FIX_MODE) {
  run('ESLint auto-fix', 'npm run lint:fix', { fatal: false });
}
if (!run('ESLint (--max-warnings 0)', 'npm run lint -- --max-warnings 0', { fatal: false })) {
  failures.push(
    'ESLint — run `npm run lint:fix` to auto-fix, then fix remaining errors/warnings manually'
  );
}

// 3. TypeScript
if (!run('TypeScript (tsc --noEmit)', 'npx tsc --noEmit', { fatal: false })) {
  failures.push('TypeScript — fix all type errors above');
}

// 4. Tests
if (!run('Tests (vitest)', 'npm test', { fatal: false })) {
  failures.push('Tests — fix failing tests above');
}

// 5. tsup build (ensures the published package compiles + tree-shakes cleanly)
if (!run('tsup build', 'npm run build', { fatal: false })) {
  failures.push('tsup build — the library failed to compile; fix build errors above');
}

// 6. Storybook build (always on in CI; opt-in locally with --storybook flag)
// Catches broken story imports and missing component exports before merge.
if (INCLUDE_STORYBOOK) {
  if (!run('Storybook build', 'npm run build-storybook', { fatal: false })) {
    failures.push('Storybook build — fix broken stories above');
  }
}

// ── Summary ────────────────────────────────────────────────────────────────

console.log('');
console.log('══════════════════════════════════════════════════════════');

if (failures.length === 0) {
  console.log(' ✅  All checks passed');
  console.log('══════════════════════════════════════════════════════════');
  process.exit(0);
} else {
  console.error(` ❌  ${failures.length} check(s) failed:\n`);
  for (const f of failures) {
    console.error(`   • ${f}`);
  }
  console.log('══════════════════════════════════════════════════════════');
  process.exit(1);
}
