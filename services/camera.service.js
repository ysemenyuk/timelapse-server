import fs from "fs";
import path from "path";
const fsp = fs.promises;
import moment from 'moment';
import { makeFileName, promisifyUploadStream } from '../utils/index.js';
import cameraFileService from './cameraFile.service.js';
import cameraApiService from './cameraApi.service.js';
import cameraTaskService from './cameraTask.service.js';
import Camera from '../models/Camera.js';
import * as constants from '../utils/constants.js';

const populateItems = ['avatar', 'mainFolder', 'screenshotsFolder', 'screenshotsByTimeFolder', 'imagesByTimeTask'];

const getAll = async ({ userId, logger }) => {
  logger(`cameraService.getAll userId: ${userId}`);

  const cameras = await Camera.find({ user: userId }).populate(populateItems);
  return cameras;
};

const getOne = async ({ cameraId, logger }) => {
  logger(`cameraService.getOne cameraId: ${cameraId}`);

  const camera = await Camera.findOne({ _id: cameraId }).populate(populateItems);
  return camera;
};

const getOneById = async ({ cameraId, logger }) => {
  logger(`cameraService.getOneById cameraId: ${cameraId}`);

  const camera = await Camera.findOne({ _id: cameraId }).populate(populateItems);
  return camera;
};

const createOne = async ({ userId, payload, logger }) => {
  logger(`cameraService.createOne payload.name: ${payload.name}`);

  const { name, description, screenshotLink } = payload;

  const camera = new Camera({
    user: userId,
    name,
    description,
    screenshotLink,
  });

  await camera.save();

  // TODO: create default folders for camera

  const mainFolder = await cameraFileService.createOne({
    name: constants.MAIN,
    user: userId,
    camera: camera._id,
    parent: null,
    path: path.join(camera._id.toString()),
    type: constants.FOLDER,
    logger,
  });

  const foldersPayload = {
    user: userId,
    camera: camera._id,
    parent: mainFolder._id,
    path: path.join(camera._id.toString(), mainFolder.name),
    type: constants.FOLDER,
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

  // TODO: create default tasks

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

const createScreenshot = async ({ userId, cameraId, payload, storage, logger }) => {
  logger(`cameraService.createScreenshot payload: ${payload}`);

  const { parentId } = payload;

  const camera = await Camera.findOne({ _id: cameraId });
  const parent = await cameraFileService.getOneById({ fileId: parentId, logger });

  // TODO: check folder if not exist create

  const filePath = [camera._id.toString(), parent.name]

  const date = new Date();
  const fileName = makeFileName(date);
  
  // const date = moment().format()
  // const fileName = `${date}.jpg`;
  // console.log(111, date, date.toString())

  const dataStream = await cameraApiService.getScreenshot(camera.screenshotLink, 'stream');
  const uploadStream = storage.openUploadStream({ filePath, fileName, logger });

  dataStream.pipe(uploadStream);

  await promisifyUploadStream(uploadStream);

  // const file = await storage.writeFile({ filePath, fileName, logger, data });
  // console.log(2222, file)

  // console.log('date', date, date.toLocaleString());
  // console.log('date', date, date.toISOString());

  const screenshot = await cameraFileService.createOne({
    name: fileName,
    date: date,
    user: userId,
    camera: cameraId,
    parent: parentId,
    path: filePath,
    storage: storage.type,
    type: constants.SCREENSHOT,
    logger,
  });

  console.log(33333, 'screenshot', screenshot);

  return screenshot;
};

const updateOne = async ({ cameraId, payload, logger }) => {
  logger(`cameraService.updateOne cameraId: ${cameraId}, payload: ${payload}`);

  const updated = await Camera.updateOne({ _id: cameraId }, payload);
  return updated;
};

const deleteOne = async ({ cameraId, logger }) => {
  logger(`cameraService.deleteOne cameraId: ${cameraId}`);

  // TODO: delete all camera folders, files, tasks

  const deletefFiles = await cameraFileService.deleteCameraFiles({ cameraId, logger });
  console.log(1112, deletefFiles);

  const deletefTasks = await cameraTaskService.deleteCameraTasks({ cameraId, logger });
  console.log(1113, deletefTasks);

  const camera = await Camera.findOne({ _id: cameraId });
  const deleted = await camera.remove();
  console.log(1114, deleted);

  return deleted;
};

export default { getAll, getOne, getOneById, createOne, createScreenshot, updateOne, deleteOne };
