import _ from 'lodash';
import mongodb from 'mongodb';
import File from '../models/File.js';

const { ObjectId } = mongodb;

export default class FileRepository {
  async create(payload) {
    const file = new File(payload);
    await file.save();
    return file;
  }

  async find(filter, projection, options) {
    const files = await File.find(filter, projection, options).sort({ _id: 1 });
    return files;
  }

  async findOne(filter, projection, options) {
    const file = await File.findOne(filter, projection, options).populate('poster');
    return file;
  }

  async findOneById(id, projection, options) {
    const file = await File.findOne({ _id: id }, projection, options);
    return file;
  }

  async updateOneById(id, payload) {
    const file = await File.findOneAndUpdate({ _id: id }, payload, { new: true });
    return file;
  }

  async deleteOneById(id) {
    const deleted = await File.findOneAndRemove({ _id: id });
    return deleted;
  }

  async deleteMany(filter) {
    const deleted = await File.deleteMany(filter);
    return deleted;
  }

  //

  async countDocuments(filter) {
    const total = await File.countDocuments(filter);
    return total;
  }

  async countsByDates(cameraId, query) {
    const match = _.pickBy(
      {
        camera: ObjectId(cameraId),
        type: query.type || 'photo',
      },
      _.identity
    );

    const counts = await File.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$dateString',
          files: { $count: {} },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return counts;
  }
}
