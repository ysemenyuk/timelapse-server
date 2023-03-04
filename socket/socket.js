import { Server } from 'socket.io';
import debug from 'debug';

class Socket {
  constructor() {
    this.logger;
    this.socket;
    this.sessions = new Map();
  }

  async start(httpServer) {
    this.logger = debug('socket');

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
      this.logger('client connected', socket.handshake.auth.userId);
      this.sessions.set(socket.userId, socket);

      socket.on('disconnect', () => {
        this.logger('client disconnect', socket.userId);
        this.sessions.delete(socket.userId);
      });

      socket.on('worker', (mess) => {
        this.logger('worker mess.name to mess.userId:', mess.name, mess.userId.toString());
        const { userId, name, data } = mess;
        this.send(userId, name, data);
      });
    });
  }

  getUserSocket(userId) {
    return this.sessions.get(userId.toString());
  }

  send(userId, name, data) {
    const userSocet = this.sessions.get(userId.toString());
    if (userSocet) {
      userSocet.emit(name, data);
    }
  }
}

export default Socket;
