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

const createOne = async ({ userId, payload, logger, populateItems = defaultPopulateItems }) => {
  logger && logger(`cameraService.createOne payload.name: ${payload.name}`);

  const { name, description, screenshotLink } = payload;

  const camera = new Camera({
    user: userId,
    name,
    description,
    screenshotLink,
  });

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

  // TODO: create default tasks!

  await camera.updateOne({
    mainFolder: mainFolder._id,
    screenshotsFolder: screenshotsFolder._id,
    screenshotsByTimeFolder: screenshotsByTimeFolder._id,
    videosFolder: videosFolder._id,
    videosByTimeFolder: videosByTimeFolder._id,
    screenshotsByTimeTask: null,
    videosByTimeTask: null,
  });

  const created = await Camera.findOne({ _id: camera._id }).populate(populateItems);
  return created;
};

const updateOne = async ({ logger, cameraId, payload, populateItems = defaultPopulateItems }) => {
  logger && logger(`cameraService.updateOne cameraId: ${cameraId}, payload: ${payload}`);

  await Camera.updateOne({ _id: cameraId }, payload);

  const updated = await Camera.findOne({ _id: cameraId }).populate(populateItems);
  return updated;
};

const deleteOne = async ({ cameraId, logger }) => {
  logger && logger(`cameraService.deleteOne cameraId: ${cameraId}`);

  // TODO: delete camera folders and files on disk

  await cameraFileService.deleteCameraFiles({ cameraId, logger });
  await cameraTaskService.deleteCameraTasks({ cameraId, logger });

  const camera = await Camera.findOne({ _id: cameraId });
  const deleted = await camera.remove();

  return deleted;
};

export default { getAll, getOne, getOneById, createOne, updateOne, deleteOne };
