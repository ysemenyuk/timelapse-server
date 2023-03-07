import User from '../mongodb/models/User.js';

// create

const create = async (payload) => {
  const user = new User(payload);
  await user.save();
  return user;
};

// find

const find = async (filter, fields = null) => {
  const users = await User.find(filter, fields);
  return users;
};

const findOne = async (filter, fields = null) => {
  const user = await User.findOne(filter, fields);
  return user;
};

const findOneById = async (id, fields = null) => {
  const user = await User.findOne({ _id: id }, fields);
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
