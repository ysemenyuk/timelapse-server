import { existsSync, createWriteStream, createReadStream } from 'fs';
import * as fsp from 'fs/promises';
import { pipeline } from 'stream/promises';
import path from 'path';
import paths from './paths.js';

// const stp = st.promises;

const pathToDiskSpace = process.env.DISK_PATH;

const createFullPath = (filePath) => path.join(pathToDiskSpace, filePath);

// const promisifyUploadStream = (stream, uploadStream) => {
//   return new Promise((resolve, reject) => {
//     stream.on('error', () => {
//       console.log('error file readStream');
//       // reject('error file readStream');
//     });

//     stream.on('end', () => {
//       console.log('end file readStream');
//       // resolve('end file readStream');
//     });

//     uploadStream.on('error', () => {
//       console.log('error file uploadStream');
//       reject('error file uploadStream');
//     });

//     uploadStream.on('finish', () => {
//       console.log('finish file uploadStream');
//       resolve('finish file uploadStream');
//     });
//   });
// };

// create dir

const createDir = async ({ logger, dirPath }) => {
  logger && logger(`disk.storage.createDir dirPath: ${dirPath}`);
  const fullPath = createFullPath(dirPath);
  const created = await fsp.mkdir(fullPath);
  return created;
};

const createTmpDir = async ({ logger }) => {
  logger && logger(`disk.storage.createTmpDir`);
  const fullPath = createFullPath('tmp-');
  const created = await fsp.mkdtemp(fullPath);
  return created;
};

// remove dir

const removeDir = async ({ logger, dirPath }) => {
  logger && logger(`disk.storage.removeDir dirPath: ${dirPath}`);
  const fullPath = createFullPath(dirPath);
  const deleted = await fsp.rmdir(fullPath, { recursive: true });
  return deleted;
};

const removeTmpDir = async ({ logger, tmpdir }) => {
  logger && logger(`disk.storage.removeTmpDir tmpdir: ${tmpdir}`);
  // const fullPath = createFullPath(dirPath);
  const deleted = await fsp.rmdir(tmpdir, { recursive: true });
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
    console.log('error saveFileInTmpDir', error);
  }

  const link = `/files/${filePath}`;
  const { size } = await fsp.stat(fullPath);

  return { link, size };
};

const saveFileInTmpDir = async ({ logger, tmpdir, fileName, data, stream }) => {
  logger && logger(`disk.storage.saveFileInTmpDir tmpdir/fileName: ${tmpdir}/${fileName}`);

  const fullPath = path.join(tmpdir, fileName);

  try {
    if (stream) {
      const writeStream = createWriteStream(fullPath);
      await pipeline(stream, writeStream);
    }
    if (data) {
      await fsp.writeFile(fullPath, data);
    }
  } catch (error) {
    console.log('error saveFileInTmpDir', error);
  }

  return fullPath;
};

const openDownloadStreamFromTmpDir = ({ logger, tmpdir, fileName }) => {
  logger && logger(`disk.storage.openDownloadStreamFromTmpDir tmpdir/fileName: ${tmpdir}/${fileName}`);

  const fullPath = path.join(tmpdir, fileName);
  const stream = createReadStream(fullPath);
  return stream;
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

// copy

const copyFile = async ({ logger, sourceFilePath, destinationFilePath }) => {
  logger && logger(`disk.storage.copyFile ${sourceFilePath} to ${destinationFilePath}`);

  const sourceFullPath = createFullPath(sourceFilePath);
  const destinationFullPath = createFullPath(destinationFilePath);
  await fsp.copyFile(sourceFullPath, destinationFullPath);
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

export default {
  createFullPath,
  createDir,
  createTmpDir,
  removeDir,
  removeTmpDir,
  saveFile,
  saveFileInTmpDir,
  openDownloadStreamFromTmpDir,
  removeFile,
  copyFile,
  fileStat,
  isDirExist,
  isFileExist,
  openUploadStream,
  openDownloadStream,
  ...paths,
};
