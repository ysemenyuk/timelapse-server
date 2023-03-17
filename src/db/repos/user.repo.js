import User from '../models/User.js';

class UserRepo {
  async create(payload) {
    const user = new User(payload);
    await user.save();
    return user;
  }

  async find(filter, projection, options) {
    const users = await User.find(filter, projection, options);
    return users;
  }

  async findOne(filter, projection, options) {
    const user = await User.findOne(filter, projection, options);
    return user;
  }

  async findOneById(id, projection, options) {
    const user = await User.findOne({ _id: id }, projection, options);
    return user;
  }

  async updateOneById(id, payload) {
    const user = await User.findOneAndUpdate({ _id: id }, payload, { new: true });
    return user;
  }

  async deleteOneById(id) {
    const deleted = await User.findOneAndRemove({ _id: id });
    return deleted;
  }
}

export default new UserRepo();
