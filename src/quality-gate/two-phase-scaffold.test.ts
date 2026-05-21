import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve(process.cwd(), 'src/components');
const LEGACY_BASELINE_PATH = path.resolve(
  process.cwd(),
  'src/quality-gate/two-phase-scaffold-legacy-missing-todo.json'
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
  const filesMissingTodo: string[] = [];

  const toRepoRelative = (filePath: string): string => {
    const repoRelative = path.relative(process.cwd(), filePath);
    return repoRelative.split(path.sep).join('/');
  };

  const readLegacyBaseline = (): string[] => {
    const baselineRaw = fs.readFileSync(LEGACY_BASELINE_PATH, 'utf-8');
    const parsed = JSON.parse(baselineRaw) as { legacyMissingTodoFiles: string[] };
    return parsed.legacyMissingTodoFiles;
  };

  it('fails fast if baseline file is missing', () => {
    expect(fs.existsSync(LEGACY_BASELINE_PATH)).toBe(true);
  });

  it('blocks new files that skip scaffold todo tests', () => {
    const legacyBaseline = new Set(readLegacyBaseline());

    for (const testFilePath of testFiles) {
      const testContent = fs.readFileSync(testFilePath, 'utf-8');
      const hasTodo = testContent.includes('it.todo') || testContent.includes('test.todo');

      if (!hasTodo) {
        filesMissingTodo.push(toRepoRelative(testFilePath));
      }
    }

    const unexpectedMissingTodoFiles = filesMissingTodo.filter(
      (filePath) => !legacyBaseline.has(filePath)
    );

    expect(unexpectedMissingTodoFiles).toEqual([]);

    // Keep the report for migration tracking and periodic audits.
    const report = {
      timestamp: new Date().toISOString(),
      totalTestFiles: testFiles.length,
      filesMissingTodo: filesMissingTodo.length,
      legacyBaselineCount: legacyBaseline.size,
      unexpectedMissingTodoFiles,
      failingFiles: filesMissingTodo,
      message:
        unexpectedMissingTodoFiles.length === 0
          ? `${filesMissingTodo.length} legacy tests currently missing it.todo (baseline locked).`
          : `Detected ${unexpectedMissingTodoFiles.length} new tests missing it.todo.`,
    };

    const reportPath = path.join(process.cwd(), 'src/quality-gate/audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`\nTwo-phase scaffold report updated. Missing todo: ${filesMissingTodo.length}.`);
    console.log(`Report written to ${reportPath}`);
  });
});
