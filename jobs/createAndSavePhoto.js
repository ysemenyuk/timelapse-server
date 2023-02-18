import fileService from '../services/file.service.js';
import cameraService from '../services/camera.service.js';
import cameraApi from '../services/cameraApi.service.js';
import { makeDateName, makePhotoFileName, makeTimeName } from '../utils/utils.js';
import { fileType, type } from '../utils/constants.js';
import { validatePhotoUrl } from '../validators/photoUrl.validator.yup.js';

const createAndSavePhoto = async ({ logger, userId, cameraId, taskId, photoSettings, create }) => {
  const camera = await cameraService.getOneById({ cameraId });
  const url = photoSettings.photoUrl || camera.photoUrl;

  await validatePhotoUrl(url);

  const bufferData = await cameraApi.getPhotoByHttpRequest(url, 'arraybuffer');

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
