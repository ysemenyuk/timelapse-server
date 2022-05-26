import CameraTask from '../models/CameraTask.js';
import { validateCreateVideoTaskPayload } from '../validators/task.validators.yup.js';

const getAll = async ({ cameraId, logger }) => {
  logger && logger(`cameraTaskService.getAll cameraId: ${cameraId}`);

  const tasks = await CameraTask.find({ camera: cameraId });
  return tasks;
};

const getOneById = async ({ logger, taskId }) => {
  logger && logger(`cameraTaskService.getOne taskId: ${taskId}`);

  const task = await CameraTask.findOne({ _id: taskId });
  return task;
};

const createOne = async ({ logger, ...payload }) => {
  logger && logger(`cameraTaskService.createOne`);

  const task = new CameraTask({ ...payload });
  await task.save();
  return task;
};

const updateOneById = async ({ logger, taskId, payload }) => {
  logger && logger(`cameraTaskService.updateOne taskId: ${taskId}`);

  const updated = await CameraTask.findOneAndUpdate({ _id: taskId }, payload, { new: true });
  return updated;
};

const deleteOneById = async ({ logger, taskId }) => {
  logger && logger(`cameraTaskService.deleteOne taskId: ${taskId}`);

  const camera = await CameraTask.findOne({ _id: taskId });
  const deleted = await camera.remove();
  return deleted;
};

//
// create
//

// createScreenshotTask

const createScreenshotTask = async ({ userId, cameraId, worker, logger }) => {
  logger && logger(`cameraTaskService.createScreenshot`);

  const task = new CameraTask({
    user: userId,
    camera: cameraId,
    name: 'CreateScreenshot',
    // payload
    type: 'Simple',
    status: 'Running',
  });

  await task.save();
  await task.updateOne({ startedAt: new Date() });
  await worker.oneTime('CreateScreenshot', { userId, cameraId, taskId: task._id });

  return task;
};

// createVideoTask

const createVideoTask = async ({ userId, cameraId, payload, worker, logger }) => {
  logger && logger(`cameraTaskService.createVideoTask`);

  await validateCreateVideoTaskPayload(payload);

  const { videoSettings } = payload;
  const { startDateTime, endDateTime, duration, fps } = videoSettings;

  const task = new CameraTask({
    user: userId,
    camera: cameraId,
    // payload
    name: 'CreateVideo',
    type: 'Simple',
    status: 'Running',
    videoSettings: {
      startDateTime,
      endDateTime,
      duration,
      fps,
    },
  });

  await task.save();
  await task.updateOne({ startedAt: new Date() });
  await worker.oneTime('CreateVideo', { userId, cameraId, taskId: task._id });

  return task;
};

// createScreenshotsByTimeTask

const createScreenshotsByTimeTask = async ({ userId, cameraId, payload, worker, logger }) => {
  logger && logger(`cameraTaskService.createScreenshotsByTimeTask`);

  // if exists error

  const { status, screenshotsByTimeSettings } = payload;
  const { startTime, stopTime, interval } = screenshotsByTimeSettings;

  const task = new CameraTask({
    user: userId,
    camera: cameraId,
    // payload
    name: 'CreateScreenshotsByTime',
    type: 'Periodic',
    status,
    screenshotsByTimeSettings: {
      startTime,
      stopTime,
      interval,
    },
  });

  await task.save();

  if (status === 'Running') {
    await task.updateOne({ startedAt: new Date() });
    await worker.repeatEvery('CreateScreenshotsByTime', interval, { userId, cameraId, taskId: task._id });
  }

  return task;
};

// createVideosByTimeTask

const createVideosByTimeTask = async ({ userId, cameraId, payload, worker, logger }) => {
  logger && logger(`cameraTaskService.createVideosByTimeTask`);

  const { status, videosByTimeSettings } = payload;
  const { startTime, duration, fps } = videosByTimeSettings;

  const task = new CameraTask({
    user: userId,
    camera: cameraId,
    // payload
    name: 'CreateVideosByTime',
    type: 'Periodic',
    status,
    videosByTimeSettings: {
      startTime,
      duration,
      fps,
    },
  });

  await task.save();

  if (status === 'Running') {
    await task.updateOne({ startedAt: new Date() });
    await worker.repeatAt('CreateVideosByTime', startTime, { userId, cameraId, taskId: task._id });
  }

  return task;
};

