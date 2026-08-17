import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
const errors = []

for (const file of ['lib/index.js', 'lib/client.js']) {
  if (!existsSync(resolve(root, file))) {
    errors.push(`missing generated artifact: ${file}`)
    continue
  }
  const text = readFileSync(resolve(root, file), 'utf8')
  if (text.length < 10) errors.push(`generated artifact looks empty: ${file}`)
}

const clientText = existsSync(resolve(root, 'lib/client.js'))
  ? readFileSync(resolve(root, 'lib/client.js'), 'utf8')
  : ''
if (!clientText.includes(`window.__ModuleLoader__.load({ id: ${JSON.stringify(pkg.name)}`)) {
  errors.push(`lib/client.js does not register expected plugin id: ${pkg.name}`)
}

if (errors.length === 0) {
  console.log('[verify-build] ok')
} else {
  console.error('[verify-build] failed')
  for (const error of errors) console.error('  -', error)
  process.exit(1)
}
