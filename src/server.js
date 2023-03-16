import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import registerConfig, { config } from './config.js';
import registerDb from './db/index.js';
import registerServices from './services/index.js';
import registerMiddlewares from './middlewares/index.js';
import registerValidators from './validators/index.js';
import registerControllers from './controllers/index.js';
import createRouters from './routes/index.js';
import Container from './container.js';

//

const startServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(cors());
  app.use(express.json());
  app.use(fileUpload());

  const container = new Container();

  registerConfig(container);
  registerDb(container);
  registerServices(container);

  registerMiddlewares(container);
  registerValidators(container);
  registerControllers(container);

  const routers = createRouters(container);

  const debugMiddleware = container.debugMiddleware;
  const errorHandlerMiddleware = container.errorHandlerMiddleware;

  app.use(debugMiddleware);

  app.use('/files', routers.storageRouter);
  app.use('/api/cameras/:cameraId/tasks', routers.taskRouter);
  app.use('/api/cameras/:cameraId/files', routers.fileRouter);
  app.use('/api/cameras/:cameraId/date-info', routers.dateInfoRouter);
  app.use('/api/cameras', routers.cameraRouter);
  app.use('/api/users', routers.userRouter);

  app.use(errorHandlerMiddleware);

  app.use('/*', (req, res) => {
    res.status(404).send('Sorry cant find that!');
  });

  //

  const loggerService = container.loggerService;
  const logger = loggerService.create('http:server');

  const db = container.db;

  const socketService = container.socketService;
  const storageService = container.storageService;
  const workerService = container.workerService;

  try {
    logger(`Starting server`);

    await db.connect(config);
    logger(`db successfully connected!`);

    await socketService.init(httpServer, logger);
    await storageService.init(config, logger);
    await workerService.init(config, logger);

    httpServer.listen(config.serverPort, () => {
      logger(`httpServer running in ${config.mode} mode on port ${config.serverPort}`);
    });
  } catch (e) {
    console.log('catch err', e);
  }
};

//

startServer();
