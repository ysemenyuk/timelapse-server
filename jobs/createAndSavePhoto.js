import fileService from '../services/file.service.js';
import cameraService from '../services/camera.service.js';
import cameraApi from '../services/cameraApi.service.js';
import { makePhotoName } from '../utils/utils.js';
import { fileType, type } from '../utils/constants.js';

const createAndSavePhoto = async ({ logger, userId, cameraId, taskId, photoSettings, create }) => {
  const camera = await cameraService.getOneById({ cameraId });
  const url = photoSettings.photoUrl || camera.photoUrl;

  const bufferData = await cameraApi.getPhotoByHttpRequest(url, 'arraybuffer');

  const date = new Date();
  const photoName = makePhotoName(date);

  const photo = await fileService.createFile({
    logger,
    data: bufferData,
    date,
    user: userId,
    camera: cameraId,
    task: taskId,
    name: photoName,
    type: type.PHOTO,
    fileType: fileType.IMAGE_JPG,
    createType: create,
    metaData: {
      photoUrl: url,
    },
  });

  return photo;
};

export default createAndSavePhoto;
