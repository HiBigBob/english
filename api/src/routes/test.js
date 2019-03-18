import Abstract from './abstract'

export default class Test extends Abstract {
  constructor() {
    super()

    this.router.get('/', async (ctx, next) => {
      ctx.ok(
        await ctx.db
          .collection('tests')
          .find({})
          .toArray()
      )
    })
  }
}
