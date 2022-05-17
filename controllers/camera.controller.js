import cameraService from '../services/camera.service.js';

export default () => {
  const getAll = async (req, res) => {
    req.logger('cameraController GET /api/cameras/');

    const cameras = await cameraService.getAll({
      logger: req.logger,
      userId: req.userId,
    });

    res.status(200).send(cameras);
    req.logResp(req);
  };

  const getOne = async (req, res) => {
    req.logger(`cameraController.get /api/cameras/${req.params.cameraId}`);

    const camera = await cameraService.getOne({
      logger: req.logger,
      cameraId: req.params.cameraId,
    });

    res.status(200).send(camera);
    req.logResp(req);
  };

  const createOne = async (req, res) => {
    req.logger('cameraController.post /api/cameras');

    // TODO: check req.body take fields by schema!
    const payload = req.body;

    const camera = await cameraService.createOne({
      logger: req.logger,
      user: req.userId,
      ...payload,
    });

    res.status(201).send(camera);
    req.logResp(req);
  };

  const updateOne = async (req, res) => {
    req.logger(`cameraController.updateOne /api/cameras/${req.params.cameraId}`);

    // TODO: check req.body take fields by schema!
    const payload = req.body;

    const updated = await cameraService.updateOneById({
      logger: req.logger,
      cameraId: req.params.cameraId,
      payload,
    });

    res.status(201).send(updated);
    req.logResp(req);
  };

  const deleteOne = async (req, res) => {
    req.logger(`cameraController.deleteOne /api/cameras/${req.params.cameraId}`);

    const deleted = await cameraService.deleteOneById({
      logger: req.logger,
      cameraId: req.params.cameraId,
    });

    res.status(204).send(deleted);
    req.logResp(req);
  };

  return { getAll, getOne, createOne, updateOne, deleteOne };
};
