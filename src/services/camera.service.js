// import { cameraRepo } from '../db/index.js';
// import { fileService, taskService } from './index.js';

export default class CameraService {
  constructor(cameraRepo) {
    this.cameraRepo = cameraRepo;
  }

  inject(fileService, taskService) {
    this.fileService = fileService;
    this.taskService = taskService;
  }

  //
  // create
  //

  async createOne({ logger, userId, payload }) {
    logger && logger(`cameraService.createOne`);

    const camera = await this.cameraRepo.create({ user: userId, avatar: null, ...payload });
    // console.log('camera', camera);

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

  getAll({ userId, logger, query }) {
    logger && logger(`cameraService.getAll`);

    const cameras = this.cameraRepo.find(userId, query);
    // console.log('cameraService.getAll cameras', cameras);
    return cameras;
  }

  async getOne({ logger, cameraId }) {
    logger && logger(`cameraService.getOne`);

    const camera = await this.cameraRepo.findOne({ _id: cameraId });
    // console.log('cameraService.getOne camera', camera);
    return camera;
  }

  async getOneById({ logger, cameraId }) {
    logger && logger(`cameraService.getOneById`);

    const camera = await this.cameraRepo.findOneById(cameraId);
    return camera;
  }

  async getCameraStats({ logger, cameraId }) {
    logger && logger(`cameraService.getCameraStats`);

    const stats = await this.cameraRepo.getStats(cameraId);
    // console.log('cameraService.getCameraStats stats', stats);
    return stats;
  }

  //
  // update
  //

  async updateOneById({ logger, cameraId, payload }) {
    logger && logger(`cameraService.updateOneById`);

    // TODO: validate payload

    const updated = await this.cameraRepo.updateOneById(cameraId, payload);
    // console.log('cameraService.updateOneById updated', updated);
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
