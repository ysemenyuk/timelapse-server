import _ from 'lodash';
import { addHours } from 'date-fns';
import File from '../models/File.js';
import { type } from '../utils/constants.js';
import storageService from '../storage/index.js';

const getGteDateTime = (date) => new Date(`${date} 00:00:00`);
const getLteDateTime = (date) => addHours(new Date(`${date} 00:00:00`), 24);

const makeFilter = (camera, query) => {
  const { type, date, date_gte, date_lte, time_gte, time_lte } = query;
  // console.log(1111, 'query', query);

  const createType = query.createType && query.createType.split(',');

  let dateRange;

  if (date) {
    dateRange = { $gte: getGteDateTime(date), $lte: getLteDateTime(date) };
  }

  if (date_gte && date_lte) {
    dateRange = { $gte: getGteDateTime(date_gte), $lte: getLteDateTime(date_lte) };
  }

  let timeString;

  if (time_gte && time_lte) {
    timeString = { $gte: `${time_gte}:00`, $lte: `${time_lte}:00` };
  }

  return _.pickBy({ camera, type, createType, date: dateRange, timeString }, _.identity);
};

// get

const getFilesForVideo = async ({ logger, cameraId, query }) => {
  logger && logger(`fileService.getFilesForVideo`);

  const filter = makeFilter(cameraId, query);
  const files = await File.find(filter).sort({ _id: 1 });

  return files;
};

const getManyByQuery = async ({ logger, cameraId, query }) => {
  logger && logger(`fileService.getManyByQuery`);

  const filter = makeFilter(cameraId, query);
  const total = await File.countDocuments(filter);

  const page = parseInt(query.page, 10);
  const limit = parseInt(query.limit, 10);

  const skip = (page - 1) * limit;
  const pages = Math.ceil(total / limit);

  const populate = 'poster'; //query.populate

  const options = _.pickBy({ limit, skip, populate }, _.identity);

  const items = await File.find(filter, null, options);
  return { page, pages, total, items };
};

const getCountByQuery = async ({ logger, cameraId, query }) => {
  logger && logger(`fileService.getCountByQuery`);

  const filter = makeFilter(cameraId, query);
  const count = await File.countDocuments(filter);
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
  // console.log(5555, created);
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
    await deleteOne({ logger, item: item.poster });
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

const createUserDefaultFiles = async ({ logger, userId }) => {
  logger && logger(`fileService.createUserDefaultFiles`);

  await storageService.createUserPath({ logger, userId });
};

const deleteUserFiles = async ({ logger, userId }) => {
  logger && logger(`fileService.deleteUserFiles`);

  // delete files from storage
  try {
    await storageService.removeUserFiles({ logger, userId });
  } catch (error) {
    console.log('error fileService.deleteUserFiles', error);
  }

  // delete files from DB
  const deletedFromDb = await File.deleteMany({ user: userId });
  return deletedFromDb;
};

// camera

const createCameraDefaultFiles = async ({ logger, userId, cameraId }) => {
  logger && logger(`fileService.createCameraDefaultFiles`);

  await storageService.createCameraPath({ logger, userId, cameraId });
};

const deleteCameraFiles = async ({ logger, userId, cameraId }) => {
  logger && logger(`fileService.deleteCameraFiles`);

  // delete files from storage
  try {
    await storageService.removeCameraFiles({ logger, userId, cameraId });
  } catch (error) {
    console.log('error fileService.deleteCameraFiles', error);
  }

  // delete files from DB
  const deletedFromDb = await File.deleteMany({ user: userId, camera: cameraId });
  return deletedFromDb;
};

export default {
  getFilesForVideo,
  getManyByQuery,
  getCountByQuery,
  getOneById,
  getOne,
  createFile,
  updateOneById,
  deleteOne,
  deleteOneById,
  // deleteManyByIds,
  createUserDefaultFiles,
  deleteUserFiles,
  createCameraDefaultFiles,
  deleteCameraFiles,
};
