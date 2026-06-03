import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve(process.cwd(), 'src/components');
// Exemption list covers two cases:
// 1. Legacy files: existed before this gate was wired in (pre-gate baseline).
// 2. Graduated files: components that completed Phase 2 (real tests written).
// To add a graduated file: append it here with a "reason" comment.
const EXEMPT_BASELINE_PATH = path.resolve(
  process.cwd(),
  'src/quality-gate/two-phase-scaffold-exempt.json'
);

const findTestFiles = (dir: string): string[] => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let testFiles: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      testFiles = testFiles.concat(findTestFiles(fullPath));
    } else if (entry.name.endsWith('.test.ts') || entry.name.endsWith('.test.tsx')) {
      testFiles.push(fullPath);
    }
  }
  return testFiles;
};

describe('Quality Gate §5.5 — Two-Phase Scaffold Enforcement', () => {
  const testFiles = findTestFiles(SRC_DIR);

  const toRepoRelative = (filePath: string): string => {
    const repoRelative = path.relative(process.cwd(), filePath);
    return repoRelative.split(path.sep).join('/');
  };

  const readExemptBaseline = (): string[] => {
    const baselineRaw = fs.readFileSync(EXEMPT_BASELINE_PATH, 'utf-8');
    const parsed = JSON.parse(baselineRaw) as { exemptFiles: string[] };
    return parsed.exemptFiles;
  };

  it('fails fast if baseline file is missing', () => {
    expect(fs.existsSync(EXEMPT_BASELINE_PATH)).toBe(true);
  });

  it('fails if baseline contains files that no longer exist', () => {
    const exemptBaseline = new Set(readExemptBaseline());
    const currentTestFiles = new Set(testFiles.map(toRepoRelative));

    const staleBaselineFiles = [...exemptBaseline].filter(
      (filePath) => !currentTestFiles.has(filePath)
    );

    expect(staleBaselineFiles).toEqual([]);
  });

  it('blocks new files that skip scaffold todo tests', () => {
    const filesMissingTodo: string[] = [];
    const exemptBaseline = new Set(readExemptBaseline());

    for (const testFilePath of testFiles) {
      const testContent = fs.readFileSync(testFilePath, 'utf-8');
      const hasTodo = testContent.includes('it.todo') || testContent.includes('test.todo');

      if (!hasTodo) {
        filesMissingTodo.push(toRepoRelative(testFilePath));
      }
    }

    const unexpectedMissingTodoFiles = filesMissingTodo.filter(
      (filePath) => !exemptBaseline.has(filePath)
    );

    expect(unexpectedMissingTodoFiles).toEqual([]);

    console.warn(
      `\nTwo-phase scaffold gate: ${unexpectedMissingTodoFiles.length} gate failures, ${filesMissingTodo.length} files without it.todo (${testFiles.length} total scanned).`
    );
  });
});
