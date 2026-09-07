import polka from 'polka'

export function polkaAdapter() {
  const app = polka()

  return {
    use(middleware) {
      app.use(middleware)
    },

    usePath(base, middleware) {
      app.use(base, middleware)
    },

    handleRoute(path, handler) {
      const polkaPath = path === '*' || path === '*all' ? '*' : path
      app.all(polkaPath, async (req, res) => {
        await handler(req, res)
      })
    },

    listen(port, callback) {
      return app.listen(port, callback)
    }
  }
}