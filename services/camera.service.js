import Camera from '../models/Camera.js';
import cameraFileService from './cameraFile.service.js';
import cameraTaskService from './cameraTask.service.js';
import * as constants from '../utils/constants.js';

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

const createOne = async ({ logger, user, ...payload }) => {
  logger && logger(`cameraService.createOne payload.name: ${payload.name}`);

  const camera = new Camera({ user, ...payload });
  await camera.save();

  // create default folders

  const mainFolder = await cameraFileService.createFolder({
    logger,
    user,
    camera: camera._id,
    parent: null,
    path: [],
    type: constants.FOLDER,
    removable: false,
    name: camera._id.toString(),
  });

  const foldersPayload = {
    logger,
    user,
    camera: camera._id,
    parent: mainFolder._id,
    path: [mainFolder.name],
    type: constants.FOLDER,
    removable: false,
  };

  const screenshotsFolder = await cameraFileService.createFolder({
    ...foldersPayload,
    name: constants.SCREENSHOTS,
  });

  const screenshotsByTimeFolder = await cameraFileService.createFolder({
    ...foldersPayload,
    name: constants.SCREENSHOTS_BY_TIME,
  });

  const videosFolder = await cameraFileService.createFolder({
    ...foldersPayload,
    name: constants.VIDEOS,
  });

  const videosByTimeFolder = await cameraFileService.createFolder({
    ...foldersPayload,
    name: constants.VIDEOS_BY_TIME,
  });

  // create defaul task (tasksBytime)

  const screenshotsByTimeTask = await cameraTaskService.createOne({
    logger,
    user,
    cameraId: camera._id,
    type: 'screenshotsByTime',
    screenshotsByTimeTotalFiles: 0,
    screenshotsByTimeSettings: {
      startTime: '08:00',
      stopTime: '20:00',
      interval: 60,
    },
  });

  const videosByTimeTask = await cameraTaskService.createOne({
    logger,
    user,
    cameraId: camera._id,
    type: 'videosByTime',
    videosByTimeTotalFiles: 0,
    screenshotsByTimeSettings: {
      startTime: '08:00',
      length: 60,
    },
  });

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

  const camera = await Camera.findOne({ _id: cameraId });
  const deleted = await camera.remove();

  // console.log(1111111111111, deleted);

  return deleted;
};

export default { getAll, getOne, getOneById, createOne, updateOneById, deleteOneById };
