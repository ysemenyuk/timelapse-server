import { Server } from 'socket.io';
import debug from 'debug';

const logger = debug('socket');

class Socket {
  constructor() {
    this.io = null;
    this.logger = debug('socket');
    this.sessions = new Map();
  }

  get instance() {
    return this.io;
  }

  getUserSocket(username) {
    return this.sessions.get(username);
  }

  async start(httpServer) {
    this.io = new Server(httpServer, {
      cors: { origin: '*' },
    });

    // this.io.use((socket, next) => {
    //   const username = socket.handshake.auth.username;
    //   console.log(1111111, 'user connected', socket.handshake.auth);

    //   if (!username) {
    //     return next(new Error('invalid username'));
    //   }

    //   socket.username = username;
    //   next();
    // });

    this.io.on('connection', async (socket) => {
      // logger('user connected');

      console.log(1111111, 'user connected', socket.handshake.auth);

      const userId = socket.handshake.auth.userId;
      socket.userId = userId;

      this.sessions.set(socket.userId, socket);

      socket.emit('hello', socket.userId);

      socket.on('disconnect', () => {
        console.log(2222222, 'user disconnect');

        this.sessions.delete(socket.userId);
      });
    });
  }
}

export default Socket;
