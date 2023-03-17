import { makeDateName, makePhotoFileName, makeTimeName } from '../utils/index.js';
import { fileType, type } from '../utils/constants.js';

export default async ({ services, logger, userId, cameraId, taskId, photoSettings, createType }) => {
  const { cameraService, httpService, fileService } = services;

  const camera = await cameraService.getOneById({ cameraId });
  const url = photoSettings.photoUrl || camera.photoUrl;

  // await validatorService.validateUrl(url);

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
      dateString: makeDateName(date),
      timeString: makeTimeName(date),

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
