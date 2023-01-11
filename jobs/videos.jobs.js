import cameraService from '../services/camera.service.js';
import cameraFileService from '../services/cameraFile.service.js';
import cameraTaskService from '../services/cameraTask.service.js';
import { taskName, taskStatus } from '../utils/constants.js';
// import { makeFileName } from '../utils/index.js';
import storageService from '../services/storage.service.js';

const sleep = (time, message = 'Hello') =>
  new Promise((resolve) => {
    setTimeout(() => resolve(message), time);
  });

export default (agenda, socket, workerLogger) => {
  agenda.define(taskName.CREATE_VIDEO_BY_HAND, async (job) => {
    const logger = workerLogger.extend(taskName.CREATE_VIDEO_BY_HAND);

    logger(`start ${taskName.CREATE_VIDEO_BY_HAND} job`);

    const { cameraId, userId, taskId } = job.attrs.data;
    const userSocket = socket.getUserSocket(userId);

    let task;

    try {
      task = await cameraTaskService.getOneById({ taskId });
      const { videoSettings } = task;

      console.log('task', task);

      await task.updateOne({ status: taskStatus.RUNNING, startedAt: new Date() });

      userSocket && userSocket.emit('update-task', { cameraId, userId, taskId });

      //

      await sleep(10 * 1000); // doing job

      //

      const camera = await cameraService.getOneById({ cameraId });
      const { videosByHandFolder } = camera;

      const date = new Date();
      const fileName = 'DJI_0225.mp4';
      const fileNameOnDisk = 'DJI_0225.mp4';
      const filePathOnDisk = [...videosByHandFolder.pathOnDisk, videosByHandFolder.nameOnDisk];

      const stat = await storageService.fileStat({ logger, filePath: filePathOnDisk, fileName: fileNameOnDisk });

      const video = await cameraFileService.createFile({
        logger,
        date,
        user: userId,
        camera: camera._id,
        parent: videosByHandFolder._id,
        pathOnDisk: filePathOnDisk,
        nameOnDisk: fileNameOnDisk,
        name: fileName,
        type: 'video',
        fileType: 'videp/mp4',
        createType: 'byHand',
        data: undefined,
        videoData: {
          startDate: videoSettings.startDate,
          endDate: videoSettings.endDate,
          fps: videoSettings.fps,
          duration: videoSettings.duration,
          // poster: '',  // photo id
          size: stat.size,
        },
      });

      await task.updateOne({
        status: taskStatus.SUCCESSED,
        finishedAt: new Date(),
        message: `File "${video.name}" successfully saved.`,
      });

      // socket emit update-task, add-file
      userSocket && userSocket.emit('update-task', { cameraId, userId, taskId });
      userSocket && userSocket.emit('add-file', { cameraId, userId, fileId: video._id });
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

  agenda.define(taskName.CREATE_VIDEOS_BY_TIME, async () => {
    const logger = workerLogger.extend(taskName.CREATE_VIDEOS_BY_TIME);

    logger(`start ${taskName.CREATE_VIDEOS_BY_TIME} job`);

    await sleep(10 * 1000);

    logger(`finish ${taskName.CREATE_VIDEOS_BY_TIME} job`);
  });
};
