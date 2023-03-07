import { fileService } from '../services/index.js';

const getAll = async (req, res) => {
  req.reqLogger(`fileController.getAll`);

  const files = await fileService.getMany({
    logger: req.reqLogger,
    cameraId: req.cameraId,
    query: req.query,
  });

  res.status(200).send(files);
  req.resLogger(req);
};

const getCount = async (req, res) => {
  req.reqLogger(`fileController.getCount`);

  const count = await fileService.getCount({
    logger: req.reqLogger,
    cameraId: req.cameraId,
    query: req.query,
  });

  res.status(200).send(count);
  req.resLogger(req);
};

const getCountsByDates = async (req, res) => {
  req.reqLogger(`fileController.getCountsByDates`);

  const counts = await fileService.getCountsByDates({
    logger: req.reqLogger,
    cameraId: req.cameraId,
    query: req.query,
  });

  res.status(200).send(counts);
  req.resLogger(req);
};

const getOne = async (req, res) => {
  req.reqLogger(`fileController.getOne`);

  const file = await fileService.getOneById({
    fileId: req.params.fileId,
    logger: req.reqLogger,
  });

  res.status(200).send(file);
  req.resLogger(req);
};

const createOne = async (req, res) => {
  req.reqLogger('fileController.createOne');

  // TODO: check req.body take fields by schema!
  const payload = req.body;

  const file = await fileService.createFile({
    logger: req.reqLogger,
    user: req.userId,
    camera: req.cameraId,
    ...payload,
  });

  res.status(201).send(file);
  req.resLogger(req);
};

const updateOne = async (req, res) => {
  req.reqLogger('fileController.updateOne');

  // TODO: check req.body take fields by schema!
  const payload = req.body;

  const file = await fileService.updateOneById({
    logger: req.reqLogger,
    fileId: req.params.fileId,
    payload,
  });

  res.status(201).send(file);
  req.resLogger(req);
};

const deleteOne = async (req, res) => {
  req.reqLogger(`fileController.deleteOne`);

  const deleted = await fileService.deleteOneById({
    itemId: req.params.fileId,
    logger: req.reqLogger,
  });

  res.status(204).send(deleted);
  req.resLogger(req);
};

// const deleteMany = async (req, res) => {
//   req.reqLogger(`fileController.deleteMany`);

//   const itemsIds = []; // from query or body?

//   await fileService.deleteManyByIds({ itemsIds, logger: req.reqLogger });

//   res.status(204).send();
//   req.resLogger(req);
// };

export default { getAll, getCount, getCountsByDates, getOne, createOne, updateOne, deleteOne };
