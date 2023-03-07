import { Server } from 'socket.io';
import http from 'http';
import debug from 'debug';

export default class Socket {
  constructor() {
    this.logger = debug('socket');
    this.sessions = new Map();
  }

  init() {
    const httpServer = http.createServer();
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

      socket.on('http-server', (mess) => {
        this.logger('http-server mess.name to mess.userId:', mess.name, mess.userId.toString());
        const { userId, name, data } = mess;
        this.send(userId, name, data);
      });
    });

    return httpServer;
  }

  send(userId, name, data) {
    const userSocet = this.sessions.get(userId.toString());
    if (userSocet) {
      userSocet.emit(name, data);
    }
  }
}
