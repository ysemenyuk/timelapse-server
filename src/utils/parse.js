import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import MongoDB from '../db/mongo.db.js';
import getServices from '../services/index.js';
import config from '../config.js';
import { makeDateString, makeTimeString } from './index.js';
import { fileCreateType, fileType, type } from './constants.js';

const startPath = 'u_641a9f7e23911029305ee801\\c_641aa43d482f2817d4b8f455\\Photos\\';
const userId = '641a9f7e23911029305ee801';
const cameraId = '641aa43d482f2817d4b8f455';

const readFiles = (pathToDir) => {
  const fullPath = path.join(config.pathToDiskSpace, pathToDir);
  const items = fs.readdirSync(fullPath);

  const result = [];

  items.forEach((itemName) => {
    const itemPath = path.join(pathToDir, itemName);
    const fullItemPath = path.join(config.pathToDiskSpace, itemPath);

    const itemStat = fs.statSync(fullItemPath);

    if (itemStat.isDirectory()) {
      result.push(...readFiles(itemPath));
    } else {
      const file = { name: itemName, path: itemPath, size: itemStat.size };
      result.push(file);
    }
  });

  return result;
};

const updateFileInDb = async (file, fileService) => {
  const fileInDb = await fileService.getOne({ camera: cameraId, name: file.name });

  if (fileInDb) {
    return null;
  }

  // console.log('file', file);

  const dateString = file.name
    .slice(7, -4)
    .split('--')
    .map((item, index) => (index === 0 ? item : item.replace(/-/g, ':')))
    .join('T');

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

  // console.log('payload', payload);

  const addedFileInDb = await fileService.createFileInDb({ payload });
  return addedFileInDb;
};

const start = async () => {
  const db = new MongoDB();
  const services = getServices(config);

  try {
    await db.connect(config, () => {});

    const filesOnDisk = readFiles(startPath);
    console.log('filesOnDisk.length', filesOnDisk.length);

    const filesPromises = filesOnDisk.map(async (file) => await updateFileInDb(file, services.fileService));
    // console.log('filesPromises', filesPromises);

    const filesResult = await Promise.all(filesPromises);
    // console.log('filesResult', filesResult);

    console.log('filesAddedInDb', filesResult.filter((i) => !!i).length);
  } catch (error) {
    console.log('error', error);
  }

  db.disconnect();
};

start();
