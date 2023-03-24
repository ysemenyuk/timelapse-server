import express from 'express';
import http from 'http';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import getMiddlewares from './middlewares/index.js';
import getValidators from './validators/index.js';
import getControllers from './controllers/index.js';
import getRouters from './routes/index.js';

export default (services) => {
  const app = express();
  const server = http.createServer(app);

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
    res.status(200).send('server is running');
  });

  return server;
};
