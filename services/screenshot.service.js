import { makeFileName, promisifyUploadStream } from '../utils/index.js';
import cameraFileService from './cameraFile.service.js';
import cameraApiService from './cameraApi.service.js';
import cameraService from './camera.service.js';
import * as constants from '../utils/constants.js';
import storageService from './storage.service.js';

const createScreenshot = async ({ logger, userId, camera, parent }) => {
  logger && logger(`screenshotService.createScreenshot`);

  // const camera = await cameraService.getOneById({ cameraId, populateItems: [], logger });
  // const parent = await cameraFileService.getOneById({ fileId: parentId, logger });

  const date = new Date();
  const fileName = makeFileName(date);
  const filePath = [...parent.path, parent.name];

  const dataStream = await cameraApiService.getScreenshot(camera.screenshotLink, 'stream');
  const uploadStream = storageService.openUploadStream({ filePath, fileName });

  dataStream.pipe(uploadStream);

  await promisifyUploadStream(uploadStream);

  const screenshot = await cameraFileService.createOne({
    name: fileName,
    date: date,
    user: userId,
    camera: camera._id,
    parent: parent._id,
    path: filePath,
    type: constants.SCREENSHOT,
    logger,
  });

  return screenshot;
};

export default { createScreenshot };
