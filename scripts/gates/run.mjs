import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const gates = [
  { name: 'verify-package', args: ['scripts/gates/verify-package.mjs'] },
  { name: 'verify-build', args: ['scripts/gates/verify-build.mjs'] },
  { name: 'gate-self-tests', args: ['--test', 'scripts/gates/*.test.mjs'] },
]

const failed = []
for (const gate of gates) {
  const result = spawnSync(process.execPath, gate.args, {
    cwd: root,
    stdio: 'inherit',
    encoding: 'utf8',
  })
  if (result.status !== 0) failed.push(gate.name)
}

if (failed.length > 0) {
  console.error(`[gates] ${failed.length}/${gates.length} failed: ${failed.join(', ')}`)
  process.exit(1)
}

console.log(`[gates] ${gates.length} gates passed`)
