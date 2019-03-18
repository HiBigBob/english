import * as MongoDB from 'mongodb'

let db

const connect = async () => {
  if (!db) {
    try {
      const dbHost = process.env.MONGO_HOST || '127.0.0.1'
      const uri = `mongodb://${dbHost}:27017`
      const client = await MongoDB.MongoClient.connect(
        uri,
        { useNewUrlParser: true }
      )
      db = client.db('english')
    } catch (err) {
      console.log(err)
      db = undefined
    }
  }

  return db
}

const store = () => {
  return async (ctx, next) => {
    if (db == null) {
      ctx.throw(500, 'Mongo connection error')
      return
    }

    ctx.db = db
    return next()
  }
}

export { connect, store }
