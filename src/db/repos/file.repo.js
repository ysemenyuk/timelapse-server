import _ from 'lodash';
import mongodb from 'mongodb';
import { addHours } from 'date-fns';
import File from '../models/File.js';

const { ObjectId } = mongodb;

//

const getGteDateTime = (date) => new Date(`${date} 00:00:00`);
const getLteDateTime = (date) => addHours(new Date(`${date} 00:00:00`), 24);

const makeFilter = (where) => {
  const { cameraId, type, date, date_gte, date_lte, time_gte, time_lte } = where;
  // console.log(1111, 'query', query);

  const createType = where.createType && where.createType.split(',');

  let dateRange;

  if (date) {
    dateRange = { $gte: getGteDateTime(date), $lte: getLteDateTime(date) };
  }

  if (date_gte && date_lte) {
    dateRange = {
      $gte: getGteDateTime(date_gte),
      $lte: getLteDateTime(date_lte),
    };
  }

  let timeString;

  if (time_gte && time_lte) {
    timeString = { $gte: `${time_gte}:00`, $lte: `${time_lte}:00` };
  }

  return _.pickBy({ camera: cameraId, type, createType, date: dateRange, timeString }, _.identity);
};

//

export default class FileRepository {
  async create(payload) {
    const file = new File(payload);
    await file.save();
    return file;
  }

  async find(where, projection = null, options = null) {
    const filter = makeFilter(where);
    const files = await File.find(filter, projection, options).sort({ _id: 1 });
    return files;
  }

  async findOne(where, projection = null, options = null) {
    const filter = makeFilter(where);
    const file = await File.findOne(filter, projection, options);
    return file;
  }

  async findOneById(id, projection = null, options = null) {
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

  async deleteMany(where) {
    const deleted = await File.deleteMany(where);
    return deleted;
  }

  //

  async countDocuments(where) {
    const filter = makeFilter(where);
    const total = await File.countDocuments(filter);
    return total;
  }

  async countsDocumentsByDates(where) {
    const { cameraId, type } = where;

    const match = _.pickBy(
      {
        camera: new ObjectId(cameraId),
        type: type || 'photo',
      },
      _.identity,
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
