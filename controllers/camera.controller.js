import cameraService from '../services/camera.service.js';

export default () => {
  const getAll = async (req, res) => {
    req.logger('cameraController GET /api/cameras/');

    const cameras = await cameraService.getAll({
      userId: req.userId,
      logger: req.logger,
    });

    res.status(200).send(cameras);
    req.logResp(req);
  };

  const getOne = async (req, res) => {
    req.logger(`cameraController.get /api/cameras/${req.params.cameraId}`);

    const camera = await cameraService.getOne({
      cameraId: req.params.cameraId,
      logger: req.logger,
    });

    res.status(200).send(camera);
    req.logResp(req);
  };

  const createOne = async (req, res) => {
    req.logger('cameraController.post /api/cameras');

    const camera = await cameraService.createOne({
      userId: req.userId,
      payload: req.body,
      logger: req.logger,
    });

    res.status(201).send(camera);
    req.logResp(req);
  };

  const updateOne = async (req, res) => {
    req.logger(`cameraController.updateOne /api/cameras/${req.params.cameraId}`);

    const updated = await cameraService.updateOne({
      cameraId: req.params.cameraId,
      payload: req.body,
      logger: req.logger,
    });

    res.status(201).send(updated);
    req.logResp(req);
  };

  const deleteOne = async (req, res) => {
    req.logger(`cameraController.deleteOne /api/cameras/${req.params.cameraId}`);

    const deleted = await cameraService.deleteOne({
      cameraId: req.params.cameraId,
      logger: req.logger,
    });

    res.status(204).send();
    req.logResp(req);
  };

  const createScreenshot = async (req, res) => {
    req.logger(`cameraController.createScreenshot req.params.cameraId: ${req.params.cameraId}`);

    const screenshot = await cameraService.createScreenshot({
      userId: req.userId,
      cameraId: req.params.cameraId,
      payload: req.body,
      storage: req.app.storage,
      logger: req.logger,
    });

    res.status(201).send(screenshot);
    req.logResp(req);
  };

  const createVideoFile = async (req, res) => {
    req.logger(`cameraController.createVideoFile req.params.cameraId: ${req.params.cameraId}`);

    const videoFile = await cameraService.createVideoFile({
      userId: req.userId,
      cameraId: req.params.cameraId,
      payload: req.body,
      storage: req.app.storage,
      logger: req.logger,
    });

    res.status(201).send(videoFile);
    req.logResp(req);
  };

  return { getAll, getOne, createOne, updateOne, deleteOne, createScreenshot, createVideoFile };
};
