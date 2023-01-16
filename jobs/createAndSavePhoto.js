import fileService from '../services/file.service.js';
import cameraService from '../services/camera.service.js';
import cameraApi from '../services/cameraApi.service.js';
import { makePhotoName } from '../utils/index.js';
import { fileType, type } from '../utils/constants.js';

const createAndSavePhoto = async ({ logger, userId, cameraId, taskId, create, photoSettings }) => {
  // const currentDateName = makeCurrentDateName(date);

  // const dateInfo = await dateInfoService.getOne({
  //   logger,
  //   user: userId,
  //   camera: cameraId,
  //   name: currentDateName,
  // });

  // if (!dateInfo) {
  //   const mataData = weatherService.getCurrentDateWeather()
  //   await dateInfoService.createOne({
  //     logger,
  //     user: userId,
  //     camera: cameraId,
  //     name: currentDateName,
  //     metaData,
  //   });
  // }

  const camera = await cameraService.getOneById({ cameraId });
  const url = photoSettings.photoUrl || camera.photoUrl;

  const fileData = await cameraApi.getPhotoByHttpRequest(url, 'arraybuffer');

  const date = new Date();
  const fileName = makePhotoName(date);

  const photo = await fileService.createFile({
    logger,
    date,
    user: userId,
    camera: cameraId,
    task: taskId,
    name: fileName,
    type: type.PHOTO,
    fileType: fileType.IMAGE_JPG,
    createType: create,
    data: fileData,
    metaData: {
      photoUrl: url,
    },
  });

  return photo;
};

export default createAndSavePhoto;
