import { Server } from 'socket.io';
import debug from 'debug';

const logger = debug('socket');

class Socket {
  constructor() {
    this.socket;
    this.sessions = new Map();
  }

  async start(httpServer) {
    this.socket = new Server(httpServer, {
      cors: { origin: '*' },
    });

    this.socket.use((socket, next) => {
      const userId = socket.handshake.auth.userId;

      if (!userId) {
        return next(new Error('invalid userId'));
      }

      socket.userId = userId;

      // TODO: check token

      next();
    });

    this.socket.on('connection', (socket) => {
      logger('user connected', socket.handshake.auth.userId);
      this.sessions.set(socket.userId, socket);

      socket.emit('hello', socket.userId);

      socket.on('disconnect', () => {
        logger('user disconnect', socket.userId);
        this.sessions.delete(socket.userId);
      });
    });
  }

  getUserSocket(userId) {
    return this.sessions.get(userId.toString());
  }

  send(userId, name, data) {
    const userSocet = this.sessions.get(userId.toString());
    if (!userSocet) {
      return;
    }
    userSocet.emit(name, data);
  }
}

const socket = new Socket();

export default socket;
