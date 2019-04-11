import { apiHelper } from './api-helper'

const jobyBasic = Buffer.from('english-app:ppa-hsilgne').toString('base64')

let header = {
  'Content-Type': 'application/x-www-form-urlencoded',
  Authorization: `Basic ${jobyBasic}`
}

let userGlobal = {
  email: 'hibigbob@gmail.com',
  password: 'test'
}

describe('Oauth2 API', () => {
  it('can get token - client_credentials', async () => {
    const api = await apiHelper()

    const result = await api.getToken(
      {
        grant_type: 'client_credentials',
        scope: 'pratice'
      },
      header
    )

    expect(result).toHaveProperty('access_token')
    expect(result).toHaveProperty('token_type')
    expect(result).toHaveProperty('expires_in')
    expect(result).toHaveProperty('refresh_token')
    expect(result).toHaveProperty('scope')
  })

  it('can get token - password', async () => {
    const api = await apiHelper()
    const result = await api.getToken(
      {
        grant_type: 'password',
        scope: 'pratice',
        username: userGlobal.email,
        password: userGlobal.password
      },
      header
    )

    expect(result).toHaveProperty('access_token')
    expect(result).toHaveProperty('token_type')
    expect(result).toHaveProperty('expires_in')
    expect(result).toHaveProperty('refresh_token')
    expect(result).toHaveProperty('scope')
  })
})
