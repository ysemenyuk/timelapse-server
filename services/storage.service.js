// import { makeDateName } from '../utils/utils.js';
import storage from '../storage/index.js';
import { isPhotoFile } from '../utils/utils.js';

//
// create dirs
//

const createUserDir = async ({ logger, userId }) => {
  logger && logger(`storage.service.createUserDir userId: ${userId}`);
  const userDirPath = storage.createUserDirPath(userId);
  const userDir = await storage.createDir({ logger, dirPath: userDirPath });
  return userDir;
};

const createCameraDirs = async ({ logger, userId, cameraId }) => {
  logger && logger(`storage.service.createCameraDirs cameraId: ${cameraId}`);

  const cameraDirPath = storage.createCameraDirPath(userId, cameraId);
  const cameraPhotosDirPath = storage.createPhotosDirPath(userId, cameraId);
  const cameraVideosDirPath = storage.createVideosDirPath(userId, cameraId);

  const cameraDir = await storage.createDir({ logger, dirPath: cameraDirPath });
  const cameraPhotosDir = await storage.createDir({ logger, dirPath: cameraPhotosDirPath });
  const cameraVideosDir = await storage.createDir({ logger, dirPath: cameraVideosDirPath });

  return { cameraDir, cameraPhotosDir, cameraVideosDir };
};

//
// remove dirs
//

const removeUserDir = async ({ logger, userId }) => {
  logger && logger(`storage.service.removeUserDir userId: ${userId}`);
  const userDirPath = storage.createUserDirPath(userId);
  const deleted = await storage.removeDir({ logger, dirPath: userDirPath });
  return deleted;
};

const removeCameraDir = async ({ logger, userId, cameraId }) => {
  logger && logger(`storage.service.removeCameraDir cameraId: ${cameraId}`);
  const cameraDirPath = storage.createCameraDirPath(userId, cameraId);
  const deleted = await storage.removeDir({ logger, dirPath: cameraDirPath });
  return deleted;
};

//
// make dir for photo if not exist
//

const makeDateDirIfNotExist = async ({ logger, file }) => {
  const dirPath = storage.createDateDirPath(file.user, file.camera, file.date);
  if (!storage.isDirExist({ logger, dirPath })) {
    logger && logger(`storage.service.makeDateDirIfNotExist dirPath: ${dirPath}`);
    await storage.createDir({ logger, dirPath });
  }
};

//
// save file
//

const saveFile = async ({ logger, file, data, stream }) => {
  logger && logger(`storage.service.saveFile file: ${file.name}`);

  if (isPhotoFile(file)) {
    await makeDateDirIfNotExist({ logger, file });
  }

  const filePath = storage.createFilePath({ logger, file });
  const fileInfo = await storage.saveFile({ logger, filePath, data, stream });

  return fileInfo;
};

//
//
//

const openDownloadStream = ({ logger, file }) => {
  logger && logger(`storage.service.openDownloadStream file: ${file.name}`);

  const filePath = storage.createFilePath({ logger, file });
  const stream = storage.openDownloadStream({ logger, filePath });

  return stream;
};

//
// remove file
//

const removeFile = async ({ logger, file }) => {
  logger && logger(`storage.service.removeFile file.name: ${file.name}`);

  const filePath = storage.createFilePath({ logger, file });
  const deleted = await storage.removeFile({ logger, filePath });
  return deleted;
};

//
// file stat
//

const getFileStat = async ({ logger, file }) => {
  logger && logger(`storage.service.fileStat file.name: ${file.name}`);

  const filePath = storage.createFilePath({ logger, file });
  const stat = await storage.fileStat({ logger, filePath });
  return stat;
};

const isFileExist = ({ logger, file }) => {
  logger && logger(`storage.service.isFileExist file.name: ${file.name}`);

  const filePath = storage.createFilePath({ logger, file });
  return storage.isFileExist({ logger, filePath });
};

export default {
  createUserDir,
  createCameraDirs,
  removeUserDir,
  removeCameraDir,
  saveFile,
  openDownloadStream,
  removeFile,
  getFileStat,
  isFileExist,
};
