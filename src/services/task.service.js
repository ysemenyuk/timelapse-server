// import worker from '../worker/index.js';
// import { taskRepo } from '../db/index.js';
// import { taskName, taskType } from '../utils/constants.js';

export default class Task {
  constructor(repos) {
    this.taskRepo = repos.taskRepo;
  }

  init(services) {
    this.workerService = services.workerService;
  }

  // create

  async createOne({ logger, userId, cameraId, payload }) {
    logger && logger(`taskService.createOne`);

    const task = await this.taskRepo.create({
      user: userId,
      camera: cameraId,
      ...payload,
    });

    await this.workerService.createTaskJob(task);

    return task;
  }

  // // get

  // const getAll = async ({ logger, cameraId }) => {
  //   logger && logger(`taskService.getAll`);

  //   const tasks = await taskRepo.find({ camera: cameraId });
  //   return tasks;
  // };

  // const getOneById = async ({ logger, taskId }) => {
  //   logger && logger(`taskService.getOne`);

  //   const task = await taskRepo.findOneById(taskId);
  //   return task;
  // };

  // // update

  // const updateOneById = async ({ logger, taskId, payload }) => {
  //   logger && logger(`taskService.updateOne`);

  //   const task = await taskRepo.updateOneById(taskId, payload);
  //   await worker.updateTaskJob(task);

  //   return task;
  // };

  // // delete

  // const deleteOneById = async ({ taskId, logger }) => {
  //   logger && logger(`taskService.deleteOne`, taskId);

  //   // TODO: if not removable return error

  //   const deleted = await taskRepo.deleteOneById(taskId);
  //   await worker.removeTaskJobs(taskId);

  //   return deleted;
  // };

  // //
  // // camera
  // //

  // const createCameraTasks = async ({ logger, userId, cameraId }) => {
  //   logger && logger(`taskService.createCameraTasks`);

  //   const photosByTimeTask = await taskRepo.create({
  //     user: userId,
  //     camera: cameraId,
  //     name: taskName.CREATE_PHOTOS_BY_TIME,
  //     type: taskType.REPEAT_EVERY,
  //     removable: false,
  //     photoSettings: {
  //       interval: 60, // seconds
  //       timeRangeType: 'customTime', // allTime, sunTime, customTime
  //       customTimeStart: '08:00', // 08:00
  //       customTimeStop: '20:00', // 20:00
  //     },
  //   });

  //   const actualVideoByTimeTask = {};

  //   return { photosByTimeTask, actualVideoByTimeTask };
  // };

  // const deleteCameraTasks = async ({ cameraId, logger }) => {
  //   logger && logger(`taskService.deleteCameraTasks`);

  //   const deleted = await taskRepo.deleteMany({ camera: cameraId });
  //   await worker.removeCameraJobs(cameraId);

  //   return deleted;
  // };
}

// export default {
//   createOne,
//   getAll,
//   getOneById,
//   updateOneById,
//   deleteOneById,
//   createCameraTasks,
//   deleteCameraTasks,
// };
