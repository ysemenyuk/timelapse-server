import * as fsp from 'fs/promises';
import { existsSync, createReadStream, createWriteStream } from 'fs';
import path from 'path';
import {
  makeUserDirName,
  makeCameraDirName,
  makeCurrentDateName,
  makePhotoNameOnDisk,
  makeVideoNameOnDisk,
  makeVideoPosterNameOnDisk,
} from '../utils/index.js';

const pathToStorage = process.env.PATH_TO_STORAGE;

const createFullPath = (filePath) => path.join(pathToStorage, ...filePath);

//
// dirs paths
//

const createUserDirPath = (userId) => {
  const userDirName = makeUserDirName(userId);
  return [userDirName];
};

const createCameraDirPath = (userId, cameraId) => {
  const userDirName = makeUserDirName(userId);
  const cameraDirName = makeCameraDirName(cameraId);
  return [userDirName, cameraDirName];
};

const createPhotosDirPath = (userId, cameraId) => {
  const userDirName = makeUserDirName(userId);
  const cameraDirName = makeCameraDirName(cameraId);
  return [userDirName, cameraDirName, 'Photos'];
};

const createVideosDirPath = (userId, cameraId) => {
  const userDirName = makeUserDirName(userId);
  const cameraDirName = makeCameraDirName(cameraId);
  return [userDirName, cameraDirName, 'Videos'];
};

//
// create dirs
//

const createDir = async ({ logger, dirPath }) => {
  logger && logger(`disk.storage.createDir dirPath: ${dirPath}`);
  const fullPath = createFullPath(dirPath);
  const created = await fsp.mkdir(fullPath);
  return created;
};

const createUserDir = async ({ logger, userId }) => {
  logger && logger(`disk.storage.createUserDir userId: ${userId}`);
  const userDirPath = createUserDirPath(userId);
  const userDir = await createDir({ logger, dirPath: userDirPath });
  return userDir;
};

const createCameraDirs = async ({ logger, userId, cameraId }) => {
  logger && logger(`disk.storage.createCameraDirs cameraId: ${cameraId}`);
  const cameraDirPath = createCameraDirPath(userId, cameraId);
  const cameraDir = await createDir({ logger, dirPath: cameraDirPath });
  const cameraPhotosDir = await createDir({ logger, dirPath: [...cameraDirPath, 'Photos'] });
  const cameraVideosDir = await createDir({ logger, dirPath: [...cameraDirPath, 'Videos'] });

  return { cameraDir, cameraPhotosDir, cameraVideosDir };
};

// remove dirs

const removeUserDir = async ({ logger, userId }) => {
  logger && logger(`disk.storage.removeUserDir userId: ${userId}`);
  const userDirPath = createUserDirPath(userId);
  const fullPath = createFullPath(userDirPath);
  const deleted = await fsp.rmdir(fullPath, { recursive: true });
  return deleted;
};

const removeCameraDir = async ({ logger, userId, cameraId }) => {
  logger && logger(`disk.storage.removeCameraDir cameraId: ${cameraId}`);
  const dirPath = createCameraDirPath(userId, cameraId);
  const fullPath = createFullPath(dirPath);
  const deleted = await fsp.rmdir(fullPath, { recursive: true });
  return deleted;
};

//
// files paths
//

const createVideoFilePath = ({ logger, file }) => {
  logger && logger(`disk.storage.createVideoFilePath file.name: ${file.name}`);
  const videosDirPath = createVideosDirPath(file.user, file.camera);
  const fileName = makeVideoNameOnDisk(file.date);
  return [...videosDirPath, fileName];
};

const createCurrentDatePhotoDirPath = ({ logger, file }) => {
  logger && logger(`disk.storage.createCurrentDatePhotoDirPath file.name: ${file.name}`);
  const photosDirPath = createPhotosDirPath(file.user, file.camera);
  const currentDatePhotoDirName = makeCurrentDateName(file.date);
  return [...photosDirPath, currentDatePhotoDirName];
};

