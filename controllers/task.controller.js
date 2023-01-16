import taskService from '../services/task.service.js';

const getAll = async (req, res) => {
  req.logger('cameraTask.controller getAll');

  const tasks = await taskService.getAll({
    cameraId: req.params.cameraId,
    logger: req.logger,
  });

  res.status(200).send(tasks);
  req.logResp(req);
};

const getOne = async (req, res) => {
  req.logger(`cameraTask.controller getOne`);

  const task = await taskService.getOneById({
    taskId: req.params.taskId,
    logger: req.logger,
  });

  res.status(200).send(task);
  req.logResp(req);
};

const createOne = async (req, res) => {
  req.logger(`cameraTask.controller createOne`);

  // TODO: check req.body take fields by schema!
  const payload = req.body;

  const task = await taskService.createOne({
    userId: req.userId,
    cameraId: req.params.cameraId,
    payload,
    worker: req.app.worker,
    logger: req.logger,
  });

  res.status(201).send(task);
  req.logResp(req);
};

const updateOne = async (req, res) => {
  req.logger(`cameraTask.controller updateOne`);

  // TODO: check req.body take fields by schema!
  const payload = req.body;

  const updated = await taskService.updateOneById({
    taskId: req.params.taskId,
    payload,
    worker: req.app.worker,
    logger: req.logger,
  });

  res.status(201).send(updated);
  req.logResp(req);
};

const deleteOne = async (req, res) => {
  req.logger(`cameraTask.controller deleteOne`);

  const deleted = await taskService.deleteOneById({
    taskId: req.params.taskId,
    worker: req.app.worker,
    logger: req.logger,
  });

  res.status(204).send(deleted);
  req.logResp(req);
};

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
};
