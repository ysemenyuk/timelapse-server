import format from 'date-fns/format/index.js';
import { makeDateName } from '../utils/utils.js';

//
// names
//

const makeUserDirName = (userId) => {
  return `user_${userId.toString()}`;
};

const makeCameraDirName = (cameraId) => {
  return `camera_${cameraId.toString()}`;
};

const makePhotoName = (date) => {
  return `photo--${format(date, 'yyyy-MM-dd--HH-mm-ss')}.jpg`;
};

const makeVideoName = (date) => {
  return `video--${format(date, 'yyyy-MM-dd--HH-mm-ss')}.mp4`;
};

const makePosterName = (date) => {
  return `poster--${format(date, 'yyyy-MM-dd--HH-mm-ss')}.jpg`;
};

//
// dirs paths
//

export const createUserDirPath = (userId) => {
  const userDirName = makeUserDirName(userId);
  return [userDirName];
};

export const createCameraDirPath = (userId, cameraId) => {
  const userDirName = makeUserDirName(userId);
  const cameraDirName = makeCameraDirName(cameraId);
  return [userDirName, cameraDirName];
};

export const createPhotosDirPath = (userId, cameraId) => {
  const userDirName = makeUserDirName(userId);
  const cameraDirName = makeCameraDirName(cameraId);
  return [userDirName, cameraDirName, 'Photos'];
};

export const createVideosDirPath = (userId, cameraId) => {
  const userDirName = makeUserDirName(userId);
  const cameraDirName = makeCameraDirName(cameraId);
  return [userDirName, cameraDirName, 'Videos'];
};

//
// files paths
//

const createVideoFilePath = ({ logger, file }) => {
  logger && logger(`storage.service.createVideoFilePath file.name: ${file.name}`);
  const dirPath = createVideosDirPath(file.user, file.camera);
  const fileName = makeVideoName(file.date);
  return [...dirPath, fileName];
};

const cretePhotoFilePath = ({ logger, file }) => {
  logger && logger(`storage.service.cretePhotoFilePath file.name: ${file.name}`);
  const dirPath = createPhotosDirPath(file.user, file.camera);
  const dateDirName = makeDateName(file.date);
  const fileName = makePhotoName(file.date);
  return [...dirPath, dateDirName, fileName];
};

export const createPosterFilePath = ({ logger, file }) => {
  logger && logger(`storage.service.createPosterFilePath file.name: ${file.name}`);
  const dirPath = createVideosDirPath(file.user, file.camera);
  const fileName = makePosterName(file.date);
  return [...dirPath, fileName];
};

export const createFilePath = ({ logger, file }) => {
  logger && logger(`storage.service.createFilePath file.name: ${file.name}`);

  if (file.type === 'video') {
    return createVideoFilePath({ logger, file });
  }

  if (file.type === 'photo') {
    return cretePhotoFilePath({ logger, file });
  }

  if (file.type === 'poster') {
    return createPosterFilePath({ logger, file });
  }

  // return err file.type not found
};
