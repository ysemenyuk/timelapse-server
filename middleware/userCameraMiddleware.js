import cameraService from '../services/camera.service.js';

export default async (req, res, next) => {
  req.logger(`userCameraMiddleware cameraId: ${req.params.cameraId}`);

  // console.log('req.params', req.params, req.userId);

  try {
    const camera = await cameraService.getOneById({
      cameraId: req.params.cameraId,
      logger: req.logger,
    });

    if (!camera) {
      res.sendStatus(404);
      req.logResp(req);
      return;
    }

    if (camera.user.toString() !== req.userId) {
      res.sendStatus(401);
      req.logResp(req);
      return;
    }

    req.cameraId = camera._id;
    next();
  } catch (error) {
    return res.sendStatus(500);
  }
};
