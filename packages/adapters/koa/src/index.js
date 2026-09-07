import Koa from 'koa'

export function koaAdapter() {
  const app = new Koa()

  return {
    use(middleware) {
      app.use(async (ctx, next) => {
        ctx.req.originalUrl = ctx.req.originalUrl || ctx.originalUrl || ctx.req.url
        
        let called = false
        const expressNext = (err) => {
          if (err) throw err
          called = true
          return next()
        }

        await middleware(ctx.req, ctx.res, expressNext)

        // If expressNext wasn't called, assume the middleware completed the response directly
        if (!called || ctx.res.headersSent || ctx.res.writableEnded) {
          ctx.respond = false
        }
      })
    },

    usePath(base, middleware) {
      app.use(async (ctx, next) => {
        if (!ctx.path.startsWith(base)) {
          return next()
        }

        ctx.req.originalUrl = ctx.req.originalUrl || ctx.originalUrl || ctx.req.url

        let called = false
        const expressNext = (err) => {
          if (err) throw err
          called = true
          return next()
        }

        await middleware(ctx.req, ctx.res, expressNext)

        if (!called || ctx.res.headersSent || ctx.res.writableEnded) {
          ctx.respond = false
        }
      })
    },

    handleRoute(path, handler) {
      app.use(async (ctx, next) => {
        const isWildcard = path === '*' || path === '*all' || path === '{*path}'

        if (isWildcard || ctx.path === path) {
          // Tell Koa IMMEDIATELY that we take full ownership of the response
          ctx.respond = false

          const res = ctx.res
          const req = ctx.req
          req.originalUrl = req.originalUrl || ctx.originalUrl || req.url

          // Safeguard response methods against post-sent header modifications
          res.status = function (code) {
            if (!res.headersSent) {
              res.statusCode = code
            }
            return res
          }
          
          res.set = function (headers) {
            if (!res.headersSent) {
              for (const [key, value] of Object.entries(headers)) {
                res.setHeader(key, value)
              }
            }
            return res
          }

          res.send = function (body) {
            if (!res.writableEnded) {
              res.end(body)
            }
            return res
          }

          try {
            await handler(req, res)
          } catch (err) {
            if (!res.headersSent) {
              res.statusCode = 500
              res.end(err.stack || String(err))
            }
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