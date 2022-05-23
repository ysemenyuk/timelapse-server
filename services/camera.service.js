import Camera from '../models/Camera.js';
import cameraFileService from './cameraFile.service.js';
import cameraTaskService from './cameraTask.service.js';
// import * as constants from '../utils/constants.js';

const defaultPopulateItems = [
  'avatar',
  'mainFolder',
  'screenshotsFolder',
  'screenshotsByTimeFolder',
  'screenshotsByTimeTask',
  'videosFolder',
  'videosByTimeFolder',
  'videosByTimeTask',
];

const getAll = async ({ userId, logger, populateItems = defaultPopulateItems }) => {
  logger && logger(`cameraService.getAll userId: ${userId}`);

  const cameras = await Camera.find({ user: userId }).populate(populateItems);
  return cameras;
};

const getOne = async ({ cameraId, logger, populateItems = defaultPopulateItems }) => {
  logger && logger(`cameraService.getOne cameraId: ${cameraId}`);

  const camera = await Camera.findOne({ _id: cameraId }).populate(populateItems);
  return camera;
};

const getOneById = async ({ logger, cameraId, populateItems = defaultPopulateItems }) => {
  logger && logger(`cameraService.getOneById cameraId: ${cameraId}`);

  const camera = await Camera.findOne({ _id: cameraId }).populate(populateItems);
  return camera;
};

const createOne = async ({ logger, userId, ...payload }) => {
  logger && logger(`cameraService.createOne payload.name: ${payload.name}`);

  const camera = new Camera({ user: userId, ...payload });
  await camera.save();

  // create default folders

  const defaultFolders = await cameraFileService.createDefaultFolders({
    logger,
    userId,
    cameraId: camera._id,
  });

  const { mainFolder, screenshotsFolder, screenshotsByTimeFolder, videosFolder, videosByTimeFolder } = defaultFolders;

  // create defaul task (tasksBytime)
  
  const defaultTasks = await cameraTaskService.createDefaultTasks({
    logger,
    userId,
    cameraId: camera._id,
  });

  const { screenshotsByTimeTask, videosByTimeTask } = defaultTasks;

  await camera.updateOne({
    mainFolder: mainFolder._id,
    screenshotsFolder: screenshotsFolder._id,
    screenshotsByTimeFolder: screenshotsByTimeFolder._id,
    videosFolder: videosFolder._id,
    videosByTimeFolder: videosByTimeFolder._id,
    screenshotsByTimeTask: screenshotsByTimeTask._id,
    videosByTimeTask: videosByTimeTask._id,
  });

  const createdCamera = await Camera.findOne({ _id: camera._id }).populate(defaultPopulateItems);
  return createdCamera;
};

const updateOneById = async ({ logger, cameraId, payload }) => {
  logger && logger(`cameraService.updateOne cameraId: ${cameraId}`);

  await Camera.updateOne({ _id: cameraId }, payload);

  const updated = await Camera.findOne({ _id: cameraId }).populate(defaultPopulateItems);
  return updated;
};

const deleteOneById = async ({ logger, cameraId }) => {
  logger && logger(`cameraService.deleteOne cameraId: ${cameraId}`);

  await cameraFileService.deleteCameraFiles({ cameraId, logger });
  await cameraTaskService.deleteCameraTasks({ cameraId, logger });

  const deleted = await Camera.findOneAndDelete({ _id: cameraId });
  return deleted;
};

export default { getAll, getOne, getOneById, createOne, updateOneById, deleteOneById };
