const NO_CONTENT = 204

const statusCodeMap = {
  ok: 200,
  created: 201,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  locked: 423,
  internalServerError: 500,
  notImplemented: 501
}

export default function makeRespondMiddleware(opts) {
  opts = Object.assign({}, opts)

  const respond = makeRespond(opts)

  // Installs the functions in the context.
  function patch(ctx) {
    const statusMethods = Object.assign({}, opts.statusMethods, statusCodeMap)
    ctx.send = respond.bind(ctx, ctx)

    // Bind status methods.
    for (const method in statusMethods) {
      const code = statusMethods[method]
      ctx[method] = respond.bind(ctx, ctx, code)
    }

    return ctx
  }

  // The respond middleware adds the methods to the context.
  function respondMiddleware(ctx, next) {
    patch(ctx)
    return next()
  }

  // Tack on the patch method to allow Koa 1 users
  // to install it, too.
  // respondMiddleware.patch = patch
  return respondMiddleware
}

function makeRespond(opts) {
  opts = Object.assign(
    {
      autoMessage: true
    },
    opts
  )

  return function respond(ctx, status, payload) {
    ctx.status = status
    if (status === NO_CONTENT) {
      ctx.body = null
      return ctx
    }

    if (payload === undefined) {
      return ctx
    }

    if (opts.autoMessage && typeof payload === 'string') {
      payload = {
        message: payload
      }
    }

    ctx.body = payload
    return ctx
  }
}
