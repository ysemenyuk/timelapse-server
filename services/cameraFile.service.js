import CameraFile from '../models/CameraFile.js';
import { promisifyUploadStream } from '../utils/index.js';
import storageService from './storage.service.js';

const getAll = async ({ logger, cameraId, query }) => {
  logger && logger(`cameraFileService.getAll`);

  console.log(1111, query);

  return await CameraFile.find({
    camera: cameraId,
  });
};

const getManyByParentId = async ({ logger, cameraId, parentId }) => {
  logger && logger(`cameraFileService.getManyByParentId`);

  return await CameraFile.find({
    camera: cameraId,
    parent: parentId,
  });
};

const getManyByQuery = async ({ logger, cameraId, query }) => {
  logger && logger(`cameraFileService.getManyForVideo`);

  const { type, startTime, stopTime } = query;
  const date = { $gte: new Date(startTime), $lt: new Date(stopTime) };

  const files = await CameraFile.find({
    camera: cameraId,
    type,
    date,
  });

  return files;
};

const getCountByQuery = async ({ logger, cameraId, query }) => {
  logger && logger(`cameraFileService.getManyForVideo`);

  const { type, startTime, stopTime } = query;
  const date = { $gte: new Date(startTime), $lt: new Date(stopTime) };

  const count = await CameraFile.countDocuments({
    camera: cameraId,
    type,
    date,
  });

  return count;
};

const getOne = async ({ logger, ...query }) => {
  logger && logger(`cameraFileService.getOne}`);

  return await CameraFile.findOne({ ...query });
};

const getOneById = async ({ logger, fileId }) => {
  logger && logger(`cameraFileService.getOneById fileId: ${fileId}`);

  return await CameraFile.findOne({ _id: fileId });
};

const createFolder = async ({ logger, ...payload }) => {
  logger && logger(`cameraFileService.createFolder`);

  await storageService.createFolder({
    logger,
    folderPath: payload.path,
    folderName: payload.name,
  });

  const folder = new CameraFile({ ...payload });
  await folder.save();

  return folder;
};

const createFile = async ({ logger, data, ...payload }) => {
  logger && logger(`cameraFileService.createFile`);

  await storageService.writeFile({
    logger,
    filePath: payload.path,
    fileName: payload.name,
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
  const deletedFiles = await CameraFile.deleteMany({ parent: folder._id });
  const deletedFolder = await CameraFile.findOneAndDelete({ _id: folder._id });

  console.log(2222, deletedFiles);
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

const deleteManyByIds = async ({ logger, filesIds }) => {
  logger && logger(`cameraFileService.deleteManyByIds`);

  // console.log('ids', ids);

  const deleted = await CameraFile.deleteMany({ _id: { $in: filesIds } });
  return deleted;
};

export default {
  getAll,
  getManyByParentId,
  getManyByQuery,
  getCountByQuery,
  getOne,
  getOneById,
  createFolder,
  createFile,
  createFileByStream,
  deleteFolder,
  deleteFile,
  deleteCameraFiles,
  deleteManyByIds,
};
