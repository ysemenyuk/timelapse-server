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

export default (agenda, socket, workerLogger) => {
  agenda.define(taskName.CREATE_PHOTO_BY_HAND, async (job) => {
    const logger = workerLogger.extend(taskName.CREATE_PHOTO_BY_HAND);

    logger(`start ${taskName.CREATE_PHOTO_BY_HAND} job`);

    const { cameraId, userId, taskId } = job.attrs.data;
    const userSocket = socket.getUserSocket(userId);

    let task;

    try {
      task = await cameraTaskService.getOneById({ taskId });

      // console.log(9999, task);

      await task.updateOne({ status: taskStatus.RUNNING, startedAt: new Date() });

      userSocket && userSocket.emit('update-task', { cameraId, userId, taskId });

      await sleep(5 * 1000);

      const camera = await cameraService.getOneById({ cameraId });
      const { photosByHandFolder, photoUrl } = camera;

      // console.log(444444, camera);

      const fileData = await cameraApiService.getScreenshot(photoUrl, 'arraybuffer');

      const date = new Date();
      const fileName = makeFileName(date);
      const fileNameOnDisk = makeFileNameOnDisk(date);
      const filePathOnDisk = [...photosByHandFolder.pathOnDisk, photosByHandFolder.nameOnDisk];

      const photo = await cameraFileService.createFile({
        logger,
        date,
        user: userId,
        camera: camera._id,
        parent: photosByHandFolder._id,
        pathOnDisk: filePathOnDisk,
        nameOnDisk: fileNameOnDisk,
        name: fileName,
        type: 'photo',
        fileType: 'image/jpg',
        createType: 'byHand',
        data: fileData,
      });

      await task.updateOne({
        status: taskStatus.SUCCESSED,
        finishedAt: new Date(),
        message: `File "${fileName}" successfully saved.`,
      });

      userSocket && userSocket.emit('update-task', { cameraId, userId, taskId });
      userSocket && userSocket.emit('add-file', { cameraId, userId, fileId: photo._id });
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
      const { photosByTimeFolder } = camera;

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
          nameOnDisk: todayFolderName,
          pathOnDisk: [...photosByTimeFolder.pathOnDisk, photosByTimeFolder.nameOnDisk],
          type: 'folder',
        });
      }

      const fileData = await cameraApiService.getScreenshot(camera.photoUrl, 'arraybuffer');

      const date = new Date();
      const fileName = makeFileName(date);
      const fileNameOnDisk = makeFileNameOnDisk(date);
      const filePathOnDisk = [...parent.pathOnDisk, parent.nameOnDisk];

      const photo = await cameraFileService.createFile({
        logger,
        date,
        user: userId,
        camera: camera._id,
        parent: parent._id,
        name: fileName,
        pathOnDisk: filePathOnDisk,
        nameOnDisk: fileNameOnDisk,
        type: 'photo',
        fileType: 'image/jpg',
        createType: 'byTime',
        data: fileData,
      });

      userSocket && userSocket.emit('add-file', { cameraId, userId, fileId: photo._id });
    } catch (error) {
      console.log(4444, 'CreatePhotosByTime error', error);

      userSocket && userSocket.emit('error', { cameraId, userId, taskId, error });
    }

    logger(`finish ${taskName.CREATE_PHOTOS_BY_TIME} job`);
  });
};
