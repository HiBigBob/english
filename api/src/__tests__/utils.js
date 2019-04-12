import { ObjectId as MongoDBObjectId } from 'mongodb'

function ISODate(date) {
  return new Date(date)
}

function ObjectId(id) {
  return MongoDBObjectId(id)
}

export { ISODate, ObjectId }
