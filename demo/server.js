import fs from 'node:fs/promises'
import { httpAdapter } from '@zikojs/server-http'

const isProduction = process.env.NODE_ENV === 'production'

export async function createServer(options = {}) {
  // Gracefully handle passing an adapter function or object instance
  const adapterInstance = typeof options.adapter === 'function' 
    ? options.adapter() 
    : (options.adapter || expressAdapter())

  const {
    port = process.env.PORT || 5173,
    base = process.env.BASE || '/',
  } = options

  // Cached production assets
  const templateHtml = isProduction
    ? await fs.readFile('./dist/client/index.html', 'utf-8')
    : ''

  /** @type {import('vite').ViteDevServer | undefined} */
  let vite
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite')
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
      base,
    })
    adapterInstance.use(vite.middlewares)
  } else {
    const compression = (await import('compression')).default
    const sirv = (await import('sirv')).default
    adapterInstance.use(compression())
    adapterInstance.usePath(base, sirv('./dist/client', { extensions: [] }))
  }

  // SSR Route Handler
  adapterInstance.handleRoute('*', async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, '')

      let template
      let render
      if (!isProduction) {
        template = await fs.readFile('./index.html', 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.js')).render
      } else {
        template = templateHtml
        render = (await import('./dist/server/entry-server.js')).render
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
    console.log(`Server started at http://localhost:${port}`)
  })
}

// -----------------------------------------------------------------------------
// Usage
// -----------------------------------------------------------------------------

// Accepts both instantiated adapters and uninstantiated factory functions:
createServer({
  adapter: httpAdapter // or httpAdapter()
})