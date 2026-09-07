import Fastify from 'fastify'

export function fastifyAdapter(options = {}) {
  const app = Fastify(options)

  return {
    use(middleware) {
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
        reply.hijack() // Hand control over to raw res stream

        // Attach helper methods to reply.raw for chaining
        const res = reply.raw
        req.raw.originalUrl = req.raw.originalUrl || req.raw.url

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

        await handler(req.raw, res)
      })
    },

    listen(port, callback) {
      return app.listen({ port }, callback)
    }
  }
}