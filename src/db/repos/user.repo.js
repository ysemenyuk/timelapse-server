import User from '../models/User.js';

// create

const create = async (payload) => {
  const task = new User(payload);
  await task.save();
  return task;
};

// find

const find = async (filter) => {
  const tasks = await User.find(filter);
  return tasks;
};

const findOne = async (filter) => {
  const task = await User.findOne(filter);
  return task;
};

const findOneById = async (id) => {
  const task = await User.findOne({ _id: id });
  return task;
};

// update

const updateOneById = async (id, payload) => {
  const task = await User.findOneAndUpdate({ _id: id }, payload, { new: true });
  return task;
};

// delete

const deleteOneById = async (id) => {
  const deleted = await User.findOneAndRemove({ _id: id });
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
