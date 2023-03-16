import 'dotenv/config';
import registerConfig, { config } from './config.js';
import registerDb from './db/index.js';
import registerServices from './services/index.js';
import Container from './container.js';
import jobs from './jobs/jobs.js';

//

const startWorker = async () => {
  const container = new Container();

  registerConfig(container);
  registerDb(container);
  registerServices(container);

  const db = container.db;

  const storageService = container.storageService;
  const workerService = container.workerService;

  const loggerService = container.loggerService;
  const logger = loggerService.create('worker:server');

  try {
    logger(`Starting worker`);

    await db.connect(config);
    logger(`db successfully connected!`);

    await storageService.init(config, logger);
    await workerService.init(config, logger);

    const { jobTypesToStart } = config;

    const jobsDeps = {
      storageService: container.storageService,
      cameraService: container.cameraService,
      taskService: container.taskService,
      fileService: container.fileService,
      dateInfoService: container.dateInfoService,
      loggerService: container.loggerService,
      fsService: container.fsService,
      httpService: container.httpService,
      videoService: container.videoService,
      imageService: container.imageService,
      weatherService: container.weatherService,
      brokerService: { send: () => {} },
    };

    await workerService.startJobs(jobTypesToStart, jobs, jobsDeps, logger);
  } catch (e) {
    console.log('catch worker err', e);
  }
};

//

startWorker();
