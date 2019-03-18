import Oauth2 from '../lib/oauth2'
import Abstract from './abstract'

export default class Oauth2Server extends Abstract {
  constructor(db) {
    super()
    this.oauth2 = new Oauth2(db).getServer()

    this.router.post('/token', this.oauth2.token())
    this.router.get('/authorize', this.oauth2.authorize())
    this.router.get('/validate_authorize', this.oauth2.validateAuthorize())
  }
}
