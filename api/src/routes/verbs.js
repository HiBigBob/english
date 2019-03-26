import Abstract from './abstract'
import Verbs from '../models/verbs.js'

export default class Verb extends Abstract {
  constructor(db) {
    super()

    this.model = new Verbs(db)

    this.router.get('/', async (ctx, next) => {
      ctx.ok(await this.model.find(ctx.query))
    })

    this.router.get('/verb/:id', async (ctx, next) => {
      const data = await this.model.findById(ctx.params.id)
      if (data == null) {
        ctx.notFound()
      } else {
        ctx.ok(data)
      }
    })

    this.router.post('/', async (ctx, next) => {
      ctx.created(await this.model.add(ctx.request.body))
    })

    this.router.put('/:id', async (ctx, next) => {
      const data = await this.model.update(ctx.params.id, ctx.request.body)

      if (data === true) {
        ctx.ok({ status: 'success' })
      } else {
        ctx.badRequest()
      }
    })

    this.router.delete('/:id', async (ctx, next) => {
      ctx.noContent(await this.model.remove(ctx.params.id))
    })
  }
}
