import taskService from '../services/task.service.js';
import { fileCreateType, taskName, taskStatus } from '../utils/constants.js';
import createAndSaveVideo from './createAndSaveVideo.js';

const sleep = (time, message = 'Hello') =>
  new Promise((resolve) => {
    setTimeout(() => resolve(message), time);
  });

export default (agenda, socket, workerLogger) => {
  agenda.define(taskName.CREATE_VIDEO, async (job) => {
    const logger = workerLogger.extend(taskName.CREATE_VIDEO);

    logger(`start ${taskName.CREATE_VIDEO} job`);

    const { cameraId, userId, taskId } = job.attrs.data;
    const userSocket = socket.getUserSocket(userId);

    let task;

    try {
      task = await taskService.getOneById({ taskId });
      const { videoSettings } = task;

      await task.updateOne({ status: taskStatus.RUNNING, startedAt: new Date() });

      userSocket && userSocket.emit('update-task', { cameraId, userId, taskId });

      await sleep(10 * 1000); // doing job

      const file = await createAndSaveVideo({
        logger,
        userId,
        cameraId,
        videoSettings,
        create: fileCreateType.BY_HAND,
      });

      await task.updateOne({
        status: taskStatus.SUCCESSED,
        finishedAt: new Date(),
        message: `File "${file.name}" successfully saved.`,
      });

      userSocket && userSocket.emit('update-task', { cameraId, userId, taskId });
      userSocket && userSocket.emit('add-file', { cameraId, userId, file });
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

  //
  //
  //

  agenda.define(taskName.CREATE_VIDEOS_BY_TIME, async () => {
    const logger = workerLogger.extend(taskName.CREATE_VIDEOS_BY_TIME);

    logger(`start ${taskName.CREATE_VIDEOS_BY_TIME} job`);

    await sleep(10 * 1000);

    logger(`finish ${taskName.CREATE_VIDEOS_BY_TIME} job`);
  });
};
