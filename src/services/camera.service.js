import mongodb from 'mongodb';
import Camera from '../db/models/Camera.js';
import fileService from './file.service.js';
import taskService from './task.service.js';

const { ObjectId } = mongodb;

// const defaultPopulateItems = [
//   'avatar',
//   'firstPhoto',
//   'lastPhoto',
//   'totalPhotos',
//   'firstVideo',
//   'lastVideo',
//   'totalVideos',
//   'photosByTimeTask',
// ];

const addFields = (fields) => {
  if (fields === 'stats') {
    return [
      {
        $lookup: {
          from: 'files',
          localField: '_id',
          foreignField: 'camera',
          pipeline: [{ $match: { type: 'video' } }],
          as: 'videos',
        },
      },
      {
        $addFields: {
          stats: {
            totalVideosSize: { $sum: '$videos.size' },
            totalVideos: { $size: '$videos' },
            firstVideo: { $first: '$videos' },
            lastVideo: { $last: '$videos' },
          },
        },
      },
      {
        $lookup: {
          from: 'files',
          localField: '_id',
          foreignField: 'camera',
          pipeline: [{ $match: { type: 'photo' } }],
          as: 'photos',
        },
      },
      {
        $addFields: {
          stats: {
            totalPhotosSize: { $sum: '$photos.size' },
            totalPhotos: { $size: '$photos' },
            firstPhoto: { $first: '$photos' },
            lastPhoto: { $last: '$photos' },
          },
        },
      },
      { $project: { videos: 0, photos: 0 } },
    ];
  }
  return [];
};

const populateFields = (fields) => {
  if (fields === 'avatar') {
    return [
      {
        $lookup: {
          from: 'files',
          localField: 'avatar',
          foreignField: '_id',
          as: 'avatars',
        },
      },
      {
        $addFields: {
          avatar: { $first: '$avatars' },
        },
      },
      { $project: { avatars: 0 } },
    ];
  }
  return [];
};

//
//
//

const getAll = async ({ userId, logger, query }) => {
  logger && logger(`cameraService.getAll`);

  const cameras = await Camera.aggregate([
    { $match: { user: ObjectId(userId) } },
    ...addFields(query.including),
    ...populateFields('avatar'),
  ]);
  // console.log('cameraService.getAll cameras', cameras);
  return cameras;
};

const getOne = async ({ logger, cameraId }) => {
  logger && logger(`cameraService.getOne`);

  const camera = await Camera.findOne({ _id: cameraId }).populate('avatar');
  // console.log('cameraService.getOne camera', camera);
  return camera;
};

const getOneById = async ({ logger, cameraId }) => {
  logger && logger(`cameraService.getOneById`);

  const camera = await Camera.findOne({ _id: cameraId });
  return camera;
};

//

const getCameraStats = async ({ logger, cameraId }) => {
  logger && logger(`cameraService.getCameraStats`);

  const [stats] = await Camera.aggregate([
    { $match: { _id: ObjectId(cameraId) } },
    ...addFields('stats'),
    { $project: { _id: 1, stats: 1 } },
  ]);
  // console.log('cameraService.getCameraStats stats', stats);
  return stats;
};

//
// create
//

const createOne = async ({ logger, userId, payload }) => {
  logger && logger(`cameraService.createOne`);

  const camera = new Camera({ user: userId, avatar: null, ...payload });
  // console.log('camera', camera);

  // create camera folders
  await fileService.createCameraFolder({
    logger,
    userId,
    cameraId: camera._id,
  });

  // create camera tasks
  await taskService.createCameraTasks({
    logger,
    userId,
    cameraId: camera._id,
  });

  await camera.save();

  const created = await Camera.findOne({ _id: camera._id });
  // console.log('cameraService.createOne created', created);
  return created;
};

//
// update
//

const updateOneById = async ({ logger, cameraId, payload }) => {
  logger && logger(`cameraService.updateOneById`);

  // TODO: validate payload

  await Camera.updateOne({ _id: cameraId }, payload);
  const updated = await Camera.findOne({ _id: cameraId }).populate('avatar');
  // console.log('cameraService.updateOneById updated', updated);
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

export default { getAll, getOne, getOneById, getCameraStats, createOne, updateOneById, deleteOneById };
