import cameraTaskService from '../services/cameraTask.service.js';
const sleep = (time, message = 'Hello') =>
  new Promise((resolve) => {
    setTimeout(() => resolve(message), time);
  });

export default (agenda, socket, workerLogger) => {
  agenda.define('CreateVideo', async (job) => {
    const logger = workerLogger.extend('CreateVideo');

    logger('start createVideoFile job');

    const { cameraId, userId, taskId } = job.attrs.data;
    const userSocket = socket.getUserSocket(userId);

    console.log('createVideoFile job.attrs:', { cameraId, userId, taskId });

    try {
      const task = await cameraTaskService.getOneById({
        logger,
        taskId,
      });

      console.log('createVideoFile task', task);

      // create video file
      await sleep(10 * 1000);

      const updatedTask = await cameraTaskService.updateOneById({
        logger,
        taskId,
        payload: { status: 'Successed', finishedAt: new Date() },
      });

      console.log('createVideoFile updatedTask', updatedTask);

      // socket emit updatedTask
      userSocket && userSocket.emit('updateTask', updatedTask);
    } catch (error) {
      console.log('-- error createScreenshot job --', error);

      const updatedTask = await cameraTaskService.updateOneById({
        logger,
        taskId,
        payload: { status: 'Failed', finishedAt: new Date() },
      });

      // socket emit updatedTask
      userSocket && userSocket.emit('updateTask', updatedTask);
    }

    logger('finish createVideoFile job');
  });

  agenda.define('CreateVideosByTime', async (job) => {
    const logger = workerLogger.extend('CreateVideosByTime');

    logger('start CreateVideosByTime job');

    const { cameraId, userId, taskId } = job.attrs.data;

    console.log('CreateVideosByTime job.attrs:', { cameraId, userId, taskId });

    // create video file
    await sleep(10 * 1000);

    logger('finish CreateVideosByTime job');
  });
};
