import SocketService from './socket.service.js';

export default (httpServer) => {
  const socket = new SocketService();
  socket.init(httpServer);
  return socket;
};
