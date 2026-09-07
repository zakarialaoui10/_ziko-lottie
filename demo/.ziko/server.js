import { createServer } from '@zikojs/server'
import { httpAdapter } from '@zikojs/http' // Working
import { expressAdapter } from '@zikojs/express' // Working
import { koaAdapter } from '@zikojs/koa' // Working
import { fastifyAdapter } from '@zikojs/fastify'// Working
import { polkaAdapter } from '@zikojs/polka' // Working
import { honoAdapter } from '@zikojs/hono'


createServer({
  adapter : honoAdapter
})