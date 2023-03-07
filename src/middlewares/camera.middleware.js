import cameraService from '../services/camera.service.js';

export default async (req, res, next) => {
  req.reqLogger(`cameraMiddleware cameraId: ${req.params.cameraId}`);

  try {
    const camera = await cameraService.getOneById({
      cameraId: req.params.cameraId,
      logger: req.reqLogger,
    });

    if (!camera) {
      res.sendStatus(404);
      req.resLogger(req);
      return;
    }

    if (camera.user.toString() !== req.userId) {
      res.sendStatus(401);
      req.resLogger(req);
      return;
    }

    req.cameraId = camera._id;
    next();
  } catch (error) {
    return res.sendStatus(500);
  }
};
