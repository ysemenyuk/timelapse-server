import mongodb from 'mongodb';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import paths from './paths.js';

export default (mongoClient) => {
  console.log(111111);

  const database = mongoClient.db('myFirstDatabase');
  const bucket = new mongodb.GridFSBucket(database);
  // const collection = database.collection('fs.files');

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

    const link = `/files/db/${filePath}`;
    // const meta = await collection.find({ name: filePath });
    // console.log('meta, meta);

    return { link };
  };

  // streams

  const openUploadStream = ({ fileName, logger }) => {
    logger(`gridFs.storage.openUploadStream fileName: ${fileName}`);

    const database = mongoClient.db('myFirstDatabase');
    const bucket = new mongodb.GridFSBucket(database);

    const uploadStream = bucket.openUploadStream(fileName);
    return uploadStream;
  };

  const openDownloadStream = ({ file, logger }) => {
    logger(`gridFs.storage.openDownloadStream file.name isThumbnail: ${file.name}`);

    if (!file.name) {
      throw new Error('gridFs.storage.openDownloadStream have not file.name');
    }

    const database = mongoClient.db('myFirstDatabase');
    const bucket = new mongodb.GridFSBucket(database);

    const downloadStream = bucket.openDownloadStreamByName(file.name);
    return downloadStream;
  };

  const deleteOne = ({ file, logger }) => {
    logger(`gridFs.storage.deleteOne file.name: ${file.name}`);

    // return bucket.delete(file);
  };

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
    saveFile,
    openUploadStream,
    openDownloadStream,
    deleteOne,
    fileStat,
    isDirExist,
    isFileExist,
    ...paths,
  };
};
