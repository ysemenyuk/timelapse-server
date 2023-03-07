import DateInfo from '../models/DateInfo.js';

// create

const create = async (payload) => {
  const dateInfo = new DateInfo(payload);
  await dateInfo.save();
  return dateInfo;
};

// find

const find = async (filter) => {
  const datesInfo = await DateInfo.find(filter);
  return datesInfo;
};

const findOne = async (filter) => {
  const dateInfo = await DateInfo.findOne(filter);
  return dateInfo;
};

const findOneById = async (id) => {
  const dateInfo = await DateInfo.findOne({ _id: id });
  return dateInfo;
};

// update

const updateOneById = async (id, payload) => {
  const dateInfo = await DateInfo.findOneAndUpdate({ _id: id }, payload, { new: true });
  return dateInfo;
};

// delete

const deleteOneById = async (id) => {
  const deleted = await DateInfo.findOneAndRemove({ _id: id });
  return deleted;
};

export default {
  create,
  find,
  findOne,
  findOneById,
  updateOneById,
  deleteOneById,
};
