import { makeTimeString } from '../utils/index.js';
import { fileCreateType, taskName, taskStatus } from '../utils/constants.js';
import createAndSavePhoto from './createAndSavePhoto.js';
import createDateInfoIfNotExist from './createDateInfoIfNotExist.js';
import { getTimeRangePhotosByTime } from './helpers.js';

const { CREATE_PHOTO, CREATE_PHOTOS_BY_TIME } = taskName;

//
// createPhotoJob
//

export const createPhotoJob = (services, serverLogger) => async (data) => {
  const { cameraId, userId, taskId } = data;
  const { loggerService, taskService, socketService } = services;

  const logger = loggerService.extend(serverLogger, CREATE_PHOTO);
  logger(`start ${CREATE_PHOTO} job`);

  try {
    const task = await taskService.getOneById({ taskId });
    const { photoSettings } = task;

    const rtask = await taskService.updateOneById({
      taskId,
      payload: {
        status: taskStatus.RUNNING,
        startedAt: new Date(),
      },
    });

    socketService.send(userId, 'update-task', { cameraId, userId, task: rtask });

    await createDateInfoIfNotExist({ services, logger, userId, cameraId });

    const photo = await createAndSavePhoto({
      services,
      logger,
      userId,
      cameraId,
      taskId,
      photoSettings,
      createType: fileCreateType.BY_HAND,
    });

    const stask = await taskService.updateOneById({
      taskId,
      payload: {
        status: taskStatus.SUCCESSED,
        finishedAt: new Date(),
        message: `File "${photo.name}" successfully saved.`,
      },
    });

    socketService.send(userId, 'update-task', { cameraId, userId, task: stask });
    socketService.send(userId, 'create-file', { cameraId, userId, file: photo });

    logger(`successed ${CREATE_PHOTO} job`);
  } catch (error) {
    console.log('--- error CreatePhoto ---', error);

    const etask = await taskService.updateOneById({
      taskId,
      payload: {
        status: taskStatus.FAILED,
        finishedAt: new Date(),
        message: `Error: "${error.message}"`,
      },
    });

    socketService.send(userId, 'update-task', { cameraId, userId, task: etask });
    logger(`error ${CREATE_PHOTO} job`);
  }

  logger(`finish ${CREATE_PHOTO} job`);
};

//
// createPhotosByTimeJob
//

export const createPhotosByTimeJob = (services, serverLogger) => async (data) => {
  const { cameraId, userId, taskId } = data;
  const { loggerService, taskService, socketService } = services;

  const logger = loggerService.extend(serverLogger, CREATE_PHOTOS_BY_TIME);
  logger(`start ${CREATE_PHOTOS_BY_TIME} job`);

  try {
    const task = await taskService.getOneById({ logger, taskId });
    const { photoSettings } = task;

    logger(`timeRangeType: ${photoSettings.timeRangeType}`);

    const dateInfo = await createDateInfoIfNotExist({ services, logger, userId, cameraId });
    const { startTime, endTime } = getTimeRangePhotosByTime(photoSettings, dateInfo);

    const currentTime = makeTimeString(new Date());
    logger(`currentTime: ${currentTime}, startTime: ${startTime} endTime: ${endTime}`);

    if (currentTime < startTime || currentTime > endTime) {
      logger(`skip ${CREATE_PHOTOS_BY_TIME} job - out of time - `);
      return;
    }

    const photo = await createAndSavePhoto({
      services,
      logger,
      userId,
      cameraId,
      taskId,
      photoSettings,
      create: fileCreateType.BY_TIME,
    });

    socketService.send(userId, 'create-file', { cameraId, userId, file: photo });
    logger(`successed ${CREATE_PHOTOS_BY_TIME} job`);
  } catch (error) {
    console.log('--- error CreatePhotosByTime ---', error);

    socketService.send(userId, 'task-error', { cameraId, userId, taskId, error });
    logger(`error ${CREATE_PHOTOS_BY_TIME} job`);
  }

  logger(`finish ${CREATE_PHOTOS_BY_TIME} job`);
};
