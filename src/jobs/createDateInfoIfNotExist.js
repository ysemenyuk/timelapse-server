import { makeDateName } from '../utils/utils.js';

export const createDateInfo = async ({ services, logger, userId, cameraId }) => {
  const { cameraService, weatherService, dateInfoService } = services;

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

  const currentDateName = makeDateName(new Date());

  const dateInfo = await dateInfoService.createOne({
    logger,
    userId,
    cameraId,
    name: currentDateName,
    weather: metaData,
  });

  return dateInfo;
};

export const getDateInfo = async ({ services, logger, userId, cameraId }) => {
  const { dateInfoService } = services;

  const currentDateName = makeDateName(new Date());

  const dateInfo = await dateInfoService.getOne({
    logger,
    userId,
    cameraId,
    name: currentDateName,
  });

  return dateInfo;
};

export default async ({ services, logger, userId, cameraId }) => {
  const dateInfo = await getDateInfo({ services, logger, userId, cameraId });

  if (dateInfo) {
    return dateInfo;
  }

  const newDateInfo = await createDateInfo({ services, logger, userId, cameraId });
  return newDateInfo;
};
