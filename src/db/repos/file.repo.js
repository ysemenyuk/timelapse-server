import _ from 'lodash';
import mongodb from 'mongodb';
import File from '../models/File.js';

const { ObjectId } = mongodb;

// create

const create = async (payload) => {
  const file = new File(payload);
  await file.save();
  return file;
};

// find

const find = async (filter, projection, options) => {
  const files = await File.find(filter, projection, options).sort({ _id: 1 });
  return files;
};

const findOne = async (filter, projection, options) => {
  const file = await File.findOne(filter, projection, options).populate('poster');
  return file;
};

const findOneById = async (id, projection, options) => {
  const file = await File.findOne({ _id: id }, projection, options);
  return file;
};

const countDocuments = async (filter) => {
  const total = await File.countDocuments(filter);
  return total;
};

const countsByDates = async (cameraId, query) => {
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
};

// update

const updateOneById = async (id, payload) => {
  const file = await File.findOneAndUpdate({ _id: id }, payload, { new: true });
  return file;
};

// delete

const deleteOneById = async (id) => {
  const deleted = await File.findOneAndRemove({ _id: id });
  return deleted;
};

const deleteMany = async (filter) => {
  const deletedFromDb = await File.deleteMany(filter);
  return deletedFromDb;
};

export default {
  create,
  find,
  findOne,
  findOneById,
  countDocuments,
  countsByDates,
  updateOneById,
  deleteOneById,
  deleteMany,
};
