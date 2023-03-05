import taskService from '../services/task.service.js';

const getAll = async (req, res) => {
  req.reqLogger('cameraTask.controller getAll');

  const tasks = await taskService.getAll({
    cameraId: req.params.cameraId,
    logger: req.reqLogger,
  });

  res.status(200).send(tasks);
  req.resLogger(req);
};

const getOne = async (req, res) => {
  req.reqLogger(`cameraTask.controller getOne`);

  const task = await taskService.getOneById({
    taskId: req.params.taskId,
    logger: req.reqLogger,
  });

  res.status(200).send(task);
  req.resLogger(req);
};

const createOne = async (req, res) => {
  req.reqLogger(`cameraTask.controller createOne`);

  // TODO: check req.body take fields by schema!
  const payload = req.body;

  const task = await taskService.createOne({
    userId: req.userId,
    cameraId: req.params.cameraId,
    payload,
    // worker: req.app.worker,
    logger: req.reqLogger,
  });

  res.status(201).send(task);
  req.resLogger(req);
};

const updateOne = async (req, res) => {
  req.reqLogger(`cameraTask.controller updateOne`);

  // TODO: check req.body take fields by schema!
  const payload = req.body;

  const updated = await taskService.updateOneById({
    taskId: req.params.taskId,
    payload,
    logger: req.reqLogger,
  });

  res.status(201).send(updated);
  req.resLogger(req);
};

const deleteOne = async (req, res) => {
  req.reqLogger(`cameraTask.controller deleteOne`);

  const deleted = await taskService.deleteOneById({
    taskId: req.params.taskId,
    logger: req.reqLogger,
  });

  res.status(204).send(deleted);
  req.resLogger(req);
};

export default {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
};
