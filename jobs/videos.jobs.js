import cameraTaskService from '../services/cameraTask.service.js';
import { taskName, taskStatus } from '../utils/constants.js';

const sleep = (time, message = 'Hello') =>
  new Promise((resolve) => {
    setTimeout(() => resolve(message), time);
  });

export default (agenda, socket, workerLogger) => {
  agenda.define(taskName.CREATE_VIDEO_BY_HAND, async (job) => {
    const logger = workerLogger.extend(taskName.CREATE_VIDEO_BY_HAND);

    logger(`start ${taskName.CREATE_VIDEO_BY_HAND} job`);

    const { cameraId, userId, taskId } = job.attrs.data;
    const userSocket = socket.getUserSocket(userId);

    const task = await cameraTaskService.getOneById({ taskId });

    console.log(8888, task);

    try {
      await task.updateOne({ status: taskStatus.RUNNING, startedAt: new Date() });

      userSocket && userSocket.emit('update-task', { cameraId, userId, taskId });

      await sleep(10 * 1000); // doing job

      const video = {
        _id: 111,
        name: 'video',
        type: 'video',
      };

      await task.updateOne({ status: taskStatus.SUCCESSED, finishedAt: new Date() });

      // socket emit update-task, add-file
      userSocket && userSocket.emit('update-task', { cameraId, userId, taskId });
      userSocket && userSocket.emit('add-file', { cameraId, userId, fileId: video._id });
    } catch (error) {
      console.log('-- error createVideo job --', error);

      await task.updateOne({
        status: taskStatus.FAILED,
        finishedAt: new Date(),
        message: `Error: "${error.message}"`,
      });

      userSocket && userSocket.emit('update-task', { cameraId, userId, taskId });
    }

    logger(`finish ${taskName.CREATE_VIDEO_BY_HAND} job`);
  });

  agenda.define(taskName.CREATE_VIDEOS_BY_TIME, async () => {
    const logger = workerLogger.extend(taskName.CREATE_VIDEOS_BY_TIME);

    logger(`start ${taskName.CREATE_VIDEOS_BY_TIME} job`);

    await sleep(10 * 1000);

    logger(`finish ${taskName.CREATE_VIDEOS_BY_TIME} job`);
  });
};
