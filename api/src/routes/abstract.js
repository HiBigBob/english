import Router from 'koa-router'

export default class Abstract {
  constructor() {
    this.router = new Router()
  }

  getRouter() {
    return this.router.routes()
  }
}
