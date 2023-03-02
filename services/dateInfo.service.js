import DateInfo from '../db/models/DateInfo.js';

// get

const getAll = async ({ cameraId, logger }) => {
  logger && logger(`dateInfoService.getAll`);

  const datesInfo = await DateInfo.find({ camera: cameraId });
  return datesInfo;
};

const getOne = async ({ logger, cameraId, name }) => {
  logger && logger(`dateInfoService.getOne ${name}`);

  const dateInfo = await DateInfo.findOne({ camera: cameraId, name });
  return dateInfo;
};

const createOne = async ({ logger, userId, cameraId, ...payload }) => {
  logger && logger(`dateInfoService.createOne`);

  const dateInfo = new DateInfo({
    user: userId,
    camera: cameraId,
    ...payload,
  });

  await dateInfo.save();
  return dateInfo;
};

export default {
  getAll,
  getOne,
  createOne,
};
