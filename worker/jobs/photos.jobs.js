import taskService from '../../services/task.service.js';
import { makeTimeName } from '../../utils/utils.js';
import { fileCreateType, taskName, taskStatus } from '../../utils/constants.js';
import createAndSavePhoto from './createAndSavePhoto.js';
import createDateInfoIfNotExist from './createDateInfoIfNotExist.js';
import { fromUnixTime } from 'date-fns';

//
//
//

export const createPhotoJob = async (data, socket, workerLogger) => {
  const logger = workerLogger.extend(taskName.CREATE_PHOTO);
  logger(`start ${taskName.CREATE_PHOTO} job`);

  const { cameraId, userId, taskId } = data;

  try {
    const task = await taskService.getOneById({ taskId });

    await taskService.updateOneById({
      taskId,
      payload: {
        status: taskStatus.RUNNING,
        startedAt: new Date(),
      },
    });

    socket.send(userId, 'update-task', { cameraId, userId, taskId });

    await createDateInfoIfNotExist({ logger, userId, cameraId });

    const photo = await createAndSavePhoto({
      logger,
      userId,
      cameraId,
      taskId,
      settings: task.photoSettings,
      create: fileCreateType.BY_HAND,
    });

    socket.send(userId, 'create-file', { cameraId, userId, fileId: photo._id });

    await taskService.updateOneById({
      taskId,
      payload: {
        status: taskStatus.SUCCESSED,
        finishedAt: new Date(),
        message: `File "${photo.name}" successfully saved.`,
      },
    });

    socket.send(userId, 'update-task', { cameraId, userId, taskId });
    logger(`successed ${taskName.CREATE_PHOTO} job`);
  } catch (error) {
    // console.log('--- error CreatePhoto ---', error);

    await taskService.updateOneById({
      taskId,
      payload: {
        status: taskStatus.FAILED,
        finishedAt: new Date(),
        message: `Error: "${error.message}"`,
      },
    });

    socket.send(userId, 'update-task', { cameraId, userId, taskId });
    logger(`error ${taskName.CREATE_PHOTO} job`);
  }

  logger(`finish ${taskName.CREATE_PHOTO} job`);
};

//
//
//

const getTimeRange = (photoSettings, dateInfo) => {
  const { timeRangeType } = photoSettings;

  const isAllTime = timeRangeType === 'allTime';
  const isSunTime = timeRangeType === 'sunTime';
  const isCustomTime = timeRangeType === 'customTime';

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

  return { startTime, stopTime };
};

//

export const createPhotosByTimeJob = async (data, socket, workerLogger) => {
  const logger = workerLogger.extend(taskName.CREATE_PHOTOS_BY_TIME);

  logger(`start ${taskName.CREATE_PHOTOS_BY_TIME} job`);

  const { cameraId, userId, taskId } = data;

  try {
    const task = await taskService.getOneById({ logger, taskId });
    logger(`timeRangeType: ${task.photoSettings.timeRangeType}`);

    const dateInfo = await createDateInfoIfNotExist({ logger, userId, cameraId });
    const { startTime, stopTime } = getTimeRange(task.photoSettings, dateInfo);

    const currentTime = makeTimeName(new Date());
    logger(`currentTime: ${currentTime}, startTime: ${startTime} stopTime: ${stopTime}`);

    if (currentTime < startTime || currentTime > stopTime) {
      logger(`skip ${taskName.CREATE_PHOTOS_BY_TIME} job - out of time - `);
      return;
    }

    const photo = await createAndSavePhoto({
      logger,
      userId,
      cameraId,
      taskId,
      settings: task.photoSettings,
      create: fileCreateType.BY_TIME,
    });

    logger(`successed ${taskName.CREATE_PHOTOS_BY_TIME} job`);
    socket.send(userId, 'create-file', { cameraId, userId, fileId: photo._id });
  } catch (error) {
    // console.log('--- error CreatePhotosByTime ---', error);

    logger(`error ${taskName.CREATE_PHOTOS_BY_TIME} job`);
    socket.send(userId, 'task-error', { cameraId, userId, taskId, error });
  }

  logger(`finish ${taskName.CREATE_PHOTOS_BY_TIME} job`);
};
