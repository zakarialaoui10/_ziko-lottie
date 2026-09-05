export function expressAdapter() {
  const app = express()
  return {
    use(middleware) {
      app.use(middleware)
    },
    usePath(base, middleware) {
      app.use(base, middleware)
    },
    handleRoute(path, handler) {
      // Normalize wildcard routes for Express 5 (path-to-regexp v8)
      const normalizedPath = path === '*' || path === '*all' ? '{*path}' : path

      app.use(normalizedPath, async (req, res, next) => {
        try {
          await handler(req, res)
        } catch (err) {
          next(err)
        }
      })
    },
    listen(port, callback) {
      return app.listen(port, callback)
    }
  }
}