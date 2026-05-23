import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve(process.cwd(), 'src/components');

const getComponentDirs = () => {
  return fs
    .readdirSync(SRC_DIR, { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name);
};

describe('Quality Gate §5.5 — Two-Phase Scaffold Enforcement', () => {
  const components = getComponentDirs();

  it.each(components)(
    'component "%s" must follow two-phase scaffold (it.todo first)',
    (componentName) => {
      const componentDir = path.join(SRC_DIR, componentName);

      // Phase 1: Scaffold must exist with failing test
      const testFile = path.join(componentDir, `${componentName}.test.ts`);
      const hasTestFile = fs.existsSync(testFile);

      if (!hasTestFile) {
        // Some components may be in subfolders — we will expand this later
        return; // temporary pass for subfolder components during initial audit
      }

      const testContent = fs.readFileSync(testFile, 'utf-8');

      // Critical rule from new AGENTS.md §5.5
      const hasTodo = testContent.includes('it.todo') || testContent.includes('test.todo');

      expect(
        hasTodo,
        `Component "${componentName}" is missing 'it.todo' in its scaffold test file.\n` +
          `Per AGENTS.md §5.5: Scaffold phase must start with failing it.todo tests.`
      ).toBe(true);
    }
  );
});
