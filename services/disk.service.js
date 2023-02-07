import { createWriteStream, createReadStream } from 'fs';
import * as fsp from 'fs/promises';
import { pipeline } from 'stream/promises';
import path from 'path';

const pathToDiskSpace = process.env.DISK_PATH;

// create dir

const createTmpDir = async ({ logger }) => {
  logger && logger(`disk.service.createTmpDir`);
  const fullPath = path.join(pathToDiskSpace, 'tmp-');
  const created = await fsp.mkdtemp(fullPath);
  return created;
};

// remove dir

const removeDir = async ({ logger, dir }) => {
  logger && logger(`disk.service.removeDir dir: ${dir}`);
  const deleted = await fsp.rmdir(dir, { recursive: true });
  return deleted;
};

// save file

const saveFile = async ({ logger, dir, fileName, data, stream }) => {
  logger && logger(`disk.service.saveFile dir/fileName: ${dir}/${fileName}`);

  const fullPath = path.join(dir, fileName);

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

const openDownloadStream = ({ logger, dir, fileName }) => {
  logger && logger(`disk.service.openDownloadStream dir/fileName: ${dir}/${fileName}`);

  const fullPath = path.join(dir, fileName);
  const stream = createReadStream(fullPath);
  return stream;
};

export default {
  createTmpDir,
  removeDir,
  saveFile,
  openDownloadStream,
};
