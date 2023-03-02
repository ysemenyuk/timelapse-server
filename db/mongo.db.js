import mongoose from 'mongoose';
import debug from 'debug';

const dbUri = process.env.MONGO_URI;
const logger = debug('mongo');

class MongoDB {
  constructor() {
    //
  }

  async connect() {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    logger(`Mongoose successfully connected`);
  }
}

export default MongoDB;
