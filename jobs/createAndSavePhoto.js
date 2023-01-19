import fileService from '../services/file.service.js';
import cameraService from '../services/camera.service.js';
import cameraApi from '../services/cameraApi.service.js';
import { makePhotoFileName } from '../utils/utils.js';
import { fileType, type } from '../utils/constants.js';

const createAndSavePhoto = async ({ logger, userId, cameraId, taskId, photoSettings, create }) => {
  const camera = await cameraService.getOneById({ cameraId });
  const url = photoSettings.photoUrl || camera.photoUrl;

  const bufferData = await cameraApi.getPhotoByHttpRequest(url, 'arraybuffer');

  const date = new Date();
  // console.log(111, new Date());
  // console.log(222, new Date());

  const photoFileName = makePhotoFileName(date);

  const photo = await fileService.createFile({
    logger,
    date,
    user: userId,
    camera: cameraId,
    task: taskId,
    name: photoFileName,
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
