import Task from '../models/Task.js';
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

const createOne = async ({ userId, cameraId, payload, worker, logger }) => {
  logger && logger(`taskService.createOne`);

  const task = new Task({
    user: userId,
    camera: cameraId,
    ...payload,
  });

  await task.save();
  await worker.create(task);

  return task;
};

// update

const updateOneById = async ({ taskId, payload, worker, logger }) => {
  logger && logger(`taskService.updateOne`);

  const task = await Task.findOneAndUpdate({ _id: taskId }, payload, { new: true });

  await worker.update(task);

  return task;
};

// delete

const deleteOneById = async ({ taskId, logger }) => {
  logger && logger(`taskService.deleteOne`);

  // TODO: if not removable return error

  const deleted = await Task.findOneAndRemove({ _id: taskId });
  return deleted;
};

//
// camera default
//

const createDefaultCameraTasks = async ({ logger, userId, cameraId }) => {
  logger && logger(`taskService.createDefaultTasks`);

  const photosByTimeTask = new Task({
    user: userId,
    camera: cameraId,
    name: taskName.CREATE_PHOTOS_BY_TIME,
    type: taskType.REPEAT_EVERY,
    removable: false,
    photoSettings: {
      startTime: '08:00',
      stopTime: '20:00',
      interval: 60,
    },
  });

  await photosByTimeTask.save();

  return { photosByTimeTask };
};

const deleteCameraTasks = async ({ cameraId, logger }) => {
  logger && logger(`cameraFileService.deleteCameraTasks`);

  const deleted = await Task.deleteMany({ camera: cameraId });
  return deleted;
};

export default {
  getAll,
  getOneById,

  createOne,
  updateOneById,
  deleteOneById,

  createDefaultCameraTasks,
  deleteCameraTasks,
};