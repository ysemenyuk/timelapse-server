import 'dotenv/config';
import http from 'http';
import debug from 'debug';
import initDb from './db/index.js';
import initServices from './services/index.js';
import { taskName } from './utils/constants.js';
import config from './consfig.js';

const jobTypes = [taskName.CREATE_PHOTO, taskName.CREATE_VIDEO, taskName.CREATE_PHOTOS_BY_TIME];

//

const startWorker = async () => {
  const logger = debug('worker:server');
  const httpServer = http.createServer();

  try {
    logger(`Starting worker`);

    const repos = await initDb(config);
    const services = initServices(repos);

    const { socketService, storageService, workerService } = services;

    await socketService.init(httpServer);
    await storageService.init();
    await workerService.init();
    await workerService.startJobs(jobTypes, services);

    httpServer.listen(config.port, () => {
      logger(`workerServer running in ${config.mode} mode on port ${config.port}`);
    });
  } catch (e) {
    console.log('catch err', e);
  }
};

//

startWorker();
