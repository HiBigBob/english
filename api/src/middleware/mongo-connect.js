
import * as MongoDB from 'mongodb'

export default (opts) => {
  let db;

  return async (ctx, next) => {
    if (!db) {
      try {
        opts = opts || { useNewUrlParser: true };
        const dbHost = process.env.MONGO_HOST || "127.0.0.1";
        const uri = `mongodb://${dbHost}:27017`;
        const client = await MongoDB.MongoClient.connect(uri, opts);
        db = client.db('english');
      } catch (err) {
        console.log(err);
        db = undefined;

        ctx.throw(500, 'Mongo connection error');

        return;
      }
    }

    ctx.db = db
    return next();
  };
};
