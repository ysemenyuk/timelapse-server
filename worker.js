import 'dotenv/config';
import mongoose from 'mongoose';
import debug from 'debug';
import http from 'http';
import worker from './worker/index.js';
import storage from './storage/index.js';
import socket from './socket/index.js';
import { taskName } from './utils/constants.js';

const PORT = process.env.WORKER_PORT;
const dbUri = process.env.MONGO_URI;

const jobTypes = [taskName.CREATE_PHOTO, taskName.CREATE_VIDEO, taskName.CREATE_PHOTOS_BY_TIME];

const logger = debug('worker');
const httpServer = http.createServer();

//

const startWorker = async () => {
  try {
    logger(`Starting worker`);

    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    logger(`Mongoose successfully connected`);

    await storage.start();
    await socket.start(httpServer);
    await worker.start(jobTypes);

    httpServer.listen(PORT, () => {
      logger(`socketServer running on port ${PORT}`);
    });
  } catch (e) {
    console.log('catch err', e);
  }
};

//

startWorker();
