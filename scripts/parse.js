import 'dotenv/config';
import moment from 'moment';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import CameraFile from '../models/CameraFile.js';

const dbUri = process.env.MONGO_URI;
const pathToStorage = process.env.PATH_TO_STORAGE;

const startPath = ['627cbb044c4bb63594cc2bd2', 'ScreenshotsByTime'];
const startParent = 'ScreenshotsByTime';

const userId = '60db0585ad1d0c334ff80948';
const cameraId = '627cbb044c4bb63594cc2bd2';
const parentId = '627cbb054c4bb63594cc2bd8';

const readFilesAndFolders = (pathToStorage, startPath, startParent, fileType = 'photo', folderType = 'folder') => {
  const fullPath = path.join(pathToStorage, ...startPath);
  const items = fs.readdirSync(fullPath);

  const result = [];

  items.forEach((itemName) => {
    const fullItemPath = path.join(fullPath, itemName);
    const itemStat = fs.statSync(fullItemPath);
    const itemType = itemStat.isDirectory() ? folderType : fileType;
    const item = { name: itemName, path: startPath, parent: startParent, type: itemType };

    if (itemStat.isDirectory()) {
      result.push(item, ...readFilesAndFolders(pathToStorage, [...startPath, itemName], itemName));
    } else {
      result.push(item);
    }
  });

  return result;
};

const updateFolderInDb = async (folder) => {
  const folderInDb = await CameraFile.findOne({ camera: cameraId, parent: parentId, name: folder.name });

  const item = {
    name: folder.name,
    date: moment(folder.name).format(),
    user: userId,
    camera: cameraId,
    parent: parentId,
    path: folder.path,
    type: folder.type,
  };

  if (folderInDb) {
    const updatedFolder = await CameraFile.findOneAndUpdate({ _id: folderInDb._id }, item, { new: true });
    return updatedFolder;
  } else {
    const folder = new CameraFile(item);
    await folder.save();
    return folder;
  }
};

const updateFileInDb = async (file) => {
  const fileInDb = await CameraFile.findOne({ camera: cameraId, name: file.name });
  const parentInDb = await CameraFile.findOne({ camera: cameraId, parent: parentId, name: file.parent });

  if (!parentInDb) {
    return;
  }

  const dateStringForParsing = file.name
    .slice(5, -4)
    .split('--')
    .map((item, index) => (index === 0 ? item : item.replace(/-/g, ':')))
    .join('T');

  const item = {
    name: file.name,
    date: moment(dateStringForParsing).format(),
    user: userId,
    camera: cameraId,
    parent: parentInDb._id,
    path: file.path,
    storage: 'disk',
    type: file.type,
  };

  if (fileInDb) {
    const updatedFile = await CameraFile.findOneAndUpdate({ _id: fileInDb._id }, item, { new: true });
    return updatedFile;
  } else {
    const file = new CameraFile(item);
    await file.save();
    return file;
  }
};

const start = async () => {
  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(111, `Mongoose successfully Connected`);

    const filesAndFolders = readFilesAndFolders(pathToStorage, startPath, startParent);

    const folders = filesAndFolders.filter((item) => item.type === 'folder');
    const foldersPromises = folders.map(updateFolderInDb);
    const foldersResult = await Promise.all(foldersPromises);

    console.log(222, 'foldersResult', foldersResult);

    const files = filesAndFolders.filter((item) => item.type !== 'folder');
    const filesPromises = files.map(updateFileInDb);
    const filesResult = await Promise.all(filesPromises);

    console.log(333, 'filesResult', filesResult);
  } catch (error) {
    console.log(999, 'error', error);
  }

  mongoose.connection.close();
};

start();
