import 'dotenv/config';
import http from 'http';
import mongoose from 'mongoose';
import debug from 'debug';
// import io from 'socket.io-client';
import socket from './socket/index.js';
import worker from './worker/index.js';
import storage from './storage/index.js';
import { taskName } from './utils/constants.js';

const mode = process.env.NODE_ENV;
const PORT = process.env.WORKER_PORT;
const dbUri = process.env.MONGO_URI;

const jobTypes = [taskName.CREATE_PHOTO, taskName.CREATE_VIDEO, taskName.CREATE_PHOTOS_BY_TIME];

//

const startWorker = async () => {
  const logger = debug('worker:server');
  const httpServer = http.createServer();

  try {
    logger(`Starting worker`);

    // for models
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    logger(`Mongoose successfully connected`);

    await storage.start();
    await socket.start(httpServer);
    await worker.startJobs(jobTypes, socket);

    httpServer.listen(PORT, () => {
      logger(`workerServer running in ${mode} mode on port ${PORT}`);
    });
  } catch (e) {
    console.log('catch err', e);
  }
};

//

startWorker();
