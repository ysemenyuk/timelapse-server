import taskService from '../services/task.service.js';
import { fileCreateType, taskName, taskStatus } from '../utils/constants.js';
import createAndSaveVideo from './createAndSaveVideo.js';

//
//
//

export const createVideoJob = async (data, socket, wLogger) => {
  const logger = wLogger.extend(taskName.CREATE_VIDEO);
  logger(`start ${taskName.CREATE_VIDEO} job`);

  const { cameraId, userId, taskId } = data;

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

    socket.send(userId, 'update-task', { cameraId, userId, task: rtask });

    const video = await createAndSaveVideo({
      logger,
      userId,
      cameraId,
      videoSettings,
      create: fileCreateType.BY_HAND,
    });

    const stask = await taskService.updateOneById({
      taskId,
      payload: {
        status: taskStatus.SUCCESSED,
        finishedAt: new Date(),
        message: `File "${video.name}" successfully saved.`,
      },
    });

    socket.send(userId, 'update-task', { cameraId, userId, task: stask });
    socket.send(userId, 'create-file', { cameraId, userId, file: video });
    logger(`successed ${taskName.CREATE_VIDEO} job`);
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

    socket.send(userId, 'update-task', { cameraId, userId, task: etask });
    logger(`error ${taskName.CREATE_VIDEO} job`);
  }

  logger(`finish ${taskName.CREATE_VIDEO} job`);
};
