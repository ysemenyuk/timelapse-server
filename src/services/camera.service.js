export default class CameraService {
  constructor(cameraRepo, taskService, fileService) {
    this.cameraRepo = cameraRepo;
    this.fileService = fileService;
    this.taskService = taskService;
  }

  //
  // create
  //

  async createOne({ logger, userId, payload }) {
    logger && logger(`cameraService.createOne`);

    const camera = await this.cameraRepo.create({
      user: userId,
      avatar: null,
      ...payload,
    });

    // create camera folders
    await this.fileService.createCameraFolders({
      logger,
      userId,
      cameraId: camera._id,
    });

    // create camera tasks
    await this.taskService.createCameraTasks({
      logger,
      userId,
      cameraId: camera._id,
    });

    return camera;
  }

  //
  // get
  //

  getMany({ logger, userId, query }) {
    logger && logger(`cameraService.getMany`);

    const cameras = this.cameraRepo.findManyByUser(userId, query);
    return cameras;
  }

  async getOne({ logger, cameraId }) {
    logger && logger(`cameraService.getOne`);

    const camera = await this.cameraRepo.findOne({ _id: cameraId });
    return camera;
  }

  async getOneById({ logger, cameraId }) {
    logger && logger(`cameraService.getOneById`);

    const camera = await this.cameraRepo.findOneById(cameraId);
    return camera;
  }

  async getCameraStats({ logger, cameraId }) {
    logger && logger(`cameraService.getCameraStats`);

    const stats = await this.cameraRepo.getStatsById(cameraId);
    return stats;
  }

  //
  // update
  //

  async updateOneById({ logger, cameraId, payload }) {
    logger && logger(`cameraService.updateOneById`);

    // TODO: validate payload

    const updated = await this.cameraRepo.updateOneById(cameraId, payload);
    return updated;
  }

  //
  // delete
  //

  async deleteOneById({ logger, userId, cameraId }) {
    logger && logger(`cameraService.deleteOne`);

    await this.fileService.deleteCameraFiles({ userId, cameraId, logger });
    await this.taskService.deleteCameraTasks({ userId, cameraId, logger });

    const deleted = await this.cameraRepo.deleteOneById(cameraId);
    return deleted;
  }
}
