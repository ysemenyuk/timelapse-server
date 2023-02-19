import Camera from '../models/Camera.js';
import fileService from './file.service.js';
import taskService from './task.service.js';

const defaultPopulateItems = [
  'avatar',
  'firstPhoto',
  'lastPhoto',
  'totalPhotos',
  'firstVideo',
  'lastVideo',
  'totalVideos',
  'photosByTimeTask',
];

const getAll = async ({ userId, logger, populateItems = defaultPopulateItems }) => {
  logger && logger(`cameraService.getAll`);

  const cameras = await Camera.find({ user: userId }).populate(populateItems);
  return cameras;
};

const getOneById = async ({ logger, cameraId, populateItems = defaultPopulateItems }) => {
  logger && logger(`cameraService.getOneById`);

  const camera = await Camera.findOne({ _id: cameraId }).populate(populateItems);
  return camera;
};

//
// create
//

const createOne = async ({ logger, userId, payload }) => {
  logger && logger(`cameraService.createOne`);

  const camera = new Camera({ user: userId, avatar: null, ...payload });
  // console.log('camera', camera);

  // create default folders
  await fileService.createCameraDefaultFiles({
    logger,
    userId,
    cameraId: camera._id,
  });

  // create defaul tasks
  await taskService.createCameraDefaultTasks({
    logger,
    userId,
    cameraId: camera._id,
  });

  await camera.save();

  const createdCamera = await Camera.findOne({ _id: camera._id }).populate(defaultPopulateItems);
  return createdCamera;
};

//
// update
//

const updateOneById = async ({ logger, cameraId, payload }) => {
  logger && logger(`cameraService.updateOne`);

  // TODO: validate payload

  await Camera.updateOne({ _id: cameraId }, payload);
  const updated = await Camera.findOne({ _id: cameraId }).populate(defaultPopulateItems);
  return updated;
};

//
// delete
//

const deleteOneById = async ({ logger, userId, cameraId }) => {
  logger && logger(`cameraService.deleteOne`);

  await fileService.deleteCameraFiles({ userId, cameraId, logger });
  await taskService.deleteCameraTasks({ userId, cameraId, logger });

  const deleted = await Camera.findOneAndDelete({ _id: cameraId });
  return deleted;
};

export default { getAll, getOneById, createOne, updateOneById, deleteOneById };
