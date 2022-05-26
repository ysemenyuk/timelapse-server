import { Server } from 'socket.io';
import debug from 'debug';

const logger = debug('socket');

class Socket {
  constructor() {
    this.io;
    this.logger = debug('worker');
  }

  start(httpServer) {
    this.io = new Server(httpServer, {
      cors: { origin: '*' },
    });

    this.io.on('connection', (socket) => {
      logger('user connected');

      socket.on('disconnect', () => {
        logger('user disconnected');
      });
    });
  }
}

export default new Socket();
