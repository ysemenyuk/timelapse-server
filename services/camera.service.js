import Camera from '../models/Camera.js';
import cameraFileService from './cameraFile.service.js';
import cameraTaskService from './cameraTask.service.js';

const defaultPopulateItems = [
  'avatar',
  'firstPhoto',
  'lastPhoto',
  'totalPhotos',
  'firstVideo',
  'lastVideo',
  'totalVideos',
  'cameraFolder',
  'photosByHandFolder',
  'photosByTimeFolder',
  'videosByHandFolder',
  'videosByTimeFolder',
  'photosByTimeTask',
  'videosByTimeTask',
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

// create

const createOne = async ({ logger, userId, payload }) => {
  logger && logger(`cameraService.createOne`);

  const camera = new Camera({ user: userId, ...payload });
  await camera.save();

  // create default folders

  const defaultFolders = await cameraFileService.createDefaultFolders({
    logger,
    userId,
    cameraId: camera._id,
  });

  const { cameraFolder, photosByHandFolder, photosByTimeFolder, videosByHandFolder, videosByTimeFolder } =
    defaultFolders;

  // create defaul tasks

  const defaultTasks = await cameraTaskService.createDefaultTasks({
    logger,
    userId,
    cameraId: camera._id,
  });

  const { photosByTimeTask } = defaultTasks;

  await camera.updateOne({
    // default folders
    cameraFolder: cameraFolder._id,
    photosByHandFolder: photosByHandFolder._id,
    photosByTimeFolder: photosByTimeFolder._id,
    videosByHandFolder: videosByHandFolder._id,
    videosByTimeFolder: videosByTimeFolder._id,
    // default tasks
    photosByTimeTask: photosByTimeTask._id,
  });

  const createdCamera = await Camera.findOne({ _id: camera._id }).populate(defaultPopulateItems);
  return createdCamera;
};

//

const updateOneById = async ({ logger, cameraId, payload }) => {
  logger && logger(`cameraService.updateOne`);

  await Camera.updateOne({ _id: cameraId }, payload);
  const updated = await Camera.findOne({ _id: cameraId }).populate(defaultPopulateItems);
  return updated;
};

//

const deleteOneById = async ({ logger, cameraId }) => {
  logger && logger(`cameraService.deleteOne`);

  await cameraFileService.deleteCameraFiles({ cameraId, logger });
  await cameraTaskService.deleteCameraTasks({ cameraId, logger });

  const deleted = await Camera.findOneAndDelete({ _id: cameraId });
  return deleted;
};

export default { getAll, getOneById, createOne, updateOneById, deleteOneById };
