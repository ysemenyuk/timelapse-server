import 'dotenv/config';
import express from 'express';
import debug from 'debug';
import http from 'http';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import debugMiddleware from './middleware/debugMiddleware.js';
import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware.js';
import cameraRouter from './routes/camera.router.js';
import fileRouter from './routes/file.router.js';
import taskRouter from './routes/task.router.js';
import dateInfoRouter from './routes/dateInfo.router.js';
import storageRouter from './routes/storage.router.js';
import userRouter from './routes/user.router.js';
import db from './db/index.js';
import worker from './worker/index.js';
import storage from './storage/index.js';
import socket from './socket/index.js';
import { taskName } from './utils/constants.js';

//

const mode = process.env.NODE_ENV;
const PORT = process.env.SERVER_PORT;

const jobTypes = [taskName.CREATE_PHOTO, taskName.CREATE_VIDEO, taskName.CREATE_PHOTOS_BY_TIME];

//

const logger = debug('server');

const app = express();
const httpServer = http.createServer(app);

app.use(debugMiddleware);

app.use(cors());
app.use(express.json());
app.use(fileUpload());

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

//

const startServer = async () => {
  try {
    logger(`Starting server`);

    await db.connect();
    await storage.start();
    await socket.start(httpServer);
    await worker.start(jobTypes);

    // nms.run();

    httpServer.listen(PORT, () => {
      logger(`httpServer running in ${mode} mode on port ${PORT}`);
    });
  } catch (e) {
    console.log('catch err', e);
  }
};

//

startServer();
