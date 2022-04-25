import cameraFileService from '../services/cameraFile.service.js';

export default () => {
  const getAll = async (req, res) => {
    req.logger(`cameraFileController.getAll api/cameras/:cameraId/files?parent=${req.query.parentId}`);

    const files = await cameraFileService.getAll({
      cameraId: req.cameraId,
      parentId: req.query.parentId,
      logger: req.logger,
    });

    res.status(200).send(files);
    req.logResp(req);
  };

  const getOne = async (req, res) => {
    req.logger(`cameraFileController.getOne api/cameras/:cameraId/files/${req.params.fileId}`);

    const file = await cameraFileService.getOne({
      fileId: req.params.fileId,
      logger: req.logger,
    });

    res.status(200).send(file);
    req.logResp(req);
  };

  const createOne = async (req, res) => {
    req.logger('cameraFileController.createOne api/cameras/:cameraId/files');

    const file = await cameraFileService.createOne({
      userId: req.userId,
      cameraId: req.cameraId,
      ...req.body,
      logger: req.logger,
    });

    res.status(201).send(file);
    req.logResp(req);
  };

  const deleteOne = async (req, res) => {
    req.logger(`cameraFileController.deleteOne api/cameras/:cameraId/files/${req.params.fileId}`);

    const file = await cameraFileService.getOne({ fileId, logger });

    if (!file) {
      req.logger(`cameraFileController.deleteOne api/cameras/:cameraId/files/${req.params.fileId}  - not found`);
      throw new Error('file not found');
    }

    // TODO: delete file from storage

    const deleted = await cameraFileService.deleteOne({ fileId, logger });
    return deleted;
  };

  const deleteMany = async (req, res) => {
    logger(`fileController.deleteMany api/cameras/:cameraId/files`);

    // TODO: delete files from storage

    const filesIds = []; // from query or body?

    return await cameraFileService.deleteMany({ filesIds, logger });
  };

  return { getAll, getOne, createOne, deleteOne, deleteMany };
};
