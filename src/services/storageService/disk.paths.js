import { dirName, type } from '../../utils/constants.js';
import {
  makeDateString,
  makeUserDirName,
  makeCameraDirName,
  makeVideoFileName,
  makePhotoFileName,
  makePosterFileName,
} from '../../utils/index.js';

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
  const dateDirName = makeDateString(date);
  return [photosDirPath, dateDirName].join('/');
};

//
// files paths
//

const createVideoFilePath = (file) => {
  const videosDirPath = createVideosDirPath(file.user, file.camera);
  const fileName = makeVideoFileName(file.date);
  return [videosDirPath, fileName].join('/');
};

const cretePhotoFilePath = (file) => {
  const dateDirPath = createDateDirPath(file.user, file.camera, file.date);
  const fileName = makePhotoFileName(file.date);
  return [dateDirPath, fileName].join('/');
};

const createPosterFilePath = (file) => {
  const cameraDirPath = createCameraDirPath(file.user, file.camera);
  const fileName = makePosterFileName(file.date);
  return [cameraDirPath, fileName].join('/');
};

//

const map = {
  [type.VIDEO]: createVideoFilePath,
  [type.PHOTO]: cretePhotoFilePath,
  [type.POSTER]: createPosterFilePath,
};

const createFilePath = (file) => {
  const filePath = map[file.type](file);
  return filePath;
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
