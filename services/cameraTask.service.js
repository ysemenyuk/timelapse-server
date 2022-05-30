import CameraTask from '../models/CameraTask.js';
import { taskName, taskStatus, taskType } from '../utils/constants.js';

const getAll = async ({ cameraId, logger }) => {
  logger && logger(`cameraTaskService.getAll`);

  const tasks = await CameraTask.find({ camera: cameraId });
  return tasks;
};

const getOneById = async ({ logger, taskId }) => {
  logger && logger(`cameraTaskService.getOne`);

  const task = await CameraTask.findOne({ _id: taskId });
  return task;
};

// create

const createOne = async ({ userId, cameraId, payload, worker, logger }) => {
  logger && logger(`cameraTaskService.createOne`);

  const { status } = payload;

  const task = new CameraTask({
    user: userId,
    camera: cameraId,
    ...payload,
  });

  await task.save();

  if (status === taskStatus.RUNNING) {
    await worker.create(task);
  }

  return task;
};

// update

const updateOneById = async ({ taskId, payload, worker, logger }) => {
  logger && logger(`cameraTaskService.updateOne`);

  const { status } = payload;

  const task = await CameraTask.findOneAndUpdate({ _id: taskId }, payload, { new: true });

  if (status === taskStatus.RUNNING) {
    await worker.create(task);
  }

  return task;
};

// delete

const deleteOneById = async ({ taskId, logger }) => {
  logger && logger(`cameraTaskService.deleteOne`);

  const deleted = await CameraTask.findOneAndRemove({ _id: taskId });

  console.log(11111, deleted);
  return deleted;
};

// camera default

const createDefaultTasks = async ({ logger, userId, cameraId }) => {
  logger && logger(`cameraTaskService.createDefaultTasks`);

  const photosByTimeTask = new CameraTask({
    user: userId,
    camera: cameraId,
    name: taskName.CREATE_PHOTOS_BY_TIME,
    type: taskType.REPEAT_EVERY,
    settings: {
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

  const deleted = await CameraTask.deleteMany({ camera: cameraId });
  return deleted;
};

export default {
  getAll,
  getOneById,

  createOne,
  updateOneById,
  deleteOneById,

  createDefaultTasks,
  deleteCameraTasks,
};
