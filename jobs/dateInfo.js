// import cameraService from '../services/camera.service.js';
import dateInfoService from '../services/dateInfo.service.js';
import weatherApiService from '../services/weatherApi.service.js';
import { makeCurrentDateName } from '../utils/index.js';

export const createDateInfoIfNotExist = async ({ logger, userId, cameraId }) => {
  const currentDateName = makeCurrentDateName(new Date());
  // const camera = await cameraService.getOneById({ cameraId });
  // console.log(1111, camera);

  const dateInfo = await dateInfoService.getOne({
    logger,
    userId,
    cameraId,
    name: currentDateName,
  });

  const location = [55.970962, 37.17985]; // from camera

  if (!dateInfo) {
    const metaData = await weatherApiService.getCurrentDateWeather({ location });
    // console.log(99999, metaData);

    if (!metaData) {
      return;
    }

    await dateInfoService.createOne({
      logger,
      user: userId,
      camera: cameraId,
      name: currentDateName,
      weather: metaData,
    });
  }
};

export const getDateInfo = async ({ logger, userId, cameraId }) => {
  const currentDateName = makeCurrentDateName(new Date());
  const dateInfo = await dateInfoService.getOne({
    logger,
    userId,
    cameraId,
    name: currentDateName,
  });

  return dateInfo;
};
