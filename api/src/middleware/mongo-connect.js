
import { MongoClient }  from 'mongodb';

export default (uri, opts) => {
  if (typeof uri !== 'string') {
    throw new TypeError('Expected uri to be a string');
  }

  opts = opts || {};
  const property = opts.property || 'db';

  let db;

  return async function koaMongoDb(ctx, next) {
    if (!db) {
      try {
        db = await MongoClient.connect(uri, opts);
      } catch (err) {
          db = undefined;

          ctx.throw(500, 'Mongo connection error');

          return;
      }
    }

    ctx[property] = db;
    return next();
  };
};
