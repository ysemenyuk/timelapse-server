import _ from 'lodash';
import File from '../models/File.js';
import { type } from '../utils/constants.js';
import storageService from './storage.service.js';

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

  return _.pickBy({ camera: cameraId, type, createType: createdBy, date }, _.identity);
};

// get

const getManyByQuery = async ({ logger, cameraId, query }) => {
  logger && logger(`fileService.getManyByQuery`);

  const queryObject = createQuery(cameraId, query);
  const files = await File.find(queryObject).populate('poster');
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

  const file = await File.findOne({ _id: itemId }).populate('poster');
  return file;
};

const getOne = async ({ logger, ...query }) => {
  logger && logger(`fileService.getOne`);
  // check query?
  const file = await File.findOne({ ...query }).populate('poster');
  return file;
};

//
// create
//

const createFile = async ({ logger, data, stream, ...payload }) => {
  logger && logger(`fileService.createFile`);

  const file = new File({ ...payload });

  // save on storage
  const fileInfo = await storageService.saveFile({
    logger,
    file,
    data,
    stream,
  });

  await file.save();

  const created = await File.findOneAndUpdate({ _id: file._id }, fileInfo, { new: true });
  return created;
};

//
// update
//

const updateOneById = async ({ logger, itemId, payload }) => {
  logger && logger(`fileService.updateOneById`);
  // check payload?
  const updated = await File.findOneAndUpdate({ _id: itemId }, payload, { new: true });
  return updated;
};

//
// delete
//

const deleteOne = async ({ logger, item }) => {
  logger && logger(`fileService.deleteOne`);

  // delete file from storage
  try {
    await storageService.removeFile({ logger, file: item });
  } catch (error) {
    console.log('error deletedFromStorage', error);
  }

  // delete file from db
  const deletedFromDb = await File.findOneAndDelete({ _id: item._id });
  return deletedFromDb;
};

const deleteOneById = async ({ logger, itemId }) => {
  logger && logger(`fileService.deleteOneById`);

  const item = await getOneById({ logger, itemId });
  // if video delete poster
  if (item.type === type.VIDEO && item.poster) {
    await deleteOne({ logger, file: item.poster });
  }

  const deleted = await deleteOne({ logger, item });
  return deleted;
};

// const deleteManyByIds = async ({ logger, itemsIds }) => {
//   logger && logger(`fileService.deleteManyByIds`);
//   // delete camera files from storage
//   // delete items from db
//   const deletedFromDb = await File.deleteMany({ _id: { $in: itemsIds } });
//   return deletedFromDb;
// };

//
// default
//

// user

const createDefaultUserFiles = async ({ logger, userId }) => {
  logger && logger(`fileService.createDefaultUserFiles`);

  await storageService.createUserDir({
    logger,
    userId,
  });
};

const deleteUserFiles = async ({ logger, userId }) => {
  logger && logger(`fileService.deleteUserFiles`);

  // delete camera files from storage
  try {
    await storageService.removeUserDir({ logger, userId });
  } catch (error) {
    console.log('error fileService.deleteUserFiles', error);
  }

  // delete camera files from DB
  const deletedFromDb = await File.deleteMany({ user: userId });
  // console.log('deletedFromDb', deletedFromDb);
  return deletedFromDb;
};

// camera

const createDefaultCameraFiles = async ({ logger, userId, cameraId }) => {
  logger && logger(`fileService.createDefaultCameraFiles`);

  await storageService.createCameraDirs({
    logger,
    userId,
    cameraId,
  });
};

const deleteCameraFiles = async ({ logger, userId, cameraId }) => {
  logger && logger(`fileService.deleteCameraFiles`);

  // delete camera files from storage
  try {
    await storageService.removeCameraDir({ logger, userId, cameraId });
  } catch (error) {
    console.log('error fileService.deleteCameraFiles', error);
  }

  // delete camera files from DB
  const deletedFromDb = await File.deleteMany({ user: userId, camera: cameraId });
  // console.log('deletedFromDb', deletedFromDb.deletedCount);
  return deletedFromDb;
};

export default {
  getManyByQuery,
  getCountByQuery,
  getOneById,
  getOne,
  createFile,
  updateOneById,
  deleteOne,
  deleteOneById,
  // deleteManyByIds,
  createDefaultUserFiles,
  deleteUserFiles,
  createDefaultCameraFiles,
  deleteCameraFiles,
};
