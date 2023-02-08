import { existsSync, createWriteStream, createReadStream } from 'fs';
import * as fsp from 'fs/promises';
import { pipeline } from 'stream/promises';
import path from 'path';
import paths from './paths.js';

const pathToDiskSpace = process.env.DISK_PATH;

export default () => {
  const createFullPath = (filePath) => path.join(pathToDiskSpace, filePath);

  // create dir

  const createDir = async ({ logger, dirPath }) => {
    logger && logger(`disk.storage.createDir dirPath: ${dirPath}`);
    const fullPath = createFullPath(dirPath);
    const created = await fsp.mkdir(fullPath);
    return created;
  };

  // remove dir

  const removeDir = async ({ logger, dirPath }) => {
    logger && logger(`disk.storage.removeDir dirPath: ${dirPath}`);
    const fullPath = createFullPath(dirPath);
    const deleted = await fsp.rmdir(fullPath, { recursive: true });
    return deleted;
  };

  // save file

  const saveFile = async ({ logger, filePath, data, stream }) => {
    logger && logger(`disk.storage.saveFile filePath: ${filePath}`);

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

  const readFile = async ({ logger, filePath, type }) => {
    logger && logger(`disk.storage.readFile filePath: ${filePath}`);

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

  const removeFile = async ({ logger, filePath }) => {
    logger && logger(`disk.storage.removeFile filePath: ${filePath}`);

    const fullPath = createFullPath(filePath);
    const deleted = await fsp.unlink(fullPath);
    return deleted;
  };

  // streams

  const openUploadStream = ({ logger, filePath }) => {
    logger && logger(`disk.storage.openUploadStream filePath: ${filePath}`);

    const fullPath = createFullPath(filePath);
    const stream = createWriteStream(fullPath);
    return stream;
  };

  const openDownloadStream = ({ logger, filePath }) => {
    logger && logger(`disk.storage.openDownloadStream filePath: ${filePath}`);

    const fullPath = createFullPath(filePath);
    const stream = createReadStream(fullPath);
    return stream;
  };

  // stat

  const fileStat = async ({ logger, filePath }) => {
    logger && logger(`disk.storage.fileStat filePath: ${filePath}`);

    const fullPath = createFullPath(filePath);
    const stat = await fsp.stat(fullPath);
    return stat;
  };

  const isDirExist = ({ logger, dirPath }) => {
    logger && logger(`disk.storage.isDirExist dirPath: ${dirPath}`);
    const fullPath = createFullPath(dirPath);
    return existsSync(fullPath);
  };

  const isFileExist = ({ logger, filePath }) => {
    logger && logger(`disk.storage.isFileExist filePath: ${filePath}`);
    const fullPath = createFullPath(filePath);
    return existsSync(fullPath);
  };

  return {
    createFullPath,
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
