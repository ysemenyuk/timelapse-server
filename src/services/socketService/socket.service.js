import { Server } from 'socket.io';

export default class SocketService {
  constructor(loggerService) {
    this.loggerService = loggerService;
    this.sessions = new Map();
  }

  init(config, sLogger, httpServer) {
    const logger = this.loggerService.extend(sLogger, 'socket');

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
      logger('client connected', socket.handshake.auth.userId);
      this.sessions.set(socket.userId, socket);

      socket.on('disconnect', () => {
        logger('client disconnect', socket.userId);
        this.sessions.delete(socket.userId);
      });

      socket.on('http-server', (mess) => {
        logger('http-server mess.name to mess.userId:', mess.name, mess.userId.toString());
        const { userId, name, data } = mess;
        this.send(userId, name, data);
      });
    });

    sLogger('socketService successfully started!');
  }

  send(userId, name, data) {
    const userSocet = this.sessions.get(userId.toString());
    if (userSocet) {
      userSocet.emit(name, data);
    }
  }
}
