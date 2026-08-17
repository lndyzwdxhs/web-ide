// @ts-nocheck

export const inject = ['fs', 'webServer']

function sendJson(res, status, data) {
  res.writeHead(status, { 'content-type': 'application/json' })
  res.end(JSON.stringify(data))
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.setEncoding('utf8')
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}) }
      catch (error) { reject(error) }
    })
    req.on('error', reject)
  })
}

export function apply(ctx) {
  ctx.effect(() => {
    const listRoute = ctx.webServer.register({
      kind: 'exact',
      path: '/api/cursor/fs/list',
      handler: async (req, res) => {
        try {
          const url = new URL(req.url || '/', 'http://127.0.0.1')
          const path = url.searchParams.get('path') || ''
          if (!path) {
            sendJson(res, 400, { ok: false, error: 'path required' })
            return
          }
          const target = await ctx.fs.resolve(path)
          const entries = await ctx.fs.listDir(target)
          sendJson(res, 200, {
            ok: true,
            entries: entries.map((entry) => ({
              name: entry.name,
              type: entry.type,
              displayPath: entry.target.displayPath,
            })),
          })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: error && error.message ? error.message : String(error) })
        }
      },
    })

    const readRoute = ctx.webServer.register({
      kind: 'exact',
      path: '/api/cursor/fs/read',
      handler: async (req, res) => {
        try {
          const url = new URL(req.url || '/', 'http://127.0.0.1')
          const path = url.searchParams.get('path') || ''
          if (!path) {
            sendJson(res, 400, { ok: false, error: 'path required' })
            return
          }
          const target = await ctx.fs.resolve(path)
          const content = await ctx.fs.readText(target)
          sendJson(res, 200, { ok: true, content })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: error && error.message ? error.message : String(error) })
        }
      },
    })

    const writeRoute = ctx.webServer.register({
      kind: 'exact',
      path: '/api/cursor/fs/write',
      handler: async (req, res) => {
        try {
          const payload = await readJson(req)
          const path = payload && typeof payload.path === 'string' ? payload.path : ''
          const content = payload && typeof payload.content === 'string' ? payload.content : ''
          if (!path) {
            sendJson(res, 400, { ok: false, error: 'path required' })
            return
          }
          const target = await ctx.fs.resolve(path)
          await ctx.fs.writeText(target, content)
          sendJson(res, 200, { ok: true })
        } catch (error) {
          sendJson(res, 500, { ok: false, error: error && error.message ? error.message : String(error) })
        }
      },
    })

    return () => {
      listRoute()
      readRoute()
      writeRoute()
    }
  })
}
