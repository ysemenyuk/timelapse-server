import taskService from '../services/task.service.js';
import { getCurrentTime } from '../utils/index.js';
import { fileCreateType, taskName, taskStatus } from '../utils/constants.js';
import createAndSavePhoto from './createAndSavePhoto.js';

const sleep = (time, message = 'Hello') =>
  new Promise((resolve) => {
    setTimeout(() => resolve(message), time);
  });

export default (agenda, socket, workerLogger) => {
  //

  agenda.define(taskName.CREATE_PHOTO, async (job) => {
    const logger = workerLogger.extend(taskName.CREATE_PHOTO);

    logger(`start ${taskName.CREATE_PHOTO} job`);

    const { cameraId, userId, taskId } = job.attrs.data;
    const userSocket = socket.getUserSocket(userId);

    let task;

    try {
      task = await taskService.getOneById({ taskId });
      const { photoSettings } = task;

      await task.updateOne({ status: taskStatus.RUNNING, startedAt: new Date() });
      userSocket && userSocket.emit('update-task', { cameraId, userId, taskId });

      await sleep(5 * 1000); // doing job

      const file = await createAndSavePhoto({
        logger,
        userId,
        cameraId,
        taskId,
        create: fileCreateType.BY_HAND,
        photoSettings,
      });

      await task.updateOne({
        status: taskStatus.SUCCESSED,
        finishedAt: new Date(),
        message: `File "${file.name}" successfully saved.`,
      });

      userSocket && userSocket.emit('update-task', { cameraId, userId, taskId });
      userSocket && userSocket.emit('add-file', { cameraId, userId, file });
    } catch (error) {
      console.log('-- error CreatePhoto job --', error);

      await task.updateOne({
        status: taskStatus.FAILED,
        finishedAt: new Date(),
        message: `Error: "${error.message}"`,
      });

      userSocket && userSocket.emit('update-task', { cameraId, userId, taskId });
    }

    logger(`finish ${taskName.CREATE_PHOTO_BY_HAND} job`);
  });

  //

  agenda.define(taskName.CREATE_PHOTOS_BY_TIME, async (job) => {
    const logger = workerLogger.extend(taskName.CREATE_PHOTOS_BY_TIME);

    logger(`start ${taskName.CREATE_PHOTOS_BY_TIME} job`);

    const { cameraId, userId, taskId } = job.attrs.data;
    const userSocket = socket.getUserSocket(userId);

    let task;

    try {
      task = await taskService.getOneById({ logger, taskId });

      const { photoSettings } = task;
      const { startTime, stopTime } = photoSettings;

      const date = new Date();
      const currentTime = getCurrentTime(date);

      if (currentTime < startTime || currentTime > stopTime) {
        logger(`out of time - currentTime: ${currentTime}, startTime: ${startTime} stopTime: ${stopTime}`);
        logger('cancel CreatePhotosByTime job');
        return;
      }

      const file = await createAndSavePhoto({
        logger,
        userId,
        cameraId,
        taskId,
        create: fileCreateType.BY_TIME,
        photoSettings,
      });

      userSocket && userSocket.emit('add-file', { cameraId, userId, file });
    } catch (error) {
      console.log('CreatePhotosByTime error', error);

      // updateTask ??

      userSocket && userSocket.emit('error', { cameraId, userId, taskId, error });
    }

    logger(`finish ${taskName.CREATE_PHOTOS_BY_TIME} job`);
  });
};
