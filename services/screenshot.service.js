import { makeFileName, promisifyUploadStream } from '../utils/index.js';
import cameraFileService from './cameraFile.service.js';
import cameraApiService from './cameraApi.service.js';
import cameraService from './camera.service.js';
import * as constants from '../utils/constants.js';
import storageService from './storage.service.js';

const createScreenshot = async ({ logger, userId, cameraId, payload }) => {
  const { parentId } = payload;

  logger(`screenshotService.createScreenshot parentId: ${parentId}`);

  const camera = await cameraService.getOne({ cameraId, logger });
  const parent = await cameraFileService.getOneById({ fileId: parentId, logger });

  // TODO: check folder if not exist create

  const filePath = [...parent.path, parent.name];

  const date = new Date();
  const fileName = makeFileName(date);

  const dataStream = await cameraApiService.getScreenshot(camera.screenshotLink, 'stream');
  const uploadStream = storageService.openUploadStream({ filePath, fileName, logger });

  dataStream.pipe(uploadStream);

  await promisifyUploadStream(uploadStream);

  const screenshot = await cameraFileService.createOne({
    name: fileName,
    date: date,
    user: userId,
    camera: cameraId,
    parent: parentId,
    path: filePath,
    type: constants.SCREENSHOT,
    logger,
  });

  console.log(33333, 'screenshot', screenshot);

  return screenshot;
};

export default { createScreenshot };
