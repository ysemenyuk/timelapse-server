import 'dotenv/config';
import http from 'http';
import debug from 'debug';
import MongoDB from './db/index.js';
import { workerService, storageService } from './services/index.js';
import SocketService from './services/socketService/socket.service.js';
import { taskName } from './utils/constants.js';
import config from './config.js';

const jobTypes = [taskName.CREATE_PHOTO, taskName.CREATE_VIDEO, taskName.CREATE_PHOTOS_BY_TIME];

//

const startWorker = async () => {
  const logger = debug('worker:server');
  const httpServer = http.createServer();
  const db = new MongoDB();
  const socketService = new SocketService();

  socketService.init(httpServer);

  try {
    logger(`Starting worker`);

    await db.connect(config);
    await storageService.init(config);
    await workerService.init(config);

    await workerService.startJobs(jobTypes, socketService);

    httpServer.listen(config.workerPort, () => {
      logger(`workerServer running in ${config.mode} mode on port ${config.workerPort}`);
    });
  } catch (e) {
    console.log('catch err', e);
  }
};

//

startWorker();
