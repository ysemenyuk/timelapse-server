import cameraFileService from '../services/cameraFile.service.js';

const getAll = async (req, res) => {
  req.logger(`cameraFileController.getAll api/cameras/:cameraId/files`);

  if (req.query.count) {
    const count = await cameraFileService.getCountByQuery({
      logger: req.logger,
      cameraId: req.cameraId,
      query: req.query,
    });

    res.status(200).send({ count });
    req.logResp(req);
    return;
  }

  const files = await cameraFileService.getManyByQuery({
    logger: req.logger,
    cameraId: req.cameraId,
    query: req.query,
  });

  res.status(200).send(files);
  req.logResp(req);
};

const getOne = async (req, res) => {
  req.logger(`cameraFileController.getOne api/cameras/:cameraId/files/:fileId`);

  const file = await cameraFileService.getOneById({
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

  const item = await cameraFileService.getOneById({
    fileId: req.params.fileId,
    logger: req.logger,
  });

  if (item.type === 'folder') {
    await cameraFileService.deleteFolder({ logger: req.logger, folder: item });
  } else {
    await cameraFileService.deleteFile({ logger: req.logger, file: item });
  }

  res.status(204).send();
  req.logResp(req);
};

const deleteMany = async (req, res) => {
  req.logger(`fileController.deleteMany api/cameras/:cameraId/files`);

  const filesIds = []; // from query or body?

  await cameraFileService.deleteManyByIds({ filesIds, logger: req.logger });

  res.status(204).send();
  req.logResp(req);
};

export default { getAll, getOne, createOne, deleteOne, deleteMany };
