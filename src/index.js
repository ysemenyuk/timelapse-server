import 'dotenv/config';
import config from './config.js';
import MongoDB from './db/mongo.db.js';
import getServices from './services/index.js';
import getServer from './server.js';
import getJobs from './jobs/index.js';

const start = async () => {
  const db = new MongoDB();

  const services = getServices(config);
  const server = getServer(services);

  const { loggerService, socketService, storageService, workerService } = services;

  const logger = loggerService.createLogger('server');

  try {
    logger(`Starting server`);

    await db.connect(config, logger);
    await socketService.init(config, logger, server);
    await storageService.init(config, logger);
    await workerService.init(config, logger);

    const jobs = getJobs(config, logger, services);

    await workerService.startJobs(config, logger, jobs);

    server.listen(config.port, () => {
      logger(`server running in ${config.mode} mode on port ${config.port}`);
    });
  } catch (e) {
    console.log('catch err', e);
  }
};

//

start();
