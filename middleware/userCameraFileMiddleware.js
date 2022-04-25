import cameraFileService from '../services/cameraFile.service.js';

export default async (req, res, next) => {
  req.logger(`userCameraFileMiddleware fileName: ${req.params.fileName}`);

  try {
    const file = await cameraFileService.getOneByName({ fileName: req.params.fileName });
    // console.log(file);

    if (!file) {
      return res.sendStatus(404);
    }

    if (file.user.toString() !== req.userId) {
      return res.sendStatus(401);
    }

    next();
  } catch (error) {
    return res.sendStatus(500);
  }
};
