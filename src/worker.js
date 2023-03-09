import 'dotenv/config';
import debug from 'debug';
import http from 'http';
import config from './config.js';
import { taskName } from './utils/constants.js';
import initDb from './db/index.js';
import initServices from './services/index.js';
import initSocketService from './services/socketService/index.js';

const jobTypes = [taskName.CREATE_PHOTO, taskName.CREATE_VIDEO, taskName.CREATE_PHOTOS_BY_TIME];

//

const startWorker = async () => {
  const logger = debug('worker:server');
  const httpServer = http.createServer();

  try {
    logger(`Starting worker`);

    const repos = await initDb(config);

    const services = await initServices(repos);

    services.socketService = initSocketService(httpServer);

    await services.workerService.startJobs(jobTypes, services);

    httpServer.listen(config.workerPort, () => {
      logger(`workerServer running in ${config.mode} mode on port ${config.workerPort}`);
    });
  } catch (e) {
    console.log('catch err', e);
  }
};

//

startWorker();
