#!/usr/bin/env node
/**
 * quality-gate.js
 *
 * Runs all quality checks for giselle-mui.
 * Developers can run this locally at any time without committing anything:
 *
 *   npm run check               — auto-fix trivial issues, then run all checks
 *   npm run check:verify        — read-only full gate (no auto-fix)
 *   npm run check:verify:smart  — smart pre-push gate (skips untriggered heavy steps)
 *   npm run check:verify:full   — explicit full gate with Storybook
 *
 * This same script is called by:
 *   - .githooks/pre-push  (before every push — smart mode)
 *   - .github/workflows/ci.yml  (CI — always full gate)
 *
 * Checks performed (in order):
 *   0a. Banned content scan
 *   0b. Structure — no flat .tsx/.ts files directly under src/components/
 *   1.  Prettier — format check / auto-fix
 *   2.  ESLint   — covers: react-hooks, unused-imports, TypeScript rules
 *   3.  TypeScript — tsc --noEmit
 *   4.  Vitest   — unit tests (targeted in smart mode when ≤25 files changed)
 *   5.  tsup build — only when src/ or build config changed (smart mode)
 *   6.  Storybook build — only when stories or components changed (smart mode)
 *
 * Exit codes: 0 = all passed, 1 = at least one check failed.
 *
 * Flags:
 *   --fix          Auto-fix Prettier + ESLint before read-only checks (default in `npm run check`)
 *   --verify       Read-only mode — no auto-fix (default in pre-push hook and CI)
 *   --smart        Smart mode: skip heavy steps when not triggered by changed files
 *   --full         Force full gate regardless of changed files (overrides --smart)
 *   --storybook    Force-include the Storybook build (always on in CI; opt-in locally)
 *   --no-storybook Skip the Storybook build even in CI (used by the fast CI job)
 *   --log-metrics  Append per-run timing data to scripts/gate-timing.log
 *
 * Smart mode rules:
 *   - CI (process.env.CI=true) always runs the full gate regardless of --smart.
 *   - If diff resolution fails, falls back to the full gate.
 *   - >25 changed files → full test suite; ≤25 → targeted by co-located test files.
 *   - Core static checks (banned, structure, prettier, eslint, tsc) always run.
 */

import { appendFileSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolveChangedFiles, evaluateTriggers, resolveTargetedTests } from './smart-gate-core.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appDir = path.resolve(__dirname, '..');

// ── Flags ──────────────────────────────────────────────────────────────────

const FIX_MODE = process.argv.includes('--fix');
const SMART_FLAG = process.argv.includes('--smart') && !process.argv.includes('--full');
const LOG_METRICS = process.argv.includes('--log-metrics');
const INCLUDE_STORYBOOK =
  !process.argv.includes('--no-storybook') &&
  (process.argv.includes('--storybook') || process.env['CI'] === 'true');

// CI always runs the full gate — smart mode is for local pre-push only.
const IS_CI = process.env['CI'] === 'true';
const RUN_SMART = SMART_FLAG && !IS_CI;

// ── Telemetry ─────────────────────────────────────────────────────────────

const telemetry = {
  repo: 'giselle-mui',
  mode: RUN_SMART ? 'smart' : 'full',
  startTime: Date.now(),
  basis: 'full',
  changedFileCount: 0,
  steps:
    /** @type {Array<{name:string,status:string,duration?:number,result?:string,reason?:string}>} */ ([]),
  result: 'unknown',
};

// ── Helpers ────────────────────────────────────────────────────────────────

const failures = [];

/** @param {string} label @param {string} cmd @param {{ fatal?: boolean }} [opts] */
function run(label, cmd, { fatal = true } = {}) {
  const start = Date.now();
  console.log(`\n→ ${label}…`);
  try {
    execSync(cmd, { cwd: appDir, stdio: 'inherit' });
    const duration = Date.now() - start;
    console.log(`✓ ${label} passed (${duration}ms)`);
    telemetry.steps.push({ name: label, status: 'executed', duration, result: 'pass' });
    return true;
  } catch {
    const duration = Date.now() - start;
    console.error(`\n❌  ${label} failed (${duration}ms)`);
    telemetry.steps.push({ name: label, status: 'executed', duration, result: 'fail' });
    if (fatal) process.exit(1);
    return false;
  }
}

/** @param {string} label @param {string} reason */
function skip(label, reason) {
  console.log(`\n⏭  ${label} — skipped: ${reason}`);
  telemetry.steps.push({ name: label, status: 'skipped', reason });
}

// ── Resolve diff ───────────────────────────────────────────────────────────

/** @type {{ tests: 'all' | 'targeted' | 'none', build: boolean, storybook: boolean }} */
let triggers = { tests: 'all', build: true, storybook: INCLUDE_STORYBOOK };
/** @type {string[] | null} */
let changedFiles = null;

if (RUN_SMART) {
  const { files, basis } = resolveChangedFiles(appDir);
  telemetry.basis = basis;
  changedFiles = files;

  if (basis === 'fallback') {
    console.warn('\n⚠  Smart mode: diff resolution failed — running full gate as fallback');
    telemetry.mode = 'smart→full-fallback';
  } else {
    telemetry.changedFileCount = files?.length ?? 0;
    triggers = evaluateTriggers(files, {
      includeStorybook: INCLUDE_STORYBOOK,
      storyTrigger: [
        /\.stories\.(ts|tsx)$/,
        /^\.storybook\//,
        /^src\/components\//,
        /^src\/utils\//,
      ],
    });
  }
}

// ── Header ─────────────────────────────────────────────────────────────────

