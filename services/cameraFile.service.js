import _ from 'lodash';
import CameraFile from '../models/CameraFile.js';
import { promisifyUploadStream } from '../utils/index.js';
import storageService from './storage.service.js';
import * as constants from '../utils/constants.js';

const getQueryForFiles = (cameraId, query) => {
  const { parentId, type, startDateTime, endDateTime } = query;
  const date = startDateTime && endDateTime && { $gte: new Date(startDateTime), $lt: new Date(endDateTime) };
  return _.pickBy({ camera: cameraId, parent: parentId, type, date }, _.identity);
};

const getManyByQuery = async ({ logger, cameraId, query }) => {
  logger && logger(`cameraFileService.getManyByQuery`);

  const queryObject = getQueryForFiles(cameraId, query);
  const files = await CameraFile.find(queryObject);
  return files;
};

const getCountByQuery = async ({ logger, cameraId, query }) => {
  logger && logger(`cameraFileService.getCountByQuery`);

  const queryObject = getQueryForFiles(cameraId, query);
  const count = await CameraFile.countDocuments(queryObject);
  return count;
};

const getOneById = async ({ logger, fileId }) => {
  logger && logger(`cameraFileService.getOneById fileId: ${fileId}`);

  const file = await CameraFile.findOne({ _id: fileId });
  return file;
};

const getOne = async ({ logger, ...query }) => {
  logger && logger(`cameraFileService.getOne`);

  const file = await CameraFile.findOne({ ...query });
  return file;
};

//

const createFolder = async ({ logger, ...payload }) => {
  logger && logger(`cameraFileService.createFolder`);

  await storageService.createFolder({
    logger,
    folderPath: payload.pathOnDisk,
    folderName: payload.nameOnDisk,
  });

  const folder = new CameraFile({ ...payload });
  await folder.save();

  return folder;
};

const createFile = async ({ logger, data, ...payload }) => {
  logger && logger(`cameraFileService.createFile`);

  await storageService.writeFile({
    logger,
    filePath: payload.pathOnDisk,
    fileName: payload.nameOnDisk,
    data,
  });

  const file = new CameraFile({ ...payload });
  await file.save();

  return file;
};

const createFileByStream = async ({ logger, stream, ...payload }) => {
  logger && logger(`cameraFileService.createFile`);

  const uploadStream = storageService.openUploadStream({
    logger,
    filePath: payload.path,
    fileName: payload.name,
  });

  stream.pipe(uploadStream);
  await promisifyUploadStream(uploadStream);

  const file = new CameraFile({ ...payload });
  await file.save();

  return file;
};

const deleteFolder = async ({ logger, folder }) => {
  logger && logger(`cameraFileService.deleteFolder`);

  // delete file or folder  from disk
  try {
    await storageService.removeFolder({ logger, folderPath: folder.path, folderName: folder.name });
  } catch (error) {
    console.log('storageService error message -', error.message);
  }

  // delete folder and files from db
  const deletedChildren = await CameraFile.deleteMany({ parent: folder._id });
  const deletedFolder = await CameraFile.findOneAndDelete({ _id: folder._id });

  console.log(2222, deletedChildren);
  console.log(3333, deletedFolder);

  return deletedFolder;
};

const deleteFile = async ({ logger, file }) => {
  logger && logger(`cameraFileService.deleteFile`);

  // delete file from disk
  try {
    await storageService.removeFile({ logger, filePath: file.path, fileName: file.name });
  } catch (error) {
    console.log('storageService error message -', error.message);
  }

  // delete file from db
  const deleted = await CameraFile.findOneAndDelete({ _id: file._id });
  return deleted;
};

const deleteManyByIds = async ({ logger, filesIds }) => {
  logger && logger(`cameraFileService.deleteManyByIds`);

  // console.log('ids', ids);

  const deleted = await CameraFile.deleteMany({ _id: { $in: filesIds } });
  return deleted;
};

// camera default

const createDefaultFolders = async ({ logger, userId, cameraId }) => {
  logger && logger(`cameraFileService.createDefaultFolders`);

  const mainFolder = await createFolder({
    logger,
    user: userId,
    camera: cameraId,
    parent: null,
    pathOnDisk: [],
    nameOnDisk: cameraId.toString(),
    name: constants.MAIN,
    type: 'folder',
    removable: false,
  });

  const defaultFolderPayload = {
    logger,
    user: userId,
    camera: cameraId,
    parent: mainFolder._id,
    pathOnDisk: [...mainFolder.pathOnDisk, mainFolder.nameOnDisk],
    type: 'folder',
    removable: false,
  };

  const screenshotsFolder = await createFolder({
    ...defaultFolderPayload,
    nameOnDisk: 'Photos',
    name: 'Photos',
  });

  const screenshotsByTimeFolder = await createFolder({
    ...defaultFolderPayload,
    nameOnDisk: 'PhotosByTime',
    name: 'PhotosByTime',
  });

  const videosFolder = await createFolder({
    ...defaultFolderPayload,
    nameOnDisk: 'Videos',
    name: 'Videos',
  });

  const videosByTimeFolder = await createFolder({
    ...defaultFolderPayload,
    nameOnDisk: 'VideosByTime',
    name: 'VideosByTime',
  });

  return { mainFolder, screenshotsFolder, screenshotsByTimeFolder, videosFolder, videosByTimeFolder };
};

const deleteCameraFiles = async ({ logger, cameraId }) => {
  logger && logger(`cameraFileService.deleteCameraFiles`);

  try {
    await storageService.removeFolder({
      logger,
      folderPath: [],
      folderName: cameraId.toString(),
    });
  } catch (error) {
    console.log('storageService error message -', error.message);
  }

  const deleted = await CameraFile.deleteMany({ camera: cameraId });
  return deleted;
};

export default {
  getManyByQuery,
  getCountByQuery,
  getOneById,
  getOne,

  createFolder,
  createFile,
  createFileByStream,

  deleteFolder,
  deleteFile,
  deleteManyByIds,

  createDefaultFolders,
  deleteCameraFiles,
};
