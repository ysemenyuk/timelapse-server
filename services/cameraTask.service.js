import CameraTask from '../models/CameraTask.js';

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

const updateOne = async ({ logger, taskId, payload }) => {
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

  const deleted = await CameraTask.deleteMany({ camera: cameraId });
  return deleted;
};

const createScreenshotTask = async ({ userId, cameraId, worker, logger }) => {
  logger && logger(`cameraTaskService.createScreenshot`);

  const task = new CameraTask({
    user: userId,
    camera: cameraId,
    type: 'createScreenshot',
    createdAt: new Date(),
    startedAt: new Date(),
    status: 'Running',
  });

  const job = worker.create('createScreenshot', { userId, cameraId, taskId: task._id });

  await task.save();
  await job.save();

  return task;
};

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

export default {
  getAll,
  getOne,
  getOneById,
  createOne,
  updateOne,
  deleteOne,
  deleteCameraTasks,
  createScreenshotTask,
  updateScreenshotsByTimeTask,
};
