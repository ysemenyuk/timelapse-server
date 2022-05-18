import cameraTaskService from '../services/cameraTask.service.js';

const getAll = async (req, res) => {
  req.logger('cameraTask.controller getAll api/cameras/:cameraId/tasks');

  const tasks = await cameraTaskService.getAll({
    cameraId: req.params.cameraId,
    logger: req.logger,
  });

  res.status(200).send(tasks);
  req.logResp(req);
};

const getOne = async (req, res) => {
  req.logger(`cameraTask.controller getOne api/cameras/:cameraId/tasks/${req.params.taskId}`);

  const task = await cameraTaskService.getOneById({
    taskId: req.params.taskId,
    logger: req.logger,
  });

  res.status(200).send(task);
  req.logResp(req);
};

const createOne = async (req, res) => {
  req.logger(`cameraTask.controller createOne api/cameras/:cameraId/tasks/`);

  // TODO: check req.body take fields by schema!
  const payload = req.body;

  const task = await cameraTaskService.createOne({
    logger: req.logger,
    user: req.userId,
    camera: req.params.cameraId,
    ...payload,
  });

  res.status(201).send(task);
  req.logResp(req);
};

const updateOneById = async (req, res) => {
  req.logger(`cameraTask.controller updateOneById api/cameras/:cameraId/tasks/${req.params.taskId}`);

  // TODO: check req.body take fields by schema!
  const payload = req.body;

  const updated = await cameraTaskService.updateOne({
    logger: req.logger,
    taskId: req.params.taskId,
    payload,
  });

  res.status(201).send(updated);
  req.logResp(req);
};

const deleteOneById = async (req, res) => {
  req.logger(`cameraTask.controller deleteOne api/cameras/:cameraId/tasks/${req.params.taskId}`);

  const deleted = await cameraTaskService.deleteOne({
    taskId: req.params.taskId,
    logger: req.logger,
  });

  res.status(204).send(deleted);
  req.logResp(req);
};

const createScreenshotTask = async (req, res) => {
  req.logger(`cameraTask.controller createScreenshot`);

  const task = await cameraTaskService.createScreenshotTask({
    worker: req.app.worker,
    logger: req.logger,
    userId: req.userId,
    cameraId: req.cameraId,
  });

  res.status(201).send(task);
  req.logResp(req);
};

const updateScreenshotsByTimeTask = async (req, res) => {
  req.logger(`cameraTask.controller createScreenshotsByTime`);

  // TODO: check req.body take fields by schema!
  const payload = req.body;

  const task = await cameraTaskService.updateScreenshotsByTimeTask({
    worker: req.app.worker,
    logger: req.logger,
    userId: req.userId,
    cameraId: req.params.cameraId,
    taskId: req.params.taskId,
    payload,
  });

  res.status(201).send(task);
  req.logResp(req);
};

export default {
  getAll,
  getOne,
  createOne,
  updateOneById,
  deleteOneById,
  createScreenshotTask,
  updateScreenshotsByTimeTask,
};
