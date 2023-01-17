// import format from 'date-fns/format/index.js';
import { makeCurrentDateName } from '../utils/index.js';
import { createCameraDirPath, createUserDirPath, createPhotosDirPath, createFilePath } from '../storage/utils.js';
import storage from '../storage/index.js';

//
// create dirs
//

const createUserDir = async ({ logger, userId }) => {
  logger && logger(`storage.service.createUserDir userId: ${userId}`);
  const userDirPath = createUserDirPath(userId);
  const userDir = await storage.createDir({ logger, dirPath: userDirPath });
  return userDir;
};

const createCameraDirs = async ({ logger, userId, cameraId }) => {
  logger && logger(`storage.service.createCameraDirs cameraId: ${cameraId}`);
  const cameraDirPath = createCameraDirPath(userId, cameraId);
  const cameraDir = await storage.createDir({ logger, dirPath: cameraDirPath });
  const cameraPhotosDir = await storage.createDir({ logger, dirPath: [...cameraDirPath, 'Photos'] });
  const cameraVideosDir = await storage.createDir({ logger, dirPath: [...cameraDirPath, 'Videos'] });
  return { cameraDir, cameraPhotosDir, cameraVideosDir };
};

// remove dirs

const removeUserDir = async ({ logger, userId }) => {
  logger && logger(`storage.service.removeUserDir userId: ${userId}`);
  const userDirPath = createUserDirPath(userId);
  const deleted = await storage.removeDir({ logger, dirPath: userDirPath });
  return deleted;
};

const removeCameraDir = async ({ logger, userId, cameraId }) => {
  logger && logger(`storage.service.removeCameraDir cameraId: ${cameraId}`);
  const cameraDirPath = createCameraDirPath(userId, cameraId);
  const deleted = await storage.removeDir({ logger, dirPath: cameraDirPath });
  return deleted;
};

//
// make dir for photo if not exist
//

const makePhotoDirIfNotExist = async ({ logger, file }) => {
  const photosDirPath = createPhotosDirPath(file.user, file.camera);
  const currentDateDirName = makeCurrentDateName(file.date);
  const dirPath = [...photosDirPath, currentDateDirName];

  if (!storage.isDirExist({ logger, dirPath })) {
    logger && logger(`storage.service.makePhotoDirIfNotExist dirPath: ${dirPath}`);
    await storage.createDir({ logger, dirPath });
  }
};

//
// save
//

const saveFile = async ({ logger, file, data, stream }) => {
  logger && logger(`storage.service.saveFile file: ${file.name}`);

  if (file.type === 'photo') {
    await makePhotoDirIfNotExist({ logger, file });
  }

  const filePath = createFilePath({ logger, file });
  const fileInfo = await storage.saveFile({ logger, file, filePath, data, stream });

  return fileInfo;
};

//
// remove
//

const removeFile = async ({ logger, file }) => {
  logger && logger(`storage.service.removeFile file.name: ${file.name}`);

  const filePath = createFilePath({ logger, file });
  const deleted = await storage.removeFile({ logger, filePath });
  return deleted;
};

//
// streams
//

// const openUploadStream = ({ logger, file }) => {
//   logger && logger(`storage.service.openUploadStream file.name: ${file.name}`);

//   const filePath = createFilePath({ logger, file });
//   const stream = storage.createWriteStream({ logger, filePath });
//   return stream;
// };

// const openDownloadStream = ({ logger, file }) => {
//   logger && logger(`storage.service.openDownloadStream file.name: ${file.name}`);

//   const filePath = createFilePath({ logger, file });
//   const stream = storage.createReadStream({ logger, filePath });
//   return stream;
// };

//
//
//

const getFileStat = async ({ logger, file }) => {
  logger && logger(`storage.service.fileStat file.name: ${file.name}`);

  const filePath = createFilePath({ logger, file });
  const stat = await storage.fileStat({ logger, filePath });
  return stat;
};

export default {
  createUserDir,
  createCameraDirs,
  removeUserDir,
  removeCameraDir,

  saveFile,
  removeFile,

  // openUploadStream,
  // openDownloadStream,

  getFileStat,
};
