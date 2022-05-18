import { makeFileName } from '../utils/index.js';
import * as constants from '../utils/constants.js';
import cameraFileService from './cameraFile.service.js';
import cameraApiService from './cameraApi.service.js';

const createScreenshotByStream = async ({ logger, userId, camera, parent }) => {
  logger && logger(`screenshotService.createScreenshot`);

  const date = new Date();
  const fileName = makeFileName(date);
  const filePath = [...parent.path, parent.name];

  const stream = await cameraApiService.getScreenshot(camera.screenshotLink, 'stream');

  const screenshot = await cameraFileService.createFileByStream({
    logger,
    name: fileName,
    date: date,
    user: userId,
    camera: camera._id,
    parent: parent._id,
    path: filePath,
    type: constants.SCREENSHOT,
    stream,
  });

  return screenshot;
};

const createScreenshot = async ({ logger, userId, camera, parent, type }) => {
  logger && logger(`screenshotService.createScreenshot`);

  const date = new Date();
  const fileName = makeFileName(date);
  const filePath = [...parent.path, parent.name];

  const data = await cameraApiService.getScreenshot(camera.screenshotLink, 'arraybuffer');

  const screenshot = await cameraFileService.createFile({
    logger,
    name: fileName,
    date: date,
    user: userId,
    camera: camera._id,
    parent: parent._id,
    path: filePath,
    type,
    data,
  });

  return screenshot;
};

export default { createScreenshot, createScreenshotByStream };
