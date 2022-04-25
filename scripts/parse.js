import fs from 'fs';
import path from 'path';
import moment from 'moment';
import mongoose from 'mongoose';
import CameraFile from '../models/CameraFile.js';

const fsp = fs.promises;

const dbUri = 'mongodb://localhost:27017/timelapse';

const pathToStorage = 'C:\\timelapse\\timelapse\\server\\files';
const pathToDir = '60b56c7c2fdb7d0b6a820a73\\screenshots';

const fullPath = path.join(pathToStorage, pathToDir);

const start = async () => {
  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(111, `Mongoose successfully Connected`);

    // const date = moment().format();
    // console.log(date);

    // const fileName = `img--${date.split('+')[0].replace(/:/g, '-').replace(/T/g, '--')}.jpg`;

    // console.log(fileName);
    // const dateStringForParsing = fileName.slice(5, -4).split('--').map((item, index) => index === 0 ? item: item.replace(/-/g, ':')).join('T')

    // console.log(moment(dateStringForParsing).format())

    // console.log(dateStringForParsing === date)

    const userId = '60db0585ad1d0c334ff80948';
    const cameraId = '60b56c7c2fdb7d0b6a820a73';
    const parentId = '60db02309ba0333035783f10';
    const filePath = [cameraId, 'screenshots'];

    const files = await fsp.readdir(fullPath);
    console.log(222, 'files', files);

    const fileName = files[0];

    const dateStringForParsing = fileName
      .slice(5, -4)
      .split('--')
      .map((item, index) => (index === 0 ? item : item.replace(/-/g, ':')))
      .join('T');

    const date = moment(dateStringForParsing).format();

    console.log(333, 'fileName', fileName);

    const file = await await CameraFile.findOne({ name: fileName });

    console.log(444, 'file', file);

    if (!file) {
      const screenshot = await cameraFileService.createOne({
        name: fileName,
        date: date,
        user: userId,
        camera: cameraId,
        parent: parentId,
        path: filePath,
        storage: 'disk',
        type: 'screenshot',
      });

      console.log(555, 'screenshot', screenshot);
    }
  } catch (error) {
    console.log(123, error);
  }

  mongoose.connection.close();
};

start();
