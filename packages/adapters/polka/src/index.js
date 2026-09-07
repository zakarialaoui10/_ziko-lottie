import polka from 'polka'

export function polkaAdapter() {
  const app = polka()

  // Helper to enhance Polka's response object with Express/Ziko response methods
  function enhanceResponse(res) {
    if (res.status) return res // Avoid re-wrapping if already present

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
      app.use((req, res, next) => {
        req.originalUrl = req.originalUrl || req.url
        enhanceResponse(res)
        middleware(req, res, next)
      })
    },

    usePath(base, middleware) {
      app.use(base, (req, res, next) => {
        req.originalUrl = req.originalUrl || req.url
        enhanceResponse(res)
        middleware(req, res, next)
      })
    },

    handleRoute(path, handler) {
      const polkaPath = path === '*' || path === '*all' ? '*' : path

      app.all(polkaPath, async (req, res) => {
        req.originalUrl = req.originalUrl || req.url
        enhanceResponse(res)
        await handler(req, res)
      })
    },

    listen(port, callback) {
      return app.listen(port, callback)
    }
  }
}