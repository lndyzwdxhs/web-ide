import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export function verifyPackage(rootDir) {
  const errors = []
  const pkgPath = resolve(rootDir, 'package.json')
  const readText = (relativePath) => {
    const fullPath = resolve(rootDir, relativePath)
    if (!existsSync(fullPath)) return null
    return readFileSync(fullPath, 'utf8')
  }

  const pkgText = readText('package.json')
  if (!pkgText) {
    errors.push('missing package.json')
    return { ok: false, errors }
  }

  let pkg
  try {
    pkg = JSON.parse(pkgText)
  } catch (error) {
    errors.push(`package.json is not valid JSON: ${error.message}`)
    return { ok: false, errors }
  }

  const requiredRootFields = ['name', 'version', 'main', 'exports', 'dsh']
  for (const field of requiredRootFields) {
    if (!pkg[field]) errors.push(`package.json missing field: ${field}`)
  }

  const patchPath = pkg?.dsh?.bundle?.patch
  if (!patchPath) {
    errors.push('package.json dsh.bundle.patch is missing')
  } else if (!existsSync(resolve(rootDir, patchPath))) {
    errors.push(`dsh.bundle.patch target does not exist: ${patchPath}`)
  }

  if (pkg?.dsh?.client?.platform !== 'web') {
    errors.push('package.json dsh.client.platform must be "web"')
  }

  const clientExport = pkg?.exports?.['./client']
  if (!clientExport) {
    errors.push('package.json exports["./client"] is missing')
  } else if (!existsSync(resolve(rootDir, clientExport))) {
    errors.push(`exports["./client"] target does not exist: ${clientExport}`)
  }

  const patchExport = pkg?.exports?.['./cordis.patch.yml']
  if (!patchExport) {
    errors.push('package.json exports["./cordis.patch.yml"] is missing')
  } else if (!existsSync(resolve(rootDir, patchExport))) {
    errors.push(`exports["./cordis.patch.yml"] target does not exist: ${patchExport}`)
  }

  for (const field of ['dependencies', 'peerDependencies', 'optionalDependencies']) {
    const value = pkg?.[field]
    if (!value || typeof value !== 'object') continue
    for (const name of Object.keys(value)) {
      if (name.startsWith('@deepseek-ai/')) {
        errors.push(`${field} must not declare official @deepseek-ai package: ${name}`)
      }
    }
  }

  if (!Array.isArray(pkg?.files) || !pkg.files.includes('lib/index.js') || !pkg.files.includes('lib/client.js') || !pkg.files.includes('cordis.patch.yml')) {
    errors.push('package.json files must include lib/index.js, lib/client.js, and cordis.patch.yml')
  }

  const patch = patchPath ? readText(patchPath) : null
  if (!patch) {
    errors.push('cordis.patch.yml is missing')
  } else {
    if (!patch.includes('- insert:')) errors.push('cordis.patch.yml must contain - insert:')
    if (pkg.name && !patch.includes(pkg.name)) errors.push(`cordis.patch.yml must insert id/name matching package name: ${pkg.name}`)
  }

  return { ok: errors.length === 0, errors }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
  const result = verifyPackage(rootDir)
  if (result.ok) {
    console.log('[verify-package] ok')
  } else {
    console.error('[verify-package] failed')
    for (const error of result.errors) console.error('  -', error)
    process.exit(1)
  }
}
