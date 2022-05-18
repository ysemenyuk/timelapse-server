import cameraFileService from '../services/cameraFile.service.js';

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

  // TODO: check req.body take fields by schema!
  const payload = req.body;

  const file = await cameraFileService.createOne({
    logger: req.logger,
    user: req.userId,
    camera: req.cameraId,
    ...payload,
  });

  res.status(201).send(file);
  req.logResp(req);
};

const deleteOne = async (req, res) => {
  req.logger(`cameraFileController.deleteOne api/cameras/:cameraId/files/${req.params.fileId}`);

  throw new Error('1111111111');

  // const deleted = await cameraFileService.deleteOneById({ fileId: req.params.fileId, logger: req.logger });

  // res.status(204).send(deleted);
  // req.logResp(req);
};

const deleteMany = async (req, res) => {
  req.logger(`fileController.deleteMany api/cameras/:cameraId/files`);

  const filesIds = []; // from query or body?

  const deleted = await cameraFileService.deleteManyByIds({ filesIds, logger: req.logger });

  res.status(204).send(deleted);
  req.logResp(req);
};

export default { getAll, getOne, createOne, deleteOne, deleteMany };
