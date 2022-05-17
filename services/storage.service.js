import * as fsp from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import path from 'path';

const pathToFiles = process.env.PATH_TO_STORAGE;

const creteFullPath = (itemPath, itemName) => path.join(pathToFiles, ...itemPath, itemName);

const createFolder = async ({ logger, folderPath, folderName }) => {
  logger && logger(`disk.storage.makeFolder fileName: ${folderName}`);

  const fullPath = creteFullPath(folderPath, folderName);
  logger && logger(`disk.storage.makeFolder fullPath: ${fullPath}`);

  const folder = await fsp.mkdir(fullPath);
  return folder;
};

const removeFolder = async ({ logger, folderPath, folderName }) => {
  logger && logger(`disk.storage.removeFolder fileName: ${folderName}`);

  const fullPath = creteFullPath(folderPath, folderName);
  return await fsp.rmdir(fullPath, { recursive: true });
};

const removeFile = async ({ logger, filePath, fileName }) => {
  logger && logger(`disk.storage.removeFile fileName: ${fileName}`);

  const fullPath = creteFullPath(filePath, fileName);
  return await fsp.unlink(fullPath);
};

const readFile = async ({ logger, filePath, fileName }) => {
  logger && logger(`disk.storage.readFile fileName: ${fileName}`);

  const fullPath = creteFullPath(filePath, fileName);
  const file = await fsp.readFile(fullPath);
  return file;
};

const writeFile = async ({ logger, filePath, fileName, data }) => {
  logger && logger(`disk.storage.writeFile fileName: ${fileName}`);

  const fullPath = creteFullPath(filePath, fileName);
  const file = await fsp.writeFile(fullPath, data);
  return file;
};

const openUploadStream = ({ logger, filePath, fileName }) => {
  logger && logger(`disk.storage.openUploadStream fileName: ${fileName}`);

  // TODO: check pathToFiles, make if not exist

  const fullPath = creteFullPath(filePath, fileName);
  const uploadStream = createWriteStream(fullPath);

  return uploadStream;
};

const openDownloadStream = ({ logger, filePath, fileName }) => {
  logger && logger(`disk.storage.openDownloadStream fileName: ${fileName}`);

  if (!filePath) {
    throw new Error('disk.storage.openDownloadStream have not filePath');
  }

  const fullPath = creteFullPath(filePath, fileName);
  const stream = createReadStream(fullPath);

  return stream;
};

export default {
  createFolder,
  writeFile,
  readFile,
  removeFolder,
  removeFile,
  openUploadStream,
  openDownloadStream,
};
