import mongodb from 'mongodb';
import CameraTask from '../models/CameraTask.js';
import cameraService from './camera.service.js';

const getAll = async ({ cameraId, logger }) => {
  logger && logger(`cameraTaskService.getAll cameraId: ${cameraId}`);
  const tasks = await CameraTask.find({ camera: cameraId });
  return tasks;
};

const getOne = async ({ logger, ...query }) => {
  logger && logger(`cameraTaskService.getOne`);
  const task = await CameraTask.findOne({ ...query });
  return task;
};

const getOneById = async ({ taskId, logger }) => {
  logger && logger(`cameraTaskService.getOne taskId: ${taskId}`);
  const task = await CameraTask.findOne({ _id: taskId });
  return task;
};

const createOne = async ({ userId, cameraId, payload, logger }) => {
  logger && logger(`cameraTaskService.createOne`);

  const { status, screenshotsByTime } = payload;

  const task = new CameraTask({
    user: userId,
    camera: cameraId,
    type: 'createScreenshotsByTime',
    status,
    screenshotsByTime,
  });

  await task.save();

  await cameraService.updateOne({ logger, cameraId, payload: { screenshotsByTimeTask: task._id } });

  return task;
};

const updateOne = async ({ taskId, payload, logger }) => {
  logger && logger(`cameraTaskService.updateOne taskId: ${taskId}`);

  await CameraTask.updateOne({ _id: taskId }, payload);
  const updated = await CameraTask.findOne({ _id: taskId });
  return updated;
};

const deleteOne = async ({ taskId, logger }) => {
  logger && logger(`cameraTaskService.deleteOne taskId: ${taskId}`);

  const camera = await CameraTask.findOne({ _id: taskId });
  const deleted = await camera.remove();
  return deleted;
};

const deleteCameraTasks = async ({ cameraId, logger }) => {
  logger && logger(`cameraFileService.deleteCameraTasks`);

  // console.log('ids', ids);

  const deleted = await CameraTask.deleteMany({ camera: cameraId });
  return deleted;
};

const createScreenshot = async ({ userId, cameraId, worker, logger }) => {
  logger && logger(`cameraTaskService.createScreenshot`);

  const task = new CameraTask({
    user: userId,
    camera: cameraId,
    type: 'createScreenshot',
    createdAt: new Date(),
    startedAt: new Date(),
    status: 'Running',
  });

  await task.save();

  const job = worker.create('createScreenshot', { userId, cameraId, taskId: task._id });

  await job.save();

  return task;
};

const createScreenshotsByTime = async ({ userId, cameraId, taskId, payload, worker, logger }) => {
  logger && logger(`cameraTaskService.createScreenshotsByTime`);

  const { status, screenshotsByTime } = payload;
  const { startTime, stopTime, interval } = screenshotsByTime;

  const jobs = await worker.jobs({ name: 'createScreenshotsByTime', 'data.cameraId': cameraId });

  if (jobs[0]) {
    await jobs[0].remove();
  }

  if (status === 'Running') {
    const task = await CameraTask.findOne({ _id: taskId });

    const job = worker.create('createScreenshotsByTime', { userId, cameraId, taskId });
    job.repeatEvery(`${task.screenshotsByTime.interval} seconds`);

    await job.save();
  }

  const updatedTask = await CameraTask.findOneAndUpdate(
    { _id: taskId },
    { status, screenshotsByTime: { startTime, stopTime, interval } },
    { new: true }
  );

  return updatedTask;
};

export default {
  getAll,
  getOne,
  getOneById,
  createOne,
  updateOne,
  deleteOne,
  deleteCameraTasks,
  createScreenshot,
  createScreenshotsByTime,
};
