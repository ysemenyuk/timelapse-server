import 'dotenv/config';
import express from 'express';
import debug from 'debug';
import http from 'http';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import config from './consfig.js';

// import debugMiddleware from './middleware/debugMiddleware.js';
// import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware.js';
// import cameraRouter from './routes/camera.router.js';
// import fileRouter from './routes/file.router.js';
// import taskRouter from './routes/task.router.js';
// import dateInfoRouter from './routes/dateInfo.router.js';
// import storageRouter from './routes/storage.router.js';
// import userRouter from './routes/user.router.js';
import initDb from './db/index.js';
import initServices from './services/index.js';
import initControllers from './controllers/index.js';
import initRouters from './routes/index.js';
import middlewares from './middlewares/index.js';
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
    const services = await initServices(repos, config);
    const controllers = initControllers(services);
    const routers = initRouters(controllers, middlewares, validators);

    app.use(debugMiddleware);

    app.use('/files', storageRouter);
    app.use('/api/cameras/:cameraId/tasks', taskRouter);
    app.use('/api/cameras/:cameraId/files', fileRouter);
    app.use('/api/cameras/:cameraId/date-info', dateInfoRouter);
    app.use('/api/cameras', cameraRouter);
    app.use('/api/users', userRouter);

    app.use(errorHandlerMiddleware);

    app.use((req, res) => {
      res.status(404).send('Sorry cant find that!');
    });

    httpServer.listen(config.port, () => {
      logger(`httpServer running in ${config.mode} mode on port ${config.port}`);
    });
  } catch (e) {
    console.log('catch err', e);
  }
};

//

startServer();