//
// update
//

// updateScreenshotTask

const updateScreenshotTask = async ({ userId, cameraId, taskId, payload, worker, logger }) => {
  logger && logger(`cameraTaskService.updateScreenshotTask`);

  const { status } = payload;
  const task = await CameraTask.findOneAndUpdate({ _id: taskId }, { status }, { new: true });

  if (status === 'Running') {
    await task.updateOne({ startedAt: new Date() });
    await worker.oneTime('CreateScreenshot', { userId, cameraId, taskId: task._id });
  }

  return task;
};

// updateVideoTask

const updateVideoTask = async ({ userId, cameraId, taskId, payload, worker, logger }) => {
  logger && logger(`cameraTaskService.updateVideoTask`);

  const { status, videoSettings } = payload;
  const task = await CameraTask.findOneAndUpdate({ _id: taskId }, { status, videoSettings }, { new: true });

  if (status === 'Running') {
    await worker.oneTime('CreateVideo', { userId, cameraId, taskId });
    await task.updateOne({ startedAt: new Date() });
  }

  if (status === 'Canceled') {
    // remove job
  }

  return task;
};

// updateScreenshotsByTimeTask

const updateScreenshotsByTimeTask = async ({ userId, cameraId, taskId, payload, worker, logger }) => {
  logger && logger(`cameraTaskService.updateScreenshotsByTime`);

  const { status, screenshotsByTimeSettings } = payload;
  const { startTime, stopTime, interval } = screenshotsByTimeSettings;

  const task = await CameraTask.findOneAndUpdate(
    { _id: taskId },
    {
      status,
      screenshotsByTimeSettings: {
        startTime,
        stopTime,
        interval,
      },
    },
    { new: true }
  );

  await worker.removeAll('CreateScreenshotsByTime', cameraId);

  if (status === 'Running') {
    await task.updateOne({ startedAt: new Date() });
    await worker.repeatEvery('CreateScreenshotsByTime', interval, { userId, cameraId, taskId: task._id });
  }

  return task;
};

// updateVideosByTimeTask

const updateVideosByTimeTask = async ({ userId, cameraId, taskId, payload, worker, logger }) => {
  logger && logger(`cameraTaskService.updateVideosByTimeTask`);

  const { status, videosByTimeSettings } = payload;
  const { startTime, duration, fps } = videosByTimeSettings;

  const task = await CameraTask.findOneAndUpdate(
    { _id: taskId },
    {
      status,
      videosByTimeSettings: {
        startTime,
        duration,
        fps,
      },
    },
    { new: true }
  );

  await worker.removeAll('CreateVideosByTime', cameraId);

  if (status === 'Running') {
    await task.updateOne({ startedAt: new Date() });
    await worker.repeatAt('CreateVideosByTime', startTime, { userId, cameraId, taskId: task._id });
  }

  return task;
};

// camera default

const createDefaultTasks = async ({ logger, userId, cameraId }) => {
  logger && logger(`cameraTaskService.createDefaultTasks`);

  const screenshotsByTimeTask = await createOne({
    logger,
    user: userId,
    camera: cameraId,
    name: 'ScreenshotsByTime',
    type: 'Periodic',
    default: true,
    screenshotsByTimeSettings: {
      startTime: '08:00',
      stopTime: '20:00',
      interval: 60,
    },
  });

  const videosByTimeTask = await createOne({
    logger,
    user: userId,
    camera: cameraId,
    name: 'VideosByTime',
    type: 'Periodic',
    default: true,
    videosByTimeSettings: {
      startTime: '22:00',
      duration: 60,
      fps: 20,
    },
  });

  return { screenshotsByTimeTask, videosByTimeTask };
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

  createScreenshotTask,
  updateScreenshotTask,

  createScreenshotsByTimeTask,
  updateScreenshotsByTimeTask,

  createVideoTask,
  updateVideoTask,

  createVideosByTimeTask,
  updateVideosByTimeTask,
};
