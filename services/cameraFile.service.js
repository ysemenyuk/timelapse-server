import _ from 'lodash';
import CameraFile from '../models/CameraFile.js';
// import { promisifyUploadStream } from '../utils/index.js';
import storageService from './storage.service.js';
import { fileType, folderName } from '../utils/constants.js';

const createQuery = (cameraId, query) => {
  const { type, createType, startDate, endDate, oneDate } = query;
  console.log(1111, 'query', query);

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

  console.log(1111, 'date', date);

  return _.pickBy({ camera: cameraId, type, createdType: createdBy, date }, _.identity);
};

const getManyByQuery = async ({ logger, cameraId, query }) => {
  logger && logger(`cameraFileService.getManyByQuery`);
  // console.log(1111, query);
  const queryObject = createQuery(cameraId, query);
  // console.log(2222, queryObject);

  const files = await CameraFile.find(queryObject);

  return files;
};

const getCountByQuery = async ({ logger, cameraId, query }) => {
  logger && logger(`cameraFileService.getCountByQuery`);

  const queryObject = createQuery(cameraId, query);
  // console.log(3333, queryObject);

  const count = await CameraFile.countDocuments(queryObject);
  // const count2 = await CameraFile.aggregate([
  //   { $match: queryObject },
  //   { $group: { _id: '$type', count: { $sum: 1 } } },
  // ]);

  console.log(4444, 'count', count);
  return count;
};

const getOneById = async ({ logger, fileId }) => {
  logger && logger(`cameraFileService.getOneById`);

  const file = await CameraFile.findOne({ _id: fileId });
  return file;
};

const getOne = async ({ logger, ...query }) => {
  logger && logger(`cameraFileService.getOne`);

  const file = await CameraFile.findOne({ ...query });
  return file;
};

// create

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

  if (data) {
    await storageService.writeFile({
      logger,
      filePath: payload.pathOnDisk,
      fileName: payload.nameOnDisk,
      data,
    });
  }

  const file = new CameraFile({ ...payload });
  await file.save();
  return file;
};

// const createFileByStream = async ({ logger, stream, ...payload }) => {
//   logger && logger(`cameraFileService.createFileByStream`);

//   const uploadStream = storageService.openUploadStream({
//     logger,
//     filePath: payload.path,
//     fileName: payload.name,
//   });

//   stream.pipe(uploadStream);
//   await promisifyUploadStream(uploadStream);

//   const file = new CameraFile({ ...payload });
//   await file.save();

//   return file;
// };

// update

const updateOneById = async ({ fileId, payload, logger }) => {
  logger && logger(`cameraFileService.updateOneById`);

  const updated = await CameraFile.findOneAndUpdate({ _id: fileId }, payload, { new: true });
  return updated;
};

// delete

const deleteFolder = async ({ logger, folder }) => {
  logger && logger(`cameraFileService.deleteFolder`);

  // delete file or folder  from disk
  try {
    await storageService.removeFolder({ logger, folderPath: folder.path, folderName: folder.name });
  } catch (error) {
    console.log('- storageService error -', error);
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
    console.log('- storageService error -', error);
  }

  // delete file from db
  const deleted = await CameraFile.findOneAndDelete({ _id: file._id });
  return deleted;
};

const deleteOneById = async ({ logger, fileId }) => {
  logger && logger(`cameraFileService.deleteOneById`);

  const item = await CameraFile.findOne({ _id: fileId });
  let deleted;

  if (item.type === 'folder') {
    deleted = await deleteFolder({ logger, folder: item });
  } else {
    deleted = await deleteFile({ logger, file: item });
  }

  return deleted;
};

const deleteManyByIds = async ({ logger, filesIds }) => {
  logger && logger(`cameraFileService.deleteManyByIds`);

  // console.log('ids', ids);

  // delete files from db
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
    name: folderName.MAIN,
    type: fileType.FOLDER,
    removable: false,
  });

  const defaultFolderPayload = {
    logger,
    user: userId,
    camera: cameraId,
    parent: mainFolder._id,
    pathOnDisk: [...mainFolder.pathOnDisk, mainFolder.nameOnDisk],
    type: fileType.FOLDER,
    removable: false,
  };

  const photosFolder = await createFolder({
    ...defaultFolderPayload,
    nameOnDisk: folderName.PHOTOS,
    name: folderName.PHOTOS,
  });

  const photosByTimeFolder = await createFolder({
    ...defaultFolderPayload,
    nameOnDisk: folderName.PHOTOS_BY_TIME,
    name: folderName.PHOTOS_BY_TIME,
  });

  const videosFolder = await createFolder({
    ...defaultFolderPayload,
    nameOnDisk: folderName.VIDEOS,
    name: folderName.VIDEOS,
  });

  const videosByTimeFolder = await createFolder({
    ...defaultFolderPayload,
    nameOnDisk: folderName.VIDEOS_BY_TIME,
    name: folderName.VIDEOS_BY_TIME,
  });

  return { mainFolder, photosFolder, photosByTimeFolder, videosFolder, videosByTimeFolder };
};

const deleteCameraFiles = async ({ logger, cameraId }) => {
  logger && logger(`cameraFileService.deleteCameraFiles`);

  const mainCameraFolder = await CameraFile.findOne({ camera: cameraId, parent: null });

  // delete main folder from disk
  try {
    await storageService.removeFolder({
      logger,
      folderPath: [],
      folderName: mainCameraFolder.nameOnDisk,
    });
  } catch (error) {
    console.log('- storageService error -', error);
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
  // createFileByStream,

  updateOneById,

  deleteFolder,
  deleteFile,
  deleteOneById,
  deleteManyByIds,

  createDefaultFolders,
  deleteCameraFiles,
};
