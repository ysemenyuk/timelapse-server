import { taskName, taskType } from '../utils/constants.js';

export default class TaskService {
  constructor(taskRepo, workerService) {
    this.taskRepo = taskRepo;
    this.workerService = workerService;
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

  // get

  async getMany({ logger, cameraId }) {
    logger && logger(`taskService.getMany`);

    const tasks = await this.taskRepo.find({ camera: cameraId });
    return tasks;
  }

  async getOneById({ logger, taskId }) {
    logger && logger(`taskService.getOne`);

    const task = await this.taskRepo.findOneById(taskId);
    return task;
  }

  // update

  async updateOneById({ logger, taskId, payload }) {
    logger && logger(`taskService.updateOne`);

    const task = await this.taskRepo.updateOneById(taskId, payload);
    await this.workerService.updateTaskJob(task);

    return task;
  }

  // delete

  async deleteOneById({ taskId, logger }) {
    logger && logger(`taskService.deleteOne`, taskId);

    // TODO: if not removable return error

    const deleted = await this.taskRepo.deleteOneById(taskId);
    await this.workerService.removeTaskJobs(taskId);

    return deleted;
  }

  //
  // camera
  //

  async createCameraTasks({ logger, userId, cameraId }) {
    logger && logger(`taskService.createCameraTasks`);

    const photosByTimeTask = await this.taskRepo.create({
      user: userId,
      camera: cameraId,
      name: taskName.CREATE_PHOTOS_BY_TIME,
      type: taskType.REPEAT_EVERY,
      removable: false,
      photoSettings: {
        // default settings
        timeRangeType: 'customTime',
        startTime: '08:00',
        endTime: '20:00',
        interval: 60,
      },
    });

    const videosByTimeTask = await this.taskRepo.create({
      user: userId,
      camera: cameraId,
      name: taskName.CREATE_VIDEOS_BY_TIME,
      type: taskType.REPEAT_EVERY,
      removable: false,
      videoSettings: {
        // default settings
        dateRangeType: 'customDates', // allDates, customDates
        dateRange: 'lastDay', // lastDay, lastWeek, lastMonth
        timeRangeType: 'allTime', // allTime, customTime
        startTime: '09:00',
        endTime: '18:00',
        interval: 'oneTimeDay', // oneTimeMonth, oneTimeWeek, oneTimeDay
        duration: 60,
        fps: 30,
        deletExistingFile: 'yes',
      },
    });

    return { photosByTimeTask, videosByTimeTask };
  }

  async deleteCameraTasks({ cameraId, logger }) {
    logger && logger(`taskService.deleteCameraTasks`);

    const deleted = await this.taskRepo.deleteMany({ camera: cameraId });
    await this.workerService.removeCameraJobs(cameraId);

    return deleted;
  }
}
