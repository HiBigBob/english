import NodeOAuthServer, { Request, Response } from 'oauth2-server'
import Promise from 'bluebird'
import UnauthorizedRequestError from 'oauth2-server/lib/errors/unauthorized-request-error'
import InvalidArgumentError from 'oauth2-server/lib/errors/invalid-argument-error'
import Oauth2Model from '../../models/oauth2.model'

export default class Oauth2 {
  constructor(db) {
    this.model = new Oauth2Model(db)
    this.accessTokenLifetime = 60 * 60 * 24 * 7 // 1 weeks.
    this.refreshTokenLifetime = 60 * 60 * 24 * 14 // 2 weeks.

    this.server = new Oauth2Server({
      model: this.model,
      grants: ['password', 'refresh_token', 'client_credentials'],
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

    return (req, res, next) => {
      let request = new Request(req)
      let response = new Response(res)

      return Promise.bind(that)
        .then(() => {
          return this.server.authenticate(request, response, options)
        })
        .tap(token => {
          res.locals.oauth = { token: token }
          next()
        })
        .catch(e => {
          return handleError.call(this, e, req, res, null, next)
        })
    }
  }

  authorize(options) {
    let that = this

    return (req, res, next) => {
      let request = new Request(req)
      let response = new Response(res)

      return Promise.bind(that)
        .then(() => {
          return this.server.authorize(request, response, options)
        })
        .tap(code => {
          res.locals.oauth = { code: code }
          if (this.continueMiddleware) {
            next()
          }
        })
        .then(() => {
          return handleResponse.call(this, req, res, response)
        })
        .catch(e => {
          return handleError.call(this, e, req, res, response, next)
        })
    }
  }

  validateAuthorize(options) {
    let that = this

    return (req, res, next) => {
      let request = new Request(req)
      let response = new Response(res)

      return Promise.bind(that)
        .then(() => {
          return this.server.authorize(request, response, options)
        })
        .tap(code => {
          res.locals.oauth = { code: code }
          if (this.continueMiddleware) {
            next()
          }
        })
        .then(() => {
          return handleResponse.call(this, req, res, response)
        })
        .catch(e => {
          return handleError.call(this, e, req, res, response, next)
        })
    }
  }

  token(options) {
    let that = this

    return (req, res, next) => {
      let request = new Request(req)
      let response = new Response(res)

      return Promise.bind(that)
        .then(() => {
          return this.server.token(request, response, options)
        })
        .tap(token => {
          res.locals.oauth = { token: token }
          if (this.continueMiddleware) {
            next()
          }
        })
        .then(() => {
          return handleResponse.call(this, req, res, response)
        })
        .catch(e => {
          return handleError.call(this, e, req, res, response, next)
        })
    }
  }
}

/**
 * Handle response.
 */
const handleResponse = (req, res, response) => {
  if (response.status === 302) {
    let location = response.headers.location
    delete response.headers.location
    res.status(200).json({ redirect_uri: location })
  } else {
    res.set(response.headers)
    res.status(response.status).send(response.body)
  }
}

/**
 * Handle error.
 */
const handleError = (e, req, res, response, next) => {
  if (response) {
    res.set(response.headers)
  }

  res.status(e.code)

  if (e instanceof UnauthorizedRequestError) {
    return res.send()
  }

  res.send({ error: e.name, error_description: e.message })
}
