import CameraFile from '../models/CameraFile.js';

const getAll = async ({ logger, cameraId, parentId }) => {
  logger && logger(`cameraFileService.getAll cameraId: ${cameraId} parentId: ${parentId}`);

  return await CameraFile.find({
    camera: cameraId,
    parent: parentId,
    // date: { $gte: new Date('2021-01-31T15:00:30'), $lt: new Date('2022-01-31T15:00:35') },
  });
};

const getOne = async ({ logger, ...payload }) => {
  logger && logger(`cameraFileService.getOne}`);

  return await CameraFile.findOne(payload);
};

const getOneById = async ({ logger, fileId }) => {
  logger && logger(`cameraFileService.getOneById fileId: ${fileId}`);

  return await CameraFile.findOne({ _id: fileId });
};

const getOneByName = async ({ logger, fileName }) => {
  logger && logger(`cameraFileService.getOneByName cameraFileName: ${fileName}`);

  return await CameraFile.findOne({ name: fileName });
};

const createOne = async ({ logger, ...payload }) => {
  logger && logger(`cameraFileService.createOne payload.name: ${payload.name}`);

  const file = new CameraFile({ ...payload });
  await file.save();

  return file;
};

const updateOneById = async ({ logger, fileId, payload }) => {
  logger && logger(`cameraFileService.updateOne fileId: ${fileId}, payload: ${payload}`);

  const updated = await CameraFile.updateOne({ _id: fileId }, payload);
  return updated;
};

const deleteOneById = async ({ logger, fileId }) => {
  logger && logger(`cameraFileService.deleteOne fileId: ${fileId}`);

  const deleted = await CameraFile.findOneAndDelete({ _id: fileId });
  return deleted;
};

const deleteCameraFiles = async ({ logger, cameraId }) => {
  logger && logger(`cameraFileService.deleteCameraFiles`);

  // console.log('ids', ids);

  const deleted = await CameraFile.deleteMany({ camera: cameraId });
  return deleted;
};

const deleteManyByIds = async ({ logger, filesIds }) => {
  logger && logger(`cameraFileService.deleteManyByIds`);

  // console.log('ids', ids);

  const deleted = await CameraFile.deleteMany({ _id: { $in: filesIds } });
  return deleted;
};

export default {
  getAll,
  getOne,
  getOneById,
  getOneByName,
  createOne,
  updateOneById,
  deleteOneById,
  deleteCameraFiles,
  deleteManyByIds,
};
