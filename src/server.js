import express from 'express';
import http from 'http';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import getMiddlewares from './middlewares/index.js';
import getValidators from './validators/index.js';
import getControllers from './controllers/index.js';
import getRouters from './routes/index.js';
import getJobs from './jobs/index.js';

export default async (config, logger, services, db) => {
  const { socketService, storageService, workerService } = services;

  const app = express();
  const httpServer = http.createServer(app);

  app.use(cors());
  app.use(express.json());
  app.use(fileUpload());

  const controllers = getControllers(services);
  const middlewares = getMiddlewares(services);
  const validators = getValidators();

  const routers = getRouters(controllers, middlewares, validators);

  app.use(middlewares.debugMiddleware);

  app.use('/api/users', routers.userRouter);
  app.use('/api/cameras/:cameraId/tasks', routers.taskRouter);
  app.use('/api/cameras/:cameraId/files', routers.fileRouter);
  app.use('/api/cameras/:cameraId/date-info', routers.dateInfoRouter);
  app.use('/api/cameras', routers.cameraRouter);
  app.use('/files', routers.storageRouter);

  app.use(middlewares.errorHandlerMiddleware);

  app.use('/*', (req, res) => {
    res.status(404).send('Sorry cant find that!');
  });

  try {
    logger(`Starting server`);

    await db.connect(config, logger);
    await socketService.init(config, logger, httpServer);
    await storageService.init(config, logger);
    await workerService.init(config, logger);

    const jobs = getJobs(config, logger, services);

    await workerService.startJobs(jobs, logger);

    return httpServer;
  } catch (e) {
    console.log('catch err', e);
  }
};
