import cloudStorage from './cloud.storage.js';
import diskStorage from './disk.storage.js';
import gridfsStorage from './gridfs.storage.js';
import { isPhotoFile } from '../utils/utils.js';

const mapping = {
  disk: diskStorage,
  cloud: cloudStorage,
  gridfs: gridfsStorage,
};

class Storage {
  constructor() {
    this.storage;
  }

  start(mongoClient, storageType) {
    this.storage = mapping[storageType](mongoClient);
  }

  //
  // create dirs
  //

  async createUserDir({ logger, userId }) {
    logger && logger(`storage.service.createUserDir userId: ${userId}`);
    const userDirPath = this.storage.createUserDirPath(userId);
    const userDir = await this.storage.createDir({ logger, dirPath: userDirPath });
    return userDir;
  }

  async createCameraDirs({ logger, userId, cameraId }) {
    logger && logger(`storage.service.createCameraDirs cameraId: ${cameraId}`);

    const cameraDirPath = this.storage.createCameraDirPath(userId, cameraId);
    const cameraPhotosDirPath = this.storage.createPhotosDirPath(userId, cameraId);
    const cameraVideosDirPath = this.storage.createVideosDirPath(userId, cameraId);

    const cameraDir = await this.storage.createDir({ logger, dirPath: cameraDirPath });
    const cameraPhotosDir = await this.storage.createDir({ logger, dirPath: cameraPhotosDirPath });
    const cameraVideosDir = await this.storage.createDir({ logger, dirPath: cameraVideosDirPath });

    return { cameraDir, cameraPhotosDir, cameraVideosDir };
  }

  //
  // remove dirs
  //

  async removeUserDir({ logger, userId }) {
    logger && logger(`storage.service.removeUserDir userId: ${userId}`);
    const userDirPath = this.storage.createUserDirPath(userId);
    const deleted = await this.storage.removeDir({ logger, dirPath: userDirPath });
    return deleted;
  }

  async removeCameraDir({ logger, userId, cameraId }) {
    logger && logger(`storage.service.removeCameraDir cameraId: ${cameraId}`);
    const cameraDirPath = this.storage.createCameraDirPath(userId, cameraId);
    const deleted = await this.storage.removeDir({ logger, dirPath: cameraDirPath });
    return deleted;
  }

  //
  // make dir for photo if not exist
  //

  async makeDateDirIfNotExist({ logger, file }) {
    const dirPath = this.storage.createDateDirPath(file.user, file.camera, file.date);
    if (!this.storage.isDirExist({ logger, dirPath })) {
      logger && logger(`storage.service.makeDateDirIfNotExist dirPath: ${dirPath}`);
      await this.storage.createDir({ logger, dirPath });
    }
  }

  //
  // save file
  //

  async saveFile({ logger, file, data, stream }) {
    logger && logger(`storage.service.saveFile file: ${file.name}`);

    if (isPhotoFile(file)) {
      await this.makeDateDirIfNotExist({ logger, file });
    }

    const filePath = this.storage.createFilePath({ logger, file });
    const fileInfo = await this.storage.saveFile({ logger, filePath, data, stream });

    return fileInfo;
  }

  //
  // read file
  //

  async readFile({ logger, file, type = 'buffer' }) {
    logger && logger(`storage.service.readFile file: ${file.name}`);

    const filePath = this.storage.createFilePath({ logger, file });
    const stream = this.storage.openDownloadStream({ logger, filePath, type });

    return stream;
  }

  //
  // remove file
  //

  async removeFile({ logger, file }) {
    logger && logger(`storage.service.removeFile file.name: ${file.name}`);

    const filePath = this.storage.createFilePath({ logger, file });
    const deleted = await this.storage.removeFile({ logger, filePath });
    return deleted;
  }

  //
  // stream
  //

  async openDownloadStream({ logger, filePath }) {
    logger && logger(`storage.service.openDownloadStream filePath: ${filePath}`);

    const stream = this.storage.openDownloadStream({ logger, filePath });
    return stream;
  }

  //
  // file stat
  //

  async getFileStat({ logger, file }) {
    logger && logger(`storage.service.fileStat file.name: ${file.name}`);

    const filePath = this.storage.createFilePath({ logger, file });
    const stat = await this.storage.fileStat({ logger, filePath });
    return stat;
  }

  isFileExist({ logger, file }) {
    logger && logger(`storage.service.isFileExist file.name: ${file.name}`);

    const filePath = this.storage.createFilePath({ logger, file });
    return this.storage.isFileExist({ logger, filePath });
  }
}

const storageServise = new Storage();

export default storageServise;
