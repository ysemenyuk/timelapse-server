import mongoose from 'mongoose';
import debug from 'debug';

export default class MongoDB {
  constructor() {
    this.logger = debug('mongo');
  }

  async connect(config) {
    await mongoose.connect(config.dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    this.logger(`Mongoose successfully connected`);
  }
}
