import { existsSync, createWriteStream, createReadStream } from 'fs';
import * as fsp from 'fs/promises';
import { pipeline } from 'stream/promises';
import path from 'path';
import _ from 'lodash';
import debug from 'debug';
import { isPhotoFile } from '../utils/utils.js';
import diskpaths from './disk.paths.js';

const pathToDiskSpace = process.env.DISK_PATH;
const logger = debug('storage');

const {
  createFilePath,
  createUserDirPath,
  createCameraDirPath,
  createPhotosDirPath,
  createVideosDirPath,
  createDateDirPath,
} = diskpaths;

export function createFullPath(filePath) {
  return path.join(pathToDiskSpace, filePath);
}

async function createDir(dirPath) {
  const fullPath = createFullPath(dirPath);
  const created = await fsp.mkdir(fullPath, { recursive: true });
  return created;
}

async function removeDir(dirPath) {
  const fullPath = createFullPath(dirPath);
  const deleted = await fsp.rmdir(fullPath, { recursive: true });
  return deleted;
}

function isDirExist(dirPath) {
  const fullPath = createFullPath(dirPath);
  return existsSync(fullPath);
}

//
// main
//

class DiskStorage {
  constructor() {
    //
  }

  start() {
    logger(`storageType - "disk", pathOnDisk - "${pathToDiskSpace}"`);
  }

  // create

  async createUserFolder({ logger, userId }) {
    logger && logger(`disk.storage.createUserFolder userId: ${userId}`);

    const userDirPath = createUserDirPath(userId);
    await createDir(userDirPath);
  }

  async createCameraFolder({ logger, userId, cameraId }) {
    logger && logger(`disk.storage.createCameraFolder cameraId: ${cameraId}`);

    const cameraDirPath = createCameraDirPath(userId, cameraId);
    const cameraPhotosDirPath = createPhotosDirPath(userId, cameraId);
    const cameraVideosDirPath = createVideosDirPath(userId, cameraId);

    await createDir(cameraDirPath);
    await createDir(cameraPhotosDirPath);
    await createDir(cameraVideosDirPath);
  }

  // remove

  async removeUserFiles({ logger, userId }) {
    logger && logger(`disk.storage.removeUserFiles userId: ${userId}`);

    const userDirPath = createUserDirPath(userId);
    const deleted = await removeDir(userDirPath);

    return deleted;
  }

  async removeCameraFiles({ logger, userId, cameraId }) {
    logger && logger(`disk.storage.removeCameraFiles userId cameraId: ${userId} ${cameraId}`);

    const cameraDirPath = createCameraDirPath(userId, cameraId);
    const deleted = await removeDir(cameraDirPath);

    return deleted;
  }

  // save file

  async saveFile({ logger, file, data, stream }) {
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
  }

  // read file

  async readFile({ logger, file, type }) {
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
  }

  // remove file

  async removeFile({ logger, file }) {
    logger && logger(`disk.storage.removeFile file.name: ${file.name}`);

    const filePath = createFilePath(file);
    const fullPath = createFullPath(filePath);

    const deleted = await fsp.unlink(fullPath);
    return deleted;
  }

  // streams

  openDownloadStream({ logger, file }) {
    logger && logger(`disk.storage.openDownloadStream file.name: ${file.name}`);

    const filePath = createFilePath(file);
    const fullPath = createFullPath(filePath);

    const stream = createReadStream(fullPath);
    return stream;
  }

  openDownloadStreamByLink({ logger, fileLink }) {
    logger && logger(`disk.storage.openDownloadStreamByLink fileLink: ${fileLink}`);

    // const fileName = _.last(fileLink.split('/'));
    const filePath = _.trimStart(fileLink, '/');
    const fullPath = createFullPath(filePath);

    const stream = createReadStream(fullPath);
    return stream;
  }

  // stat

  async getFileStat({ logger, file }) {
    logger && logger(`disk.storage.fileStat file.name: ${file.name}`);

    const filePath = createFilePath(file);
    const fullPath = this.createFullPath(filePath);

    const stat = await fsp.stat(fullPath);
    return stat;
  }

  isFileExist({ logger, file }) {
    logger && logger(`disk.storage.isFileExist file.name: ${file.name}`);

    const filePath = createFilePath(file);
    const fullPath = this.createFullPath(filePath);
    return existsSync(fullPath);
  }
}

export default DiskStorage;
