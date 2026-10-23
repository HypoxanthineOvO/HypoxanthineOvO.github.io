// Keep complete source assets; only the disposable dist/ output is optimized.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
};
const venv = resolve('.venv-build');
const python = resolve(venv, process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
const requirements = 'scripts/font-requirements.txt';
const stamp = resolve(venv, '.requirements-sha256');
const hash = createHash('sha256').update(readFileSync(requirements)).digest('hex');
if (!existsSync(python)) run(process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3'), ['-m', 'venv', venv]);
if (!existsSync(stamp) || readFileSync(stamp, 'utf8') !== hash) {
  run(python, ['-m', 'pip', 'install', '--disable-pip-version-check', '-r', requirements]);
  writeFileSync(stamp, hash);
}
run(process.execPath, ['node_modules/astro/astro.js', 'build']);
run(python, ['scripts/subset-fonts.py', 'dist']);
run(process.execPath, ['scripts/optimize-images.mjs', 'dist']);
run(process.execPath, ['scripts/check-build-budget.mjs']);
run(python, ['scripts/check-dist-links.py']);
