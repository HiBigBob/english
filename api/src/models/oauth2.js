import sha1 from 'sha1'

const saltKey = 'ewsxdcfvgmlpoiubybhnj,k;l:m!ù!ùm:l;,kjhbfczweok;pl;k,jhgfcd'

export default class Oauth2Model {
  constructor(db) {
    this.collection = db.collection('oauth_tokens')
    this.oauthClient = db.collection('oauth_clients')
    this.oauthClientUsersScope = db.collection('oauth_clients_users_scope')
    this.users = db.collection('users')

    this.getClient = this.getClient.bind(this)
    this.getAccessToken = this.getAccessToken.bind(this)
    this.getRefreshToken = this.getRefreshToken.bind(this)
    this.verifyScope = this.verifyScope.bind(this)
    this.validateScope = this.validateScope.bind(this)
    this.revokeToken = this.revokeToken.bind(this)
    this.getUser = this.getUser.bind(this)
    this.getUserFromClient = this.getUserFromClient.bind(this)
    this.saveToken = this.saveToken.bind(this)
    this.affectScopeToUser = this.affectScopeToUser.bind(this)
  }

  hash(string) {
    return sha1(string.trim() + saltKey)
  }

  getAccessToken(bearerToken) {
    return new Promise((resolve, reject) => {
      this.collection.findOne({ access_token: bearerToken }, (err, data) => {
        if (err) {
          reject(err)
        } else if (!data) {
          resolve()
        } else {
          resolve({
            accessToken: data.access_token,
            clientId: data.client_id,
            accessTokenExpiresAt: data.access_token_expires_on,
            scope: data.scope,
            user: {
              id: data.user_id
            }
          })
        }
      })
    })
  }

  verifyScope(token, scope) {
    return new Promise((resolve, reject) => {
      this.collection.findOne(
        {
          access_token: token.accessToken,
          scope: { $regex: scope, $options: 'i' }
        },
        (err, data) => {
          if (data == null || err) {
            reject(err)
          } else {
            resolve({
              accessToken: data.access_token,
              user: {
                id: data.user_id
              }
            })
          }
        }
      )
    })
  }

  validateScope(user, client, scope) {
    return new Promise((resolve, reject) => {
      this.oauthClient
        .aggregate([
          {
            $match: { client_id: client.id, client_secret: client.clientSecret }
          },
          {
            $lookup: {
              from: 'oauth_clients_users_scope',
              localField: 'client_id',
              foreignField: 'client_id',
              as: 'users_scope'
            }
          }
        ])
        .toArray()
        .then(data => {
          if ((!data && data.length) || !scope) {
            resolve()
          } else {
            data = data[0]
            resolve(data.scope)
          }
        })
    })
  }

  getClient(clientId, clientSecret) {
    let params = { client_id: clientId }

    if (clientSecret) {
      params = Object.assign({}, params, { client_secret: clientSecret })
    }

    return new Promise((resolve, reject) => {
      this.oauthClient.findOne(params, (err, data) => {
        if (err) {
          reject(err)
        } else if (!data) {
          resolve('Invalide client')
        } else {
          resolve({
            id: data.client_id,
            clientSecret: data.client_secret,
            scope: data.scope,
            redirectUris: [data.redirect_uri],
            grants: ['password', 'refresh_token', 'client_credentials']
          })
        }
      })
    })
  }

  getRefreshToken(bearerToken) {
    return new Promise((resolve, reject) => {
      this.collection.findOne({ refresh_token: bearerToken }, (err, data) => {
        if (err) {
          reject(err)
        } else if (!data) {
          // Exception is throwing after
          resolve()
        } else {
          resolve({
            refreshToken: data.refresh_token,
            client: { id: data.client_id },
            user: { id: data.user_id },
            scope: data.scope
          })
        }
      })
    })
  }

  revokeToken(token) {
    return this.collection
      .remove({ refresh_token: token.refreshToken })
      .then(() => {
        return true
      })
  }

  getUser(username, password) {
    return new Promise((resolve, reject) => {
      this.users.findOne({ email: username }, (err, data) => {
        if (err) {
          reject(err)
        } else if (!data) {
          // Exception is throwing after
          resolve()
        } else {
          if (password && data.password === this.hash(password)) {
            resolve(data)
          }
          if (!password) {
            resolve({ _id: data._id, email: data.email })
          } else {
            // Exception is throwing after
            resolve()
          }
        }
      })
    })
  }

  getUserFromClient(client) {
    return new Promise((resolve, reject) => {
      this.oauthClient.findOne(
        { client_id: client.id, client_secret: client.clientSecret },
        (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        }
      )
    })
  }

  saveToken(token, client, user) {
    return this.collection
      .insertOne({
        access_token: token.accessToken,
        access_token_expires_on: token.accessTokenExpiresAt,
        client_id: client.id,
        refresh_token: token.refreshToken,
        refresh_token_expires_on: token.refreshTokenExpiresAt,
        scope: token.scope,
        user_id: user._id
      })
      .then(() => {
        return {
          accessToken: token.accessToken,
          accessTokenExpiresAt: token.accessTokenExpiresAt,
          client: client,
          refreshToken: token.refreshToken,
          refreshTokenExpiresA: token.refreshTokenExpiresAt,
          user: user,
          scope: token.scope
        }
      })
  }

  removeScopeToUserCompanySaas(companyId) {
    return new Promise((resolve, reject) => {
      this.usersModel.collection
        .find({ idCompany: companyId })
        .toArray()
        .then(users => {
          users.forEach(user => {
            return this.oauthClientUsersScope.remove({
              client_id: 'jobypepperpintxo',
              user_id: user._id.toHexString()
            })
          })
        })
        .then(() => {
          resolve()
        })
    })
  }

  affectScopeToUser(clientId, userId, scope) {
    return this.oauthClientUsersScope.insertOne({
      client_id: clientId,
      user_id: userId,
      scope: scope
    })
  }

  saveAuthorizationCode(code, client, user) {
    // TODO IMPLEMENT TO USE AUTHORIZATION CODE
  }

  getAuthorizationCode(code) {
    // TODO IMPLEMENT TO USE AUTHORIZATION CODE
  }

  revokeAuthorizationCode(code) {
    // TODO IMPLEMENT TO USE AUTHORIZATION CODE
  }
}
