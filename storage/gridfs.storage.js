import mongodb from 'mongodb';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import paths from './paths.js';

export default (mongoClient) => {
  // console.log(111111);

  const database = mongoClient.db('myFirstDatabase');
  const bucket = new mongodb.GridFSBucket(database);
  // const collection = database.collection('fs.files');

  // create dir

  const createDir = async ({ logger, dirPath }) => {
    logger && logger(`gridfs.storage.createDir dirPath: ${dirPath}`);
  };

  // remove dir

  const removeDir = async ({ logger, dirPath }) => {
    logger && logger(`gridfs.storage.removeDir dirPath: ${dirPath}`);
  };

  // save file

  const saveFile = async ({ logger, filePath, data, stream }) => {
    logger && logger(`gridfs.storage.saveFile filePath: ${filePath}`);

    const uploadStream = bucket.openUploadStream(filePath);

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

    const link = `/files/g/${filePath}`;
    const [metadata] = await bucket.find({ filename: filePath }).toArray();
    // console.log('metadata', metadata);

    return { link, size: metadata.length };
  };

  // read file

  function stream2buffer(stream) {
    return new Promise((resolve, reject) => {
      const _buf = [];
      stream.on('data', (chunk) => _buf.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(_buf)));
      stream.on('error', (err) => reject(err));
    });
  }

  const readFile = async ({ logger, filePath, type }) => {
    logger && logger(`disk.storage.readFile filePath: ${filePath}`);

    const stream = bucket.openDownloadStreamByName(filePath);

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

  const removeFile = ({ logger, filePath }) => {
    logger(`gridFs.storage.removeFile filePath: ${filePath}`);
  };

  // stream

  const openUploadStream = ({ logger, filePath }) => {
    logger && logger(`gridFs.storage.openUploadStream filePath: ${filePath}`);

    const uploadStream = bucket.openUploadStream(filePath);
    return uploadStream;
  };

  const openDownloadStream = ({ logger, filePath }) => {
    logger(`gridFs.storage.openDownloadStream filePath: ${filePath}`);

    const downloadStream = bucket.openDownloadStreamByName(filePath);
    return downloadStream;
  };

  // stat

  const fileStat = async ({ logger, filePath }) => {
    logger && logger(`gridFs.storage.fileStat filePath: ${filePath}`);
  };

  const isDirExist = ({ logger, dirPath }) => {
    logger && logger(`gridFs.storage.isDirExist dirPath: ${dirPath}`);
    return true;
  };

  const isFileExist = ({ logger, filePath }) => {
    logger && logger(`gridFs.storage.isFileExist filePath: ${filePath}`);
  };

  return {
    createDir,
    removeDir,
    saveFile,
    readFile,
    removeFile,
    fileStat,
    isDirExist,
    isFileExist,
    openUploadStream,
    openDownloadStream,
    ...paths,
  };
};
