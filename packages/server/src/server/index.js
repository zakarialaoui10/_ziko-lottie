import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url' // <--- 1. Import pathToFileURL
import { httpAdapter } from '@zikojs/http'
import { expressAdapter } from '@zikojs/express'
import { 
  trailingSlashMiddleware
} from '../middlewares/index.js'

import {
  setupEnvironment
} from '../server-only-utils/index.js'

const isProduction = process.env.NODE_ENV === 'production'

export async function createServer({
  adapter = expressAdapter,
  port = process.env.PORT || 5173,
  base = process.env.BASE || '/',
  trailingSlash = 'never',
  cwd = process.cwd()
} = {}) {
  const rootDir = cwd

  // 1. Resolve adapter
  const adapterInstance = typeof adapter === 'function' ? adapter() : adapter

  // 2. Normalize Base URL
  const normalizedBase = base.startsWith('/') ? base : `/${base}`
  const urlBase = normalizedBase.endsWith('/') ? normalizedBase : `${normalizedBase}/`

  // 3. Resolve absolute filesystem paths relative to rootDir
  const clientDistPath = path.resolve(rootDir, './dist/client')
  const serverDistPath = path.resolve(rootDir, './dist/server/entry-server.js')
  const indexHtmlPath = path.resolve(rootDir, './index.html')

  // 4. Attach Trailing Slash Middleware
  adapterInstance.use((req, res, next) => {
    trailingSlashMiddleware(
      {
        behavior : trailingSlash,
        isProduction
      }, 
      req, res, next)
  })

  // 5. Setup environment middleware
  const vite = await setupEnvironment({
    adapterInstance,
    rootDir,
    urlBase,
    clientDistPath,
    isProduction
  })

  // Cached production assets
  const templateHtml = isProduction
    ? await fs.readFile(path.join(clientDistPath, 'index.html'), 'utf-8')
    : ''

  // 6. SSR Route Handler
  adapterInstance.handleRoute('*', async (req, res) => {
    try {
      const url = req.originalUrl.replace(urlBase, '')

      let template
      let render
      if (!isProduction) {
        template = await fs.readFile(indexHtmlPath, 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/.ziko/entry-server.js')).render
      } else {
        template = templateHtml
        // 2. Wrap serverDistPath with pathToFileURL().href for Windows ESM compatibility
        render = (await import(pathToFileURL(serverDistPath).href)).render
      }

      const rendered = await render(url)

      const html = template
        .replace(`<!--app-head-->`, rendered.head ?? '')
        .replace(`<!--app-html-->`, rendered.html ?? '')

      res.status(200).set({ 'Content-Type': 'text/html' }).send(html)
    } catch (e) {
      vite?.ssrFixStacktrace(e)
      console.error(e.stack)
      res.status(500).send(e.stack)
    }
  })

  return adapterInstance.listen(port, () => {
    console.log(`Server started at http://localhost:${port}${urlBase}`)
  })
}