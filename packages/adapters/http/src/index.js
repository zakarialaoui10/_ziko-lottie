import http from 'node:http'

export function httpAdapter() {
  const middlewares = []
  let routeHandler = null

  const server = http.createServer(async (req, res) => {
    // Response Helper Methods
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

    req.originalUrl = req.url

    // Simple Middleware Engine
    let idx = 0
    const next = async (err) => {
      if (err) {
        res.status(500).send(err.stack || String(err))
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
        res.status(404).send('Not Found')
      }
    }

    next()
  })

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
      return server.listen(port, callback)
    }
  }
}