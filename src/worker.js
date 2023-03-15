import 'dotenv/config';
import registerConfig from './config.js';
import registerDb from './db/index.js';
import registerServices from './services/index.js';
import Container from './container.js';

//

const startWorker = async () => {
  const container = new Container();

  registerConfig(container);

  registerDb(container);
  registerServices(container);

  const db = container.db;

  const storage = container.storageService;
  const worker = container.workerService;

  const logger = container.loggerService.create('worker:server');

  try {
    logger(`Starting worker`);

    await db.connect();

    await storage.init();
    await worker.init();

    await worker.startJobs(container);
  } catch (e) {
    console.log('catch worker err', e);
  }
};

//

startWorker();
