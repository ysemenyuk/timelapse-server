import express from 'express';
import mongoose from 'mongoose';
import mongodb from 'mongodb';
import fileUpload from 'express-fileupload';
import debug from 'debug';
import debugMiddleware from './middleware/debugMiddleware.js';
import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware.js';
import http from 'http';
import cors from 'cors';
import initWorker from './worker.js';
import initSocket from './socket.js';
import initStorage from './storage/index.js';
import getRouters from './routes/index.js';
import getControllers from './controllers/index.js';
// import __dirname from './dirname.js';

const mode = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 4000;
// const dbUri = 'mongodb://localhost:27017/timelapse';
const dbUri = process.env.MONGO_URI;


const logger = debug('server');

const app = express();
const httpServer = http.createServer(app);

if (process.env.NODE_ENV === 'development') {
  app.use(debugMiddleware);
}

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const startServer = async () => {
  try {
    console.log(`Starting server`);

    const { MongoClient } = mongodb;

    const mongoClient = new MongoClient(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await mongoClient.connect();


    console.log(`MongoClient successfully Connected`);
    logger(`MongoClient successfully Connected`);

    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(`Mongoose successfully Connected`);
    logger(`Mongoose successfully Connected`);

    const io = initSocket(httpServer);
    const storage = initStorage(mongoClient);

    const worker = await initWorker(mongoClient, storage, io);

    app.io = io;
    app.storage = storage;
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
      console.log(`httpServer running in ${mode} mode on port ${PORT}`);
      logger(`httpServer running in ${mode} mode on port ${PORT}`);
    });
  } catch (e) {
    console.log('catch err', e);
  }
};

startServer();
