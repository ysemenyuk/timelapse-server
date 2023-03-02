import Task from '../models/Task.js';

// create

const createOne = async (payload) => {
  const task = new Task(payload);
  await task.save();
  return task;
};

// find

const find = async (filter) => {
  const tasks = await Task.find(filter);
  return tasks;
};

const findOneById = async (id) => {
  const task = await Task.findOne({ _id: id });
  return task;
};

// update

const updateOneById = async (id, payload) => {
  const task = await Task.findOneAndUpdate({ _id: id }, payload, { new: true });
  return task;
};

// delete

const deleteOneById = async (id) => {
  const deleted = await Task.findOneAndRemove({ _id: id });
  return deleted;
};

const deleteMany = async (conditions) => {
  const deleted = await Task.deleteMany(conditions);
  return deleted;
};

export default {
  createOne,
  find,
  findOneById,
  updateOneById,
  deleteOneById,
  deleteMany,
};
