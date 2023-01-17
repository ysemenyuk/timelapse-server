import * as fsp from 'fs/promises';
import { existsSync, createWriteStream, createReadStream } from 'fs';
import path from 'path';

const pathToDiskSpace = process.env.DISK_PATH;

const createFullPath = (filePath) => path.join(pathToDiskSpace, ...filePath);

const promisifyUploadStream = (uploadStream) => {
  return new Promise((resolve, reject) => {
    uploadStream.on('error', () => {
      // console.log('error file uploadStream');
      reject('error file uploadStream');
    });

    uploadStream.on('finish', () => {
      // console.log('finish uploadStream');
      resolve('finish file uploadStream');
    });
  });
};

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

const makeLink = (file) => {
  if (file.link) {
    return file.link;
  }
  return `/files/${file._id}`;
};

const makePreview = (file) => {
  if (file.preview) {
    return file.preview;
  }
  if (file.fileType.includes('image')) {
    return `/files/${file._id}?size=thumbnail`;
  }
  if (file.fileType.includes('video')) {
    return `/files/${file._id}/poster`;
  }
  return `/files/${file._id}`;
};

const saveFile = async ({ logger, file, filePath, data, stream }) => {
  logger && logger(`disk.storage.saveFile filePath: ${filePath}`);

  const fullPath = createFullPath(filePath);

  if (stream) {
    const writeStream = createWriteStream(fullPath);
    stream.pipe(writeStream);
    await promisifyUploadStream(writeStream);
  }

  if (data) {
    await fsp.writeFile(fullPath, data);
  }

  const link = makeLink(file);
  const preview = makePreview(file);
  const { size } = await fsp.stat(fullPath);

  return { link, preview, size };
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

//

const copyFile = async ({ logger, sourceFilePath, destinationFilePath }) => {
  logger && logger(`disk.storage.copyFile ${sourceFilePath} to ${destinationFilePath}`);

  const sourceFullPath = createFullPath(sourceFilePath);
  const destinationFullPath = createFullPath(destinationFilePath);
  await fsp.copyFile(sourceFullPath, destinationFullPath);
};

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
  removeDir,
  saveFile,
  removeFile,
  copyFile,
  fileStat,
  isDirExist,
  isFileExist,
  openUploadStream,
  openDownloadStream,
};
