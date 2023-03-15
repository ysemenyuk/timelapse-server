import mongoose from 'mongoose';
import debug from 'debug';

class MongoDB {
  constructor(container) {
    this.logger = debug('mongo');
    this.config = container.config;
  }

  async connect() {
    await mongoose.connect(this.config.dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    this.logger(`Mongoose successfully connected`);
  }
}

export default MongoDB;
