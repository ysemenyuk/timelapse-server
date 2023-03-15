import DateInfo from '../models/DateInfo.js';

export default class DateInfoRepository {
  async create(payload) {
    const dateInfo = new DateInfo(payload);
    await dateInfo.save();
    return dateInfo;
  }

  async find(filter) {
    const datesInfo = await DateInfo.find(filter);
    return datesInfo;
  }

  async findOne(filter) {
    const dateInfo = await DateInfo.findOne(filter);
    return dateInfo;
  }

  async findOneById(id) {
    const dateInfo = await DateInfo.findOne({ _id: id });
    return dateInfo;
  }

  async updateOneById(id, payload) {
    const dateInfo = await DateInfo.findOneAndUpdate({ _id: id }, payload, { new: true });
    return dateInfo;
  }

  async deleteOneById(id) {
    const deleted = await DateInfo.findOneAndRemove({ _id: id });
    return deleted;
  }
}
