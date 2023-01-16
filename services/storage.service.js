import * as fsp from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import path from 'path';

const pathToStorage = process.env.PATH_TO_STORAGE;

const creteFullPath = (itemPath) => path.join(pathToStorage, ...itemPath);

const createFolder = async ({ logger, folderPath }) => {
  const fullPath = creteFullPath(folderPath);
  logger && logger(`disk.storage.createFolder fullPath: ${fullPath}`);

  const folder = await fsp.mkdir(fullPath);
  return folder;
};

const removeFolder = async ({ logger, folderPath }) => {
  const fullPath = creteFullPath(folderPath);
  logger && logger(`disk.storage.removeFolder fullPath: ${fullPath}`);

  const deleted = await fsp.rmdir(fullPath, { recursive: true });
  return deleted;
};

const removeFile = async ({ logger, filePath }) => {
  const fullPath = creteFullPath(filePath);
  logger && logger(`disk.storage.removeFile fileName: ${fullPath}`);

  const deleted = await fsp.unlink(fullPath);
  return deleted;
};

const readFile = async ({ logger, filePath }) => {
  const fullPath = creteFullPath(filePath);
  logger && logger(`disk.storage.readFile fullPath: ${fullPath}`);

  const file = await fsp.readFile(fullPath);
  return file;
};

const writeFile = async ({ logger, filePath, data }) => {
  const fullPath = creteFullPath(filePath);
  logger && logger(`disk.storage.writeFile fullPath: ${fullPath}`);

  const file = await fsp.writeFile(fullPath, data);
  return file;
};

const openUploadStream = ({ logger, filePath }) => {
  const fullPath = creteFullPath(filePath);
  logger && logger(`disk.storage.openUploadStream fileName: ${fullPath}`);

  const uploadStream = createWriteStream(fullPath);
  return uploadStream;
};

const openDownloadStream = ({ logger, filePath }) => {
  const fullPath = creteFullPath(filePath);
  logger && logger(`disk.storage.openDownloadStream fileName: ${fullPath}`);

  const stream = createReadStream(fullPath);
  return stream;
};

const copyFile = async ({ logger, sourceFilePath, destinationFilePath }) => {
  const sourceFullPath = creteFullPath(sourceFilePath);
  const destinationFullPath = creteFullPath(destinationFilePath);

  logger && logger(`disk.storage.copyFile ${sourceFullPath} to ${destinationFullPath}`);
  await fsp.copyFile(sourceFullPath, destinationFullPath);
};

const fileStat = ({ logger, filePath }) => {
  const fullPath = creteFullPath(filePath);
  logger && logger(`disk.storage.fileStat fileName: ${fullPath}`);

  const stat = fsp.stat(fullPath);
  return stat;
};

export default {
  creteFullPath,
  createFolder,
  writeFile,
  readFile,
  removeFolder,
  removeFile,
  openUploadStream,
  openDownloadStream,
  copyFile,
  fileStat,
};
