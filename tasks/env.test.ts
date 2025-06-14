import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { test, expect } from '@jest/globals';

test('dotenv variables pass through to worker process', () => {
  const dir = fs.mkdtempSync(path.join(process.cwd(), 'envtest-'));
  const envFile = path.join(dir, '.env');
  const child = path.join(dir, 'child.cjs');
  const parent = path.join(dir, 'parent.cjs');

  fs.writeFileSync(envFile, 'TEST_VAR=hello');
  fs.writeFileSync(child, 'console.log(process.env.TEST_VAR);');
  fs.writeFileSync(
    parent,
    "require('dotenv/config'); const { execSync } = require('child_process'); console.log(execSync(`node " + child + "`).toString().trim());"
  );

  const result = spawnSync('node', [parent], {
    env: { ...process.env, DOTENV_CONFIG_PATH: envFile },
    encoding: 'utf8',
  });

  fs.rmSync(dir, { recursive: true, force: true });

  expect(result.stdout.trim()).toBe('hello');
});