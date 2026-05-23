// @ts-check
// Prints audit results to stdout only. Does not write any files.
// Run with: node scripts/audit-roadmaps.cjs
const fs = require('fs');
const path = require('path');

const base = path.resolve(process.cwd(), 'src/components');

/** @param {string} dir @returns {string[]} */
function findRoadmaps(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  /** @type {string[]} */
  let found = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found = found.concat(findRoadmaps(full));
    } else if (entry.name === 'roadmap.md') {
      found.push(full);
    }
  }
  return found;
}

const files = findRoadmaps(base);

const VALID_STATUSES = ['alpha', 'beta', 'stable', 'lts'];
const REQUIRED_HEADERS = ['## Status', '## Open improvements', '## Completed'];

const issues = [];

for (const f of files) {
  const rel = path.relative(base, f).split(path.sep).join('/');
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');

  // Check title line
  const titleLine = lines[0];
  if (!titleLine.startsWith('# ')) {
    issues.push({ file: rel, issue: 'Missing H1 title', severity: 'ERROR' });
  }

  // Check for required sections
  for (const h of REQUIRED_HEADERS) {
    if (content.indexOf(h) === -1) {
      issues.push({ file: rel, issue: 'Missing section: ' + h, severity: 'ERROR' });
    }
  }

  // Check ## Status section value
  const statusMatch = content.match(/## Status\s*\n+`?([a-z-]+)`?/);
  if (!statusMatch) {
    issues.push({ file: rel, issue: 'Cannot parse status value', severity: 'ERROR' });
  } else {
    const status = statusMatch[1].replace(/`/g, '').trim();
    if (VALID_STATUSES.indexOf(status) === -1) {
      issues.push({ file: rel, issue: `Unknown status: "${status}"`, severity: 'WARN' });
    }
  }

  // Check Phase/Priority metadata line format
  const hasPhase = content.indexOf('Phase:') !== -1;
  const hasPriority = content.indexOf('Priority tier:') !== -1;
  if (hasPhase !== hasPriority) {
    issues.push({
      file: rel,
      issue: 'Phase/Priority metadata incomplete (one present, other missing)',
      severity: 'WARN',
    });
  }

  // Check Open improvements table columns
  if (content.indexOf('## Open improvements') !== -1) {
    const oiSection = content.split('## Open improvements')[1].split('\n## ')[0];
    const hasNone = oiSection.indexOf('| None.') !== -1 || oiSection.indexOf('None.') !== -1;
    const hasTable = oiSection.indexOf('|') !== -1;
    if (hasTable && !hasNone) {
      const hasTask = oiSection.indexOf('Task') !== -1;
      const hasPriority2 = oiSection.indexOf('Priority') !== -1;
      const hasStatus = oiSection.indexOf('Status') !== -1;
      if (!hasTask || !hasPriority2 || !hasStatus) {
        issues.push({
          file: rel,
          issue: 'Open improvements table missing expected columns (Task/Priority/Status)',
          severity: 'WARN',
        });
      }
    }
  }

  // Check Completed table columns
  if (content.indexOf('## Completed') !== -1) {
    const cSection = content.split('## Completed')[1];
    const hasNone = cSection.indexOf('| None.') !== -1 || cSection.indexOf('None.') !== -1;
    const hasTable = cSection.indexOf('|') !== -1;
    if (hasTable && !hasNone) {
      const hasTask = cSection.indexOf('Task') !== -1;
      const hasCompleted = cSection.indexOf('Completed') !== -1;
      if (!hasTask || !hasCompleted) {
        issues.push({
          file: rel,
          issue: 'Completed table missing expected columns (Task/Completed)',
          severity: 'WARN',
        });
      }
    }
  }

  // Check Last updated date line
  if (content.indexOf('> Last updated:') === -1) {
    issues.push({ file: rel, issue: 'Missing "> Last updated:" line', severity: 'WARN' });
  }

  // Check ## Known gaps section
  if (content.indexOf('## Known gaps') === -1) {
    issues.push({ file: rel, issue: 'Missing section: ## Known gaps', severity: 'INFO' });
  }
}

console.log('=== TOTAL FILES: ' + files.length + ' ===\n');

const errors = issues.filter((i) => i.severity === 'ERROR');
const warns = issues.filter((i) => i.severity === 'WARN');
const infos = issues.filter((i) => i.severity === 'INFO');

if (errors.length) {
  console.log('--- ERRORS (' + errors.length + ') ---');
  errors.forEach((i) => console.log('[ERROR] ' + i.file + ': ' + i.issue));
}
if (warns.length) {
  console.log('\n--- WARNINGS (' + warns.length + ') ---');
  warns.forEach((i) => console.log('[WARN]  ' + i.file + ': ' + i.issue));
}
if (infos.length) {
  console.log('\n--- INFO (' + infos.length + ') ---');
  infos.forEach((i) => console.log('[INFO]  ' + i.file + ': ' + i.issue));
}

if (issues.length === 0) console.log('All roadmaps consistent!');
console.log(
  '\nSummary: ' +
    errors.length +
    ' errors, ' +
    warns.length +
    ' warnings, ' +
    infos.length +
    ' info'
);
