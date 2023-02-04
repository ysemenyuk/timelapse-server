import taskService from '../services/task.service.js';
import { makeTimeName } from '../utils/utils.js';
import { fileCreateType, taskName, taskStatus } from '../utils/constants.js';
import createAndSavePhoto from './createAndSavePhoto.js';
import { createDateInfo, getDateInfo } from './dateInfo.js';
import { fromUnixTime } from 'date-fns';

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
      const { timeRangeType } = photoSettings;
      const isAllTime = timeRangeType === 'allTime';
      const isSunTime = timeRangeType === 'sunTime';
      const isCustomTime = timeRangeType === 'customTime';

      let dateInfo = await getDateInfo({ logger, userId, cameraId });

      if (!dateInfo) {
        dateInfo = await createDateInfo({ logger, userId, cameraId });
      }

      let startTime;
      let stopTime;

      if (isSunTime && dateInfo && dateInfo.weather) {
        const { weather } = dateInfo;
        startTime = makeTimeName(fromUnixTime(weather.sys.sunrise));
        stopTime = makeTimeName(fromUnixTime(weather.sys.sunset));
      } else if (isCustomTime) {
        const { customTimeStart, customTimeStop } = photoSettings;
        startTime = `${customTimeStart}:00`;
        stopTime = `${customTimeStop}:00`;
      } else if (isAllTime) {
        startTime = `00:00:00`;
        stopTime = `23:59:59`;
      } else {
        startTime = `08:00:00`;
        stopTime = `20:00:00`;
      }

      const date = new Date();
      const currentTime = makeTimeName(date);

      logger(`timeRangeType: ${timeRangeType}`);
      logger(`currentTime: ${currentTime}, startTime: ${startTime} stopTime: ${stopTime}`);

      if (currentTime < startTime || currentTime > stopTime) {
        logger(`cancel ${taskName.CREATE_PHOTOS_BY_TIME} job - out of time - `);
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
