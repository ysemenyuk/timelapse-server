import cameraService from '../../services/camera.service.js';
import dateInfoService from '../../services/dateInfo.service.js';
import weatherService from '../../services/weather.service.js';
import { makeDateName } from '../../utils/utils.js';

export const createDateInfo = async ({ logger, userId, cameraId }) => {
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

export default async ({ logger, userId, cameraId }) => {
  let dateInfo = await getDateInfo({ logger, userId, cameraId });
  if (!dateInfo) {
    dateInfo = await createDateInfo({ logger, userId, cameraId });
  }
  return dateInfo;
};
