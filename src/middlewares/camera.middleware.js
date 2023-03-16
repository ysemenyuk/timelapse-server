export default (cameraService) => async (req, res, next) => {
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
