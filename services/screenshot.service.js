import { makeFileName, makeFileNameOnDisk } from '../utils/index.js';
import cameraFileService from './cameraFile.service.js';
import cameraApiService from './cameraApi.service.js';

const createScreenshotByStream = async ({ logger, userId, camera, parent, type }) => {
  logger && logger(`screenshotService.createScreenshot`);

  const date = new Date();
  const name = makeFileName(date);
  const nameOnDisk = makeFileNameOnDisk(date);
  const pathOnDisk = [...parent.pathOnDisk, parent.nameOnDisk];

  const stream = await cameraApiService.getScreenshot(camera.screenshotLink, 'stream');

  const screenshot = await cameraFileService.createFileByStream({
    logger,
    user: userId,
    camera: camera._id,
    parent: parent._id,
    type,
    date,
    name,
    pathOnDisk,
    nameOnDisk,
    fileType: 'image/jpg',
    stream,
  });

  return screenshot;
};

const createScreenshot = async ({ logger, userId, camera, parent, type }) => {
  logger && logger(`screenshotService.createScreenshot`);

  const date = new Date();
  const name = makeFileName(date);
  const nameOnDisk = makeFileNameOnDisk(date);
  const pathOnDisk = [...parent.pathOnDisk, parent.nameOnDisk];

  const data = await cameraApiService.getScreenshot(camera.screenshotLink, 'arraybuffer');

  const screenshot = await cameraFileService.createFile({
    logger,
    user: userId,
    camera: camera._id,
    parent: parent._id,
    type,
    date,
    name,
    pathOnDisk,
    nameOnDisk,
    fileType: 'image/jpg',
    data,
  });

  return screenshot;
};

export default { createScreenshot, createScreenshotByStream };
