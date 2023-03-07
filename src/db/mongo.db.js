import mongoose from 'mongoose';
import debug from 'debug';

import userRepo from './repos/user.repo.js';
import taskRepo from './repos/task.repo.js';

const repos = { userRepo, taskRepo };

class MongoDB {
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

    return repos;
  }
}

export default MongoDB;
