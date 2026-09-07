import Fastify from 'fastify'

export function fastifyAdapter(options = {}) {
  const app = Fastify(options)

  return {
    use(middleware) {
      // Use @fastify/express or raw onRequest hooks
      app.addHook('onRequest', async (req, reply) => {
        return new Promise((resolve, reject) => {
          middleware(req.raw, reply.raw, (err) => {
            if (err) reject(err)
            else resolve()
          })
        })
      })
    },

    usePath(base, middleware) {
      app.addHook('onRequest', async (req, reply) => {
        if (req.url.startsWith(base)) {
          return new Promise((resolve, reject) => {
            middleware(req.raw, reply.raw, (err) => {
              if (err) reject(err)
              else resolve()
            })
          })
        }
      })
    },

    handleRoute(path, handler) {
      const fastifyPath = path === '*' || path === '*all' ? '/*' : path
      
      app.all(fastifyPath, async (req, reply) => {
        reply.hijack() // Prevent Fastify from automatically sending response
        await handler(req.raw, reply.raw)
      })
    },

    listen(port, callback) {
      return app.listen({ port }, callback)
    }
  }
}