import User from '../models/User.js';

// create

const create = async (payload) => {
  const user = new User(payload);
  await user.save();
  return user;
};

// find

const find = async (filter, projection, options) => {
  const users = await User.find(filter, projection, options);
  return users;
};

const findOne = async (filter, projection, options) => {
  const user = await User.findOne(filter, projection, options);
  return user;
};

const findOneById = async (id, projection, options) => {
  const user = await User.findOne({ _id: id }, projection, options);
  return user;
};

// update

const updateOneById = async (id, payload) => {
  const user = await User.findOneAndUpdate({ _id: id }, payload, { new: true });
  return user;
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
