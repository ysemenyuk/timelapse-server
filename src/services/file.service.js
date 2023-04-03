import _ from 'lodash';
import { addHours } from 'date-fns';
import { type } from '../utils/constants.js';

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
    dateRange = {
      $gte: getGteDateTime(date_gte),
      $lte: getLteDateTime(date_lte),
    };
  }

  let timeString;

  if (time_gte && time_lte) {
    timeString = { $gte: `${time_gte}:00`, $lte: `${time_lte}:00` };
  }

  return _.pickBy(
    { camera, type, createType, date: dateRange, timeString },
    _.identity,
  );
};

//
// FileService
//

export default class FileService {
  constructor(fileRepo, storageService) {
    this.fileRepo = fileRepo;
    this.storageService = storageService;
  }

  //
  // create
  //

  async createFile({ logger, data, stream, payload }) {
    logger && logger(`fileService.createFile`);

    const file = await this.fileRepo.create(payload);

    // save on storage
    const fileInfo = await this.storageService.saveFile({
      logger,
      file,
      data,
      stream,
    });

    const created = await this.fileRepo.updateOneById(file._id, fileInfo);
    // console.log('created', created);
    return created;
  }

  async createFileInDb({ logger, payload }) {
    logger && logger(`fileService.createFileInDb`);

    const file = await this.fileRepo.create(payload);
    return file;
  }

  //
  // get
  //

  async getFilesForVideo({ logger, cameraId, query }) {
    logger && logger(`fileService.getFilesForVideo`);

    const filter = makeFilter(cameraId, query);
    const files = await this.fileRepo.find(filter);

    return files;
  }

  async getMany({ logger, cameraId, query }) {
    logger && logger(`fileService.getMany`);

    const filter = makeFilter(cameraId, query);
    const total = await this.fileRepo.countDocuments(filter);

    const page = parseInt(query.page, 10);
    const limit = parseInt(query.limit, 10);

    const skip = (page - 1) * limit;
    const pages = Math.ceil(total / limit);

    const populate = 'poster'; // query.populate

    const options = _.pickBy({ limit, skip, populate }, _.identity);

    const items = await this.fileRepo.find(filter, null, options);
    return { page, pages, total, items };
  }

  async getCount({ logger, cameraId, query }) {
    logger && logger(`fileService.getCountByQuery`);

    const filter = makeFilter(cameraId, query);
    const count = await this.fileRepo.countDocuments(filter);
    // console.log(111, count);
    return { count };
  }

  async getCountsByDates({ logger, cameraId, query }) {
    logger && logger(`fileService.getCountByQuery`);

    const counts = await this.fileRepo.countsByDates(cameraId, query);
    return counts;
  }

  async getOne({ logger, ...query }) {
    logger && logger(`fileService.getOne`);
    // check query?
    const file = await this.fileRepo.findOne({ ...query });
    return file;
  }

  async getOneById({ logger, itemId }) {
    logger && logger(`fileService.getOneById`);

    const file = await this.fileRepo.findOne({ _id: itemId });
    return file;
  }

  //
  // update
  //

  async updateOneById({ logger, itemId, payload }) {
    logger && logger(`fileService.updateOneById`);
    // check payload?
    const updated = await this.fileRepo.updateOneById(itemId, payload);
    return updated;
  }

  //
  // delete
  //

  async deleteOne({ logger, item }) {
    logger && logger(`fileService.deleteOne`);

    // delete file from storage
    try {
      await this.storageService.removeFile({ logger, file: item });
    } catch (error) {
      console.log('error deletedFromStorage', error);
    }

    // delete file from db
    const deletedFromDb = await this.fileRepo.deleteOneById(item._id);
    return deletedFromDb;
  }

  async deleteOneById({ logger, itemId }) {
    logger && logger(`fileService.deleteOneById`);

    const item = await this.getOneById({ logger, itemId });
    // if video delete poster
    if (item.type === type.VIDEO && item.poster) {
      await this.deleteOne({ logger, item: item.poster });
    }

    const deleted = await this.deleteOne({ logger, item });
    return deleted;
  }

  //
  // default
  //

  async createUserFolder({ logger, userId }) {
    logger && logger(`fileService.createUserFolder`);

    await this.storageService.createUserFolder({ logger, userId });
  }

  async createCameraFolders({ logger, userId, cameraId }) {
    logger && logger(`fileService.createCameraFolders`);

    await this.storageService.createCameraFolder({ logger, userId, cameraId });
  }

  //

  async deleteCameraFiles({ logger, userId, cameraId }) {
    logger && logger(`fileService.deleteCameraFiles`);

    // delete files from storage
    try {
      await this.storageService.removeCameraFiles({ logger, userId, cameraId });
    } catch (error) {
      console.log('error fileService.deleteCameraFiles', error);
    }

    // delete files from DB
    const deletedFromDb = await this.fileRepo.deleteMany({
      user: userId,
      camera: cameraId,
    });
    return deletedFromDb;
  }

  //
}
