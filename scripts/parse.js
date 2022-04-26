import fs from 'fs';
import path from 'path';
import moment from 'moment';
import mongoose from 'mongoose';
import 'dotenv/config';
import CameraFile from '../models/CameraFile.js';
import { readFilesAndDirs } from '../utils/index.js';

const fsp = fs.promises;

const dbUri = process.env.MONGO_URI;

const pathToStorage = 'C:\\timelapse\\storage';
const startPath = ['60b56c7c2fdb7d0b6a820a73', 'screenshots'];
const startParent = 'screenshots';

const userId = '60db0585ad1d0c334ff80948';
const cameraId = '60b56c7c2fdb7d0b6a820a73';

const updateFileInDb = async (file) => {
  // console.log(333, 'file', file);

  const dateStringForParsing =
    file.type === 'folder'
      ? file.name
      : file.name
          .slice(5, -4)
          .split('--')
          .map((item, index) => (index === 0 ? item : item.replace(/-/g, ':')))
          .join('T');

  const date = moment(dateStringForParsing).format();

  const fileInDb = await CameraFile.findOne({ camera: cameraId, name: file.name });
  const parentInDb = await CameraFile.findOne({ camera: cameraId, name: file.parent });

  console.log(333, 'fileInDb', fileInDb);
  console.log(333, 'parentInDb', parentInDb);

  const item = {
    name: file.name,
    date: date,
    user: userId,
    camera: cameraId,
    parent: file.parent,
    path: file.path,
    storage: 'disk',
    type: file.type,
  };

  // console.log(444, 'item', item);

  // if (fileInDb) {
  //   const updatedFile = await CameraFile.updateOne({ _id: fileId }, item);
  //   return updatedFile;
  // } else {
  //   const file = new CameraFile(item);
  //   await file.save();
  //   return file;
  // }
};

const start = async () => {
  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(111, `Mongoose successfully Connected`);

    const files = readFilesAndDirs(pathToStorage, startPath, startParent);
    // console.log(222, 'files', files);

    const promises = files.map(updateFileInDb);

    const result = await Promise.all(promises);
    console.log(9999, result);
  } catch (error) {
    console.log(8888, error);
  }

  mongoose.connection.close();
};

start();
