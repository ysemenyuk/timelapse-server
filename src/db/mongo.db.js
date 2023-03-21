import mongoose from 'mongoose';

class MongoDB {
  async connect(config, logger) {
    await mongoose.connect(config.dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    logger(`db successfully connected!`);
  }
}

export default MongoDB;
