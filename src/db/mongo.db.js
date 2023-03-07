import mongoose from 'mongoose';
import debug from 'debug';

const dbUri = process.env.MONGO_URI;

class MongoDB {
  constructor() {
    //
  }

  async connect() {
    const logger = debug('mongo');

    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    logger(`Mongoose successfully connected`);
  }
}

export default MongoDB;
