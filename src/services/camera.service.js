import { cameraRepo } from '../db/index.js';
import { fileService, taskService } from './index.js';

export default class CameraService {
  constructor() {
    //
  }

  //
  // create
  //

  async createOne({ logger, userId, payload }) {
    logger && logger(`cameraService.createOne`);

    const camera = await cameraRepo.create({ user: userId, avatar: null, ...payload });
    // console.log('camera', camera);

    // create camera folders
    await fileService.createCameraFolders({
      logger,
      userId,
      cameraId: camera._id,
    });

    // create camera tasks
    await taskService.createCameraTasks({
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

    const cameras = cameraRepo.find(userId, query);
    // console.log('cameraService.getAll cameras', cameras);
    return cameras;
  }

  async getOne({ logger, cameraId }) {
    logger && logger(`cameraService.getOne`);

    const camera = await cameraRepo.findOne({ _id: cameraId });
    // console.log('cameraService.getOne camera', camera);
    return camera;
  }

  async getOneById({ logger, cameraId }) {
    logger && logger(`cameraService.getOneById`);

    const camera = await cameraRepo.findOneById(cameraId);
    return camera;
  }

  async getCameraStats({ logger, cameraId }) {
    logger && logger(`cameraService.getCameraStats`);

    const stats = await cameraRepo.getStats(cameraId);
    // console.log('cameraService.getCameraStats stats', stats);
    return stats;
  }

  //
  // update
  //

  async updateOneById({ logger, cameraId, payload }) {
    logger && logger(`cameraService.updateOneById`);

    // TODO: validate payload

    const updated = await cameraRepo.updateOneById(cameraId, payload);
    // console.log('cameraService.updateOneById updated', updated);
    return updated;
  }

  //
  // delete
  //

  async deleteOneById({ logger, userId, cameraId }) {
    logger && logger(`cameraService.deleteOne`);

    await fileService.deleteCameraFiles({ userId, cameraId, logger });
    await taskService.deleteCameraTasks({ userId, cameraId, logger });

    const deleted = await cameraRepo.deleteOneById(cameraId);
    return deleted;
  }
}
