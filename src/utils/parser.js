import 'dotenv/config';
import fsp from 'node:fs/promises';
import path from 'path';
import MongoDB from '../db/mongo.db.js';
import getServices from '../services/index.js';
import config from '../config.js';
import { makeDateString, makeTimeString } from './index.js';
import { fileCreateType, fileType, type } from './constants.js';
import { format } from 'date-fns';

const readDirs = async (pathToDir) => {
  const fullPath = path.join(config.pathToDiskSpace, pathToDir);
  const dirsNames = await fsp.readdir(fullPath);

  const dirsPaths = dirsNames.map((dirName) => {
    const dirPath = path.join(pathToDir, dirName);
    return dirPath;
  });

  return dirsPaths;
};

// const renameFiles = async (pathToDir) => {
//   const fullPath = path.join(config.pathToDiskSpace, pathToDir);
//   const filesNames = await fsp.readdir(fullPath);

//   const filesInDir = await Promise.all(
//     filesNames.map(async (fileName) => {
//       const filePath = path.join(pathToDir, fileName);
//       const fileStat = await fsp.stat(path.join(config.pathToDiskSpace, filePath));

//       const newFileName = `photo--${format(fileStat.mtime, 'yyyy-MM-dd--HH-mm-ss')}.jpg`
//       const newFilePath = path.join(pathToDir, newFileName);

//       if (fileName !== newFileName) {
//         await fsp.rename(path.join(config.pathToDiskSpace, filePath), path.join(config.pathToDiskSpace, newFilePath))
//         console.log(fileName, '--->', newFileName)
//       }

//       return newFileName;
//     })
//   );

//   return filesInDir;
// }

const readFiles = async (pathToDir) => {
  const fullPath = path.join(config.pathToDiskSpace, pathToDir);
  const filesNames = await fsp.readdir(fullPath);

  const filesInDir = await Promise.all(
    filesNames.map(async (fileName) => {
      const filePath = path.join(pathToDir, fileName);
      const fileStat = await fsp.stat(
        path.join(config.pathToDiskSpace, filePath),
      );

      const newFileName = `photo--${format(
        fileStat.mtime,
        'yyyy-MM-dd--HH-mm-ss',
      )}.jpg`;
      const newFilePath = path.join(pathToDir, newFileName);

      if (fileName !== newFileName) {
        await fsp.rename(
          path.join(config.pathToDiskSpace, filePath),
          path.join(config.pathToDiskSpace, newFilePath),
        );
        console.log(fileName, '--->', newFileName);
      }

      const file = { name: newFileName, path: newFilePath, stat: fileStat };
      return file;
    }),
  );

  return filesInDir;
};

const createFileInDb = async (userId, cameraId, file, fileService) => {
  const fileInDb = await fileService.getOne({
    camera: cameraId,
    name: file.name,
  });

  const mainPayload = {
    name: file.name,
    date: file.stat.mtime,

    user: userId,
    camera: cameraId,

    dateString: makeDateString(file.stat.mtime),
    timeString: makeTimeString(file.stat.mtime),

    link: `/files/${file.path}`,
    size: file.size,
  };

  if (fileInDb) {
    const updatedFileInDb = await fileService.updateOneById({
      itemId: fileInDb._id,
      payload: mainPayload,
    });

    return updatedFileInDb;
  }

  const fullPayload = {
    ...mainPayload,

    type: type.PHOTO,
    fileType: fileType.IMAGE_JPG,
    createType: fileCreateType.BY_HAND,

    photoFileData: {
      photoUrl: null,
    },
  };

  const addedFileInDb = await fileService.createFileInDb({
    payload: fullPayload,
  });

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
      const filesResult = await Promise.all(
        filesInDir.map(
          async (file) =>
            await createFileInDb(userId, cameraId, file, fileService),
        ),
      );

      console.log('filesInDir', filesResult.length);
      // console.log('filesAddedInDb', filesResult.filter((i) => !!i).length);
    }
  } catch (error) {
    console.log('error', error);
  }

  db.disconnect();
};

const userId = '641a9f7e23911029305ee801';
const cameraId = '641aa43d482f2817d4b8f455';

start(userId, cameraId);
