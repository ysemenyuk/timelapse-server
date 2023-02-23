import Task from '../models/Task.js';
import worker from '../worker/agenda.worker.js';
import { taskName, taskType } from '../utils/constants.js';

// get

const getAll = async ({ cameraId, logger }) => {
  logger && logger(`taskService.getAll`);

  const tasks = await Task.find({ camera: cameraId });
  return tasks;
};

const getOneById = async ({ logger, taskId }) => {
  logger && logger(`taskService.getOne`);

  const task = await Task.findOne({ _id: taskId });
  return task;
};

// create

const createOne = async ({ userId, cameraId, payload, logger }) => {
  logger && logger(`taskService.createOne`);

  const task = new Task({
    user: userId,
    camera: cameraId,
    ...payload,
  });

  await task.save();
  await worker.createTaskJob(task);

  return task;
};

// update

const updateOneById = async ({ taskId, payload, logger }) => {
  logger && logger(`taskService.updateOne`);

  const task = await Task.findOneAndUpdate({ _id: taskId }, payload, { new: true });
  await worker.updateTaskJob(task);

  return task;
};

const updateStatusById = async ({ taskId, payload, logger }) => {
  logger && logger(`taskService.updateStatusById`);

  const task = await Task.findOneAndUpdate({ _id: taskId }, payload, { new: true });
  return task;
};

// delete

const deleteOneById = async ({ taskId, logger }) => {
  logger && logger(`taskService.deleteOne`, taskId);

  // TODO: if not removable return error

  await worker.removeTaskJobs(taskId);

  const deleted = await Task.findOneAndRemove({ _id: taskId });
  return deleted;
};

//
// camera
//

const createCameraDefaultTasks = async ({ logger, userId, cameraId }) => {
  logger && logger(`taskService.createDefaultTasks`);

  const photosByTimeTask = new Task({
    user: userId,
    camera: cameraId,
    name: taskName.CREATE_PHOTOS_BY_TIME,
    type: taskType.REPEAT_EVERY,
    removable: false,
    photoSettings: {
      interval: 60, // seconds
      timeRangeType: 'customTime', // allTime, sunTime, customTime
      customTimeStart: '08:00', // 08:00
      customTimeStop: '20:00', // 20:00
    },
  });

  await photosByTimeTask.save();
  return { photosByTimeTask };
};

const deleteCameraTasks = async ({ cameraId, logger }) => {
  logger && logger(`cameraFileService.deleteCameraTasks`);
  // TODO: delete camera jobs

  const deleted = await Task.deleteMany({ camera: cameraId });
  return deleted;
};

export default {
  getAll,
  getOneById,
  createOne,
  updateOneById,
  updateStatusById,
  deleteOneById,
  createCameraDefaultTasks,
  deleteCameraTasks,
};
