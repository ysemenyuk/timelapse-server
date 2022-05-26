import cameraService from '../services/camera.service.js';
import cameraFileService from '../services/cameraFile.service.js';
import cameraTaskService from '../services/cameraTask.service.js';
import screenshotService from '../services/screenshot.service.js';
import { dd, makeTodayName, parseTime } from '../utils/index.js';
// import * as constants from '../utils/constants.js';

export default (agenda, socket, logger) => {
  agenda.define('CreateScreenshot', async (job) => {
    const logg = logger.extend('CreateScreenshot');

    logg('start createScreenshot job');
    // console.log('createScreenshot job.attrs:', job.attrs);

    const { cameraId, userId, taskId } = job.attrs.data;

    const camera = await cameraService.getOneById({ cameraId, populateItems: ['screenshotsFolder'] });

    const screenshot = await screenshotService.createScreenshot({
      logger: logg,
      userId,
      camera,
      parent: camera.screenshotsFolder,
      type: 'screenshot',
    });

    console.log(3333, 'createScreenshot screenshot', screenshot);

    const updatedTask = await cameraTaskService.updateOneById({
      logger: logg,
      taskId,
      payload: { status: 'Successed', finishedAt: new Date() },
    });

    console.log(4444, 'createScreenshot updatedTask', updatedTask);

    // socket emit screenshot, updatedTask

    logg('finish createScreenshot job');
  });

  agenda.define('CreateScreenshotsByTime', async (job) => {
    const logg = logger.extend('CreateScreenshotsByTime');

    logg('start  createScreenshotsByTime job');
    // console.log('createScreenshotsByTime job.attrs:', job.attrs);

    const { cameraId, userId, taskId } = job.attrs.data;

    const task = await cameraTaskService.getOneById({ logger: logg, taskId });
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

    const camera = await cameraService.getOneById({
      logger: logg,
      cameraId,
      populateItems: ['screenshotsByTimeFolder'],
    });
    // console.log(2222, 'camera', camera);

    const todayFolderName = makeTodayName(time);

    // console.log(9999, 'folderName:', todayFolderName);

    let parent = await cameraFileService.getOne({
      logger: logg,
      camera: cameraId,
      parent: camera.screenshotsByTimeFolder._id,
      name: todayFolderName,
    });

    // console.log(99991, 'parent:', parent);

    // TODO: check folder on disk?

    if (!parent) {
      parent = await cameraFileService.createFolder({
        logger: logg,
        user: userId,
        camera: camera._id,
        parent: camera.screenshotsByTimeFolder._id,
        name: todayFolderName,
        nameOnDisk: todayFolderName,
        pathOnDisk: [...camera.screenshotsByTimeFolder.pathOnDisk, camera.screenshotsByTimeFolder.nameOnDisk],
        type: 'folder',
      });
    }

    // console.log(99992, 'parent:', parent);

    const screenshot = await screenshotService.createScreenshot({
      logger: logg,
      userId,
      camera,
      parent,
      type: 'screenshotByTime',
    });

    console.log(3333, 'createScreenshotsByTime screenshot', screenshot);

    // socket emit screenshot

    logg('finish createScreenshotsByTime job');
  });
};
