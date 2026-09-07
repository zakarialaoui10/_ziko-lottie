import Koa from 'koa'

export function koaAdapter() {
  const app = new Koa()

  return {
    use(middleware) {
      app.use(async (ctx, next) => {
        // Express-style middleware bridge: (req, res, next)
        let called = false
        const expressNext = (err) => {
          if (err) throw err
          called = true
          return next()
        }

        await middleware(ctx.req, ctx.res, expressNext)

        // If next() wasn't called in the legacy middleware, downstream koa middleware won't execute
        if (!called && ctx.res.writableEnded) {
          // Response was handled directly by Express-style middleware
          ctx.respond = false
        }
      })
    },

    usePath(base, middleware) {
      app.use(async (ctx, next) => {
        // Strip query string for path checking
        const pathname = ctx.path

        if (!pathname.startsWith(base)) {
          return next()
        }

        let called = false
        const expressNext = (err) => {
          if (err) throw err
          called = true
          return next()
        }

        await middleware(ctx.req, ctx.res, expressNext)

        if (!called && ctx.res.writableEnded) {
          ctx.respond = false
        }
      })
    },

    handleRoute(path, handler) {
      app.use(async (ctx, next) => {
        // Normalize wildcard routes
        const isWildcard = path === '*' || path === '*all' || path === '{*path}'

        if (isWildcard || ctx.path === path) {
          try {
            await handler(ctx.req, ctx.res)
            ctx.respond = false
          } catch (err) {
            ctx.status = 500
            throw err
          }
        } else {
          await next()
        }
      })
    },

    listen(port, callback) {
      return app.listen(port, callback)
    }
  }
}