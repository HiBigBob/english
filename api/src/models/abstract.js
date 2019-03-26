import * as MongoDB from 'mongodb'

export default class Abstract {
  constructor(db, collectionName) {
    this.db = db
    this.collection = db.collection(collectionName)
  }

  ObjectId(id) {
    return typeof id === 'string' ? new MongoDB.ObjectID(id) : id
  }

  findById(id) {
    const query = {
      _id: this.ObjectId(id)
    }

    return this.collection.findOne(query)
  }

  find(query = {}) {
    return this.collection.find(query).toArray()
  }

  async update(id, body) {
    const query = { _id: this.ObjectId(id) }
    const data = await this.collection.updateOne(query, { $set: body })

    return data.result.ok === 1
  }

  async remove(id) {
    const query = { _id: this.ObjectId(id) }
    const data = await this.collection.removeOne(query)

    return data.result.ok === 1
  }

  async add(body) {
    if (Object.keys(body).length === 0) {
      return false
    }

    const data = await this.collection.insertOne(body)
    if (data.insertedId == null) {
      throw data
    }

    const response = await this.findById(data.insertedId)
    return response
  }
}
