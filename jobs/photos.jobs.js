import taskService from '../services/task.service.js';
import { makeTimeName } from '../utils/utils.js';
import { fileCreateType, taskName, taskStatus } from '../utils/constants.js';
import createAndSavePhoto from './createAndSavePhoto.js';
import { createDateInfo, getDateInfo } from './dateInfo.js';

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

      let dateInfo = await getDateInfo({ logger, userId, cameraId });

      if (!dateInfo) {
        dateInfo = await createDateInfo({ logger, userId, cameraId });
      }

      const file = await createAndSavePhoto({
        logger,
        userId,
        cameraId,
        taskId,
        photoSettings,
        create: fileCreateType.BY_HAND,
      });

      await task.updateOne({
        status: taskStatus.SUCCESSED,
        finishedAt: new Date(),
        message: `File "${file.name}" successfully saved.`,
      });

      userSocket && userSocket.emit('update-task', { cameraId, userId, taskId });
      userSocket && userSocket.emit('create-file', { cameraId, userId, file });
    } catch (error) {
      console.log('-- error CreatePhoto job --', error);

      await task.updateOne({
        status: taskStatus.FAILED,
        finishedAt: new Date(),
        message: `Error: "${error.message}"`,
      });

      userSocket && userSocket.emit('update-task', { cameraId, userId, taskId });
    }

    logger(`finish ${taskName.CREATE_PHOTO} job`);
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

      let dateInfo = await getDateInfo({ logger, userId, cameraId });

      if (!dateInfo) {
        dateInfo = await createDateInfo({ logger, userId, cameraId });
      }

      let startTime = photoSettings.startTime;
      let stopTime = photoSettings.stopTime;

      // const dateInfo = await getDateInfo();
      if (dateInfo && dateInfo.weather && photoSettings.bySun) {
        const { weather } = dateInfo;
        startTime = makeTimeName(new Date(weather.sys.sunrise));
        stopTime = makeTimeName(new Date(weather.sys.sunset));
      }

      // const date = new Date();
      const currentTime = makeTimeName(new Date());

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
        photoSettings,
        create: fileCreateType.BY_TIME,
      });

      userSocket && userSocket.emit('create-file', { cameraId, userId, file });
    } catch (error) {
      console.log('CreatePhotosByTime error', error);

      // updateTask ??

      userSocket && userSocket.emit('error', { cameraId, userId, taskId, error });
    }

    logger(`finish ${taskName.CREATE_PHOTOS_BY_TIME} job`);
  });
};
