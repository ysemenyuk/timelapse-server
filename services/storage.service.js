import * as fsp from 'fs/promises';
import { existsSync, createReadStream, createWriteStream } from 'fs';
import path from 'path';
import {
  makeCameraDirName,
  makeCurrentDateName,
  makePhotoNameOnDisk,
  makeUserDirName,
  makeVideoNameOnDisk,
} from '../utils';

const pathToStorage = process.env.PATH_TO_STORAGE;

const createFullPath = (itemPath) => path.join(pathToStorage, ...itemPath);

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
// dirs
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
  const userDir = createDir({ logger, dirPath: userDirPath });
  return userDir;
};

const createCameraDirs = async ({ logger, userId, cameraId }) => {
  logger && logger(`disk.storage.createCameraDirs cameraId: ${cameraId}`);
  const cameraDirPath = createCameraDirPath(userId, cameraId);
  const cameraDir = createDir({ logger, dirPath: cameraDirPath });
  const cameraPhotosDir = createDir({ logger, dirPath: [...cameraDirPath, 'Photos'] });
  const cameraVideosDir = createDir({ logger, dirPath: [...cameraDirPath, 'Videos'] });

  return { cameraDir, cameraPhotosDir, cameraVideosDir };
};

const removeDir = async ({ logger, dirPath }) => {
  logger && logger(`disk.storage.removeDir dirPath: ${dirPath}`);
  const fullPath = createFullPath(dirPath);
  const deleted = await fsp.rmdir(fullPath, { recursive: true });
  return deleted;
};

const removeCameraDirs = ({ logger, userId, cameraId }) => {
  logger && logger(`disk.storage.removeCameraDirs cameraId: ${cameraId}`);
  const deleted = removeDir({ logger, dirPath: createCameraDirPath(userId, cameraId) });
  return deleted;
};

//
// files
//

const saveVideo = async ({ logger, file, data }) => {
  logger && logger(`disk.storage.saveVideo file.name: ${file.name}`);

  const videosDirPath = createVideosDirPath(file.user, file.camera);

  const fileName = makeVideoNameOnDisk(file.date);
  const fullPath = createFullPath([...videosDirPath, fileName]);

  logger && logger(`disk.storage.saveVideo fullPath: ${fullPath}`);
  const created = await fsp.writeFile(fullPath, data);
  return created;
};

const savePhoto = async ({ logger, file, data }) => {
  logger && logger(`disk.storage.savePhoto file.name: ${file.name}`);

  const photosDirPath = createPhotosDirPath(file.user, file.camera);

  const currentDateDirName = makeCurrentDateName(file.date);
  const currentDateDirPath = [...photosDirPath, currentDateDirName];

  if (!existsSync(createFullPath(currentDateDirPath))) {
    logger && logger(`disk.storage.savePhoto mkdir dirPath: ${currentDateDirPath}`);
    await fsp.mkdir(createFullPath(currentDateDirPath));
  }

  const fileName = makePhotoNameOnDisk(file.date);
  const fullPath = createFullPath([...currentDateDirPath, fileName]);

  logger && logger(`disk.storage.savePhoto fullPath: ${fullPath}`);
  const created = await fsp.writeFile(fullPath, data);
  return created;
};

const saveFile = async ({ logger, file, data }) => {
  logger && logger(`disk.storage.saveFile file: ${file.name}`);

  if (file.type === 'video') {
    const created = await saveVideo({ logger, file, data });
    return created;
  }

  if (file.type === 'photo') {
    const created = await savePhoto({ logger, file, data });
    return created;
  }
};

//
// remove
//

const removeVideo = async ({ logger, file }) => {
  logger && logger(`disk.storage.removeVideo file.name: ${file.name}`);

  const videosDirPath = createVideosDirPath(file.user, file.camera);

  const fileName = makeVideoNameOnDisk(file.date);
  const fullPath = createFullPath([...videosDirPath, fileName]);

  logger && logger(`disk.storage.removeVideo fullPath: ${fullPath}`);
  const deleted = await fsp.unlink(fullPath);
  return deleted;
};

const removePhoto = async ({ logger, file, data }) => {
  logger && logger(`disk.storage.removePhoto file.name: ${file.name}`);

  const photosDirPath = createPhotosDirPath(file.user, file.camera);

  const currentDateDirName = makeCurrentDateName(file.date);
  const currentDateDirPath = [...photosDirPath, currentDateDirName];

  const fileName = makePhotoNameOnDisk(file.date);
  const fullPath = createFullPath([...currentDateDirPath, fileName]);

  logger && logger(`disk.storage.removePhoto fullPath: ${fullPath}`);
  const deleted = await fsp.unlink(fullPath, data);
  return deleted;
};

const removeFile = async ({ logger, file }) => {
  logger && logger(`disk.storage.removeFile file.name: ${file.name}`);

  if (file.type === 'video') {
    const deleted = await removeVideo({ logger, file });
    return deleted;
  }

  if (file.type === 'photo') {
    const deleted = await removePhoto({ logger, file });
    return deleted;
  }
};

//
//
//

const openUploadStream = ({ logger, filePath }) => {
  const fullPath = createFullPath(filePath);
  logger && logger(`disk.storage.openUploadStream fileName: ${fullPath}`);

  const uploadStream = createWriteStream(fullPath);
  return uploadStream;
};

const openDownloadStream = ({ logger, filePath }) => {
  const fullPath = createFullPath(filePath);
  logger && logger(`disk.storage.openDownloadStream fileName: ${fullPath}`);

  const stream = createReadStream(fullPath);
  return stream;
};

const copyFile = async ({ logger, sourceFilePath, destinationFilePath }) => {
  const sourceFullPath = createFullPath(sourceFilePath);
  const destinationFullPath = createFullPath(destinationFilePath);

  logger && logger(`disk.storage.copyFile ${sourceFullPath} to ${destinationFullPath}`);
  await fsp.copyFile(sourceFullPath, destinationFullPath);
};

const fileStat = ({ logger, filePath }) => {
  const fullPath = createFullPath(filePath);
  logger && logger(`disk.storage.fileStat fileName: ${fullPath}`);

  const stat = fsp.stat(fullPath);
  return stat;
};

export default {
  createUserDir,
  createCameraDirs,
  removeCameraDirs,
  saveFile,
  removeFile,
  openUploadStream,
  openDownloadStream,
  copyFile,
  fileStat,
};
