import _ from 'lodash';
import CameraFile from '../models/CameraFile.js';
import { makeCameraFolderName, promisifyUploadStream } from '../utils/index.js';
import storageService from './storage.service.js';
import { fileType, folderName } from '../utils/constants.js';

const createQuery = (cameraId, query) => {
  const { type, createType, startDate, endDate, oneDate } = query;
  // console.log(1111, 'query', query);

  const createdBy = createType && createType.split(',');

  let date;

  if (oneDate) {
    const start = new Date(oneDate);
    const end = new Date(oneDate);
    end.setDate(end.getDate() + 1);
    date = { $gte: start, $lt: end };
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    date = { $gte: start, $lt: end };
  }

  if (startDate && !endDate) {
    const start = new Date(startDate);
    date = { $gte: start };
  }

  if (!startDate && endDate) {
    const end = new Date(endDate);
    date = { $lt: end };
  }

  return _.pickBy({ camera: cameraId, type, createdType: createdBy, date }, _.identity);
};

const getManyByQuery = async ({ logger, cameraId, query }) => {
  logger && logger(`cameraFileService.getManyByQuery`);

  const queryObject = createQuery(cameraId, query);
  const files = await CameraFile.find(queryObject);
  return files;
};

const getCountByQuery = async ({ logger, cameraId, query }) => {
  logger && logger(`cameraFileService.getCountByQuery`);

  const queryObject = createQuery(cameraId, query);
  const count = await CameraFile.countDocuments(queryObject);
  return count;
};

const getOneById = async ({ logger, itemId }) => {
  logger && logger(`cameraFileService.getOneById`);

  const file = await CameraFile.findOne({ _id: itemId });
  return file;
};

const getOne = async ({ logger, ...query }) => {
  logger && logger(`cameraFileService.getOne`);

  const file = await CameraFile.findOne({ ...query });
  return file;
};

//
// create
//

const createFolder = async ({ logger, ...payload }) => {
  logger && logger(`cameraFileService.createFolder`);

  await storageService.createFolder({
    logger,
    folderPath: payload.pathOnDisk,
  });

  const folder = new CameraFile({ ...payload });
  await folder.save();

  return folder;
};

const createFile = async ({ logger, data, ...payload }) => {
  logger && logger(`cameraFileService.createFile`);

  if (data) {
    await storageService.writeFile({
      logger,
      filePath: payload.pathOnDisk,
      data,
    });
  }

  const file = new CameraFile({ ...payload });
  await file.save();
  return file;
};

const createFileByStream = async ({ logger, stream, ...payload }) => {
  logger && logger(`cameraFileService.createFileByStream`);

  const uploadStream = storageService.openUploadStream({
    logger,
    filePath: payload.pathOnDisk,
  });

  stream.pipe(uploadStream);
  await promisifyUploadStream(uploadStream);

  const file = new CameraFile({ ...payload });
  await file.save();
  return file;
};

//
// update
//

const updateOneById = async ({ fileId, payload, logger }) => {
  logger && logger(`cameraFileService.updateOneById`);

  const updated = await CameraFile.findOneAndUpdate({ _id: fileId }, payload, { new: true });
  return updated;
};

//
// delete
//

const deleteFolder = async ({ logger, folder }) => {
  logger && logger(`cameraFileService.deleteFolder`);

  // delete folder  from disk
  try {
    await storageService.removeFolder({ logger, folderPath: folder.pathOnDisk });
  } catch (error) {
    console.log('- storageService error -', error);
  }

  // delete folder and files from db
  const deletedChildren = await CameraFile.deleteMany({ parent: folder._id });
  const deletedFolder = await CameraFile.findOneAndDelete({ _id: folder._id });

  console.log('deletedChildren', deletedChildren);
  console.log('deletedFolder', deletedFolder);

  return deletedFolder;
};

const deleteFile = async ({ logger, file }) => {
  logger && logger(`cameraFileService.deleteFile`);

  // delete file from disk
  try {
    await storageService.removeFile({ logger, filePath: file.pathOnDisk });
  } catch (error) {
    console.log('- storageService error -', error);
  }

  // delete file from db
  const deleted = await CameraFile.findOneAndDelete({ _id: file._id });
  return deleted;
};

const deleteOneById = async ({ logger, itemId }) => {
  logger && logger(`cameraFileService.deleteOneById`);

  const item = await CameraFile.findOne({ _id: itemId });

  if (item.type === 'folder') {
    const deleted = await deleteFolder({ logger, folder: item });
    return deleted;
  }

  const deleted = await deleteFile({ logger, file: item });
  return deleted;
};

const deleteManyByIds = async ({ logger, itemsIds }) => {
  logger && logger(`cameraFileService.deleteManyByIds`);

  // console.log('itemsIds', itemsIds);

  // TODO: delete items from storage

  // delete items from db
  const deleted = await CameraFile.deleteMany({ _id: { $in: itemsIds } });
  return deleted;
};

//
// camera default
//

const createDefaultFolders = async ({ logger, userId, cameraId }) => {
  logger && logger(`cameraFileService.createDefaultFolders`);

  const userFolder = await CameraFile.findOne({ user: userId, camera: null, parent: null });

  const cameraFolderName = makeCameraFolderName(cameraId);
  const cameraFolder = await createFolder({
    logger,
    user: userId,
    camera: cameraId,
    parent: userFolder._id,
    pathOnDisk: [...userFolder.pathOnDisk, cameraFolderName],
    name: cameraFolderName,
    type: fileType.FOLDER,
    removable: false,
  });

  const defaultPayload = {
    logger,
    user: userId,
    camera: cameraId,
    parent: cameraFolder._id,
    type: fileType.FOLDER,
    removable: false,
  };

  const photosByHandFolder = await createFolder({
    ...defaultPayload,
    pathOnDisk: [...cameraFolder.pathOnDisk, folderName.PHOTOS_BY_HAND],
    name: folderName.PHOTOS_BY_HAND,
  });

  const photosByTimeFolder = await createFolder({
    ...defaultPayload,
    pathOnDisk: [...cameraFolder.pathOnDisk, folderName.PHOTOS_BY_TIME],
    name: folderName.PHOTOS_BY_TIME,
  });

  const videosByHandFolder = await createFolder({
    ...defaultPayload,
    pathOnDisk: [...cameraFolder.pathOnDisk, folderName.VIDEOS_BY_HAND],
    name: folderName.VIDEOS_BY_HAND,
  });

  const videosByTimeFolder = await createFolder({
    ...defaultPayload,
    pathOnDisk: [...cameraFolder.pathOnDisk, folderName.VIDEOS_BY_TIME],
    name: folderName.VIDEOS_BY_TIME,
  });

  return { cameraFolder, photosByHandFolder, photosByTimeFolder, videosByHandFolder, videosByTimeFolder };
};

//

const deleteCameraFiles = async ({ logger, userId, cameraId }) => {
  logger && logger(`cameraFileService.deleteCameraFiles`);

  const userFolder = await CameraFile.findOne({ user: userId, camera: null, parent: null });
  const cameraFolder = await CameraFile.findOne({ camera: cameraId, parent: userFolder._id });

  // delete camera folder from disk
  try {
    await storageService.removeFolder({
      logger,
      folderPath: cameraFolder.pathOnDisk,
    });
  } catch (error) {
    console.log('- storageService error -', error);
  }

  // delete camera files from DB
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

  updateOneById,

  deleteFolder,
  deleteFile,
  deleteOneById,
  deleteManyByIds,

  createDefaultFolders,
  deleteCameraFiles,
};
