import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { verifyPackage } from './verify-package.mjs'

test('verify-package rejects a package without bundle declaration', () => {
  const dir = mkdtempSync(join(tmpdir(), 'web-ide-gate-'))
  try {
    writeFileSync(join(dir, 'package.json'), JSON.stringify({
      name: 'broken-plugin',
      version: '0.1.0',
    }))
    const result = verifyPackage(dir)
    assert.equal(result.ok, false)
    assert.ok(result.errors.some((error) => error.includes('dsh.bundle.patch')))
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
