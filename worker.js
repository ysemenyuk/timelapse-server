import 'dotenv/config';
import mongoose from 'mongoose';
import debug from 'debug';
import http from 'http';
import worker from './worker/agenda.worker.js';
import storage from './storage/storage.js';
import socket from './socket.js';
import { taskName } from './utils/constants.js';

const PORT = process.env.WPORT || 4001;
const dbUri = process.env.MONGO_URI;
const jobTypes = [taskName.CREATE_PHOTO, taskName.CREATE_VIDEO, taskName.CREATE_PHOTOS_BY_TIME];

const httpServer = http.createServer();
const logger = debug('worker');

//

const startWorker = async () => {
  try {
    logger(`Starting worker`);

    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    logger(`Mongoose in worker successfully Connected`);

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
