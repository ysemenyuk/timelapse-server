//

export const socketNotification = async (data, socket, wLogger) => {
  const logger = wLogger.extend('socketNotification');
  logger(`start socketNotification job`);

  const { userId, name, message } = data;
  socket.send(userId, name, message);

  logger(`finish socketNotification job`);
};
