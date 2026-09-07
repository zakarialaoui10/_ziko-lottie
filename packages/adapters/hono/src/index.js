import { Hono } from 'hono'

export function honoAdapter() {
  const app = new Hono()

  return {
    use(middleware) {
      app.use('*', async (c, next) => {
        // Bridge Fetch API Context to Node-like signature if needed, or pass c.req/c.res
        await middleware(c.req.raw, c.res, next)
      })
    },

    usePath(base, middleware) {
      const pathPattern = base.endsWith('/') ? `${base}*` : `${base}/*`
      app.use(pathPattern, async (c, next) => {
        await middleware(c.req.raw, c.res, next)
      })
    },

    handleRoute(path, handler) {
      const honoPath = path === '*' || path === '*all' ? '*' : path
      app.all(honoPath, async (c) => {
        return await handler(c.req.raw)
      })
    },

    listen(port, callback) {
      // Uses Node's @hono/node-server or native serve
      import('@hono/node-server').then(({ serve }) => {
        serve({ fetch: app.fetch, port }, callback)
      })
    }
  }
}