const cretePhotoFilePath = ({ logger, file }) => {
  logger && logger(`disk.storage.cretePhotoFilePath file.name: ${file.name}`);
  const dirPath = createCurrentDatePhotoDirPath({ logger, file });
  const fileName = makePhotoNameOnDisk(file.date);
  return [...dirPath, fileName];
};

const createPosterPath = ({ logger, file }) => {
  logger && logger(`disk.storage.createVideoFilePath file.name: ${file.name}`);
  const videosDirPath = createVideosDirPath(file.user, file.camera);
  const posterName = makeVideoPosterNameOnDisk(file.date);
  const filePath = [...videosDirPath, posterName];
  const fullPath = createFullPath(filePath);
  return fullPath;
};

const createFilePath = ({ logger, file }) => {
  logger && logger(`disk.storage.createFilePath file.name: ${file.name}`);
  let filePath;

  if (file.type === 'video') {
    filePath = createVideoFilePath({ logger, file });
  }

  if (file.type === 'photo') {
    filePath = cretePhotoFilePath({ logger, file });
  }

  const fullPath = createFullPath(filePath);
  return fullPath;
};

//
// make new dir for photo every day
//

const makeCurrentDatePhotoDirIfNotExist = async ({ logger, file }) => {
  const dirPath = createCurrentDatePhotoDirPath({ logger, file });
  const fullPath = createFullPath(dirPath);

  if (!existsSync(fullPath)) {
    logger && logger(`disk.storage.makeDirIfNotExist mkdir dirPath: ${fullPath}`);
    await fsp.mkdir(fullPath);
  }
};

//
// save
//

const saveFile = async ({ logger, file, data }) => {
  logger && logger(`disk.storage.saveFile file: ${file.name}`);

  if (file.type === 'photo') {
    await makeCurrentDatePhotoDirIfNotExist({ logger, file });
  }

  const filePath = createFilePath({ logger, file });

  logger && logger(`disk.storage.savePhoto fullPath: ${filePath}`);
  const created = await fsp.writeFile(filePath, data);
  return created;
};

//
// remove
//

const removeFile = async ({ logger, file }) => {
  logger && logger(`disk.storage.removeFile file.name: ${file.name}`);

  const filePath = createFilePath({ logger, file });

  logger && logger(`disk.storage.removeFile fullPath: ${filePath}`);
  const deleted = await fsp.unlink(filePath);
  return deleted;
};

//
// streams
//

const openUploadStream = ({ logger, file }) => {
  logger && logger(`disk.storage.openUploadStream file.name: ${file.name}`);

  const filePath = createFilePath({ logger, file });

  const uploadStream = createWriteStream(filePath);
  return uploadStream;
};

const openDownloadStream = ({ logger, file }) => {
  logger && logger(`disk.storage.openDownloadStream file.name: ${file.name}`);

  const filePath = createFilePath({ logger, file });

  const stream = createReadStream(filePath);
  return stream;
};

//
//
//

const copyFile = async ({ logger, sourceFilePath, destinationFilePath }) => {
  const sourceFullPath = createFullPath(sourceFilePath);
  const destinationFullPath = createFullPath(destinationFilePath);

  logger && logger(`disk.storage.copyFile ${sourceFullPath} to ${destinationFullPath}`);
  await fsp.copyFile(sourceFullPath, destinationFullPath);
};

const fileStat = ({ logger, file }) => {
  logger && logger(`disk.storage.fileStat file.name: ${file.name}`);

  const filePath = createFilePath({ logger, file });

  const stat = fsp.stat(filePath);
  return stat;
};

export default {
  createUserDir,
  createCameraDirs,
  removeUserDir,
  removeCameraDir,

  createPosterPath,
  createFilePath,

  saveFile,
  removeFile,

  openUploadStream,
  openDownloadStream,

  copyFile,
  fileStat,
};
