import NodeOAuthServer, { Request, Response } from 'oauth2-server'
import Promise from 'bluebird'
import UnauthorizedRequestError from 'oauth2-server/lib/errors/unauthorized-request-error'
import InvalidArgumentError from 'oauth2-server/lib/errors/invalid-argument-error'
import Oauth2Model from '../models/oauth2'

export default class Oauth2 {
  constructor(db) {
    this.model = new Oauth2Model(db)
    this.accessTokenLifetime = 60 * 60 * 24 * 7 // 1 weeks.
    this.refreshTokenLifetime = 60 * 60 * 24 * 14 // 2 weeks.

    this.server = new Oauth2Server({
      model: this.model,
      grants: ['password', 'refresh_token'],
      accessTokenLifetime: this.accessTokenLifetime,
      refreshTokenLifetime: this.refreshTokenLifetime,
      debug: true,
      allowEmptyState: true
    })
  }

  getServer() {
    return this.server
  }
}

class Oauth2Server {
  constructor(options) {
    options = options || {}

    if (!options.model) {
      throw new InvalidArgumentError('Missing parameter: `model`')
    }

    this.continueMiddleware = !!options.continueMiddleware
    delete options.continueMiddleware

    this.server = new NodeOAuthServer(options)
  }

  authenticate(options) {
    let that = this

    return (ctx, next) => {
      let request = new Request(ctx.request)
      let response = new Response(ctx.response)

      return Promise.bind(that)
        .then(() => {
          return this.server.authenticate(request, response, options)
        })
        .tap(token => {
          ctx.state.oauth = { token: token }
          next()
        })
        .catch(e => {
          return handleError.call(this, e, ctx, response, null, next)
        })
    }
  }

  authorize(options) {
    let that = this

    return (ctx, next) => {
      let request = new Request(ctx.request)
      let response = new Response(ctx.response)

      return Promise.bind(that)
        .then(() => {
          return this.server.authorize(request, response, options)
        })
        .tap(code => {
          ctx.state.oauth = { code: code }
          if (this.continueMiddleware) {
            next()
          }
        })
        .then(() => {
          return handleResponse.call(this, ctx, response)
        })
        .catch(e => {
          return handleError.call(this, e, ctx, response, next)
        })
    }
  }

  validateAuthorize(options) {
    let that = this

    return (ctx, next) => {
      let request = new Request(ctx.request)
      let response = new Response(ctx.response)

      return Promise.bind(that)
        .then(() => {
          return this.server.authorize(request, response, options)
        })
        .tap(code => {
          ctx.state.oauth = { code: code }
          if (this.continueMiddleware) {
            next()
          }
        })
        .then(() => {
          return handleResponse.call(this, ctx, response)
        })
        .catch(e => {
          return handleError.call(this, e, ctx, response, next)
        })
    }
  }

  token(options) {
    let that = this

    return (ctx, next) => {
      let request = new Request(ctx.request)
      let response = new Response({})

      return Promise.bind(that)
        .then(() => {
          return this.server.token(request, response, options)
        })
        .tap(token => {
          ctx.state.oauth = { token: token }
          if (this.continueMiddleware) {
            next()
          }
        })
        .then(() => {
          return handleResponse.call(this, ctx, response)
        })
        .catch(e => {
          return handleError.call(this, e, ctx, response, next)
        })
    }
  }
}

/**
 * Handle response.
 */
const handleResponse = (ctx, response) => {
  if (response.status === 302) {
    let location = response.headers.location
    delete response.headers.location
    ctx.set(response.headers)
    ctx.status = response.status
    ctx.body = { redirect_uri: location }
  } else {
    ctx.set(response.headers)
    ctx.status = response.status
    ctx.body = response.body
  }
}

/**
 * Handle error.
 */
const handleError = (e, ctx, response, next) => {
  if (response) {
    ctx.set(response.headers)
  }

  ctx.status = e.status

  if (e instanceof UnauthorizedRequestError) {
    return ctx
  }

  ctx.body = { error: e.name, error_description: e.message }
}
