import { fileCreateType, taskName, taskStatus } from '../utils/constants.js';
import createAndSaveVideo from './createAndSaveVideo.js';

const { CREATE_VIDEO, CREATE_VIDEOS_BY_TIME } = taskName;

//
// createVideoJob
//

export const createVideoJob = (services) => async (data) => {
  const { cameraId, userId, taskId } = data;
  const { loggerService, taskService, socketService } = services;

  const logger = loggerService.createLogger('worker:', CREATE_VIDEO);
  logger(`start ${CREATE_VIDEO} job`);

  try {
    const task = await taskService.getOneById({ taskId });
    const { videoSettings } = task;

    const rtask = await taskService.updateOneById({
      taskId,
      payload: {
        status: taskStatus.RUNNING,
        startedAt: new Date(),
      },
    });

    socketService.send(userId, 'update-task', { cameraId, userId, task: rtask });

    const video = await createAndSaveVideo({
      services,
      logger,
      userId,
      cameraId,
      videoSettings,
      createType: fileCreateType.BY_HAND,
    });

    const stask = await taskService.updateOneById({
      taskId,
      payload: {
        status: taskStatus.SUCCESSED,
        finishedAt: new Date(),
        message: `File "${video.name}" successfully saved.`,
      },
    });

    socketService.send(userId, 'update-task', { cameraId, userId, task: stask });
    socketService.send(userId, 'create-file', { cameraId, userId, file: video });
    logger(`successed ${CREATE_VIDEO} job`);
  } catch (error) {
    console.log('-- error createVideo job --', error);

    const etask = await taskService.updateOneById({
      taskId,
      payload: {
        status: taskStatus.FAILED,
        finishedAt: new Date(),
        message: `Error: "${error.message}"`,
      },
    });

    socketService.send(userId, 'update-task', { cameraId, userId, task: etask });
    logger(`error ${CREATE_VIDEO} job`);
  }

  logger(`finish ${CREATE_VIDEO} job`);
};

//
// createVideosByTimeJob
//

export const createVideosByTimeJob = (services) => async (data) => {
  const { cameraId, userId, taskId } = data;
  const { loggerService, taskService, socketService } = services;

  const logger = loggerService.createLogger('worker:', CREATE_VIDEOS_BY_TIME);
  logger(`start ${CREATE_VIDEOS_BY_TIME} job`);

  try {
    const task = await taskService.getOneById({ taskId });
    const { videoSettings } = task;

    const video = await createAndSaveVideo({
      services,
      logger,
      userId,
      cameraId,
      videoSettings,
      createType: fileCreateType.BY_HAND,
    });

    socketService.send(userId, 'create-file', { cameraId, userId, file: video });
    logger(`successed ${CREATE_VIDEOS_BY_TIME} job`);
  } catch (error) {
    console.log('-- error createVideo job --', error);

    socketService.send(userId, 'task-error', { cameraId, userId, taskId, error });
    logger(`error ${CREATE_VIDEOS_BY_TIME} job`);
  }

  logger(`finish ${CREATE_VIDEOS_BY_TIME} job`);
};
