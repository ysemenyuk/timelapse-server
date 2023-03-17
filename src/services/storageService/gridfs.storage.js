import _ from 'lodash';
import mongodb from 'mongodb';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { type } from '../../utils/constants.js';
import { makeVideoFileName, makePhotoFileName, makePosterFileName } from '../../utils/index.js';

const { MongoClient, ObjectId } = mongodb;

const namesMap = {
  [type.VIDEO]: makeVideoFileName,
  [type.PHOTO]: makePhotoFileName,
  [type.POSTER]: makePosterFileName,
};

const createFileName = (file) => {
  const startPart = `u_${file.user.toString()}/c_${file.camera.toString()}`;
  const fileName = namesMap[file.type](file.date);
  return [startPart, fileName].join('/');
};

const stream2buffer = (stream) => {
  return new Promise((resolve, reject) => {
    const _buf = [];
    stream.on('data', (chunk) => _buf.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(_buf)));
    stream.on('error', (err) => reject(err));
  });
};

//
// main
//

export default class GridfsStorage {
  constructor(loggerService) {
    this.loggerService = loggerService;
  }

  async init(config, sLogger) {
    const mongoClient = new MongoClient(config.gridfsDbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await mongoClient.connect();

    const database = mongoClient.db(config.gridfsDbName);
    this.bucket = new mongodb.GridFSBucket(database);

    sLogger(`storageService successfully starded! storageType: "gridfs", database: "${config.gridfsDbName}"`);
  }

  // create

  async createUserFolder() {
    // pass
  }

  async createCameraFolder() {
    // pass
  }

  // remove

  removeUserFiles({ logger, userId }) {
    logger && logger(`gridfs.storage.removeUserFiles userId: ${userId}`);
    // delete all user files
  }

  removeCameraFiles({ logger, userId, cameraId }) {
    logger && logger(`gridfs.storage.removeCameraFiles userId cameraId: ${userId} ${cameraId}`);
    // delete all camera files
  }

  // save file

  async saveFile({ logger, file, data, stream }) {
    logger && logger(`gridfs.storage.saveFile filePath: ${file.name}`);

    const fileName = createFileName(file);
    const uploadStream = this.bucket.openUploadStream(fileName, { metadata: { user: file.user, camera: file.camera } });

    try {
      if (stream) {
        await pipeline(stream, uploadStream);
      }
      if (data) {
        const streamFromData = Readable.from(data);
        await pipeline(streamFromData, uploadStream);
      }
    } catch (error) {
      console.log('error saveFile', error);
    }

    const link = `/files/g/${fileName}`;
    const [metadata] = await this.bucket.find({ filename: fileName }).toArray();
    // console.log('metadata', metadata);

    return { link, size: metadata.length };
  }

  // read file

  async readFile({ logger, file, type = 'buffer' }) {
    logger && logger(`gridFs.storage.readFile file.name: ${file.name}`);

    const stream = this.bucket.openDownloadStreamByName(file.name);

    try {
      if (type === 'stream') {
        return stream;
      }
      if (type === 'buffer') {
        const buffer = await stream2buffer(stream);
        return buffer;
      }
    } catch (error) {
      console.log('error readFile', error);
    }
  }

  // remove file

  async removeFile({ logger, file }) {
    logger && logger(`gridFs.storage.removeFile file.name: ${file.name}`);

    const fileName = createFileName(file);
    const [metadata] = await this.bucket.find({ filename: fileName }).toArray();
    // console.log('metadata', metadata);
    const deleted = await this.bucket.delete(ObjectId(metadata._id));
    return deleted;
  }

  // streams

  openDownloadStream({ logger, file }) {
    logger && logger(`gridFs.storage.openDownloadStream  file.name: ${file.name}`);

    const fileName = createFileName(file);
    const downloadStream = this.bucket.openDownloadStreamByName(fileName);
    return downloadStream;
  }

  openDownloadStreamByLink({ logger, fileLink }) {
    logger && logger(`gridFs.storage.openDownloadStreamByLink fileName: ${fileLink}`);

    const fileName = _.trimStart(fileLink, '/g/');
    const downloadStream = this.bucket.openDownloadStreamByName(fileName);
    return downloadStream;
  }

  //

  getFileStat({ logger, file }) {
    logger && logger(`gridFs.storage.fileStat file.name: ${file.name}`);
  }

  async isFileExist({ logger, file }) {
    logger && logger(`gridFs.storage.isFileExist file.name: ${file.name}`);

    const fileName = createFileName(file);
    const arr = await this.bucket.find({ filename: fileName }).toArray();
    // console.log('arr', arr);
    return Boolean(arr.length);
  }
}
