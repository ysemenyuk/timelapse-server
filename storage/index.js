import cloudStorage from './cloud.storage.js';
import diskStorage from './disk.storage.js';
import gridfsStorage from './gridfs.storage.js';

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
  // create
  //

  async createUserPath({ logger, userId }) {
    logger && logger(`storage.service.createUserPath userId: ${userId}`);

    const userDir = await this.storage.createUserPath({ logger, userId });
    return userDir;
  }

  async createCameraPath({ logger, userId, cameraId }) {
    logger && logger(`storage.service.createCameraPath cameraId: ${cameraId}`);

    const cameraDir = await this.storage.createCameraPath({ logger, userId, cameraId });
    return cameraDir;
  }

  //
  // remove
  //

  async removeUserFiles({ logger, userId }) {
    logger && logger(`storage.service.removeUserFiles userId: ${userId}`);

    const deleted = await this.storage.removeUserFiles({ logger, userId });
    return deleted;
  }

  async removeCameraFiles({ logger, userId, cameraId }) {
    logger && logger(`storage.service.removeCameraFiles cameraId: ${cameraId}`);

    const deleted = await this.storage.removeCameraFiles({ logger, userId, cameraId });
    return deleted;
  }

  //
  // save file
  //

  async saveFile({ logger, file, data, stream }) {
    logger && logger(`storage.service.saveFile file: ${file.name}`);

    const fileInfo = await this.storage.saveFile({ logger, file, data, stream });
    return fileInfo;
  }

  //
  // read file
  //

  async readFile({ logger, file, type }) {
    logger && logger(`storage.service.readFile file: ${file.name}`);

    const readed = await this.storage.readFile({ logger, file, type });
    return readed;
  }

  //
  // remove file
  //

  async removeFile({ logger, file }) {
    logger && logger(`storage.service.removeFile file.name: ${file.name}`);

    const deleted = await this.storage.removeFile({ logger, file });
    return deleted;
  }

  //
  // stream
  //

  openDownloadStreamByLink({ logger, fileLink }) {
    logger && logger(`storage.service.openDownloadStreamByLink fileLink: ${fileLink}`);

    const stream = this.storage.openDownloadStreamByLink({ logger, fileLink });
    return stream;
  }

  //
  //
  //

  async getFileStat({ logger, file }) {
    logger && logger(`storage.service.fileStat file.name: ${file.name}`);

    const stat = await this.storage.getFileStat({ logger, file });
    return stat;
  }

  isFileExist({ logger, file }) {
    logger && logger(`storage.service.isFileExist file.name: ${file.name}`);

    const isFileExist = this.storage.isFileExist({ logger, file });
    return isFileExist;
  }
}

const storageServise = new Storage();

export default storageServise;
