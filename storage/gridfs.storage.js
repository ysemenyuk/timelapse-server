import mongodb from 'mongodb';
import _ from 'lodash';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { type } from '../utils/constants.js';
import { makeVideoFileName, makePhotoFileName, makePosterFileName } from '../utils/utils.js';

const dbUri = process.env.MONGO_URI;
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

export default async () => {
  //
  const mongoClient = new MongoClient(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await mongoClient.connect();

  const database = mongoClient.db('myFirstDatabase');
  const bucket = new mongodb.GridFSBucket(database);

  // create

  const createUserPath = async () => {
    // pass
  };

  const createCameraPath = async () => {
    // pass
  };

  // remove

  const removeUserFiles = async ({ logger, userId }) => {
    logger && logger(`gridfs.storage.removeUserFiles userId: ${userId}`);
    // delete all user files
  };

  const removeCameraFiles = async ({ logger, userId, cameraId }) => {
    logger && logger(`gridfs.storage.removeCameraFiles userId cameraId: ${userId} ${cameraId}`);
    // delete all camera files
  };

  // save file

  const saveFile = async ({ logger, file, data, stream }) => {
    logger && logger(`gridfs.storage.saveFile filePath: ${file.name}`);

    const fileName = createFileName(file);
    const uploadStream = bucket.openUploadStream(fileName, { metadata: { user: file.user, camera: file.camera } });

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
    const [metadata] = await bucket.find({ filename: fileName }).toArray();
    // console.log('metadata', metadata);

    return { link, size: metadata.length };
  };

  // read file

  const readFile = async ({ logger, file, type = 'buffer' }) => {
    logger && logger(`gridFs.storage.readFile file.name: ${file.name}`);

    const stream = bucket.openDownloadStreamByName(file.name);

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
  };

  // remove file

  const removeFile = async ({ logger, file }) => {
    logger && logger(`gridFs.storage.removeFile file.name: ${file.name}`);

    const fileName = createFileName(file);
    const [metadata] = await bucket.find({ filename: fileName }).toArray();
    // console.log('metadata', metadata);
    const deleted = await bucket.delete(ObjectId(metadata._id));
    return deleted;
  };

  // streams

  const openDownloadStream = ({ logger, file }) => {
    logger && logger(`gridFs.storage.openDownloadStream  file.name: ${file.name}`);

    const fileName = createFileName(file);
    const downloadStream = bucket.openDownloadStreamByName(fileName);
    return downloadStream;
  };

  const openDownloadStreamByLink = ({ logger, fileLink }) => {
    logger && logger(`gridFs.storage.openDownloadStreamByLink fileName: ${fileLink}`);

    const fileName = _.trimStart(fileLink, '/g/');
    const downloadStream = bucket.openDownloadStreamByName(fileName);
    return downloadStream;
  };

  //

  const getFileStat = async ({ logger, file }) => {
    logger && logger(`gridFs.storage.fileStat file.name: ${file.name}`);
  };

  const isFileExist = async ({ logger, file }) => {
    logger && logger(`gridFs.storage.isFileExist file.name: ${file.name}`);

    const fileName = createFileName(file);
    const arr = await bucket.find({ filename: fileName }).toArray();
    // console.log('arr', arr);
    return Boolean(arr.length);
  };

  return {
    createUserPath,
    createCameraPath,
    removeUserFiles,
    removeCameraFiles,
    saveFile,
    readFile,
    removeFile,
    openDownloadStream,
    openDownloadStreamByLink,
    getFileStat,
    isFileExist,
  };
};
