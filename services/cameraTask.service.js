import CameraTask from '../models/CameraTask.js';

const getAll = async ({ cameraId, logger }) => {
  logger(`cameraTaskService.getAll cameraId: ${cameraId}`);
  const tasks = await CameraTask.find({ camera: cameraId });
  return tasks;
};

const getOne = async ({ taskId, logger }) => {
  logger(`cameraTaskService.getOne taskId: ${taskId}`);
  const task = await CameraTask.findOne({ _id: taskId });
  return task;
};

const createOne = async ({ userId, cameraId, payload, worker, logger }) => {
  logger(`cameraTaskService.createOne payload: ${payload}`);

  // TODO: create jobs?

  // const { jobName, status, ...data } = payload;

  // const jobs = await worker.jobs({ name: jobName, 'data.cameraId': cameraId });

  // console.log(333, jobs);

  // const job = worker.create(jobName, { userId, cameraId, ...payload });
  // job.repeatEvery(`${payload.interval} seconds`);
  // await job.save();

  // // console.log(222, job);

  // const task = new CameraTask({
  //   user: userId,
  //   camera: cameraId,
  //   name: jobName,
  //   status: status,
  //   job: job.attrs._id,
  //   data: data,
  //   logger,
  // });

  // await task.save();
  // return task;
};

const updateOne = async ({ taskId, payload, worker, logger }) => {
  logger(`cameraTaskService.updateOne taskId: ${taskId}, payload: ${payload}`);
  return await CameraTask.updateOne({ _id: id }, payload);

  // const { ObjectID } = mongodb;
  // const id = new ObjectID(task.job);

  // const { jobName, status, ...data } = payload;

  // const jobs = await worker.jobs({ _id: task.job });

  // console.log(111333, jobs);

  // await CameraTask.updateOne({ _id: taskId }, payload);
  // const updated = await CameraTask.findOne({ _id: taskId });
  // return updated;
};

const deleteOne = async ({ taskId, logger }) => {
  logger(`cameraTaskService.deleteOne taskId: ${taskId}`);

  const camera = await CameraTask.findOne({ _id: taskId });
  const deleted = await camera.remove();
  return deleted;
};

const deleteCameraTasks = async ({ cameraId, logger }) => {
  logger(`cameraFileService.deleteCameraTasks`);

  // console.log('ids', ids);

  const deleted = await CameraTask.deleteMany({ camera: cameraId });
  return deleted;
};

export default { getAll, getOne, createOne, updateOne, deleteOne, deleteCameraTasks };
