import * as fsp from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import path from 'path';

const pathToFiles = process.env.PATH_TO_STORAGE;

const creteFullPath = (itemPath, itemName) => path.join(pathToFiles, ...itemPath, itemName);

const createFolder = async ({ logger, folderPath, folderName }) => {
  const fullPath = creteFullPath(folderPath, folderName);
  logger && logger(`disk.storage.createFolder fullPath: ${fullPath}`);

  const folder = await fsp.mkdir(fullPath);
  return folder;
};

const removeFolder = async ({ logger, folderPath, folderName }) => {
  const fullPath = creteFullPath(folderPath, folderName);
  logger && logger(`disk.storage.removeFolder fullPath: ${fullPath}`);

  const deleted = await fsp.rmdir(fullPath, { recursive: true });
  return deleted;
};

const removeFile = async ({ logger, filePath, fileName }) => {
  const fullPath = creteFullPath(filePath, fileName);
  logger && logger(`disk.storage.removeFile fileName: ${fullPath}`);

  const deleted = await fsp.unlink(fullPath);
  return deleted;
};

const readFile = async ({ logger, filePath, fileName }) => {
  const fullPath = creteFullPath(filePath, fileName);
  logger && logger(`disk.storage.readFile fullPath: ${fullPath}`);

  const file = await fsp.readFile(fullPath);
  return file;
};

const writeFile = async ({ logger, filePath, fileName, data }) => {
  const fullPath = creteFullPath(filePath, fileName);
  logger && logger(`disk.storage.writeFile fullPath: ${fullPath}`);

  const file = await fsp.writeFile(fullPath, data);
  return file;
};

const openUploadStream = ({ logger, filePath, fileName }) => {
  const fullPath = creteFullPath(filePath, fileName);
  logger && logger(`disk.storage.openUploadStream fileName: ${fullPath}`);

  const uploadStream = createWriteStream(fullPath);
  return uploadStream;
};

const openDownloadStream = ({ logger, filePath, fileName }) => {
  const fullPath = creteFullPath(filePath, fileName);
  logger && logger(`disk.storage.openDownloadStream fileName: ${fullPath}`);

  const stream = createReadStream(fullPath);
  return stream;
};

const fileStat = ({ logger, filePath, fileName }) => {
  const fullPath = creteFullPath(filePath, fileName);
  logger && logger(`disk.storage.fileStat fileName: ${fullPath}`);

  const stat = fsp.stat(fullPath);
  return stat;
};

export default {
  createFolder,
  writeFile,
  readFile,
  removeFolder,
  removeFile,
  openUploadStream,
  openDownloadStream,
  fileStat,
};
