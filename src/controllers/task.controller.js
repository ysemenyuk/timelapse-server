// import taskService from '../services/task.service.js';

export default class TaskController {
  constructor(taskService) {
    this.taskService = taskService;
  }

  //

  async getAll(req, res) {
    req.reqLogger('cameraTask.controller getAll');

    const tasks = await this.taskService.getAll({
      logger: req.reqLogger,
      cameraId: req.cameraId,
    });

    res.status(200).send(tasks);
    req.resLogger(req);
  }

  async getOne(req, res) {
    req.reqLogger(`cameraTask.controller getOne`);

    const task = await this.taskService.getOneById({
      logger: req.reqLogger,
      taskId: req.params.taskId,
    });

    res.status(200).send(task);
    req.resLogger(req);
  }

  //

  async createOne(req, res) {
    req.reqLogger(`cameraTask.controller createOne`);

    // TODO: check req.body take fields by schema!
    const payload = req.body;

    const task = await this.taskService.createOne({
      logger: req.reqLogger,
      userId: req.userId,
      cameraId: req.cameraId,
      payload,
    });

    res.status(201).send(task);
    req.resLogger(req);
  }

  //

  async updateOne(req, res) {
    req.reqLogger(`cameraTask.controller updateOne`);

    // TODO: check req.body take fields by schema!
    const payload = req.body;

    const updated = await this.taskService.updateOneById({
      logger: req.reqLogger,
      taskId: req.params.taskId,
      payload,
    });

    res.status(201).send(updated);
    req.resLogger(req);
  }

  //

  async deleteOne(req, res) {
    req.reqLogger(`cameraTask.controller deleteOne`);

    const deleted = await this.taskService.deleteOneById({
      logger: req.reqLogger,
      taskId: req.params.taskId,
    });

    res.status(204).send(deleted);
    req.resLogger(req);
  }
}
