import cameraTaskService from '../services/cameraTask.service.js';
import screenshotService from '../services/screenshot.service.js';

export default () => {
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

    const task = await cameraTaskService.createOne({
      userId: req.userId,
      cameraId: req.params.cameraId,
      worker: req.app.worker,
      payload: req.body,
      logger: req.logger,
    });

    res.status(201).send(task);
    req.logResp(req);
  };

  const updateOne = async (req, res) => {
    req.logger(`cameraTask.controller updateOne api/cameras/:cameraId/tasks/${req.params.taskId}`);

    const updated = await cameraTaskService.updateOne({
      taskId: req.params.taskId,
      payload: req.body,
      logger: req.logger,
    });

    res.status(201).send(updated);
    req.logResp(req);
  };

  const deleteOne = async (req, res) => {
    req.logger(`cameraTask.controller deleteOne api/cameras/:cameraId/tasks/${req.params.taskId}`);

    const deleted = await cameraTaskService.deleteOne({
      id: req.params.taskId,
      logger: req.logger,
    });

    res.status(204).send(deleted);
    req.logResp(req);
  };

  const createScreenshot = async (req, res) => {
    req.logger(`cameraTask.controller createScreenshot`);

    const task = await cameraTaskService.createScreenshot({
      userId: req.userId,
      cameraId: req.params.cameraId,
      worker: req.app.worker,
      logger: req.logger,
    });

    res.status(201).send(task);
    req.logResp(req);
  };

  const createScreenshotsByTime = async (req, res) => {
    req.logger(`cameraTask.controller createScreenshotsByTime`);

    const task = await cameraTaskService.createScreenshotsByTime({
      userId: req.userId,
      cameraId: req.params.cameraId,
      taskId: req.params.taskId,
      payload: req.body,
      worker: req.app.worker,
      logger: req.logger,
    });

    res.status(201).send(task);
    req.logResp(req);
  };

  return {
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne,
    createScreenshot,
    createScreenshotsByTime,
  };
};
