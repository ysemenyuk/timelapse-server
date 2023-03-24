import { makeDateString, makePhotoFileName, makeTimeString } from '../utils/index.js';
import { fileType, type } from '../utils/constants.js';

export default async ({ services, logger, userId, cameraId, taskId, createType, photoSettings }) => {
  const { httpService, fileService, cameraService } = services;

  const camera = await cameraService.getOneById({ logger, cameraId });

  const url = photoSettings.photoUrl || camera.photoUrl;

  const bufferData = await httpService.getData(url, { responseType: 'arraybuffer' });

  const date = new Date();

  const photo = await fileService.createFile({
    logger,
    data: bufferData,
    payload: {
      date,
      user: userId,
      camera: cameraId,
      task: taskId,

      name: makePhotoFileName(date),
      dateString: makeDateString(date),
      timeString: makeTimeString(date),

      type: type.PHOTO,
      fileType: fileType.IMAGE_JPG,
      createType: createType,

      photoFileData: {
        photoUrl: url,
      },
    },
  });

  return photo;
};
