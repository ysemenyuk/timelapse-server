import { Server } from 'socket.io';
import debug from 'debug';

const logger = debug('socket');

class Socket {
  constructor(httpServer) {
    this.io = new Server(httpServer, {
      cors: { origin: '*' },
    });

    this.sessions = new Map();
  }

  get instance() {
    return this.io;
  }

  getUserSocket(userId) {
    return this.sessions.get(userId.toString());
  }

  async start() {
    this.io.use((socket, next) => {
      const userId = socket.handshake.auth.userId;

      if (!userId) {
        return next(new Error('invalid userId'));
      }

      socket.userId = userId;

      // TODO: check token

      next();
    });

    this.io.on('connection', (socket) => {
      logger('user connected', socket.handshake.auth.userId);

      this.sessions.set(socket.userId, socket);

      socket.emit('hello', socket.userId);

      console.log(111, this.sessions.has(socket.userId), socket.userId);

      socket.on('disconnect', () => {
        logger('user disconnect', socket.userId);

        this.sessions.delete(socket.userId);
      });
    });
  }
}

export default Socket;
