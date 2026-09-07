import { Hono } from 'hono'
import { serve, getRequestListener } from '@hono/node-server'
import http from 'node:http'

export function honoAdapter() {
  const app = new Hono()
  const middlewares = []
  let routeHandler = null

  function enhanceResponse(res) {
    if (res.status) return res

    res.status = function (code) {
      res.statusCode = code
      return res
    }

    res.set = function (headers) {
      for (const [key, value] of Object.entries(headers)) {
        res.setHeader(key, value)
      }
      return res
    }

    res.send = function (body) {
      res.end(body)
      return res
    }

    return res
  }

  return {
    use(middleware) {
      middlewares.push({ fn: middleware })
    },

    usePath(base, middleware) {
      middlewares.push({ base, fn: middleware })
    },

    handleRoute(_path, handler) {
      routeHandler = handler
    },

    listen(port, callback) {
      const honoFetchListener = getRequestListener(app.fetch)

      const serverHandler = async (req, res) => {
        req.originalUrl = req.originalUrl || req.url
        enhanceResponse(res)

        let idx = 0
        const next = async (err) => {
          if (err) {
            if (!res.headersSent) {
              res.status(500).send(err.stack || String(err))
            }
            return
          }

          if (idx < middlewares.length) {
            const item = middlewares[idx++]
            
            if (item.base && !req.url.startsWith(item.base)) {
              return next()
            }

            try {
              await item.fn(req, res, next)
            } catch (e) {
              next(e)
            }
          } else if (routeHandler) {
            await routeHandler(req, res)
          } else {
            honoFetchListener(req, res)
          }
        }

        await next()
      }

      return serve({ 
        fetch: app.fetch, 
        port, 
        createServer: () => http.createServer(serverHandler) 
      }, callback)
    }
  }
}