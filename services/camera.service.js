import Camera from '../models/Camera.js';
import cameraFileService from './cameraFile.service.js';
import storageService from './storage.service.js';
import cameraTaskService from './cameraTask.service.js';
import * as constants from '../utils/constants.js';

const defaultPopulateItems = [
  'avatar',
  'mainFolder',
  'screenshotsFolder',
  'screenshotsByTimeFolder',
  // 'screenshotsByTimeTask',
  'videosFolder',
  'videosByTimeFolder',
  // 'videosByTimeTask',
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

const createOne = async ({ logger, ...payload }) => {
  logger && logger(`cameraService.createOne payload.name: ${payload.name}`);

  const camera = new Camera({ ...payload });
  await camera.save();

  // create default folders in db

  const mainFolder = await cameraFileService.createOne({
    name: camera._id.toString(),
    user: userId,
    camera: camera._id,
    parent: null,
    path: [],
    type: constants.FOLDER,
    removable: false,
    logger,
  });

  const foldersPayload = {
    user: userId,
    camera: camera._id,
    parent: mainFolder._id,
    path: [mainFolder.name],
    type: constants.FOLDER,
    removable: false,
    logger,
  };

  const screenshotsFolder = await cameraFileService.createOne({
    name: constants.SCREENSHOTS,
    ...foldersPayload,
  });

  const screenshotsByTimeFolder = await cameraFileService.createOne({
    name: constants.SCREENSHOTS_BY_TIME,
    ...foldersPayload,
  });

  const videosFolder = await cameraFileService.createOne({
    name: constants.VIDEOS,
    ...foldersPayload,
  });

  const videosByTimeFolder = await cameraFileService.createOne({
    name: constants.VIDEOS_BY_TIME,
    ...foldersPayload,
  });

  // create default folders on disk

  await storageService.createFolder({
    logger,
    folderPath: mainFolder.path,
    folderName: mainFolder.name,
  });

  await storageService.createFolder({
    logger,
    folderPath: screenshotsFolder.path,
    folderName: screenshotsFolder.name,
  });

  await storageService.createFolder({
    logger,
    folderPath: screenshotsByTimeFolder.path,
    folderName: screenshotsByTimeFolder.name,
  });

  await storageService.createFolder({
    logger,
    folderPath: videosFolder.path,
    folderName: videosFolder.name,
  });

  await storageService.createFolder({
    logger,
    folderPath: videosByTimeFolder.path,
    folderName: videosByTimeFolder.name,
  });

  // create defaul task (tasksBytime)

  const screenshotsByTimeTask = await cameraTaskService.createOne({
    logger,
    userId,
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
    userId,
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

  // TODO: delete camera folders and files on disk

  await cameraFileService.deleteCameraFiles({ cameraId, logger });
  await cameraTaskService.deleteCameraTasks({ cameraId, logger });

  const camera = await Camera.findOne({ _id: cameraId });
  const deleted = await camera.remove();

  return deleted;
};

export default { getAll, getOne, getOneById, createOne, updateOneById, deleteOneById };
