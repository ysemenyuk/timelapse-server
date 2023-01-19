import { dirName, type } from '../utils/constants.js';
import {
  makeDateName,
  makeUserDirName,
  makeCameraDirName,
  makeVideoFileName,
  makePhotoFileName,
  makePosterFileName,
} from '../utils/utils.js';

//
// dirs paths
//

const createUserDirPath = (userId) => {
  const userDirName = makeUserDirName(userId);
  return userDirName;
};

const createCameraDirPath = (userId, cameraId) => {
  const userDirName = makeUserDirName(userId);
  const cameraDirName = makeCameraDirName(cameraId);
  return [userDirName, cameraDirName].join('/');
};

const createPhotosDirPath = (userId, cameraId) => {
  const userDirName = makeUserDirName(userId);
  const cameraDirName = makeCameraDirName(cameraId);
  return [userDirName, cameraDirName, dirName.PHOTOS].join('/');
};

const createVideosDirPath = (userId, cameraId) => {
  const userDirName = makeUserDirName(userId);
  const cameraDirName = makeCameraDirName(cameraId);
  return [userDirName, cameraDirName, dirName.VIDEOS].join('/');
};

const createDateDirPath = (userId, cameraId, date) => {
  const photosDirPath = createPhotosDirPath(userId, cameraId);
  const dateDirName = makeDateName(date);
  return [photosDirPath, dateDirName].join('/');
};

//
// files paths
//

const createVideoFilePath = ({ logger, file }) => {
  logger && logger(`path.createVideoFilePath file.name: ${file.name}`);
  const videosDirPath = createVideosDirPath(file.user, file.camera);
  const fileName = makeVideoFileName(file.date);
  return [videosDirPath, fileName].join('/');
};

const cretePhotoFilePath = ({ logger, file }) => {
  logger && logger(`path.cretePhotoFilePath file.name: ${file.name}`);
  const dateDirPath = createDateDirPath(file.user, file.camera, file.date);
  const fileName = makePhotoFileName(file.date);
  return [dateDirPath, fileName].join('/');
};

const createPosterFilePath = ({ logger, file }) => {
  logger && logger(`path.createPosterFilePath file.name: ${file.name}`);
  const cameraDirPath = createCameraDirPath(file.user, file.camera);
  const fileName = makePosterFileName(file.date);
  return [cameraDirPath, fileName].join('/');
};

//

const createFilePath = ({ logger, file }) => {
  logger && logger(`path.createFilePath file.name: ${file.name}`);

  if (file.type === type.VIDEO) {
    return createVideoFilePath({ logger, file });
  }

  if (file.type === type.PHOTO) {
    return cretePhotoFilePath({ logger, file });
  }

  if (file.type === type.POSTER) {
    return createPosterFilePath({ logger, file });
  }

  // return err file.type not found
};

export default {
  createFilePath,
  createUserDirPath,
  createCameraDirPath,
  createPhotosDirPath,
  createVideosDirPath,
  createDateDirPath,
};
