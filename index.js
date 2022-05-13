import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import debug from 'debug';
import debugMiddleware from './middleware/debugMiddleware.js';
import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware.js';
import http from 'http';
import cors from 'cors';
import initWorker from './worker.js';
import initSocket from './socket.js';
import getRouters from './routes/index.js';
import getControllers from './controllers/index.js';

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

    const io = initSocket(httpServer);
    const worker = await initWorker(io);

    logger(`worker successfully started`);

    app.io = io;
    app.worker = worker;

    const routers = getRouters();
    const controllers = getControllers();

    app.use('/files', routers.storage());

    app.use('/api/cameras/:cameraId/tasks', routers.cameraTask(controllers.cameraTask()));
    app.use('/api/cameras/:cameraId/files', routers.cameraFile(controllers.cameraFile()));
    app.use('/api/cameras', routers.camera(controllers.camera()));
    app.use('/api/users', routers.user(controllers.user()));

    app.use((req, res) => {
      res.status(404).send('Sorry cant find that!');
    });

    app.use(errorHandlerMiddleware);

    httpServer.listen(PORT, () => {
      logger(`httpServer running in ${mode} mode on port ${PORT}`);
    });
  } catch (e) {
    console.log('catch err', e);
  }
};

startServer();
