import { makeDateName } from '../utils/utils.js';

export const createDateInfo = async (container, { logger, userId, cameraId }) => {
  // const { cameraService, weatherService, dateInfoService } = services;

  const weatherService = container.weatherService;
  const cameraService = container.cameraService;
  const dateInfoService = container.dateInfoService;

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

export const getDateInfo = async (container, { logger, userId, cameraId }) => {
  // const { dateInfoService } = services;

  const dateInfoService = container.dateInfoService;

  const currentDateName = makeDateName(new Date());

  const dateInfo = await dateInfoService.getOne({
    logger,
    userId,
    cameraId,
    name: currentDateName,
  });

  return dateInfo;
};

export default async (container, { logger, userId, cameraId }) => {
  const dateInfo = await getDateInfo(container, { logger, userId, cameraId });

  if (dateInfo) {
    return dateInfo;
  }

  const newDateInfo = await createDateInfo(container, { logger, userId, cameraId });
  return newDateInfo;
};
