import DateInfo from '../models/DateInfo.js';

// get

const getAll = async ({ cameraId, logger }) => {
  logger && logger(`DateInfoService.getAll`);

  const datesInfo = await DateInfo.find({ camera: cameraId });
  return datesInfo;
};

const getOne = async ({ logger, cameraId, name }) => {
  logger && logger(`DateInfoService.getOne`);

  // console.log('dateInfo name', name);

  const dateInfo = await DateInfo.findOne({ camera: cameraId, name });
  return dateInfo;
};

const createOne = async ({ logger, userId, cameraId, ...payload }) => {
  logger && logger(`DateInfoService.createOne`);

  const dateInfo = new DateInfo({
    user: userId,
    camera: cameraId,
    ...payload,
  });

  await dateInfo.save();
  console.log(5555, dateInfo);
  return dateInfo;
};

export default {
  getAll,
  getOne,
  createOne,
};
