import { makeDateString } from '../utils/index.js';

export default async ({ services, logger, userId, cameraId }) => {
  const { cameraService, weatherService, dateInfoService } = services;

  const currentDateName = makeDateString(new Date());

  const existingDateInfo = await dateInfoService.getOne({
    logger,
    userId,
    cameraId,
    name: currentDateName,
  });

  if (existingDateInfo) {
    return existingDateInfo;
  }

  const camera = await cameraService.getOneById({ cameraId });
  const { location } = camera;
  const { latitude, longitude } = location;
  const isLocationExist = latitude && longitude;

  if (!isLocationExist) {
    return null;
  }

  const metaData = await weatherService.getCurrentDateWeather([latitude, longitude]);

  if (!metaData) {
    return null;
  }

  const newDateInfo = await dateInfoService.createOne({
    logger,
    userId,
    cameraId,
    name: currentDateName,
    weather: metaData,
  });

  return newDateInfo;
};
