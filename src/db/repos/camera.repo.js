import mongodb from 'mongodb';
import Camera from '../models/Camera.js';

const { ObjectId } = mongodb;

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

//
// create
//

const create = async (payload) => {
  const camera = new Camera(payload);
  await camera.save();
  return camera;
};

//
// find
//

const find = async (userId, query) => {
  const cameras = await Camera.aggregate([
    { $match: { user: ObjectId(userId) } },
    ...addFields(query.including),
    ...populateFields('avatar'),
  ]);

  return cameras;
};

const findOne = async (filter) => {
  const camera = await Camera.findOne(filter).populate('avatar');
  return camera;
};

const findOneById = async (id) => {
  const camera = await Camera.findOne({ _id: id });
  return camera;
};

const getStats = async (cameraId) => {
  const [stats] = await Camera.aggregate([
    { $match: { _id: ObjectId(cameraId) } },
    ...addFields('stats'),
    { $project: { _id: 1, stats: 1 } },
  ]);

  return stats;
};

//
// update
//

const updateOneById = async (id, payload) => {
  const camera = await Camera.findOneAndUpdate({ _id: id }, payload, { new: true }).populate('avatar');
  return camera;
};

//
// delete
//

const deleteOneById = async (id) => {
  const deleted = await Camera.findOneAndRemove({ _id: id });
  return deleted;
};

export default {
  create,
  find,
  findOne,
  findOneById,
  getStats,
  updateOneById,
  deleteOneById,
};
