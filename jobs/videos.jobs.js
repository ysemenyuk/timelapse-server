import cameraTaskService from '../services/cameraTask.service.js';
import { taskName, taskStatus, fileType } from '../utils/constants.js';

const sleep = (time, message = 'Hello') =>
  new Promise((resolve) => {
    setTimeout(() => resolve(message), time);
  });

export default (agenda, socket, workerLogger) => {
  agenda.define(taskName.CREATE_VIDEO, async (job) => {
    const logger = workerLogger.extend(taskName.CREATE_VIDEO);

    logger(`start ${taskName.CREATE_VIDEO} job`);

    const { userId, taskId } = job.attrs.data;
    const userSocket = socket.getUserSocket(userId);

    const task = await cameraTaskService.getOneById({ taskId });

    try {
      await task.updateOne({ status: taskStatus.RUNNING, startedAt: new Date() });

      const video = {
        name: 'video',
        type: fileType.VIDEO,
      };

      await sleep(10 * 1000);

      await task.updateOne({ status: taskStatus.SUCCESSED, finishedAt: new Date() });

      // socket emit update-task, add-file
      userSocket && userSocket.emit('update-task', task);
      userSocket && userSocket.emit('add-file', video);
    } catch (error) {
      console.log('-- error createVideoFile job --', error);

      await task.updateOne({ status: taskStatus.FAILED, finishedAt: new Date() });

      // socket emit updatedTask
      userSocket && userSocket.emit('update-task', task);
    }

    logger(`finish ${taskName.CREATE_VIDEO} job`);
  });

  agenda.define(taskName.CREATE_VIDEOS_BY_TIME, async () => {
    const logger = workerLogger.extend(taskName.CREATE_VIDEOS_BY_TIME);

    logger(`start ${taskName.CREATE_VIDEOS_BY_TIME} job`);

    await sleep(10 * 1000);

    logger(`finish ${taskName.CREATE_VIDEOS_BY_TIME} job`);
  });
};
