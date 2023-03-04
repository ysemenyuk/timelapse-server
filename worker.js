import 'dotenv/config';
import mongoose from 'mongoose';
import debug from 'debug';
import io from 'socket.io-client';
import worker from './worker/index.js';
import storage from './storage/index.js';
import { taskName } from './utils/constants.js';

const dbUri = process.env.MONGO_URI;
const jobTypes = [taskName.CREATE_PHOTO, taskName.CREATE_VIDEO, taskName.CREATE_PHOTOS_BY_TIME];

//

class Socket {
  constructor() {
    this.logger;
    this.socket;
    this.sessions = new Map();
  }

  async start() {
    this.logger = debug('socket');

    this.socket = io('http://localhost:4000', { autoConnect: true });
    this.socket.auth = { userId: 'worker', token: 'token' };
    this.socket.connect();

    this.socket.on('connect', () => {
      this.logger('socket.on connect', this.socket.connected);
    });

    this.socket.on('connect_error', (err) => {
      this.logger('socket.on connect_error', { err: err.message });
    });
  }

  send(userId, name, data) {
    this.logger('socket.connected', this.socket.connected);

    if (this.socket.connected) {
      const mess = { userId, name, data };
      this.socket.emit('worker', mess);
      this.logger('socket.emit', userId, name);
    }
  }
}

//

const startWorker = async () => {
  const logger = debug('worker');
  const socket = new Socket();

  try {
    logger(`Starting worker`);

    // for models
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    logger(`Mongoose successfully connected`);

    await storage.start();
    await socket.start();
    await worker.start(jobTypes, socket);
  } catch (e) {
    console.log('catch err', e);
  }
};

//

startWorker();
