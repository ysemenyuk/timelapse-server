// import fileService from '../../services/file.service.js';
// import cameraService from '../../services/camera.service.js';
// import httpService from '../../services/cameraApi.service.js';
import { makeDateName, makePhotoFileName, makeTimeName } from '../utils/utils.js';
import { fileType, type } from '../utils/constants.js';
import urlValidator from '../validators/index.js';

const createAndSavePhoto = async ({ services, logger, userId, cameraId, taskId, settings, create }) => {
  const { httpService, cameraService, fileService } = services;

  const camera = await cameraService.getOneById({ cameraId });
  const url = settings.photoUrl || camera.photoUrl;

  await urlValidator.validateUrl(url);

  const bufferData = await httpService.getData(url, 'arraybuffer');

  const date = new Date();

  const photo = await fileService.createFile({
    logger,
    date,
    user: userId,
    camera: cameraId,
    task: taskId,

    name: makePhotoFileName(date),
    dateString: makeDateName(date),
    timeString: makeTimeName(date),

    type: type.PHOTO,
    fileType: fileType.IMAGE_JPG,
    createType: create,

    photoFileData: {
      photoUrl: url,
    },

    data: bufferData,
  });

  return photo;
};

export default createAndSavePhoto;
