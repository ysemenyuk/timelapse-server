import taskService from '../../services/task.service.js';
import { fileCreateType, taskName, taskStatus } from '../../utils/constants.js';
import createAndSaveVideo from './createAndSaveVideo.js';

//
//
//

export const createVideoJob = async (data, socket, workerLogger) => {
  const logger = workerLogger.extend(taskName.CREATE_VIDEO);
  logger(`start ${taskName.CREATE_VIDEO} job`);

  const { cameraId, userId, taskId } = data;

  try {
    const task = await taskService.getOneById({ taskId });
    const { videoSettings } = task;

    await taskService.updateOneById({
      taskId,
      payload: {
        status: taskStatus.RUNNING,
        startedAt: new Date(),
      },
    });

    socket.send(userId, 'update-task', { cameraId, userId, taskId });

    const file = await createAndSaveVideo({
      logger,
      userId,
      cameraId,
      videoSettings,
      create: fileCreateType.BY_HAND,
    });

    socket.send(userId, 'create-file', { cameraId, userId, fileId: file._id });

    await taskService.updateOneById({
      taskId,
      payload: {
        status: taskStatus.SUCCESSED,
        finishedAt: new Date(),
        message: `File "${file.name}" successfully saved.`,
      },
    });

    socket.send(userId, 'update-task', { cameraId, userId, taskId });
    logger(`successed ${taskName.CREATE_VIDEO} job`);
  } catch (error) {
    // console.log('-- error createVideo job --', error);

    await taskService.updateOneById({
      taskId,
      payload: {
        status: taskStatus.FAILED,
        finishedAt: new Date(),
        message: `Error: "${error.message}"`,
      },
    });

    socket.send(userId, 'update-task', { cameraId, userId, taskId });
    logger(`error ${taskName.CREATE_VIDEO} job`);
  }

  logger(`finish ${taskName.CREATE_VIDEO} job`);
};
