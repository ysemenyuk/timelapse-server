import { makeDateName, makePhotoFileName, makeTimeName } from '../utils/utils.js';
import { fileType, type } from '../utils/constants.js';

const createAndSavePhoto = async (container, { logger, userId, cameraId, taskId, settings, createType }) => {
  const httpService = container.httpService;
  const cameraService = container.cameraService;
  const fileService = container.fileService;
  // const urlValidator = container.urlValidator;

  const camera = await cameraService.getOneById({ cameraId });
  const url = settings.photoUrl || camera.photoUrl;

  // await urlValidator.validateUrl(url);

  const bufferData = await httpService.getData(url, { responseType: 'arraybuffer' });

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
    createType: createType,

    photoFileData: {
      photoUrl: url,
    },

    data: bufferData,
  });

  return photo;
};

export default createAndSavePhoto;
