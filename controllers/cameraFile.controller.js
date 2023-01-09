import cameraFileService from '../services/cameraFile.service.js';

const getAll = async (req, res) => {
  req.logger(`cameraFileController.getAll`);

  const files = await cameraFileService.getManyByQuery({
    logger: req.logger,
    cameraId: req.cameraId,
    query: req.query,
  });

  res.status(200).send(files);
  req.logResp(req);
};

const getCount = async (req, res) => {
  req.logger(`cameraFileController.getCount`);

  const count = await cameraFileService.getCountByQuery({
    logger: req.logger,
    cameraId: req.cameraId,
    query: req.query,
  });

  res.status(200).send({ count });
  req.logResp(req);
};

const getOne = async (req, res) => {
  req.logger(`cameraFileController.getOne`);

  const file = await cameraFileService.getOneById({
    fileId: req.params.fileId,
    logger: req.logger,
  });

  res.status(200).send(file);
  req.logResp(req);
};

const createOne = async (req, res) => {
  req.logger('cameraFileController.createOne');

  console.log(777, req.body);

  // TODO: check req.body take fields by schema!
  const payload = req.body;

  const file = await cameraFileService.createFile({
    logger: req.logger,
    user: req.userId,
    camera: req.cameraId,
    payload,
  });

  res.status(201).send(file);
  req.logResp(req);
};

const updateOne = async (req, res) => {
  req.logger('cameraFileController.updateOne');

  // TODO: check req.body take fields by schema!
  const payload = req.body;

  const file = await cameraFileService.updateOneById({
    logger: req.logger,
    fileId: req.params.fileId,
    payload,
  });

  res.status(201).send(file);
  req.logResp(req);
};

const deleteOne = async (req, res) => {
  req.logger(`cameraFileController.deleteOne`);

  const deleted = await cameraFileService.deleteOneById({
    fileId: req.params.fileId,
    logger: req.logger,
  });

  res.status(204).send(deleted);
  req.logResp(req);
};

const deleteMany = async (req, res) => {
  req.logger(`fileController.deleteMany`);

  const filesIds = []; // from query or body?

  await cameraFileService.deleteManyByIds({ filesIds, logger: req.logger });

  res.status(204).send();
  req.logResp(req);
};

export default { getAll, getCount, getOne, createOne, updateOne, deleteOne, deleteMany };
