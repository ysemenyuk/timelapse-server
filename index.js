import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import debug from 'debug';
import http from 'http';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import debugMiddleware from './middleware/debugMiddleware.js';
import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware.js';
import Worker from './worker.js';
import Socket from './socket.js';
import cameraRouter from './routes/camera.router.js';
import cameraFileRouter from './routes/cameraFile.router.js';
import cameraTaskRouter from './routes/cameraTask.router.js';
import storageRouter from './routes/storage.router.js';
import userRouter from './routes/user.router.js';

const mode = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 4000;
const dbUri = process.env.MONGO_URI;

const app = express();
const httpServer = http.createServer(app);
const logger = debug('server');

if (mode === 'development') {
  app.use(debugMiddleware);
}

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const startServer = async () => {
  try {
    logger(`Starting server`);

    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    logger(`Mongoose successfully Connected`);

    const socket = new Socket(httpServer);
    await socket.start();

    const worker = new Worker(socket);
    await worker.start();

    app.socket = socket;
    app.worker = worker;

    app.use('/files', storageRouter);

    app.use('/api/cameras/:cameraId/tasks', cameraTaskRouter);
    app.use('/api/cameras/:cameraId/files', cameraFileRouter);
    app.use('/api/cameras', cameraRouter);
    app.use('/api/users', userRouter);

    app.use(errorHandlerMiddleware);

    app.use((req, res) => {
      res.status(404).send('Sorry cant find that!');
    });

    httpServer.listen(PORT, () => {
      logger(`httpServer running in ${mode} mode on port ${PORT}`);
    });
  } catch (e) {
    console.log('catch err', e);
  }
};

startServer();
