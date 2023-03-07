import 'dotenv/config';
import express from 'express';
import debug from 'debug';
import http from 'http';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { debugMiddleware, errorHandlerMiddleware } from './middlewares/index.js';
import routers from './routes/index.js';
import MongoDB from './db/index.js';
import { workerService, storageService } from './services/index.js';
import config from './config.js';

//

const startServer = async () => {
  const logger = debug('http:server');
  const app = express();
  const httpServer = http.createServer(app);
  const db = new MongoDB();

  app.use(debugMiddleware);

  app.use(cors());
  app.use(express.json());
  app.use(fileUpload());

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

  try {
    logger(`Starting server`);

    await db.connect(config);
    await storageService.init(config);
    await workerService.init(config);

    // nms.run();

    httpServer.listen(config.serverPort, () => {
      logger(`httpServer running in ${config.mode} mode on port ${config.serverPort}`);
    });
  } catch (e) {
    console.log('catch err', e);
  }
};

//

startServer();
