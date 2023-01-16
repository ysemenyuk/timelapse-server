import _ from 'lodash';
import File from '../models/File.js';
import { makeCameraFolderName, makeUserFolderName, promisifyUploadStream } from '../utils/index.js';
import storageService from './storage.service.js';
import { folderName, folderType, type } from '../utils/constants.js';

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
  logger && logger(`fileService.getManyByQuery`);

  const queryObject = createQuery(cameraId, query);
  const files = await File.find(queryObject);
  return files;
};

const getCountByQuery = async ({ logger, cameraId, query }) => {
  logger && logger(`fileService.getCountByQuery`);

  const queryObject = createQuery(cameraId, query);
  const count = await File.countDocuments(queryObject);
  return count;
};

const getOneById = async ({ logger, itemId }) => {
  logger && logger(`fileService.getOneById`);

  const file = await File.findOne({ _id: itemId });
  return file;
};

const getOne = async ({ logger, ...query }) => {
  logger && logger(`fileService.getOne`);

  const file = await File.findOne({ ...query });
  return file;
};

//
// create
//

const createFolder = async ({ logger, ...payload }) => {
  logger && logger(`fileService.createFolder`);

  await storageService.createFolder({
    logger,
    folderPath: payload.pathOnDisk,
  });

  const folder = new File({ ...payload });
  await folder.save();
  return folder;
};

const createFile = async ({ logger, data, ...payload }) => {
  logger && logger(`fileService.createFile`);

  if (data) {
    await storageService.writeFile({
      logger,
      filePath: payload.pathOnDisk,
      data,
    });
  }

  const file = new File({ ...payload });
  await file.save();
  return file;
};

const createFileByStream = async ({ logger, stream, ...payload }) => {
  logger && logger(`fileService.createFileByStream`);

  const uploadStream = storageService.openUploadStream({
    logger,
    filePath: payload.pathOnDisk,
  });

  stream.pipe(uploadStream);
  await promisifyUploadStream(uploadStream);

  const file = new File({ ...payload });
  await file.save();
  return file;
};

//
// update
//

const updateOneById = async ({ itemId, payload, logger }) => {
  logger && logger(`fileService.updateOneById`);

  const updated = await File.findOneAndUpdate({ _id: itemId }, payload, { new: true });
  return updated;
};

//
// delete
//

const deleteFolder = async ({ logger, folder }) => {
  logger && logger(`fileService.deleteFolder`);

  // delete folder from disk
  try {
    await storageService.removeFolder({ logger, folderPath: folder.pathOnDisk });
  } catch (error) {
    console.log('- storageService error -', error);
  }

  // delete folder and files from db
  const deletedChildren = await File.deleteMany({ parent: folder._id });
  const deletedFolder = await File.findOneAndDelete({ _id: folder._id });

  console.log('deletedChildren', deletedChildren);
  console.log('deletedFolder', deletedFolder);

  return deletedFolder;
};

const deleteFile = async ({ logger, file }) => {
  logger && logger(`fileService.deleteFile`);

  // delete file from disk
  try {
    await storageService.removeFile({ logger, filePath: file.pathOnDisk });
  } catch (error) {
    console.log('- storageService error -', error);
  }

  // delete file from db
  const deleted = await File.findOneAndDelete({ _id: file._id });
  return deleted;
};

const deleteOneById = async ({ logger, itemId }) => {
  logger && logger(`fileService.deleteOneById`);

  const item = await File.findOne({ _id: itemId });

  if (item.type === 'folder') {
    const deleted = await deleteFolder({ logger, folder: item });
    return deleted;
  }

  const deleted = await deleteFile({ logger, file: item });
  return deleted;
};

const deleteManyByIds = async ({ logger, itemsIds }) => {
  logger && logger(`fileService.deleteManyByIds`);

  // console.log('itemsIds', itemsIds);

  // TODO: delete items from storage

  // delete items from db
  const deleted = await File.deleteMany({ _id: { $in: itemsIds } });
  return deleted;
};

//
// camera default
//

// create

const createUserFolder = async ({ logger, userId }) => {
  logger && logger(`fileService.createDefaultFolders`);

  const userFolderName = makeUserFolderName(userId);

  const userFolder = await createFolder({
    logger,
    pathOnDisk: [userFolderName],
    user: userId,
    camera: null,
    parent: null,
    name: userFolderName,
    type: type.FOLDER,
    folderType: folderType.DEFAULT,
    removable: false,
  });

  return userFolder;
};

const createDefaultCameraFolders = async ({ logger, userId, cameraId }) => {
  logger && logger(`fileService.createDefaultCameraFolders`);

  const userFolder = await File.findOne({ user: userId, camera: null, parent: null });

  console.log(111, userFolder);

  const cameraFolderName = makeCameraFolderName(cameraId);

  const cameraFolder = await createFolder({
    logger,
    user: userId,
    camera: cameraId,
    parent: userFolder._id,
    type: type.FOLDER,
    folderType: folderType.DEFAULT,
    removable: false,
    name: cameraFolderName,
    pathOnDisk: [...userFolder.pathOnDisk, cameraFolderName],
  });

  const photosFolder = await createFolder({
    logger,
    user: userId,
    camera: cameraId,
    parent: cameraFolder._id,
    type: type.FOLDER,
    folderType: folderType.DEFAULT,
    removable: false,
    name: folderName.PHOTOS,
    pathOnDisk: [...cameraFolder.pathOnDisk, folderName.PHOTOS],
  });

  const videosFolder = await createFolder({
    logger,
    user: userId,
    camera: cameraId,
    parent: cameraFolder._id,
    type: type.FOLDER,
    folderType: folderType.DEFAULT,
    removable: false,
    name: folderName.VIDEOS,
    pathOnDisk: [...cameraFolder.pathOnDisk, folderName.VIDEOS],
  });

  return { cameraFolder, photosFolder, videosFolder };
};

// delete

const deleteCameraFiles = async ({ logger, userId, cameraId }) => {
  logger && logger(`fileService.deleteCameraFiles`);

  const userFolder = await File.findOne({ user: userId, camera: null, parent: null });
  // search by name?
  const cameraFolder = await File.findOne({ camera: cameraId, parent: userFolder._id });

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
  const deleted = await File.deleteMany({ camera: cameraId });
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

  createUserFolder,
  createDefaultCameraFolders,
  deleteCameraFiles,
};
