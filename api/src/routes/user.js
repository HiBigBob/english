import Oauth2 from '../lib/oauth2'
import Abstract from './abstract'

export default class User extends Abstract {
  constructor(db) {
    super()

    this.oauth2 = new Oauth2(db).getServer()

    this.router.use(this.oauth2.authenticate({ scope: 'practice' }))

    this.router.get('/', async (ctx, next) => {
      const data = await ctx.db
        .collection('users')
        .findOne({ _id: ctx.state.oauth.token.user.id })

      delete data.password

      ctx.ok(data)
    })
  }
}
