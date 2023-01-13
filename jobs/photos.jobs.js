import cameraService from '../services/camera.service.js';
import cameraApiService from '../services/cameraApi.service.js';
import cameraFileService from '../services/cameraFile.service.js';
import cameraTaskService from '../services/cameraTask.service.js';
import { dd, makeFileName, makeFileNameOnDisk, makeTodayName, parseTime } from '../utils/index.js';
import { taskName, taskStatus } from '../utils/constants.js';

const sleep = (time, message = 'Hello') =>
  new Promise((resolve) => {
    setTimeout(() => resolve(message), time);
  });

const savePhoto = async ({ logger, userId, cameraId, parent, create, fileData }) => {
  const date = new Date();
  const fileName = makeFileName(date);
  const fileNameOnDisk = makeFileNameOnDisk(date);
  const filePathOnDisk = [...parent.pathOnDisk, fileNameOnDisk];

  const file = await cameraFileService.createFile({
    logger,
    date,
    user: userId,
    camera: cameraId,
    parent: parent._id,
    pathOnDisk: filePathOnDisk,
    name: fileName,
    type: 'photo',
    fileType: 'image/jpg',
    createType: create,
    data: fileData,
  });

  return file;
};

export default (agenda, socket, workerLogger) => {
  agenda.define(taskName.CREATE_PHOTO_BY_HAND, async (job) => {
    const logger = workerLogger.extend(taskName.CREATE_PHOTO_BY_HAND);

    logger(`start ${taskName.CREATE_PHOTO_BY_HAND} job`);

    const { cameraId, userId, taskId } = job.attrs.data;
    const userSocket = socket.getUserSocket(userId);

    let task;

    try {
      task = await cameraTaskService.getOneById({ taskId });
      const { photoSettings } = task;

      await task.updateOne({ status: taskStatus.RUNNING, startedAt: new Date() });
      userSocket && userSocket.emit('update-task', { cameraId, userId, taskId });

      const camera = await cameraService.getOneById({ cameraId });
      const { photosByHandFolder, photoUrl } = camera;

      await sleep(5 * 1000);
      const url = photoSettings.photoUrl || photoUrl;
      const fileData = await cameraApiService.getScreenshot(url, 'arraybuffer');

      const file = await savePhoto({
        logger,
        userId,
        cameraId,
        parent: photosByHandFolder,
        create: 'byHand',
        fileData,
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
  //
  //

  agenda.define(taskName.CREATE_PHOTOS_BY_TIME, async (job) => {
    const logger = workerLogger.extend(taskName.CREATE_PHOTOS_BY_TIME);

    logger(`start ${taskName.CREATE_PHOTOS_BY_TIME} job`);

    const { cameraId, userId, taskId } = job.attrs.data;
    const userSocket = socket.getUserSocket(userId);

    let task;

    try {
      task = await cameraTaskService.getOneById({ logger, taskId });

      const { photoSettings } = task;
      const { startTime, stopTime } = photoSettings;

      const time = new Date();
      const { hh, mm } = parseTime(time);
      const currentTime = `${dd(hh)}:${dd(mm)}`;

      if (currentTime < startTime || currentTime > stopTime) {
        logger(`out of time - currentTime: ${currentTime}, startTime: ${startTime} stopTime: ${stopTime}`);
        logger('cancel CreatePhotosByTime job');
        return;
      }

      const camera = await cameraService.getOneById({ cameraId });
      const { photosByTimeFolder, photoUrl } = camera;

      const todayFolderName = makeTodayName(time);

      let parent = await cameraFileService.getOne({
        logger,
        camera: cameraId,
        parent: photosByTimeFolder._id,
        name: todayFolderName,
      });

      // TODO: check folder on disk?

      if (!parent) {
        parent = await cameraFileService.createFolder({
          logger,
          user: userId,
          camera: camera._id,
          parent: photosByTimeFolder._id,
          name: todayFolderName,
          pathOnDisk: [...photosByTimeFolder.pathOnDisk, todayFolderName],
          type: 'folder',
        });
      }

      const fileData = await cameraApiService.getScreenshot(photoUrl, 'arraybuffer');

      const file = await savePhoto({
        logger,
        userId,
        cameraId,
        parent,
        create: 'byTime',
        fileData,
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
