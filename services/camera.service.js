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
  'cameraFolder',
  'photosFolder',
  'videosFolder',
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

  const camera = new Camera({ user: userId, ...payload });
  await camera.save();

  // create default folders

  const defaultFolders = await fileService.createDefaultCameraFolders({
    logger,
    userId,
    cameraId: camera._id,
  });

  const { cameraFolder, photosFolder, videosFolder } = defaultFolders;

  // create defaul tasks

  const defaultTasks = await taskService.createDefaultCameraTasks({
    logger,
    userId,
    cameraId: camera._id,
  });

  const { photosByTimeTask } = defaultTasks;

  await camera.updateOne({
    // default folders
    cameraFolder: cameraFolder._id,
    photosFolder: photosFolder._id,
    videosFolder: videosFolder._id,
    // default tasks
    photosByTimeTask: photosByTimeTask._id,
  });

  const createdCamera = await Camera.findOne({ _id: camera._id }).populate(defaultPopulateItems);
  return createdCamera;
};

//
// update
//

const updateOneById = async ({ logger, cameraId, payload }) => {
  logger && logger(`cameraService.updateOne`);

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
