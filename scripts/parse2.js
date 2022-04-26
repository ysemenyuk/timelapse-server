import fs from 'fs';
import path from 'path';
import moment from 'moment';
import mongoose from 'mongoose';
import CameraFile from '../models/CameraFile.js';

const fsp = fs.promises;

const dbUri = 'mongodb';

const pathToStorage = 'C:\\timelapse\\storage';
const startPath = '60b56c7c2fdb7d0b6a820a73';
const startParent = '60b56c7c2fdb7d0b6a820a73';

const start = (filePath, parent) => {
  const fullPath = path.join(pathToStorage, filePath);
  const files = fs.readdirSync(fullPath);

  console.log(222, 'files', files);

  const result = [];

  files.forEach((fileName) => {
    const fullFilePath = path.join(fullPath, fileName);
    const fileStat = fs.statSync(fullFilePath);

    const item = { name: fileName, path: filePath, parent };

    if (fileStat.isDirectory()) {
      const nextPath = path.join(filePath, fileName);
      result.push({ ...item, type: 'dir' }, ...start(nextPath, fileName));
    } else {
      result.push({ ...item, type: 'file' });
    }
  });

  return result;
};

const res = start(startPath, startParent);
console.log(res);
