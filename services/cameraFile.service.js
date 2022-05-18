import CameraFile from '../models/CameraFile.js';
import { promisifyUploadStream } from '../utils/index.js';
import storageService from './storage.service.js';

const getAll = async ({ logger, cameraId, parentId }) => {
  logger && logger(`cameraFileService.getAll`);

  return await CameraFile.find({
    camera: cameraId,
    parent: parentId,
    // date: { $gte: new Date('2021-01-31T15:00:30'), $lt: new Date('2022-01-31T15:00:35') },
  });
};

const getOne = async ({ logger, ...payload }) => {
  logger && logger(`cameraFileService.getOne}`);

  return await CameraFile.findOne(payload);
};

const getOneById = async ({ logger, fileId }) => {
  logger && logger(`cameraFileService.getOneById fileId: ${fileId}`);

  return await CameraFile.findOne({ _id: fileId });
};

const getOneByName = async ({ logger, fileName }) => {
  logger && logger(`cameraFileService.getOneByName cameraFileName: ${fileName}`);

  return await CameraFile.findOne({ name: fileName });
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

// const updateOneById = async ({ logger, fileId, payload }) => {
//   logger && logger(`cameraFileService.updateOne fileId: ${fileId}, payload: ${payload}`);

//   const updated = await CameraFile.updateOne({ _id: fileId }, payload);
//   return updated;
// };

const deleteOneById = async ({ logger, fileId }) => {
  logger && logger(`cameraFileService.deleteOne fileId: ${fileId}`);

  // TODO: delete files from disk

  const file = await CameraFile.findOne({ _id: fileId });
  console.log(1111, file);

  throw new Error('1111111111');

  // const deleted = await CameraFile.findOneAndDelete({ _id: fileId });
  // return deleted;
};

const deleteCameraFiles = async ({ logger, cameraId }) => {
  logger && logger(`cameraFileService.deleteCameraFiles`);

  // TODO: delete files from disk
  await storageService.removeFolder({
    logger,
    folderPath: [],
    folderName: cameraId.toString(),
  });

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
  getOne,
  getOneById,
  getOneByName,
  // createOne,
  createFolder,
  createFile,
  createFileByStream,
  // updateOneById,
  deleteOneById,
  deleteCameraFiles,
  deleteManyByIds,
};
