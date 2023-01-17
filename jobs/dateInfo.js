// import cameraService from '../services/camera.service.js';
import dateInfoService from '../services/dateInfo.service.js';
import weatherApiService from '../services/weatherApi.service.js';
import { makeDateName } from '../utils/utils.js';

export const createDateInfo = async ({ logger, userId, cameraId }) => {
  // const camera = await cameraService.getOneById({ cameraId });
  // console.log(1111, camera);
  const location = [55.970962, 37.17985]; // from camera.location
  const metaData = await weatherApiService.getCurrentDateWeather({ location });
  // console.log(99999, metaData);

  if (!metaData) {
    return;
  }

  const currentDateName = makeDateName(new Date());
  const dateInfo = await dateInfoService.createOne({
    logger,
    user: userId,
    camera: cameraId,
    name: currentDateName,
    weather: metaData,
  });

  return dateInfo;
};

export const getDateInfo = async ({ logger, userId, cameraId }) => {
  const currentDateName = makeDateName(new Date());
  const dateInfo = await dateInfoService.getOne({
    logger,
    userId,
    cameraId,
    name: currentDateName,
  });

  return dateInfo;
};
