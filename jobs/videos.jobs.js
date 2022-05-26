import cameraTaskService from '../services/cameraTask.service.js';
const sleep = (time, message = 'Hello') =>
  new Promise((resolve) => {
    setTimeout(() => resolve(message), time);
  });

export default (agenda, socket, logger) => {
  agenda.define('CreateVideo', async (job) => {
    const logg = logger.extend('CreateVideo');

    logg('start createVideoFile job');

    const { cameraId, userId, taskId } = job.attrs.data;

    console.log(1111, 'createVideoFile job.attrs:', { cameraId, userId, taskId });

    const task = await cameraTaskService.getOneById({
      logger: logg,
      taskId,
    });

    console.log(3333, 'createVideoFile task', task);

    // create video file
    await sleep(10 * 1000);

    const updatedTask = await cameraTaskService.updateOneById({
      logger: logg,
      taskId,
      payload: { status: 'Successed', finishedAt: new Date() },
    });

    console.log(4444, 'createVideoFile updatedTask', updatedTask);

    logg('finish createVideoFile job');
  });

  agenda.define('CreateVideosByTime', async (job) => {
    const logg = logger.extend('CreateVideosByTime');

    logg('start CreateVideosByTime job');

    const { cameraId, userId, taskId } = job.attrs.data;

    console.log(1111, 'CreateVideosByTime job.attrs:', { cameraId, userId, taskId });

    // create video file
    await sleep(10 * 1000);

    logg('finish CreateVideosByTime job');
  });
};
