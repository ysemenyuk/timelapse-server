import { dateInfoRepo } from '../db/index.js';

export default class DateInfoService {
  constructor() {
    this.dateInfoRepo = dateInfoRepo;
  }

  // create

  async createOne({ logger, userId, cameraId, ...payload }) {
    logger && logger(`dateInfoService.createOne`);

    const dateInfo = await dateInfoRepo.create({
      user: userId,
      camera: cameraId,
      ...payload,
    });

    return dateInfo;
  }

  // get

  async getAll({ logger, cameraId }) {
    logger && logger(`dateInfoService.getAll`);

    const datesInfo = await dateInfoRepo.find({ camera: cameraId });
    return datesInfo;
  }

  async getOne({ logger, cameraId, name }) {
    logger && logger(`dateInfoService.getOne ${name}`);

    const dateInfo = await dateInfoRepo.findOne({ camera: cameraId, name });
    return dateInfo;
  }
}
