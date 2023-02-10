import { existsSync, createWriteStream, createReadStream } from 'fs';
import * as fsp from 'fs/promises';
import { pipeline } from 'stream/promises';
import path from 'path';
import { isPhotoFile } from '../utils/utils.js';
import {
  createFilePath,
  createUserDirPath,
  createCameraDirPath,
  createPhotosDirPath,
  createVideosDirPath,
  createDateDirPath,
} from './disk.paths.js';

const pathToDiskSpace = process.env.DISK_PATH;

export default () => {
  const createFullPath = (filePath) => path.join(pathToDiskSpace, filePath);

  const createDir = async (dirPath) => {
    const fullPath = createFullPath(dirPath);
    const created = await fsp.mkdir(fullPath);
    return created;
  };

  const removeDir = async (dirPath) => {
    const fullPath = createFullPath(dirPath);
    const deleted = await fsp.rmdir(fullPath, { recursive: true });
    return deleted;
  };

  // create

  const createUserPath = async ({ logger, userId }) => {
    logger && logger(`disk.storage.createUserPath userId: ${userId}`);

    const userDirPath = createUserDirPath(userId);
    const userDir = await createDir(userDirPath);

    return userDir;
  };

  const createCameraPath = async ({ logger, userId, cameraId }) => {
    logger && logger(`disk.storage.createCameraPath cameraId: ${cameraId}`);

    const cameraDirPath = createCameraDirPath(userId, cameraId);
    const cameraPhotosDirPath = createPhotosDirPath(userId, cameraId);
    const cameraVideosDirPath = createVideosDirPath(userId, cameraId);

    const cameraDir = await createDir(cameraDirPath);
    const cameraPhotosDir = await createDir(cameraPhotosDirPath);
    const cameraVideosDir = await createDir(cameraVideosDirPath);

    return { cameraDir, cameraPhotosDir, cameraVideosDir };
  };

  // remove

  const removeUserFiles = async ({ logger, userId }) => {
    logger && logger(`disk.storage.removeUserFiles userId: ${userId}`);

    const userDirPath = createUserDirPath(userId);
    const deleted = await removeDir(userDirPath);

    return deleted;
  };

  const removeCameraFiles = async ({ logger, userId, cameraId }) => {
    logger && logger(`disk.storage.removeCameraFiles userId cameraId: ${userId} ${cameraId}`);

    const cameraDirPath = createCameraDirPath(userId, cameraId);
    const deleted = await removeDir(cameraDirPath);

    return deleted;
  };

  // save file

  const isDirExist = (dirPath) => {
    const fullPath = createFullPath(dirPath);
    return existsSync(fullPath);
  };

  const saveFile = async ({ logger, file, data, stream }) => {
    logger && logger(`disk.storage.saveFile file.name: ${file.name}`);

    const dateDir = createDateDirPath(file.user, file.camera, file.date);

    if (isPhotoFile(file) && !isDirExist(dateDir)) {
      logger && logger(`disk.storage.makeDateDir dateDir: ${dateDir}`);
      await createDir(dateDir);
    }

    const filePath = createFilePath(file);
    const fullPath = createFullPath(filePath);

    try {
      if (stream) {
        const writeStream = createWriteStream(fullPath);
        await pipeline(stream, writeStream);
      }
      if (data) {
        await fsp.writeFile(fullPath, data);
      }
    } catch (error) {
      console.log('error saveFile', error);
    }

    const link = `/files/${filePath}`;
    const { size } = await fsp.stat(fullPath);

    return { link, size };
  };

  // read file

  const readFile = async ({ logger, file, type }) => {
    logger && logger(`disk.storage.readFile file.name: ${file.name}`);

    const filePath = createFilePath(file);
    const fullPath = createFullPath(filePath);

    try {
      if (type === 'stream') {
        const stream = createReadStream(fullPath);
        return stream;
      }
      if (type === 'buffer') {
        const buffer = await fsp.readFile(fullPath);
        return buffer;
      }
    } catch (error) {
      console.log('error readFile', error);
    }
  };

  // remove file

  const removeFile = async ({ logger, file }) => {
    logger && logger(`disk.storage.removeFile file.name: ${file.name}`);

    const filePath = createFilePath(file);
    const fullPath = createFullPath(filePath);

    const deleted = await fsp.unlink(fullPath);
    return deleted;
  };

  // streams

  const openDownloadStreamByLink = ({ logger, fileLink }) => {
    logger && logger(`disk.storage.openDownloadStream fileLink: ${fileLink}`);

    const fullPath = createFullPath(fileLink);
    const stream = createReadStream(fullPath);
    return stream;
  };

  // stat

  const getFileStat = async ({ logger, file }) => {
    logger && logger(`disk.storage.fileStat file.name: ${file.name}`);

    const filePath = createFilePath(file);
    const fullPath = createFullPath(filePath);

    const stat = await fsp.stat(fullPath);
    return stat;
  };

  const isFileExist = ({ logger, file }) => {
    logger && logger(`disk.storage.isFileExist file.name: ${file.name}`);

    const filePath = createFilePath(file);
    const fullPath = createFullPath(filePath);
    return existsSync(fullPath);
  };

  return {
    createUserPath,
    createCameraPath,
    removeUserFiles,
    removeCameraFiles,
    saveFile,
    readFile,
    removeFile,
    openDownloadStreamByLink,
    getFileStat,
    isFileExist,
  };
};
