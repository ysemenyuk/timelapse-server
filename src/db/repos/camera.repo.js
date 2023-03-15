import mongodb from 'mongodb';
import Camera from '../models/Camera.js';

const { ObjectId } = mongodb;

const addStats = () => {
  return [
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
          totalPhotosSize: { $sum: '$photos.size' },
          totalPhotos: { $size: '$photos' },
          firstPhoto: { $first: '$photos' },
          lastPhoto: { $last: '$photos' },
          totalVideosSize: { $sum: '$videos.size' },
          totalVideos: { $size: '$videos' },
          firstVideo: { $first: '$videos' },
          lastVideo: { $last: '$videos' },
        },
      },
    },
  ];
};

const populateAvatar = () => {
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
  ];
};

//
//
//

export default class CameraRepository {
  async create(payload) {
    const camera = new Camera(payload);
    await camera.save();
    return camera;
  }

  async find(userId, query) {
    console.log('CameraRepository.find', query);

    const cameras = await Camera.aggregate([
      { $match: { user: ObjectId(userId) } },
      ...addStats(),
      ...populateAvatar(),
      { $project: { videos: 0, photos: 0, avatars: 0 } },
    ]);
    return cameras;
  }

  async findOne(filter) {
    const camera = await Camera.findOne(filter).populate('avatar');
    return camera;
  }

  async findOneById(id) {
    const camera = await Camera.findOne({ _id: id });
    return camera;
  }

  async updateOneById(id, payload) {
    const camera = await Camera.findOneAndUpdate({ _id: id }, payload, { new: true }).populate('avatar');
    return camera;
  }

  async deleteOneById(id) {
    const deleted = await Camera.findOneAndRemove({ _id: id });
    return deleted;
  }

  //

  async getStats(cameraId) {
    const [stats] = await Camera.aggregate([
      { $match: { _id: ObjectId(cameraId) } },
      ...addStats(),
      { $project: { _id: 1, stats: 1 } },
    ]);
    return stats;
  }
}
