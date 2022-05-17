import cameraService from '../services/camera.service.js';
import cameraFileService from '../services/cameraFile.service.js';
import cameraTaskService from '../services/cameraTask.service.js';
import screenshotService from '../services/screenshot.service.js';
import { dd, makeTodayName, parseTime } from '../utils/index.js';
import * as constants from '../utils/constants.js';
import storageService from '../services/storage.service.js';

export default (agenda, io, logger) => {
  agenda.define('createScreenshot', async (job) => {
    const logg = logger.extend('createScreenshot');

    logg('start createScreenshot job');
    // console.log('createScreenshot job.attrs:', job.attrs);

    const { cameraId, userId, taskId } = job.attrs.data;

    const camera = await cameraService.getOneById({ cameraId, populateItems: ['screenshotsFolder'] });
    const parent = camera.screenshotsFolder;
    // console.log(2222, 'camera', camera);

    const screenshot = await screenshotService.createScreenshot({
      logger,
      userId,
      camera,
      parent,
    });

    console.log(3333, 'createScreenshot screenshot', screenshot);

    const updatedTask = await cameraTaskService.updateOne({
      logger,
      taskId,
      payload: { status: 'Finished', finishedAt: new Date() },
    });

    console.log(4444, 'createScreenshot updatedTask', updatedTask);

    // socket emit screenshot, updatedTask

    logg('finish createScreenshot job');
  });

  agenda.define('createScreenshotsByTime', async (job) => {
    const logg = logger.extend('createScreenshotsByTime');

    logg('start  createScreenshotsByTime job');
    // console.log('createScreenshotsByTime job.attrs:', job.attrs);

    const { cameraId, userId, taskId } = job.attrs.data;

    const task = await cameraTaskService.getOneById({ taskId });
    // console.log(2222, 'createScreenshotsByTime task', task);

    const { screenshotsByTimeSettings } = task;
    const { startTime, stopTime } = screenshotsByTimeSettings;

    const time = new Date();
    const { hh, mm } = parseTime(time);
    const currentTime = `${dd(hh)}:${dd(mm)}`;

    // console.log(9999, 'currentTime:', currentTime);
    // console.log(9999, `startTime: ${startTime} stopTime: ${stopTime}`);

    if (currentTime < startTime || currentTime > stopTime) {
      logg(`out of time - currentTime: ${currentTime}, startTime: ${startTime} stopTime: ${stopTime}`);
      logg('cancel createScreenshotsByTime job');
      return;
    }

    const camera = await cameraService.getOneById({ cameraId, populateItems: ['screenshotsByTimeFolder'] });
    // console.log(2222, 'camera', camera);

    const todayFolderName = makeTodayName(time);
    // console.log(9999, 'folderName:', todayFolderName);

    let parent = await cameraFileService.getOneByName({ fileName: todayFolderName });
    // console.log(9999, 'parent:', parent);

    // TODO: check folder on disk?

    if (!parent) {
      parent = await cameraFileService.createOne({
        logger,
        user: userId,
        camera: camera._id,
        name: todayFolderName,
        parent: camera.screenshotsByTimeFolder._id,
        path: [...camera.screenshotsByTimeFolder.path, camera.screenshotsByTimeFolder.name],
        type: constants.FOLDER,
      });

      await storageService.createFolder({
        logger,
        folderPath: todayFolder.path,
        folderName: todayFolder.name,
      });
    }

    // console.log(9999, 'parent:', parent);

    const screenshot = await screenshotService.createScreenshot({
      logger,
      userId,
      camera,
      parent,
    });

    console.log(3333, 'createScreenshot screenshot', screenshot);

    const screenshotsByTimeTotalFiles = task.screenshotsByTimeTotalFiles ? task.screenshotsByTimeTotalFiles + 1 : 1;

    const updatedTask = await cameraTaskService.updateOne({
      logger,
      taskId,
      payload: { screenshotsByTimeTotalFiles },
    });

    console.log(4444, 'createScreenshot updatedTask', updatedTask);

    // socket emit screenshot, updatedTask

    logg('finish createScreenshotsByTime job');
  });
};
