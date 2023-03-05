import cameraService from '../services/camera.service.js';

// get

const getAll = async (req, res) => {
  req.reqLogger('cameraController.getAll');

  const cameras = await cameraService.getAll({
    logger: req.reqLogger,
    userId: req.userId,
    query: req.query,
  });

  res.status(200).send(cameras);
  req.resLogger(req);
};

const getOne = async (req, res) => {
  req.reqLogger(`cameraController.getOne`);

  const camera = await cameraService.getOne({
    logger: req.reqLogger,
    cameraId: req.cameraId,
    query: req.query,
  });

  res.status(200).send(camera);
  req.resLogger(req);
};

const getCameraStats = async (req, res) => {
  req.reqLogger(`cameraController.getCameraStats`);

  const camera = await cameraService.getCameraStats({
    logger: req.reqLogger,
    cameraId: req.cameraId,
    query: req.query,
  });

  res.status(200).send(camera);
  req.resLogger(req);
};

// create

const createOne = async (req, res) => {
  req.reqLogger('cameraController.createOne');

  // TODO: check req.body take fields by schema!
  const payload = req.body;

  const camera = await cameraService.createOne({
    logger: req.reqLogger,
    userId: req.userId,
    payload,
  });

  res.status(201).send(camera);
  req.resLogger(req);
};

// update

const updateOne = async (req, res) => {
  req.reqLogger(`cameraController.updateOne`);

  // TODO: check req.body take fields by schema!
  const payload = req.body;

  const updated = await cameraService.updateOneById({
    logger: req.reqLogger,
    cameraId: req.cameraId,
    userId: req.userId,
    payload,
  });

  res.status(201).send(updated);
  req.resLogger(req);
};

const deleteOne = async (req, res) => {
  req.reqLogger(`cameraController.deleteOne`);

  const deleted = await cameraService.deleteOneById({
    logger: req.reqLogger,
    cameraId: req.cameraId,
    userId: req.userId,
  });

  res.status(204).send(deleted);
  req.resLogger(req);
};

export default { getAll, getOne, getCameraStats, createOne, updateOne, deleteOne };
