import fileService from '../services/file.service.js';

const getAll = async (req, res) => {
  req.logger(`fileController.getAll`);

  const files = await fileService.getManyByQuery({
    logger: req.logger,
    cameraId: req.cameraId,
    query: req.query,
  });

  res.status(200).send(files);
  req.logResp(req);
};

const getCount = async (req, res) => {
  req.logger(`fileController.getCount`);

  const count = await fileService.getCountByQuery({
    logger: req.logger,
    cameraId: req.cameraId,
    query: req.query,
  });

  res.status(200).send({ count });
  req.logResp(req);
};

const getOne = async (req, res) => {
  req.logger(`fileController.getOne`);

  const file = await fileService.getOneById({
    fileId: req.params.fileId,
    logger: req.logger,
  });

  res.status(200).send(file);
  req.logResp(req);
};

const createOne = async (req, res) => {
  req.logger('fileController.createOne');

  // console.log(777, req.body);

  // TODO: check req.body take fields by schema!
  const payload = req.body;

  const file = await fileService.createFile({
    logger: req.logger,
    user: req.userId,
    camera: req.cameraId,
    ...payload,
  });

  res.status(201).send(file);
  req.logResp(req);
};

const updateOne = async (req, res) => {
  req.logger('fileController.updateOne');

  // TODO: check req.body take fields by schema!
  const payload = req.body;

  const file = await fileService.updateOneById({
    logger: req.logger,
    fileId: req.params.fileId,
    payload,
  });

  res.status(201).send(file);
  req.logResp(req);
};

const deleteOne = async (req, res) => {
  req.logger(`fileController.deleteOne`);

  const deleted = await fileService.deleteOneById({
    itemId: req.params.fileId,
    logger: req.logger,
  });

  res.status(204).send(deleted);
  req.logResp(req);
};

// const deleteMany = async (req, res) => {
//   req.logger(`fileController.deleteMany`);

//   const itemsIds = []; // from query or body?

//   await fileService.deleteManyByIds({ itemsIds, logger: req.logger });

//   res.status(204).send();
//   req.logResp(req);
// };

export default { getAll, getCount, getOne, createOne, updateOne, deleteOne };
