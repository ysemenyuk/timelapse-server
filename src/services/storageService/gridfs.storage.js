import mongodb from 'mongodb';
import _ from 'lodash';
import debug from 'debug';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { type } from '../../utils/constants.js';
import { makeVideoFileName, makePhotoFileName, makePosterFileName } from '../../utils/utils.js';
import config from '../../config.js';

const { MongoClient, ObjectId } = mongodb;

const map = {
  [type.VIDEO]: makeVideoFileName,
  [type.PHOTO]: makePhotoFileName,
  [type.POSTER]: makePosterFileName,
};

const createFileName = (file) => {
  const startPart = `u_${file.user.toString()}/c_${file.camera.toString()}`;
  const fileName = map[file.type](file.date);
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

class GridfsStorage {
  constructor() {
    this.logger = debug('storage');
  }

  async init() {
    const mongoClient = new MongoClient(config.dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await mongoClient.connect();

    const database = mongoClient.db('myFirstDatabase');
    this.bucket = new mongodb.GridFSBucket(database);

    this.logger(`storageType - "gridfs", database - "myFirstDatabase"`);
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

export default GridfsStorage;
