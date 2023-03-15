import Task from '../models/Task.js';

export default class TaskRepository {
  async create(payload) {
    const task = new Task(payload);
    await task.save();
    return task;
  }

  async find(filter) {
    const tasks = await Task.find(filter);
    return tasks;
  }

  async findOneById(id) {
    const task = await Task.findOne({ _id: id });
    return task;
  }

  async updateOneById(id, payload) {
    const task = await Task.findOneAndUpdate({ _id: id }, payload, { new: true });
    return task;
  }

  async deleteOneById(id) {
    const deleted = await Task.findOneAndRemove({ _id: id });
    return deleted;
  }

  async deleteMany(conditions) {
    const deleted = await Task.deleteMany(conditions);
    return deleted;
  }
}
