import cameraService from '../services/camera.service.js';

const getAll = async (req, res) => {
  req.logger('cameraController.getAll');

  const cameras = await cameraService.getAll({
    logger: req.logger,
    userId: req.userId,
  });

  res.status(200).send(cameras);
  req.logResp(req);
};

const getOne = async (req, res) => {
  req.logger(`cameraController.getOne`);

  const camera = await cameraService.getOneById({
    logger: req.logger,
    cameraId: req.cameraId,
  });

  res.status(200).send(camera);
  req.logResp(req);
};

const createOne = async (req, res) => {
  req.logger('cameraController.createOne');

  // TODO: check req.body take fields by schema!
  const payload = req.body;

  const camera = await cameraService.createOne({
    logger: req.logger,
    userId: req.userId,
    payload,
  });

  res.status(201).send(camera);
  req.logResp(req);
};

const updateOne = async (req, res) => {
  req.logger(`cameraController.updateOne`);

  // TODO: check req.body take fields by schema!
  const payload = req.body;

  const updated = await cameraService.updateOneById({
    logger: req.logger,
    cameraId: req.cameraId,
    payload,
  });

  res.status(201).send(updated);
  req.logResp(req);
};

const deleteOne = async (req, res) => {
  req.logger(`cameraController.deleteOne`);

  const deleted = await cameraService.deleteOneById({
    logger: req.logger,
    cameraId: req.cameraId,
  });

  res.status(204).send(deleted);
  req.logResp(req);
};

export default { getAll, getOne, createOne, updateOne, deleteOne };
