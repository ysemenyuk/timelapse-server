// import cameraService from '../services/camera.service.js';
import cameraService from '../services/camera.service.js';
import dateInfoService from '../services/dateInfo.service.js';
import weatherApiService from '../services/weatherApi.service.js';
import { makeDateName } from '../utils/utils.js';

export const createDateInfo = async ({ logger, userId, cameraId }) => {
  const camera = await cameraService.getOneById({ cameraId });
  const { location } = camera;
  const { latitude, longitude } = location;
  const isLocationExist = latitude && longitude;

  if (!isLocationExist) {
    return;
  }

  const metaData = await weatherApiService.getCurrentDateWeather([latitude, longitude]);

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
