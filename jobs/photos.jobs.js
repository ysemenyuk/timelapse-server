import cameraService from '../services/camera.service.js';
import cameraApiService from '../services/cameraApi.service.js';
import cameraFileService from '../services/cameraFile.service.js';
import cameraTaskService from '../services/cameraTask.service.js';
import { dd, makeFileName, makeFileNameOnDisk, makeTodayName, parseTime } from '../utils/index.js';
import { taskName, taskStatus, folderName, fileType } from '../utils/constants.js';

export default (agenda, socket, workerLogger) => {
  agenda.define(taskName.CREATE_PHOTO, async (job) => {
    const logger = workerLogger.extend(taskName.CREATE_PHOTO);

    logger(`start ${taskName.CREATE_PHOTO} job`);

    const { cameraId, userId, taskId } = job.attrs.data;
    const userSocket = socket.getUserSocket(userId);

    try {
      await cameraTaskService.updateOneById({
        logger,
        taskId,
        payload: { stardedAt: new Date() },
      });

      const { photosFolder, ...camera } = await cameraService.getOneById({
        cameraId,
        populateItems: [folderName.PHOTOS],
      });

      const date = new Date();

      const fileName = makeFileName(date);
      const fileNameOnDisk = makeFileNameOnDisk(date);
      const filePathOnDisk = [...photosFolder.pathOnDisk, photosFolder.nameOnDisk];

      const fileData = await cameraApiService.getScreenshot(camera.photoUrl, 'arraybuffer');

      const photo = await cameraFileService.createFile({
        logger,
        user: userId,
        camera: camera._id,
        parent: photosFolder._id,
        date,
        name: fileName,
        pathOnDisk: fileNameOnDisk,
        nameOnDisk: filePathOnDisk,
        type: fileType.PHOTO,
        fileType: 'image/jpg',
        data: fileData,
      });

      const updatedTask = await cameraTaskService.updateOneById({
        logger,
        taskId,
        payload: { status: taskStatus.SUCCESSED, finishedAt: new Date() },
      });

      // socket emit update-task, add-file
      userSocket && userSocket.emit('update-task', updatedTask);
      userSocket && userSocket.emit('add-file', photo);
    } catch (error) {
      console.log('-- error CreatePhoto job --', error);

      const updatedTask = await cameraTaskService.updateOneById({
        logger,
        taskId,
        payload: { status: taskStatus.FAILED, finishedAt: new Date() },
      });

      // socket emit update-task
      userSocket && userSocket.emit('update-task', updatedTask);
    }

    logger(`finish ${taskName.CREATE_PHOTO} job`);
  });

  //
  //
  //

  agenda.define(taskName.CREATE_PHOTOS_BY_TIME, async (job) => {
    const logger = workerLogger.extend(taskName.CREATE_PHOTOS_BY_TIME);

    logger(`start ${taskName.CREATE_PHOTOS_BY_TIME} job`);
    // console.log('CreatePhotosByTime job.attrs:', job.attrs);

    const { cameraId, userId, taskId } = job.attrs.data;

    const task = await cameraTaskService.getOneById({ logger, taskId });

    const { settings } = task;
    const { startTime, stopTime } = settings;

    const time = new Date();
    const { hh, mm } = parseTime(time);
    const currentTime = `${dd(hh)}:${dd(mm)}`;

    if (currentTime < startTime || currentTime > stopTime) {
      logger(`out of time - currentTime: ${currentTime}, startTime: ${startTime} stopTime: ${stopTime}`);
      logger('cancel CreatePhotosByTime job');
      return;
    }

    const { photosByTimeFolder, ...camera } = await cameraService.getOneById({
      logger,
      cameraId,
      populateItems: [folderName.PHOTOS_BY_TIME],
    });

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
        type: fileType.FOLDER,
      });
    }

    const date = new Date();

    const fileName = makeFileName(date);
    const fileNameOnDisk = makeFileNameOnDisk(date);
    const filePathOnDisk = [...parent.pathOnDisk, parent.nameOnDisk];

    const fileData = await cameraApiService.getScreenshot(camera.photoUrl, 'arraybuffer');

    const photo = await cameraFileService.createFile({
      logger,
      user: userId,
      camera: camera._id,
      parent: parent._id,
      date,
      name: fileName,
      pathOnDisk: fileNameOnDisk,
      nameOnDisk: filePathOnDisk,
      type: fileType.PHOTO_BY_TIME,
      fileType: 'image/jpg',
      data: fileData,
    });

    console.log(3333, 'CreatePhotosByTime photo', photo);

    // socket emit add-file

    logger(`finish ${taskName.CREATE_PHOTOS_BY_TIME} job`);
  });
};
