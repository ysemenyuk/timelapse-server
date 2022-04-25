import { createReadStream, createWriteStream } from 'fs';
import __dirname from '../dirname.js';
import path from 'path';
import fs from "fs";
const fsp = fs.promises;

const pathToFiles = path.join(__dirname, 'files');

export default () => {
  const writeFile = async ({ filePath, fileName, logger, data }) => {
    logger(`disk.storage.writeFile fileName: ${fileName}`);

    const fullPath = path.join(pathToFiles, ...filePath, fileName);
    console.log(11111111111, fullPath)

    const file = await fsp.writeFile(fullPath, data);

    return file;
  };

  const openUploadStream = ({ filePath, fileName, logger }) => {
    logger(`disk.storage.openUploadStream fileName: ${fileName}`);

    // TODO: check pathToFiles, make if not exist

    const fullPath = path.join(pathToFiles, ...filePath, fileName);

    // console.log(11111111111, fullPath)

    const uploadStream = createWriteStream(fullPath);

    return uploadStream;
  };

  const openDownloadStream = ({ file, logger }) => {
    logger(`disk.storage.openDownloadStream file.name: ${file.name}`);

    if (!file.path) {
      throw new Error('disk.storage.openDownloadStream have not file.path');
    }

    const fullPath = path.join(pathToFiles, ...file.path, file.name);
    const stream = createReadStream(fullPath);

    return stream;
  };

  const deleteOne = ({ file, logger }) => {
    logger(`disk.storage.deleteOne fileId: ${file.name}`);
  };

  return { writeFile, openUploadStream, openDownloadStream, deleteOne, type: 'disk' };
};
