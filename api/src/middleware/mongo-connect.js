
import * as MongoDB from 'mongodb'

export default (opts) => {
  let db;

  return async function MongoDb(ctx, next) {
    if (!db) {
      try {
        opts = opts || { useNewUrlParser: true };
        const dbHost = process.env.MONGO_HOST || "127.0.0.1";
        const uri = `mongodb://${dbHost}:27017/english`;

        db = await MongoDB.MongoClient.connect(uri, opts);
      } catch (err) {
        console.log(err);
        db = undefined;

        ctx.throw(500, 'Mongo connection error');

        return;
      }
    }

    ctx.db = db;
    return next();
  };
};
