import { Server } from 'socket.io';

export default class SocketService {
  constructor(loggerService) {
    this.loggerService = loggerService;
    this.sessions = new Map();
  }

  init(config, sLogger, server) {
    this.socket = new Server(server, {
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
      sLogger('client connected', socket.handshake.auth.userId);
      this.sessions.set(socket.userId, socket);

      socket.on('disconnect', () => {
        sLogger('client disconnect', socket.userId);
        this.sessions.delete(socket.userId);
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
