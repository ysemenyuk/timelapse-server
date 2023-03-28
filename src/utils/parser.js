import 'dotenv/config';
import fsp from 'node:fs/promises';
import path from 'path';
import MongoDB from '../db/mongo.db.js';
import getServices from '../services/index.js';
import config from '../config.js';
import { makeDateString, makeTimeString } from './index.js';
import { fileCreateType, fileType, type } from './constants.js';

const readDirs = async (pathToDir) => {
  const fullPath = path.join(config.pathToDiskSpace, pathToDir);
  const dirs = await fsp.readdir(fullPath);

  const result = dirs.map((dirName) => {
    const dirPath = path.join(pathToDir, dirName);
    return dirPath;
  });

  return result;
};

const readFiles = async (pathToDir) => {
  const fullPath = path.join(config.pathToDiskSpace, pathToDir);
  const files = await fsp.readdir(fullPath);

  const filesPromises = files.map(async (fileName) => {
    const filePath = path.join(pathToDir, fileName);
    const fileStat = await fsp.stat(path.join(config.pathToDiskSpace, filePath));
    const file = { name: fileName, path: filePath, size: fileStat.size };
    return file;
  });

  const result = await Promise.all(filesPromises);
  return result;
};

const createFileInDb = async (userId, cameraId, file, fileService) => {
  const fileInDb = await fileService.getOne({ camera: cameraId, name: file.name });

  if (fileInDb) {
    return null;
  }

  const dateAndTime = file.name.replace(/.jpg/, '').split('--');
  const dateString = `${dateAndTime[1]}T${dateAndTime[2].replace(/-/, ':')}`;

  const date = new Date(dateString);

  const payload = {
    name: file.name,
    date: date,
    user: userId,
    camera: cameraId,
    task: null,

    dateString: makeDateString(date),
    timeString: makeTimeString(date),

    link: `/files/${file.path}`,
    size: file.size,

    type: type.PHOTO,
    fileType: fileType.IMAGE_JPG,
    createType: fileCreateType.BY_HAND,

    photoFileData: {
      photoUrl: null,
    },
  };

  const addedFileInDb = await fileService.createFileInDb({ payload });
  return addedFileInDb;
};

const start = async (userId, cameraId) => {
  const db = new MongoDB();
  const { fileService } = getServices(config);

  try {
    await db.connect(config, () => {});

    const photosDir = `u_${userId}\\c_${cameraId}\\Photos`;
    const datesDirs = await readDirs(photosDir);
    // console.log('dirs', dirs);

    for (const dir of datesDirs) {
      console.log({ dir });

      const filesInDir = await readFiles(dir);
      const filesPromises = filesInDir.map(async (file) => await createFileInDb(userId, cameraId, file, fileService));
      const filesResult = await Promise.all(filesPromises);

      console.log('filesInDir', filesResult.length);
      console.log('filesAddedInDb', filesResult.filter((i) => !!i).length);
    }
  } catch (error) {
    console.log('error', error);
  }

  db.disconnect();
};

const userId = '641a9f7e23911029305ee801';
const cameraId = '641aa43d482f2817d4b8f455';

start(userId, cameraId);
