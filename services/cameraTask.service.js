import CameraTask from '../models/CameraTask.js';

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

// screenshot

const createScreenshotTask = async ({ userId, cameraId, worker, logger }) => {
  logger && logger(`cameraTaskService.createScreenshot`);

  const task = new CameraTask({
    user: userId,
    camera: cameraId,
    name: 'CreateScreenshot',
    type: 'Simple',
    createdAt: new Date(),
    startedAt: new Date(),
    status: 'Running',
  });

  const job = worker.create('createScreenshot', { userId, cameraId, taskId: task._id });

  await task.save();
  await job.save();

  return task;
};

const updateScreenshotsTask = async ({ userId, cameraId, taskId, payload, worker, logger }) => {
  logger && logger(`cameraTaskService.updateScreenshotTask`);

  const { status } = payload;
  const updatedTask = await CameraTask.findOneAndUpdate({ _id: taskId }, { status }, { new: true });

  if (status === 'Running') {
    const job = worker.create('createScreenshot', { userId, cameraId, taskId });
    await job.save();
  }

  return updatedTask;
};

// screenshot by time

const updateScreenshotsByTimeTask = async ({ userId, cameraId, taskId, payload, worker, logger }) => {
  logger && logger(`cameraTaskService.updateScreenshotsByTime`);

  const { status, screenshotsByTimeSettings } = payload;

  const jobs = await worker.jobs({ name: 'createScreenshotsByTime', 'data.cameraId': cameraId });

  if (jobs.length) {
    await Promise.all(jobs.map((job) => job.remove()));
  }

  if (status === 'Running') {
    const { interval } = screenshotsByTimeSettings;

    const job = worker.create('createScreenshotsByTime', { userId, cameraId, taskId });
    job.repeatEvery(`${interval} seconds`);

    await job.save();
  }

  const updatedTask = await CameraTask.findOneAndUpdate(
    { _id: taskId },
    { status, screenshotsByTimeSettings },
    { new: true }
  );

  return updatedTask;
};

// video

const createVideoTask = async ({ userId, cameraId, payload, worker, logger }) => {
  logger && logger(`cameraTaskService.createVideoTask`);

  const { startDateTime, endDateTime, duration, fps } = payload;

  const task = new CameraTask({
    user: userId,
    camera: cameraId,
    name: 'CreateVideo',
    type: 'Simple',
    createdAt: new Date(),
    startedAt: new Date(),
    status: 'Running',
    videoSettings: {
      startDateTime,
      endDateTime,
      duration,
      fps,
    },
  });

  const job = worker.create('createVideoFile', { userId, cameraId, taskId: task._id });

  await task.save();
  await job.save();

  return task;
};

const updateVideosTask = async ({ userId, cameraId, taskId, payload, worker, logger }) => {
  logger && logger(`cameraTaskService.updateVideoTask`);

  const { status, videoSettings } = payload;
  const updatedTask = await CameraTask.findOneAndUpdate({ _id: taskId }, { status, videoSettings }, { new: true });

  if (status === 'Running') {
    const job = worker.create('createVideoFile', { userId, cameraId, taskId });
    await job.save();
  }

  if (status === 'Canceled') {
    //
  }

  return updatedTask;
};

// video by time

const updateVideosByTimeTask = async ({ userId, cameraId, taskId, payload, worker, logger }) => {
  logger && logger(`cameraTaskService.updateVideosByTimeTask`);

  const { status, videosByTimeSettings } = payload;

  const jobs = await worker.jobs({ name: 'createVideoFilesByTime', 'data.cameraId': cameraId });

  if (jobs.length) {
    await Promise.all(jobs.map((job) => job.remove()));
  }

  if (status === 'Running') {
    const { startTime } = videosByTimeSettings;

    const job = worker.create('createVideoFilesByTime', { userId, cameraId, taskId });
    job.repeatAt(startTime); //ex "3:30pm"

    await job.save();
  }

  const updatedTask = await CameraTask.findOneAndUpdate(
    { _id: taskId },
    { status, videosByTimeSettings },
    { new: true }
  );

  return updatedTask;
};

// camera default

const createDefaultTasks = async ({ logger, userId, cameraId }) => {
  logger && logger(`cameraTaskService.createDefaultTasks`);

  const screenshotsTask = await createOne({
    logger,
    user: userId,
    camera: cameraId,
    name: 'Screenshots',
    type: 'Simple',
    default: true,
  });

  const videosTask = await createOne({
    logger,
    user: userId,
    camera: cameraId,
    name: 'Videos',
    type: 'Simple',
    default: true,
    videoSettings: {
      startDateTime: '2022-01-01',
      endDateTime: '2022-10-10',
      duration: 60,
      fps: 20,
    },
  });

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

  return { screenshotsTask, videosTask, screenshotsByTimeTask, videosByTimeTask };
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
  updateScreenshotsTask,
  updateScreenshotsByTimeTask,

  createVideoTask,
  updateVideosTask,
  updateVideosByTimeTask,
};
