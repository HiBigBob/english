import * as http from 'http'
import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import compress from 'koa-compress'

import { logger } from './logger'
import { notFoundHandler } from '../middleware/not-found'
import { errorHandler } from '../middleware/error-handler'
import respondHandler from '../middleware/respond-handler'
import { connect as MongoConnect, store as MongoStore } from '../middleware/mongo-connect'
import Router from 'koa-router'
import TestRouter from '../routes/test'
import mount from 'koa-mount'

export async function createServer() {
  logger.debug('Creating server...')
  const app = new Koa()

  const db = await MongoConnect()

  const Test = new TestRouter()

  app
    // Top middleware is the error handler.
    .use(errorHandler)
    // Compress all responses.
    .use(compress())
    // Adds ctx.ok(), ctx.notFound(), etc..
    .use(respondHandler())
    // Handles CORS.
    .use(cors())
    // Parses request bodies.
    .use(bodyParser())
    .use(MongoStore())
    .use(mount('/test', Test.getRouter(db)))
    // Default handler when nothing stopped the chain.
    .use(notFoundHandler)

  // Creates a http server ready to listen.
  const server = http.createServer(app.callback())

  // Add a `close` event listener so we can clean up resources.
  server.on('close', () => {
    // You should tear down database connections, TCP connections, etc
    // here to make sure Jest's watch-mode some process management
    // tool does not release resources.
    logger.debug('Server closing, bye!')
  })

  logger.debug('Server created, ready to listen', { scope: 'startup' })
  return server
}
