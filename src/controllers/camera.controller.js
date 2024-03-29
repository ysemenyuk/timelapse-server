export default class CameraController {
  constructor(cameraService) {
    this.cameraService = cameraService;
  }

  // get

  async getMany(req, res) {
    req.reqLogger('cameraController.getMany');

    const cameras = await this.cameraService.getMany({
      logger: req.reqLogger,
      userId: req.userId,
      query: req.query,
    });

    res.status(200).send(cameras);
    req.resLogger(req);
  }

  async getOne(req, res) {
    req.reqLogger(`cameraController.getOne`);

    const camera = await this.cameraService.getOne({
      logger: req.reqLogger,
      cameraId: req.cameraId,
      query: req.query,
    });

    res.status(200).send(camera);
    req.resLogger(req);
  }

  async getCameraStats(req, res) {
    req.reqLogger(`cameraController.getCameraStats`);

    const camera = await this.cameraService.getCameraStats({
      logger: req.reqLogger,
      cameraId: req.cameraId,
      query: req.query,
    });

    res.status(200).send(camera);
    req.resLogger(req);
  }

  // create

  async createOne(req, res) {
    req.reqLogger('cameraController.createOne');

    // TODO: check req.body take fields by schema!
    const payload = req.body;

    const camera = await this.cameraService.createOne({
      logger: req.reqLogger,
      userId: req.userId,
      payload,
    });

    res.status(201).send(camera);
    req.resLogger(req);
  }

  // update

  async updateOne(req, res) {
    req.reqLogger(`cameraController.updateOne`);

    // TODO: check req.body take fields by schema!
    const payload = req.body;

    const updated = await this.cameraService.updateOneById({
      logger: req.reqLogger,
      cameraId: req.cameraId,
      userId: req.userId,
      payload,
    });

    res.status(201).send(updated);
    req.resLogger(req);
  }

  async deleteOne(req, res) {
    req.reqLogger(`cameraController.deleteOne`);

    const deleted = await this.cameraService.deleteOneById({
      logger: req.reqLogger,
      cameraId: req.cameraId,
      userId: req.userId,
    });

    res.status(204).send(deleted);
    req.resLogger(req);
  }
}
