import { workerService } from './index.js';
import { taskRepo } from '../db/index.js';
import { taskName, taskType } from '../utils/constants.js';

export default class TaskService {
  constructor() {
    //
  }

  // create

  async createOne({ logger, userId, cameraId, payload }) {
    logger && logger(`taskService.createOne`);

    const task = await taskRepo.create({
      user: userId,
      camera: cameraId,
      ...payload,
    });

    await workerService.createTaskJob(task);

    return task;
  }

  // get

  async getAll({ logger, cameraId }) {
    logger && logger(`taskService.getAll`);

    const tasks = await taskRepo.find({ camera: cameraId });
    return tasks;
  }

  async getOneById({ logger, taskId }) {
    logger && logger(`taskService.getOne`);

    const task = await taskRepo.findOneById(taskId);
    return task;
  }

  // update

  async updateOneById({ logger, taskId, payload }) {
    logger && logger(`taskService.updateOne`);

    const task = await taskRepo.updateOneById(taskId, payload);
    await workerService.updateTaskJob(task);

    return task;
  }

  // delete

  async deleteOneById({ taskId, logger }) {
    logger && logger(`taskService.deleteOne`, taskId);

    // TODO: if not removable return error

    const deleted = await taskRepo.deleteOneById(taskId);
    await workerService.removeTaskJobs(taskId);

    return deleted;
  }

  //
  // camera
  //

  async createCameraTasks({ logger, userId, cameraId }) {
    logger && logger(`taskService.createCameraTasks`);

    const photosByTimeTask = await taskRepo.create({
      user: userId,
      camera: cameraId,
      name: taskName.CREATE_PHOTOS_BY_TIME,
      type: taskType.REPEAT_EVERY,
      removable: false,
      photoSettings: {
        // default settings
        timeRangeType: 'customTime',
        customTimeStart: '08:00',
        customTimeStop: '20:00',
        interval: 60,
      },
    });

    const videosByTimeTask = {
      user: userId,
      camera: cameraId,
      name: taskName.CREATE_VIDEOS_BY_TIME,
      type: taskType.REPEAT_EVERY,
      removable: false,
      videoSettings: {
        // default settings
        customName: 'videoByTime',
        dateRangeType: 'allDates', // allDates, customDates, lastDay, lastWeek, lastMonth
        startDate: '', // dateString
        endDate: '', // dateString
        timeRangeType: 'customTime', // allTime, customTime
        customTimeStart: '08:00', // timeString
        customTimeEnd: '18:00', // timeString
        fps: 25, // fps
        duration: 60, // seconds
        interval: 'oneTimeInMonth', // string
      },
    };

    return { photosByTimeTask, videosByTimeTask };
  }

  async deleteCameraTasks({ cameraId, logger }) {
    logger && logger(`taskService.deleteCameraTasks`);

    const deleted = await taskRepo.deleteMany({ camera: cameraId });
    await workerService.removeCameraJobs(cameraId);

    return deleted;
  }
}
