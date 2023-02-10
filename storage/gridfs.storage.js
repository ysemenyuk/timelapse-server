import mongodb from 'mongodb';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { type } from '../utils/constants.js';
import { makeVideoFileName, makePhotoFileName, makePosterFileName } from '../utils/utils.js';

//

const map = {
  [type.VIDEO]: makeVideoFileName,
  [type.PHOTO]: makePhotoFileName,
  [type.POSTER]: makePosterFileName,
};

const createFileName = (file) => {
  const startPart = `g/u_${file.user.toString()}/u_${file.camera.toString()}`;
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
//
//

export default (mongoClient) => {
  //
  const database = mongoClient.db('myFirstDatabase');
  const bucket = new mongodb.GridFSBucket(database);

  // create

  const createUserPath = async ({ logger, userId }) => {
    logger && logger(`gridfs.storage.createUserPath userId: ${userId}`);
  };

  const createCameraPath = async ({ logger, userId, cameraId }) => {
    logger && logger(`gridfs.storage.createCameraPath userId cameraId: ${userId} ${cameraId}`);
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
    const uploadStream = bucket.openUploadStream(fileName);

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

    const link = `/files/${fileName}`;
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

  const removeFile = ({ logger, file }) => {
    logger(`gridFs.storage.removeFile file.name: ${file.name}`);
  };

  // streams

  const openDownloadStreamByLink = ({ logger, fileLink }) => {
    logger(`gridFs.storage.openDownloadStreamByLink fileLink: ${fileLink}`);

    const downloadStream = bucket.openDownloadStreamByName(fileLink);
    return downloadStream;
  };

  //

  const getFileStat = async ({ logger, file }) => {
    logger && logger(`gridFs.storage.fileStat file.name: ${file.name}`);
  };

  const isFileExist = ({ logger, file }) => {
    logger && logger(`gridFs.storage.isFileExist file.name: ${file.name}`);
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