console.log('');
console.log('══════════════════════════════════════════════════════════');
console.log(' Quality gate — giselle-mui');
if (FIX_MODE) {
  console.log(' Mode: auto-fix + verify');
} else if (RUN_SMART) {
  console.log(
    ` Mode: smart pre-push (basis: ${telemetry.basis}, ${telemetry.changedFileCount} file(s) changed)`
  );
} else {
  console.log(' Mode: verify only (use --fix to auto-fix)');
}
if (INCLUDE_STORYBOOK) console.log(' Storybook build: enabled');
if (IS_CI) console.log(' CI: full gate enforced');
console.log('══════════════════════════════════════════════════════════');

// ── Checks ─────────────────────────────────────────────────────────────────

// 0a. Banned content scan — catches prohibited identifier names and private refs in docs/**
// ESLint only covers src/**; this step fills the gap for *.md and *.mdx files.
// Always runs — fast, no compilation.
if (!run('Banned content scan', 'node scripts/check-banned-content.js', { fatal: false })) {
  failures.push(
    'Banned content — prohibited identifier name or private reference found in docs/ or src/. See output above.'
  );
}

// 0b. Structure check — no flat .tsx under src/components/
// Always runs — fast, no compilation.
if (!run('Structure check', 'node scripts/check-structure.js', { fatal: false })) {
  failures.push(
    'Structure — flat component file(s) found under src/components/; move each into its own named subfolder'
  );
}

// 1. Prettier — always runs, fast.
if (FIX_MODE) {
  run('Prettier auto-fix', 'npm run fm:fix', { fatal: false });
} else {
  if (!run('Prettier format check', 'npm run fm:check', { fatal: false })) {
    failures.push('Prettier — run `npm run fm:fix` to auto-fix');
  }
}

// 2. ESLint — always runs.
// --max-warnings 0: treat warnings as errors so they can't silently pass the gate.
if (FIX_MODE) {
  run('ESLint auto-fix', 'npm run lint:fix', { fatal: false });
}
if (!run('ESLint (--max-warnings 0)', 'npm run lint -- --max-warnings 0', { fatal: false })) {
  failures.push(
    'ESLint — run `npm run lint:fix` to auto-fix, then fix remaining errors/warnings manually'
  );
}

// 3. TypeScript — always runs.
if (!run('TypeScript (tsc --noEmit)', 'npx tsc --noEmit', { fatal: false })) {
  failures.push('TypeScript — fix all type errors above');
}

// 4. Tests — smart: skipped when only docs/config changed; targeted when ≤25 files changed.
if (triggers.tests === 'none') {
  skip('Tests (vitest)', 'no source files changed');
} else if (RUN_SMART && triggers.tests === 'targeted' && changedFiles) {
  const targetFiles = resolveTargetedTests(changedFiles, appDir);
  if (targetFiles.length === 0) {
    // No co-located tests found for the changed files — run full suite as safe fallback.
    console.log('\n  (targeted: no co-located test files found — falling back to full suite)');
    if (!run('Tests (vitest — full suite)', 'npm test', { fatal: false })) {
      failures.push('Tests — fix failing tests above');
    }
  } else {
    const fileArgs = targetFiles.join(' ');
    console.log(`\n  (targeted: ${targetFiles.length} test file(s))`);
    if (
      !run(`Tests (vitest — ${targetFiles.length} file(s))`, `npx vitest run ${fileArgs}`, {
        fatal: false,
      })
    ) {
      failures.push('Tests — fix failing tests above');
    }
  }
} else {
  if (!run('Tests (vitest)', 'npm test', { fatal: false })) {
    failures.push('Tests — fix failing tests above');
  }
}

// 5. tsup build — smart: skipped when no src/ or build-config changes.
if (RUN_SMART && !triggers.build) {
  skip('tsup build', 'no source or build-config changes');
} else {
  if (!run('tsup build', 'npm run build', { fatal: false })) {
    failures.push('tsup build — the library failed to compile; fix build errors above');
  }
}

// 6. Storybook build — smart: skipped when no story or component changes.
if (!INCLUDE_STORYBOOK) {
  // Not requested — skip silently.
} else if (RUN_SMART && !triggers.storybook) {
  skip('Storybook build', 'no story or component changes');
} else {
  if (!run('Storybook build', 'npm run build-storybook', { fatal: false })) {
    failures.push('Storybook build — fix broken stories above');
  }
}

// ── Telemetry ─────────────────────────────────────────────────────────────

const totalDuration = Date.now() - telemetry.startTime;
telemetry.totalDuration = totalDuration;
telemetry.result = failures.length === 0 ? 'pass' : 'fail';

const executedSteps = telemetry.steps.filter((s) => s.status === 'executed');
const skippedSteps = telemetry.steps.filter((s) => s.status === 'skipped');

if (RUN_SMART || LOG_METRICS) {
  console.log('\n── Timing ─────────────────────────────────────────────────');
  console.log(`   Mode:  ${telemetry.mode}  basis: ${telemetry.basis}`);
  if (telemetry.changedFileCount > 0) {
    console.log(`   Files: ${telemetry.changedFileCount} changed`);
  }
  console.log(`   Steps: ${executedSteps.length} executed, ${skippedSteps.length} skipped`);
  for (const s of telemetry.steps) {
    if (s.status === 'executed') {
      const icon = s.result === 'pass' ? '✓' : '✗';
      console.log(`     ${icon}  ${s.name} (${s.duration}ms)`);
    } else {
      console.log(`     ⏭  ${s.name} [skipped: ${s.reason}]`);
    }
  }
  console.log(`   Total: ${totalDuration}ms`);
}

if (LOG_METRICS) {
  const logPath = path.resolve(__dirname, 'gate-timing.log');
  try {
    appendFileSync(
      logPath,
      JSON.stringify({ ...telemetry, timestamp: new Date().toISOString() }) + '\n'
    );
  } catch {
    // Non-fatal: a log write failure must never block a push.
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
