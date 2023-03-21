import { createWriteStream, createReadStream } from 'fs';
import * as fsp from 'fs/promises';
import { pipeline } from 'stream/promises';
import path from 'path';

// create dir

const createTmpDir = async () => {
  const fullPath = path.join(process.cwd(), 'temp', 'tmp-');
  const created = await fsp.mkdtemp(fullPath);
  return created;
};

// remove dir

const removeDir = async ({ dir }) => {
  const deleted = await fsp.rm(dir, { recursive: true });
  return deleted;
};

// save file

const saveFile = async ({ dir, file, data, stream }) => {
  const fullPath = path.join(dir, file);

  if (stream) {
    const writeStream = createWriteStream(fullPath);
    await pipeline(stream, writeStream);
  }

  if (data) {
    await fsp.writeFile(fullPath, data);
  }

  return fullPath;
};

const openDownloadStream = ({ dir, file }) => {
  const fullPath = path.join(dir, file);
  const stream = createReadStream(fullPath);
  return stream;
};

export default {
  createTmpDir,
  removeDir,
  saveFile,
  openDownloadStream,
};
