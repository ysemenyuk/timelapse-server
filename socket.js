import { Server } from 'socket.io';
import debug from 'debug';

const logger = debug('socket');

export default (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    logger('user connected');

    socket.on('disconnect', () => {
      logger('user disconnected');
    });
  });

  return io;
};
