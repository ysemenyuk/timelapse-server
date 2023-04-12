export default class DateInfoService {
  constructor(dateInfoRepo) {
    this.dateInfoRepo = dateInfoRepo;
  }

  // create

  async createOne({ logger, userId, cameraId, ...payload }) {
    logger && logger(`dateInfoService.createOne`);

    const dateInfo = await this.dateInfoRepo.create({
      user: userId,
      camera: cameraId,
      ...payload,
    });

    return dateInfo;
  }

  // get

  async getMany({ logger, cameraId }) {
    logger && logger(`dateInfoService.getMany`);

    const datesInfo = await this.dateInfoRepo.find({ camera: cameraId });
    return datesInfo;
  }

  async getOne({ logger, cameraId, name }) {
    logger && logger(`dateInfoService.getOne ${name}`);

    const dateInfo = await this.dateInfoRepo.findOne({ camera: cameraId, name });
    return dateInfo;
  }
}
