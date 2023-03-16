import mongoose from 'mongoose';

class MongoDB {
  async connect(config) {
    await mongoose.connect(config.dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    return `Mongoose successfully connected`;
  }
}

export default MongoDB;
