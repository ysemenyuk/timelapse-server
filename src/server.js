import 'dotenv/config';
import express from 'express';
import debug from 'debug';
import http from 'http';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import config from './config.js';
import initDb from './db/index.js';
import initServices from './services/index.js';
import initControllers from './controllers/index.js';
import initRouters from './routes/index.js';
import initMiddlewares from './middlewares/index.js';
import validators from './validators/index.js';

//

const startServer = async () => {
  const logger = debug('http:server');
  const app = express();
  const httpServer = http.createServer(app);

  app.use(cors());
  app.use(express.json());
  app.use(fileUpload());

  try {
    logger(`Starting server`);

    const repos = await initDb(config);
    const services = await initServices(repos);

    const controllers = initControllers(services);
    const middlewares = initMiddlewares(services);
    const routers = initRouters(controllers, middlewares, validators, services);

    app.use(middlewares.debugMiddleware);

    app.use('/files', routers.storageRouter);
    app.use('/api/cameras/:cameraId/tasks', routers.taskRouter);
    app.use('/api/cameras/:cameraId/files', routers.fileRouter);
    app.use('/api/cameras/:cameraId/date-info', routers.dateInfoRouter);
    app.use('/api/cameras', routers.cameraRouter);
    app.use('/api/users', routers.userRouter);

    app.use(middlewares.errorHandlerMiddleware);

    app.use('/*', (req, res) => {
      res.status(404).send('Sorry cant find that!');
    });

    httpServer.listen(config.serverPort, () => {
      logger(`httpServer running in ${config.mode} mode on port ${config.serverPort}`);
    });
  } catch (e) {
    console.log('catch err', e);
  }
};

//

startServer();
